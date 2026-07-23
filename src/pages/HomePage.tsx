import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants';
import { AboutSection } from '../components/sections/AboutSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { ExperienceTimeline } from '../components/sections/ExperienceTimeline';
import { HeroSection } from '../components/sections/HeroSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { SkillsSection } from '../components/sections/SkillsSection';

export function HomePage() {
  return (
    <motion.main variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <HeroSection />
      <CertificationsSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceTimeline />
      <ContactSection />
    </motion.main>
  );
}

