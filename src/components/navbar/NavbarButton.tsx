interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  href?: string;
  ariaLabel: string;
}

export default function NavbarButton({
  text,
  icon,
  href,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      aria-label={ariaLabel}
      className="flex h-full w-fit transform-gpu items-center justify-center gap-1 rounded-md p-[8px] transition-all hover:cursor-pointer hover:bg-blue-500"
      href={href}
    >
      <>
        {icon}
        <p className="hidden md:block">{text}</p>
      </>
    </a>
  );
}
