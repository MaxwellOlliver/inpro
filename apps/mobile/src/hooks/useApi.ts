import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/http/api';

// Example: Fetch user profile
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId, // Only run if userId is provided
  });
}

// Example: Create a new post (mutation)
export function useCreatePost() {
  return useMutation({
    mutationFn: async (postData: { title: string; content: string }) => {
      const { data } = await apiClient.post('/posts', postData);
      return data;
    },
    // Called after successful mutation
    onSuccess: (data) => {
      console.log('Post created:', data);
      // You can invalidate queries here if needed
      // queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
}

// Example: Update a post (mutation)
export function useUpdatePost() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; content?: string };
    }) => {
      const response = await apiClient.patch(`/posts/${id}`, data);
      return response.data;
    },
  });
}

// Example: Delete a post (mutation)
export function useDeletePost() {
  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/posts/${postId}`);
    },
  });
}

// Example: Fetch paginated posts
export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/posts', {
        params: { page, limit },
      });
      return data;
    },
  });
}
