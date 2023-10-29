import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";

type LabelProps = {
  value: string;
  tooltip?: React.ReactNode;
  icon?: JSX.Element;
  className?: string;
};

export default function ScoreStatLabel({
  value,
  tooltip,
  icon,
  className = "bg-neutral-700",
}: LabelProps) {
  const base = (
    <div
      className={clsx(
        "flex flex-col rounded-md hover:cursor-default",
        className,
      )}
    >
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p className="flex w-full items-center justify-center gap-1">
          {value}
          {icon}
        </p>
      </div>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger>{base}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
  return base;
}
