"use client";

import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { FaChevronDown } from "react-icons/fa6";

type LenisInstance = Lenis;

export const ScrollStackItem = ({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface TransformState {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

/**
 * ScrollStack — React Bits (JS + CSS variant) rendered with lenis.
 *
 * Performance / accessibility hardening added on top of the published source:
 *  - prefers-reduced-motion: Lenis + the rAF loop are skipped entirely, cards
 *    render as a static stack (no global smooth-scroll hijack, no idle CPU).
 *  - in-viewport pausing: an IntersectionObserver pauses the rAF loop when the
 *    scroller scrolls out of view, so there is zero background main-thread cost
 *    on low-end devices after the section leaves the viewport.
 *  - transform writes are coalesced (one rAF per scroll event) and diffed
 *    against the last applied values to avoid redundant style recalculation.
 */
const ScrollStack = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<LenisInstance | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const lastTransformsRef = useRef(new Map<number, TransformState>());
  const isUpdatingRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    []
  );

  const parsePercentage = useCallback(
    (value: string, containerHeight: number) => {
      if (typeof value === "string" && value.includes("%")) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value);
    },
    []
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    }
    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller ? scroller.scrollTop : 0,
      containerHeight: scroller ? scroller.clientHeight : 0,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      }
      return element.offsetTop;
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current || pausedRef.current) {
      return;
    }

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(".scroll-stack-end") as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCard = cardsRef.current[j];
          if (!jCard) continue;
          const jCardTop = getElementOffset(jCard);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const transformState: TransformState = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - transformState.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - transformState.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - transformState.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - transformState.blur) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${transformState.translateY}px, 0) scale(${transformState.scale}) rotate(${transformState.rotation}deg)`;
        if (transformState.blur > 0) {
          card.style.filter = `blur(${transformState.blur}px)`;
        } else {
          card.style.filter = "";
        }
        lastTransformsRef.current.set(i, transformState);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const updateIndicator = useCallback(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const { scrollTop } = getScrollData();
    indicator.classList.toggle("scroll-stack-indicator-hidden", scrollTop > 40);
  }, [getScrollData]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
    updateIndicator();
  }, [updateCardTransforms, updateIndicator]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll<HTMLElement>(".scroll-stack-card")
        : scroller.querySelectorAll<HTMLElement>(".scroll-stack-card")
    );

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      card.style.willChange = "transform";
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
    });

    const applyBaseStack = () => {
      cards.forEach((card, i) => {
        if (i > 0) {
          card.style.transform = `translate3d(0, ${itemStackDistance * i}px, 0) scale(${baseScale})`;
        }
      });
    };

    if (reducedMotionRef.current) {
      applyBaseStack();
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (lenisRef.current) lenisRef.current.destroy();
        cardsRef.current = [];
        lastTransformsRef.current.clear();
      };
    }

    // Pause the rAF loop when the scroller leaves the viewport.
    let io: IntersectionObserver | null = null;
    const root = useWindowScroll ? null : scroller.parentElement;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          pausedRef.current = !entry.isIntersecting;
          if (!entry.isIntersecting) {
            updateCardTransforms();
          }
        },
        { root, threshold: 0.01 }
      );
      io.observe(scroller);
    }

    let lenis: LenisInstance | null = null;
    if (!useWindowScroll) {
      const content = scroller.querySelector(".scroll-stack-inner") as HTMLElement;
      lenis = new Lenis({
        wrapper: scroller,
        content,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertiaExponent: 1.7,
      });
      lenis.on("scroll", handleScroll);
      lenisRef.current = lenis;
    }

    const raf = (time: number) => {
      if (!pausedRef.current) {
        lenis?.raf(time);
        updateCardTransforms();
        updateIndicator();
      }
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    updateCardTransforms();
    updateIndicator();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenis) lenis.destroy();
      if (io) io.disconnect();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      isUpdatingRef.current = false;
      pausedRef.current = false;
      lastTransformsRef.current.clear();
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    handleScroll,
    updateIndicator,
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">{children}</div>
      <div className="scroll-stack-end" />
      <div className="scroll-stack-indicator" ref={indicatorRef} aria-hidden="true">
        <span className="scroll-indicator-icon">
          <FaChevronDown />
        </span>
      </div>
    </div>
  );
};

export default ScrollStack;