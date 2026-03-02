import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";

const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

interface CommentType {
  id: number;
  author: string;
  content: string;
  date: string;
}

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

export const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const preserveLineBreakSpacing = (html: string) => {
    if (!html) return "";

    return html.replace(/([^>])\n+/g, (match, prevChar) => {
      const lineBreaks = match.length - 1; // minus the captured character
      const breaks = lineBreaks === 1 ? "<br/>" : "<br/>";
      return prevChar + breaks;
    });
  };

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `https://clinexy.in/wp-json/wp/v2/posts?slug=5-nft-projects-you-should-learn-about`
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

      {/* Hero */}
      <section
        className="h-[420px] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${blog.featuredImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center text-white max-w-4xl px-4">
          <h1
            className="text-4xl md:text-5xl font-bold"
            dangerouslySetInnerHTML={{ __html: blog.title }}
          />
          <p className="text-sm mt-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            ›{" "}
            <Link to="/blogs" className="hover:underline">
              Blogs
            </Link>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-6">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {blog.authorName}
            </span>

            {blog.createdAt && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(blog.createdAt).toDateString()}
              </span>
            )}

            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {blog.comments.length} Comments
            </span>
          </div>

          {/* Categories */}
          {blog.categories.length > 0 && (
            <div className="flex gap-3 mb-8 flex-wrap">
              {blog.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <div
  className="
    max-w-3xl mx-auto text-slate-700 leading-relaxed

    [&_ul]:list-disc
    [&_ul]:pl-6
    [&_ul]:my-4

    [&_ol]:list-decimal
    [&_ol]:pl-6
    [&_ol]:my-4

    [&_li]:mb-2
  "
  dangerouslySetInnerHTML={{
    __html: blog.content,
  }}
/>
          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-12">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-slate-100 rounded-full text-sm border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">
              Comments ({blog.comments.length})
            </h3>

            {blog.comments.length === 0 ? (
              <p className="text-slate-500">No comments yet.</p>
            ) : (
              <div className="space-y-6">
                {blog.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="font-semibold">
                      {comment.author}
                    </div>
                    <div
                      className="text-slate-600 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: comment.content,
                      }}
                    />
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(comment.date).toDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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