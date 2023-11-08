import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";

interface ButtonProps {
  text?: JSX.Element | string;
  icon?: JSX.Element;
  color?: string;
  tooltip?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export default function Button({
  text,
  icon,
  color,
  tooltip,
  className,
  ariaLabel = "Default button label",
  onClick,
}: ButtonProps) {
  if (!color) color = "bg-blue-500";

  const base = (
    <button
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md px-4 py-2",
        color,
        className,
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      {text}
    </button>
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
