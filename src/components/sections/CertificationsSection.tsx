import { motion } from 'framer-motion';
import { HiCheckBadge } from 'react-icons/hi2';
import { slideUp, staggerContainer } from '../../animations/variants';
import { certifications } from '../../data/certifications';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';

export function CertificationsSection() {
  return (
    <section id="certifications" className="section-padding bg-slate-50 dark:bg-slate-950" aria-labelledby="certifications-title">
      <Container>
        <SectionHeading
          id="certifications-title"
          eyebrow="Certifications"
          title="Cloud and machine learning foundations."
          description="Credentials that support cloud-aware application development and a stronger understanding of modern platform capabilities."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-5 md:grid-cols-3"
        >
          {certifications.map((certification) => {
            const Icon = certification.icon;

            return (
              <motion.article
                key={certification.title}
                variants={slideUp}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-panel relative overflow-hidden rounded-2xl p-6"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${certification.accent}`}
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${certification.accent} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <HiCheckBadge className="h-7 w-7 text-primary dark:text-cyan-300" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-slate-950 dark:text-white">{certification.title}</h3>
                <p className="mt-2 text-sm font-bold text-primary dark:text-cyan-300">{certification.issuer}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{certification.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
