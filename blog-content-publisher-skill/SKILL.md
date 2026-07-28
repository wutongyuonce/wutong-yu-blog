---
name: blog-content-publisher
description: Publish and maintain content for the Wutong-Yu Astro blog. Use when creating, editing, validating, or preparing a Markdown/MDX blog post in src/content/blogs, or when adding, updating, ordering, or removing Friends entries in src/content/friends/data.json.
---

# Blog Content Publisher

Maintain this repository's source-first content workflow. Treat `src/content/schema.ts` as the current contract; do not rely on old examples when it conflicts with that file.

## Choose the operation

- **Blog**: create or edit `src/content/blogs/**/*.md` or `.mdx`.
- **Friends**: edit the single JSON array at `src/content/friends/data.json`.
- **Publish**: make the requested content change, validate it, then report the changed files. Do not commit, push, deploy, or make a draft public unless the user explicitly asks.

Start by confirming the repository root contains `package.json` and reading the relevant schema and a nearby existing content example. Preserve unrelated working-tree changes.

## Blog workflow

1. Choose a short, stable Markdown filename. A nested directory is valid and becomes part of `/blogs/<slug>/`; do not rename an existing post without confirming because it changes the URL.
2. Write YAML frontmatter. `title` (maximum 60 characters) and `pubDate` are required. Use `YYYY-MM-DD`; use the user's requested date or today's local date. Add optional fields only when they convey real intent.
3. Use `draft: true` when the user asks for a draft or does not explicitly ask to publish. Set it to `false` or omit it only for a requested public post.
4. Keep `description` concise and factual. Set `toc: false` only for very short content; use `search: false` only when the post should be excluded from Pagefind. `ogImage` defaults to automatic generation, so omit it unless disabling or supplying a custom image.
5. Place new static images in an appropriately named `public/` subdirectory and reference them with an absolute site path such as `/article-images/diagram.png`. For `cover`, use a valid remote URL or a valid local image reference accepted by the content schema. Include descriptive `coverAlt` when a cover is used.
6. Keep Markdown readable: use headings in order, fenced code blocks with a language, meaningful image alt text, and direct links. Do not invent citations, dates, or claims.

Minimal public-post frontmatter:

```md
---
title: Article title
description: A concise summary for search and sharing.
pubDate: 2026-07-28
tags: [Astro]
---
```

## Friends workflow

1. Read the whole JSON array before editing. Each entry requires `id`, `name`, `link`, `desc`, and `category`; `avatar`, `siteLabel`, and `order` have defaults.
2. Use a stable, unique `id`. Prefer a lowercase ASCII slug for new entries, while preserving the existing IDs already in the file.
3. Require a complete `https://` or `http://` link. Use an HTTPS avatar URL when supplied; leave `avatar` as an empty string if no reliable avatar is available, because the UI has a text fallback.
4. Preserve the existing category unless asked to recategorize. For a new entry, assign the next integer after the largest `order` in that category; use the requested order only when the user specifies placement.
5. Keep `desc` short, specific, and respectful. Add `siteLabel` only when it adds a distinct compact label.
6. Preserve valid JSON formatting and do not reorder entries merely for aesthetics. Display order is determined by `order`, then Chinese locale name sorting.

Example:

```json
{
  "id": "example-blog",
  "name": "Example Blog",
  "link": "https://example.com/",
  "avatar": "",
  "desc": "A focused technical blog.",
  "category": "独立博客",
  "siteLabel": "技术写作",
  "order": 5
}
```

## Validate before handoff

Run the bundled structural check on the relevant content, then run the repository checks:

```bash
python3 skills/blog-content-publisher/scripts/validate_content.py --root . --blog path/to/post.md
python3 skills/blog-content-publisher/scripts/validate_content.py --root . --friends
pnpm check
pnpm build
```

Use the blog command for each changed post. The script catches common content mistakes but is not a substitute for Astro's schema validation. If a check fails, fix only the content change or explain why a pre-existing failure blocks completion. Inspect `git diff --check` and the targeted diff before handing off.

## Handoff

State what was created or changed, its eventual route or Friends category/order, and validation results. Mention drafts clearly. If the user asked for deployment, inspect the repository's actual deployment configuration and ask for missing deployment authority rather than guessing.
