import { ChangeEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  FilePlus2,
  Image as ImageIcon,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  Loader2,
  Minus,
  Plus,
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
  sections?: unknown;
  Sections?: unknown;
};

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  sections: ContentSection[];
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

type ContentSection = {
  id: string;
  image: string;
  text: string;
  imageFile?: File | null;
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

const emptyContentSection = (): ContentSection => ({
  id: crypto.randomUUID(),
  image: "",
  text: "",
  imageFile: null,
});

const buildContentFromSections = (sections: ContentSection[]) =>
  sections
    .map((section) => {
      const parts: string[] = [];
      if (section.image.trim()) {
        parts.push(`![Content image](${section.image.trim()})`);
      }
      if (section.text.trim()) {
        parts.push(section.text.trim());
      }
      return parts.join("\n\n");
    })
    .filter(Boolean)
    .join("\n\n");

const parseSectionsFromContent = (content: string): ContentSection[] => {
  const normalized = (content || "").trim();
  if (!normalized) return [emptyContentSection()];

  const imageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
  const imageMatches = [...normalized.matchAll(imageRegex)];
  if (imageMatches.length === 0) {
    return [
      {
        id: crypto.randomUUID(),
        image: "",
        text: normalized,
        imageFile: null,
      },
    ];
  }

  const sections: ContentSection[] = [];
  let cursor = 0;

  imageMatches.forEach((match, index) => {
    const matchIndex = match.index ?? 0;
    const before = normalized.slice(cursor, matchIndex).trim();
    if (before) {
      sections.push({
        id: crypto.randomUUID(),
        image: "",
        text: before,
        imageFile: null,
      });
    }

    const imageUrl = (match[1] || "").trim();
    const currentMatchEnd = matchIndex + match[0].length;
    const nextMatch = imageMatches[index + 1];
    const textAfterImage = normalized
      .slice(currentMatchEnd, nextMatch?.index ?? normalized.length)
      .trim();

    sections.push({
      id: crypto.randomUUID(),
      image: imageUrl,
      text: textAfterImage,
      imageFile: null,
    });
    cursor = nextMatch?.index ?? normalized.length;
  });

  return sections.length > 0 ? sections : [emptyContentSection()];
};

const parseStructuredSectionsFromContent = (value: unknown): ContentSection[] => {
  const sections = extractSectionsFromUnknown(value);
  return sections.filter((section) => section.image || section.text);
};

const extractSectionsFromUnknown = (value: unknown, depth = 0): ContentSection[] => {
  if (depth > 8 || value == null) return [];

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return [];
    try {
      return extractSectionsFromUnknown(JSON.parse(normalized), depth + 1);
    } catch {
      return [];
    }
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractSectionsFromUnknown(item, depth + 1));
  }

  if (typeof value !== "object") return [];

  const obj = value as {
    sections?: unknown;
    Sections?: unknown;
    imageUrl?: unknown;
    ImageUrl?: unknown;
    image?: unknown;
    Image?: unknown;
    text?: unknown;
    Text?: unknown;
    content?: unknown;
    Content?: unknown;
    body?: unknown;
    Body?: unknown;
    value?: unknown;
    Value?: unknown;
  };

  if (obj.sections != null || obj.Sections != null) {
    return extractSectionsFromUnknown(obj.sections ?? obj.Sections, depth + 1);
  }

  const image =
    (typeof obj.imageUrl === "string" && obj.imageUrl.trim()) ||
    (typeof obj.ImageUrl === "string" && obj.ImageUrl.trim()) ||
    (typeof obj.image === "string" && obj.image.trim()) ||
    (typeof obj.Image === "string" && obj.Image.trim()) ||
    "";
  const rawText =
    obj.text ??
    obj.Text ??
    obj.content ??
    obj.Content ??
    obj.body ??
    obj.Body ??
    obj.value ??
    obj.Value;
  const text = typeof rawText === "string" ? rawText.trim() : "";

  const nestedFromText = text ? extractSectionsFromUnknown(text, depth + 1) : [];
  if (nestedFromText.length > 0) return nestedFromText;

  if (!image && !text) return [];

  return [
    {
      id: crypto.randomUUID(),
      image,
      text,
      imageFile: null,
    },
  ];
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const resolveUniqueSlug = (
  preferredSlug: string,
  existingSlugs: string[],
  ignoreSlug?: string
) => {
  const used = new Set(
    existingSlugs
      .map((slug) => slug.toLowerCase())
      .filter((slug) => slug && slug !== (ignoreSlug || "").toLowerCase())
  );
  if (!used.has(preferredSlug.toLowerCase())) return preferredSlug;

  let suffix = 2;
  let candidate = `${preferredSlug}-${suffix}`;
  while (used.has(candidate.toLowerCase())) {
    suffix += 1;
    candidate = `${preferredSlug}-${suffix}`;
  }
  return candidate;
};

