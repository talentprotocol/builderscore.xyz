import { useEffect } from "react";

export const useHistoryListener = (callback: (url: string) => void) => {
  useEffect(() => {
    const originalPushState = history.pushState;

    history.pushState = function (data, title, url) {
      originalPushState.apply(history, [data, title, url]);
      if (typeof url === "string") {
        callback(url);
      }
    };

    const handlePopState = () => {
      callback(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      history.pushState = originalPushState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [callback]);
};
