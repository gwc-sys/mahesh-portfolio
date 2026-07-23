import { FaEnvelope, FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import type { SocialLink } from '../types';

export const personalInfo = {
  name: 'Mahesh',
  role: 'Full Stack Developer',
  location: 'India',
  email: 'mahesh@example.com',
  resumeUrl: '/resume.pdf',
  headline:
    'I design and build polished web applications with React, TypeScript, cloud services, and pragmatic product thinking.',
  objective:
    'To contribute to ambitious product teams as a full stack developer, building reliable user experiences, scalable APIs, and cloud-ready systems that solve real problems.',
  about:
    'I am a full stack developer focused on clean frontend architecture, dependable backend services, and thoughtful user experience. My work combines React, TypeScript, Python APIs, Firebase, Azure, and modern delivery practices.',
  education:
    'Computer Science focused education with hands-on experience across web engineering, cloud foundations, machine learning foundations, and IoT-enabled application workflows.',
  experienceSummary:
    'Experience building academic, prototype, and production-style applications that combine responsive interfaces, API integration, authentication, maps, databases, and deployment-ready code.',
  skillsSummary:
    'Frontend-heavy full stack profile with strength in React, TypeScript, Tailwind CSS, Django, FastAPI, Firebase, Azure MySQL, and collaborative tooling.',
  typingRoles: [
    'React Developer',
    'TypeScript Engineer',
    'Backend API Builder',
    'Cloud Learner',
    'Product-Minded Coder',
  ],
};

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: FaLinkedinIn,
  },
  {
    label: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: FaEnvelope,
  },
];

