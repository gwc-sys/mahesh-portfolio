import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import type { SocialLink } from '../types';

export const personalInfo = {
  name: 'Mahesh Raskar',
  role: 'Full-Stack Developer | AI & Data Builder',
  location: 'Pune, Maharashtra, India',
  email: 'mahesh-raskar@outlook.com',
  resumeUrl: '/resume.pdf',
  headline:
    'I build AI-powered applications, scalable data systems, secure APIs, and cloud-ready products that turn real-world problems into useful software.',
  objective:
    'To build production-ready AI and data products where intelligent services, reliable pipelines, cloud infrastructure, APIs, and thoughtful user experiences work as one complete system.',
  about:
    'I am a full-stack developer from Pune with hands-on experience building responsive web and mobile applications, REST APIs, authentication workflows, cloud deployments, and data-driven products. I also explore AI, machine learning, IoT, and location-aware systems.',
  education:
    'Bachelor of Engineering in Electronics and Telecommunication Engineering at K J College of Engineering & Management Research (2023–present). Diploma in Computer Engineering from Marathwada Mitra Mandal’s College of Engineering (80%, completed 2023), Higher Secondary Education at Adarsh Shikshan Sanstha College of Commerce and Science (2017–2019), and SSC from New English School (77%, completed 2016).',
  experienceSummary:
    'Completed a Full-Stack Developer internship at Hruta Solutions in Pune and continue building public projects that combine React, APIs, authentication, databases, cloud deployment, machine learning, maps, and IoT workflows.',
  skillsSummary:
    'Public work spans React, Vite, TypeScript, Tailwind CSS, Express, FastAPI, Django, React Native, Firebase, Appwrite, MongoDB, Python ML, Git, and GitHub Actions.',
  languagesAndInterests:
    'Languages: Marathi (native), Hindi, and English. Interests include trekking, traveling, intelligent product development, cloud systems, and practical technology projects.',
  typingRoles: [
    'AI Engineer',
    'Data Engineer',
    'Full-Stack Developer',
    'Cloud Platform Learner',
    'Product Engineer',
  ],
};

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/gwc-sys',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mahesh-r-0a109b20a/',
    icon: FaLinkedinIn,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_mahesh.raskar/',
    icon: FaInstagram,
  },
  {
    label: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: FaEnvelope,
  },
];

