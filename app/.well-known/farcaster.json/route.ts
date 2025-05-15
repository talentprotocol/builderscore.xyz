import { headers } from "next/headers";

export async function GET() {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  console.log("subdomain from farcaster.json", subdomain);

  const baseJson = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIwNDQyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NDQ1Nzc2QzU4RDZmZkI0NWQ5YjlmNkQ2ODI0NkU5ODVFMTgzMDI2NSJ9",
      payload: "eyJkb21haW4iOiJ3d3cuYnVpbGRlcnNjb3JlLnh5eiJ9",
      signature:
        "MHhiYmUwOWM4ZTljYTc1Y2RiNjUwODZkZDRmMTIwM2M4YzM2NmE1ZDlhOTNkMjYzNjU3M2VkOTRmZjU3NjAzNDY0MDk5Mjk1ODQ2MDNhZjA3MjJlNmI5YmQyNGE1YjFkMDllNWVmYTE2ZGYzYmQ4NWY3MmYxMWRjYTVhZDNhMzhmZTFi",
    },
    frame: {
      version: "0.0.1",
      name: "Builder Rewards",
      homeUrl: "https://www.builderscore.xyz",
      iconUrl: "https://www.builderscore.xyz/images/icon.png",
      imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
      buttonTitle: "Earn Builder Rewards",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
      webhookUrl:
        "https://api.neynar.com/f/app/55d7c137-31ed-4fe8-bcf4-ae48bc6b13ac/event",
    },
  };

  const celoJson = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "0.0.1",
      name: "Celo Rewards",
      homeUrl: "https://celo.builderscore.xyz",
      iconUrl: "https://celo.builderscore.xyz/images/icon.png",
      imageUrl: "https://celo.builderscore.xyz/images/frame-image.png",
      buttonTitle: "Earn Celo Rewards",
      splashImageUrl: "https://celo.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
      webhookUrl:
        "https://api.neynar.com/f/app/55d7c137-31ed-4fe8-bcf4-ae48bc6b13ac/event",
    },
  };

  let json;

  switch (subdomain) {
    case "base":
      json = baseJson;
      break;
    case "celo":
      json = celoJson;
      break;
    case "talent-protocol":
      json = baseJson;
      break;
    default:
      json = baseJson;
  }

  return Response.json(json);
}
