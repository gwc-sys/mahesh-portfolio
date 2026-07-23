import {
  FaDatabase,
  FaGitAlt,
  FaGithub,
  FaMicrosoft,
  FaPython,
  FaReact,
} from 'react-icons/fa6';
import {
  SiDjango,
  SiFastapi,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { TbApi, TbBrain, TbCloudComputing, TbCode, TbDeviceDesktopCode, TbShieldLock, TbTools } from 'react-icons/tb';
import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Engineering',
    summary: 'The most consistent stack across the public repositories.',
    icon: TbDeviceDesktopCode,
    accent: 'from-sky-500 to-cyan-400',
    skills: [
      { name: 'React', level: 88, icon: FaReact },
      { name: 'Vite', level: 86, icon: SiVite },
      { name: 'TypeScript', level: 82, icon: SiTypescript },
      { name: 'Tailwind CSS', level: 82, icon: TbDeviceDesktopCode },
      { name: 'CSS', level: 85, icon: TbCode },
    ],
  },
  {
    title: 'Backend & APIs',
    summary: 'API services across JavaScript, Python, and .NET projects.',
    icon: TbApi,
    accent: 'from-emerald-500 to-teal-400',
    skills: [
      { name: 'Express.js', level: 82, icon: SiJavascript },
      { name: 'FastAPI', level: 72, icon: SiFastapi },
      { name: 'Django', level: 68, icon: SiDjango },
      { name: 'ASP.NET Core', level: 55, icon: FaMicrosoft },
    ],
  },
  {
    title: 'AI & Data',
    summary: 'Libraries verified in Python machine-learning and recommendation projects.',
    icon: TbBrain,
    accent: 'from-violet-500 to-fuchsia-400',
    skills: [
      { name: 'Python', level: 78, icon: FaPython },
      { name: 'Scikit-learn', level: 65, icon: TbBrain },
      { name: 'Pandas & NumPy', level: 68, icon: FaDatabase },
      { name: 'MongoDB & Mongoose', level: 70, icon: SiMongodb },
      { name: 'Oracle Database & SQL', level: 65, icon: FaDatabase },
    ],
  },
  {
    title: 'Mobile & Backend Services',
    summary: 'Cross-platform apps backed by managed data and authentication services.',
    icon: FaReact,
    accent: 'from-blue-500 to-indigo-400',
    skills: [
      { name: 'React Native', level: 72, icon: FaReact },
      { name: 'Expo', level: 70, icon: FaReact },
      { name: 'Firebase', level: 78, icon: SiFirebase },
      { name: 'Appwrite', level: 68, icon: FaDatabase },
    ],
  },
  {
    title: 'Framework Breadth',
    summary: 'Additional frameworks demonstrated in focused public projects.',
    icon: TbCloudComputing,
    accent: 'from-amber-500 to-orange-400',
    skills: [
      { name: 'Nuxt & Vue', level: 62, icon: TbDeviceDesktopCode },
      { name: 'Astro', level: 60, icon: TbDeviceDesktopCode },
      { name: 'WordPress & PHP', level: 58, icon: TbCode },
      { name: 'Material UI', level: 68, icon: TbDeviceDesktopCode },
    ],
  },
  {
    title: 'Professional Practice & Delivery',
    summary: 'Security, communication, and GitHub-based delivery workflows.',
    icon: FaGitAlt,
    accent: 'from-rose-500 to-pink-400',
    skills: [
      { name: 'Git', level: 88, icon: FaGitAlt },
      { name: 'GitHub', level: 88, icon: FaGithub },
      { name: 'GitHub Actions', level: 58, icon: FaGithub },
      { name: 'Cybersecurity Foundations', level: 60, icon: TbShieldLock },
      { name: 'Business English & Networking', level: 72, icon: TbTools },
    ],
  },
];
