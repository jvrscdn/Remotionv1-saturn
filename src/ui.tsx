import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C, FONT_BODY, FONT_DISPLAY, ease, prog} from "./theme";

/* ---------- Grain (noise halus, bikin gambar terasa "film") ---------- */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => (
  <div style={{position: "absolute", inset: 0, backgroundImage: GRAIN, opacity, mixBlendMode: "overlay", pointerEvents: "none"}} />
);

/* ---------- Latar kosmik permanen (satu kamera untuk seluruh video) ---------- */
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({length: 90}, (_, i) => ({
  x: rand(i + 1) * 2100, y: rand(i + 101) * 1140, r: 0.8 + rand(i + 201) * 1.9,
  tw: rand(i + 301) * 6.28, sp: 0.02 + rand(i + 401) * 0.05, depth: 0.3 + rand(i + 501),
}));

export const Cosmos: React.FC<{dim?: number}> = ({dim = 0}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = f / durationInFrames;
  const scale = 1.08 + t * 0.12;
  const x = Math.sin(f / 240) * 34 - t * 60;
  const y = Math.cos(f / 300) * 20;
  return (
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      <Img src={staticFile("bg-plate.jpg")} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${scale})`}} />
      {STARS.map((s, i) => {
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(f * s.sp + s.tw));
        const px = ((s.x - f * 0.25 * s.depth) % 2100 + 2100) % 2100 - 90;
        return <div key={i} style={{position: "absolute", left: px, top: s.y, width: s.r, height: s.r, borderRadius: s.r, background: "#fff", opacity: tw * 0.75, boxShadow: `0 0 ${s.r * 4}px rgba(205,187,255,0.9)`}} />;
      })}
      <div style={{position: "absolute", inset: 0, background: `rgba(6,3,13,${dim})`}} />
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(6,3,13,0) 35%, rgba(6,3,13,0.78) 100%)"}} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ---------- Pembungkus scene: fade + dorongan halus ---------- */
export const Scene: React.FC<{children: React.ReactNode; inF?: number; outF?: number; first?: boolean}> = ({children, inF = 14, outF = 14, first}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const i = first ? 1 : prog(f, 0, inF, ease.soft);
  const o = prog(f, durationInFrames - outF, outF, ease.inOut);
  return (
    <AbsoluteFill style={{opacity: i * (1 - o), transform: `scale(${1 + (1 - i) * 0.015 + o * 0.012})`}}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Teks dengan reveal bermasker + blur halus ---------- */
export const Line: React.FC<{
  children: React.ReactNode;
  size: number;
  delay?: number;
  dur?: number;
  weight?: number;
  color?: string;
  display?: boolean;
  gradient?: boolean;
  spacing?: number;
  style?: React.CSSProperties;
}> = ({children, size, delay = 0, dur = 26, weight = 600, color = C.paper, display = true, gradient = false, spacing, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, dur, ease.out);
  return (
    <div style={{overflow: "hidden", paddingBottom: size * 0.16, marginBottom: -size * 0.16, ...style}}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 105}%)`,
          opacity: Math.min(1, p * 2.2),
          filter: `blur(${(1 - p) * 6}px)`,
          fontFamily: display ? FONT_DISPLAY : FONT_BODY,
          fontSize: size,
          fontWeight: weight,
          color: gradient ? "transparent" : color,
          backgroundImage: gradient ? `linear-gradient(180deg, #fff 20%, ${C.lilac} 100%)` : undefined,
          WebkitBackgroundClip: gradient ? "text" : undefined,
          backgroundClip: gradient ? "text" : undefined,
          letterSpacing: spacing ?? (display ? -size * 0.03 : 0),
          lineHeight: 1.06,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 18);
  return (
    <div style={{display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -14}px)`}}>
      <div style={{width: 44 * p, height: 2, background: C.violet}} />
      <div style={{fontFamily: FONT_BODY, fontSize: 22, fontWeight: 600, letterSpacing: 6, color: C.lilac, textTransform: "uppercase"}}>{children}</div>
    </div>
  );
};

export const Pill: React.FC<{children: React.ReactNode; delay: number; accent?: boolean}> = ({children, delay, accent}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 16);
  return (
    <div style={{
      fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: 28, color: accent ? "#fff" : C.paper,
      padding: "12px 24px", borderRadius: 100, opacity: p, transform: `translateY(${(1 - p) * 10}px)`,
      background: "rgba(139,108,255,0.14)", border: "1px solid rgba(205,187,255,0.34)",
      backdropFilter: "blur(14px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
    }}>{children}</div>
  );
};

/* ---------- Ikon ---------- */
type IconName =
  | "home" | "search" | "library" | "play" | "pause" | "next" | "prev" | "shuffle"
  | "repeat" | "heart" | "down" | "more" | "share" | "plus" | "back" | "download"
  | "device" | "queue" | "lyrics" | "check";

const ICONS: Record<IconName, {d: string; fill: boolean}> = {
  home: {d: "M12 2.6 2.5 9.6V21h7v-6.5h5V21h7V9.6z", fill: true},
  search: {d: "M10.5 3.2a7.3 7.3 0 1 0 0 14.6 7.3 7.3 0 0 0 0-14.6zM16 16l5.2 5.2", fill: false},
  library: {d: "M4 4h2.4v16H4zM9 4h2.4v16H9zM14 5.2l2.3-.6 4 15-2.3.6z", fill: true},
  play: {d: "M7 3.8v16.4a.6.6 0 0 0 .9.5l13.4-8.2a.6.6 0 0 0 0-1L7.9 3.3a.6.6 0 0 0-.9.5z", fill: true},
  pause: {d: "M6 4h4v16H6zM14 4h4v16h-4z", fill: true},
  next: {d: "M6 5.2v13.6a.5.5 0 0 0 .8.4l9.4-6.8a.5.5 0 0 0 0-.8L6.8 4.8a.5.5 0 0 0-.8.4zM17.4 5h2.2v14h-2.2z", fill: true},
  prev: {d: "M18 5.2v13.6a.5.5 0 0 1-.8.4l-9.4-6.8a.5.5 0 0 1 0-.8l9.4-6.8a.5.5 0 0 1 .8.4zM4.4 5h2.2v14H4.4z", fill: true},
  shuffle: {d: "M3 7h4c4 0 6 10 10 10h4M3 17h4c1.5 0 2.7-1 3.7-2.4M14 8.4C14.8 7.5 15.8 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3", fill: false},
  repeat: {d: "M4 11V9a3 3 0 0 1 3-3h13M17 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H4M7 21l-3-3 3-3", fill: false},
  heart: {d: "M12 21s-8.5-5.4-8.5-11.6A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.5 2.6C20.5 15.6 12 21 12 21z", fill: true},
  down: {d: "M5 9l7 7 7-7", fill: false},
  more: {d: "M5 12h.01M12 12h.01M19 12h.01", fill: false},
  share: {d: "M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6", fill: false},
  plus: {d: "M12 5v14M5 12h14", fill: false},
  back: {d: "M15 5l-7 7 7 7", fill: false},
  download: {d: "M12 4v11M7 11l5 5 5-5M5 20h14", fill: false},
  device: {d: "M7 3h10a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 7 3zM12 10.2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4zM12 6.2h.01", fill: false},
  queue: {d: "M4 6h12M4 12h12M4 18h7M17 14.5v6l5-3z", fill: false},
  lyrics: {d: "M4 5h16M4 10h10M4 15h16M4 20h8", fill: false},
  check: {d: "M4.5 12.5l5 5 10-11", fill: false},
};

export const Icon: React.FC<{name: IconName; size?: number; color?: string; outline?: boolean}> = ({
  name, size = 24, color = "#fff", outline = false,
}) => {
  const ic = ICONS[name];
  const filled = ic.fill && !outline;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", flexShrink: 0}}
      fill={filled ? color : "none"} stroke={filled ? "none" : color}
      strokeWidth={name === "more" ? 3.4 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d={ic.d} />
    </svg>
  );
};

/* ---------- Cover album: gradien bertekstur ala artwork rilisan nyata ---------- */
const PAL: [string, string, string, string][] = [
  ["#FF5E7E", "#6A2BFF", "#1B0B3A", "#FFB36B"],
  ["#2AD1C9", "#17306E", "#06142B", "#9BF5E1"],
  ["#FFB347", "#C2335A", "#2A0B24", "#FFE2A8"],
  ["#7BFF8E", "#0E6B54", "#04211C", "#D6FFB8"],
  ["#B58CFF", "#3A1D8F", "#0E0630", "#FFB8F2"],
  ["#FF7A45", "#8A1F3B", "#1C0813", "#FFD0A6"],
  ["#5CA8FF", "#2A2F9E", "#0A0B35", "#C8E4FF"],
  ["#E8E3FF", "#6B5BD6", "#1A1440", "#FFFFFF"],
];
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * k).toString(16).padStart(2, "0");
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
};
// warna dominan cover yang diredam, seperti pewarnaan latar di Spotify asli
export const coverTone = (seed: number) => shade(PAL[seed % PAL.length][1], 0.62);
export const Cover: React.FC<{seed: number; size: number; radius?: number}> = ({seed, size, radius = 4}) => {
  const [a, b, c, d] = PAL[seed % PAL.length];
  const m = seed % 4;
  const ox = 20 + ((seed * 37) % 55);
  const oy = 18 + ((seed * 23) % 50);
  return (
    <div style={{width: size, height: size, borderRadius: radius, flexShrink: 0, position: "relative", overflow: "hidden",
      background: `radial-gradient(circle at ${ox}% ${oy}%, ${a} 0%, transparent 52%), radial-gradient(circle at ${100 - ox}% ${100 - oy}%, ${b} 0%, transparent 62%), linear-gradient(155deg, ${c}, ${b})`}}>
      {m === 0 && <div style={{position: "absolute", left: "50%", top: "52%", width: "46%", height: "46%", borderRadius: "50%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle at 35% 30%, ${d}, ${a} 55%, transparent 100%)`, opacity: 0.9}} />}
      {m === 1 && <div style={{position: "absolute", left: "-10%", right: "-10%", bottom: "28%", height: "2%", background: d, opacity: 0.8, boxShadow: `0 0 ${size * 0.08}px ${d}`}} />}
      {m === 2 && <div style={{position: "absolute", left: "12%", top: "12%", width: "76%", height: "76%", borderRadius: "50%", border: `${Math.max(1, size * 0.012)}px solid ${d}`, opacity: 0.7}} />}
      {m === 3 && <div style={{position: "absolute", left: "-20%", bottom: "-30%", width: "140%", height: "70%", borderRadius: "50%", background: `radial-gradient(ellipse at 50% 0%, ${d}, transparent 70%)`, opacity: 0.55}} />}
      <div style={{position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.22, mixBlendMode: "overlay"}} />
      <div style={{position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", borderRadius: radius}} />
    </div>
  );
};

