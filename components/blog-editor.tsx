import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Eye,
  Save,
  Type,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    category:
      | "Tips for Parents"
      | "Tips For Nannies"
      | "Platform Tips"
      | "Special Needs Care"
      | "Do It Yourself"
      | "Nanny Activities"
      | "News";
  };
  onSave: (data: {
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BlogEditor({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "");
  // const [featuredImage, setFeaturedImage] = useState(
  //   initialData?.featuredImage || ""
  // );
  const [activeTab, setActiveTab] = useState("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (
    before: string,
    after: string = "",
    placeholder: string = ""
  ) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newContent =
      content.substring(0, start) +
      before +
      textToInsert +
      after +
      content.substring(end);

    setContent(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPos =
        start + before.length + textToInsert.length + after.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatContent = (format: string) => {
    switch (format) {
      case "bold":
        insertText("**", "**", "bold text");
        break;
      case "italic":
        insertText("*", "*", "italic text");
        break;
      case "underline":
        insertText("<u>", "</u>", "underlined text");
        break;
      case "h1":
        insertText("# ", "", "Heading 1");
        break;
      case "h2":
        insertText("## ", "", "Heading 2");
        break;
      case "h3":
        insertText("### ", "", "Heading 3");
        break;
      case "ul":
        insertText("- ", "", "List item");
        break;
      case "ol":
        insertText("1. ", "", "Numbered item");
        break;
      case "link":
        insertText("[", "](https://)", "link text");
        break;
      case "image":
        insertText("![", "](image-url)", "alt text");
        break;
      case "paragraph":
        insertText("\n\n", "", "");
        break;
    }
  };

  const renderPreview = () => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="w-full object-cover rounded-xl my-4" />'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 underline">$1</a>'
      )

      .replace(/^- (.*$)/gm, '<ul class="list-disc ml-6 mb-4"><li>$1</li></ul>')
      .replace(
        /^\d+\. (.*$)/gm,
        '<ol class="list-decimal ml-6 mb-4"><li>$1</li></ol>'
      )
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
      .replace(/<\/p><p class="mb-4"><\/p>/g, '</p><p class="mb-4">')
      .replace(/^<p class="mb-4"><h/g, "<h")
      .replace(/h[1-3]><\/p>$/gm, (match) => match.replace(/<\/p>$/, ""));
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      excerpt,
      category
      // featuredImage: featuredImage || undefined,
    });
    setTitle('');
    setContent('');
    setExcerpt('');
    setCategory('');
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Blog Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className="text-lg"
            />
          </div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tips for Parents">Tips for Parents</SelectItem>
              <SelectItem value="Tips For Nannies">Tips For Nannies</SelectItem>
              <SelectItem value="Platform Tips">Platform Tips</SelectItem>
              <SelectItem value="Platform Tips">Platform Tips</SelectItem>
              <SelectItem value="Special Needs Care">
                Special Needs Care
              </SelectItem>
              <SelectItem value="Do It Yourself">Do It Yourself</SelectItem>
              <SelectItem value="Nanny Activities">Nanny Activities</SelectItem>
              <SelectItem value="News">News</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <label className="text-sm font-medium mb-2 block">Excerpt</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the blog post..."
              rows={2}
            />
          </div>

          {/* <div>
            <label className="text-sm font-medium mb-2 block">
              Featured Image URL (Optional)
            </label>
            <Input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div> */}
        </div>

        {/* Content Editor */}
        <div>
          <label className="text-sm font-medium mb-2 block">Content</label>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("h1")}
                    title="Heading 1"
                  >
                    H1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("h2")}
                    title="Heading 2"
                  >
                    H2
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("h3")}
                    title="Heading 3"
                  >
                    H3
                  </Button>
                </div>

                <div className="w-px h-6 bg-border" />

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("bold")}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("italic")}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("underline")}
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border" />

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("ul")}
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("ol")}
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border" />

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("link")}
                    title="Link"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => formatContent("image")}
                    title="Image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border" />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatContent("paragraph")}
                  title="New Paragraph"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </div>

              {/* Text Editor */}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your blog post... Use markdown formatting or the toolbar above."
                rows={20}
                className="font-mono"
              />

              <div className="text-xs text-muted-foreground">
                <strong>Formatting Guide:</strong> **bold**, *italic*, # Heading
                1, ## Heading 2, ### Heading 3, - Bullet point, 1. Numbered
                list, [link text](url), ![image alt](image-url)
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="min-h-[500px] p-6 border rounded-lg bg-white dark:bg-gray-950">
                {title && (
                  <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    {title}
                  </h1>
                )}
                {/* {featuredImage && (
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    className="w-full max-h-96 object-cover rounded-lg mb-6"
                  />
                )} */}
                {excerpt && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
                    {excerpt}
                  </p>
                )}
                <div
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Blog Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
