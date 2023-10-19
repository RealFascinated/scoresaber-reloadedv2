import Navbar from "./Navbar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="m-auto flex flex-col items-center justify-center opacity-90 md:max-w-[1200px]">
        <Navbar></Navbar>
        {children}
      </div>
    </>
  );
}
