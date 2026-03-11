import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

const posts = [
  { id: "ai-digital-revolution", title: "The Digital Revolution: Technology & AI in Modern Modeling", excerpt: "The modeling industry is undergoing one of its most significant transformations...", category: "Technology", date: "December 24, 2025", readTime: "5 min read", image: "/images/blogs/blog1.webp" },
  { id: "diversity-representation", title: "The Evolution of Diversity & Representation in Modeling", excerpt: "The modeling industry is undergoing a profound cultural shift...", category: "Culture", date: "December 24, 2025", readTime: "6 min read", image: "/images/blogs/blog2.webp" },
  { id: "the-pulse-of-change-fashion-evolution", title: "The Pulse of Change: Fashion Evolution & The Modern Model", excerpt: "Fashion has never been a static industry...", category: "Fashion", date: "December 24, 2025", readTime: "6 min read", image: "/images/blogs/blog3.webp" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link to="/" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">Back to Homepage</Link>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Blog & Insights</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">Explore the latest trends, insights, and stories from the modeling industry</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/footer/blog/${post.id}`} className="group bg-card magazine-border overflow-hidden block hover:border-primary/30 transition-colors">
                <div className="aspect-video bg-muted" />
                <div className="p-6">
                  <span className="text-primary text-[10px] font-body tracking-wider uppercase">{post.category}</span>
                  <h2 className="font-display text-xl text-foreground mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-muted-foreground text-xs font-body line-clamp-2">{post.excerpt}</p>
                  <p className="text-muted-foreground text-[10px] font-body mt-3">{post.date} · {post.readTime}</p>
                  <span className="text-primary text-xs font-body tracking-wider uppercase mt-2 inline-block group-hover:underline">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
