'use client'

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

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
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<'community' | 'topic'>('community');
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: communities, isLoading: communitiesLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const { data: topics, isLoading: topicsLoading } = useQuery<CommunityTopic[]>({
    queryKey: ["/api/community-topics"],
  });

  const deleteCommunityMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/communities/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      toast.success("Success",{
        description: "Community deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast.error( "Error",{
        description: "Failed to delete community",
      });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/community-topics/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-topics"] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      });
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      apiRequest("/api/communities", "POST", { ...data, isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communities"] });
      toast({
        title: "Success",
        description: "Community created successfully",
      });
      setShowCreateCommunity(false);
      setNewCommunityName("");
      setNewCommunityDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive",
      });
    },
  });

  const createTopicMutation = useMutation({
    mutationFn: (data: { title: string; description: string; communityId: number }) =>
      apiRequest("/api/community-topics", "POST", { ...data, createdBy: 1 }), // Default admin user
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-topics"] });
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      setShowCreateTopic(false);
      setNewTopicTitle("");
      setNewTopicDescription("");
      setSelectedCommunityId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive",
      });
    },
  });

  const filteredCommunities = communities?.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredTopics = topics?.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (topic.community && topic.community.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleDelete = (id: number, type: 'community' | 'topic') => {
    setDeleteId(id);
    setDeleteType(type);
  };

  const confirmDelete = () => {
    if (deleteId) {
      if (deleteType === 'community') {
        deleteCommunityMutation.mutate(deleteId);
      } else {
        deleteTopicMutation.mutate(deleteId);
      }
    }
  };

  const handleCreateCommunity = () => {
    if (newCommunityName.trim() && newCommunityDescription.trim()) {
      createCommunityMutation.mutate({
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim(),
      });
    }
  };

  const handleCreateTopic = () => {
    if (newTopicTitle.trim() && newTopicDescription.trim() && selectedCommunityId) {
      createTopicMutation.mutate({
        title: newTopicTitle.trim(),
        description: newTopicDescription.trim(),
        communityId: selectedCommunityId,
      });
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
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isMobile={isMobile}
        />
        
        {/* Page Content */}
        <main className="p-6 space-y-6 fade-in">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Community Management</h2>
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
                      <label className="text-sm font-medium mb-2 block">Community</label>
                      <Select value={selectedCommunityId?.toString() || ""} onValueChange={(value) => setSelectedCommunityId(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                        <SelectContent>
                          {communities?.map((community) => (
                            <SelectItem key={community.id} value={community.id.toString()}>
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Topic Title</label>
                      <Input
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="Enter topic title..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newTopicDescription}
                        onChange={(e) => setNewTopicDescription(e.target.value)}
                        placeholder="Describe the topic..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setShowCreateTopic(false);
                      setNewTopicTitle("");
                      setNewTopicDescription("");
                      setSelectedCommunityId(null);
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateTopic} 
                      disabled={!newTopicTitle.trim() || !newTopicDescription.trim() || !selectedCommunityId || createTopicMutation.isPending}
                    >
                      {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showCreateCommunity} onOpenChange={setShowCreateCommunity}>
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
                      <label className="text-sm font-medium mb-2 block">Community Name</label>
                      <Input
                        value={newCommunityName}
                        onChange={(e) => setNewCommunityName(e.target.value)}
                        placeholder="Enter community name..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newCommunityDescription}
                        onChange={(e) => setNewCommunityDescription(e.target.value)}
                        placeholder="Describe the community purpose..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setShowCreateCommunity(false);
                      setNewCommunityName("");
                      setNewCommunityDescription("");
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateCommunity} 
                      disabled={!newCommunityName.trim() || !newCommunityDescription.trim() || createCommunityMutation.isPending}
                    >
                      {createCommunityMutation.isPending ? "Creating..." : "Create Community"}
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
                    <p className="text-2xl font-bold">{communities?.length || 0}</p>
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
                    <p className="text-2xl font-bold">
                      {topics?.reduce((sum, topic) => sum + (topic._count?.posts || 0), 0) || 0}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communities and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="communities" className="space-y-4">
            <TabsList>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>

            {/* Communities Tab */}
            <TabsContent value="communities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Communities ({filteredCommunities.length})</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Community
                  </Button>
                </CardHeader>
                <CardContent>
                  {communitiesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                  ) : filteredCommunities.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No communities found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCommunities.map((community) => (
                        <div key={community.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-foreground">
                                  {community.name}
                                </h3>
                                <Badge variant={community.isActive ? "default" : "secondary"}>
                                  {community.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {community.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>{community._count?.topics || 0} topics</span>
                                <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(community.id, 'community')}
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
            </TabsContent>

            {/* Topics Tab */}
            <TabsContent value="topics">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Topics ({filteredTopics.length})</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Topic
                  </Button>
                </CardHeader>
                <CardContent>
                  {topicsLoading ? (
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
                  ) : filteredTopics.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No topics found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTopics.map((topic) => (
                        <div key={topic.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {topic.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {topic.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {topic.community && (
                                  <div className="flex items-center">
                                    <Hash className="w-3 h-3 mr-1" />
                                    {topic.community.name}
                                  </div>
                                )}
                                {topic.createdBy && (
                                  <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {topic.createdBy.firstName} {topic.createdBy.lastName}
                                  </div>
                                )}
                                <span>{topic._count?.posts || 0} posts</span>
                                <span>Created {new Date(topic.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(topic.id, 'topic')}
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
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteType === 'community' ? 'Community' : 'Topic'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType}? This action cannot be undone and will remove all associated content.
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