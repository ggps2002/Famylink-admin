// Basic ObjectId type (can be string or full object)
export type ObjectId = string;

// Media type
export interface Media {
  url: string;
  type: "image" | "video";
  _id?: string;
}

// Nested reply (recursive)
export interface NestedReply {
  _id: string;
  user: ObjectId;
  comment: string;
  isAnonymous?: boolean;
  media: Media[];
  likes: ObjectId[];
  dislikes: ObjectId[];
  replies: NestedReply[]; // Recursive nesting
  createdAt: string;
  updatedAt: string;
}

// Comment with replies
export interface Comment {
  _id: string;
  user: ObjectId;
  isAnonymous?: boolean;
  comment: string;
  media: Media[];
  likes: ObjectId[];
  dislikes: ObjectId[];
  replies: NestedReply[];
  createdAt: string;
  updatedAt: string;
  isOriginalFromReply?: boolean
}

// Post with comments
export interface Post {
  _id: string;
  description: string;
  isAnonymous?: boolean;
  media: Media[];
  likes: ObjectId[];
  dislikes: ObjectId[];
  createdBy: ObjectId;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// // Topic with posts
// export interface Topic {
//   _id: string;
//   name: string;
//   description: string;
//   createdBy: ObjectId;
//   posts: Post[];
//   createdAt: string;
//   updatedAt: string;
// }

// // Full community
// export interface Community {
//   _id: string;
//   name: string;
//   description: string;
//   topics: Topic[];
//   createdBy: ObjectId;
//   createdAt: string;
//   updatedAt: string;
//   __v?: number;
// }

export interface Community {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface PostWithMeta {
  post: Post;
  topicName: string;
  communityName: string;
}
