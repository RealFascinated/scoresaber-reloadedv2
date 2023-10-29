import { normalizedRegionName } from "@/utils/utils";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";

type CountryFlagProps = {
  className?: string;
  countryCode: string;
  tooltip?: React.ReactNode;
};

export default function CountyFlag({
  className,
  countryCode,
  tooltip,
}: CountryFlagProps) {
  const base = (
    <Image
      src={`/assets/flags/${countryCode.toLowerCase()}.svg`}
      alt={`${normalizedRegionName(countryCode)} flag`}
      width={64}
      height={64}
      className={className}
      priority
    />
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
