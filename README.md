# Mahesh Portfolio and GitHub-Verified Task Tracker

This monorepo contains Mahesh Raskar's React portfolio and a daily task application whose coding
tasks can only be completed after the Python backend verifies GitHub evidence. The frontend never
sends or controls a verified completion status.

## Architecture

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS, React Router, and Framer Motion.
- **API:** Python 3.12+, FastAPI, Pydantic v2, secure JWT cookies, and Argon2 password hashes.
- **Persistence:** PostgreSQL, SQLAlchemy 2 async sessions using `psycopg`, and Alembic migrations.
- **GitHub:** GitHub App OAuth/installations, encrypted tokens, `httpx`, signed webhooks, delivery
  idempotency, and persisted verification attempts.

The `/tasks` route provides registration, login, today's tasks, history, task creation, repository
selection, verification status, and profile/GitHub connection details while retaining the
portfolio's existing visual language.

```text
.
|-- backend/
|   |-- alembic/versions/       # versioned PostgreSQL migrations
|   |-- app/
|   |   |-- api/routes/         # auth, task, GitHub, and webhook endpoints
|   |   |-- core/               # configuration, database, security, logging
|   |   |-- models/             # SQLAlchemy entities
|   |   |-- schemas/            # Pydantic request/response models
|   |   `-- services/           # application and verification logic
|   |-- tests/
|   |-- Dockerfile
|   `-- pyproject.toml
|-- src/                        # existing portfolio and task-tracker frontend
|-- docker-compose.yml
`-- .github/workflows/ci.yml
```

## Verification behavior

Task codes are generated from a PostgreSQL sequence (`TASK-0001`, `TASK-0002`, ...). Codes are
detected in branch names, commit messages, pull-request titles, and pull-request bodies.

- `PUSH` requires a matching push with actual changed files.
- `MERGED_PULL_REQUEST` requires a merged matching PR into the configured target branch.
- `MERGED_PULL_REQUEST_WITH_TESTS` additionally requires completed successful GitHub checks and is
  the default for coding and bug-fix tasks.
- `MANUAL` is restricted to non-coding tasks and is displayed as manual, never GitHub-verified.

Every GitHub decision checks the signature, unique delivery ID, task creation time, authenticated
GitHub actor ID, installation-authorized repository, required target branch, changed files, merge
state, and checks. Evidence and failures are stored in `verification_attempts`.

## Requirements

- Python 3.12+
- PostgreSQL 15+ (the Compose setup uses PostgreSQL 17)
- Node.js 24+ and npm
- A GitHub App for live verification

## Local setup

Start PostgreSQL with development-only credentials:

```bash
docker compose up -d postgres
```

Create the backend environment:

```bash
cd backend
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```cmd
.venv\Scripts\activate.bat
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Then install, migrate, and run:

```bash
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

In another terminal:

```bash
npm install
npm run dev
```

Open the portfolio at `http://localhost:5173`, the tracker at
`http://localhost:5173/tasks`, and FastAPI docs at `http://localhost:8000/docs`.

To run the database and backend together, copy `backend/.env.example` to `backend/.env`, configure
it, and run:

```bash
docker compose up --build
```

## Environment variables

Never commit `.env` files, OAuth secrets, webhook secrets, or private keys. Templates are provided
in `.env.example` and `backend/.env.example`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `postgresql+psycopg://...` async-compatible SQLAlchemy URL |
| `JWT_SECRET` | Random secret of at least 32 characters |
| `JWT_ACCESS_TOKEN_MINUTES` | Short cookie/token lifetime; default 15 |
| `COOKIE_NAME`, `COOKIE_DOMAIN` | Authentication cookie configuration |
| `ENCRYPTION_KEY` | Fernet key used to encrypt GitHub tokens; required in production |
| `FRONTEND_URL`, `BACKEND_URL` | Public application URLs |
| `ALLOWED_ORIGINS` | Comma-separated exact CORS origins |
| `GITHUB_APP_ID` | GitHub App identifier |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | OAuth credentials |
| `GITHUB_PRIVATE_KEY` | App private key where installation-token flows require it |
| `GITHUB_WEBHOOK_SECRET` | High-entropy webhook signing secret |
| `GITHUB_CALLBACK_URL` | `/api/v1/github/callback` public URL |
| `VITE_API_URL` | Browser-visible FastAPI origin |

