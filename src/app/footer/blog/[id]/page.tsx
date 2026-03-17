import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

const postImages: Record<string, string> = {
  "ai-digital-revolution": "/images/blogs/blog1.webp",
  "diversity-representation": "/images/blogs/blog2.webp",
  "the-pulse-of-change-fashion-evolution": "/images/blogs/blog3.webp",
};

interface Post {
  title: string;
  category: string;
  date: string;
  readTime: string;
  lead: string;
  sections: { heading: string; content: string | React.ReactNode }[];
  highlight: string;
}

const posts: Record<string, Post> = {
  "ai-digital-revolution": {
    title: "The Digital Revolution: Technology & AI in Modern Modeling",
    category: "Technology",
    date: "December 24, 2025",
    readTime: "5 min read",
    lead: "The modeling industry is currently undergoing one of its most significant transformations since the advent of high-fashion photography. At the heart of this shift is the rapid integration of artificial intelligence (AI) and advanced digital technology, which are fundamentally changing how brands conceptualize, cast, and execute their creative visions. No longer confined to the physical limitations of a studio or a runway, the modern modeling landscape is becoming a sophisticated blend of human talent and technological innovation.",
    sections: [
      {
        heading: "AI-Driven Creativity and Casting",
        content: "Brands are increasingly leveraging AI-enhanced visuals to create hyper-realistic environments and stylized aesthetics that were previously impossible or too costly to achieve. This shift extends into the business side of the industry through digital casting processes. Casting directors now use data-driven tools to find specific looks and skill sets, streamlining the path from discovery to booking. Furthermore, the rise of short-form video content driven by platforms like TikTok and Instagram has moved the industry away from static imagery toward a more kinetic, personality-driven form of storytelling.",
      },
      {
        heading: "The New Profile of a Model",
        content: "As a result of these changes, the definition of a \"model\" has expanded. Today's professionals are expected to be multi-hyphenate creators. Success is no longer just about maintaining a specific physical look; it is about digital adaptability. Models must feel equally comfortable navigating high-end editorial photoshoots, performing for AI-integrated motion capture or 3D scanning, and producing and editing their own high-quality video content.",
      },
      {
        heading: "A Career Without Borders",
        content: "This technological evolution is not a threat to human models but rather a catalyst for versatile career growth. By embracing these tools, models can transcend the traditional boundaries of fashion. They are becoming influencers, tech collaborators, and digital storytellers. The intersection of fashion and technology allows for a more sustainable and diverse career path, where a model's personal brand and technical literacy are just as valuable as their runway walk.",
      },
    ],
    highlight: "Ultimately, the integration of AI is opening doors to a new era of \"Phygital\" (physical and digital) modeling. Those who master the art of working alongside technology will find themselves at the forefront of a more creative, efficient, and globally connected industry.",
  },
  "diversity-representation": {
    title: "The Evolution of Diversity & Representation in Modeling",
    category: "Culture",
    date: "December 24, 2025",
    readTime: "6 min read",
    lead: "For decades, the modeling industry was defined by a narrow and often exclusionary standard of beauty. However, we are currently witnessing a profound cultural shift where diversity and representation have moved from being \"trends\" to becoming the fundamental pillars of the modern fashion landscape. The industry is undergoing a necessary expansion, moving toward a future that mirrors the rich complexity of the real world.",
    sections: [
      {
        heading: "Redefining the Standard",
        content: "The most visible change is the broadening of aesthetic standards. Brands are increasingly moving away from the \"one-size-fits-all\" approach, choosing instead to celebrate a wider spectrum of ages, body types, ethnicities, and gender identities. This shift is not merely about optics; it is a response to a global audience that demands to see itself reflected in the media it consumes. From the rise of \"silver\" models challenging ageism to the long-overdue inclusion of disabled talent and gender-nonconforming individuals, the \"standard\" is being rewritten to prioritize authenticity over perfection.",
      },
      {
        heading: "The Power of Personal Narrative",
        content: "In this new era, a model's value is no longer determined solely by their physical measurements. The industry is placing a premium on individuality and personal story. Casting directors are looking for talent with a unique \"presence\": models who bring their lived experiences, advocacy, and cultural heritage to the set. Authenticity matters: consumers can sense when diversity is performative, and brands that succeed are those that embrace a model's true self. Confidence, a model's ability to communicate a message or a feeling, is now just as important as how they wear the clothes. Social media has allowed models to speak directly to their followers, turning them into relatable figures rather than distant icons.",
      },
      {
        heading: "Challenges and the Path Forward",
        content: "While the progress is undeniable, the journey toward true inclusivity is far from over. Significant challenges remain, particularly regarding representation behind the scenes, among photographers, stylists, and executives, and the need for consistent, year-round inclusion rather than seasonal tokenism. However, the shift toward real-world diversity is creating a more resilient and vibrant industry. By embracing talent that reflects the global population, brands are able to build deeper, more genuine connections with their audiences.",
      },
    ],
    highlight: "This evolution allows for a more democratic fashion world where talent, regardless of background or body type, has the space to thrive. As individuality becomes a superpower, the future of modeling looks less like a closed gallery and more like an open, inclusive conversation.",
  },
  "the-pulse-of-change-fashion-evolution": {
    title: "The Pulse of Change: Fashion Evolution & The Modern Model",
    category: "Fashion",
    date: "December 24, 2025",
    readTime: "6 min read",
    lead: "Fashion has never been a static industry; it is a living, breathing reflection of our cultural climate. Today, we are witnessing a Fashion Evolution that is defined by a fascinating paradox: the simultaneous embrace of nostalgic revivalism and cutting-edge, futuristic design. As trends shift from the structured minimalism of the past to the bold, eclectic \"maximalism\" of the present, the role of the model has transformed from a passive \"clothes horse\" into a dynamic visual storyteller.",
    sections: [
      {
        heading: "The Intersection of Past and Future",
        content: "Current trends are heavily influenced by nostalgia, specifically the resurgence of 90s grunge, Y2K aesthetics, and 70s bohemian silhouettes. However, these are not mere copies of the past; they are being reimagined through modern design lenses: sustainable fabrics, 3D-printed accessories, and gender-fluid tailoring. This blend creates a \"high-contrast\" visual language. For a model, this means the ability to switch \"modes\": moving from the sharp, architectural poses required for avant-garde tech-wear to the relaxed, emotive energy of vintage-inspired streetwear.",
      },
      {
        heading: "From Presentation to Performance",
        content: "The most significant shift in this evolution is the demand for personality and movement. In the traditional era, models were often directed to remain \"blank canvases\" to avoid distracting from the garment. Today, the garment is seen as part of a larger visual narrative. Designers now look for models who can convey a specific mood (rebellion, joy, or stoicism) through their facial expressions and \"eye-work.\" With the rise of video-first platforms and digital runways, the way a model moves is as important as how they stand. Posing has become more fluid and athletic, requiring models to have a deep understanding of their body's geometry.",
      },
      {
        heading: "Translating Trends for the Audience",
        content: "Models act as the vital bridge between a designer's abstract vision and the consumer's reality. As fashion pushes creative boundaries, models are the ones who humanize the trend. They translate complex concepts into something aspirational yet relatable. Whether it is a high-fashion campaign for a luxury house or a viral social media look, the model's ability to inject their own unique character into the clothes is what ultimately inspires and engages the audience.",
      },
    ],
    highlight: "In this era of rapid evolution, the most successful models are those who view themselves as creative collaborators. They don't just \"wear\" the fashion; they interpret it, bringing trends to life through a powerful combination of movement, emotion, and authentic self-expression.",
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const resolved = await params;
  const id = resolved?.id ?? "";
  const post = id ? posts[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-muted-foreground font-body">Post not found.</p>
          <Link to="/footer/blog" className="text-primary text-sm font-body mt-4 inline-block">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = postImages[id] || "/images/blogs/blog1.webp";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/footer/blog" className="text-primary font-body text-xs tracking-wider uppercase hover:underline mb-8 inline-block">← Back to Blog</Link>
          <div className="aspect-[21/9] max-h-[280px] w-full overflow-hidden rounded-sm mb-8 bg-muted">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </div>
          <p className="text-primary font-body text-xs tracking-wider uppercase">{post.category}</p>
          <h1 className="font-display text-4xl md:text-6xl line-accent mt-2">{post.title}</h1>
          <p className="text-muted-foreground font-body text-xs mt-4">{post.date} · {post.readTime}</p>

          <p className="text-muted-foreground font-body text-sm mt-8 leading-relaxed">{post.lead}</p>

          <div className="mt-10 space-y-8">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-xl text-foreground mb-3">{section.heading}</h2>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 bg-card magazine-border p-6">
            <p className="text-muted-foreground font-body text-sm leading-relaxed italic">{post.highlight}</p>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <Link to="/footer/blog" className="text-primary font-body text-xs tracking-wider uppercase hover:underline">← Back to Blog</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
