"use client";

import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/app/components/ui/navigation-menu";
import { useSponsor } from "@/app/context/SponsorContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";
import { cn } from "@/app/lib/utils";
import { HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RewardsNavbar() {
  const [openHowToDrawer, setOpenHowToDrawer] = useState(false);

  const { frameContext } = useUser();
  const { selectedSponsor } = useSponsor();
  const { isMobile } = useTheme();

  const prefix = selectedSponsor ? `/${selectedSponsor.slug}` : "";

  const navItems = [
    {
      label: "rewards",
      href: `${prefix}/`,
      icon: <HomeIcon />,
    },
    {
      label: "search",
      href: `${prefix}/search`,
      icon: <SearchIcon />,
    },
    {
      label: "profile",
      href: frameContext && `${prefix}/${frameContext.user.username}`,
      icon: <UserIcon />,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!frameContext) {
          event.preventDefault();
          setOpenHowToDrawer(true);
        }
      },
    },
  ];

  return (
    <div
      className={cn(
        "border-colors fixed bottom-0 left-1/2 w-full -translate-x-1/2 overflow-hidden rounded-none border-t bg-white sm:bottom-4 sm:max-w-3xl sm:rounded-lg sm:border sm:shadow-xs dark:bg-neutral-900",
        frameContext && isMobile ? "pb-safe-mini-app" : "pb-safe",
      )}
    >
      <NavigationMenu className="h-16 w-full max-w-none [&>*]:w-full">
        <NavigationMenuList className="w-full gap-0">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label} className="h-16 w-full flex-1">
              <NavigationMenuLink asChild className="rounded-none">
                <Link
                  href={item?.href || ""}
                  onClick={item.onClick}
                  className="flex h-16 w-full items-center justify-center text-xl"
                >
                  {item.icon}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {!frameContext && (
        <HowToDrawer
          open={openHowToDrawer}
          onOpenChange={setOpenHowToDrawer}
          trigger={false}
        />
      )}
    </div>
  );
}
