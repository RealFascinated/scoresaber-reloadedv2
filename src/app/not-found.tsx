import Card from "@/components/Card";
import Container from "@/components/Container";

export default async function NotFound() {
  return (
    <Container>
      <Card
        outerClassName="mt-2"
        className="flex h-full flex-col items-center justify-center"
      >
        <p className="text-xl font-bold text-red-500">404 Not Found</p>
        <p className="text-lg text-gray-300">
          The page you requested does not exist.
        </p>
      </Card>
    </Container>
  );
}
