import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock3, MessageSquare, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

type HeadingLevel = 2 | 3;

type TocItem = {
  id: string;
  text: string;
  level: HeadingLevel;
};

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  authorName: string;
  categories: string[];
  tags: string[];
  comments: CommentType[];
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const slugifyHeading = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const stripInlineMarkdown = (value: string) =>
  value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

const stripHtmlTags = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const buildTocFromMarkdown = (markdown: string): TocItem[] => {
  const markdownHeadingMatches = [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)];
  const htmlHeadingMatches = [...markdown.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gim)];
  const used = new Map<string, number>();
  const items: TocItem[] = [];

  markdownHeadingMatches.forEach((match) => {
    const hashes = match[1] || "";
    const rawText = stripInlineMarkdown(match[2] || "").replace(/[#]+$/g, "").trim();
    const level = hashes.length as HeadingLevel;
    if (!rawText || (level !== 2 && level !== 3)) return;

    const baseId = slugifyHeading(rawText) || "section";
    const count = used.get(baseId) || 0;
    used.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    items.push({ id, text: rawText, level });
  });

  htmlHeadingMatches.forEach((match) => {
    const level = Number(match[1]) as HeadingLevel;
    const rawText = stripHtmlTags(match[2] || "");
    if (!rawText || (level !== 2 && level !== 3)) return;

    const alreadyExists = items.some(
      (item) => item.level === level && item.text.toLowerCase() === rawText.toLowerCase()
    );
    if (alreadyExists) return;

    const baseId = slugifyHeading(rawText) || "section";
    const count = used.get(baseId) || 0;
    used.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    items.push({ id, text: rawText, level });
  });

  return items;
};

const getReadingTimeLabel = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
};

