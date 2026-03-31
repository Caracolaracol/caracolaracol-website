import { useEffect, useState } from "react";

type LastFmImage = {
  size: string;
  "#text": string;
};

type LastFmArtist = {
  name: string;
  playcount: string;
  url: string;
  image?: LastFmImage[];
};

type LastFmAlbum = {
  name: string;
  playcount: string;
  url: string;
  artist: { name: string };
  image?: LastFmImage[];
};

type LastFmTrack = {
  name: string;
  playcount: string;
  url: string;
  artist: { name: string };
  image?: LastFmImage[];
};

type LastFmUserInfo = {
  playcount: string;
  name: string;
  url: string;
};

type RankedItem = {
  name: string;
  subtitle?: string;
  playcount: number;
  url: string;
  artwork: string;
};

type StatsState = {
  totalScrobbles: number;
  topArtists: RankedItem[];
  topAlbums: RankedItem[];
  topTracks: RankedItem[];
};

interface LastFmStatsProps {
  username: string;
}

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

function getImage(images?: LastFmImage[]): string {
  return (
    images?.find((i) => i.size === "large")?.["#text"] ||
    images?.find((i) => i.size === "medium")?.["#text"] ||
    ""
  );
}

function RankedList({
  title,
  items,
  featured = false,
  showBars = false,
}: {
  title: string;
  items: RankedItem[];
  featured?: boolean;
  showBars?: boolean;
}) {
  if (items.length === 0) return null;
  const top = items[0];
  const rest = items.slice(1);
  const maxPlay = Math.max(...items.map((i) => i.playcount), 1);

  return (
    <div className="mt-5">
      <h3 className="text-sm font-tommyBold text-timberwolf mb-3">{title}</h3>

      {/* Top 1 */}
      {showBars ? (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-timberwolf mb-1">
            <a
              href={top.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cerise transition-colors truncate"
            >
              <span className="text-timberwolf/50">#1</span> {top.name}
            </a>
            <span>{top.playcount.toLocaleString()} plays</span>
          </div>
          <div className="w-full bg-snow/10 rounded-full h-2">
            <div
              className="bg-cerise h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max((top.playcount / maxPlay) * 100, 2)}%` }}
            />
          </div>
        </div>
      ) : (
        <a
          href={top.url}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 mb-3 group ${featured ? "gap-4" : ""}`}
        >
          <div className={`${featured ? "size-[40%] max-h-64 max-w-64" : "h-14 w-14"} shrink-0 overflow-hidden rounded-xl border border-snow/10`}>
            {top.artwork ? (
              <img
                src={top.artwork}
                alt={top.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-snow/10 flex items-center justify-center">
                <span className="font-chrono text-xl text-timberwolf/40">1</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm truncate group-hover:text-cerise transition-colors">
              <span className="text-timberwolf/50">#1</span> {top.name}
            </p>
            {top.subtitle && (
              <p className="text-xs text-timberwolf/70 truncate">{top.subtitle}</p>
            )}
          </div>
        </a>
      )}

      {/* Rest */}
      <div className={showBars ? "space-y-3" : "space-y-1.5"}>
        {rest.map((item, idx) => (
          <div
            key={item.name + (item.subtitle || "")}
            className="text-xs text-timberwolf min-w-0"
          >
            {showBars ? (
              <a href={item.url} target="_blank" rel="noreferrer" className="block hover:text-cerise transition-colors">
                <div className="flex justify-between mb-1">
                  <span className="truncate"><span className="text-timberwolf/50">#{idx + 2}</span> {item.name}</span>
                  <span className="shrink-0 ml-2">{item.playcount.toLocaleString()} plays</span>
                </div>
                <div className="w-full bg-snow/10 rounded-full h-2">
                  <div
                    className="bg-cerise h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max((item.playcount / maxPlay) * 100, 2)}%` }}
                  />
                </div>
              </a>
            ) : (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cerise transition-colors block truncate"
              >
                <span className="text-timberwolf/50">#{idx + 2}</span> {item.name}
                {item.subtitle && (
                  <span className="text-timberwolf/50"> · {item.subtitle}</span>
                )}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LastFmStats({ username }: LastFmStatsProps) {
  const apiKey = import.meta.env.PUBLIC_LASTFM_API_KEY;
  const [stats, setStats] = useState<StatsState | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "error" | "disabled"
  >(apiKey ? "loading" : "disabled");

  useEffect(() => {
    if (!apiKey) return;

    const resolvedApiKey: string = apiKey;
    let cancelled = false;

    async function fetchStats() {
      try {
        const baseParams = new URLSearchParams({
          api_key: resolvedApiKey,
          user: username,
          format: "json",
        });

        const [userRes, artistsRes, albumsRes, tracksRes] = await Promise.all([
          fetch(`${LASTFM_API_URL}?method=user.getinfo&${baseParams}`),
          fetch(
            `${LASTFM_API_URL}?method=user.gettopartists&${baseParams}&period=1month&limit=5`
          ),
          fetch(
            `${LASTFM_API_URL}?method=user.gettopalbums&${baseParams}&period=1month&limit=5`
          ),
          fetch(
            `${LASTFM_API_URL}?method=user.gettoptracks&${baseParams}&period=1month&limit=5`
          ),
        ]);

        if (!userRes.ok || !artistsRes.ok || !albumsRes.ok || !tracksRes.ok) {
          throw new Error("Last.fm request failed");
        }

        const [userData, artistsData, albumsData, tracksData] =
          await Promise.all([
            userRes.json(),
            artistsRes.json(),
            albumsRes.json(),
            tracksRes.json(),
          ]);

        const userInfo: LastFmUserInfo = userData.user;
        const artists: LastFmArtist[] =
          artistsData.topartists?.artist ?? [];
        const albums: LastFmAlbum[] =
          albumsData.topalbums?.album ?? [];
        const tracks: LastFmTrack[] =
          tracksData.toptracks?.track ?? [];

        if (!cancelled) {
          const albumArtMap = new Map<string, string>();
          albums.forEach((a) => {
            const art = getImage(a.image);
            if (art) albumArtMap.set(a.name.toLowerCase(), art);
          });

          // Artist images are no longer served by Last.fm API.
          // Search iTunes for a song by the artist to get artwork.
          let topArtistArt = "";
          if (artists.length > 0) {
            try {
              const itunesRes = await fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(artists[0].name)}&entity=song&limit=1`
              );
              if (itunesRes.ok) {
                const itunesData = await itunesRes.json();
                const artUrl = itunesData.results?.[0]?.artworkUrl100;
                if (artUrl) {
                  topArtistArt = artUrl.replace("100x100", "300x300");
                }
              }
            } catch {
              // silently ignore
            }
          }

          setStats({
            totalScrobbles: parseInt(userInfo.playcount, 10) || 0,
            topArtists: artists.map((a, i) => ({
              name: a.name,
              playcount: parseInt(a.playcount, 10) || 0,
              url: a.url,
              artwork: i === 0 ? topArtistArt : "",
            })),
            topAlbums: albums.map((a) => ({
              name: a.name,
              subtitle: a.artist.name,
              playcount: parseInt(a.playcount, 10) || 0,
              url: a.url,
              artwork: getImage(a.image),
            })),
            topTracks: tracks.map((t) => ({
              name: t.name,
              subtitle: t.artist.name,
              playcount: parseInt(t.playcount, 10) || 0,
              url: t.url,
              artwork: getImage(t.image) || "",
            })),
          });
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to fetch Last.fm stats", error);
          setStatus("error");
        }
      }
    }

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [apiKey, username]);

  return (
    <div className="w-full rounded-2xl border border-snow/12 border-dotted px-5 py-5 backdrop-blur-[2px]">
      <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-timberwolf tablet:text-xs mb-4">
        <span className="h-2 w-2 rounded-full bg-cerise" />
        <span>Last.fm · This Month</span>
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          <div className="h-10 w-32 animate-pulse rounded bg-snow/10" />
          <div className="h-3 w-full animate-pulse rounded bg-snow/10" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-snow/10" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-snow/10" />
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-timberwolf">Could not load Last.fm stats.</p>
      )}

      {status === "disabled" && (
        <p className="text-sm text-timberwolf">
          Add PUBLIC_LASTFM_API_KEY to enable.
        </p>
      )}

      {status === "ready" && stats && (
        <>
          {/* <div className="text-center">
            <p className="text-3xl font-chrono text-cerise">
              {stats.totalScrobbles.toLocaleString()}
            </p>
            <p className="text-xs text-timberwolf">Total Scrobbles</p>
          </div> */}

          <RankedList title="Monthly Top Albums" items={stats.topAlbums} featured />
          <RankedList title="Monthly Top Artists" items={stats.topArtists} showBars />
        </>
      )}
    </div>
  );
}
