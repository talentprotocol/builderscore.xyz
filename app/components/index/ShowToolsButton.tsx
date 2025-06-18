import { Pencil } from "lucide-react";

export default function ShowToolsButton({
  showTools,
  setShowTools,
}: {
  showTools?: boolean;
  setShowTools?: (showTools: boolean) => void;
}) {
  return (
    <button
      className="button-style absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full opacity-50 hover:opacity-100"
      onClick={() => setShowTools?.(!showTools)}
    >
      <Pencil className="h-3 w-3" />
    </button>
  );
}
