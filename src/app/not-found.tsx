import Card from "@/components/Card";
import Container from "@/components/Container";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList.get("host");
  return (
    <Container>
      <Card className="flex h-full items-center justify-center">
        <p className="text-xl font-bold text-red-500">404 Not Found</p>
        <p className="text-lg text-gray-300">
          The page you requested does not exist.
        </p>
      </Card>
    </Container>
  );
}
