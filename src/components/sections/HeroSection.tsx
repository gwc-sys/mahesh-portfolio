import { motion } from 'framer-motion';
import { HiArrowDownTray, HiChatBubbleLeftRight } from 'react-icons/hi2';
import profileImage from '../../assets/images/profile-portrait.png';
import { slideInLeft, slideInRight, staggerContainer } from '../../animations/variants';
import { personalInfo, socialLinks } from '../../data/personal';
import { AnimatedTyping } from '../common/AnimatedTyping';
import { Container } from '../common/Container';
import { SocialLinks } from '../common/SocialLinks';

const stats = [
  { value: '27', label: 'Public repositories' },
  { value: '5', label: 'Featured projects' },
  { value: '3', label: 'Engineering focus areas' },
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

      <Container className="grid min-h-[calc(100vh-7rem)] items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p
            variants={slideInLeft}
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-primary dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300"
          >
            Open to AI, data, and product engineering opportunities
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={slideInLeft}
            className="mt-6 font-display text-5xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Hi, I am <span className="gradient-text">{personalInfo.name}</span>.
            <span className="block text-3xl text-slate-800 dark:text-slate-200 sm:text-4xl lg:text-5xl">
              {personalInfo.role}
            </span>
          </motion.h1>

          <motion.div variants={slideInLeft} className="mt-5 text-2xl font-bold sm:text-3xl">
            <AnimatedTyping words={personalInfo.typingRoles} />
          </motion.div>

          <motion.p variants={slideInLeft} className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
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

          <motion.div variants={slideInLeft} className="mt-8">
            <SocialLinks links={socialLinks} />
          </motion.div>

          <motion.div variants={slideInLeft} className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <p className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={slideInRight} initial="hidden" animate="visible" className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-emerald-300/35 blur-2xl" aria-hidden="true" />
          <div className="absolute -right-6 bottom-16 h-28 w-28 rounded-full bg-cyan-300/35 blur-2xl" aria-hidden="true" />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-soft-xl dark:border-white/10 dark:bg-slate-900"
          >
            <img
              src={profileImage}
              alt="Professional portrait illustration of Mahesh"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              loading="eager"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/82">
              <p className="text-sm font-bold text-slate-950 dark:text-white">Building intelligent products with purpose</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">AI + data + APIs + cloud-ready systems</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

