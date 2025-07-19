"use client";

import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface NavigationContextType {
  isInternalNavigation: boolean;
  setInternalNavigation: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isInternalNavigation, setIsInternalNavigation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkInitialState = () => {
      const isInternal =
        sessionStorage.getItem("internal-navigation") === "true";
      const referrer = document.referrer;
      const currentDomain = window.location.hostname;

      if (
        isInternal ||
        (referrer && new URL(referrer).hostname === currentDomain)
      ) {
        setIsInternalNavigation(true);
      } else {
        setIsInternalNavigation(false);
      }
    };

    checkInitialState();

    const handleRouteChangeStart = () => {
      sessionStorage.setItem("internal-navigation", "true");
      setIsInternalNavigation(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("internal-navigation", "true");
      });
    }

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (...args) => {
      handleRouteChangeStart();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      handleRouteChangeStart();
      return originalReplace.apply(router, args);
    };

    router.back = (...args) => {
      handleRouteChangeStart();
      return originalBack.apply(router, args);
    };

    router.forward = (...args) => {
      handleRouteChangeStart();
      return originalForward.apply(router, args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [router]);

  const setInternalNavigation = (value: boolean) => {
    setIsInternalNavigation(value);
    sessionStorage.setItem("internal-navigation", value.toString());
  };

  return (
    <NavigationContext.Provider
      value={{
        isInternalNavigation,
        setInternalNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationSource() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error(
      "useNavigationSource must be used within a NavigationProvider",
    );
  }
  return context;
}
