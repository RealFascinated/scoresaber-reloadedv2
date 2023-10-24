import GlobalRanking from "@/components/player/GlobalRanking";
import { getPageFromSearchQuery } from "@/utils/utils";
import { headers } from "next/headers";

export default function RankingGlobal() {
  const page = getPageFromSearchQuery(headers());

  return <GlobalRanking page={page} />;
}
