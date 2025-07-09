import { WideTabs } from "@/app/components/WideTabs";
import CredentialsList from "@/app/components/rewards/CredentialsList";
import ProjectsList from "@/app/components/rewards/ProjectsList";
import { TalentCredential, TalentProject } from "@/app/types/talent";

export default function ProfileTabs({
  credentials,
  contributedProjects,
}: {
  credentials?: TalentCredential[];
  contributedProjects?: TalentProject[];
}) {
  return (
    <WideTabs
      tabs={[
        {
          label: "Score",
          value: "score",
          content: <CredentialsList credentials={credentials} />,
        },
        {
          label: "Projects",
          value: "projects",
          content: <ProjectsList contributedProjects={contributedProjects} />,
        },
      ]}
      defaultTab="score"
    />
  );
}
