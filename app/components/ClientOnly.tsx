import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => "client";
const getServerSnapshot = () => "server";

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const value = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return value === "client" ? <>{children}</> : null;
};
