export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.2 },
  },
};

export const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 10 },
  },
};

export const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, duration: 0.8 },
  },
};

export const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, duration: 1 },
  },
  hover: {
    scale: 1.05,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 },
  },
};

export const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, delay: 0.1 },
  },
};

export const staggerContainer = (
  staggerChildren = 0.2,
  delayChildren = 0.2
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren, staggerChildren },
  },
});

export const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 10, delay },
  },
});
