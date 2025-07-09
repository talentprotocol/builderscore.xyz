"use client";

import CreateAccountDrawer from "@/app/components/rewards/CreateAccountDrawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/app/components/ui/navigation-menu";
import { useSponsor } from "@/app/context/SponsorContext";
import { useUser } from "@/app/context/UserContext";
import { HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RewardsNavbar() {
  const [open, setOpen] = useState(false);

  const { frameContext } = useUser();
  const { selectedSponsor } = useSponsor();

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
      href: frameContext
        ? `${prefix}/${frameContext.user.fid}`
        : `${prefix}/login`,
      icon: <UserIcon />,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!frameContext) {
          event.preventDefault();
          setOpen(true);
        }
      },
    },
  ];

  return (
    <div className="border-colors fixed bottom-0 left-1/2 w-full -translate-x-1/2 overflow-hidden rounded-none border-t bg-white sm:bottom-4 sm:max-w-3xl sm:rounded-lg sm:border sm:shadow-xs dark:bg-neutral-900">
      <NavigationMenu className="h-16 w-full max-w-none [&>*]:w-full">
        <NavigationMenuList className="w-full gap-0">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label} className="h-16 w-full flex-1">
              <NavigationMenuLink asChild className="rounded-none">
                <Link
                  href={item.href}
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

      {!frameContext && <CreateAccountDrawer open={open} setOpen={setOpen} />}
    </div>
  );
}
