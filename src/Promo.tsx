import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import {Caption, Cosmos} from "./ui";
import {CAPTIONS} from "./captions";
import {Intro} from "./scenes/Intro";
import {Stats} from "./scenes/Stats";
import {Features} from "./scenes/Features";
import {Spotify} from "./scenes/Spotify";
import {Grid} from "./scenes/Grid";
import {Outro} from "./scenes/Outro";

export type PromoProps = {voice: string; music: string};

// [mulai, durasi]. Tiap scene tumpang-tindih 14 frame supaya menyatu (cross-dissolve).
const O = 14;
const T = {
  intro: [0, 150 + O],
  stats: [150, 150 + O],
  features: [300, 480 + O],
  spotify: [780, 660 + O],
  grid: [1440, 150 + O],
  outro: [1590, 210],
} as const;

export const Promo: React.FC<PromoProps> = ({voice, music}) => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Cosmos />
      <Sequence from={T.intro[0]} durationInFrames={T.intro[1]}><Intro /></Sequence>
      <Sequence from={T.stats[0]} durationInFrames={T.stats[1]}><Stats /></Sequence>
      <Sequence from={T.features[0]} durationInFrames={T.features[1]}><Features /></Sequence>
      <Sequence from={T.spotify[0]} durationInFrames={T.spotify[1]}><Spotify /></Sequence>
      <Sequence from={T.grid[0]} durationInFrames={T.grid[1]}><Grid /></Sequence>
      <Sequence from={T.outro[0]} durationInFrames={T.outro[1]}><Outro /></Sequence>
      <Caption items={CAPTIONS} />
      {music ? <Audio src={staticFile(music)} volume={0.35} /> : null}
      {voice ? <Audio src={staticFile(voice)} /> : null}
    </AbsoluteFill>
  );
};
