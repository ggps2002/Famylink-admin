"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import BlogEditor from "@/components/blog-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import {
  deleteBlogThunk,
  editBlogThunk,
  fetchBlogsThunk,
  postBlogsThunk,
  togglePublishBlogThunk,
} from "@/redux/slices/blogSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

interface Blog {
  _id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: number;
  isPublished: boolean;
  publishedAt?: string;
  category:
    | "Tips for Parents"
    | "Tips For Nannies"
    | "Platform Tips"
    | "Special Needs Care"
    | "Do It Yourself"
    | "Nanny Activities"
    | "News";
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

export default function Blogs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteBlogId, setDeleteBlogId] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { allBlogs, isLoading, message } = useSelector(
    (state: RootState) => state.blogs
  );

  useEffect(() => {
    dispatch(fetchBlogsThunk());
  }, [dispatch]);

  // const { data: blogs, isLoading } = useQuery<Blog[]>({
  //   queryKey: ["/api/blogs"],
  // });

  // const deleteBlogMutation = useMutation({
  //   mutationFn: (blogId: number) => apiRequest(`/api/blogs/${blogId}`, "DELETE"),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
  //     toast.success( "Success",{
  //       description: "Blog post deleted successfully",
  //     });
  //     setDeleteBlogId(null);
  //   },
  //   onError: () => {
  //     toast.error("Error",{
  //       description: "Failed to delete blog post",
  //     });
  //   },
  // });

  // const togglePublishMutation = useMutation({
  //   mutationFn: ({ blogId, isPublished }: { blogId: number; isPublished: boolean }) =>
  //     apiRequest(`/api/blogs/${blogId}`, "PATCH", { isPublished }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
  //     toast.success( "Success",{
  //       description: "Blog status updated successfully",
  //     });
  //   },
  //   onError: () => {
  //     toast.error("Error",{
  //       description: "Failed to update blog status",
  //     });
  //   },
  // });

  // const createBlogMutation = useMutation({
  //   mutationFn: (blogData: { title: string; content: string; excerpt: string; featuredImage?: string }) =>
  //     apiRequest("/api/blogs", "POST", { ...blogData, authorId: 1 }), // Default admin user
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
  //     toast.success( "Success",{
  //        description: "Blog post created successfully",
  //     });
  //     setShowEditor(false);
  //   },
  //   onError: () => {
  //     toast.error( "Error",{
  //       description: "Failed to create blog post",
  //     });
  //   },
  // });

  // const updateBlogMutation = useMutation({
  //   mutationFn: ({ id, ...blogData }: { id: number; title: string; content: string; excerpt: string; featuredImage?: string }) =>
  //     apiRequest(`/api/blogs/${id}`, "PATCH", blogData),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
  //     toast.success("Success",{
  //       description: "Blog post updated successfully",
  //     });
  //     setShowEditor(false);
  //     setEditingBlog(null);
  //   },
  //   onError: () => {
  //     toast.error("Error",{
  //       description: "Failed to update blog post",
  //     });
  //   },
  // });

  const filteredBlogs =
    allBlogs?.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.author &&
          `${blog.author.firstName} ${blog.author.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && !blog.isDraft) ||
        (statusFilter === "draft" && blog.isDraft);

      return matchesSearch && matchesStatus;
    }) || [];

  const handleDeleteBlog = (blogId: number) => {
    setDeleteBlogId(blogId);
  };

  const confirmDelete = async () => {
    try {
      if (deleteBlogId) {
        await dispatch(deleteBlogThunk(deleteBlogId));
        toast.success("Blog is deleted successfully", {
          description: message
        });
      }
    } catch (error: any) {
      toast.error("Error occured while deleting the blog", {
        description: error,
      });
    }
  };

  const handleTogglePublish = async (blogId: number, isDraft: boolean) => {
    // togglePublishMutation.mutate({ blogId, isPublished: !currentStatus });
    await dispatch(togglePublishBlogThunk(blogId));

    if (isDraft) {
      toast.success("Blog published", {
        description: message,
      });
    } else {
      toast.success("Blog Unpublished", {
        description: message,
      });
    }
  };

  const handleCreateNew = () => {
    setEditingBlog(null);
    setShowEditor(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowEditor(true);
  };

  const handleSave = async (blogData: {
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
    isDraft: boolean;
  }) => {
    if (editingBlog) {
      await dispatch(editBlogThunk({ _id: editingBlog._id, ...blogData }));
      toast.success("Blog edited successfully!", {
        description: message,
      });
    } else {
      await dispatch(postBlogsThunk(blogData));
      toast.success("Blog created successfully!", {
        description:
          "Now your blog is ready to publish. Click the publish button to publish it.",
      });
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingBlog(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />

        {/* Page Content */}
        <main className="p-6 space-y-6 fade-in">
          {showEditor ? (
            <BlogEditor
              initialData={
                editingBlog
                  ? {
                      title: editingBlog.title,
                      content: editingBlog.content,
                      excerpt: editingBlog.excerpt,
                      category: editingBlog.category,
                    }
                  : undefined
              }
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          ) : (
            <>
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Blog Management
                  </h2>
                  <p className="text-muted-foreground">
                    Create and manage blog posts for the platform
                  </p>
                </div>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Blog Post
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Posts
                        </p>
                        <p className="text-2xl font-bold">
                          {allBlogs?.length || 0}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Published
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {allBlogs?.filter((blog) => !blog.isDraft).length ||
                            0}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Drafts</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {allBlogs?.filter((blog) => blog.isDraft).length || 0}
                        </p>
                      </div>
                      <Edit className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Blogs List */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <Skeleton className="h-5 w-64 mb-2" />
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No blog posts found matching your criteria
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBlogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-foreground text-lg">
                                  {blog.title}
                                </h3>
                                <Badge
                                  variant={
                                    blog.isDraft ? "secondary" : "default"
                                  }
                                >
                                  {blog.isDraft ? "Draft" : "Published"}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                {blog.author && (
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {blog.author.firstName}{" "}
                                    {blog.author.lastName}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {blog.isDraft && blog.publishedAt
                                    ? new Date(
                                        blog.publishedAt
                                      ).toLocaleDateString()
                                    : `Created ${new Date(
                                        blog.createdAt
                                      ).toLocaleDateString()}`}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {blog.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleTogglePublish(blog._id, blog.isDraft)
                                }
                              >
                                {blog.isDraft ? "Publish" : "Unpublish"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(blog)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteBlogId}
        onOpenChange={() => setDeleteBlogId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
