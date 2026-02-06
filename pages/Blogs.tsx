import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://admin.urest.in:8089/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
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
