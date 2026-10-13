import { useEffect, useRef, useCallback } from "react";

// Shared across tabs so activity in one tab keeps the others signed in.
const LAST_ACTIVITY_KEY = "lastActivityAt";
const WRITE_THROTTLE_MS = 5000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "wheel", "touchstart"] as const;

const readLastActivity = (): number | null => {
  try {
    const value = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
};

const writeLastActivity = (time: number) => {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(time));
  } catch {
    // Storage unavailable: fall back to this tab's own timer.
  }
};

const useInactivityTimeout = (
  onTimeout: () => void,
  timeoutDuration: number = 15 * 60 * 1000
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWriteRef = useRef(0);

  const schedule = useCallback((delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Another tab may have been active since this timer was set.
      const last = readLastActivity();
      const idleFor = last ? Date.now() - last : timeoutDuration;

      if (idleFor < timeoutDuration) {
        schedule(timeoutDuration - idleFor);
      } else {
        timeoutRef.current = null;
        onTimeout();
      }
    }, delay);
  }, [timeoutDuration, onTimeout]);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastWriteRef.current >= WRITE_THROTTLE_MS) {
      lastWriteRef.current = now;
      writeLastActivity(now);
    }
    schedule(timeoutDuration);
  }, [schedule, timeoutDuration]);

  useEffect(() => {
    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, recordActivity, { passive: true })
    );

    // A newly opened tab or fresh login starts a full window.
    lastWriteRef.current = 0;
    recordActivity();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, recordActivity)
      );
    };
  }, [recordActivity]);

  return null;
};

export default useInactivityTimeout;
