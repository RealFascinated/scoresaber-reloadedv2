import { normalizedRegionName } from "@/utils/utils";
import Image from "next/image";

type CountryFlagProps = {
  className?: string;
  countryCode: string;
};

export default function CountyFlag({
  className,
  countryCode,
}: CountryFlagProps) {
  return (
    <Image
      src={`/assets/flags/${countryCode.toLowerCase()}.svg`}
      alt={`${normalizedRegionName(countryCode)} flag`}
      title={normalizedRegionName(countryCode)}
      width={64}
      height={64}
      className={className}
      priority
    />
  );
}
