import Spinner from "@/app/components/Spinner";
import ListItem from "@/app/components/rewards/ListItem";
import { useSponsor } from "@/app/context/SponsorContext";
import { TalentProject } from "@/app/types/talent";
import { FaGithub } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

export default function ProjectsList({
  contributedProjects,
}: {
  contributedProjects?: TalentProject[];
}) {
  const { selectedSponsor } = useSponsor();

  return (
    <div className="card-style mt-3 flex flex-col">
      {contributedProjects ? (
        contributedProjects.map((project, index) => (
          <ListItem
            key={project.slug}
            href={project.project_url}
            left={
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                  {project.project_url.includes("github.com") ? (
                    <FaGithub
                      className="size-5"
                      color={
                        selectedSponsor?.slug === "talent-protocol"
                          ? "#fff"
                          : "#000"
                      }
                    />
                  ) : (
                    <MdOutlineToken
                      className="size-5"
                      color={
                        selectedSponsor?.slug === "talent-protocol"
                          ? "#fff"
                          : "#000"
                      }
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-medium text-neutral-800 dark:text-white">
                    {project.name}
                  </p>
                  <p className="secondary-text-style text-xs">
                    {project.project_url.includes("github.com")
                      ? "Github"
                      : "Onchain"}
                  </p>
                </div>
              </div>
            }
            right={
              <p className="secondary-text-style max-w-52 truncate text-sm text-neutral-800 dark:text-white">
                {project.project_url.split("/").filter(Boolean).pop() ||
                  project.project_url}
              </p>
            }
            first={index === 0}
            last={index === contributedProjects!.length - 1}
          />
        ))
      ) : (
        <Spinner className="flex h-16 w-full items-center justify-center" />
      )}
    </div>
  );
}
