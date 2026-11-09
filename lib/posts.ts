import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
};

export type Post = PostMeta & {
  content: string;
};

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
    const { data } = matter(raw);
    return {
      title: String(data.title ?? ""),
      slug: String(data.slug ?? filename.replace(/\.mdx$/, "")),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
    const { data, content } = matter(raw);
    const postSlug = String(data.slug ?? filename.replace(/\.mdx$/, ""));
    if (postSlug === slug) {
      return {
        title: String(data.title ?? ""),
        slug: postSlug,
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        content,
      };
    }
  }
  return null;
}
