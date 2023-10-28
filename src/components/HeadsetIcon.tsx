import Image from "next/image";

const headsets = [
  {
    id: [-1], // Fallback headset (CV1)
    name: "Unknown",
    filters:
      "invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)",
    icon: "oculus.svg",
  },
  {
    id: [64],
    name: "Valve Index",
    filters:
      "invert(81%) sepia(27%) saturate(6288%) hue-rotate(344deg) brightness(103%) contrast(103%)",
    icon: "valve-index.svg",
  },
  {
    id: [32],
    name: "Oculus Quest",
    filters:
      "invert(49%) sepia(26%) saturate(5619%) hue-rotate(146deg) brightness(93%) contrast(86%)",
    icon: "oculus.svg",
  },
  {
    id: [16],
    name: "Rift S",
    filters:
      "invert(49%) sepia(26%) saturate(5619%) hue-rotate(146deg) brightness(93%) contrast(86%)",
    icon: "oculus.svg",
  },
  {
    id: [1],
    name: "Rift CV1",
    filters:
      "invert(99%) sepia(3%) saturate(82%) hue-rotate(58deg) brightness(118%) contrast(100%)",
    icon: "oculus.svg",
  },
  {
    id: [2],
    name: "Vive",
    filters:
      "invert(54%) sepia(78%) saturate(2598%) hue-rotate(157deg) brightness(97%) contrast(101%)",
    icon: "vive.svg",
  },
];

interface IconProps {
  id: number;
  size?: number;
  className?: string;
}

export default function HeadsetIcon({ id, size = 32, className }: IconProps) {
  let headset = headsets.find((h) => h.id.includes(id));
  if (!headset) {
    headset = headsets[0];
  }

  return (
    <div className={className}>
      <Image
        src={`/assets/headsets/${headset.icon}`}
        alt={headset.name}
        title={headset.name}
        width={size}
        height={size}
        style={{
          filter: headset.filters,
        }}
      />
    </div>
  );
}
