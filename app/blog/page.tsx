import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog | SmallCap Private Investments",
  description: "Insights on deal flow, succession, diligence, and operator life from SmallCap Private Investments.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-40 pb-32 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 animate-fade">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary mb-6 block font-bold">
              Insights
            </span>
            <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-6 tracking-tighter">
              The SmallCap <span className="text-primary italic">Journal.</span>
            </h1>
            <p className="text-xl text-text-dim max-w-2xl leading-relaxed">
              Practical notes on sourcing, succession, diligence, and the discipline of ownership.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block glass p-8 md:p-10 rounded-2xl hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                    {post.date}
                  </span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-widest text-text-dim border border-white/10 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-text-dim leading-relaxed max-w-3xl">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
