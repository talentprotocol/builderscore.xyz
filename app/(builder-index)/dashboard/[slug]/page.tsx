import { getQueryClient } from "@/app/lib/get-query-client";
import config from "@/payload.config";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

async function getDashboard(slug: string) {
  const payload = await getPayload({ config });

  try {
    const result = await payload.find({
      collection: "dashboard",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    return result.docs[0] || null;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return null;
  }
}

interface DashboardPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { slug } = await params;

  const dashboard = await getDashboard(slug);
  const queryClient = getQueryClient();

  if (!dashboard) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <p>{dashboard.title}</p>
      </div>
    </HydrationBoundary>
  );
}
