import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/app/components/ui/navigation-menu";
import { HomeIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function RewardsNavbar() {
  const navItems = [
    {
      label: "rewards",
      href: "/",
      icon: <HomeIcon />,
    },
    {
      label: "search",
      href: "/search",
      icon: <SearchIcon />,
    },
    {
      label: "profile",
      href: "/profile",
      icon: <UserIcon />,
    },
  ];

  return (
    <div className="border-top-style fixed bottom-0 left-0 w-full bg-white dark:bg-neutral-900">
      <NavigationMenu className="h-16 w-full max-w-none [&>*]:w-full">
        <NavigationMenuList className="w-full gap-0">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label} className="h-16 w-full flex-1">
              <NavigationMenuLink asChild className="rounded-none">
                <Link
                  href={item.href}
                  className="flex h-16 w-full items-center justify-center text-xl"
                >
                  {item.icon}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
