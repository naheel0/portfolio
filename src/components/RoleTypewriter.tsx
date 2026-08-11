'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface RoleTypewriterProps {
  roles: string[];
}

/**
 * RoleTypewriter — ReactBits "TextType" adapted without gsap.
 * The only gsap usage (cursor blink) is replaced with a CSS animation,
 * keeping the bundle footprint identical to before.
 */
export default function RoleTypewriter({ roles }: RoleTypewriterProps) {
  const list = roles.length > 0 ? roles : ["Full Stack Developer", ".NET Developer", "React Developer", "Web Developer"];
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textArray = useMemo(() => list, [list]);
  const typingSpeed = 50;
  const deletingSpeed = 30;
  const pauseDuration = 2000;
  const initialDelay = 0;
  const loop = true;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const currentText = textArray[currentTextIndex];

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + currentText[currentCharIndex]);
            setCurrentCharIndex((prev) => prev + 1);
          }, typingSpeed);
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
  ]);

  return (
    <h2 className="typewriter hero-fade-up" style={{ animationDelay: '0s' }}>
      <span className="texttype-text">{displayedText}</span>
      <span className="texttype-cursor" aria-hidden="true" />
    </h2>
  );
}