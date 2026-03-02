import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

type Blog = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  authorName: string;
  tags: string[];
  excerpt?: string;
  content?: string;
  createdAt?: string;
};

/* ---------------- Helpers ---------------- */

const keyword = (tags: string[]) =>
  tags?.[0]?.toUpperCase() || "CLINIC GROWTH";

const formatDate = (date?: string) =>
  date && !isNaN(new Date(date).getTime())
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently published";

const decodeContentToText = (value: unknown): string => {
  if (value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
      const parsed = JSON.parse(trimmed);
      return decodeContentToText(parsed);
    } catch {
      return trimmed;
    }
  }

  if (Array.isArray(value)) {
    return value.map((entry) => decodeContentToText(entry)).join(" ").trim();
  }

  if (typeof value !== "object") {
    return String(value);
  }

  const obj = value as {
    content?: unknown;
    Content?: unknown;
    body?: unknown;
    Body?: unknown;
    text?: unknown;
    markdown?: unknown;
    value?: unknown;
    sections?: unknown;
    Sections?: unknown;
  };

  const sections = obj.sections ?? obj.Sections;
  if (Array.isArray(sections)) {
    const sectionText = sections
      .map((entry) => {
        const section = (entry ?? {}) as {
          heading?: unknown;
          Heading?: unknown;
          text?: unknown;
          Text?: unknown;
        };

        const heading =
          (typeof section.heading === "string" && section.heading) ||
          (typeof section.Heading === "string" && section.Heading) ||
          "";
        const text =
          (typeof section.text === "string" && section.text) ||
          (typeof section.Text === "string" && section.Text) ||
          "";

        return `${heading} ${text}`.trim();
      })
      .filter(Boolean)
      .join(" ");

    if (sectionText) return sectionText;
  }

  const candidate =
    obj.content ??
    obj.Content ??
    obj.body ??
    obj.Body ??
    obj.text ??
    obj.markdown ??
    obj.value;

  return decodeContentToText(candidate);
};

const cleanPreviewText = (text: string) =>
  text
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const excerpt = (text?: string, len = 110) => {
  const cleaned = cleanPreviewText(text || "");
  if (!cleaned) return "Read this article to learn practical growth insights.";
  if (cleaned.length <= len) return cleaned;
  const short = cleaned.slice(0, len);
  const splitAt = short.lastIndexOf(" ");
  return `${short.slice(0, splitAt > 0 ? splitAt : len)}...`;
};

const normalize = (item: any, i: number): Blog => {
  const title = item?.title || item?.Title || "Untitled";
  return {
    id: String(item?.id || item?.Id || i),
    slug:
      item?.slug ||
      item?.Slug ||
      title.toLowerCase().replace(/\s+/g, "-"),
    title,
    featuredImage:
      item?.featuredImage || item?.FeaturedImage || DEFAULT_IMAGE,
    authorName: item?.authorName || item?.AuthorName || "Clinexy Team",
    tags: item?.tags || item?.Tags || [],
    excerpt:
      item?.excerpt ||
      item?.Excerpt ||
      item?.summary ||
      item?.description,
    content: decodeContentToText(item?.content || item?.Content || item?.body || item?.Body),
    createdAt: item?.createdAt || item?.CreatedAt,
  };
};

/* ---------------- Reusable UI ---------------- */

const BlogImage = ({
  blog,
  height,
}: {
  blog: Blog;
  height: string;
}) => (
  <Link to={`/blogs/${blog.slug}`} className="block overflow-hidden rounded-2xl">
    <img
      src={blog.featuredImage || DEFAULT_IMAGE}
      alt={blog.title}
      className={`${height} w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110`}
    />
  </Link>
);

const AuthorRow = ({ blog }: { blog: Blog }) => (
  <div className="flex items-center justify-between gap-4 text-slate-500 text-sm">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
        {blog.authorName.charAt(0).toUpperCase()}
      </div>
      <p className="truncate">by {blog.authorName}</p>
    </div>
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      <span>{formatDate(blog.createdAt)}</span>
    </div>
  </div>
);

/* ---------------- Component ---------------- */

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch(
        "https://clinexy.in/wp-json/wp/v2/posts?_embed&per_page=100"
      );

      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();

      const formatted: Blog[] = data.map((post: any) => ({
        id: String(post.id),
        slug: post.slug,
        title: post.title?.rendered,
        featuredImage:
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          DEFAULT_IMAGE,
        authorName:
          post._embedded?.author?.[0]?.name || "Clinexy Team",
        tags:
          post._embedded?.["wp:term"]?.[1]?.map((tag: any) => tag.name) || [],
        excerpt: post.excerpt?.rendered,
        content: post.content?.rendered,
        createdAt: post.date,
      }));

      setBlogs(
        formatted.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  if (loading)
    return (
      <div className="py-40 text-center text-slate-500">
        Loading blogs...
      </div>
    );

  if (!blogs.length)
    return (
      <div className="py-40 text-center text-slate-500">
        No blogs available right now.
      </div>
    );

  const [featured, ...rest] = blogs;
  const side = rest.slice(0, 2);
  const latest = rest.slice(2);

  return (
    <section className="bg-slate-50 pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Featured Insights
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Latest ideas and practical guides to help clinics improve operations.
            </p>
          </div>
         
        </div>

        {/* Featured + Side */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">

          {/* Featured */}
          <article className="group rounded-2xl border bg-white shadow-sm hover:shadow-lg">
            <BlogImage blog={featured} height="h-[320px]" />

            <div className="space-y-4 p-6">
              <p className="text-sm font-medium text-amber-500">
                {keyword(featured.tags)}
              </p>

              <Link to={`/blogs/${featured.slug}`}>
                <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-primary-700">
                  {featured.title}
                </h2>
              </Link>

              <p className="text-base text-slate-600 leading-relaxed">
                {excerpt(featured.excerpt || featured.content)}
              </p>

              <AuthorRow blog={featured} />
            </div>
          </article>

          {/* Side Blogs */}
          <div className="space-y-8">
            {side.map((blog) => (
              <article key={blog.id} className="group">
                <BlogImage blog={blog} height="h-44" />

                <div className="pt-4">
                  <p className="mb-2 text-sm font-medium text-amber-500">
                    {keyword(blog.tags)}
                  </p>

                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-medium text-slate-900 group-hover:text-primary-700">
                      {blog.title}
                    </h3>
                  </Link>

                  <div className="mt-3">
                    <AuthorRow blog={blog} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Latest */}
        {latest.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 text-3xl font-semibold text-slate-900">
              Latest
            </h2>

            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              {latest.map((blog) => (
                <article key={blog.id} className="group border-t pt-5">
                  <div className="grid gap-4 sm:grid-cols-[260px_1fr]">

                    <BlogImage blog={blog} height="h-40" />

                    <div>
                      <p className="text-sm font-medium text-amber-500">
                        {keyword(blog.tags)}
                      </p>

                      <Link to={`/blogs/${blog.slug}`}>
                        <h3 className="mt-2 text-xl font-medium text-slate-900 group-hover:text-primary-700">
                          {blog.title}
                        </h3>
                      </Link>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary-500" />
                          <span>by {blog.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary-500" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Blogs;
