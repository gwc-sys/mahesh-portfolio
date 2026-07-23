import placeholderImage from '../assets/images/project-placeholder.png';
import stackhackImage from '../assets/images/stackhack.png';
import wildlifeImage from '../assets/images/wildlife-tracking.png';
import type { Project } from '../types';

export const projects: Project[] = [
  {
    name: 'StackHack',
    description:
      'A modern hackathon platform concept with team workflows, challenge discovery, idea tracking, and scalable API foundations.',
    image: stackhackImage,
    stack: ['React', 'TypeScript', 'Tailwind', 'Django', 'FastAPI', 'Azure MySQL'],
    features: [
      'Role-aware dashboard experiences',
      'REST API architecture with Python services',
      'Cloud-ready relational data model',
      'Responsive project and team views',
    ],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com/',
    status: 'Live',
  },
  {
    name: 'Wildlife Tracking System',
    description:
      'A geospatial tracking application for wildlife movement, alerts, and field visibility using realtime data and map-first interaction.',
    image: wildlifeImage,
    stack: ['React', 'Firebase', 'Google Maps', 'IoT'],
    features: [
      'Realtime location updates',
      'Map-based monitoring interface',
      'Firebase authentication and storage',
      'IoT telemetry-ready data flow',
    ],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com/',
    status: 'Live',
  },
  {
    name: 'AI Interview Coach',
    description:
      'Placeholder for a future AI-powered preparation tool with scoring, feedback, and personalized practice flows.',
    image: placeholderImage,
    stack: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL'],
    features: ['Structured mock sessions', 'Feedback dashboard', 'Progress analytics'],
    status: 'Placeholder',
  },
  {
    name: 'Cloud Cost Dashboard',
    description:
      'Placeholder for a future analytics dashboard that helps teams understand and optimize cloud spending.',
    image: placeholderImage,
    stack: ['React', 'TypeScript', 'Charts', 'AWS'],
    features: ['Spend trend charts', 'Service breakdowns', 'Optimization insights'],
    status: 'Placeholder',
  },
];

