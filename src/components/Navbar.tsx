import {
  CogIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

interface ButtonProps {
  text: string;
  icon?: JSX.Element;
  href?: string;
  children?: React.ReactNode;
}

function NavbarButton({ text, icon, href, children }: ButtonProps) {
  return (
    <div className="group">
      <a
        className="flex w-fit transform-gpu items-center justify-center gap-1 rounded-sm p-3 transition-all hover:cursor-pointer hover:bg-blue-500"
        href={href}
      >
        <>
          {icon}
          <p className="hidden xs:block">{text}</p>
        </>
      </a>

      {children && (
        <div className="absolute z-20 hidden divide-y rounded-sm bg-neutral-600 shadow-sm group-hover:flex">
          <div className="p-2">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <>
      <div className="flex h-fit w-full rounded-sm bg-neutral-800">
        <NavbarButton text="Friends" icon={<UserIcon height={20} width={20} />}>
          <p className="text-sm font-bold">No friends, add someone!</p>

          <Button
            className="mt-2"
            text="Search"
            url="/search"
            icon={<MagnifyingGlassIcon height={20} width={20} />}
          />
        </NavbarButton>
        <NavbarButton
          text="Ranking"
          icon={<GlobeAltIcon height={20} width={20} />}
          href="/ranking/global"
        />

        <div className="m-auto" />

        <NavbarButton
          text="Search"
          icon={<MagnifyingGlassIcon height={20} width={20} />}
          href="/search"
        />
        <NavbarButton
          text="Settings"
          icon={<CogIcon height={20} width={20} />}
          href="/settings"
        />
      </div>
    </>
  );
}
