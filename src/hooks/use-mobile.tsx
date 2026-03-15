import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024; // Tailwind lg

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/** True when viewport is lg (1024px) or wider. Use so only one form (mobile OR desktop) is in the DOM and React Hook Form doesn't lose values. */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => setIsDesktop(mql.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
