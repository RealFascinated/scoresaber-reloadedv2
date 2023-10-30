import Card from "@/components/Card";
import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

const links = [
  {
    name: "Sentry",
    url: "https://sentry.fascinated.cc",
    description:
      "The site uses Sentry to track errors. This is to help me fix bugs and issues with the site.",
  },
  {
    name: "Plausible",
    url: "https://analytics.fascinated.cc",
    description:
      "The site uses Plausible to track page views. This is to help me see which pages are popular.",
  },
];

export default async function Analytics() {
  return (
    <main>
      <Container>
        <Card>
          <h1 className="mb-1 text-3xl font-bold">Privacy</h1>
          <p className="mb-8 text-gray-300">
            This site does not collect personal data. All of the data stored is
            in your browser&apos;s local storage.
          </p>

          <p>All of the services below are hosted by me.</p>
          <div className="text-gray-300">
            {links.map((link, index) => {
              return (
                <p key={index}>
                  <a className="text-pp-blue" href={link.url}>
                    {link.name}
                  </a>{" "}
                  - {link.description}
                </p>
              );
            })}
          </div>
        </Card>
      </Container>
    </main>
  );
}
