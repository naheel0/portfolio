import type { Metadata } from "next";
import Link from "next/link";
import "./page.css";
import { getSettings, getDevtoArticles, type DevtoArticle } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.name || "Naheel Muhammed PK";
  return {
    title: `Blog - ${name}`,
    description: `Latest articles by ${name} on dev.to.`,
    alternates: { canonical: `${BASE_URL}/blog` },
    openGraph: {
      title: `Blog - ${name}`,
      description: `Latest articles by ${name} on dev.to.`,
      url: `${BASE_URL}/blog`,
      type: "website",
    },
  };
}

function publishedOn(a: DevtoArticle): string {
  return (
    a.readable_publish_date ||
    new Date(a.published_at).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
}

function Meta({ article, className = "" }: { article: DevtoArticle; className?: string }) {
  return (
    <div className={`blog-meta ${className}`.trim()}>
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
  );
}

export default async function BlogPage() {
  const s = await getSettings();
  const articles = await getDevtoArticles(s.devtoUsername);
  const name = s.name || "Naheel Muhammed PK";
  const empty = articles.length === 0;
  const [featured, ...rest] = articles;

  return (
    <section className="blog-page" id="blog" aria-label="Blog">
      <div className="blog-wrap">
        <div className="blog-topbar">
          <Link href="/" className="portal-back">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to portfolio
          </Link>
        </div>
        <header className="blog-header">
          <h1 className="blog-title">Blog</h1>
          <p className="blog-sub">
            {empty
              ? "Articles by Naheel, published on dev.to."
              : `${articles.length} article${articles.length === 1 ? "" : "s"} on dev.to`}
          </p>
        </header>

        {empty ? (
          <div className="blog-empty">
            <h2 className="blog-empty-title">No articles published yet.</h2>
            <p className="blog-empty-desc">
              Add a dev.to username in admin settings and published articles will appear here.
            </p>
          </div>
        ) : (
          <>
            <a
              href={featured.slug ? `/blog/${featured.slug}` : featured.url}
              className="blog-featured"
            >
              {featured.cover_image && (
                <img
                  src={featured.cover_image}
                  alt=""
                  className="blog-featured-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
              <div className="blog-featured-body">
                <h2 className="blog-featured-title">{featured.title}</h2>
                <p className="blog-featured-desc">{featured.description}</p>
                <div className="blog-tags" role="list" aria-label="Tags">
                  {featured.tag_list.slice(0, 6).map((tag) => (
                    <span key={tag} className="prj-chip" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
                <Meta article={featured} />
              </div>
            </a>

            {rest.length > 0 && (
              <ul className="blog-list" role="list" aria-label="More articles">
                {rest.map((article, i) => (
                  <li
                    key={article.url}
                    className=""
                    style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                  >
                    <a
                      href={article.slug ? `/blog/${article.slug}` : article.url}
                      className={`blog-row${article.cover_image ? "" : " no-thumb"}`}
                    >
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt=""
                          className="blog-row-thumb"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="blog-row-body">
                        <h3 className="blog-row-title">{article.title}</h3>
                        <p className="blog-row-desc">{article.description}</p>
                        <Meta article={article} className="blog-meta-row" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {s.devtoUsername && (
              <a
                className="blog-more"
                href={`https://dev.to/${s.devtoUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                More articles on dev.to
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
            )}
          </>
        )}
      </div>
    </section>
  );
}
