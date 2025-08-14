"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Comment } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { deleteComment } from "@/redux/slices/communitySlice";

interface CreatorDetails {
  name: string;
  profilePic: string | null;
  type: string;
}

type PostCreators = Record<string, CreatorDetails>;

const dateFormatting = (date) => {
  const createdAtDate = new Date(date);
  const now = new Date();

  const isYesterday =
    now.getDate() - createdAtDate.getDate() === 1 &&
    now.getMonth() === createdAtDate.getMonth() &&
    now.getFullYear() === createdAtDate.getFullYear();

  const formatTime = createdAtDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isYesterday) {
    return `${formatTime}, Yesterday`;
  }

  const isToday =
    now.getDate() === createdAtDate.getDate() &&
    now.getMonth() === createdAtDate.getMonth() &&
    now.getFullYear() === createdAtDate.getFullYear();

  if (isToday) {
    return `${formatTime}, Today`;
  }

  // Default: show date like "Jul 25, 2025"
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatTime}, ${formattedDate}`;
};

interface Props {
  comments: Comment[];
  activePostId: string;
  //   setReplyToCommentId: (commentId: string | null) => void;
  //   setQuotedText: (text: string) => void;
  //   setIsReplyModalOpen: (open: boolean) => void;
  //   setDeletePostId: (id: string | null) => void;
  //   setDeleteCommentId: (id: string | null) => void;
  //   setIsDeleteDialogOpen: (open: boolean) => void;
  //   deleteId: string | null;
  //   setDeleteId: (id: string | null) => void;
  //   deleteType: "community" | "topic" | "comment";
  //   confirmDelete: () => void;
  //   dateFormatting: (date: string) => string;
}

// Comment threading logic with curved lines
export const RenderCommentsWithLines: React.FC<Props> = ({
  comments,
  activePostId,
}) => {
const [deleteId, setDeleteId] = useState<string | null>(null)
const dispatch = useDispatch<AppDispatch>()
const handleDelete = (id : string) => {
  setDeleteId(id);
}
  const confirmDelete = async () => {
    console.log(deleteId)
    if (!deleteId) return;
    try {
      // await handleDeleteComment(activePostId, deleteId);
      await dispatch(deleteComment({ activePostId: activePostId, deleteCommentId: deleteId }))
      toast.success("Comment deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting comment");
      console.error("Error:", error);
    }
  };
  if (!comments || comments.length === 0) return null;
  // const dispatch = useDispatch<AppDispatch>()
  const originalComments: Comment[] = [];
  const replyComments: Comment[] = [];

  comments.forEach((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      replyComments.push(comment);
    } else {
      originalComments.push(comment);
    }
  });

  const commentThreads = originalComments.map((originalComment) => {
    const relatedReplies = replyComments.filter(
      (reply) =>
        reply.replies[0].comment === originalComment.comment ||
        reply.replies.some((r) => r.user === originalComment.user?._id)
    );

    return {
      original: originalComment,
      replies: relatedReplies,
    };
  });

  replyComments.forEach((reply) => {
    const hasMatchingOriginal = commentThreads.some((thread) =>
      thread.replies.includes(reply)
    );

    if (!hasMatchingOriginal) {
      commentThreads.push({
        original: {
          ...reply.replies[0],
          _id: `original-${reply._id}`,
          isOriginalFromReply: true,
        },
        replies: [reply],
      });
    }
  });

  return commentThreads
    .sort(
      (a, b) =>
        new Date(a.original.createdAt).getTime() -
        new Date(b.original.createdAt).getTime()
    )
    .map((thread, threadIndex) => {
      const originalComment = thread.original;
      const commentUser: string | undefined = originalComment.user;

      return (
        <div
          key={originalComment._id || `thread-${threadIndex}`}
          className="relative"
        >
          {/* Original Comment */}
          <div className="flex items-start space-x-3">
            {/* 
            {commentUser?.profilePic && !originalComment.isAnonymous ? (

              <Image
                  src={commentUser.profilePic}
                  alt="Profile"
                  height={100}
                  width={100}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
              
                <Avatar
                  name={
                    originalComment.isAnonymous
                      ? "Anonymous"
                      : commentUser?.name || "User"
                  }
                  size="40"
                  round
                  className="text-white flex-shrink-0"
                  color="#6B7280"
                />
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {originalComment.isAnonymous
                      ? "AN"
                      : (commentUser?.name?.[0] ?? "").toUpperCase() +
                          (commentUser?.name?.[1] ?? "").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) 
            */}
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl px-4">
                <div className="flex items-center space-x-2">
                  <h4 className="Livvic-SemiBold text-sm ">
                      {commentUser}
                  </h4>
                  {commentUser === "Admin" && (         // ✔️ Check back later
                    <Shield className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <span className="Livvic-Medium text-xs -mt-2 text-[#555555]">
                  {dateFormatting(originalComment.createdAt)}
                </span>
                <p className="Livvic-Medium text-sm break-words">
                  {originalComment.comment}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 px-2">
                {/* {!originalComment.isOriginalFromReply && ( */}
                  <>
                    {/* <button
                      onClick={() => handleCommentLike(originalComment._id)}
                      className="hover:text-red-500 font-medium"
                    >
                      Like ({originalComment.likes?.length || 0})
                    </button>
                    <button
                      onClick={() => {
                        setReplyToCommentId(originalComment._id);
                        setQuotedText(originalComment.comment);
                        setIsReplyModalOpen(true);
                      }}
                      className="hover:text-blue-500 font-medium"
                    >
                      Reply
                    </button> */}
                    {/* {currentUserId === originalComment.user?._id && ( */}
                    <button
                      onClick={() => handleDelete(originalComment._id.replace(/^original-/, ""))}
                      className="hover:text-red-500 font-medium"
                    >
                      Delete
                    </button>
                    {/* )} */}
                  </>
                {/* )} */}
              </div>
            </div>
          </div>

          {/* Replies with Vertical Line + Dot */}
          {thread.replies.length > 0 && (
            <div className="relative ml-12 pl-6 space-y-4 mt-4">
              {thread.replies
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((reply, replyIndex) => {
                  const replyUser: string | undefined =
                    reply.user;

                  return (
                    <div key={reply._id} className="relative">
                      {/* Dot before each reply */}
                      <div className="flex items-start space-x-3">
                        {/* {replyUser?.profilePic && !reply.isAnonymous ? (
                          <Image
                            height={100}
                            width={100}
                            src={replyUser.profilePic}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>
                              {originalComment.isAnonymous
                                ? "AN"
                                : (replyUser?.name?.[0] ?? "").toUpperCase() +
                                    (
                                      replyUser?.name?.[1] ?? ""
                                    ).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )} */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-white rounded-2xl px-3 ">
                            <div className="flex items-center space-x-2">
                              <h4 className="Livvic-SemiBold text-sm text-gray-900">
                               {replyUser}
                              </h4>
                              {replyUser === "Admin" && (      // ✔️ Check back later
                                <Shield className="w-3 h-3 text-blue-600" />
                              )}
                            </div>
                            <span className="Livvic-Medium text-xs !mt-1 text-[#555555]">
                              {dateFormatting(reply.createdAt)}
                            </span>
                            <p className="Livvic-Medium text-sm break-words text-black">
                              {reply.comment}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 px-2">
                            {/* <button
                              onClick={() => handleCommentLike(reply._id)}
                              className="hover:text-red-500 font-medium"
                            >
                              Like ({reply.likes?.length || 0})
                            </button>
                            <button
                              onClick={() => {
                                setReplyToCommentId(originalComment._id);
                                // setQuotedText(reply.comment);
                                setIsReplyModalOpen(true);
                              }}
                              className="hover:text-blue-500 font-medium"
                            >
                              Reply
                            </button> */}
                            <button
                              onClick={() => handleDelete(reply._id)}
                              className="hover:text-red-500 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this comment? This action
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
    });
};
