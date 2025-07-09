"use client";

import CredentialsListDrawer from "@/app/components/rewards/CredentialsListDrawer";
import ListItem from "@/app/components/rewards/ListItem";
import { DataIssuersLogos } from "@/app/lib/data-issuers-logos";
import { TalentCredential } from "@/app/types/talent";
import { cloneElement, useState } from "react";

export default function CredentialsList({
  credentials,
}: {
  credentials?: TalentCredential[];
}) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

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
    };
  });

  const sortedGroupedCredentials = groupedCredentialsWithTotalPoints
    .filter(({ credentials }) =>
      credentials.some((credential) => credential.points > 0),
    )
    .sort((a, b) => a.group.localeCompare(b.group));

  const activeGroupCredentials =
    sortedGroupedCredentials.find(({ group }) => group === activeGroup) || null;

  return (
    <div className="card-style mt-3 flex flex-col">
      {sortedGroupedCredentials.map(
        ({ group, credentials, totalPoints }, index) => (
          <ListItem
            key={group}
            left={
              <div className="flex items-center gap-2">
                {cloneElement(
                  DataIssuersLogos[group as keyof typeof DataIssuersLogos],
                  {
                    className: "block h-4 w-4",
                    color: "#000",
                  },
                )}
                <p className="text-sm text-neutral-800 dark:text-white">
                  {credentials[0].data_issuer_name}
                </p>
              </div>
            }
            right={
              <p className="text-sm text-neutral-800 dark:text-white">
                {credentials.reduce(
                  (acc, credential) => acc + credential.points,
                  0,
                )}{" "}
                / {totalPoints}
              </p>
            }
            className="w-full"
            first={index === 0}
            last={index === Object.keys(sortedGroupedCredentials).length - 1}
            onClick={() => {
              setOpen(true);
              setActiveGroup(group);
            }}
          />
        ),
      )}

      <CredentialsListDrawer
        groupName={
          activeGroupCredentials?.credentials[0]?.data_issuer_name || ""
        }
        credentials={activeGroupCredentials?.credentials || []}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