In production, cookies automatically use `Secure`, remain `HttpOnly`, use `SameSite=Lax`, and have
an explicit lifetime. Configure `COOKIE_DOMAIN` only when frontend/backend domain topology needs it.

## Database and Alembic

The initial migration creates:

- `users`
- `github_connections`
- `repositories` with per-user repository uniqueness constraints
- `tasks` plus `task_code_seq` and PostgreSQL enums
- `github_deliveries` with a unique delivery ID
- `verification_attempts` with JSONB metadata

Production startup uses migrations, never `Base.metadata.create_all()`.

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
alembic downgrade -1
```

## GitHub App configuration

Create a GitHub App under **Settings → Developer settings → GitHub Apps**:

1. Set the homepage URL to the frontend URL.
2. Set the callback URL to `http://localhost:8000/api/v1/github/callback` locally.
3. Enable webhooks and set the webhook URL to
   `https://YOUR-BACKEND/api/webhooks/github`.
4. Generate a strong webhook secret and put the same value in `GITHUB_WEBHOOK_SECRET`.
5. Give repository permissions: **Metadata: Read**, **Contents: Read**, **Pull requests: Read**,
   and **Checks: Read**.
6. Subscribe to `push`, `pull_request`, `check_run`/`check_suite`, and installation events.
7. Install the App only on repositories users may select.
8. Copy the App ID, OAuth client ID/secret, and generated private key into the backend environment.

Tokens are encrypted at rest and never returned to the browser. The current connection flow uses
the authenticated user's first available installation; organizations with multiple installations
may need an installation-picker enhancement.

### Local webhook testing

GitHub must reach a public HTTPS URL. Use a trusted tunnel (for example, GitHub CLI's development
forwarding or another tunnel provider), update the App webhook URL, and preserve the exact signing
secret. You can redeliver events from the App's **Advanced → Recent deliveries** page. Do not paste
production secrets into shell history or request logs.

## Tests and quality

Backend:

```bash
cd backend
ruff check .
ruff format --check .
mypy app
pytest
```

Integration tests intentionally require an isolated migrated PostgreSQL database:

```bash
alembic upgrade head
RUN_POSTGRES_TESTS=1 pytest
```

PowerShell:

```powershell
$env:RUN_POSTGRES_TESTS = "1"
pytest
```

Frontend:

```bash
npm run lint
npm test
npm run build
```

CI starts PostgreSQL, applies migrations, runs all backend and frontend checks, and builds the
backend Docker image.

## API overview

Authentication: `/api/v1/auth/register`, `/login`, `/logout`, `/me`.

Tasks: `/api/v1/tasks`, `/today`, `/{id}`, `/{id}/start`, `/{id}/verify`,
`/{id}/manual-complete`.

GitHub: `/api/v1/github/connect`, `/callback`, `/status`, `/repositories`, `/disconnect`.

Webhook: `POST /api/webhooks/github`.

## Troubleshooting

- **CORS/cookies:** frontend origin must exactly match `ALLOWED_ORIGINS`; requests must include
  credentials. HTTPS is required for production secure cookies.
- **GitHub callback rejected:** confirm callback URL and that the OAuth state cookie survives the
  redirect.
- **No repositories:** install the GitHub App on at least one repository and grant the minimum
  permissions above.
- **Verification fails:** check task creation time, actor account, repository, target branch,
  changed files, merge status, and completed check conclusions. The task's verification message
  and persisted attempt explain the rejected condition.
- **Webhook 401:** the raw payload and `X-Hub-Signature-256` must be signed using the exact configured
  secret.
- **Database connection:** wait for the Compose health check, then verify host, port, credentials,
  and database name in `DATABASE_URL`.
