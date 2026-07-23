import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '../../animations/variants';
import { skillCategories } from '../../data/skills';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding bg-white dark:bg-secondary" aria-labelledby="skills-title">
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title="A technology stack verified across public source code."
          description="These skills reflect manifests and authored files across 25 original public repositories; two forked repositories are excluded from the assessment."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {skillCategories.map((category) => {
            const CategoryIcon = category.icon;

            return (
              <motion.article
                key={category.title}
                variants={slideUp}
                whileHover={{ y: -6 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}>
                    <CategoryIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">{category.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{category.summary}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {category.skills.map((skill) => {
                    const SkillIcon = skill.icon;

                    return (
                      <div key={skill.name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <SkillIcon className="h-5 w-5 shrink-0 text-primary dark:text-cyan-300" aria-hidden="true" />
                            <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{skill.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{skill.level}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden="true">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${category.accent}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
