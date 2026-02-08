import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, FileText, Tag, PenTool } from "lucide-react";
import { Button } from "../components/Button";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      content,
      featuredImage: image,
      authorName: "Clinexy Team",
      tags: tags.split(",").map(t => t.trim()),
      status: "PUBLISHED",
    };

    const res = await fetch("https://admin.urest.in:8089/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate(`/blogs/${payload.slug}`);
    } else {
      alert("Error saving blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <PenTool className="h-4 w-4" />
            Create New Blog
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Publish a New Article
          </h1>
          <p className="text-slate-600 text-lg">
            Share insights, guides, and updates with your audience.
          </p>
        </div>
      </section>

      {/* Form Card */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Blog Title
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Content
                </label>
                <textarea
                  rows={8}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary-500" />
                  Tags
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="clinic, healthcare, productivity"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-primary-500" />
                  Featured Image
                </label>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-primary-400 transition">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <p className="text-slate-600 font-medium">
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG, PNG recommended
                    </p>
                  </label>
                </div>

                {image && (
                  <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-60 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <Button size="lg" className="px-10">
                  Publish Blog
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateBlog;
