import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getAllPosts, getPostBySlug, listAllPostSlugs } from "./posts";

const publishedOrder = [
  "sourcing-deal-flow",
  "retiring-owners-silver-tsunami",
  "founder-family-balance",
  "evaluating-potential-businesses",
  "approaching-retiring-owners",
];

function fixture(slug: string, date: string): string {
  return `---
title: "Fixture ${slug}"
slug: "${slug}"
description: "Fixture description for ${slug}"
date: "${date}"
tags: ["fixture"]
---

Fixture body for ${slug}.
`;
}

test("existing posts stay published and future posts stay hidden", () => {
  const now = new Date("2026-11-18T15:00:00.000Z");
  const posts = getAllPosts(now);
  assert.deepEqual(
    posts.map((post) => post.slug),
    publishedOrder,
  );
  for (const post of posts) {
    assert.equal(post.date, "2026-11-09");
  }

  const sourcing = getPostBySlug("sourcing-deal-flow", now);
  assert.ok(sourcing);
  assert.equal(sourcing.title, "Sourcing Deal Flow Outside the Auction Room");
  assert.match(sourcing.content, /In small-cap private investing/);

  const futureSlug = `zz-scheduled-future-${process.pid}`;
  const pastSlug = `zz-scheduled-past-${process.pid}`;
  const boundarySlug = `zz-scheduled-boundary-${process.pid}`;
  const directory = path.join(process.cwd(), "content/blog");
  const files = [futureSlug, pastSlug, boundarySlug].map((slug) => path.join(directory, `${slug}.mdx`));

  try {
    fs.writeFileSync(files[0], fixture(futureSlug, "2099-01-01"));
    fs.writeFileSync(files[1], fixture(pastSlug, "1999-01-01"));
    fs.writeFileSync(files[2], fixture(boundarySlug, "2026-11-18"));

    assert.equal(getPostBySlug(futureSlug, now), null);
    assert.equal(
      getAllPosts(now).some((post) => post.slug === futureSlug),
      false,
    );
    assert.equal(listAllPostSlugs().includes(futureSlug), true);

    const past = getPostBySlug(pastSlug, now);
    assert.ok(past);
    assert.equal(past.date, "1999-01-01");
    assert.equal(
      getAllPosts(now).some((post) => post.slug === pastSlug),
      true,
    );

    const beforePublish = new Date("2026-11-18T04:30:00.000Z");
    const onPublishDate = new Date("2026-11-18T05:00:00.000Z");
    assert.equal(getPostBySlug(boundarySlug, beforePublish), null);
    assert.equal(
      getAllPosts(beforePublish).some((post) => post.slug === boundarySlug),
      false,
    );
    const published = getPostBySlug(boundarySlug, onPublishDate);
    assert.ok(published);
    assert.match(published.content, /Fixture body/);
    assert.equal(
      getAllPosts(onPublishDate).some((post) => post.slug === boundarySlug),
      true,
    );

    const visible = getAllPosts(now)
      .map((post) => post.slug)
      .filter((slug) => publishedOrder.includes(slug));
    assert.deepEqual(visible, publishedOrder);
  } finally {
    for (const file of files) fs.rmSync(file, { force: true });
  }
});

const scheduledPosts: Array<{ slug: string; date: string; title: string }> = [
  {
    slug: "ai-integration-gap",
    date: "2026-11-24",
    title: "Everyone Uses AI Now. Almost Nobody Has It in Their Operations.",
  },
  {
    slug: "close-instead-of-sell",
    date: "2026-12-01",
    title: "Why Most Small Businesses Close Instead of Sell",
  },
  {
    slug: "ai-agent-org-chart",
    date: "2026-12-03",
    title: "I Run My Company With a Team of AI Agents. Here's the Org Chart.",
  },
  {
    slug: "sba-rules-2026-owners",
    date: "2026-12-08",
    title: "The New SBA Rules Just Changed What Your Business Is Worth",
  },
  {
    slug: "contractor-ap-automation",
    date: "2026-12-10",
    title: "Accounts Payable in a Day: What Contractors Get Wrong About AI",
  },
  {
    slug: "modernization-thesis",
    date: "2026-12-15",
    title: "Buy at 2.3x, Operate Like a 3.7x Business: The Modernization Thesis",
  },
  {
    slug: "owner-dependence-80-percent-test",
    date: "2026-12-17",
    title: "The 80% Test: Could Your Business Run for a Month Without You?",
  },
  {
    slug: "why-2500-sprint",
    date: "2027-01-05",
    title: "Why Our Implementation Sprint Costs $2,500 (and Why That's the Point)",
  },
  {
    slug: "repurpose-old-content",
    date: "2027-01-07",
    title: "Your Best Marketing Is Already Sitting in a Folder",
  },
];

test("scheduled posts stay hidden through November 22, 2026 and publish on their date", () => {
  const today = new Date("2026-11-22T16:00:00.000Z");
  const visible = new Set(getAllPosts(today).map((post) => post.slug));

  for (const expected of scheduledPosts) {
    assert.equal(visible.has(expected.slug), false);
    assert.equal(getPostBySlug(expected.slug, today), null);
    assert.ok(expected.date > "2026-11-22");

    const beforePublish = new Date(`${expected.date}T04:30:00.000Z`);
    assert.equal(getPostBySlug(expected.slug, beforePublish), null);

    const onPublish = new Date(`${expected.date}T05:00:00.000Z`);
    const post = getPostBySlug(expected.slug, onPublish);
    assert.ok(post);
    assert.equal(post.date, expected.date);
    assert.equal(post.title, expected.title);
    assert.equal(post.slug, expected.slug);
    assert.equal(/\bTrey\b/.test(post.content), false);
    assert.match(post.content, /Tre Robinson/);
    assert.equal(post.content.includes("Suggested frontmatter"), false);
    assert.equal(post.content.includes("**Feeds:**"), false);
    assert.equal(post.content.includes("**Keyword:**"), false);
    assert.equal(post.content.includes("**CTA:**"), false);
  }
});
