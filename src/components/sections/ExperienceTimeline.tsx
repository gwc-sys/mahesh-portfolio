import { motion } from 'framer-motion';
import { HiMapPin } from 'react-icons/hi2';
import { slideUp, staggerContainer } from '../../animations/variants';
import { experienceItems } from '../../data/experience';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function ExperienceTimeline() {
  return (
    <section id="experience" className="section-padding bg-white dark:bg-secondary" aria-labelledby="experience-title">
      <Container>
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title="A timeline of hands-on development and applied learning."
          description="Focused on practical delivery: user interfaces, backend integration, realtime systems, and cloud fundamentals."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-transparent sm:block" aria-hidden="true" />

          <div className="space-y-6">
            {experienceItems.map((item, index) => (
              <motion.article key={`${item.company}-${item.duration}`} variants={slideUp} className="relative sm:pl-12">
                <div className="absolute left-0 top-7 hidden h-8 w-8 rounded-full border-4 border-white bg-primary shadow-glow dark:border-secondary sm:grid sm:place-items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary dark:text-cyan-300">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{item.position}</h3>
                      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{item.company}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-primary dark:bg-cyan-300/10 dark:text-cyan-300">
                        {item.duration}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 md:justify-end">
                        <HiMapPin className="h-4 w-4" aria-hidden="true" />
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {item.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
