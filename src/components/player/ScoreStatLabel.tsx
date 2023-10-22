import clsx from "clsx";

type LabelProps = {
  value: string;
  title?: string;
  icon?: JSX.Element;
  className?: string;
};

export default function ScoreStatLabel({
  value,
  title,
  icon,
  className = "bg-neutral-700",
}: LabelProps) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-md hover:cursor-default",
        className,
      )}
    >
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p
          className="flex w-full items-center justify-center gap-1"
          title={title}
        >
          {value}
          {icon}
        </p>
      </div>
    </div>
  );
}
