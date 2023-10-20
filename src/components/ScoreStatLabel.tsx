import clsx from "clsx";

type LabelProps = {
  value: string;
  className?: string;
};

export default function ScoreStatLabel({
  value,
  className = "bg-neutral-700",
}: LabelProps) {
  return (
    <div className={clsx("flex flex-col justify-center rounded-md", className)}>
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p>{value}</p>
      </div>
    </div>
  );
}
