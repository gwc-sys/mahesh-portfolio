import aiHospitalImage from '../assets/images/ai-hospital-recommendation.png';
import portfolioImage from '../assets/images/mahesh-portfolio.png';
import smartVehicleImage from '../assets/images/smart-vehicle-health.png';
import stackhackImage from '../assets/images/stackhack.png';
import wildlifeImage from '../assets/images/wildlife-tracking.png';
import type { Project } from '../types';

export const projects: Project[] = [
  {
    name: 'StackHack.live',
    description:
      'A TypeScript hackathon platform for discovering challenges, organizing teams, and turning ideas into collaborative project submissions.',
    image: stackhackImage,
    stack: ['React', 'TypeScript', 'Vite', 'Firebase', 'Material UI'],
    features: [
      'Hackathon and challenge discovery',
      'Team-oriented project workflows',
      'Responsive TypeScript interface',
      'Browser-based live project preview',
    ],
    githubUrl: 'https://github.com/gwc-sys/StackHack.live',
    liveUrl: 'https://stackblitz.com/edit/vitejs-vite-gsjrcqe7',
    status: 'Live',
  },
  {
    name: 'AI Hospital Recommendation System',
    description:
      'An emergency support system that recommends suitable hospitals using location data, Google Maps APIs, and machine-learning workflows.',
    image: aiHospitalImage,
    stack: ['Python', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-learn'],
    features: [
      'Location-aware hospital discovery',
      'Emergency recommendation workflow',
      'Google Maps API integration',
      'Machine-learning experimentation',
    ],
    githubUrl: 'https://github.com/gwc-sys/AI-Hospital-Recommendation-System',
    status: 'Completed',
  },
  {
    name: 'Smart Vehicle Health Monitoring',
    description:
      'An AI and IoT-focused vehicle health monitoring project spanning TypeScript, JavaScript, and Kotlin application surfaces.',
    image: smartVehicleImage,
    stack: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Kotlin'],
    features: [
      'Vehicle health signal monitoring',
      'Cross-platform application architecture',
      'AI-assisted diagnostic direction',
      'IoT-ready telemetry workflows',
    ],
    githubUrl: 'https://github.com/gwc-sys/AI-Based-Smart-Vehicle-Health-Monitoring-System',
    status: 'Completed',
  },
  {
    name: 'Wildlife Tracking Client',
    description:
      'A map-first client application for wildlife monitoring, location visibility, and field-oriented tracking workflows.',
    image: wildlifeImage,
    stack: ['React', 'TypeScript', 'Vite', 'Firebase', 'Tailwind CSS'],
    features: [
      'Map-oriented tracking interface',
      'Location and movement visibility',
      'Responsive field workflows',
      'Typed frontend architecture',
    ],
    githubUrl: 'https://github.com/gwc-sys/wildlife-tracking-Client-side',
    status: 'In Progress',
  },
  {
    name: 'Mahesh Portfolio',
    description:
      'This responsive portfolio presents verified projects, engineering skills, experience, and contact paths in a polished Vite application.',
    image: portfolioImage,
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    features: [
      'Responsive light and dark themes',
      'Accessible reusable components',
      'Animated project storytelling',
      'Render-ready production build',
    ],
    githubUrl: 'https://github.com/gwc-sys/mahesh-portfolio',
    liveUrl: 'https://gwc-sys.online',
    status: 'Completed',
  },
];

