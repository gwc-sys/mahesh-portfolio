import { motion } from 'framer-motion';
import { HiAcademicCap, HiBriefcase, HiLanguage, HiLightBulb, HiUserCircle } from 'react-icons/hi2';
import { slideUp, staggerContainer } from '../../animations/variants';
import { personalInfo } from '../../data/personal';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

const aboutCards = [
  {
    title: 'Introduction',
    body: personalInfo.about,
    icon: HiUserCircle,
  },
  {
    title: 'Experience',
    body: personalInfo.experienceSummary,
    icon: HiBriefcase,
  },
  {
    title: 'Education',
    body: personalInfo.education,
    icon: HiAcademicCap,
  },
  {
    title: 'Career Objective',
    body: personalInfo.objective,
    icon: HiLightBulb,
  },
  {
    title: 'Languages & Interests',
    body: personalInfo.languagesAndInterests,
    icon: HiLanguage,
  },
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-slate-50 dark:bg-slate-950" aria-labelledby="about-title">
      <Container>
        <SectionHeading
          id="about-title"
          eyebrow="About me"
          title="Engineering useful products where AI, data, cloud, and experience connect."
          description={personalInfo.skillsSummary}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-5 md:grid-cols-2"
        >
          {aboutCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                variants={slideUp}
                whileHover={{ y: -6 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary dark:bg-cyan-300/10 dark:text-cyan-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{card.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
