# Mahesh Raskar — Developer Portfolio

An interactive macOS-inspired portfolio built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Features

- Interactive desktop, application windows, dock, Launchpad, and Spotlight search
- About, Projects, Skills, Experience, Certifications, GitHub, Terminal, Contact, and Resume apps
- Functional window controls, dragging, resizing, minimizing, maximizing, and restoration
- Five original photographic wallpapers with a desktop context-menu picker
- Responsive full-screen application panels on mobile
- EmailJS-powered contact form and static resume download

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

## Contact configuration

The contact form uses EmailJS. Add these values to `.env.local` when message delivery is required:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Without these variables, the rest of the portfolio remains fully functional and the contact form displays a configuration message.

## Deployment

Deploy the generated `dist` directory after running `npm run build`. The portfolio is frontend-only and does not require Python, PostgreSQL, Docker, or a separate API service.
