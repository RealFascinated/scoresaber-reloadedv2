import Container from "@/components/Container";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList.get("host");
  return (
    <Container>
      <div className="flex h-full items-center justify-center">
        <div className="rounded-md bg-gray-800 p-3 text-center opacity-90">
          <p className="text-xl font-bold text-red-500">404 Not Found</p>
          <p className="text-lg text-gray-300">
            The page you requested does not exist.
          </p>
        </div>
      </div>
    </Container>
  );
}
