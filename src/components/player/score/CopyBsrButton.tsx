"use client";

import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/Tooltip";
import { Button } from "../../ui/button";

type CopyBsrButtonProps = {
  mapId: string;
};

export default function CopyBsrButton({ mapId }: CopyBsrButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          className="h-[30px] w-[30px] bg-neutral-700 p-1"
          variant={"secondary"}
          onClick={() => {
            navigator.clipboard.writeText(`!bsr ${mapId}`);
            toast.success("Copied BSR code to clipboard");
          }}
        >
          <p>!</p>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <p>Click to copy the BSR code</p>
          <p>!bsr {mapId}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
