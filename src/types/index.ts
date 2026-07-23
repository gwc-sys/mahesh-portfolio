import type { IconType } from 'react-icons';

export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'certifications'
  | 'contact';

export interface NavItem {
  label: string;
  href: `#${SectionId}`;
  id: SectionId;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}

export interface Skill {
  name: string;
  level: number;
  icon: IconType;
}

export interface SkillCategory {
  title: string;
  summary: string;
  icon: IconType;
  accent: string;
  skills: Skill[];
}

export interface Project {
  name: string;
  description: string;
  image: string;
  stack: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  status?: 'Live' | 'Completed' | 'In Progress';
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  location: string;
  responsibilities: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  description: string;
  accent: string;
  icon: IconType;
  documentUrl: string;
  documentLabel: string;
  credentialId?: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

