import { ChangeEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  FilePlus2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  Loader2,
  Save,
  Search,
  Smile,
  Trash2,
  Type,
} from "lucide-react";

const API_BASE = "https://admin.urest.in:8089/api/blogs";
const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";
const FONT_OPTIONS = ["Arial", "Candara", "Times New Roman", "Georgia", "Verdana"];
const FONT_SIZE_OPTIONS = [11, 12, 14, 16, 18, 20, 21, 22, 24, 26, 28, 30, 32];
const EMOJIS = ["😀", "😁", "😂", "😊", "😍", "🤔", "🔥", "🚀", "💡", "✅", "📌", "🩺", "❤️", "🎉"];

type RawBlog = {
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
  status?: unknown;
  Status?: unknown;
  createdAt?: unknown;
  CreatedAt?: unknown;
};

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  authorName: string;
  tags: string[];
  status: string;
  createdAt?: string;
};

type BlogDraft = {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  authorName: string;
  tags: string;
  status: string;
  originalId: string;
  originalSlug: string;
};

const emptyDraft: BlogDraft = {
  title: "",
  slug: "",
  content: "",
  featuredImage: "",
  authorName: "Clinexy Team",
  tags: "",
  status: "Published",
  originalId: "",
  originalSlug: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const FALLBACK_IMAGE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2L3k8AAAAASUVORK5CYII=";

const decodeContent = (contentValue: unknown): string => {
  const readObjectText = (value: unknown): string | null => {
    if (!value || typeof value !== "object") return null;
    const contentObj = value as {
      body?: unknown;
      Body?: unknown;
      content?: unknown;
      Content?: unknown;
      markdown?: unknown;
      text?: unknown;
      value?: unknown;
    };

    const candidate =
      contentObj.body ??
      contentObj.Body ??
      contentObj.content ??
      contentObj.Content ??
      contentObj.markdown ??
      contentObj.text ??
      contentObj.value;

    return typeof candidate === "string" ? candidate : null;
  };

  if (!contentValue) return "";
  if (typeof contentValue !== "string") {
    return readObjectText(contentValue) || "";
  }

  try {
    const parsed = JSON.parse(contentValue);
    if (typeof parsed === "string") return parsed;

    const parsedContent = readObjectText(parsed);
    if (parsedContent) return parsedContent;
  } catch {
    return contentValue;
  }

  return contentValue;
};

const normalizeBlog = (item: unknown, index: number): BlogRecord => {
  const raw = (item ?? {}) as RawBlog;
  const title =
    (typeof raw.title === "string" && raw.title) ||
    (typeof raw.Title === "string" && raw.Title) ||
    "Untitled";
  const slug =
    (typeof raw.slug === "string" && raw.slug) ||
    (typeof raw.Slug === "string" && raw.Slug) ||
    toSlug(title) ||
    `blog-${index + 1}`;

  const contentRaw = raw.content ?? raw.Content ?? "";

  return {
    id: String(raw.id ?? raw.Id ?? index),
    title,
    slug,
    content: decodeContent(contentRaw),
    featuredImage:
      (typeof raw.featuredImage === "string" && raw.featuredImage) ||
      (typeof raw.FeaturedImage === "string" && raw.FeaturedImage) ||
      DEFAULT_BLOG_IMAGE,
    authorName:
      (typeof raw.authorName === "string" && raw.authorName) ||
      (typeof raw.AuthorName === "string" && raw.AuthorName) ||
      "Clinexy Team",
    tags: Array.isArray(raw.tags)
      ? raw.tags.map(String)
      : Array.isArray(raw.Tags)
        ? raw.Tags.map(String)
        : [],
    status:
      (typeof raw.status === "string" && raw.status) ||
      (typeof raw.Status === "string" && raw.Status) ||
      "Published",
    createdAt:
      (typeof raw.createdAt === "string" && raw.createdAt) ||
      (typeof raw.CreatedAt === "string" && raw.CreatedAt) ||
      undefined,
  };
};

const toDraft = (blog: BlogRecord): BlogDraft => ({
  title: blog.title,
  slug: blog.slug,
  content: blog.content,
  featuredImage: blog.featuredImage,
  authorName: blog.authorName,
  tags: blog.tags.join(", "),
  status: blog.status,
  originalId: blog.id,
  originalSlug: blog.slug,
});

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [textFontFamily, setTextFontFamily] = useState("Arial");
  const [textFontSize, setTextFontSize] = useState(11);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSelectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const fetchBlogDetail = async (
    slug: string,
    fallback?: BlogRecord
  ): Promise<BlogRecord | null> => {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}`);
      if (!res.ok) return fallback || null;

      const data = await res.json();
      const detailed = normalizeBlog(data, 0);

      return {
        ...(fallback || detailed),
        ...detailed,
        content: detailed.content || fallback?.content || "",
      };
    } catch {
      return fallback || null;
    }
  };

  const resolveCanonicalIdentifier = async () => {
    if (draft.originalSlug) {
      const detailed = await fetchBlogDetail(draft.originalSlug);
      if (detailed?.id) {
        setDraft((prev) => ({ ...prev, originalId: detailed.id }));
        setBlogs((prev) =>
          prev.map((item) => (item.slug === detailed.slug ? detailed : item))
        );
        return detailed.id.trim();
      }
    }

    return (draft.originalId || draft.originalSlug || draft.slug).trim();
  };

  const fetchBlogs = async (preferredSlug?: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_BASE);
      if (!res.ok) {
        throw new Error(`Could not load blogs (${res.status})`);
      }

      const response = await res.json();
      const list: unknown[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
          ? response.content
          : Array.isArray(response?.data)
            ? response.data
            : [];

      const normalized = list
        .map((item, index) => normalizeBlog(item, index))
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

      setBlogs(normalized);

      if (normalized.length === 0) {
        setMode("create");
        setDraft(emptyDraft);
        return;
      }

      const selected =
        normalized.find((blog) => blog.slug === preferredSlug) || normalized[0];
      const selectedWithContent = selected.content.trim()
        ? selected
        : await fetchBlogDetail(selected.slug, selected);

      if (
        selectedWithContent &&
        selectedWithContent.content &&
        selectedWithContent.content !== selected.content
      ) {
        setBlogs((prev) =>
          prev.map((blog) =>
            blog.slug === selectedWithContent.slug ? selectedWithContent : blog
          )
        );
      }

      setMode("edit");
      setDraft(toDraft(selectedWithContent || selected));
      setPreviewImage((selectedWithContent || selected).featuredImage);
      setImageFile(null);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch blogs.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(normalizedQuery) ||
        blog.slug.toLowerCase().includes(normalizedQuery)
    );
  }, [blogs, query]);

  const handleSelectBlog = async (blog: BlogRecord) => {
    setMode("edit");
    setDraft(toDraft(blog));
    setPreviewImage(blog.featuredImage);
    setImageFile(null);
    setError("");

    if (!blog.content.trim()) {
      setLoadingDetail(true);
      const detailed = await fetchBlogDetail(blog.slug, blog);
      if (detailed) {
        setDraft(toDraft(detailed));
        setPreviewImage(detailed.featuredImage);
        setBlogs((prev) =>
          prev.map((item) => (item.slug === detailed.slug ? detailed : item))
        );
      }
      setLoadingDetail(false);
    }
  };

  const handleCreateNew = () => {
    setMode("create");
    setDraft(emptyDraft);
    setPreviewImage("");
    setImageFile(null);
    setError("");
  };

  const applyMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? draft.content.length;
    const end = textarea.selectionEnd ?? draft.content.length;
    const selected = draft.content.slice(start, end);
    const nextValue =
      draft.content.slice(0, start) +
      before +
      selected +
      after +
      draft.content.slice(end);

    setDraft((prev) => ({ ...prev, content: nextValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + before.length + selected.length + after.length;
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;
    });
  };

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const value = draft.content;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = value.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const block = value.slice(lineStart, lineEnd);
    const updatedBlock = block
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
      .join("\n");

    const nextValue = value.slice(0, lineStart) + updatedBlock + value.slice(lineEnd);
    setDraft((prev) => ({ ...prev, content: nextValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = lineStart;
      textarea.selectionEnd = lineStart + updatedBlock.length;
    });
  };

  const keepSelection = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const rememberSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    lastSelectionRef.current = {
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    };
  };

  const wrapSelection = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentStart = textarea.selectionStart ?? draft.content.length;
    const currentEnd = textarea.selectionEnd ?? draft.content.length;
    const hasLiveSelection = currentEnd > currentStart;
    const start = hasLiveSelection ? currentStart : lastSelectionRef.current.start;
    const end = hasLiveSelection ? currentEnd : lastSelectionRef.current.end;
    if (start === end) return;

    const selected = draft.content.slice(start, end);
    const wrapped = `${prefix}${selected}${suffix}`;
    const nextValue = draft.content.slice(0, start) + wrapped + draft.content.slice(end);

    setDraft((prev) => ({ ...prev, content: nextValue }));
    requestAnimationFrame(() => {
      textarea.focus();
      // Keep only original selected text highlighted (not the inserted tags).
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selected.length;
      lastSelectionRef.current = {
        start: start + prefix.length,
        end: start + prefix.length + selected.length,
      };
    });
  };

  const wrapSelectionPerLine = (lineWrapper: (line: string) => string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentStart = textarea.selectionStart ?? draft.content.length;
    const currentEnd = textarea.selectionEnd ?? draft.content.length;
    const hasLiveSelection = currentEnd > currentStart;
    const start = hasLiveSelection ? currentStart : lastSelectionRef.current.start;
    const end = hasLiveSelection ? currentEnd : lastSelectionRef.current.end;
    if (start === end) return;

    const selected = draft.content.slice(start, end);
    const wrapped = selected
      .split("\n")
      .map((line) => (line.trim() ? lineWrapper(line) : line))
      .join("\n");
    const nextValue = draft.content.slice(0, start) + wrapped + draft.content.slice(end);

    setDraft((prev) => ({ ...prev, content: nextValue }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + wrapped.length;
      lastSelectionRef.current = {
        start,
        end: start + wrapped.length,
      };
    });
  };

  const unwrapStyleSpan = (value: string, styleKey: "font-size" | "font-family") => {
    let next = value;
    const styleSpanPattern = new RegExp(
      `<span\\s+style="[^"]*${styleKey}\\s*:[^"]*"\\s*>([\\s\\S]*?)<\\/span>`,
      "gi"
    );

    let previous = "";
    while (previous !== next) {
      previous = next;
      next = next.replace(styleSpanPattern, "$1");
    }

    return next;
  };

  const applyFontFamily = (fontFamily: string) => {
    setTextFontFamily(fontFamily);
    wrapSelectionPerLine((line) => {
      const markerMatch = line.match(/^(\s*(?:[-*+]\s+|\d+\.\s+))(.*)$/);
      if (markerMatch) {
        const marker = markerMatch[1];
        const content = unwrapStyleSpan(markerMatch[2], "font-family");
        return `${marker}<span style="font-family:${fontFamily};">${content}</span>`;
      }
      return `<span style="font-family:${fontFamily};">${unwrapStyleSpan(
        line,
        "font-family"
      )}</span>`;
    });
  };

  const applyFontSize = (fontSize: number) => {
    setTextFontSize(fontSize);
    wrapSelectionPerLine((line) => {
      const markerMatch = line.match(/^(\s*(?:[-*+]\s+|\d+\.\s+))(.*)$/);
      if (markerMatch) {
        const marker = markerMatch[1];
        const content = unwrapStyleSpan(markerMatch[2], "font-size");
        return `${marker}<span style="font-size:${fontSize}px;">${content}</span>`;
      }
      return `<span style="font-size:${fontSize}px;">${unwrapStyleSpan(
        line,
        "font-size"
      )}</span>`;
    });
  };

  const applyTextAlign = (align: "left" | "center" | "right") => {
    setTextAlign(align);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    if (start !== end) {
      wrapSelection(`<div align="${align}" style="text-align:${align};">`, "</div>");
      return;
    }

    const value = draft.content;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = value.indexOf("\n", start);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const currentLine = value.slice(lineStart, lineEnd);
    const alignedLine = `<div align="${align}" style="text-align:${align};">${currentLine || " "}</div>`;
    const nextValue = value.slice(0, lineStart) + alignedLine + value.slice(lineEnd);

    setDraft((prev) => ({ ...prev, content: nextValue }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = lineStart;
      textarea.selectionEnd = lineStart + alignedLine.length;
    });
  };

  const applyLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? draft.content.length;
    const end = textarea.selectionEnd ?? draft.content.length;
    const selected = draft.content.slice(start, end).trim() || "link text";
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;

    const markdown = `[${selected}](${url.trim() || "https://"})`;
    const nextValue = draft.content.slice(0, start) + markdown + draft.content.slice(end);
    setDraft((prev) => ({ ...prev, content: nextValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + markdown.length;
      textarea.selectionStart = cursor;
      textarea.selectionEnd = cursor;
    });
  };

  const getTagList = () =>
    draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const buildCreateFormData = (resolvedSlug: string) => {
    const formData = new FormData();
    const tags = getTagList();

    formData.append("Title", draft.title.trim());
    formData.append("Slug", resolvedSlug);
    formData.append("Content", JSON.stringify({ body: draft.content.trim() }));
    formData.append("AuthorName", draft.authorName.trim() || "Clinexy Team");
    formData.append("Status", draft.status || "Published");
    formData.append(
      "FeaturedImage",
      previewImage || draft.featuredImage || DEFAULT_BLOG_IMAGE
    );
    tags.forEach((tag) => formData.append("Tags", tag));

    if (imageFile) {
      formData.append("Image", imageFile);
    }

    return formData;
  };

  const buildUpdateFormData = async (resolvedSlug: string, resolvedId: string) => {
    const tags = getTagList();
    const resolvedImage = previewImage || draft.featuredImage || DEFAULT_BLOG_IMAGE;
    const authorName = draft.authorName.trim() || "Clinexy Team";
    const contentValue = JSON.stringify({ body: draft.content.trim() });
    const statusValue = draft.status || "Published";
    const formData = new FormData();
    formData.append("Id", resolvedId);
    formData.append("Title", draft.title.trim());
    formData.append("Slug", resolvedSlug);
    formData.append("Content", contentValue);
    formData.append("AuthorName", authorName);
    formData.append("Status", statusValue);
    formData.append("FeaturedImage", resolvedImage);
    tags.forEach((tag) => formData.append("Tags", tag));
    formData.append("Views", "0");
    formData.append("Likes", "0");

    let effectiveImageFile: File | null = imageFile;

    if (!effectiveImageFile) {
      try {
        const imageResponse = await fetch(resolvedImage, { mode: "cors" });
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          const ext = blob.type.split("/")[1] || "jpg";
          effectiveImageFile = new File([blob], `featured-image.${ext}`, {
            type: blob.type || "image/jpeg",
          });
        }
      } catch {
        // Ignore and fallback to embedded file below.
      }
    }

    if (!effectiveImageFile) {
      const fallbackResponse = await fetch(FALLBACK_IMAGE_DATA_URL);
      const fallbackBlob = await fallbackResponse.blob();
      effectiveImageFile = new File([fallbackBlob], "fallback-image.png", {
        type: "image/png",
      });
    }

    formData.append("Image", effectiveImageFile);
    return formData;
  };

  const parseApiError = async (response: Response) => {
    try {
      const errorBody = await response.json();

      const fieldErrors =
        errorBody?.errors && typeof errorBody.errors === "object"
          ? Object.entries(errorBody.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(", ")}`;
                }
                return `${field}: ${String(messages)}`;
              })
              .join(" | ")
          : "";

      return (
        fieldErrors ||
        errorBody?.detail ||
        errorBody?.title ||
        `Request failed (${response.status})`
      );
    } catch {
      const text = await response.text();
      return text || `Request failed (${response.status})`;
    }
  };

  const handleSave = async () => {
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!draft.content.trim()) {
      setError("Content is required.");
      return;
    }

    if (mode === "create" && !imageFile && !draft.featuredImage.trim()) {
      setError("Featured image is required for new blog.");
      return;
    }

    const resolvedSlug = toSlug(draft.slug || draft.title);
    if (!resolvedSlug) {
      setError("Please provide a valid slug or title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let response: Response;

      if (mode === "create") {
        const formData = buildCreateFormData(resolvedSlug);
        response = await fetch(API_BASE, {
          method: "POST",
          body: formData,
        });
      } else {
        const resolvedIdentifier = await resolveCanonicalIdentifier();
        if (!resolvedIdentifier) {
          throw new Error("Edit failed: blog identifier not found. Re-open the blog and try again.");
        }

        const deleteRes = await fetch(
          `${API_BASE}/${encodeURIComponent(resolvedIdentifier)}`,
          { method: "DELETE" }
        );

        if (!deleteRes.ok) {
          throw new Error(await parseApiError(deleteRes));
        }

        const recreateFormData = await buildUpdateFormData(
          resolvedSlug,
          resolvedIdentifier
        );
        response = await fetch(API_BASE, {
          method: "POST",
          body: recreateFormData,
        });
      }

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      await fetchBlogs(resolvedSlug);
      setMode("edit");
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save blog.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit") return;

    const identifierToDelete = await resolveCanonicalIdentifier();
    if (!identifierToDelete) return;

    const confirmDelete = window.confirm(
      `Delete "${draft.title}" permanently?`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(identifierToDelete)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Delete failed (${res.status})`);
      }

      await fetchBlogs();
      if (blogs.length <= 1) {
        handleCreateNew();
      }
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete blog.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPreviewImage(result);
      setDraft((prev) => ({ ...prev, featuredImage: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#ececf1] pt-24 pb-10">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#2f3a9f] px-6 py-3 text-white">
            <div className="text-sm font-semibold">Clinexy Blog Admin Editor</div>
            <div className="text-xs text-white/80">
              {mode === "create" ? "Creating new blog" : `Editing: ${draft.title || "Untitled"}`}
            </div>
          </div>

          <div className="border-b border-slate-300 bg-slate-100 px-4 py-3">
            <div className="relative flex flex-wrap items-center gap-2">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FilePlus2 className="h-4 w-4" />
                New
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
              <button
                onClick={handleDelete}
                disabled={mode !== "edit" || deleting}
                className="inline-flex items-center gap-2 rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>

              <div className="mx-2 h-6 w-px bg-slate-300" />

              <button
                onMouseDown={keepSelection}
                onClick={() => applyMarkdown("**", "**")}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => applyMarkdown("*", "*")}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => applyLinePrefix("## ")}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                title="Heading"
              >
                <Type className="h-4 w-4" />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => applyLinePrefix("- ")}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                title="Bullet"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={applyLink}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setEmojiOpen((prev) => !prev)}
                  className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                  title="Emoji"
                >
                  <Smile className="h-4 w-4" />
                </button>

                {emojiOpen && (
                  <div className="absolute left-0 top-11 z-20 w-64 rounded-lg border border-slate-300 bg-white p-3 shadow-xl">
                    <div className="mb-2 text-xs font-semibold text-slate-500">Add emoji</div>
                    <div className="grid grid-cols-7 gap-1">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            applyMarkdown(emoji);
                            setEmojiOpen(false);
                          }}
                          className="rounded p-1.5 text-lg hover:bg-slate-100"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[270px_1fr_300px]">
            <aside className="border-r border-slate-300 bg-slate-50">
              <div className="border-b border-slate-300 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search blogs..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="max-h-[calc(100vh-280px)] space-y-2 overflow-y-auto p-3">
                {loading ? (
                  <div className="px-3 py-6 text-center text-sm text-slate-500">
                    Loading blogs...
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-slate-500">
                    No blogs found.
                  </div>
                ) : (
                  filteredBlogs.map((blog) => (
                    <button
                      key={blog.id}
                      onClick={() => handleSelectBlog(blog)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        draft.originalSlug === blog.slug && mode === "edit"
                          ? "border-primary-400 bg-primary-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="truncate text-sm font-semibold text-slate-800">
                        {blog.title}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        /{blog.slug}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <section className="bg-[#efeff3] p-5">
              <div className="mx-auto max-w-[760px] rounded border border-slate-300 bg-white p-10 shadow">
                {loadingDetail && (
                  <div className="mb-3 text-xs text-slate-500">Loading full content...</div>
                )}
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Blog title"
                  className="mb-6 w-full border-b border-slate-200 pb-3 text-5xl font-semibold text-slate-800 outline-none placeholder:text-slate-300"
                />

                <textarea
                  ref={textareaRef}
                  value={draft.content}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, content: event.target.value }))
                  }
                  onSelect={rememberSelection}
                  onKeyUp={rememberSelection}
                  onMouseUp={rememberSelection}
                  placeholder="Write your blog content..."
                  className="h-[520px] w-full resize-none text-base leading-8 text-slate-700 outline-none"
                />
              </div>
            </section>

            <aside className="border-l border-slate-300 bg-slate-50 p-4">
              <div className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">Text</div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={textFontFamily}
                      onMouseDown={rememberSelection}
                      onChange={(event) => applyFontFamily(event.target.value)}
                      className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      {FONT_OPTIONS.map((fontName) => (
                        <option key={fontName} value={fontName}>
                          {fontName}
                        </option>
                      ))}
                    </select>
                    <select
                      value={textFontSize}
                      onMouseDown={rememberSelection}
                      onChange={(event) => applyFontSize(Number(event.target.value))}
                      className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      {FONT_SIZE_OPTIONS.map((sizeValue) => (
                        <option key={sizeValue} value={sizeValue}>
                          {sizeValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onMouseDown={keepSelection}
                      onClick={() => applyTextAlign("left")}
                      className={`rounded border p-2 ${
                        textAlign === "left"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-300"
                      }`}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      onMouseDown={keepSelection}
                      onClick={() => applyTextAlign("center")}
                      className={`rounded border p-2 ${
                        textAlign === "center"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-300"
                      }`}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      onMouseDown={keepSelection}
                      onClick={() => applyTextAlign("right")}
                      className={`rounded border p-2 ${
                        textAlign === "right"
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-slate-300"
                      }`}
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">Post Settings</div>
                  <div className="space-y-3">
                    <input
                      value={draft.slug}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, slug: event.target.value }))
                      }
                      placeholder="slug"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={draft.authorName}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, authorName: event.target.value }))
                      }
                      placeholder="author"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={draft.tags}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, tags: event.target.value }))
                      }
                      placeholder="tags: clinic,care"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, status: event.target.value }))
                      }
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                    <input
                      value={draft.featuredImage}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({ ...prev, featuredImage: value }));
                        setPreviewImage(value);
                      }}
                      placeholder="featured image url"
                      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600">
                      <ImagePlus className="h-4 w-4" />
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {(previewImage || draft.featuredImage) && (
                      <img
                        src={previewImage || draft.featuredImage}
                        alt="Featured preview"
                        className="h-32 w-full rounded border border-slate-200 object-cover"
                      />
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
