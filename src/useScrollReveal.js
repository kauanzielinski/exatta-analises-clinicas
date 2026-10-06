import { useEffect } from "react";

const REVEAL_CONFIG = [
  { selector: "section", direction: "up" },
  { selector: ".section-heading", direction: "up" },
  { selector: ".info-card", direction: "alternate" },
  { selector: ".service-card", direction: "alternate" },
  { selector: ".exam-card", direction: "alternate" },
  { selector: ".team-card", direction: "alternate" },
  { selector: ".faq-question", direction: "alternate" },
  { selector: ".stat-item", direction: "alternate" },
  { selector: ".why-card", direction: "alternate" },
  { selector: ".battery-select", direction: "alternate" },
  { selector: ".contact-detail-card", direction: "alternate" },
  { selector: ".contact-location-card", direction: "left" },
  { selector: ".contact-visual-card", direction: "right" },
  { selector: ".result-card", direction: "alternate" },
  { selector: ".step-item", direction: "alternate" },
  { selector: ".service-detail-card", direction: "alternate" },
  { selector: ".quick-grid > button", direction: "alternate" },
  { selector: ".about-grid > *", direction: "pair" },
  { selector: ".lab-story-grid > *", direction: "pair" },
  { selector: ".hero-copy", direction: "left" },
  { selector: ".hero-visual", direction: "right" },
  { selector: ".page-hero-content", direction: "left" },
  { selector: ".page-hero-visual", direction: "right" },
  { selector: ".service-experience-copy", direction: "left" },
  { selector: ".service-experience-visual", direction: "right" }
];

const REVEAL_IGNORE_SELECTOR = ".exam-modal, .schedule-exam-popover";

function resolveDirection(el, direction) {
  if (direction !== "alternate" && direction !== "pair") return direction;

  const siblings = Array.from(el.parentElement?.children || []);
  const siblingIndex = siblings.indexOf(el);

  return siblingIndex % 2 === 0 ? "left" : "right";
}

export default function useScrollReveal(path) {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return undefined;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobileExams =
      path === "/exames" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 760px)").matches;

    const processed = new Set();
    const matched = [];

    REVEAL_CONFIG.forEach(({ selector, direction }) => {
      Array.from(main.querySelectorAll(selector)).forEach((el) => {
        if (processed.has(el) || el.closest(REVEAL_IGNORE_SELECTOR)) return;

        processed.add(el);
        matched.push({ el, direction: resolveDirection(el, direction) });
      });
    });

    matched.sort((a, b) => {
      const position = a.el.compareDocumentPosition(b.el);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    if (!matched.length) return undefined;

    if (prefersReduced || isMobileExams || !("IntersectionObserver" in window)) {
      matched.forEach(({ el }) => el.classList.add("reveal", "is-visible", "reveal-settled"));
      return undefined;
    }

    matched.forEach(({ el, direction }, index) => {
      el.classList.add("reveal", `reveal-${direction}`);
      el.style.setProperty("--reveal-delay", `${(index % 5) * 90}ms`);
    });

    let observer;
    let rafId1 = null;
    let rafId2 = null;

    rafId1 = window.requestAnimationFrame(() => {
      rafId2 = window.requestAnimationFrame(() => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              const el = entry.target;
              el.classList.add("is-visible");
              observer.unobserve(el);

              const clearWillChange = (event) => {
                if (event.target !== el) return;
                el.classList.add("reveal-settled");
                el.removeEventListener("transitionend", clearWillChange);
              };

              el.addEventListener("transitionend", clearWillChange);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        matched.forEach(({ el }) => observer.observe(el));
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId1);
      if (rafId2) window.cancelAnimationFrame(rafId2);
      observer?.disconnect();
    };
  }, [path]);
}
