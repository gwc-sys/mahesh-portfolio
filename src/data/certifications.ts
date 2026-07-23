import { FaAws } from 'react-icons/fa6';
import { TbBrain, TbCloud } from 'react-icons/tb';
import type { Certification } from '../types';

export const certifications: Certification[] = [
  {
    title: 'AWS Academy Cloud Foundations',
    issuer: 'AWS Academy',
    description:
      'Cloud computing fundamentals including core AWS services, architecture principles, security, pricing, and support models.',
    accent: 'from-orange-400 to-amber-500',
    icon: TbCloud,
  },
  {
    title: 'AWS Machine Learning Foundations',
    issuer: 'AWS Academy',
    description:
      'Foundational machine learning concepts covering model lifecycle, responsible AI thinking, and AWS ML service awareness.',
    accent: 'from-cyan-400 to-blue-500',
    icon: TbBrain,
  },
  {
    title: 'Cloud Practitioner Mindset',
    issuer: 'Portfolio Highlight',
    description:
      'Practical readiness to connect frontend products with cloud-hosted APIs, data stores, and deployment workflows.',
    accent: 'from-slate-500 to-blue-500',
    icon: FaAws,
  },
];

