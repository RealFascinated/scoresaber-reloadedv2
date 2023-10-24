import GlobalRanking from "@/components/player/GlobalRanking";
import { getPageFromSearchQuery } from "@/utils/utils";
import { headers } from "next/headers";

type RankingCountryProps = {
  params: { country: string };
};

export default function RankingCountry({ params }: RankingCountryProps) {
  const page = getPageFromSearchQuery(headers());
  const country = params.country;

  return <GlobalRanking page={page} country={country} />;
}
