/**
 * =========================================================================
 * ATELIER 212 — MOTION & ANIMATION SYSTEM CONFIGURATION
 * =========================================================================
 * Centralized easing, durations, thresholds, and Framer Motion variants.
 * Tweak any value here to adjust timing across the entire website.
 */

import { Variants } from 'framer-motion';

// --- Shared Curves & Timings ---
export const MOTION_CONFIG = {
  // Easing curve: smooth luxury deceleration curve
  ease: [0.22, 1, 0.36, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeElastic: [0.34, 1.56, 0.64, 1] as const,

  // Durations (in seconds)
  microDuration: 0.25,      // Buttons, hover, toggles
  revealDuration: 0.65,     // Section entrance
  staggerDelay: 0.08,       // Delay between grid items (80ms)
  preloaderDuration: 1.1,   // Max 1.2s preloader intro

  // Distances (in pixels)
  sectionYOffset: 24,       // Slide up distance for sections
  cardHoverLift: -6,        // Product card hover lift
  parallaxOffset: 35,       // Max parallax offset on desktop
} as const;

// --- Section Scroll Reveal Variant ---
export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: MOTION_CONFIG.sectionYOffset,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_CONFIG.revealDuration,
      ease: MOTION_CONFIG.ease,
    },
  },
};

// --- Stagger Container Variant ---
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_CONFIG.staggerDelay,
      delayChildren: 0.1,
    },
  },
};

// --- Stagger Item Variant ---
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: MOTION_CONFIG.ease,
    },
  },
};

// --- Image Clip / Scale Reveal ---
export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: MOTION_CONFIG.ease,
    },
  },
};

// --- Modal Scale & Fade ---
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: MOTION_CONFIG.ease,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

// --- Button Interaction Props ---
export const buttonMotionProps = {
  whileHover: { scale: 1.025, transition: { duration: 0.2, ease: MOTION_CONFIG.ease } },
  whileTap: { scale: 0.96, transition: { duration: 0.1 } },
};
