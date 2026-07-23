import {
  FaAws,
  FaDatabase,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaJava,
  FaMicrosoft,
  FaPython,
  FaReact,
} from 'react-icons/fa6';
import {
  SiDjango,
  SiFastapi,
  SiFirebase,
  SiJavascript,
  SiMysql,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { TbApi, TbCloudComputing, TbCode, TbDeviceDesktopCode, TbTools } from 'react-icons/tb';
import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    summary: 'Interfaces that feel fast, accessible, and deliberate.',
    icon: TbDeviceDesktopCode,
    accent: 'from-sky-500 to-cyan-400',
    skills: [
      { name: 'React', level: 92, icon: FaReact },
      { name: 'TypeScript', level: 88, icon: SiTypescript },
      { name: 'Tailwind CSS', level: 90, icon: SiTailwindcss },
      { name: 'Vite', level: 84, icon: SiVite },
    ],
  },
  {
    title: 'Backend',
    summary: 'Clean APIs, validation, integrations, and service boundaries.',
    icon: TbApi,
    accent: 'from-emerald-500 to-teal-400',
    skills: [
      { name: 'Django', level: 82, icon: SiDjango },
      { name: 'FastAPI', level: 80, icon: SiFastapi },
      { name: 'REST APIs', level: 86, icon: TbApi },
      { name: 'Python', level: 88, icon: FaPython },
    ],
  },
  {
    title: 'Database',
    summary: 'Data modeling for app workflows, dashboards, and services.',
    icon: FaDatabase,
    accent: 'from-violet-500 to-fuchsia-400',
    skills: [
      { name: 'Azure MySQL', level: 78, icon: SiMysql },
      { name: 'Firebase', level: 84, icon: SiFirebase },
      { name: 'SQL', level: 80, icon: FaDatabase },
      { name: 'Realtime Data', level: 76, icon: SiFirebase },
    ],
  },
  {
    title: 'Cloud',
    summary: 'Deployment-minded development with cloud fundamentals.',
    icon: TbCloudComputing,
    accent: 'from-blue-500 to-indigo-400',
    skills: [
      { name: 'AWS Foundations', level: 76, icon: FaAws },
      { name: 'Azure Services', level: 74, icon: FaMicrosoft },
      { name: 'Firebase Hosting', level: 82, icon: SiFirebase },
      { name: 'Cloud Architecture', level: 72, icon: TbCloudComputing },
    ],
  },
  {
    title: 'Tools',
    summary: 'Reliable workflows from design through deployment.',
    icon: TbTools,
    accent: 'from-amber-500 to-orange-400',
    skills: [
      { name: 'Git', level: 88, icon: FaGitAlt },
      { name: 'Docker', level: 70, icon: FaDocker },
      { name: 'Figma', level: 76, icon: FaFigma },
      { name: 'Agile Delivery', level: 78, icon: TbTools },
    ],
  },
  {
    title: 'Languages',
    summary: 'Strong scripting and application programming base.',
    icon: TbCode,
    accent: 'from-rose-500 to-pink-400',
    skills: [
      { name: 'TypeScript', level: 88, icon: SiTypescript },
      { name: 'JavaScript', level: 90, icon: SiJavascript },
      { name: 'Python', level: 88, icon: FaPython },
      { name: 'Java', level: 74, icon: FaJava },
    ],
  },
];