/* ---------- Bingkai HP (kanvas isi 390x812) ---------- */
export const Phone: React.FC<{width: number; children: React.ReactNode; delay?: number; style?: React.CSSProperties}> = ({
  width, children, delay = 0, style,
}) => {
  const f = useCurrentFrame();
  const k = width / 408;
  const p = prog(f, delay, 36, ease.out);
  const float = Math.sin(f / 46) * 5;
  return (
    <div style={{width, height: 830 * k, position: "relative", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 70 + float}px)`, ...style}}>
      <div style={{position: "absolute", left: "-30%", top: "-6%", width: "160%", height: "112%", background: "radial-gradient(ellipse at 50% 50%, rgba(139,108,255,0.38) 0%, rgba(139,108,255,0) 62%)", filter: "blur(30px)"}} />
      <div style={{width: 408, height: 830, transform: `scale(${k})`, transformOrigin: "0 0", position: "absolute", left: 0, top: 0}}>
        <div style={{position: "absolute", left: -3, top: 150, width: 4, height: 64, borderRadius: 2, background: "#23232C"}} />
        <div style={{position: "absolute", left: -3, top: 230, width: 4, height: 64, borderRadius: 2, background: "#23232C"}} />
        <div style={{position: "absolute", right: -3, top: 200, width: 4, height: 96, borderRadius: 2, background: "#23232C"}} />
        <div style={{width: 408, height: 830, borderRadius: 62, padding: 9, boxSizing: "border-box",
          background: "linear-gradient(145deg, #3A3A46 0%, #0B0B10 38%, #1A1A22 100%)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.14), inset 0 0 0 1.5px rgba(255,255,255,0.10)"}}>
          <div style={{width: 390, height: 812, borderRadius: 53, overflow: "hidden", position: "relative", background: "#000"}}>
            {children}
            <div style={{position: "absolute", top: 11, left: 140, width: 110, height: 32, borderRadius: 20, background: "#000", zIndex: 50}} />
            <div style={{position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none", background: "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 32%)"}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatusBar: React.FC<{color?: string}> = ({color = "#fff"}) => (
  <div style={{height: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 34px 0 38px", fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600, color}}>
    <span>20.41</span>
    <span style={{display: "flex", gap: 6, alignItems: "center"}}>
      <svg width="18" height="12" viewBox="0 0 18 12" fill={color}><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <span style={{width: 26, height: 12.5, border: `1.5px solid ${color}`, borderRadius: 4, padding: 1.5, boxSizing: "border-box", opacity: 0.95}}>
        <span style={{display: "block", width: "78%", height: "100%", background: color, borderRadius: 1.5}} />
      </span>
    </span>
  </div>
);

/* ---------- Subtitle naskah (kaca buram, di bawah tengah-kiri) ---------- */
export type CaptionItem = {from: number; to: number; text: string};
export const Caption: React.FC<{items: CaptionItem[]}> = ({items}) => {
  const f = useCurrentFrame();
  const cur = items.find((i) => f >= i.from && f < i.to);
  if (!cur) return null;
  const p = prog(f, cur.from, 10, ease.soft);
  const out = prog(f, cur.to - 8, 8, ease.in);
  return (
    <div style={{position: "absolute", left: 140, bottom: 58, maxWidth: 960}}>
      <div
        style={{
          display: "inline-block", background: "rgba(10,5,24,0.62)", color: C.paper,
          backdropFilter: "blur(18px)", border: "1px solid rgba(205,187,255,0.22)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 50px rgba(0,0,0,0.4)",
          borderRadius: 16, padding: "14px 26px",
          fontFamily: FONT_BODY, fontSize: 32, fontWeight: 500, lineHeight: 1.3, letterSpacing: -0.2,
          opacity: p * (1 - out), transform: `translateY(${(1 - p) * 10}px)`, filter: `blur(${(1 - p) * 4}px)`,
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};
