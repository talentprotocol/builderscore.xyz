import { ProfilesBlock } from "@/app/components/blocks/ProfilesBlock/Component";
import { SectionBlock } from "@/app/components/blocks/SectionBlock/Component";
import { TextBlock } from "@/app/components/blocks/TextBlock/Component";
import {
  Profiles as ProfilesProps,
  Section as SectionProps,
  Text as TextProps,
} from "@/payload-types";
import { Fragment } from "react";

const blockComponents = {
  profiles: ProfilesBlock,
  section: SectionBlock,
  text: TextBlock,
};

export const RenderBlocks: React.FC<{
  blocks:
    | SectionProps["blocks"]
    | TextProps["blockType"]
    | ProfilesProps["blockType"];
}> = (props) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              // @ts-expect-error - Block component props don't perfectly match the union of all possible block types from PayloadCMS
              return <Block key={index} {...block} />;
            }
            return null;
          }
        })}
      </Fragment>
    );
  }
  return null;
};
