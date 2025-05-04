import Home from "@/app/components/rewards/Home";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
    grantId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, grantId } = await params;

  const imageUrl = `${process.env.BUILDER_REWARDS_URL}/api/leaderboards/${id}/shareable?grant_id=${grantId}`;

  const frame = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Earn Builder Rewards",
      action: {
        type: "launch_frame",
        name: "Builder Rewards",
        url: "https://www.builderscore.xyz",
        splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
        splashBackgroundColor: "#0D0740",
      },
    },
  };

  return {
    openGraph: {
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return <Home />;
}
