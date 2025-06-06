import { RenderBlocks } from "@/app/components/blocks/render";
import { Section as SectionProps } from "@/payload-types";

export const SectionBlock = (props: SectionProps) => {
  const { blocks, gap = "2", columns = "auto" } = props;

  const gapClasses = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
  };

  const columnsClass = {
    "1": "grid-cols-1",
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
    auto: "grid-cols-auto",
  };

  const sectionClasses = `grid ${columnsClass[columns as keyof typeof columnsClass]} ${gapClasses[gap as keyof typeof gapClasses]}`;

  return (
    <section className={sectionClasses}>
      <RenderBlocks blocks={blocks} />
    </section>
  );
};
