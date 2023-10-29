"use client";

import { formatNumber } from "@/utils/numberUtils";
import { calcPpBoundary } from "@/utils/scoresaber/scores";
import { useState } from "react";
import Label from "../Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";

type PPGainLabelProps = {
  playerId: string;
};

export default function PPGainLabel({ playerId }: PPGainLabelProps) {
  const [ppBoundary, setPpBoundary] = useState(1);

  return (
    <Popover>
      <PopoverTrigger>
        <Label
          title={`+ ${ppBoundary}pp`}
          className="bg-pp-blue hover:cursor-pointer"
          tooltip={
            <p>
              Amount of raw pp required to increase your global pp by{" "}
              {ppBoundary}pp
            </p>
          }
          value={`${formatNumber(
            calcPpBoundary(playerId, ppBoundary)?.toFixed(2),
          )}pp`}
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4" align="start">
        <p>Global PP Gain +{ppBoundary} pp</p>
        <Slider
          defaultValue={[1]}
          min={1}
          max={100}
          step={1}
          onValueChange={(value) => setPpBoundary(value[0])}
        />
      </PopoverContent>
    </Popover>
  );
}
