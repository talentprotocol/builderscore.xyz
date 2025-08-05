import { headers } from "next/headers";

export async function GET() {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

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
      name: "Base Builder Rewards",
      homeUrl: "https://www.builderscore.xyz",
      iconUrl: "https://www.builderscore.xyz/images/icon.png",
      imageUrl: "https://www.builderscore.xyz/images/frame-image?v=1.png",
      buttonTitle: "Earn Base Builder Rewards",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
      webhookUrl:
        "https://api.neynar.com/f/app/55d7c137-31ed-4fe8-bcf4-ae48bc6b13ac/event",
    },
  };

  // TODO: Add webhookUrl
  const celoJson = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIwNDQyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NDQ1Nzc2QzU4RDZmZkI0NWQ5YjlmNkQ2ODI0NkU5ODVFMTgzMDI2NSJ9",
      payload: "eyJkb21haW4iOiJjZWxvLmJ1aWxkZXJzY29yZS54eXoifQ",
      signature:
        "MHhkMTkzY2RjOTc1YmQ1ZWM5NmNkYTk1ZDAzMzE5Y2FkODkzNGU2YWIzYTlmZjQ5N2EyOTg4ZTFhMjFhYTk3MzI2MjhjNTQ1MmM5MDU3MDNiZGIxYjYwMmE0ODBmMzQ5ZTJkZTEwMThhNDRlNDRlNTc5NjkzODYxYTY1NWE3ODYxZDFi",
    },
    frame: {
      version: "0.0.1",
      name: "Celo Builder Rewards",
      homeUrl: "https://celo.builderscore.xyz",
      iconUrl: "https://celo.builderscore.xyz/images/celo/icon.png",
      imageUrl: "https://celo.builderscore.xyz/images/celo/frame-image.png",
      buttonTitle: "Earn Celo Builder Rewards",
      splashImageUrl: "https://celo.builderscore.xyz/images/celo/icon.png",
      splashBackgroundColor: "#fcf6f1",
      webhookUrl: "https://celo.builderscore.xyz/webhook",
    },
  };

  const reownJson = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIwNDQyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4NDQ1Nzc2QzU4RDZmZkI0NWQ5YjlmNkQ2ODI0NkU5ODVFMTgzMDI2NSJ9",
      payload: "eyJkb21haW4iOiJyZW93bi5idWlsZGVyc2NvcmUueHl6In0",
      signature:
        "MHhkZTE3MGExZTM2NjJhMWUxNjE4YTUyZmYxNjYxZDI1NGVmYTA1YmE2MmU2NDQxMDUzNTdiNjU4ODJlY2RkNjU4NWJiYjM1ZjljYzI0NWU3YmNhY2E0ZThiMmRlZmViYzFjMzBlZTI3M2M4YTU4M2U5ZWU4ZWJkNWRkNzNjODMyZTFi",
    },
    frame: {
      version: "0.0.1",
      name: "WalletKit Builder Rewards",
      homeUrl: "https://reown.builderscore.xyz",
      iconUrl: "https://reown.builderscore.xyz/images/reown/icon.png", // TODO REOWN: Add icon url
      imageUrl: "https://reown.builderscore.xyz/images/reown/frame-image.png", // TODO REOWN: Add image url
      buttonTitle: "Earn WalletKit Builder Rewards",
      splashImageUrl: "https://reown.builderscore.xyz/images/reown/icon.png", // TODO REOWN: Add splash image url
      splashBackgroundColor: "#ffb800",
      webhookUrl:
        "https://api.neynar.com/f/app/95a0ed9e-3fac-4761-a711-ba6cce02f8b7/event",
    },
  };

  let json;

  switch (subdomain) {
    case "base-summer":
      json = baseJson;
      break;
    case "base":
      json = baseJson;
      break;
    case "celo":
      json = celoJson;
      break;
    case "reown":
      json = reownJson;
      break;
    case "talent-protocol":
      json = baseJson;
      break;
    default:
      json = baseJson;
  }

  return Response.json(json);
}
