"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode, RefCallback } from "react";

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export function MaskedText({
  as: Tag = "p",
  children,
  className,
}: {
  as?: RevealTag;
  children: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const sourceRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[]>();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const source = sourceRef.current;
    const textNode = source?.firstChild;
    if (
      lines ||
      !root ||
      !source ||
      !textNode ||
      textNode.nodeType !== Node.TEXT_NODE
    ) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const groups: { top: number; words: string[] }[] = [];
      for (const word of children.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(textNode, word.index);
        range.setEnd(textNode, word.index + word[0].length);
        const top = range.getBoundingClientRect().top;
        const line = groups.find((group) => Math.abs(group.top - top) < 2);
        if (line) line.words.push(word[0]);
        else groups.push({ top, words: [word[0]] });
      }
      if (groups.length) setLines(groups.map((group) => group.words.join(" ")));
    });
    return () => cancelAnimationFrame(frame);
  }, [children, lines]);

  useEffect(() => {
    if (!lines?.length || !("ResizeObserver" in window)) return;
    const root = rootRef.current;
    if (!root) return;
    let width = root.getBoundingClientRect().width;
    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = root.getBoundingClientRect().width;
      if (Math.abs(nextWidth - width) < 1) return;
      width = nextWidth;
      setLines(undefined);
    });
    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [lines]);

  useEffect(() => {
    if (!lines?.length) return;
    const root = rootRef.current;
    if (!root) return;
    let hasRevealed = false;
    let checkFrame = 0;
    let observer: IntersectionObserver | undefined;

    const cleanupListeners = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleVisibilityCheck);
      window.removeEventListener("resize", scheduleVisibilityCheck);
      if (checkFrame) cancelAnimationFrame(checkFrame);
    };
    const reveal = () => {
      if (hasRevealed) return;
      hasRevealed = true;
      setVisible(true);
      cleanupListeners();
    };
    const checkVisibility = () => {
      checkFrame = 0;
      const bounds = root.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) reveal();
    };
    function scheduleVisibilityCheck() {
      if (!checkFrame) checkFrame = requestAnimationFrame(checkVisibility);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return cleanupListeners;
    }
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
      );
      observer.observe(root);
    }
    window.addEventListener("scroll", scheduleVisibilityCheck, { passive: true });
    window.addEventListener("resize", scheduleVisibilityCheck);
    checkVisibility();
    return cleanupListeners;
  }, [lines]);

  const TagName = Tag;
  const setRootRef: RefCallback<HTMLElement> = (element) => {
    rootRef.current = element;
  };
  return (
    <TagName
      ref={setRootRef}
      className={`text-reveal${className ? ` ${className}` : ""}`}
      data-armed={lines?.length ? "true" : undefined}
      data-visible={visible ? "true" : undefined}
      aria-label={children}
    >
      {!lines && (
        <span ref={sourceRef} className="text-reveal-source" aria-hidden="true">
          {children}
        </span>
      )}
      {lines && (
        <span className="text-reveal-lines" aria-hidden="true">
          {lines.map((line, index) => (
            <span className="text-reveal-line" key={`${index}-${line}`}>
              <span style={{ transitionDelay: `${Math.min(index * 38, 342)}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </span>
      )}
    </TagName>
  );
}

type RevealElement =
  | "div"
  | "p"
  | "span"
  | "ul"
  | "li"
  | "figure"
  | "article";

/**
 * Reveals an element once it enters the viewport. The element is only hidden
 * after hydration, so content remains visible without JavaScript.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
}: {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "visible">("idle");

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      setState(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "visible"
          : "armed",
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (state !== "armed") return;
    const node = rootRef.current;
    if (!node) return;

    let frame = 0;
    let done = false;
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      if (done) return;
      done = true;
      setState("visible");
    };
    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
    const check = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) reveal();
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(check);
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      observer.observe(node);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();
    return cleanup;
  }, [state]);

  const TagName = Tag;
  const setRootRef: RefCallback<HTMLElement> = (element) => {
    rootRef.current = element;
  };
  return (
    <TagName
      ref={setRootRef}
      className={`reveal${className ? ` ${className}` : ""}`}
      data-reveal={state === "idle" ? undefined : state}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </TagName>
  );
}
