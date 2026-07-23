# Mahesh Modern Portfolio

A premium responsive developer portfolio built with React, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion, React Icons, and EmailJS.

## Features

- Responsive hero, about, skills, projects, experience, certifications, contact, and footer sections
- Dark and light theme with local storage persistence
- Framer Motion page transitions, scroll reveal, hover states, stagger effects, and progress bar
- Animated typing effect in the hero section
- EmailJS contact form with client-side validation
- Active navigation highlighting and smooth scrolling
- Local generated image assets for the hero, projects, and Open Graph preview
- SEO-friendly HTML metadata, manifest, and robots file

## Folder Structure

```txt
src/
├── assets/
│   └── images/
├── animations/
├── components/
│   ├── common/
│   ├── layout/
│   └── sections/
├── data/
├── hooks/
├── layouts/
├── pages/
├── services/
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## Getting Started

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## EmailJS Setup

1. Create an EmailJS account and add an email service.
2. Create an EmailJS template with these variables:
   - `from_name`
   - `from_email`
   - `subject`
   - `message`
3. Copy `.env.example` to `.env.local`.
4. Fill in:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Restart the dev server after changing environment variables.

## Personalization

- Update profile copy and social links in `src/data/personal.ts`.
- Update skills in `src/data/skills.ts`.
- Update projects in `src/data/projects.ts`.
- Replace `public/resume.pdf` with your final resume.
- Replace generated images in `src/assets/images/` with real screenshots or portraits when available.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Set the framework preset to `Vite`.
4. Use `npm run build` as the build command.
5. Use `dist` as the output directory.
6. Add EmailJS variables in Project Settings > Environment Variables.
7. Deploy.

## Deploy to Netlify

1. Push the project to GitHub.
2. Create a new Netlify site from the repository.
3. Use `npm run build` as the build command.
4. Use `dist` as the publish directory.
5. Add EmailJS variables in Site Configuration > Environment Variables.
6. Deploy.

