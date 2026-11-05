import React from "react";
import {Img, staticFile, useCurrentFrame} from "remotion";
import {ease, prog} from "./theme";

/** Logo Saturn X (versi setengah badan, lebih maju), tepinya dilebur ke latar kosmik. */
export const Hero: React.FC<{size?: number; delay?: number; style?: React.CSSProperties}> = ({size = 1120, delay = 0, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 70, ease.out);
  const drift = prog(f, delay, 400, (x) => x);
  const scale = 1.14 - p * 0.14 + drift * 0.03;
  return (
    <div
      style={{
        width: size, height: size, opacity: Math.min(1, p * 1.6), position: "relative", ...style,
        WebkitMaskImage: "radial-gradient(circle at 50% 48%, #000 54%, rgba(0,0,0,0) 72%)",
        maskImage: "radial-gradient(circle at 50% 48%, #000 54%, rgba(0,0,0,0) 72%)",
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      <Img src={staticFile("logo-half.jpg")} style={{width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "50% 38%"}} />
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,3,13,0) 58%, rgba(6,3,13,0.82) 100%)"}} />
    </div>
  );
};

/** Tulisan SATURN X (dari logo asli) dengan cahaya berdenyut dan kilau yang menyapu huruf. */
export const GlowTitle: React.FC<{width?: number; delay?: number; style?: React.CSSProperties}> = ({width = 900, delay = 0, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 44, ease.out);
  const pulse = 0.82 + 0.18 * Math.sin(f / 16);
  const h = (width * 205) / 1477;
  const sweep = (((f - delay - 40) % 150) + 150) % 150; // siklus 5 detik
  const bx = -40 + (sweep / 150) * 180;
  const src = staticFile("title.png");
  return (
    <div
      style={{
        width, height: h, position: "relative", opacity: p, transform: `translateY(${(1 - p) * 18}px) scale(${0.96 + p * 0.04})`, ...style,
        filter: `drop-shadow(0 0 ${8 * pulse}px rgba(220,205,255,0.95)) drop-shadow(0 0 ${28 * pulse}px rgba(139,108,255,0.9)) drop-shadow(0 0 ${80 * pulse}px rgba(100,50,255,0.75))`,
      }}
    >
      <Img src={src} style={{width: "100%", height: "100%", display: "block", filter: "brightness(1.55) contrast(1.15)"}} />
      <div
        style={{
          position: "absolute", inset: 0,
          WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
          WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
          backgroundImage: "linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 62%)",
          backgroundSize: "300% 100%", backgroundPosition: `${bx}% 0`, mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
