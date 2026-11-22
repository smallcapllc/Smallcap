import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { replaceBookingLinks } from "@/lib/booking-cta";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { bookingUrl, pageSocial } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

// Slugs that were unpublished at build time can still render once their date arrives.
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageSocial(post.title, post.description, {
    type: "article",
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Strip the leading H1 from markdown body (title shown in page chrome).
  // BOOKING-LINK in future posts resolves to the fit-call page.
  const body = replaceBookingLinks(post.content.replace(/^\s*#\s+.+\n+/, ""));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="min-w-0 flex-grow pt-40 pb-32 px-6">
        <article className="mx-auto min-w-0 max-w-3xl">
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) =>
                  href === bookingUrl ? (
                    <Link href="/book">{children}</Link>
                  ) : (
                    <a href={href}>{children}</a>
                  ),
                table: ({ children }) => (
                  <div className="blog-table-wrap">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {body}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
