import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";

type LabelProps = {
  title: string;
  value: any;
  tooltip?: React.ReactNode;
  className?: string;
};

export default function Label({
  title,
  value,
  tooltip,
  className = "bg-neutral-700",
}: LabelProps) {
  const base = (
    <div
      className={clsx(
        "flex flex-col justify-center rounded-md hover:cursor-default",
        className,
      )}
    >
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p>{title}</p>
        <div className="h-4 w-[1px] bg-neutral-100"></div>
        <p>{value}</p>
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
