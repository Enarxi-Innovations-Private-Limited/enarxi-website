import { blogService } from "@/services/blogService";
import Client from "./Client";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let blog = null;
  try {
    blog = await blogService.getBlogBySlug(slug);
  } catch (err) {
    console.error("Error fetching blog for metadata:", err);
  }

  if (!blog) {
    return {
      title: "Blog Not Found | Enarxi Innovations",
    };
  }

  const description = blog.excerpt || (blog.content ? blog.content.substring(0, 160).replace(/<[^>]*>/g, '') : "");

  return {
    title: blog.title,
    description: description,
    keywords: blog.tags?.join(', ') || "electronic manufacturing, IoT, software development",
    openGraph: {
      title: blog.title,
      description: description,
      type: "article",
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
    },
    alternates: {
      canonical: `https://www.enarxi.com/blog/${slug}`
    }
  };
}

export default function Page() {
  return <Client />;
}
