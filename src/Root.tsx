import React from "react";
import {Composition} from "remotion";
import {Promo, PromoProps} from "./Promo";

export const FPS = 30;
export const DURATION = 1800; // 60 detik

export const Root: React.FC = () => {
  return (
    <Composition
      id="SaturnXPromo"
      component={Promo}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{voice: "", music: ""} as PromoProps}
    />
  );
};
