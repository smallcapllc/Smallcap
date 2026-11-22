import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import test from "node:test";
import { getPostBySlug } from "./posts";

const live = new Date("2027-01-08T15:00:00.000Z");

function renderMarkdown(markdown: string): string {
  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      { remarkPlugins: [remarkGfm] },
      markdown,
    ),
  );
}

test("GFM tables and fenced code render", () => {
  const html = renderMarkdown(
    [
      "| Step | Owner |",
      "| --- | --- |",
      "| Quote | Office |",
      "",
      "```",
      "po-intake",
      "```",
      "",
      "Use {fields} when the value is < 10.",
    ].join("\n"),
  );

  assert.match(html, /<table>/);
  assert.match(html, /<th>Step<\/th>/);
  assert.match(html, /<td>Office<\/td>/);
  assert.match(html, /<pre><code>po-intake\n<\/code><\/pre>/);
  assert.match(html, /\{fields\}/);
  assert.match(html, /&lt; 10/);
});

test("scheduled posts render headings, tables, and only known links", () => {
  const postsWithTables = new Set([
    "ai-agent-org-chart",
    "contractor-ap-automation",
    "modernization-thesis",
    "owner-dependence-80-percent-test",
    "why-2500-sprint",
  ]);
  const allowedLinks = new Set([
    "https://smallcap.cc/book",
    "https://alexandrapeterson.com/how-to-get-eyes-on-old-instagram-posts/",
  ]);

  for (const slug of [
    "ai-integration-gap",
    "close-instead-of-sell",
    "ai-agent-org-chart",
    "sba-rules-2026-owners",
    "contractor-ap-automation",
    "modernization-thesis",
    "owner-dependence-80-percent-test",
    "why-2500-sprint",
    "repurpose-old-content",
  ]) {
    const post = getPostBySlug(slug, live);
    assert.ok(post, slug);
    const html = renderMarkdown(post.content);
    assert.match(html, /<h2>/, slug);
    assert.equal(html.includes("|---|"), false, slug);
    assert.equal(html.includes("<table>"), postsWithTables.has(slug), slug);
    if (slug === "repurpose-old-content") assert.match(html, /<h3>/);

    const links = [...post.content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
    assert.ok(links.length > 0, slug);
    for (const href of links) {
      assert.equal(allowedLinks.has(href), true, `${slug} -> ${href}`);
    }
    assert.match(html, /href="https:\/\/smallcap.cc\/book"/, slug);
  }

  const scorecard = getPostBySlug("owner-dependence-80-percent-test", live);
  assert.ok(scorecard);
  const scoreHtml = renderMarkdown(scorecard.content);
  assert.match(scoreHtml, /<ol start="4">/);
  assert.match(scoreHtml, /<ol start="7">/);
});
