import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";

interface ButtonProps {
  text?: JSX.Element | string;
  url?: string;
  icon?: JSX.Element;
  color?: string;
  tooltip?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  text,
  url,
  icon,
  color,
  tooltip,
  className,
  onClick,
}: ButtonProps) {
  if (!color) color = "bg-blue-500";

  const base = (
    <a href={url} onClick={onClick}>
      <p
        className={clsx(
          "font-md flex w-fit transform-gpu flex-row items-center gap-1 rounded-md p-1 transition-all hover:opacity-80",
          className,
          color,
        )}
      >
        {icon}
        {text}
      </p>
    </a>
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
