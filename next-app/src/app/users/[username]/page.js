import Client from "./Client";

export const metadata = {
  title: "users/[username] | Enarxi Innovations",
  description: "Explore Enarxi Innovations' users/[username] page.",
  keywords: "Enarxi Innovations, tech startup, electronic manufacturing, custom IT services",
  alternates: {
    canonical: "https://www.enarxi.com/users/[username]"
  }
};

export default function Page() {
  return <Client />;
}
