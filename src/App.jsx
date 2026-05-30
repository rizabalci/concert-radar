import { useState, useRef, useEffect, useMemo } from "react";

const CITIES = [
  { name: "Vienna", country: "AT", km: 0, tier: 0, travel: "Home", emoji: "🏠", cost: "€0" },
  { name: "Bratislava", country: "SK", km: 65, tier: 1, travel: "1h train", emoji: "🚆", cost: "~€15" },
  { name: "Graz", country: "AT", km: 200, tier: 1, travel: "2.5h train", emoji: "🚆", cost: "~€30" },
  { name: "Budapest", country: "HU", km: 245, tier: 1, travel: "2.5h train", emoji: "🚆", cost: "~€25" },
  { name: "Salzburg", country: "AT", km: 300, tier: 1, travel: "2.5h train", emoji: "🚆", cost: "~€35" },
  { name: "Prague", country: "CZ", km: 335, tier: 1, travel: "4h train", emoji: "🚆", cost: "~€30" },
  { name: "Munich", country: "DE", km: 360, tier: 1, travel: "4h train", emoji: "🚆", cost: "~€40" },
  { name: "Ljubljana", country: "SI", km: 380, tier: 1, travel: "4h train", emoji: "🚆", cost: "~€30" },
  { name: "Zagreb", country: "HR", km: 370, tier: 1, travel: "4h train", emoji: "🚆", cost: "~€30" },
  { name: "Krakow", country: "PL", km: 420, tier: 2, travel: "1h flight", emoji: "✈️", cost: "~€60" },
  { name: "Milan", country: "IT", km: 770, tier: 2, travel: "1.5h flight", emoji: "✈️", cost: "~€80" },
  { name: "Berlin", country: "DE", km: 680, tier: 2, travel: "1.5h flight", emoji: "✈️", cost: "~€70" },
  { name: "Zurich", country: "CH", km: 750, tier: 2, travel: "1.5h flight", emoji: "✈️", cost: "~€90" },
  { name: "Warsaw", country: "PL", km: 680, tier: 2, travel: "1.5h flight", emoji: "✈️", cost: "~€60" },
  { name: "Rome", country: "IT", km: 1110, tier: 2, travel: "2h flight", emoji: "✈️", cost: "~€100" },
  { name: "Hamburg", country: "DE", km: 930, tier: 2, travel: "1.5h flight", emoji: "✈️", cost: "~€80" },
  { name: "Copenhagen", country: "DK", km: 1040, tier: 2, travel: "2h flight", emoji: "✈️", cost: "~€90" },
  { name: "Amsterdam", country: "NL", km: 1150, tier: 3, travel: "2h flight", emoji: "✈️", cost: "~€100" },
  { name: "Brussels", country: "BE", km: 1120, tier: 3, travel: "2h flight", emoji: "✈️", cost: "~€90" },
  { name: "Paris", country: "FR", km: 1240, tier: 3, travel: "2.5h flight", emoji: "✈️", cost: "~€120" },
  { name: "London", country: "UK", km: 1500, tier: 3, travel: "2.5h flight", emoji: "✈️", cost: "~€130" },
  { name: "Barcelona", country: "ES", km: 1870, tier: 3, travel: "2.5h flight", emoji: "✈️", cost: "~€110" },
  { name: "Madrid", country: "ES", km: 2310, tier: 3, travel: "3h flight", emoji: "✈️", cost: "~€120" },
  { name: "Stockholm", country: "SE", km: 1580, tier: 3, travel: "2.5h flight", emoji: "✈️", cost: "~€110" },
  { name: "Lisbon", country: "PT", km: 2920, tier: 3, travel: "3.5h flight", emoji: "✈️", cost: "~€140" },
  { name: "Dublin", country: "IE", km: 1890, tier: 3, travel: "3h flight", emoji: "✈️", cost: "~€130" },
  { name: "Istanbul", country: "TR", km: 1760, tier: 3, travel: "2.5h flight", emoji: "✈️", cost: "~€100" },
];

const TIER_LABELS = {
  0: { label: "Home", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
  1: { label: "Day Trip / Overnight", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
  2: { label: "Weekend Trip", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  3: { label: "Plan Around It", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

const GENRES = ["All Genres", "Rock", "Pop", "Electronic", "Jazz", "Classical", "Hip-Hop", "Metal", "Indie", "R&B", "Latin", "Folk"];

const TIMEFRAMES = [
  { label: "This week", value: "this week" },
  { label: "2 weeks", value: "next 2 weeks" },
  { label: "1 month", value: "next month" },
  { label: "2 months", value: "next 2 months" },
  { label: "3 months", value: "next 3 months" },
];

function TierBadge({ tier, small }) {
  const t = TIER_LABELS[tier];
  return (
    <span style={{
      fontSize: small ? 10 : 11, color: t.color,
      background: t.bg, border: `1px solid ${t.border}`,
      padding: small ? "2px 7px" : "3px 10px", borderRadius: 20,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {t.label}
    </span>
  );
}

function HeartButton({ active, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 18, padding: 4, lineHeight: 1,
        transition: "transform 0.2s",
        transform: active ? "scale(1.15)" : "scale(1)",
        filter: active ? "none" : "grayscale(1) opacity(0.35)",
      }}
      title={active ? "Remove from shortlist" : "Save to shortlist"}
    >
      {active ? "❤️" : "🤍"}
    </button>
  );
}

function PreviewLinks({ spotifyUrl, youtubeUrl }) {
  if (!spotifyUrl && !youtubeUrl) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {spotifyUrl && (
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Preview on Spotify"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "#1db954", textDecoration: "none",
            background: "rgba(29,185,84,0.1)",
            border: "1px solid rgba(29,185,84,0.2)",
            padding: "3px 9px", borderRadius: 20,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            cursor: "pointer", position: "relative", zIndex: 2,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1db954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Spotify
        </a>
      )}
      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Watch on YouTube"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, color: "#ff0000", textDecoration: "none",
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.18)",
            padding: "3px 9px", borderRadius: 20,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            cursor: "pointer", position: "relative", zIndex: 2,
          }}
        >
          <svg width="13" height="10" viewBox="0 0 24 17" fill="#ff0000">
            <path d="M23.498 2.186a3.016 3.016 0 0 0-2.122-2.136C19.505 0 12 0 12 0S4.495 0 2.624.05A3.016 3.016 0 0 0 .502 2.186 31.82 31.82 0 0 0 0 8.449a31.82 31.82 0 0 0 .502 6.263 3.016 3.016 0 0 0 2.122 2.136C4.495 16.898 12 16.898 12 16.898s7.505 0 9.376-.05a3.016 3.016 0 0 0 2.122-2.136A31.82 31.82 0 0 0 24 8.449a31.82 31.82 0 0 0-.502-6.263zM9.545 12.069V4.83l6.273 3.62-6.273 3.62z"/>
          </svg>
          YouTube
        </a>
      )}
    </div>
  );
}

