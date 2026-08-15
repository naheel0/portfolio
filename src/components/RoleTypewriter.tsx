'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface RoleTypewriterProps {
  roles: string[];
}

const TYPING_SPEED = 50;
const DELETING_SPEED = 30;
const PAUSE_DURATION = 2000;
const INITIAL_DELAY = 0;
const LOOP = true;

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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const currentText = textArray[currentTextIndex];

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !LOOP) {
            return;
          }
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, PAUSE_DURATION);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, DELETING_SPEED);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + currentText[currentCharIndex]);
            setCurrentCharIndex((prev) => prev + 1);
          }, TYPING_SPEED);
        } else if (textArray.length >= 1) {
          if (!LOOP && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, PAUSE_DURATION);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, INITIAL_DELAY);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    textArray,
    currentTextIndex,
  ]);

  return (
    <h2 className="typewriter hero-fade-up" style={{ animationDelay: '0s' }}>
      <span className="texttype-text">{displayedText}</span>
      <span className="texttype-cursor" aria-hidden="true" />
    </h2>
  );
}
