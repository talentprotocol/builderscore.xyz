import { WideTabs } from "@/app/components/WideTabs";
import CredentialsList from "@/app/components/rewards/CredentialsList";

export default function ProfileTabs({ profileId }: { profileId: string }) {
  return (
    <WideTabs
      tabs={[
        {
          label: "Score",
          value: "score",
          content: <CredentialsList profileId={profileId} />,
        },
        {
          label: "Projects",
          value: "projects",
          content: 456,
        },
      ]}
      defaultTab="score"
    />
  );
}
