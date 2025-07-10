"use client";

import Spinner from "@/app/components/Spinner";
import CredentialsListDrawer from "@/app/components/rewards/CredentialsListDrawer";
import ListItem from "@/app/components/rewards/ListItem";
import { useSponsor } from "@/app/context/SponsorContext";
import { DataIssuersLogos } from "@/app/lib/data-issuers-logos";
import { cn } from "@/app/lib/utils";
import { TalentCredential } from "@/app/types/talent";
import { cloneElement, useState } from "react";

export default function CredentialsList({
  credentials,
}: {
  credentials?: TalentCredential[];
}) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const { selectedSponsor } = useSponsor();

  const groupedCredentials =
    credentials?.reduce(
      (acc, credential) => {
        const group = credential.data_issuer_slug;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(credential);
        return acc;
      },
      {} as Record<string, TalentCredential[]>,
    ) || {};

  const groupedCredentialsWithTotalPoints = Object.entries(
    groupedCredentials,
  ).map(([group, credentials]) => {
    return {
      group,
      credentials,
      totalPoints: credentials.reduce(
        (acc, credential) => acc + credential.max_score,
        0,
      ),
      earnedPoints: credentials.reduce(
        (acc, credential) => acc + credential.points,
        0,
      ),
    };
  });

  const sortedGroupedCredentials = groupedCredentialsWithTotalPoints.sort(
    (a, b) => {
      if (a.earnedPoints > 0 && b.earnedPoints === 0) return -1;
      if (a.earnedPoints === 0 && b.earnedPoints > 0) return 1;

      return a.group.localeCompare(b.group);
    },
  );

  const activeGroupCredentials =
    sortedGroupedCredentials.find(({ group }) => group === activeGroup) || null;

  return (
    <div className="card-style mt-3 flex flex-col">
      {sortedGroupedCredentials.length > 0 ? (
        sortedGroupedCredentials.map(
          ({ group, credentials, totalPoints, earnedPoints }, index) => (
            <ListItem
              className={cn(earnedPoints === 0 && "opacity-50", "w-full")}
              key={group}
              left={
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                    {cloneElement(
                      DataIssuersLogos[group as keyof typeof DataIssuersLogos],
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

                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-neutral-800 dark:text-white">
                      {credentials[0].data_issuer_name}
                    </p>
                    <p className="secondary-text-style text-xs">
                      {credentials.reduce(
                        (acc, credential) => acc + credential.points,
                        0,
                      )}{" "}
                      / {totalPoints} points
                    </p>
                  </div>
                </div>
              }
              first={index === 0}
              last={index === Object.keys(sortedGroupedCredentials).length - 1}
              onClick={() => {
                setOpen(true);
                setActiveGroup(group);
              }}
            />
          ),
        )
      ) : (
        <Spinner className="flex h-16 w-full items-center justify-center" />
      )}

      <CredentialsListDrawer
        dataIssuerName={
          activeGroupCredentials?.credentials[0]?.data_issuer_name || ""
        }
        dataIssuerSlug={activeGroupCredentials?.group || ""}
        credentials={activeGroupCredentials?.credentials || []}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
