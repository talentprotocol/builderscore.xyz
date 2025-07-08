import { getQueryClient } from "@/app/lib/get-query-client";
import { TalentProjectsResponse } from "@/app/types/talent";

import ListItem from "./ListItem";

export default function ProjectsList({ profileId }: { profileId: string }) {
  const queryClient = getQueryClient();

  const projects = queryClient.getQueryData([
    "talentProjects",
    profileId,
  ]) as TalentProjectsResponse;

  const contributedProjects = queryClient.getQueryData([
    "talentContributedProjects",
    profileId,
  ]) as TalentProjectsResponse;

  const allProjects = [
    ...(projects?.projects || []),
    ...(contributedProjects?.projects || []),
  ];

  return (
    <div className="card-style mt-3 flex flex-col">
      {allProjects.map((project, index) => (
        <ListItem
          key={project.slug}
          left={
            <p className="text-sm text-neutral-800 dark:text-white">
              {project.name}
            </p>
          }
          right={
            <p className="truncate text-sm text-neutral-800 dark:text-white">
              {project.project_url}
            </p>
          }
          first={index === 0}
          last={index === allProjects.length - 1}
        />
      ))}
    </div>
  );
}
