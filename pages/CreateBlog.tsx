import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      content,
      featuredImage: image,
      authorName: "Clinexy Team",
      tags: tags.split(",").map(t => t.trim()),
      status: "PUBLISHED"
    };

    const res = await fetch("https://admin.urest.in:8089/api/blogs", {
      method: "POST",
      
      headers: {
        "Content-Type": "application/json",
        
      },
      
      body: JSON.stringify(payload),
      
    });

    const data = await res.json();

    if (res.ok) {
      navigate(`/blogs/${payload.slug}`);
    } else {
      alert("Error saving blog");
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Create Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full border px-4 py-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full border px-4 py-2"
            rows="6"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <input
            className="w-full border px-4 py-2"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <input type="file" onChange={handleImageUpload} />

          {image && <img src={image} className="h-40 rounded" />}

          <button className="px-6 py-2 bg-primary-600 text-white rounded">
            Publish Blog
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateBlog;
