import Card from "@/components/Card";
import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

const credits = [
  {
    name: "Scoresaber API",
    url: "https://new.scoresaber.com/api/",
  },
  {
    name: "The old Scoresaber Reloaded project",
    url: "https://github.com/motzel/scoresaber-reloaded",
  },
];

export default async function Analytics() {
  return (
    <main>
      <Container>
        <Card
          className="mt-2 w-full rounded-md bg-gray-800"
          innerClassName="flex flex-col items-center justify-center text-center"
        >
          <h1 className="mb-1 text-3xl font-bold">Credits</h1>
          <p className="mb-8 text-gray-300">
            This website is made possible because of the following:
          </p>

          {credits.map((credit, index) => {
            return (
              <div className="text-gray-300" key={index}>
                <p>
                  <a
                    className="transform-gpu text-pp-blue transition-all hover:opacity-75"
                    href={credit.url}
                  >
                    {credit.name}
                  </a>
                </p>
              </div>
            );
          })}
        </Card>
      </Container>
    </main>
  );
}
