import { ClockIcon, TrophyIcon } from "@heroicons/react/20/solid";

export type SortType = {
  name: string;
  value: string;
  icon: JSX.Element;
};

export const SortTypes: { [key: string]: SortType } = {
  top: {
    name: "Top Scores",
    value: "top",
    icon: <TrophyIcon width={20} height={20} />,
  },
  recent: {
    name: "Recent Scores",
    value: "recent",
    icon: <ClockIcon width={20} height={20} />,
  },
};
