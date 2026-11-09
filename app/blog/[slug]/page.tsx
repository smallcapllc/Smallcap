import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | SmallCap Private Investments`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Strip the leading H1 from markdown body (title shown in page chrome)
  const body = post.content.replace(/^\s*#\s+.+\n+/, "");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-40 pb-32 px-6">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-[10px] uppercase tracking-widest text-text-dim hover:text-primary transition-colors inline-block mb-8"
          >
            ← Back to Journal
          </Link>
          <div className="mb-10 animate-fade">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{post.date}</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-text-dim border border-white/10 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-outfit font-bold text-white mb-6 tracking-tighter leading-[1.05]">
              {post.title}
            </h1>
            <p className="text-lg text-text-dim leading-relaxed">{post.description}</p>
          </div>
          <div className="blog-prose border-t border-white/5 pt-10">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
