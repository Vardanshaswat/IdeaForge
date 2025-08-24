import type { ObjectId } from "mongodb";

export interface Article {
  _id?: ObjectId;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  image?: {
    publicId: {
      type: any;
      required: true;
    };
    url: {
      type: any;
      required: true;
    };
  };
  author: string;
  authorName: string;
  authorEmail: string;
  published: boolean;
  readTime: string;
  createdAt: any;
  updatedAt: any;
  views?: any;
  likes?: any;
  likedBy?: string[];
}

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  image?: {
    publicId: {
      type: String;
      required: true;
    };
    url: {
      type: String;
      required: true;
    };
  };
  author: string;
  authorName: string;
  authorEmail: string;
}
