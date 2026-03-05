import type { PreviewSessionDTO } from "@/lib/visualizer/types";

interface SessionListProps {
  sessions: PreviewSessionDTO[];
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <section aria-label="Saved preview sessions">
      <h2 className="mb-4 text-lg font-semibold text-zinc-800">
        Saved Previews
      </h2>

      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </ul>
      )}
    </section>
  );
}

function SessionCard({ session }: { session: PreviewSessionDTO }) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(session.createdAt));

  return (
    <li className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.previewImageUrl}
          alt={`Preview of ${session.wrapName} wrap`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {session.mode === "upload" ? "Your photo" : "Template"}
        </span>
      </div>
      <div className="p-4">
        <p className="font-medium text-zinc-800">{session.wrapName}</p>
        <p className="mt-0.5 text-xs text-zinc-400">
          <time dateTime={new Date(session.createdAt).toISOString()}>
            {formattedDate}
          </time>
        </p>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-8 py-12 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-600">No saved previews yet</p>
      <p className="mt-1 text-xs text-zinc-400">
        Upload a vehicle photo above to get started
      </p>
    </div>
  );
}
