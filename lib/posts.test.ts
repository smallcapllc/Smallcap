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
