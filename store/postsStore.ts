import { Post } from "@/types";
import axios from "axios";
import { create } from "zustand";

interface PostsStoreState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  getPostById: (id: number) => Post | undefined;
}

// Using Dev.to API for English articles
const API_URL = "https://dev.to/api/articles?per_page=7";

export const usePostsStore = create<PostsStoreState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<any[]>(API_URL);
      // Map Dev.to articles to Post format
      const mappedPosts: Post[] = response.data.map((article) => ({
        userId: 1, // Dev.to doesn't have userId, using placeholder
        id: article.id,
        title: article.title,
        body:
          article.description || article.excerpt || "No description available",
      }));
      set({ posts: mappedPosts });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      });
    } finally {
      set({ loading: false });
    }
  },

  getPostById: (id: number) => {
    return get().posts.find((post) => post.id === id);
  },
}));
