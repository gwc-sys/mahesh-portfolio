import type { ContactFormErrors, ContactFormValues } from '../types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values: ContactFormValues) {
  const errors: ContactFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.subject.trim().length < 4) {
    errors.subject = 'Subject should be at least 4 characters.';
  }

  if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }

  return errors;
}

export function hasValidationErrors(errors: ContactFormErrors) {
  return Object.keys(errors).length > 0;
}