function parseEventDate(dateStr) {
  if (!dateStr) return null;
  try {
    // Try parsing "Mon DD, YYYY" or similar formats
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  } catch {}
  return null;
}

function buildGoogleCalUrl(concert, cityData) {
  const parsed = parseEventDate(concert.date);
  let dateParam;
  if (parsed) {
    // All-day event format: YYYYMMDD/YYYYMMDD (next day)
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const next = new Date(parsed);
    next.setDate(next.getDate() + 1);
    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    dateParam = `${y}${m}${day}/${ny}${nm}${nd}`;
  } else {
    // Fallback: no date
    dateParam = "";
  }

  const title = encodeURIComponent(`🎵 ${concert.artist} — Live Concert`);
  const location = encodeURIComponent(
    [concert.venue, concert.city].filter(Boolean).join(", ")
  );
  const details = encodeURIComponent(
    [
      concert.artistInfo || "",
      concert.genre ? `Genre: ${concert.genre}` : "",
      concert.price ? `Price: ${concert.price}` : "",
      cityData?.travel ? `Travel from Vienna: ${cityData.travel} (${cityData.cost})` : "",
      concert.ticketUrl ? `Tickets: ${concert.ticketUrl}` : "",
      concert.spotifyUrl ? `Spotify: ${concert.spotifyUrl}` : "",
    ].filter(Boolean).join("\n")
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}${dateParam ? `&dates=${dateParam}` : ""}&location=${location}&details=${details}`;
}

function CalendarButton({ concert, cityData }) {
  const url = buildGoogleCalUrl(concert, cityData);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Add to Google Calendar"
      onClick={e => e.stopPropagation()}
      style={{
        fontSize: 16, padding: 4, lineHeight: 1,
        opacity: 0.4, textDecoration: "none",
        position: "relative", zIndex: 2,
        cursor: "pointer",
      }}
    >
      📅
    </a>
  );
}

function ConcertCard({ concert, index, isFavorite, onToggleFavorite }) {
  const cityData = CITIES.find(c => c.name === concert.city) || {};
  const tier = cityData.tier ?? 2;
  const tierInfo = TIER_LABELS[tier];

  return (
    <div
      style={{
        background: isFavorite ? "rgba(255,138,76,0.04)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isFavorite ? "rgba(255,138,76,0.15)" : "rgba(255,255,255,0.07)"}`,
        borderLeft: `3px solid ${tierInfo.color}`,
        borderRadius: 14,
        padding: "18px 20px",
        animation: `fadeSlideUp 0.35s ease ${index * 0.04}s both`,
        transition: "border-color 0.2s, background 0.2s, transform 0.15s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isFavorite ? "rgba(255,138,76,0.06)" : "rgba(255,255,255,0.055)";
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isFavorite ? "rgba(255,138,76,0.04)" : "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {/* Top row: artist + heart + distance */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6, position: "relative", zIndex: 2 }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 16, fontWeight: 700, color: "#fff",
          lineHeight: 1.3, flex: 1, minWidth: 0,
        }}>
          {concert.artist}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontSize: 12, color: tierInfo.color,
            fontFamily: "'DM Mono', monospace", fontWeight: 600,
          }}>
            {cityData.km || "?"}km
          </span>
          <CalendarButton concert={concert} cityData={cityData} />
          <HeartButton active={isFavorite} onClick={onToggleFavorite} />
        </div>
      </div>

      {/* Artist info */}
      {concert.artistInfo && (
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.38)",
          marginBottom: 8, fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.5, fontStyle: "italic",
        }}>
          {concert.artistInfo}
        </div>
      )}

      {/* Preview links */}
      <div style={{ marginBottom: 8, position: "relative", zIndex: 2, pointerEvents: "auto" }}>
        <PreviewLinks spotifyUrl={concert.spotifyUrl} youtubeUrl={concert.youtubeUrl} />
      </div>

      {/* Venue + City */}
      <div style={{
        fontSize: 13, color: "rgba(255,255,255,0.45)",
        marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
        display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center",
      }}>
        <span>{cityData.emoji} {concert.city}</span>
        {concert.venue && <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>}
        {concert.venue && <span>{concert.venue}</span>}
      </div>

      {/* Tags row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", position: "relative", zIndex: 2 }}>
        {concert.date && (
          <span style={{
            fontSize: 11, color: "#ff8a4c",
            background: "rgba(255,138,76,0.12)",
            padding: "3px 10px", borderRadius: 20,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          }}>
            {concert.date}
          </span>
        )}
        <TierBadge tier={tier} small />
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.05)",
          padding: "3px 8px", borderRadius: 20,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {cityData.travel} · {cityData.cost}
        </span>
        {concert.genre && (
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            padding: "3px 8px", borderRadius: 20,
          }}>
            {concert.genre}
          </span>
        )}
        {concert.price && (
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)",
            padding: "3px 8px", borderRadius: 20,
          }}>
            🎫 {concert.price}
          </span>
        )}
        {concert.ticketUrl && (
          <a
            href={concert.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11, color: "#ff8a4c",
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "none", fontWeight: 600,
              marginLeft: "auto",
              position: "relative", zIndex: 2,
              cursor: "pointer",
            }}
          >
            Tickets →
          </a>
        )}
      </div>
    </div>
  );
}

function ChipToggle({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 20,
        fontSize: 12, fontWeight: active ? 700 : 500,
        fontFamily: "'DM Sans', sans-serif",
        background: active ? (color || "rgba(255,138,76,0.15)") : "rgba(255,255,255,0.04)",
        border: `1px solid ${active ? (color || "rgba(255,138,76,0.3)") : "rgba(255,255,255,0.08)"}`,
        color: active ? "#fff" : "rgba(255,255,255,0.4)",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function DistanceSlider({ value, onChange }) {
  return (
    <div>
      <input
        type="range"
        min={50}
        max={3500}
        step={50}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 4,
          appearance: "none", background: "rgba(255,255,255,0.1)",
          borderRadius: 4, outline: "none",
          accentColor: "#ff6b35",
        }}
      />
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 10, color: "rgba(255,255,255,0.25)",
        marginTop: 4, fontFamily: "'DM Mono', monospace",
      }}>
        <span>50km</span>
        <span style={{ color: "#ff8a4c", fontWeight: 700, fontSize: 12 }}>≤ {value}km</span>
        <span>3500km</span>
      </div>
    </div>
  );
}

// Real concerts found for Apr-Jun 2026 — used for demo mode (no API key needed)
const DEMO_CONCERTS = [
  // Vienna
  { artist: "Worakls Orchestra", city: "Vienna", venue: "Raiffeisen Halle, Gasometer", date: "Apr 2, 2026", genre: "Electronic", artistInfo: "French electronic/neoclassical producer performing a full orchestral live show blending techno with classical instrumentation.", spotifyUrl: "https://open.spotify.com/search/Worakls", youtubeUrl: "https://www.youtube.com/results?search_query=Worakls+Orchestra+live", price: null, ticketUrl: "https://www.ticketmaster.at/discover/wien" },
  { artist: "Louis Tomlinson", city: "Vienna", venue: "Marx Halle", date: "Apr 6, 2026", genre: "Pop", artistInfo: "Former One Direction member touring his solo pop-rock material on the How Did We Get Here? World Tour.", spotifyUrl: "https://open.spotify.com/search/Louis%20Tomlinson", youtubeUrl: "https://www.youtube.com/results?search_query=Louis+Tomlinson+live", price: null, ticketUrl: "https://www.ticketmaster.at/discover/wien" },
  { artist: "GoGo Penguin", city: "Vienna", venue: "Vienna", date: "Apr 2026", genre: "Jazz", artistInfo: "UK jazz/electronic trio known for mesmerizing piano-driven instrumental compositions.", spotifyUrl: "https://open.spotify.com/search/GoGo%20Penguin", youtubeUrl: "https://www.youtube.com/results?search_query=GoGo+Penguin+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },
  { artist: "Tinariwen", city: "Vienna", venue: "Arena Wien", date: "Apr 25, 2026", genre: "Folk", artistInfo: "Grammy-winning Tuareg desert blues collective from Mali, famed for hypnotic guitar-driven live shows.", spotifyUrl: "https://open.spotify.com/search/Tinariwen", youtubeUrl: "https://www.youtube.com/results?search_query=Tinariwen+live", price: null, ticketUrl: "https://www.ticketmaster.at/discover/wien" },
  { artist: "Christopher Cross", city: "Vienna", venue: "Raiffeisen Halle, Gasometer", date: "Apr 29, 2026", genre: "Rock", artistInfo: "American singer-songwriter behind smooth rock classics like Sailing and Ride Like the Wind.", spotifyUrl: "https://open.spotify.com/search/Christopher%20Cross", youtubeUrl: "https://www.youtube.com/results?search_query=Christopher+Cross+live", price: null, ticketUrl: "https://www.ticketmaster.at/discover/wien" },
  { artist: "Ne-Yo & Akon", city: "Vienna", venue: "Halle D, Wiener Stadthalle", date: "May 30, 2026", genre: "R&B", artistInfo: "Double-headline R&B and pop show from two chart-topping hitmakers of the 2000s.", spotifyUrl: "https://open.spotify.com/search/Ne-Yo", youtubeUrl: "https://www.youtube.com/results?search_query=Ne-Yo+Akon+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },
  { artist: "Conan Gray", city: "Vienna", venue: "Halle D, Wiener Stadthalle", date: "Jun 1, 2026", genre: "Pop", artistInfo: "American singer-songwriter and Gen-Z pop star known for emotional bedroom-pop anthems.", spotifyUrl: "https://open.spotify.com/search/Conan%20Gray", youtubeUrl: "https://www.youtube.com/results?search_query=Conan+Gray+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },
  { artist: "Garbage", city: "Vienna", venue: "Arena Wien", date: "Jun 8, 2026", genre: "Rock", artistInfo: "90s alt-rock icons fronted by Shirley Manson, blending grunge, electronica and pop hooks.", spotifyUrl: "https://open.spotify.com/search/Garbage", youtubeUrl: "https://www.youtube.com/results?search_query=Garbage+band+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },
  { artist: "Tricky", city: "Vienna", venue: "WUK", date: "Jun 8, 2026", genre: "Electronic", artistInfo: "Bristol trip-hop pioneer, a key figure of the 90s Massive Attack scene with a dark atmospheric sound.", spotifyUrl: "https://open.spotify.com/search/Tricky", youtubeUrl: "https://www.youtube.com/results?search_query=Tricky+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },
  { artist: "Dermot Kennedy", city: "Vienna", venue: "Raiffeisen Halle, Gasometer", date: "Jun 8, 2026", genre: "Folk", artistInfo: "Irish folk-pop singer with a powerful raspy voice, known for anthemic emotional ballads.", spotifyUrl: "https://open.spotify.com/search/Dermot%20Kennedy", youtubeUrl: "https://www.youtube.com/results?search_query=Dermot+Kennedy+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/26771-austria-vienna" },

  // Bratislava
  { artist: "Alvaro Soler", city: "Bratislava", venue: "Aegon Arena", date: "May 6, 2026", genre: "Pop", artistInfo: "Spanish-German pop singer known for sunny multilingual hits like Sofia and El Mismo Sol.", spotifyUrl: "https://open.spotify.com/search/Alvaro%20Soler", youtubeUrl: "https://www.youtube.com/results?search_query=Alvaro+Soler+live", price: null, ticketUrl: "https://www.shazam.com/events/bratislava-slovakia" },
  { artist: "Iron Maiden + Anthrax", city: "Bratislava", venue: "Tehelné Pole Stadium", date: "May 30, 2026", genre: "Metal", artistInfo: "Legendary British heavy metal band Iron Maiden with thrash icons Anthrax, an epic outdoor stadium show.", spotifyUrl: "https://open.spotify.com/search/Iron%20Maiden", youtubeUrl: "https://www.youtube.com/results?search_query=Iron+Maiden+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/32262-slovakia-bratislava" },
  { artist: "Zucchero", city: "Bratislava", venue: "Ondrej Nepela Arena", date: "Jun 12, 2026", genre: "Rock", artistInfo: "Italian blues-rock legend with a gravelly voice, one of Europe's best-selling live artists.", spotifyUrl: "https://open.spotify.com/search/Zucchero", youtubeUrl: "https://www.youtube.com/results?search_query=Zucchero+live", price: null, ticketUrl: "https://www.shazam.com/events/bratislava-slovakia" },
  { artist: "Sting", city: "Bratislava", venue: "Ondrej Nepela Arena", date: "Jun 20, 2026", genre: "Rock", artistInfo: "Former The Police frontman performing his STING 3.0 tour in a stripped-back three-piece rock format.", spotifyUrl: "https://open.spotify.com/search/Sting", youtubeUrl: "https://www.youtube.com/results?search_query=Sting+live", price: null, ticketUrl: "https://www.shazam.com/events/bratislava-slovakia" },
  { artist: "Scorpions", city: "Bratislava", venue: "Tipos Aréna", date: "Jun 30, 2026", genre: "Rock", artistInfo: "German hard rock legends behind Wind of Change and Rock You Like a Hurricane.", spotifyUrl: "https://open.spotify.com/search/Scorpions", youtubeUrl: "https://www.youtube.com/results?search_query=Scorpions+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/32262-slovakia-bratislava" },

  // Budapest
  { artist: "Pentatonix", city: "Budapest", venue: "MVM Dome", date: "Apr 7, 2026", genre: "Pop", artistInfo: "Grammy-winning American a cappella group redefining vocal pop with inventive arrangements.", spotifyUrl: "https://open.spotify.com/search/Pentatonix", youtubeUrl: "https://www.youtube.com/results?search_query=Pentatonix+live", price: null, ticketUrl: "https://www.bandsintown.com/c/budapest-hungary" },
  { artist: "5 Seconds of Summer", city: "Budapest", venue: "MVM Dome", date: "Apr 24, 2026", genre: "Rock", artistInfo: "Australian pop-rock band touring fresh material from their upcoming album Everyone's a Star!", spotifyUrl: "https://open.spotify.com/search/5%20Seconds%20of%20Summer", youtubeUrl: "https://www.youtube.com/results?search_query=5+Seconds+of+Summer+live", price: null, ticketUrl: "https://www.bandsintown.com/c/budapest-hungary" },
  { artist: "Eric Clapton", city: "Budapest", venue: "MVM Dome", date: "May 2, 2026", genre: "Rock", artistInfo: "Multiple Grammy-winning guitar legend nicknamed Slowhand, his first Budapest show in 20 years.", spotifyUrl: "https://open.spotify.com/search/Eric%20Clapton", youtubeUrl: "https://www.youtube.com/results?search_query=Eric+Clapton+live", price: null, ticketUrl: "https://welovebudapest.com/en/toplist/budapest-concerts-2026/" },
  { artist: "Tori Amos", city: "Budapest", venue: "Erkel Theatre", date: "May 3, 2026", genre: "Rock", artistInfo: "American singer-songwriter and pianist known for confessional art-rock and a distinctive voice.", spotifyUrl: "https://open.spotify.com/search/Tori%20Amos", youtubeUrl: "https://www.youtube.com/results?search_query=Tori+Amos+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/29047-hungary-budapest" },
  { artist: "Snarky Puppy & Söndörgő", city: "Budapest", venue: "Müpa Budapest", date: "May 5, 2026", genre: "Jazz", artistInfo: "Grammy-winning American instrumental fusion collective meeting Hungarian folk band Söndörgő.", spotifyUrl: "https://open.spotify.com/search/Snarky%20Puppy", youtubeUrl: "https://www.youtube.com/results?search_query=Snarky+Puppy+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/29047-hungary-budapest" },
  { artist: "Hang Massive", city: "Budapest", venue: "Akvárium Klub", date: "May 2, 2026", genre: "Folk", artistInfo: "Handpan duo creating mesmerizing, meditative ambient soundscapes.", spotifyUrl: "https://open.spotify.com/search/Hang%20Massive", youtubeUrl: "https://www.youtube.com/results?search_query=Hang+Massive+live", price: null, ticketUrl: "https://www.songkick.com/metro-areas/29047-hungary-budapest" },
  { artist: "Metallica", city: "Budapest", venue: "Puskás Aréna", date: "Jun 11, 2026", genre: "Metal", artistInfo: "The biggest metal band in the world, M72 No Repeat Weekend with two completely different setlists.", spotifyUrl: "https://open.spotify.com/search/Metallica", youtubeUrl: "https://www.youtube.com/results?search_query=Metallica+live", price: null, ticketUrl: "https://welovebudapest.com/en/toplist/budapest-concerts-2026/" },
  { artist: "Mac DeMarco", city: "Budapest", venue: "Budapest Park", date: "Jun 23, 2026", genre: "Indie", artistInfo: "Laid-back Canadian indie singer-songwriter known for jangly slacker-rock and a relaxed live presence.", spotifyUrl: "https://open.spotify.com/search/Mac%20DeMarco", youtubeUrl: "https://www.youtube.com/results?search_query=Mac+DeMarco+live", price: null, ticketUrl: "https://welovebudapest.com/en/toplist/budapest-concerts-2026/" },

  // Prague
  { artist: "Iron Maiden", city: "Prague", venue: "Letňany", date: "Jun 2026", genre: "Metal", artistInfo: "Legendary British heavy metal band on their Run For Your Lives world tour.", spotifyUrl: "https://open.spotify.com/search/Iron%20Maiden", youtubeUrl: "https://www.youtube.com/results?search_query=Iron+Maiden+live", price: null, ticketUrl: "https://www.songkick.com" },

  // Munich
  { artist: "Volbeat", city: "Munich", venue: "Munich", date: "Jun 2026", genre: "Metal", artistInfo: "Danish rock/metal band blending heavy metal with rockabilly and Elvis-style vocals.", spotifyUrl: "https://open.spotify.com/search/Volbeat", youtubeUrl: "https://www.youtube.com/results?search_query=Volbeat+live", price: null, ticketUrl: "https://www.songkick.com" },

  // Berlin
  { artist: "Empire of the Sun", city: "Berlin", venue: "Berlin", date: "Jun 2026", genre: "Electronic", artistInfo: "Australian electronic/synth-pop duo famed for theatrical costumes and the hit Walking on a Dream.", spotifyUrl: "https://open.spotify.com/search/Empire%20of%20the%20Sun", youtubeUrl: "https://www.youtube.com/results?search_query=Empire+of+the+Sun+live", price: null, ticketUrl: "https://www.songkick.com" },
];

export default function ConcertRadar() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState([]);
  const [completedCities, setCompletedCities] = useState([]);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const [searched, setSearched] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // API Key (stored in localStorage for convenience)
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem('concert_radar_api_key') || ''; } catch { return ''; }
  });
  const saveApiKey = (key) => {
    setApiKey(key);
    try { localStorage.setItem('concert_radar_api_key', key); } catch {}
  };

  const loadDemoData = () => {
    setError(null);
    setDebugInfo("");
    setConcerts(DEMO_CONCERTS);
    setCompletedCities([...new Set(DEMO_CONCERTS.map(c => c.city))]);
    setLoadingCities([]);
    setLoading(false);
    setSearched(true);
    setDemoMode(true);
    setShowFavoritesOnly(false);
  };

  // Auto-load demo data on first visit so the app is never empty
  useEffect(() => {
    loadDemoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Favorites
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filters
  const [maxDistance, setMaxDistance] = useState(1500);
  const [activeTiers, setActiveTiers] = useState(new Set([0, 1, 2, 3]));
  const [genre, setGenre] = useState("All Genres");
  const [timeframe, setTimeframe] = useState("next 2 months");
  const [sortBy, setSortBy] = useState("distance");
  const [searchText, setSearchText] = useState("");

  const resultsRef = useRef(null);
  const abortRef = useRef(false);

  const concertKey = (c) => `${c.artist}||${c.city}||${c.date}`;

  const toggleFavorite = (concert) => {
    const key = concertKey(concert);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleTier = (t) => {
    setActiveTiers(prev => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };

  const eligibleCities = useMemo(() =>
    CITIES.filter(c => c.km <= maxDistance && activeTiers.has(c.tier)),
    [maxDistance, activeTiers]
  );

  const filteredConcerts = useMemo(() => {
    let filtered = concerts.filter(c => {
      const cityData = CITIES.find(ci => ci.name === c.city);
      if (!cityData) return false;
      if (cityData.km > maxDistance) return false;
      if (!activeTiers.has(cityData.tier)) return false;
      if (genre !== "All Genres" && c.genre && !c.genre.toLowerCase().includes(genre.toLowerCase())) return false;
      if (showFavoritesOnly && !favorites.has(concertKey(c))) return false;
      if (searchText) {
        const q = searchText.toLowerCase();
        const match = (c.artist || "").toLowerCase().includes(q)
          || (c.city || "").toLowerCase().includes(q)
          || (c.venue || "").toLowerCase().includes(q)
          || (c.genre || "").toLowerCase().includes(q)
          || (c.artistInfo || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (sortBy === "distance") {
      filtered.sort((a, b) => {
        const da = CITIES.find(c => c.name === a.city)?.km || 9999;
        const db = CITIES.find(c => c.name === b.city)?.km || 9999;
        return da - db;
      });
    } else if (sortBy === "date") {
      filtered.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    } else if (sortBy === "city") {
      filtered.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
    }

    return filtered;
  }, [concerts, maxDistance, activeTiers, genre, searchText, sortBy, showFavoritesOnly, favorites]);

  const searchAllCities = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Anthropic API key above to search.");
      return;
    }
    abortRef.current = false;
    setLoading(true);
    setError(null);
    setDebugInfo("");
    setConcerts([]);
    setSearched(true);
    setDemoMode(false);
    setCompletedCities([]);
    setLoadingCities([]);
    setFavorites(new Set());
    setShowFavoritesOnly(false);

    const citiesToSearch = CITIES.filter(c => c.km <= maxDistance && activeTiers.has(c.tier));
    if (citiesToSearch.length === 0) {
      setError("No cities in your selected range. Increase distance or enable more tiers.");
      setLoading(false);
      return;
    }

    const batchSize = 3;
    const batches = [];
    for (let i = 0; i < citiesToSearch.length; i += batchSize) {
      batches.push(citiesToSearch.slice(i, i + batchSize));
    }

    let totalErrors = 0;

    for (const batch of batches) {
      if (abortRef.current) break;
      const batchNames = batch.map(c => c.name);
      setLoadingCities(batchNames);

      const genreFilter = genre === "All Genres" ? "" : ` ${genre}`;
      const cityList = batchNames.join(", ");
      const prompt = `Search for upcoming${genreFilter} concerts and live music events in these cities: ${cityList} (Europe) in the ${timeframe}.

Find real upcoming concerts. For EACH city, find 2-4 concerts.

IMPORTANT: Respond ONLY with a JSON object in this exact format, no other text:
{"concerts":[{"artist":"Name","city":"City","venue":"Venue","date":"Mon DD, YYYY","genre":"Genre","artistInfo":"One sentence about the artist","spotifyUrl":null,"youtubeUrl":null,"price":null,"ticketUrl":null}]}

Rules:
- city must be one of: ${cityList}
- For spotifyUrl use https://open.spotify.com/search/ARTIST_NAME format
- For youtubeUrl use https://www.youtube.com/results?search_query=ARTIST_NAME+live format
- Set null for unknown fields
- NO markdown, NO backticks, ONLY the JSON object`;

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("API error:", response.status, errText);
          totalErrors++;
          setError(`API error (${response.status}) for ${cityList}. Continuing...`);
          setCompletedCities(prev => [...prev, ...batchNames]);
          continue;
        }

        const data = await response.json();

        if (data.error) {
          console.error("API returned error:", data.error);
          totalErrors++;
          setError(`Error: ${data.error.message || "Unknown API error"}`);
          setCompletedCities(prev => [...prev, ...batchNames]);
          continue;
        }

        // Extract all text from response content blocks
        const allText = (data.content || [])
          .filter(b => b.type === "text")
          .map(b => b.text)
          .join("\n");

        if (!allText.trim()) {
          console.warn("No text in response for:", cityList, "Full response:", JSON.stringify(data).slice(0, 500));
          setDebugInfo(prev => prev + `\n[${cityList}] No text in API response. Types: ${(data.content || []).map(b => b.type).join(", ")}`);
          totalErrors++;
          setCompletedCities(prev => [...prev, ...batchNames]);
          continue;
        }

        // Try multiple JSON extraction strategies
        let parsed = null;

        // Strategy 1: Find JSON between ```json ``` blocks
        const codeBlockMatch = allText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          try { parsed = JSON.parse(codeBlockMatch[1].trim()); } catch {}
        }

        // Strategy 2: Find { "concerts": [...] } with balanced braces
        if (!parsed) {
          const startIdx = allText.indexOf('{"concerts"');
          if (startIdx === -1) {
            const altIdx = allText.indexOf('{ "concerts"');
            if (altIdx !== -1) {
              try {
                const sub = allText.slice(altIdx);
                let depth = 0, end = 0;
                for (let i = 0; i < sub.length; i++) {
                  if (sub[i] === '{') depth++;
                  if (sub[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
                }
                if (end > 0) parsed = JSON.parse(sub.slice(0, end));
              } catch {}
            }
          } else {
            try {
              const sub = allText.slice(startIdx);
              let depth = 0, end = 0;
              for (let i = 0; i < sub.length; i++) {
                if (sub[i] === '{') depth++;
                if (sub[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
              }
              if (end > 0) parsed = JSON.parse(sub.slice(0, end));
            } catch {}
          }
        }

        // Strategy 3: Try parsing entire text as JSON
        if (!parsed) {
          try { parsed = JSON.parse(allText.trim()); } catch {}
        }

        if (parsed && parsed.concerts && Array.isArray(parsed.concerts) && parsed.concerts.length > 0) {
          // Generate fallback URLs for spotify/youtube if missing
          const enriched = parsed.concerts.map(c => ({
            ...c,
            spotifyUrl: c.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(c.artist)}`,
            youtubeUrl: c.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(c.artist + " live")}`,
          }));
          setConcerts(prev => [...prev, ...enriched]);
        } else {
          console.warn("Could not parse concerts for:", cityList, "Text:", allText.slice(0, 300));
          setDebugInfo(prev => prev + `\n[${cityList}] Could not parse JSON. Response preview: ${allText.slice(0, 200)}`);
          totalErrors++;
        }
      } catch (err) {
        console.error("Fetch failed for:", batchNames, err);
        totalErrors++;
        setError(`Network error searching ${cityList}. Continuing...`);
      }

      setCompletedCities(prev => [...prev, ...batchNames]);
    }

    setLoadingCities([]);
    setLoading(false);

    if (totalErrors > 0 && concerts.length === 0) {
      setError(`Search had issues (${totalErrors} batch errors). Try again or reduce the number of cities.`);
    }
  };

  const stopSearch = () => {
    abortRef.current = true;
  };

  const progress = searched
    ? Math.round((completedCities.length / Math.max(eligibleCities.length, 1)) * 100)
    : 0;

  const favCount = favorites.size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: #ff6b35; cursor: pointer; border: 2px solid #1a1a2e;
          box-shadow: 0 0 8px rgba(255,107,53,0.4);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#08080d", color: "#fff",
        fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 600px 400px at 15% 15%, rgba(255,107,53,0.05), transparent),
            radial-gradient(ellipse 500px 500px at 85% 75%, rgba(59,130,246,0.03), transparent)
          `,
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 720, margin: "0 auto",
          padding: "40px 20px 80px",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 36, marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>🎸</div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32, fontWeight: 900,
              background: "linear-gradient(135deg, #fff 30%, #ff8a4c 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.1, marginBottom: 6,
            }}>
              Concert Radar
            </h1>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.3)",
              letterSpacing: 2, textTransform: "uppercase", fontWeight: 600,
            }}>
              From Vienna · All of Europe
            </p>
          </div>

          {/* Controls Panel */}
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, padding: 24, marginBottom: 24,
          }}>
            {/* API Key */}
            <label style={{
              display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 600,
            }}>
              Anthropic API Key <span style={{ color: "rgba(255,255,255,0.25)", textTransform: "none", letterSpacing: 0 }}>— optional, for live search</span>
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                type={apiKey && apiKey.length > 8 ? "password" : "text"}
                placeholder="sk-ant-...  (leave empty to browse demo data)"
                value={apiKey}
                onChange={e => saveApiKey(e.target.value)}
                style={{
                  flex: 1, padding: "10px 14px",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${apiKey ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, color: "#fff",
                  fontSize: 13, fontFamily: "'DM Mono', monospace",
                  outline: "none",
                }}
              />
            </div>
            {!apiKey && (
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.3)",
                marginBottom: 20, marginTop: -12, lineHeight: 1.5,
              }}>
                Browsing real sample data below — no key needed. To run a fresh live search, add a key from{" "}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#ff8a4c", textDecoration: "none" }}>
                  console.anthropic.com
                </a>
                . Stored locally in your browser only.
              </div>
            )}

            {/* Distance Slider */}
            <label style={{
              display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
            }}>
              Max Distance from Vienna
            </label>
            <DistanceSlider value={maxDistance} onChange={setMaxDistance} />

            {/* Tier toggles */}
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
              }}>
                Travel Tiers
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(TIER_LABELS).map(([t, info]) => (
                  <ChipToggle
                    key={t}
                    label={info.label}
                    active={activeTiers.has(Number(t))}
                    onClick={() => toggleTier(Number(t))}
                    color={activeTiers.has(Number(t)) ? info.bg : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Genre + Timeframe row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 600,
                }}>Genre</label>
                <select
                  value={genre} onChange={e => setGenre(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, color: "#fff",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    outline: "none", cursor: "pointer", appearance: "auto",
                  }}
                >
                  {GENRES.map(g => <option key={g} value={g} style={{ background: "#12121f" }}>{g}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontWeight: 600,
                }}>Timeframe</label>
                <select
                  value={timeframe} onChange={e => setTimeframe(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, color: "#fff",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    outline: "none", cursor: "pointer", appearance: "auto",
                  }}
                >
                  {TIMEFRAMES.map(t => <option key={t.value} value={t.value} style={{ background: "#12121f" }}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {/* City Preview with travel costs */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
              fontSize: 12, color: "rgba(255,255,255,0.35)",
              lineHeight: 1.8,
            }}>
              <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                {eligibleCities.length} cities:
              </span>{" "}
              {eligibleCities.map((c, i) => (
                <span key={c.name}>
                  <span style={{ color: TIER_LABELS[c.tier].color }}>{c.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}> {c.km}km {c.cost}</span>
                  {i < eligibleCities.length - 1 && <span style={{ color: "rgba(255,255,255,0.12)" }}> · </span>}
                </span>
              ))}
            </div>

            {/* Search Button */}
            <button
              onClick={loading ? stopSearch : searchAllCities}
              style={{
                width: "100%", padding: "14px 24px",
                background: loading
                  ? "rgba(239,68,68,0.6)"
                  : "linear-gradient(135deg, #ff6b35, #ff8a4c)",
                border: "none", borderRadius: 12,
                color: "#fff", fontSize: 15, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(255,107,53,0.2)",
              }}
            >
              {loading ? "⏹ Stop Search" : `🔍  Scan ${eligibleCities.length} Cities`}
            </button>
          </div>

          {/* Progress bar */}
          {loading && (
            <div style={{ marginBottom: 24 }}>
              <div style={{
                height: 3, background: "rgba(255,255,255,0.06)",
                borderRadius: 2, overflow: "hidden", marginBottom: 10,
              }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "linear-gradient(90deg, #ff6b35, #ff8a4c)",
                  borderRadius: 2, transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "rgba(255,255,255,0.3)",
                fontFamily: "'DM Mono', monospace",
              }}>
                <span>
                  {loadingCities.length > 0 && (
                    <span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>
                      Searching {loadingCities.join(", ")}...
                    </span>
                  )}
                </span>
                <span>{completedCities.length}/{eligibleCities.length} cities · {concerts.length} concerts</span>
              </div>
            </div>
          )}

          {/* Results area */}
          <div ref={resultsRef}>
            {searched && concerts.length > 0 && (
              <>
                {/* Filter bar */}
                <div style={{
                  display: "flex", gap: 10, marginBottom: 16,
                  alignItems: "center", flexWrap: "wrap",
                }}>
                  <input
                    type="text"
                    placeholder="Search artist, city, venue..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{
                      flex: 1, minWidth: 160, padding: "9px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, color: "#fff",
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      outline: "none",
                    }}
                  />
                  {/* Favorites toggle */}
                  <button
                    onClick={() => setShowFavoritesOnly(p => !p)}
                    style={{
                      padding: "8px 14px", borderRadius: 10,
                      fontSize: 12, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      background: showFavoritesOnly ? "rgba(255,138,76,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${showFavoritesOnly ? "rgba(255,138,76,0.3)" : "rgba(255,255,255,0.08)"}`,
                      color: showFavoritesOnly ? "#ff8a4c" : "rgba(255,255,255,0.4)",
                      cursor: "pointer", transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ❤️ {favCount > 0 ? favCount : ""}
                  </button>
                  <select
                    value={sortBy} onChange={e => setSortBy(e.target.value)}
                    style={{
                      padding: "9px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, color: "#fff",
                      fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                      outline: "none", cursor: "pointer", appearance: "auto",
                    }}
                  >
                    <option value="distance" style={{ background: "#12121f" }}>Sort: Distance</option>
                    <option value="date" style={{ background: "#12121f" }}>Sort: Date</option>
                    <option value="city" style={{ background: "#12121f" }}>Sort: City</option>
                  </select>
                </div>

                {/* Results header */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 14, padding: "0 2px",
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 20, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    {showFavoritesOnly ? `${filteredConcerts.length} Saved` : `${filteredConcerts.length} Concert${filteredConcerts.length !== 1 ? "s" : ""}`}
                    {demoMode && (
                      <span style={{
                        fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        color: "#3b82f6", background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}>
                        Demo Data
                      </span>
                    )}
                  </span>
                  {!loading && (
                    <span style={{
                      fontSize: 11, color: "rgba(255,255,255,0.25)",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {demoMode ? "sample concerts" : `${completedCities.length} cities scanned`}
                    </span>
                  )}
                </div>

                {/* Concert list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredConcerts.map((c, i) => (
                    <ConcertCard
                      key={`${c.artist}-${c.city}-${i}`}
                      concert={c}
                      index={i}
                      isFavorite={favorites.has(concertKey(c))}
                      onToggleFavorite={() => toggleFavorite(c)}
                    />
                  ))}
                </div>

                {filteredConcerts.length === 0 && (
                  <div style={{
                    textAlign: "center", padding: "40px 0",
                    color: "rgba(255,255,255,0.25)", fontSize: 13,
                  }}>
                    {showFavoritesOnly
                      ? "No saved concerts yet. Tap ❤️ on concerts you like!"
                      : "No matches for current filters. Try adjusting distance or search terms."}
                  </div>
                )}
              </>
            )}

            {!loading && searched && concerts.length === 0 && (
              <div style={{
                textAlign: "center", padding: "48px 0",
                color: "rgba(255,255,255,0.25)", fontSize: 14,
              }}>
                No concerts found. Try expanding the timeframe or distance.
              </div>
            )}

            {error && (
              <div style={{
                padding: "14px 18px", borderRadius: 12,
                background: "rgba(255,107,53,0.08)",
                border: "1px solid rgba(255,107,53,0.2)",
                fontSize: 13, color: "rgba(255,255,255,0.5)",
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {debugInfo && (
              <div style={{
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: 11, color: "rgba(255,255,255,0.25)",
                marginBottom: 16, fontFamily: "'DM Mono', monospace",
                whiteSpace: "pre-wrap", wordBreak: "break-all",
                maxHeight: 120, overflow: "auto",
              }}>
                {debugInfo}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 48, textAlign: "center",
            fontSize: 10, color: "rgba(255,255,255,0.15)",
            letterSpacing: 1,
          }}>
            Powered by AI web search · Travel costs are estimates for budget flights/trains from Vienna · Results may vary
          </div>
        </div>
      </div>
    </>
  );
}
