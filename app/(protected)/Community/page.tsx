"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Users,
  MessageSquare,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Hash,
  Filter,
  ImageIcon,
  X,
  // Sheet,
} from "lucide-react";
import {
  createCommunity,
  createPostThunk,
  createTopic,
  deleteComment,
  deletePostByIdThunk,
  fetchAllPosts,
} from "@/redux/slices/communitySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/Config/api";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "@/components/ui/sheet";
import { RenderCommentsWithLines } from "@/components/RenderCommentReplyThread";
import { Topic } from "@/types/community";

interface Community {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    topics: number;
  };
}

interface CommunityTopic {
  id: number;
  title: string;
  description: string;
  communityId: number;
  createdById: number;
  createdAt: string;
  community?: {
    name: string;
  };
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    posts: number;
  };
}

export default function CommunityManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"community" | "topic" | "post">(
    "community"
  );
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(
    null
  );
  const [postCreators, setPostCreators] = useState({});
  const [selectedCom, setSelectedCom] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsFilter, setPostsFilter] = useState({
    community: "",
    topic: "",
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const limit = 5;
  const {
    posts,
    communities,
    topics,
    isLoading,
    message,
    postsPagination: { totalPages, totalItems },
  } = useSelector((state: RootState) => state.community);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllPosts({ page: currentPage, limit: limit }));
  }, [dispatch, currentPage]);

  const deleteCommunityMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/communities/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      toast.success("Success", {
        description: "Community deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to delete community",
      });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/community-topics/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-topics"] });
      toast("Success", {
        description: "Topic deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete topic",
      });
    },
  });

  const filteredPosts =
    posts?.filter((post) => {
      const matchesSearch =
        post.topicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.communityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.post?.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCommunity =
        !postsFilter.community || post.communityName === postsFilter.community;

      const matchesTopic =
        !postsFilter.topic || post.topicName === postsFilter.topic;

      return matchesSearch && matchesCommunity && matchesTopic;
    }) || [];

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setDeleteType("post");
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deletePostByIdThunk({ postId: deleteId }));
        //  filteredPosts.filter((post) => post.post._id === id)
        // setFilteredPosts((prev) =>  prev.filter((p) => p.post._id !== id ))
        // setPosts((prev) => prev.filter((p) => p._id !== deletePostId));
        // setAdminPosts((prev) => prev.filter((p) => p._id !== deletePostId));
        // setIsDeleteDialogOpen(false);
        // setDeletePostId(null);
        toast.success("Post deleted successfully!!", {
          // description: message,
        });
      } catch (error: any) {
        console.error("Error deleting post:", error);
        toast.error("Error while deleting the post");
      }
    }
  };

  // const handleDeletePost = async () => {
  //   if (!deletePostId) return;

  //   try {
  //     setIsDeletingPost(true);
  //     await api.delete(`/community/${deletePostId}`);

  //     setPosts((prev) => prev.filter((p) => p._id !== deletePostId));
  //     setAdminPosts((prev) => prev.filter((p) => p._id !== deletePostId));
  //     setIsDeleteDialogOpen(false);
  //     setDeletePostId(null);
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //   } finally {
  //     setIsDeletingPost(false);
  //   }
  // };

  const handleCreateCommunity = async () => {
    if (newCommunityName.trim() && newCommunityDescription.trim()) {
      try {
        await dispatch(
          createCommunity({
            name: newCommunityName.trim(),
            description: newCommunityDescription.trim(),
          })
        );

        toast.success("New Topic Created", {
          description: message,
        });
      } catch (error: any) {
        toast.error("Error occured while creating topic", {
          description: error,
        });
      }
    }
  };

  const handleCreatePost = async () => {
    if (newPostContent.trim() || mediaFiles.length > 0) {
      try {
        const topicId = topics?.filter((topic) => topic.name === "Admin")[0].id;
        if (topicId)
          await dispatch(
            createPostThunk({
              topicId: topicId,
              description: newPostContent,
              // anonymous: false,
              mediaFiles,
            })
          );
        setNewPostContent("");
        setMediaFiles([]);
        setShowCreatePost(false);
        toast.success("Created post successfully!!", {
          description: message,
        });
      } catch (error: any) {
        toast.error("Error occured while creating post", {
          description: error,
        });
      }
    }
  };

  const handleCreateTopic = async () => {
    if (
      newTopicTitle.trim() &&
      newTopicDescription.trim() &&
      selectedCom.length > 0
    ) {
      try {
        const selected = communities?.find((c) => c.name === selectedCom);
        console.log(selected);
        if (selected) {
          await dispatch(
            createTopic({
              name: newTopicTitle.trim(),
              description: newTopicDescription.trim(),
              communityId: selected.id,
            })
          );
          toast.success("New Topic Created", {
            description: message,
          });
        }
      } catch (error: any) {
        toast.error("Error occured while creating topic", {
          description: error,
        });
      }
    }
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
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Community Management
              </h2>
              <p className="text-muted-foreground">
                Manage discussion communities and topics
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Hash className="w-4 h-4 mr-2" />
                    New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                    <DialogDescription>
                      Add a new discussion topic to a community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Community
                      </label>
                      <Select
                        value={selectedCom}
                        onValueChange={setSelectedCom}
                      >
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>

                        <SelectContent>
                          {communities?.map((community) => (
                            <SelectItem
                              key={community.id}
                              value={community.name}
                            >
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Topic Title
                      </label>
                      <Input
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="Enter topic title..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        value={newTopicDescription}
                        onChange={(e) => setNewTopicDescription(e.target.value)}
                        placeholder="Describe the topic..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateTopic(false);
                        setNewTopicTitle("");
                        setNewTopicDescription("");
                        setSelectedCommunityId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTopic}
                      disabled={
                        !newTopicTitle.trim() ||
                        !newTopicDescription.trim() ||
                        !selectedCom ||
                        isLoading
                      }
                    >
                      {isLoading ? "Creating..." : "Create Topic"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showCreateCommunity}
                onOpenChange={setShowCreateCommunity}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Community
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                      Create a new discussion community for platform users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Community Name
                      </label>
                      <Input
                        value={newCommunityName}
                        onChange={(e) => setNewCommunityName(e.target.value)}
                        placeholder="Enter community name..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Description
                      </label>
                      <Textarea
                        value={newCommunityDescription}
                        onChange={(e) =>
                          setNewCommunityDescription(e.target.value)
                        }
                        placeholder="Describe the community purpose..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateCommunity(false);
                        setNewCommunityName("");
                        setNewCommunityDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCommunity}
                      disabled={
                        !newCommunityName.trim() ||
                        !newCommunityDescription.trim() ||
                        isLoading
                      }
                    >
                      {isLoading ? "Creating..." : "Create Community"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Communities</p>
                    <p className="text-2xl font-bold">
                      {communities?.length || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Topics</p>
                    <p className="text-2xl font-bold">{topics?.length || 0}</p>
                  </div>
                  <Hash className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold">{posts?.length || 0}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4 flex gap-2 justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communities and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={postsFilter.community}
                  onValueChange={(value) =>
                    setPostsFilter((prev) => ({ ...prev, community: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities?.map((community) => (
                      <SelectItem key={community.id} value={community.name}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={postsFilter.topic}
                  onValueChange={(value) =>
                    setPostsFilter((prev) => ({ ...prev, topic: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics?.map((topic, index) => (
                      <SelectItem
                        key={topic.id + `${index}`}
                        value={topic.name}
                      >
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              {/* <CardTitle>Posts ({filteredTopics.length})</CardTitle> */}
              <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                    <DialogDescription>
                      Add a new admin post to the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* <div>
                      <label className="text-sm font-medium mb-2 block">
                        Topic
                      </label>
                      <Select
                        value={selectedCom}
                        onValueChange={setSelectedCom}
                      >
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>

                        <SelectContent>
                          {communities?.map((community) => (
                            <SelectItem
                              key={community.id}
                              value={community.name}
                            >
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}
                    {/* <div>
                      <label className="text-sm font-medium mb-2 block">
                        Topic Title
                      </label>
                      <Input
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="Enter topic title..."
                      />
                    </div> */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Post Content
                      </Label>
                      <Textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Write your post..."
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="modal-media-upload"
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) =>
                          setMediaFiles((prev) =>
                            e.target.files
                              ? [...prev, ...Array.from(e.target.files)]
                              : []
                          )
                        }
                        className="hidden"
                      />
                      <Label
                        htmlFor="modal-media-upload"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer py-2 px-4 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Add Photos/Videos
                        </span>
                      </Label>
                    </div>
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 max-h-[300px] overflow-y-auto">
                      {mediaFiles.slice(0, 4).map((file, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
                          {/* Remove button */}
                          <div
                            onClick={() =>
                              setMediaFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-1 right-1 z-30 cursor-pointer w-fit p-1 rounded-full bg-gray-300"
                          >
                            <X className="text-[#151515] w-4 h-4" />
                          </div>
                          {file.type.startsWith("image") ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewPostContent("");
                        setMediaFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={
                        (!newPostContent.trim() && !mediaFiles.length) ||
                        isLoading
                      }
                    >
                      {isLoading ? "Creating..." : "Create Post"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Skeleton className="h-5 w-48" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No posts found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.post._id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {/* <h3 className="font-semibold text-foreground mb-1">
                            {t.title}
                          </h3> */}
                          <p className="text-sm text-foreground mb-2">
                            {post.post.description}
                          </p>
                          <div className="flex flex-wrap my-4 max-w-full">
                            {post.post.media?.map((media) => (
                              <Image
                                key={media._id}
                                src={media.url}
                                height={200}
                                width={200}
                                alt={media.type}
                              />
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {post.communityName && (
                              <div className="flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {post.communityName}
                              </div>
                            )}
                            {post.topicName && (
                              <div className="flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {post.topicName}
                              </div>
                            )}
                            <br />
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                            {post.post.createdBy && (
                              <div className="flex items-center">
                                CreatorUserID : {post.post.createdBy}
                              </div>
                            )}
                            <span>
                              {post.post.comments.length || 0} comments
                            </span>
                            <span>
                              Created{" "}
                              {new Date(
                                post.post.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="flex flex-col max-h-screen">
                              <SheetHeader className="flex-shrink-0 border-b pb-4">
                                <SheetTitle>Post Comments</SheetTitle>
                                <SheetDescription>
                                  View and manage comments for this post.
                                </SheetDescription>
                              </SheetHeader>
                              {/* Scrollable content area with custom scrollbar */}
                              <div className="flex-1 overflow-y-auto my-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                <RenderCommentsWithLines
                                  comments={post.post.comments}
                                  activePostId={post.post._id}
                                />
                              </div>
                            </SheetContent>
                          </Sheet>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.post._id)}
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
            <CardFooter>
              {totalPages && totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages || 0 }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {totalPages && currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete{" "}
              {deleteType === "community"
                ? "Community"
                : deleteType === "topic"
                ? "Topic"
                : "Post"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType}? This action
              cannot be undone and will remove all associated content.
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
