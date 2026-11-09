import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, getDevtoArticle } from "@/lib/api";
import { DuoTitle } from "../duo-title";
import "../page.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSettings();
  if (!s.devtoUsername) return { title: "Post not found" };
  const article = await getDevtoArticle(s.devtoUsername, slug);
  if (!article) return { title: "Post not found" };
  return {
    title: `${article.title} - Blog`,
    description: article.description,
    keywords: article.tag_list,
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: article.published_at,
      tags: article.tag_list,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

function publishedOn(a: { readable_publish_date: string; published_at: string }): string {
  return (
    a.readable_publish_date ||
    new Date(a.published_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const s = await getSettings();
  if (!s.devtoUsername) notFound();
  const article = await getDevtoArticle(s.devtoUsername, slug);
  if (!article) notFound();

  return (
    <article className="post-page" aria-label={article.title}>
      <div className="post-wrap">
        <Link href="/blog" className="post-back hero-fade-up">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All articles
        </Link>

        <header className="post-header hero-fade-up">
          <h1 className="post-title"><DuoTitle>{article.title}</DuoTitle></h1>
          <div className="blog-meta">
            <span className="blog-meta-item" aria-label="Published">
              <svg
                className="blog-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {publishedOn(article)}
            </span>
            <span className="blog-meta-item" aria-label="Reading time">
              <svg
                className="blog-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 12" />
              </svg>
              {article.reading_time_minutes} min read
            </span>
            <span className="blog-meta-item" aria-label="Reactions">
              <svg
                className="blog-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78 19.19 19.19 0 0 0 2.43 4.93 18.95 18.95 0 0 0 5.35 5.35l1.06 1.06a5.5 5.5 0 0 0 7.78-7.78 19.19 19.19 0 0 0 2.43-4.93 18.95 18.95 0 0 0 5.35-5.35c0-1.52-.52-3.04-1.52-4.2z" />
              </svg>
              {article.positive_reactions_count}
            </span>
          </div>
          <div className="blog-tags" role="list" aria-label="Tags">
            {article.tag_list.map((tag) => (
              <span key={tag} className="prj-chip" role="listitem">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {article.cover_image && (
          <img
            src={article.cover_image}
            alt=""
            className="post-cover hero-fade-up"
            loading="eager"
            decoding="async"
          />
        )}

        <div className={`post-body hero-fade-up${article.cover_image ? "" : " post-body-no-cover"}`} dangerouslySetInnerHTML={{ __html: article.body_html }} />

        <footer className="post-footer">
          <a
            className="post-devto-link"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read on dev.to
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <p className="post-canonical-hint">
            Original article: <code>{`https://www.naheel.me/blog/${slug}`}</code>
          </p>
        </footer>
      </div>
    </article>
  );
}
