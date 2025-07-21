import Spinner from "@/app/components/Spinner";
import ListItem from "@/app/components/rewards/ListItem";
import { useSponsor } from "@/app/context/SponsorContext";
import { useTalentContributedProjects } from "@/app/hooks/useTalent";
import { useCallback, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

export default function ProjectsList({ profileId }: { profileId: string }) {
  const { selectedSponsor } = useSponsor();

  const {
    data: contributedProjectsData,
    error: contributedProjectsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTalentContributedProjects(profileId);

  const allProjects =
    contributedProjectsData?.pages.flatMap((page) => page.projects) || [];

  const handleScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const isNearBottom = documentHeight - (scrollTop + windowHeight) < 100;

    if (isNearBottom) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="card-style mt-3 flex flex-col">
      {allProjects.length > 0 ? (
        <>
          {allProjects.map((project, index) => (
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
              last={index === allProjects.length - 1}
            />
          ))}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          )}
        </>
      ) : contributedProjectsData ? (
        <div className="flex h-32 items-center justify-center">
          <p className="secondary-text-style text-sm">
            No contributed projects found
          </p>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center">
          <div className="flex items-center gap-2">
            {contributedProjectsError ? (
              <p className="secondary-text-style text-sm">
                {contributedProjectsError.message}
              </p>
            ) : (
              <Spinner className="flex h-16 w-full items-center justify-center" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
