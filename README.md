# Mahesh Raskar — Developer Portfolio

An interactive macOS-inspired portfolio built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Interactive desktop, application windows, dock, Launchpad, and Spotlight search
- About, Projects, Skills, Experience, Certifications, GitHub, Terminal, Contact, and Resume apps
- Functional window controls, dragging, resizing, minimizing, maximizing, and restoration
- Five original photographic wallpapers with a desktop context-menu picker
- Responsive full-screen application panels on mobile
- Email-composer contact form and static resume download

## Development

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:5173`.

## Production checks

```bash
npm run lint
npm run build
```

## Contact

The validated contact form opens the visitor's email application with the recipient, subject, and message already filled in. It uses `mailto:mahesh-raskar@outlook.com` and requires no API keys, environment variables, or backend.

## Deployment

The GitHub Actions workflow validates every pull request and main-branch push, then stores the production `dist` artifact. Render can deploy automatically from the connected Git repository. To trigger Render explicitly from GitHub Actions, add its deploy hook as the `RENDER_DEPLOY_HOOK_URL` repository secret.

The portfolio is frontend-only and does not require Python, PostgreSQL, Docker, or a separate API service.
