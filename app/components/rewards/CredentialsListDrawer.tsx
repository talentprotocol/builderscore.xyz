import ListItem from "@/app/components/rewards/ListItem";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { useSponsor } from "@/app/context/SponsorContext";
import { DataIssuersLogos } from "@/app/lib/data-issuers-logos";
import { cn } from "@/app/lib/utils";
import { TalentCredential } from "@/app/types/talent";
import { cloneElement } from "react";

export default function CredentialsListDrawer({
  dataIssuerName,
  dataIssuerSlug,
  credentials,
  open,
  setOpen,
}: {
  dataIssuerName: string;
  dataIssuerSlug: string;
  credentials: TalentCredential[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { selectedSponsor } = useSponsor();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2 text-neutral-800 dark:text-white">
              <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                {dataIssuerSlug !== "" &&
                  cloneElement(
                    DataIssuersLogos[
                      dataIssuerSlug as keyof typeof DataIssuersLogos
                    ],
                    {
                      className: "block h-5 w-5",
                      color:
                        selectedSponsor?.slug === "talent-protocol"
                          ? "#fff"
                          : "#000",
                      altcolor:
                        selectedSponsor?.slug === "talent-protocol"
                          ? "#000"
                          : "#fff",
                    },
                  )}
              </div>

              <p className="text-sm text-neutral-800 dark:text-white">
                {dataIssuerName}
              </p>
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pt-0">
            <div className="card-style flex flex-col">
              {credentials.map((credential, index) => (
                <ListItem
                  key={credential.slug}
                  left={
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">
                          {credential.name}
                        </p>

                        <p className="secondary-text-style text-xs">
                          {credential.points} / {credential.max_score} points
                        </p>
                      </div>
                      <p className="secondary-text-style text-sm text-neutral-800 dark:text-white">
                        {credential.description}
                      </p>
                    </div>
                  }
                  className={cn(
                    credential.points === 0 && "opacity-50",
                    "w-full",
                  )}
                  first={index === 0}
                  last={index === credentials.length - 1}
                />
              ))}
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