const isDuplicateSlugError = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("blogs_slug_key") ||
    normalized.includes("duplicate key value violates unique constraint") ||
    normalized.includes("duplicate key")
  );
};

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
    const structuredSections = parseStructuredSectionsFromContent(contentValue);
    if (structuredSections.length > 0) {
      return buildContentFromSections(structuredSections);
    }
    return readObjectText(contentValue) || "";
  }

  try {
    const parsed = JSON.parse(contentValue);
    if (typeof parsed === "string") return parsed;

    const structuredSections = parseStructuredSectionsFromContent(parsed);
    if (structuredSections.length > 0) {
      return buildContentFromSections(structuredSections);
    }

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
  const rawSections = raw.sections ?? raw.Sections;
  const sections: ContentSection[] = parseStructuredSectionsFromContent(rawSections);
  const sectionsFromContentRaw = parseStructuredSectionsFromContent(contentRaw);
  const decodedContent = decodeContent(contentRaw);
  const fallbackSectionsFromContent = decodedContent.trim()
    ? parseSectionsFromContent(decodedContent)
    : [];
  const normalizedSections =
    sections.length > 0
      ? sections
      : sectionsFromContentRaw.length > 0
        ? sectionsFromContentRaw
        : fallbackSectionsFromContent.filter((s) => s.image || s.text);
  const content =
    decodedContent.trim() ||
    (normalizedSections.length > 0 ? buildContentFromSections(normalizedSections) : "");

  return {
    id: String(raw.id ?? raw.Id ?? index),
    title,
    slug,
    content,
    sections: normalizedSections,
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
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    emptyContentSection(),
  ]);
  const [editorMode, setEditorMode] = useState<"classic" | "sections">("classic");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [textFontFamily, setTextFontFamily] = useState("Arial");
  const [textFontSize, setTextFontSize] = useState(11);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
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
        setDraftWithSections(emptyDraft);
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
      setDraftWithSections(
        toDraft(selectedWithContent || selected),
        (selectedWithContent || selected).sections
      );
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
    setDraftWithSections(toDraft(blog), blog.sections);
    setPreviewImage(blog.featuredImage);
    setImageFile(null);
    setError("");

    if (!blog.content.trim()) {
      setLoadingDetail(true);
      const detailed = await fetchBlogDetail(blog.slug, blog);
      if (detailed) {
        setDraftWithSections(toDraft(detailed), detailed.sections);
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
    setDraftWithSections(emptyDraft);
    setPreviewImage("");
    setImageFile(null);
    setError("");
  };

  const setDraftWithSections = (nextDraft: BlogDraft, sectionsOverride?: ContentSection[]) => {
    setDraft(nextDraft);
    if (sectionsOverride && sectionsOverride.length > 0) {
      setContentSections(
        sectionsOverride.map((section) => ({
          ...section,
          id: section.id || crypto.randomUUID(),
          imageFile: null,
        }))
      );
      setEditorMode("sections");
      return;
    }
    const parsedSections = parseStructuredSectionsFromContent(nextDraft.content);
    if (parsedSections.length > 0) {
      setContentSections(parsedSections);
      setEditorMode("sections");
      return;
    }
    setContentSections(parseSectionsFromContent(nextDraft.content));
  };

  const getEditorContext = () => {
    const activeSection =
      editorMode === "sections"
        ? contentSections.find((section) => section.id === activeSectionId) || null
        : null;
    const value = activeSection ? activeSection.text : draft.content;
    return { activeSection, value };
  };

  const setEditorContent = (nextValue: string, activeSection: ContentSection | null) => {
    if (editorMode === "sections" && activeSection) {
      handleSectionTextChange(activeSection.id, nextValue);
      return;
    }
    setDraft((prev) => ({ ...prev, content: nextValue }));
  };

  const updateSections = (updater: (previous: ContentSection[]) => ContentSection[]) => {
    setContentSections((previous) => {
      const next = updater(previous);
      setDraft((prev) => ({ ...prev, content: buildContentFromSections(next) }));
      return next;
    });
  };

  const handleSectionTextChange = (sectionId: string, value: string) => {
    updateSections((previous) =>
      previous.map((section) =>
        section.id === sectionId ? { ...section, text: value } : section
      )
    );
  };

  const handleSectionImageUpload = (
    sectionId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const upload = async () => {
      try {
        const imageUrl = await uploadSectionImage(file);
        updateSections((previous) =>
          previous.map((section) =>
            section.id === sectionId
              ? { ...section, image: imageUrl, imageFile: null }
              : section
          )
        );
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload section image.";
        setError(message);
      } finally {
        event.target.value = "";
      }
    };

    upload();
  };

  const handleAddSection = () => {
    updateSections((previous) => [...previous, emptyContentSection()]);
  };

  const handleInsertSectionAfter = (sectionId: string) => {
    updateSections((previous) => {
      const index = previous.findIndex((section) => section.id === sectionId);
      if (index === -1) return [...previous, emptyContentSection()];
      return [
        ...previous.slice(0, index + 1),
        emptyContentSection(),
        ...previous.slice(index + 1),
      ];
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    updateSections((previous) => {
      const filtered = previous.filter((section) => section.id !== sectionId);
      return filtered.length > 0 ? filtered : [emptyContentSection()];
    });
  };

  const switchToSectionsMode = () => {
    const parsedSections = parseStructuredSectionsFromContent(draft.content);
    const nextSections =
      parsedSections.length > 0 ? parsedSections : parseSectionsFromContent(draft.content);
    setContentSections(nextSections);
    setActiveSectionId(nextSections[0]?.id || null);
    setEditorMode("sections");
  };

  const switchToClassicMode = () => {
    setDraft((prev) => ({
      ...prev,
      content: buildContentFromSections(contentSections),
    }));
    setActiveSectionId(null);
    setEditorMode("classic");
  };

  const applyMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { activeSection, value } = getEditorContext();
    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const nextValue =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);

    setEditorContent(nextValue, activeSection);

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

    const { activeSection, value } = getEditorContext();
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = value.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const block = value.slice(lineStart, lineEnd);
    const updatedBlock = block
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
      .join("\n");

    const nextValue = value.slice(0, lineStart) + updatedBlock + value.slice(lineEnd);
    setEditorContent(nextValue, activeSection);

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

    const { activeSection, value } = getEditorContext();
    const currentStart = textarea.selectionStart ?? value.length;
    const currentEnd = textarea.selectionEnd ?? value.length;
    const hasLiveSelection = currentEnd > currentStart;
    const start = hasLiveSelection ? currentStart : lastSelectionRef.current.start;
    const end = hasLiveSelection ? currentEnd : lastSelectionRef.current.end;
    if (start === end) return;

    const selected = value.slice(start, end);
    const wrapped = `${prefix}${selected}${suffix}`;
    const nextValue = value.slice(0, start) + wrapped + value.slice(end);

    setEditorContent(nextValue, activeSection);
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

    const { activeSection, value } = getEditorContext();
    const currentStart = textarea.selectionStart ?? value.length;
    const currentEnd = textarea.selectionEnd ?? value.length;
    const hasLiveSelection = currentEnd > currentStart;
    const start = hasLiveSelection ? currentStart : lastSelectionRef.current.start;
    const end = hasLiveSelection ? currentEnd : lastSelectionRef.current.end;
    if (start === end) return;

    const selected = value.slice(start, end);
    const wrapped = selected
      .split("\n")
      .map((line) => (line.trim() ? lineWrapper(line) : line))
      .join("\n");
    const nextValue = value.slice(0, start) + wrapped + value.slice(end);

    setEditorContent(nextValue, activeSection);
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

  const applyFontFamily = (fontFamily: string) => {
    setTextFontFamily(fontFamily);
    wrapSelectionPerLine((line) => {
      const markerMatch = line.match(/^(\s*(?:[-*+]\s+|\d+\.\s+))(.*)$/);
      if (markerMatch) {
        const marker = markerMatch[1];
        const content = markerMatch[2];
        return `${marker}<span style="font-family:${fontFamily};">${content}</span>`;
      }
      return `<span style="font-family:${fontFamily};">${line}</span>`;
    });
  };

  const applyFontSize = (fontSize: number) => {
    setTextFontSize(fontSize);
    wrapSelectionPerLine((line) => {
      const markerMatch = line.match(/^(\s*(?:[-*+]\s+|\d+\.\s+))(.*)$/);
      if (markerMatch) {
        const marker = markerMatch[1];
        const content = markerMatch[2];
        return `${marker}<span style="font-size:${fontSize}px;">${content}</span>`;
      }
      return `<span style="font-size:${fontSize}px;">${line}</span>`;
    });
  };

  const stepFontSize = (direction: -1 | 1) => {
    const currentIndex = FONT_SIZE_OPTIONS.indexOf(textFontSize);
    if (currentIndex >= 0) {
      const nextIndex = Math.max(
        0,
        Math.min(FONT_SIZE_OPTIONS.length - 1, currentIndex + direction)
      );
      applyFontSize(FONT_SIZE_OPTIONS[nextIndex]);
      return;
    }

    if (direction === 1) {
      const next = FONT_SIZE_OPTIONS.find((size) => size > textFontSize);
      applyFontSize(next ?? FONT_SIZE_OPTIONS[FONT_SIZE_OPTIONS.length - 1]);
      return;
    }

    for (let index = FONT_SIZE_OPTIONS.length - 1; index >= 0; index -= 1) {
      if (FONT_SIZE_OPTIONS[index] < textFontSize) {
        applyFontSize(FONT_SIZE_OPTIONS[index]);
        return;
      }
    }
    applyFontSize(FONT_SIZE_OPTIONS[0]);
  };

  const applyTextAlign = (align: "left" | "center" | "right") => {
    setTextAlign(align);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { activeSection, value } = getEditorContext();
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    if (start !== end) {
      wrapSelection(`<div align="${align}" style="text-align:${align};">`, "</div>");
      return;
    }

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIndex = value.indexOf("\n", start);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const currentLine = value.slice(lineStart, lineEnd);
    const alignedLine = `<div align="${align}" style="text-align:${align};">${currentLine || " "}</div>`;
    const nextValue = value.slice(0, lineStart) + alignedLine + value.slice(lineEnd);

    setEditorContent(nextValue, activeSection);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = lineStart;
      textarea.selectionEnd = lineStart + alignedLine.length;
    });
  };

  const applyLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { activeSection, value } = getEditorContext();
    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const selected = value.slice(start, end).trim() || "link text";
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;

    const markdown = `[${selected}](${url.trim() || "https://"})`;
    const nextValue = value.slice(0, start) + markdown + value.slice(end);
    setEditorContent(nextValue, activeSection);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + markdown.length;
      textarea.selectionStart = cursor;
      textarea.selectionEnd = cursor;
    });
  };

  const openContentImagePicker = () => {
    rememberSelection();
    contentImageInputRef.current?.click();
  };

  const handleContentImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadSectionImage(file);
      const textarea = textareaRef.current;
      const markdownImage = `\n\n![${file.name}](${imageUrl})\n\n`;
      const { activeSection, value } = getEditorContext();

      if (!textarea) {
        setEditorContent(`${value}${markdownImage}`, activeSection);
        return;
      }

      const currentStart = textarea.selectionStart ?? value.length;
      const currentEnd = textarea.selectionEnd ?? value.length;
      const hasLiveSelection = currentEnd > currentStart;
      const start = hasLiveSelection ? currentStart : lastSelectionRef.current.start;
      const end = hasLiveSelection ? currentEnd : lastSelectionRef.current.end;
      const nextContent = value.slice(0, start) + markdownImage + value.slice(end);

      setEditorContent(nextContent, activeSection);
      requestAnimationFrame(() => {
        const cursor = start + markdownImage.length;
        textarea.focus();
        textarea.selectionStart = cursor;
        textarea.selectionEnd = cursor;
        lastSelectionRef.current = { start: cursor, end: cursor };
      });
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload content image.";
      setError(message);
    } finally {
      event.target.value = "";
    }
  };

  const getTagList = () =>
    draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const uploadSectionImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/UploadSectionImage`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    let url = "";
    try {
      const data = await response.json();
      url =
        (typeof data?.url === "string" && data.url) ||
        (typeof data?.Url === "string" && data.Url) ||
        "";
    } catch {
      // Keep fallback below.
    }

    if (!url) {
      throw new Error("Section image upload succeeded but no URL was returned.");
    }

    return url;
  };

  const buildStructuredBlogPayload = async (resolvedSlug: string) => {
    const tags = getTagList();
    const authorName = draft.authorName.trim() || "Clinexy Team";
    const status = draft.status || "Published";
    const featuredImage = (previewImage || draft.featuredImage || DEFAULT_BLOG_IMAGE).trim();
    const bodyMarkdown =
      editorMode === "sections"
        ? buildContentFromSections(contentSections).trim()
        : draft.content.trim();
    const extractedSections = parseSectionsFromContent(bodyMarkdown);
    const sections = extractedSections
      .map((section, index) => ({
        imageUrl: section.image.trim(),
        heading: `Section ${index + 1}`,
        text: section.text.trim(),
      }))
      .filter((section) => section.imageUrl || section.text);

    return {
      title: draft.title.trim(),
      slug: resolvedSlug,
      authorName,
      tags,
      status,
      featuredImage,
      FeaturedImage: featuredImage,
      sections,
      content: bodyMarkdown,
    };
  };

  const buildUpdateBlogPayload = async (resolvedSlug: string, blogId: string) => {
    const tags = getTagList();
    const authorName = draft.authorName.trim() || "Clinexy Team";
    const status = draft.status || "Published";
    const bodyMarkdown =
      editorMode === "sections"
        ? buildContentFromSections(contentSections).trim()
        : draft.content.trim();
    const extractedSections = parseSectionsFromContent(bodyMarkdown);
    const sections = extractedSections
      .map((section, index) => ({
        imageUrl: section.image.trim(),
        heading: `Section ${index + 1}`,
        text: section.text.trim(),
      }))
      .filter((section) => section.imageUrl || section.text);
    const featuredImageFromSectionZero = sections[0]?.imageUrl?.trim() || "";
    const featuredImage =
      (previewImage || draft.featuredImage || "").trim() ||
      featuredImageFromSectionZero ||
      DEFAULT_BLOG_IMAGE;

    return {
      id: blogId,
      title: draft.title.trim(),
      slug: resolvedSlug,
      authorId: null,
      authorName,
      tags,
      status,
      featuredImage,
      FeaturedImage: featuredImage,
      sections,
    };
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
        errorBody?.error ||
        errorBody?.message ||
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

    const resolvedBody =
      editorMode === "sections"
        ? buildContentFromSections(contentSections).trim()
        : draft.content.trim();
    if (!resolvedBody) {
      setError("Content is required.");
      return;
    }

    if (mode === "create" && !imageFile && !draft.featuredImage.trim()) {
      setError("Featured image is required for new blog.");
      return;
    }

    const preferredSlug = toSlug(draft.slug || draft.title);
    if (!preferredSlug) {
      setError("Please provide a valid slug or title.");
      return;
    }
    const resolvedSlug = resolveUniqueSlug(
      preferredSlug,
      blogs.map((blog) => blog.slug),
      mode === "edit" ? draft.originalSlug : undefined
    );

    setSaving(true);
    setError("");

    try {
      let response: Response;
      let payload = await buildStructuredBlogPayload(resolvedSlug);

      if (mode === "create") {
        response = await fetch(`${API_BASE}/CreateStructuredBlog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        const resolvedIdentifier = await resolveCanonicalIdentifier();
        if (!resolvedIdentifier) {
          throw new Error("Edit failed: blog identifier not found. Re-open the blog and try again.");
        }
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            resolvedIdentifier
          );
        if (!isUuid) {
          throw new Error("Edit failed: valid blog id not found. Re-open the blog and try again.");
        }

        const updatePayload = await buildUpdateBlogPayload(
          resolvedSlug,
          resolvedIdentifier
        );
        response = await fetch(`${API_BASE}/UpdateBlog/${encodeURIComponent(resolvedIdentifier)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        });
      }

      if (!response.ok) {
        const apiError = await parseApiError(response);
        if (mode === "create" && isDuplicateSlugError(apiError)) {
          const retrySlug = resolveUniqueSlug(
            resolvedSlug,
            [...blogs.map((blog) => blog.slug), resolvedSlug]
          );
          if (retrySlug !== resolvedSlug) {
            payload = await buildStructuredBlogPayload(retrySlug);
            response = await fetch(`${API_BASE}/CreateStructuredBlog`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (!response.ok) {
              throw new Error(await parseApiError(response));
            }
            setDraft((prev) => ({ ...prev, slug: retrySlug }));
          } else {
            throw new Error(apiError);
          }
        } else {
          throw new Error(apiError);
        }
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
    setError("");

    const upload = async () => {
      try {
        const imageUrl = await uploadSectionImage(file);
        setPreviewImage(imageUrl);
        setDraft((prev) => ({ ...prev, featuredImage: imageUrl }));
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload featured image.";
        setError(message);
      } finally {
        event.target.value = "";
      }
    };

    upload();
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
              {(
                <>
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
                  <button
                    onMouseDown={keepSelection}
                    onClick={openContentImagePicker}
                    className="rounded-md border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50"
                    title="Insert image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <input
                    ref={contentImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleContentImageUpload}
                  />
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

                  <div className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1">
                    <Type className="h-4 w-4 text-slate-600" />
                    <button
                      type="button"
                      onMouseDown={keepSelection}
                      onClick={() => stepFontSize(-1)}
                      className="rounded-md border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-100"
                      title="Decrease text size"
                      aria-label="Decrease text size"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-slate-600">
                      {textFontSize}px
                    </span>
                    <button
                      type="button"
                      onMouseDown={keepSelection}
                      onClick={() => stepFontSize(1)}
                      className="rounded-md border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-100"
                      title="Increase text size"
                      aria-label="Increase text size"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                </>
              )}
              <div className="ml-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white p-1">
                <button
                  onClick={switchToClassicMode}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    editorMode === "classic"
                      ? "bg-primary-100 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Classic
                </button>
                <button
                  onClick={switchToSectionsMode}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    editorMode === "sections"
                      ? "bg-primary-100 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Sections
                </button>
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

                {editorMode === "classic" ? (
                  <textarea
                    ref={textareaRef}
                    value={draft.content}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, content: event.target.value }))
                    }
                    onSelect={rememberSelection}
                    onKeyUp={rememberSelection}
                    onMouseUp={rememberSelection}
                    onFocus={(event) => {
                      textareaRef.current = event.currentTarget;
                      setActiveSectionId(null);
                    }}
                    placeholder="Write your blog content..."
                    className="h-[520px] w-full resize-none text-base leading-8 text-slate-700 outline-none"
                  />
                ) : (
                  <>
                    <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                      {contentSections.map((section, index) => {
                        const inputId = `admin-content-image-${section.id}`;
                        return (
                          <div key={section.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Section {index + 1}
                            </div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleInsertSectionAfter(section.id)}
                                className="inline-flex items-center rounded-md border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                              >
                                Insert Below
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(section.id)}
                                className="inline-flex items-center rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                              >
                                Delete Section
                              </button>
                            </div>
                            <label
                              htmlFor={inputId}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary-400 hover:text-primary-600"
                            >
                              <ImagePlus className="h-4 w-4" />
                              Upload Image
                            </label>
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => handleSectionImageUpload(section.id, event)}
                            />
                            {section.image && (
                              <img
                                src={section.image}
                                alt={`Section ${index + 1}`}
                                className="mt-3 max-h-72 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
                              />
                            )}
                            <textarea
                              value={section.text}
                              onChange={(event) =>
                                handleSectionTextChange(section.id, event.target.value)
                              }
                              onFocus={(event) => {
                                textareaRef.current = event.currentTarget;
                                setActiveSectionId(section.id);
                                rememberSelection();
                              }}
                              onSelect={rememberSelection}
                              onKeyUp={rememberSelection}
                              onMouseUp={rememberSelection}
                              placeholder="Write your content..."
                              className="mt-3 h-36 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-base leading-7 text-slate-700 outline-none focus:border-primary-400"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="mt-4 inline-flex items-center rounded-md border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
                    >
                      Add
                    </button>
                  </>
                )}
              </div>
            </section>

            <aside className="border-l border-slate-300 bg-slate-50 p-4">
              <div className="space-y-5">
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
                        className="max-h-72 w-full rounded border border-slate-200 bg-slate-50 object-contain"
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
