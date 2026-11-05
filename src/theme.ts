import {Easing, interpolate} from "remotion";
import {loadFont as loadDisplay} from "@remotion/google-fonts/SpaceGrotesk";
import {loadFont as loadBody} from "@remotion/google-fonts/Inter";
import {loadFont as loadSpot} from "@remotion/google-fonts/Figtree";

const display = loadDisplay("normal", {weights: ["400", "500", "600", "700"], subsets: ["latin"]});
const body = loadBody("normal", {weights: ["400", "500", "600", "700"], subsets: ["latin"]});
const spot = loadSpot("normal", {weights: ["400", "500", "600", "700", "800"], subsets: ["latin"]});

export const FONT_DISPLAY = `${display.fontFamily}, "Helvetica Neue", Arial, sans-serif`;
export const FONT_BODY = `${body.fontFamily}, "Helvetica Neue", Arial, sans-serif`;
// Figtree: padanan gratis terdekat untuk Circular milik Spotify
export const FONT_SPOT = `${spot.fontFamily}, "Helvetica Neue", Arial, sans-serif`;

// Palet diambil dari logo Saturn X
export const C = {
  ink: "#06030D",
  deep: "#0D0820",
  violet: "#8B6CFF",
  violetDeep: "#4B2BD6",
  lilac: "#CDBBFF",
  magenta: "#E04BFF",
  eye: "#FF2E4D",
  paper: "#F4F0FF",
  muted: "#9A93B8",
  line: "rgba(205,187,255,0.20)",
  glass: "rgba(18,10,40,0.52)",
  // alias lama (dipakai layar Spotify/Chat)
  gold: "#B79CFF",
  cobalt: "#4B2BD6",
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const prog = (
  f: number,
  start: number,
  dur: number,
  easing: (t: number) => number = ease.out
): number =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
