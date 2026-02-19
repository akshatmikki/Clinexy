import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

type BlogCard = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  authorName: string;
  tags: string[];
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeBlog = (item: unknown, index: number): BlogCard => {
    const raw = (item ?? {}) as {
      id?: unknown;
      Id?: unknown;
      slug?: unknown;
      Slug?: unknown;
      title?: unknown;
      Title?: unknown;
      featuredImage?: unknown;
      FeaturedImage?: unknown;
      authorName?: unknown;
      AuthorName?: unknown;
      tags?: unknown;
      Tags?: unknown;
    };

    const title =
      (typeof raw.title === "string" && raw.title.trim()) ||
      (typeof raw.Title === "string" && raw.Title.trim()) ||
      "Untitled";
    const slug =
      (typeof raw.slug === "string" && raw.slug.trim()) ||
      (typeof raw.Slug === "string" && raw.Slug.trim()) ||
      title.toLowerCase().replace(/\s+/g, "-");

    return {
      id: String(raw.id ?? raw.Id ?? index),
      slug,
      title,
      featuredImage:
        (typeof raw.featuredImage === "string" && raw.featuredImage.trim()) ||
        (typeof raw.FeaturedImage === "string" && raw.FeaturedImage.trim()) ||
        DEFAULT_BLOG_IMAGE,
      authorName:
        (typeof raw.authorName === "string" && raw.authorName.trim()) ||
        (typeof raw.AuthorName === "string" && raw.AuthorName.trim()) ||
        "Clinexy Team",
      tags: Array.isArray(raw.tags)
        ? raw.tags.map(String).filter(Boolean)
        : Array.isArray(raw.Tags)
          ? raw.Tags.map(String).filter(Boolean)
          : [],
    };
  };

  useEffect(() => {
    fetch("https://admin.urest.in:8089/api/blogs/GetAllBlogs")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
            ? data.blogs
            : Array.isArray(data?.content)
              ? data.content
              : Array.isArray(data?.data)
            ? data.data
                : [];
        setBlogs(list.map((item, index) => normalizeBlog(item, index)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-40 text-center">Loading blogs...</div>;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10">Blogs</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-lg font-semibold mb-2">
                  {blog.title}
                </h2>

                <p className="text-sm text-slate-500">
                  By {blog.authorName}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
