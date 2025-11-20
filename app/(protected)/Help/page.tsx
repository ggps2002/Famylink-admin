"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Reply,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
} from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbacks } from "@/redux/slices/feedbackSlice";

interface HelpMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  adminReply?: string;
  status: "pending" | "replied" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  repliedAt?: string;
}

interface Feedbacks {
  message: string;
  category:
    | "Bug Report"
    | "Feature Request"
    | "General Feedback"
    | "Complaint"
    | "Compliment";
  email: string;
  createdAt: string;
}

const categoryKeyMap = {
  "Bug Report": "BugReport",
  "Feature Request": "FeatureRequest",
  "General Feedback": "GeneralFeedback",
  Complaint: "Complaint",
  Compliment: "Compliment",
} as const;

const statusColors = {
  BugReport:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",

  FeatureRequest:
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",

  GeneralFeedback:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",

  Complaint: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",

  Compliment:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  normal: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function HelpCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<HelpMessage | null>(
    null
  );
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const isMobile = useIsMobile();
  const {
    feedbacks,
    isLoading,
  }: { feedbacks: Feedbacks[] | []; isLoading: boolean } = useSelector(
    (state: RootState) => state.feedbacks
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const filteredMessages = feedbacks?.map((message) => {
    return message;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      <div className={`flex-1 ${isMobile ? "" : "ml-72"}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
            <p className="text-muted-foreground">
              Manage user inquiries and provide support through our messaging
              system
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : filteredMessages?.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No messages found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    priorityFilter !== "all"
                      ? "Try adjusting your filters to see more messages."
                      : "No user messages have been received yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages?.map((feedback, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {/* <h3 className="font-semibold text-lg">{message.subject}</h3> */}
                          <Badge
                            className={
                              statusColors[categoryKeyMap[feedback.category]]
                            }
                          >
                            {feedback.category}
                          </Badge>
                          {/* <Badge className={priorityColors[message.priority]}>{message.priority}</Badge> */}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          From: {feedback.email}
                          <span className="ml-4">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(
                              feedback.createdAt
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(feedback.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                          {feedback.message}
                        </p>
                        {/* {message.adminReply && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                              Admin Reply:
                            </div>
                            <p className="text-blue-800 dark:text-blue-200">
                              {message.adminReply}
                            </p>
                            {message.repliedAt && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Replied on{" "}
                                {new Date(
                                  message.repliedAt
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )} */}
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2">
                        <a
                          href={`mailto:${feedback.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button size="sm" className="w-full">
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </a>
                        {/* {message.status !== "replied" && (
                          <Dialog
                            open={
                              replyDialogOpen &&
                              selectedMessage?.id === message.id
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setReplyDialogOpen(true);
                                }}
                              >
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Reply to {message.senderName}
                                </DialogTitle>
                                <DialogDescription>
                                  Subject: {message.subject}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                                  <p className="text-sm">{message.message}</p>
                                </div>
                                <Textarea
                                  placeholder="Type your reply here..."
                                  value={adminReply}
                                  onChange={(e) =>
                                    setAdminReply(e.target.value)
                                  }
                                  rows={6}
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setReplyDialogOpen(false);
                                    setAdminReply("");
                                    setSelectedMessage(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleReply}
                                  disabled={
                                    !adminReply.trim() ||
                                    replyMutation.isPending
                                  }
                                >
                                  {replyMutation.isPending
                                    ? "Sending..."
                                    : "Send Reply"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )} */}

                        {/* <Select
                          value={message.status}
                          onValueChange={(value) =>
                            handleStatusChange(message.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
