import { useEffect, useState } from 'react';

interface AnimatedTypingProps {
  words: string[];
}

export function AnimatedTyping({ words }: AnimatedTypingProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) {
      return undefined;
    }

    const currentWord = words[wordIndex];
    const pauseAtFullWord = !isDeleting && visibleText === currentWord;
    const pauseAtEmptyWord = isDeleting && visibleText === '';
    const typingSpeed = isDeleting ? 42 : 76;
    const timeout = window.setTimeout(
      () => {
        if (pauseAtFullWord) {
          setIsDeleting(true);
          return;
        }

        if (pauseAtEmptyWord) {
          setIsDeleting(false);
          setWordIndex((currentIndex) => (currentIndex + 1) % words.length);
          return;
        }

        setVisibleText((currentText) =>
          isDeleting ? currentWord.slice(0, currentText.length - 1) : currentWord.slice(0, currentText.length + 1),
        );
      },
      pauseAtFullWord ? 1250 : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [isDeleting, visibleText, wordIndex, words]);

  return (
    <span aria-live="polite" className="inline-flex min-h-8 items-center text-primary dark:text-cyan-300">
      {visibleText}
      <span className="ml-1 h-7 w-0.5 animate-pulse bg-accent" aria-hidden="true" />
    </span>
  );
}

