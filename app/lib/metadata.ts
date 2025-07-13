import { baseMetadata, celoMetadata } from "./constants";

export const getMetadata = (sponsorSlug: string) => {
  let metadata;

  switch (sponsorSlug) {
    case "base-summer":
      metadata = baseMetadata;
      break;
    case "base":
      metadata = baseMetadata;
      break;
    case "celo":
      metadata = celoMetadata;
      break;
    case "talent-protocol":
      metadata = baseMetadata;
      break;
    default:
      metadata = baseMetadata;
  }

  return metadata;
};
