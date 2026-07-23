import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa6';
import { HiArrowTopRightOnSquare, HiSparkles } from 'react-icons/hi2';
import { slideUp, staggerContainer } from '../../animations/variants';
import { projects } from '../../data/projects';
import type { Project } from '../../types';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

function ProjectCard({ project }: { project: Project }) {
  const isPlaceholder = project.status === 'Placeholder';

  return (
    <motion.article
      variants={slideUp}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-xl transition dark:border-white/10 dark:bg-slate-900"
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={`${project.name} project preview`}
          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur dark:bg-slate-950/85 dark:text-slate-100">
          <HiSparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          {project.status ?? 'Live'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">{project.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-primary dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <ul className="mt-5 space-y-2">
          {project.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.githubUrl ?? '#projects'}
            target={project.githubUrl ? '_blank' : undefined}
            rel={project.githubUrl ? 'noreferrer' : undefined}
            aria-disabled={isPlaceholder}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:text-cyan-300"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={project.liveUrl ?? '#projects'}
            target={project.liveUrl ? '_blank' : undefined}
            rel={project.liveUrl ? 'noreferrer' : undefined}
            aria-disabled={isPlaceholder}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-primary dark:bg-white dark:text-secondary dark:hover:bg-cyan-300"
          >
            <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
            Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="section-padding bg-slate-50 dark:bg-slate-950" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Featured builds with real product surfaces."
          description="A mix of full stack systems, realtime data ideas, and placeholders ready for your next polished case study."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
