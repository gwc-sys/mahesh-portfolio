import type { SectionId } from '../types';

export function scrollToSection(id: SectionId) {
  const section = document.getElementById(id);

  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

