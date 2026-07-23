import { motion } from 'framer-motion';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { HiEnvelope, HiMapPin, HiPaperAirplane } from 'react-icons/hi2';
import { slideInLeft, slideInRight, staggerContainer } from '../../animations/variants';
import { personalInfo, socialLinks } from '../../data/personal';
import { sendContactEmail } from '../../services/email';
import type { ContactFormErrors, ContactFormValues } from '../../types';
import { hasValidationErrors, validateContactForm } from '../../utils/validation';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { SocialLinks } from '../common/SocialLinks';

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function ContactSection() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof ContactFormValues;

    setValues((currentValues) => ({ ...currentValues, [fieldName]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [fieldName]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      setStatus({ type: 'error', message: 'Please fix the highlighted fields before sending.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      await sendContactEmail(values);
      setValues(initialValues);
      setStatus({ type: 'success', message: 'Message sent successfully. I will get back to you soon.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong while sending your message.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white dark:bg-secondary" aria-labelledby="contact-title">
      <Container>
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title="Let us build something useful, elegant, and reliable."
          description="Send a message about full-stack development, AI, data, cloud projects, professional opportunities, or collaboration."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-90px' }}
          className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <motion.aside variants={slideInLeft} className="glass-panel rounded-2xl p-6 lg:p-8">
            <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">Contact details</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              I am open to opportunities where AI, reliable data, scalable APIs, and thoughtful product experiences
              come together.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary dark:border-white/10 dark:bg-slate-950 dark:hover:border-cyan-300"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-cyan-300/10 dark:text-cyan-300">
                  <HiEnvelope className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">Email</span>
                  <span className="block break-all text-sm text-slate-600 dark:text-slate-300">{personalInfo.email}</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-300/10 dark:text-emerald-300">
                  <HiMapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">Location</span>
                  <span className="block text-sm text-slate-600 dark:text-slate-300">{personalInfo.location}</span>
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-slate-950 dark:text-white">Social links</p>
              <SocialLinks links={socialLinks} />
            </div>
          </motion.aside>

          <motion.form variants={slideInRight} onSubmit={handleSubmit} noValidate className="glass-panel rounded-2xl p-6 lg:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Name"
                name="name"
                value={values.name}
                error={errors.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-5">
              <FormField
                label="Subject"
                name="subject"
                value={values.subject}
                error={errors.subject}
                onChange={handleChange}
                placeholder="Project, role, or collaboration"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Tell me a little about what you want to build."
                rows={6}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className="min-h-40 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />
              {errors.message ? (
                <p id="message-error" className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {status ? (
              <div
                role="status"
                className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300'
                    : 'border-red-200 bg-red-50 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300'
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <HiPaperAirplane className="h-5 w-5" aria-hidden="true" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  name: keyof ContactFormValues;
  value: string;
  error?: string;
  type?: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ label, name, value, error, type = 'text', placeholder, onChange }: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-slate-800 dark:text-slate-100">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
