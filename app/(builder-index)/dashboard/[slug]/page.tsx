import { RenderBlocks } from "@/app/components/blocks/render";
import { getQueryClient } from "@/app/lib/get-query-client";
import { Section as SectionProps } from "@/payload-types";
import config from "@/payload.config";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
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
      <div className="flex flex-col gap-4">
        <div
          className="-ml-4 flex w-[calc(100%+2rem)] flex-col gap-1 px-4 pt-18 pb-4"
          style={{
            backgroundColor: `#${dashboard.color}`,
          }}
        >
          {dashboard.image &&
            typeof dashboard.image === "object" &&
            dashboard.image.url && (
              <Image
                src={dashboard.image.url}
                alt={dashboard.title}
                width={200}
                height={100}
                className="ml-0.5 h-6 w-auto self-start"
              />
            )}
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium">{dashboard.title}</h1>

          <p className="max-w-3xl text-sm text-neutral-500">
            {dashboard.description}
          </p>
        </div>

        <RenderBlocks blocks={dashboard.blocks as SectionProps["blocks"]} />
      </div>
    </HydrationBoundary>
  );
}
