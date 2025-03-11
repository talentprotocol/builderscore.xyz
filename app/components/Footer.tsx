import Link from "next/link";

export function Footer() {
  return (
    <div className="py-6">
      <p className="text-center text-neutral-500 text-sm">
        <Link
          className="underline"
          href="https://talentprotocol.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talent Protocol
        </Link>
        , {new Date().getFullYear()}
      </p>
    </div>
  );
}
