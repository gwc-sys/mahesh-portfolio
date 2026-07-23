import { TbBrain, TbCertificate, TbCloud, TbDatabase, TbFileText, TbMessageLanguage, TbShieldLock } from 'react-icons/tb';
import type { Certification } from '../types';

export const certifications: Certification[] = [
  {
    title: 'AWS Academy Cloud Foundations',
    issuer: 'AWS Academy · July 2022',
    description:
      'Cloud computing fundamentals including core AWS services, architecture principles, security, pricing, and support models.',
    accent: 'from-orange-400 to-amber-500',
    icon: TbCloud,
    documentUrl: 'https://www.credly.com/badges/5a07283a-3116-49db-9817-3ceb54bdf910/print',
    documentLabel: 'View credential',
  },
  {
    title: 'AWS Machine Learning Foundations',
    issuer: 'AWS Academy · July 2022',
    description:
      'Foundational machine learning concepts covering model lifecycle, responsible AI thinking, and AWS ML service awareness.',
    accent: 'from-cyan-400 to-blue-500',
    icon: TbBrain,
    documentUrl: 'https://www.credly.com/badges/81c24622-40f0-4fc8-9a60-b158f11cd1b2/print',
    documentLabel: 'View credential',
  },
  {
    title: 'Engineering Research Publication',
    issuer: 'IRJMETS · April 2023',
    description:
      'Published research work in the International Research Journal of Modernization in Engineering Technology and Science.',
    accent: 'from-slate-500 to-blue-500',
    icon: TbFileText,
    documentUrl:
      'https://www.irjmets.com/uploadedfiles/paper//issue_4_april_2023/37437/final/fin_irjmets1683011969.pdf',
    documentLabel: 'Read publication',
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco · April 2023',
    description:
      'Cisco-verified foundational knowledge of cyber threats, vulnerabilities, threat detection, defense, and cybersecurity career pathways.',
    accent: 'from-blue-500 to-indigo-600',
    icon: TbShieldLock,
    documentUrl:
      'https://www.credly.com/badges/fab2ff2b-a322-40a4-95e6-a3a22d7942ac/linked_in_profile',
    documentLabel: 'View credential',
  },
  {
    title: 'Business English: Networking',
    issuer: 'University of Washington · April 2021',
    description:
      'Coursera-verified training in professional introductions, networking communication, business conversations, and relationship building in English.',
    accent: 'from-emerald-500 to-teal-600',
    icon: TbMessageLanguage,
    documentUrl: 'https://coursera.org/share/9ec6474c93922c035d0e80a3542f26eb',
    documentLabel: 'View certificate',
  },
  {
    title: 'Oracle Database Foundations',
    issuer: 'LearnQuest · December 2021',
    description:
      'Coursera-verified foundational knowledge of relational databases, Oracle Database concepts, SQL, tables, keys, and data management.',
    accent: 'from-red-500 to-orange-600',
    icon: TbDatabase,
    documentUrl: 'https://coursera.org/share/11342757cc44920170314c879997f29b',
    documentLabel: 'View certificate',
  },
  {
    title: 'CSS (Basic)',
    issuer: 'HackerRank · July 2022',
    description:
      'Verified foundational CSS skills covering cascading and inheritance, text styling, layouts, and the CSS box model.',
    accent: 'from-sky-500 to-blue-600',
    icon: TbCertificate,
    documentUrl: 'https://www.hackerrank.com/certificates/680c60c2934c',
    documentLabel: 'View certificate',
    credentialId: '680C60C2934C',
  },
  {
    title: 'SQL (Basic)',
    issuer: 'HackerRank · July 2022',
    description:
      'Verified foundational SQL skills covering simple queries, relational data, filtering, sorting, and aggregation.',
    accent: 'from-cyan-500 to-teal-600',
    icon: TbDatabase,
    documentUrl: 'https://www.hackerrank.com/certificates/e54dc2a94e24',
    documentLabel: 'View certificate',
    credentialId: 'E54DC2A94E24',
  },
];

