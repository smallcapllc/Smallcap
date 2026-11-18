import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isPostLive, normalizePostDate } from "./publish-date";

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

function loadPosts(): Post[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        title: String(data.title ?? ""),
        slug: String(data.slug ?? filename.replace(/\.mdx$/, "")),
        description: String(data.description ?? ""),
        date: normalizePostDate(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        content,
      };
    });
}

function toMeta(post: Post): PostMeta {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    tags: post.tags,
  };
}

/**
 * Every slug on disk, including posts whose date has not arrived.
 * Public pages must use getAllPosts / getPostBySlug instead.
 */
export function listAllPostSlugs(): string[] {
  return loadPosts().map((post) => post.slug);
}

export function getAllPosts(now: Date = new Date()): PostMeta[] {
  return loadPosts()
    .filter((post) => isPostLive(post.date, now))
    .map(toMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, now: Date = new Date()): Post | null {
  const post = loadPosts().find((entry) => entry.slug === slug);
  if (!post || !isPostLive(post.date, now)) return null;
  return post;
}
