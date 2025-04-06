import RewardsHome from "@/app/components/rewards/RewardsHome";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
    grantId: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id, grantId } = await params;
  
  const imageUrl = `${process.env.BUILDER_REWARDS_URL}/api/leaderboards/${id}/shareable?grant_id=${grantId}`;

  return {
    title: "Builder Rewards",
    description: "Check out this builder's rewards on Builder Rewards",
    openGraph: {
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Builder Rewards",
      description: "Check out this builder's rewards on Builder Rewards",
      images: [imageUrl],
    },
  };
}

export default function SharePage() {
  return (
    <RewardsHome />
  );
}
