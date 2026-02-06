import { useParams, Link } from "react-router-dom";
import { blogs } from "../data/blogs";

export const BlogDetails = () => {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <div className="py-40 text-center">Blog not found</div>;
  }

  return (
    <>
      {/* Hero */}
      <section
        className="h-[420px] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${blog.image})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-4">Blog Details</h1>
          <p className="text-sm text-slate-200">
            <Link to="/" className="hover:underline">Home</Link> ›{" "}
            <span>{blog.category}</span> ›{" "}
            <span className="text-primary-400">{blog.title}</span>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-16">
          
          {/* Main */}
          <article className="lg:col-span-2">
            <img src={blog.image} className="rounded-xl mb-8" />

            <div className="flex gap-6 text-sm text-slate-500 mb-6">
              <span>{blog.date}</span>
              <span>By {blog.author}</span>
              <span className="text-primary-600">{blog.category}</span>
            </div>

            <h2 className="text-3xl font-bold text-primary-600 mb-6">
              {blog.title}
            </h2>

            <div className="prose prose-slate max-w-none">
              {blog.content.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex gap-3 mt-10">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-4 py-1 bg-slate-100 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div>
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Search</h3>
              <input className="w-full border px-4 py-2 rounded" placeholder="Search..." />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Posts</h3>
              {blogs.slice(0, 2).map((b) => (
                <Link
                  key={b.id}
                  to={`/blogs/${b.slug}`}
                  className="block mb-3 hover:text-primary-600"
                >
                  {b.title}
                </Link>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Comments</h3>
              <p className="text-slate-500">No comments to show.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};
