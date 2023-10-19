import Navbar from "./Navbar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="md:max-w-[1200px] m-auto flex flex-col items-center justify-center">
        <Navbar></Navbar>
        {children}
      </div>
    </>
  );
}
