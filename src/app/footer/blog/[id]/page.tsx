import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams } from "@/lib/router-next";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; lead: string }> = {
  "ai-digital-revolution": {
    title: "The Digital Revolution: Technology & AI in Modern Modeling",
    category: "Technology",
    date: "December 24, 2025",
    readTime: "5 min read",
    lead: "The modeling industry is currently undergoing one of its most significant transformations since the advent of high-fashion photography. At the heart of this shift is the rapid integration of artificial intelligence (AI) and advanced digital technology.",
  },
  "diversity-representation": {
    title: "The Evolution of Diversity & Representation in Modeling",
    category: "Culture",
    date: "December 24, 2025",
    readTime: "6 min read",
    lead: "The modeling industry is undergoing a profound cultural shift toward diversity and representation.",
  },
  "the-pulse-of-change-fashion-evolution": {
    title: "The Pulse of Change: Fashion Evolution & The Modern Model",
    category: "Fashion",
    date: "December 24, 2025",
    readTime: "6 min read",
    lead: "Fashion has never been a static industry. The modern model is at the centre of this evolution.",
  },
};

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const post = id ? posts[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6">
          <p className="text-muted-foreground">Post not found.</p>
          <Link to="/footer/blog" className="text-primary text-sm font-body mt-4 inline-block">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/blog" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">Back to Blog</Link>
          <p className="text-primary font-body text-xs tracking-wider uppercase">{post.category}</p>
          <h1 className="font-display text-4xl md:text-6xl line-accent mt-2">{post.title}</h1>
          <p className="text-muted-foreground font-body text-xs mt-4">{post.date} · {post.readTime}</p>
          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">{post.lead}</p>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">
            Full article content can be added here. This page uses the same design as the rest of the site—Navbar, container, typography, and Footer.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
