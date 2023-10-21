import clsx from "clsx";

type LabelProps = {
  value: string;
  title?: string;
  className?: string;
};

export default function ScoreStatLabel({
  value,
  title,
  className = "bg-neutral-700",
}: LabelProps) {
  return (
    <div
      className={clsx(
        "flex min-w-[5rem] flex-col justify-center rounded-md",
        className,
      )}
    >
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p className="w-full text-center" title={title}>
          {value}
        </p>
      </div>
    </div>
  );
}
