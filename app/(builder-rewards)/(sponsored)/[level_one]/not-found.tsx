import SearchProfiles from "@/app/components/rewards/SearchProfiles";

export default function NotFound() {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-lg font-medium text-neutral-800 dark:text-white">
          404, Not Found
        </h1>

        <p className="secondary-text-style text-sm">
          We couldn&apos;t find what you were looking for. Try searching for
          another Builder.
        </p>
      </div>

      <SearchProfiles />
    </div>
  );
}
