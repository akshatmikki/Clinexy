import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Tag, PenTool } from "lucide-react";
import { Button } from "../components/Button";

const CreateBlog = () => {
  const navigate = useNavigate();
  const DEFAULT_BLOG_IMAGE =
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

  const [title, setTitle] = useState("");
  type ContentBlock = {
    id: string;
    text: string;
    image: string;
  };

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: crypto.randomUUID(), text: "", image: "" },
  ]);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleContentBlockImageUpload = (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setContentBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId ? { ...block, image: dataUrl } : block
        )
      );
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleContentBlockTextChange = (blockId: string, value: string) => {
    setContentBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, text: value } : block))
    );
  };

  const handleAddContentBlock = () => {
    setContentBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", image: "" },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload a featured image.");
      return;
    }

    const safeSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\\s-]/g, "")
      .replace(/\\s+/g, "-")
      .replace(/-+/g, "-");

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagList.length === 0) {
      alert("Please add at least one tag.");
      return;
    }

    const mergedContent = contentBlocks
      .map((block) => {
        const blockParts: string[] = [];
        if (block.image) blockParts.push(`![Content image](${block.image})`);
        if (block.text.trim()) blockParts.push(block.text.trim());
        return blockParts.join("\n\n");
      })
      .filter(Boolean)
      .join("\n\n");

    if (!mergedContent.trim()) {
      alert("Please add at least one content block.");
      return;
    }

    const payload = {
      Title: title.trim(),
      Slug: safeSlug,
      Content: mergedContent,
      AuthorName: "Clinexy Team",
      Status: "Published",
      FeaturedImage: image || DEFAULT_BLOG_IMAGE,
    };

    const formData = new FormData();
    formData.append("Title", payload.Title);
    formData.append("Slug", payload.Slug);
    formData.append(
      "Content",
      JSON.stringify({
        body: payload.Content,
        image: payload.FeaturedImage,
      })
    );

    formData.append("AuthorName", payload.AuthorName);
    formData.append("Status", payload.Status);
    formData.append("FeaturedImage", payload.FeaturedImage);
    formData.append("Image", imageFile);
    tagList.forEach((tag) => formData.append("Tags", tag));

    const res = await fetch("https://admin.urest.in:8089/api/blogs/CreateStructuredBlog", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      navigate(`/blogs/${payload.Slug}`);
    } else {
      let errorMessage = `Error saving blog (${res.status})`;

      try {
        const errorBody = await res.json();
        const aspNetErrors = errorBody?.errors
          ? Object.entries(errorBody.errors)
              .flatMap(([field, msgs]) =>
                Array.isArray(msgs) ? msgs.map((msg) => `${field}: ${msg}`) : []
              )
              .join("\n")
          : "";

        errorMessage = aspNetErrors
          ? `Validation failed:\n${aspNetErrors}`
          : errorBody?.detail || errorBody?.title || errorMessage;
      } catch {
        // Keep fallback message if response isn't JSON.
      }

      alert(errorMessage);
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

              {/* Content Blocks */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Content
                </label>
                <div className="space-y-6">
                  {contentBlocks.map((block, index) => {
                    const imageInputId = `contentImageUpload-${block.id}`;
                    return (
                      <div key={block.id} className="rounded-2xl border border-slate-200 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Section {index + 1}
                        </p>

                        <div className="mb-4">
                          <label
                            htmlFor={imageInputId}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary-400 hover:text-primary-600"
                          >
                            <ImagePlus className="h-4 w-4" />
                            Upload Image
                          </label>
                          <input
                            id={imageInputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleContentBlockImageUpload(block.id, e)}
                          />
                          {block.image && (
                            <img
                              src={block.image}
                              alt={`Content section ${index + 1}`}
                              className="mt-3 h-40 w-full rounded-xl border border-slate-200 object-cover"
                            />
                          )}
                        </div>

                        <textarea
                          rows={6}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Write your content..."
                          value={block.text}
                          onChange={(e) => handleContentBlockTextChange(block.id, e.target.value)}
                        />
                      </div>
                    );
                  })}

                  <div className="flex justify-start">
                    <Button type="button" onClick={handleAddContentBlock}>
                      Add
                    </Button>
                  </div>
                </div>
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
