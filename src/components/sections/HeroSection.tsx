import { motion } from 'framer-motion';
import {
  HiArrowDownTray,
  HiChatBubbleLeftRight,
  HiCodeBracket,
  HiCubeTransparent,
  HiDocumentCheck,
  HiFolderOpen,
  HiSparkles,
} from 'react-icons/hi2';
import { slideInLeft, slideInRight, staggerContainer } from '../../animations/variants';
import { certifications } from '../../data/certifications';
import { personalInfo, socialLinks } from '../../data/personal';
import { skillCategories } from '../../data/skills';
import { AnimatedTyping } from '../common/AnimatedTyping';
import { Container } from '../common/Container';
import { TechOrbit } from '../common/TechOrbit';

const stats = [
  { value: '25', label: 'Original Projects', icon: HiFolderOpen },
  { value: String(certifications.length), label: 'Certificates', icon: HiDocumentCheck },
  { value: '27', label: 'Public Repos', icon: HiCodeBracket },
  {
    value: String(skillCategories.reduce((total, category) => total + category.skills.length, 0)),
    label: 'Listed Skills',
    icon: HiCubeTransparent,
  },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-white pt-24 dark:bg-secondary sm:pt-28"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[length:44px_44px] opacity-70 dark:opacity-25" />
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-50 via-cyan-50/60 to-transparent dark:from-blue-950/40 dark:via-cyan-950/20" />

      <Container className="grid min-h-[calc(100vh-7rem)] items-center gap-10 pb-16 lg:grid-cols-[0.95fr_1.05fr] xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p
            variants={slideInLeft}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-primary dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300"
          >
            <HiSparkles className="h-4 w-4" aria-hidden="true" />
            Open to AI • Data • Cloud • Full Stack Opportunities
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={slideInLeft}
            className="mt-7 font-display text-5xl font-extrabold leading-[1.05] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
          >
            <span className="block text-xl font-bold tracking-wide text-slate-500 dark:text-slate-300 sm:text-2xl">
              Hi, I&apos;m
            </span>
            <span className="gradient-text">{personalInfo.name}</span>
          </motion.h1>

          <motion.div variants={slideInLeft} className="mt-5 min-h-10 text-2xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-3xl">
            <AnimatedTyping words={personalInfo.typingRoles} />
          </motion.div>

          <motion.p variants={slideInLeft} className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {personalInfo.headline}
          </motion.p>

          <motion.div variants={slideInLeft} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={personalInfo.resumeUrl}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              <HiArrowDownTray className="h-5 w-5" aria-hidden="true" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:border-cyan-300 dark:hover:text-cyan-300"
            >
              <HiChatBubbleLeftRight className="h-5 w-5" aria-hidden="true" />
              Contact Me
            </a>
          </motion.div>

          <motion.div variants={slideInLeft} className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-primary dark:text-slate-300 dark:hover:text-cyan-300"
                >
                  <Icon className="h-4 w-4 transition group-hover:-translate-y-0.5" aria-hidden="true" />
                  {link.label}
                </a>
              );
            })}
          </motion.div>

          <motion.div variants={slideInLeft} className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-glow dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-300/40"
                >
                  <Icon className="mb-3 h-5 w-5 text-primary dark:text-cyan-300" aria-hidden="true" />
                  <p className="font-display text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="relative mx-auto w-full max-w-2xl lg:ml-auto lg:mr-[-1rem] xl:mr-[-2.5rem] 2xl:mr-[-4rem]"
        >
          <TechOrbit />
        </motion.div>
      </Container>
    </section>
  );
}

