# Mahesh Raskar Portfolio

The source for [gwc-sys.online](https://gwc-sys.online), a responsive portfolio for Mahesh Raskar featuring verified
GitHub projects, professional experience, education, certifications, research, skills, and contact information.

## Stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 3
- Framer Motion
- React Router
- React Icons
- EmailJS

## Features

- Responsive hero, about, skills, projects, experience, credentials, contact, and footer sections
- Verified links to the `gwc-sys` GitHub profile and public repositories
- Light and dark themes with local-storage persistence
- Accessible navigation, scroll progress, motion effects, and route handling
- Validated EmailJS contact form
- SEO metadata, Open Graph image, web manifest, favicon, and robots file
- Production deployment on Render with a custom domain

## Project structure

```text
src/
|-- animations/
|-- assets/images/
|-- components/
|   |-- common/
|   |-- layout/
|   `-- sections/
|-- data/
|-- hooks/
|-- layouts/
|-- pages/
|-- services/
|-- styles/
|-- types/
|-- utils/
|-- App.tsx
`-- main.tsx
```

## Local development

```bash
npm install
npm run dev
```

On Windows PowerShell systems that block `npm.ps1`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

The production bundle is generated in `dist/`.

## EmailJS configuration

Copy `.env.example` to `.env.local` and provide:

```text
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The EmailJS template should accept `from_name`, `from_email`, `subject`, and `message`.

## Render deployment

Create a **Static Site** connected to `gwc-sys/mahesh-portfolio` and use:

```text
Branch: main
Root Directory: leave empty
Build Command: npm ci && npm run build
Publish Directory: dist
```

For React Router, add this Render rewrite:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

The custom domain configuration is:

```text
A      @      216.24.57.1
CNAME  www    mahesh-portfolio-00r8.onrender.com
```

Render provisions and renews HTTPS automatically after domain verification.

## Content sources

- Personal and social links: `src/data/personal.ts`
- GitHub-audited skills: `src/data/skills.ts`
- Featured repositories: `src/data/projects.ts`
- Professional experience: `src/data/experience.ts`
- Credentials and publication: `src/data/certifications.ts`
- Resume: `public/resume.pdf`
