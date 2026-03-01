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
  category?: string;
  tags: string[];
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  const normalizeBlog = (item: unknown, index: number): Blog => {
    const raw = (item ?? {}) as {
      id?: unknown;
      Id?: unknown;
      title?: unknown;
      Title?: unknown;
      slug?: unknown;
      Slug?: unknown;
      content?: unknown;
      Content?: unknown;
      featuredImage?: unknown;
      FeaturedImage?: unknown;
      authorName?: unknown;
      AuthorName?: unknown;
      tags?: unknown;
      Tags?: unknown;
      createdAt?: unknown;
      CreatedAt?: unknown;
      metaTitle?: unknown;
      MetaTitle?: unknown;
      metaDescription?: unknown;
      MetaDescription?: unknown;
      metaKeywords?: unknown;
      MetaKeywords?: unknown;
      canonicalUrl?: unknown;
      CanonicalUrl?: unknown;
      ogImage?: unknown;
      OgImage?: unknown;
      OpenGraphImage?: unknown;
    };

    const title =
      (typeof raw.title === "string" && raw.title) ||
      (typeof raw.Title === "string" && raw.Title) ||
      "Untitled";
    const slugValue =
      (typeof raw.slug === "string" && raw.slug) ||
      (typeof raw.Slug === "string" && raw.Slug) ||
      title.toLowerCase().replace(/\s+/g, "-");

    return {
      id: String(raw.id ?? raw.Id ?? index),
      title,
      slug: slugValue,
      content:
        (typeof raw.content === "string" && raw.content) ||
        (typeof raw.Content === "string" && raw.Content) ||
        "",
      featuredImage:
        (typeof raw.featuredImage === "string" && raw.featuredImage) ||
        (typeof raw.FeaturedImage === "string" && raw.FeaturedImage) ||
        DEFAULT_BLOG_IMAGE,
      authorName:
        (typeof raw.authorName === "string" && raw.authorName) ||
        (typeof raw.AuthorName === "string" && raw.AuthorName) ||
        "Clinexy Team",
      tags: Array.isArray(raw.tags)
        ? raw.tags.map(String)
        : Array.isArray(raw.Tags)
          ? raw.Tags.map(String)
          : [],
      createdAt:
        (typeof raw.createdAt === "string" && raw.createdAt) ||
        (typeof raw.CreatedAt === "string" && raw.CreatedAt) ||
        undefined,
      metaTitle:
        (typeof raw.metaTitle === "string" && raw.metaTitle) ||
        (typeof raw.MetaTitle === "string" && raw.MetaTitle) ||
        undefined,
      metaDescription:
        (typeof raw.metaDescription === "string" && raw.metaDescription) ||
        (typeof raw.MetaDescription === "string" && raw.MetaDescription) ||
        undefined,
      metaKeywords:
        (typeof raw.metaKeywords === "string" && raw.metaKeywords) ||
        (typeof raw.MetaKeywords === "string" && raw.MetaKeywords) ||
        undefined,
      canonicalUrl:
        (typeof raw.canonicalUrl === "string" && raw.canonicalUrl) ||
        (typeof raw.CanonicalUrl === "string" && raw.CanonicalUrl) ||
        undefined,
      ogImage:
        (typeof raw.ogImage === "string" && raw.ogImage) ||
        (typeof raw.OgImage === "string" && raw.OgImage) ||
        (typeof raw.OpenGraphImage === "string" && raw.OpenGraphImage) ||
        undefined,
    };
  };

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await fetch("https://admin.urest.in:8089/api/blogs/GetAllBlogs");
        if (!res.ok) return;

        const response = await res.json();
        const list: unknown[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.blogs)
            ? response.blogs
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.content)
                ? response.content
                : [];

        const normalized = list.map((entry, idx) => normalizeBlog(entry, idx));

        const filtered = normalized
          .filter((b) => b.slug !== slug)
          .sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
          })
          .slice(0, 5);

        setRecentBlogs(filtered);
      } catch (err) {
        console.error("Failed to load recent blogs", err);
      }
    };

    fetchRecentBlogs();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`https://admin.urest.in:8089/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Blog not found");

        const data = await res.json();
        setBlog(normalizeBlog(data, 0));
      } catch {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage]);

  if (loading) {
    return <div className="py-40 text-center text-slate-500">Loading blog...</div>;
  }

  if (error || !blog) {
    return <div className="py-40 text-center text-red-600">{error || "Blog not found"}</div>;
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
              const imageAlt = section.altText || section.heading ;
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
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalHref} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalHref} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({ node, children, ...props }) => {
                      const text = typeof children?.[0] === "string" ? children[0] : String(children ?? "");
                      const id = slugifyHeading(stripInlineMarkdown(text));
                      return (
                        <h2 id={id || undefined} {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ node, children, ...props }) => {
                      const text = typeof children?.[0] === "string" ? children[0] : String(children ?? "");
                      const id = slugifyHeading(stripInlineMarkdown(text));
                      return (
                        <h3 id={id || undefined} {...props}>
                          {children}
                        </h3>
                      );
                    },
                    div: ({ node, ...props }) => {
                      const divProps = props as React.HTMLAttributes<HTMLDivElement> & {
                        align?: "left" | "center" | "right";
                      };
                      const align = divProps.align;
                      return (
                        <div
                          {...divProps}
                          style={{
                            ...(divProps.style || {}),
                            ...(align ? { textAlign: align } : {}),
                          }}
                        />
                      );
                    },
                    p: ({ node, ...props }) => {
                      const pProps = props as React.HTMLAttributes<HTMLParagraphElement> & {
                        align?: "left" | "center" | "right";
                      };
                      const align = pProps.align;
                      return (
                        <p
                          {...pProps}
                          style={{
                            ...(pProps.style || {}),
                            whiteSpace: "break-spaces",
                            marginTop: "0.95rem",
                            marginBottom: "0.95rem",
                            ...(align ? { textAlign: align } : {}),
                          }}
                        />
                      );
                    },
                    span: ({ node, ...props }) => {
                      const spanProps = props as React.HTMLAttributes<HTMLSpanElement>;
                      return (
                        <span
                          {...spanProps}
                          style={{
                            ...(spanProps.style || {}),
                            verticalAlign: "baseline",
                            ...(spanProps.style?.fontSize ? { lineHeight: 1.5 } : {}),
                          }}
                        />
                      );
                    },
                    li: ({ node, ...props }) => {
                      const liProps = props as React.LiHTMLAttributes<HTMLLIElement>;
                      return (
                        <li
                          {...liProps}
                          className={`leading-8 ${liProps.className || ""}`.trim()}
                          style={{
                            ...(liProps.style || {}),
                            whiteSpace: "break-spaces",
                            marginTop: "0.45rem",
                            marginBottom: "0.45rem",
                          }}
                        />
                      );
                    },
                    img: ({ node, ...props }) => {
                      const imgProps = props as React.ImgHTMLAttributes<HTMLImageElement>;
                      if (!imgProps.src) return null;
                      return (
                        <figure className="my-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveImage({
                                src: imgProps.src || "",
                                alt: imgProps.alt || "Blog section image",
                              })
                            }
                            className="block w-full cursor-zoom-in"
                            aria-label="View full image"
                            title="View full image"
                          >
                            <img
                              {...imgProps}
                              alt={imgProps.alt || "Blog section image"}
                              className="max-h-[560px] w-full object-contain object-center"
                              loading="lazy"
                            />
                          </button>
                          {/* {imgProps.alt && (
                            <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                              {imgProps.alt}
                            </figcaption>
                          )} */}
                        </figure>
                      );
                    },
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
                    hr: ({ node, ...props }) => (
                      <hr {...props} className="my-8 border-0 border-t border-slate-300" />
                    ),
                  }}
                >
                  {normalizedMarkdownContent}
                </ReactMarkdown>
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
                  {recentBlogs.map((b) => (
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

      {activeImage && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute right-4 top-4 rounded-md border border-white/30 bg-black/40 px-3 py-1.5 text-sm text-white hover:bg-black/60"
          >
            Close
          </button>
          <div
            className="max-h-[90vh] max-w-[95vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[88vh] max-w-[95vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
