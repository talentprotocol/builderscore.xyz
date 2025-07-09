import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import ListItem from "@/app/components/rewards/ListItem";
import { TalentProject } from "@/app/types/talent";
import { ExternalLinkIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

export default function ProjectsList({
  contributedProjects,
}: {
  contributedProjects?: TalentProject[];
}) {
  return (
    <div className="card-style mt-3 flex flex-col">
      {contributedProjects!.map((project, index) => (
        <ListItem
          key={project.slug}
          left={
            <p className="py-3 text-sm font-semibold text-neutral-800 dark:text-white">
              {project.name}
            </p>
          }
          right={
            <div className="flex flex-col items-end">
              <MiniAppExternalLink
                href={project.project_url}
                className="flex flex-col items-end"
              >
                <div className="flex items-center gap-1">
                  {project.project_url.includes("github.com") ? (
                    <FaGithub className="size-4" />
                  ) : (
                    <MdOutlineToken className="size-4" />
                  )}
                  <ExternalLinkIcon className="size-4 opacity-50" />
                </div>
                <p className="secondary-text-style max-w-52 truncate text-sm text-neutral-800 dark:text-white">
                  {project.project_url.split("/").filter(Boolean).pop() ||
                    project.project_url}
                </p>
              </MiniAppExternalLink>
            </div>
          }
          first={index === 0}
          last={index === contributedProjects!.length - 1}
        />
      ))}
    </div>
  );
}
