import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
useEffect(() => {
  const fetchRecentBlogs = async () => {
    try {
      const res = await fetch("https://admin.urest.in:8089/api/blogs");
      if (!res.ok) return;

      const data: Blog[] = await res.json();

      // Exclude current blog + limit to 5
      const filtered = data
        .filter(b => b.slug !== slug)
        .slice(0, 5);

      setRecentBlogs(filtered);
    } catch (err) {
      console.error("Failed to load recent blogs");
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
        console.log("Fetched blog:", data);
        setBlog(data);
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
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  };

  const markdownContent = decodeContent(blog.content);
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

    prose-p:leading-relaxed
    prose-p:my-6

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
              <ReactMarkdown>
                {markdownContent}
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
