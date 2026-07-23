import emailjs from '@emailjs/browser';
import type { ContactFormValues } from '../types';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendContactEmail(values: ContactFormValues) {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS is not configured. Add your EmailJS keys to .env.local.');
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      from_name: values.name.trim(),
      from_email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    },
    { publicKey },
  );
}

