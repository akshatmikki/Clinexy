import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
}

export const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);

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
        "",
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

        const normalized = list.map((item, index) => normalizeBlog(item, index));

        // Exclude current blog + show latest first
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
        const res = await fetch(
          `https://admin.urest.in:8089/api/blogs/${slug}`
        );

        if (!res.ok) throw new Error("Blog not found");

        const data = await res.json();
        setBlog(normalizeBlog(data, 0));
      } catch (err) {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-40 text-center text-slate-500">
        Loading blog...
      </div>
    );
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
          .map((item) => {
            const section = (item ?? {}) as {
              imageUrl?: unknown;
              text?: unknown;
            };
            return {
              image:
                typeof section.imageUrl === "string" ? section.imageUrl.trim() : "",
              text: typeof section.text === "string" ? section.text.trim() : "",
            };
          })
          .filter((section) => section.image || section.text);

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
            if (previous.image && !section.image) {
              return acc;
            }
            if (!previous.image && section.image) {
              acc[acc.length - 1] = section;
              return acc;
            }
            if (previous.image === section.image) {
              return acc;
            }
          }

          acc.push(section);
          return acc;
        }, []);

        const sectionMarkdown = compactSections
          .map((section) => {
            const parts: string[] = [];
            if (section.image) parts.push(`![Section image](${section.image})`);
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
  const normalizedMarkdownContent = markdownContent
    // Avoid accidental thematic breaks (---, ***, ___) turning into horizontal lines.
    .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/gm, "$1<em>$2</em>");
  return (
    <>
      {/* Hero */}
      <section
        className="h-[420px] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${blog.featuredImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {blog.title}
          </h1>
          <p className="text-sm text-slate-200">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            › <Link to="/blogs" className="hover:underline">Blogs</Link> ›{" "}
            <span className="text-primary-400">{blog.title}</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="rounded-2xl shadow-lg mb-10 w-full"
            />

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-500" />
                {blog.authorName}
              </span>

              {blog.createdAt && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  {new Date(blog.createdAt).toDateString()}
                </span>
              )}

              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                0 Comments
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              {blog.title}
            </h2>

            {/* Blog Content */}
            <div
              className="
    prose prose-slate max-w-none

    prose-p:leading-7
    prose-p:my-3

    prose-h2:text-2xl
    prose-h2:font-bold
    prose-h2:mt-14
    prose-h2:mb-6

    prose-ul:my-6
    prose-ul:pl-6
    prose-li:my-2

    prose-blockquote:my-8
    prose-blockquote:border-l-4
    prose-blockquote:border-primary-500
    prose-blockquote:bg-slate-50
    prose-blockquote:px-6
    prose-blockquote:py-4
    prose-blockquote:italic
  "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
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
                          whiteSpace: "pre-wrap",
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
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside pl-0 my-6 space-y-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside pl-0 my-6 space-y-2" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr
                      {...props}
                      className="my-8 border-0 border-t border-slate-300"
                    />
                  ),
                }}
              >
                {normalizedMarkdownContent}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-12">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700 border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Search */}
            <div className="bg-slate-50 p-6 rounded-xl border">
              <h3 className="font-bold text-lg mb-4">Search</h3>
              <input
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Search blogs..."
              />
            </div>

            {/* Placeholder Sidebar Blocks */}
           <div className="bg-slate-50 p-6 rounded-xl border">
  <h3 className="font-bold text-lg mb-4">Recent Posts</h3>

  {recentBlogs.length === 0 ? (
    <p className="text-slate-500 text-sm">No recent posts.</p>
  ) : (
    <ul className="space-y-4">
      {recentBlogs.map((b) => (
        <li key={b.id}>
          <Link
            to={`/blogs/${b.slug}`}
            className="block font-medium text-slate-700 hover:text-primary-600 transition"
          >
            {b.title}
          </Link>

          {b.createdAt && (
            <div className="text-xs text-slate-400 mt-1">
              {new Date(b.createdAt).toDateString()}
            </div>
          )}
        </li>
      ))}
    </ul>
  )}
</div>

            <div className="bg-slate-50 p-6 rounded-xl border">
              <h3 className="font-bold text-lg mb-4">Comments</h3>
              <p className="text-slate-500 text-sm">
                No comments yet.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};
