import { useEffect, useState } from "react";

type LastFmImage = {
  size: string;
  "#text": string;
};

type LastFmTrack = {
  name: string;
  url: string;
  artist: {
    "#text": string;
  };
  album?: {
    "#text": string;
  };
  image?: LastFmImage[];
  date?: {
    "#text": string;
  };
  "@attr"?: {
    nowplaying?: string;
  };
};

type RecentTracksResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

type TrackState = {
  name: string;
  artist: string;
  album: string;
  artwork: string;
  url: string;
  nowPlaying: boolean;
  playedAt: string;
};

interface NowPlayingProps {
  username: string;
  profileUrl: string;
}

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
const REFRESH_INTERVAL_MS = 30000;

function getTrackArtwork(track: LastFmTrack) {
  return (
    track.image?.find((image) => image.size === "large")?.["#text"] ||
    track.image?.find((image) => image.size === "medium")?.["#text"] ||
    ""
  );
}

function normalizeTrack(track: LastFmTrack): TrackState {
  return {
    name: track.name,
    artist: track.artist?.["#text"] || "Unknown artist",
    album: track.album?.["#text"] || "",
    artwork: getTrackArtwork(track),
    url: track.url,
    nowPlaying: track["@attr"]?.nowplaying === "true",
    playedAt: track.date?.["#text"] || "",
  };
}

export default function NowPlaying({ username, profileUrl }: NowPlayingProps) {
  const apiKey = import.meta.env.PUBLIC_LASTFM_API_KEY;
  const [track, setTrack] = useState<TrackState | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "disabled">(
    apiKey ? "loading" : "disabled",
  );

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const resolvedApiKey: string = apiKey;

    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const url = new URL(LASTFM_API_URL);
        url.searchParams.set("method", "user.getrecenttracks");
        url.searchParams.set("user", username);
        url.searchParams.set("api_key", resolvedApiKey);
        url.searchParams.set("limit", "1");
        url.searchParams.set("format", "json");

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Last.fm request failed with ${response.status}`);
        }

        const data = (await response.json()) as RecentTracksResponse;
        const recentTrack = Array.isArray(data.recenttracks?.track)
          ? data.recenttracks?.track[0]
          : data.recenttracks?.track;

        if (!recentTrack) {
          throw new Error("No Last.fm tracks were returned");
        }

        if (!cancelled) {
          setTrack(normalizeTrack(recentTrack));
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to fetch Last.fm track", error);
          setStatus("error");
        }
      }
    }

    fetchNowPlaying();
    const intervalId = window.setInterval(fetchNowPlaying, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [apiKey, username]);

  const label = track?.nowPlaying ? "Now playing" : "Last played";

  return (
    <section className="mt-4 flex w-full justify-center px-4 pointer-events-auto">
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex w-full max-w-[16rem] tablet:max-w-[22rem] flex-col items-center gap-3 rounded-2xl border border-snow/12 border-dotted px-4 py-4 text-center backdrop-blur-[2px] transition-colors duration-300 hover:border-ocre/60"
      >
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-timberwolf tablet:text-xs">
          <span
            className={`h-2 w-2 rounded-full ${track?.nowPlaying ? "animate-pulse bg-cerise" : "bg-ocre"}`}
          />
          <span>{status === "loading" ? "Loading Last.fm" : label}</span>
        </div>

        <div className="flex w-full items-center justify-center gap-3 text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-snow/10">
            {status === "loading" ? (
              <div className="h-full w-full animate-pulse bg-snow/10" aria-hidden="true" />
            ) : track?.artwork ? (
              <img src={track.artwork} alt={`${track.name} cover art`} className="h-full w-full object-cover" />
            ) : (
              <span className="font-chrono text-3xl leading-none text-ocre">{`~`}</span>
            )}
          </div>

          <div className="min-w-0 flex flex-1 flex-col justify-center">
          {status === "ready" && track ? (
            <>
              <p className="max-w-full truncate !text-base tablet:!text-md">{track.name}</p>
              <p className="max-w-full truncate !font-tommyLight !text-xs text-timberwolf tablet:!text-sm">
                {track.artist}
                {track.album ? ` • ${track.album}` : ""}
              </p>
              {!track.nowPlaying && track.playedAt ? (
                <p className="max-w-full truncate !font-tommyLight !text-[0.7rem] text-timberwolf/80 tablet:!text-xs">
                  {track.playedAt}
                </p>
              ) : null}
            </>
          ) : null}

          {status === "loading" ? (
            <p className="!text-sm text-timberwolf">Checking what I am listening to...</p>
          ) : null}

          {status === "error" ? (
            <p className="!text-sm text-timberwolf">Open my Last.fm profile</p>
          ) : null}

          {status === "disabled" ? (
            <p className="!text-sm text-timberwolf">Last.fm widget ready. Add PUBLIC_LASTFM_API_KEY to enable live playback.</p>
          ) : null}
        </div>
        </div>

        {/* <span className="font-chrono text-4xl leading-none text-ocre transition-transform duration-300 group-hover:translate-y-1">
          {`>`}
        </span> */}
      </a>
    </section>
  );
}