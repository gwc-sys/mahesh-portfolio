import { motion } from 'framer-motion';
import { HiArrowTopRightOnSquare, HiCheckBadge } from 'react-icons/hi2';
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
          eyebrow="Credentials & publication"
          title="Credentials across technology, communication, and research."
          description="Verified AWS Academy, Cisco, and University of Washington credentials alongside published engineering research."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {certifications.map((certification) => {
            const Icon = certification.icon;

            return (
              <motion.a
                key={certification.title}
                href={certification.documentUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${certification.documentLabel}: ${certification.title}`}
                variants={slideUp}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-panel group relative flex flex-col overflow-hidden rounded-2xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950"
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
                {certification.credentialId ? (
                  <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                    Credential ID: {certification.credentialId}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{certification.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:text-blue-600 dark:text-cyan-300 dark:group-hover:text-cyan-200">
                  {certification.documentLabel}
                  <HiArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
