import ListItem from "@/app/components/rewards/ListItem";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { TalentCredential } from "@/app/types/talent";

export default function CredentialsListDrawer({
  groupName,
  credentials,
  open,
  setOpen,
}: {
  groupName: string;
  credentials: TalentCredential[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-neutral-800 dark:text-white">
              {groupName}
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pt-0">
            <div className="card-style flex flex-col">
              {credentials.map((credential, index) => (
                <ListItem
                  key={credential.slug}
                  left={
                    <p className="text-sm text-neutral-800 dark:text-white">
                      {credential.name}
                    </p>
                  }
                  right={
                    <p className="text-sm text-neutral-800 dark:text-white">
                      {credential.points}
                    </p>
                  }
                  className="w-full"
                  first={index === 0}
                  last={index === credentials.length - 1}
                />
              ))}
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
