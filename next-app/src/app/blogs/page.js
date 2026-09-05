import Client from "./Client";

export const metadata = {
  title: "Insights & Innovation Blog",
  description: "Stay updated with the latest trends in electronic manufacturing, IoT, embedded systems, and custom software development from the experts at Enarxi Innovations.",
  keywords: "electronics blog, IoT trends, PCB design tips, manufacturing news, software development blog, Enarxi insights",
  alternates: {
    canonical: "https://www.enarxi.com/blogs"
  }
};

export default function Page() {
  return <Client />;
}
