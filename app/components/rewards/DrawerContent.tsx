import { DrawerContent as DrawerContentPrimitive } from "@/app/components/ui/drawer";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";

export default function DrawerContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { frameContext } = useUser();
  const { isMobile } = useTheme();

  return (
    <DrawerContentPrimitive
      isFrameContext={!!frameContext}
      isMobile={isMobile}
      className={className}
    >
      {children}
    </DrawerContentPrimitive>
  );
}
