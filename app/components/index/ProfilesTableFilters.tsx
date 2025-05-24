import { ClientOnly } from "@/app/components/ClientOnly";
import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import {
  Field,
  QueryBuilder as QueryBuilderComponent,
  RuleGroupType,
} from "react-querybuilder";

import { Badge } from "../ui/badge";

export default function ProfilesTableFilters({
  fields,
  query,
  setQuery,
}: {
  fields: Field[];
  query: RuleGroupType;
  setQuery: (query: RuleGroupType) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="button-style text-xs" size="sm">
            <FilterIcon className="text-neutral-500" />
            Filters
            {query.rules.length > 0 && (
              <Badge
                variant="outline"
                className="ml-0.5 h-4 w-4 rounded-xs border-none bg-neutral-700 p-0 text-[10px]"
              >
                {query.rules.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <ClientOnly>
            <QueryBuilderComponent
              fields={fields}
              query={query}
              onQueryChange={setQuery}
              controlClassnames={{
                queryBuilder: "bg-white text-black p-4",
              }}
            />
          </ClientOnly>
        </PopoverContent>
      </Popover>
    </div>
  );
}
