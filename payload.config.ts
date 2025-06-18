// storage-adapter-import-placeholder
import { ProfilesBlock } from "@/app/components/blocks/ProfilesBlock/config";
import { SectionBlock } from "@/app/components/blocks/SectionBlock/config";
import { TextBlock } from "@/app/components/blocks/TextBlock/config";
import { Dashboard } from "@/collections/Dashboard";
import { Media } from "@/collections/Media";
import { Users } from "@/collections/Users";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "Talent Protocol",
      description: "Talent Protocol CMS",
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/favicon.ico",
        },
      ],
    },
  },
  collections: [Users, Media, Dashboard],
  blocks: [SectionBlock, ProfilesBlock, TextBlock],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
