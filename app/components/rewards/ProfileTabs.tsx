import { WideTabs } from "@/app/components/WideTabs";
import CredentialsList from "@/app/components/rewards/CredentialsList";
import ProjectsList from "@/app/components/rewards/ProjectsList";
import { TalentCredential } from "@/app/types/talent";

export default function ProfileTabs({
  credentials,
  profileId,
}: {
  credentials?: TalentCredential[];
  profileId: string;
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
          content: <ProjectsList profileId={profileId} />,
        },
      ]}
      defaultTab="score"
    />
  );
}