const getHeroSummary = (text: string, maxChars = 280) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxChars) return normalized;

  const clipped = normalized.slice(0, maxChars);
  const sentenceEnd = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("? "), clipped.lastIndexOf("! "));
  if (sentenceEnd > Math.floor(maxChars * 0.55)) {
    return clipped.slice(0, sentenceEnd + 1).trim();
  }

  const wordEnd = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, wordEnd > 0 ? wordEnd : maxChars).trim()}...`;
};

export const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const preserveLineBreakSpacing = (html: string) => {
    if (!html) return "";

    return html.replace(/([^>])\n+/g, (match, prevChar) => {
      const lineBreaks = match.length - 1; // minus the captured character
      const breaks = lineBreaks === 1 ? "<br/>" : "<br/>";
      return prevChar + breaks;
    });
  };
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await fetch(
          "https://clinexy.in/wp-json/wp/v2/posts?per_page=5&_embed"
        );

        if (!res.ok) throw new Error("Failed to fetch recent blogs");

        const data = await res.json();

        const formattedBlogs: Blog[] = data.map((post: any) => ({
          id: String(post.id),
          title: post.title?.rendered,
          slug: post.slug,
          content: post.content?.rendered,
          featuredImage:
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            DEFAULT_BLOG_IMAGE,
          authorName:
            post._embedded?.author?.[0]?.name || "Clinexy Team",
          categories:
            post._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [],
          tags:
            post._embedded?.["wp:term"]?.[1]?.map((tag: any) => tag.name) || [],
          comments: [],
          createdAt: post.date,
        }));

        setRecentBlogs(formattedBlogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecentBlogs();
  }, []);
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `https://clinexy.in/wp-json/wp/v2/posts?slug=${slug}&_embed`
        );

        if (!res.ok) throw new Error("Blog not found");

        const data = await res.json();
        if (!data.length) throw new Error("Blog not found");

        const post = data[0];

        const authorName =
          post._embedded?.author?.[0]?.name || "Clinexy Team";

        const categories =
          post._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

        const tags =
          post._embedded?.["wp:term"]?.[1]?.map((tag: any) => tag.name) || [];

        const featuredImage =
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          DEFAULT_BLOG_IMAGE;

        const commentsRes = await fetch(
          `https://clinexy.in/wp-json/wp/v2/comments?post=${post.id}`
        );
        const commentsData = await commentsRes.json();

        const comments = commentsData.map((c: any) => ({
          id: c.id,
          author: c.author_name,
          content: c.content.rendered,
          date: c.date,
        }));

        const aioseo = post?.aioseo_meta_data || post?.aioseo;

        const normalizedBlog: Blog = {
          id: String(post.id),
          title: post.title?.rendered,
          slug: post.slug,
          content: post.content?.rendered,
          featuredImage,
          authorName,
          categories,
          tags,
          comments,
          createdAt: post.date,
          metaTitle:
            aioseo?.title || post.title?.rendered,
          metaDescription:
            aioseo?.description ||
            post.excerpt?.rendered?.replace(/<[^>]+>/g, ""),
          canonicalUrl: post.link,
          ogImage:
            aioseo?.og_image || featuredImage,
        };

        setBlog(normalizedBlog);
      } catch {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div className="py-40 text-center">Loading...</div>;
  }

  if (error || !blog) {
    return (
      <div className="py-40 text-center text-red-600">
        {error || "Blog not found"}
      </div>
    );
  }

  const decodeContent = (content: string) => {
    const normalizeText = (value: string) => value.replace(/\r\n/g, "\n");

    const extractFromObject = (parsed: unknown): string | null => {
      if (!parsed || typeof parsed !== "object") return null;

      const objectContent = parsed as {
        content?: unknown;
        markdown?: unknown;
        text?: unknown;
        body?: unknown;
        value?: unknown;
        sections?: unknown;
      };

      if (Array.isArray(objectContent.sections)) {
        const rawSections = objectContent.sections
          .map((entry) => {
            const section = (entry ?? {}) as {
              imageUrl?: unknown;
              image?: unknown;
              altText?: unknown;
              AltText?: unknown;
              heading?: unknown;
              Heading?: unknown;
              text?: unknown;
            };
            return {
              image:
                (typeof section.imageUrl === "string" && section.imageUrl.trim()) ||
                (typeof section.image === "string" && section.image.trim()) ||
                "",
              altText:
                (typeof section.altText === "string" && section.altText.trim()) ||
                (typeof section.AltText === "string" && section.AltText.trim()) ||
                "",
              heading:
                (typeof section.heading === "string" && section.heading.trim()) ||
                (typeof section.Heading === "string" && section.Heading.trim()) ||
                "",
              text: typeof section.text === "string" ? section.text : "",
            };
          })
          .filter((section) => section.image || section.text || section.heading);

        const compactSections = rawSections.reduce<typeof rawSections>((acc, section) => {
          const previous = acc[acc.length - 1];
          if (!previous) {
            acc.push(section);
            return acc;
          }

          const sameText =
            section.text &&
            previous.text &&
            section.text.toLowerCase() === previous.text.toLowerCase();

          if (sameText) {
            if (previous.image && !section.image) return acc;
            if (!previous.image && section.image) {
              acc[acc.length - 1] = section;
              return acc;
            }
            if (previous.image === section.image) return acc;
          }

          acc.push(section);
          return acc;
        }, []);

        const sectionMarkdown = compactSections
          .map((section) => {
            const parts: string[] = [];
            if (section.heading) parts.push(`## ${section.heading}`);
            if (section.image) {
              const imageAlt = section.altText || section.heading;
              parts.push(`![${imageAlt}](${section.image})`);
            }
            if (section.text) parts.push(section.text);
            return parts.join("\n\n");
          })
          .filter(Boolean)
          .join("\n\n");

        if (sectionMarkdown) return sectionMarkdown;
      }

      const candidate =
        objectContent.content ??
        objectContent.markdown ??
        objectContent.text ??
        objectContent.body ??
        objectContent.value;

      return typeof candidate === "string" ? candidate : null;
    };

    const decodeValue = (value: unknown, depth = 0): string => {
      if (depth > 3) return typeof value === "string" ? value : "";

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return decodeValue(parsed, depth + 1);
        } catch {
          return value;
        }
      }

      const extracted = extractFromObject(value);
      if (extracted) return decodeValue(extracted, depth + 1);

      return "";
    };

    const decoded = decodeValue(content);
    return normalizeText(decoded || content);
  };

  const markdownContent = decodeContent(blog.content);
  const featuredImage = blog.featuredImage || DEFAULT_BLOG_IMAGE;
  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://clinexy.com";
  const defaultCanonicalUrl = `${siteOrigin}/blogs/${blog.slug}`;
  const canonicalHref = (() => {
    const value = blog.canonicalUrl?.trim();
    if (!value) return defaultCanonicalUrl;
    try {
      return new URL(value, siteOrigin).toString();
    } catch {
      return defaultCanonicalUrl;
    }
  })();

  const plainTextContent = markdownContent
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const seoTitle = blog.metaTitle?.trim() || blog.title;
  const seoDescription = (blog.metaDescription?.trim() || plainTextContent).slice(0, 160);
  const heroSummary = getHeroSummary(blog.metaDescription?.trim() || plainTextContent, 280);
  const ogImage = blog.ogImage?.trim() || featuredImage;
  const keywordsFromTags = (blog.tags || [])
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .join(", ");
  const seoKeywords = blog.metaKeywords?.trim() || keywordsFromTags;
  const normalizedMarkdownContent = markdownContent
    .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/gm, "$1<em>$2</em>");

  const readingTimeLabel = getReadingTimeLabel(plainTextContent);
  const tocItems = buildTocFromMarkdown(normalizedMarkdownContent);

  const formattedPublishDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle}</title>
        <meta name="description" content={blog.metaDescription} />
        <link rel="canonical" href={blog.canonicalUrl} />
        <meta property="og:title" content={blog.metaTitle} />
        <meta property="og:description" content={blog.metaDescription} />
        <meta property="og:image" content={blog.ogImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#e0f2fe_0%,_#f8fafc_55%,_#ffffff_100%)] pb-14 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-4 text-sm text-slate-500">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/blogs" className="hover:text-primary-600">
              Blogs
            </Link>{" "}
            / <span className="text-slate-700">{blog.title}</span>
          </p>

          <div className="grid items-stretch gap-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl md:grid-cols-[1.05fr_0.95fr] md:p-8">
            <div className="flex flex-col justify-between">
              <div>
                {/* <div className="mb-4 inline-flex rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  Clinexy Blog
                </div> */}
                <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">{blog.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                  {heroSummary ||
                    "Actionable strategies and practical playbooks for clinic owners and healthcare teams."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Users className="h-4 w-4 text-primary-600" />
                  {blog.authorName}
                </span>
                {formattedPublishDate && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <Calendar className="h-4 w-4 text-primary-600" />
                    {formattedPublishDate}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-primary-600" />
                  {readingTimeLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <MessageSquare className="h-4 w-4 text-primary-600" />
                  0 Comments
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveImage({ src: featuredImage, alt: blog.title || "Featured image" })}
              className="group relative block h-full min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              aria-label="View full image"
              title="View full image"
            >
              <img
                src={featuredImage}
                alt={blog.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              {/* <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                Click to zoom
              </span> */}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div
                className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-p:leading-8 prose-p:text-slate-700 prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-3xl prose-h2:font-bold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl prose-strong:text-slate-900 prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 prose-blockquote:px-5 prose-blockquote:py-3 prose-li:my-0"
              >
                <div
                  className="
   prose prose-lg prose-slate
    max-w-3xl mx-auto
    [&_ul]:list-disc
    [&_ul]:pl-6
    [&_ol]:list-decimal
    [&_ol]:pl-6
    [&_li]:my-2
  "
                  dangerouslySetInnerHTML={{
                    __html: blog.content,
                  }}
                />
              </div>
            </div>


            {blog.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm text-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* {tocItems.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-base font-semibold text-slate-900">On this page</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {tocItems.map((item) => (
                    <li key={`side-${item.id}`} className={item.level === 3 ? "ml-3" : ""}>
                      <a href={`#${item.id}`} className="hover:text-primary-700">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Need help growing your clinic?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use Clinexy to simplify appointments, records, billing, and follow-ups from one dashboard.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Book a demo
              </Link>
            </div> */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Posts</h3>

              {recentBlogs.length === 0 ? (
                <p className="text-sm text-slate-500">No recent posts.</p>
              ) : (
                <ul className="space-y-4">
                  {recentBlogs
                    .filter((b) => b.slug !== blog.slug)
                    .slice(0, 5)
                    .map((b) => (
                      <li key={b.id}>
                        <Link
                          to={`/blogs/${b.slug}`}
                          className="line-clamp-2 font-medium text-slate-700 transition hover:text-primary-600"
                        >
                          {b.title}
                        </Link>

                        {b.createdAt && (
                          <div className="mt-1 text-xs text-slate-400">
                            {new Date(b.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Image Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            className="max-h-[90vh] max-w-[95vw]"
          />
        </div>
      )}
    </>
  );
};
