export interface ReviewUser {
  userId: string;
  userName: string;
  avatar?: string;
}

export interface ReviewImage {
  imageId: string;
  imageUrl: string;
}

export interface Review {
  reviewId: string;
  productId: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  images: ReviewImage[];
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  variantInfo?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateReviewPayload {
  productId: string;
  variantId?: string;
  rating: number;
  comment: string;
  images?: File[];
}

export interface UpdateReviewPayload {
  reviewId: string;
  rating?: number;
  comment?: string;
  images?: File[];
}

export type ReviewFilter = 'all' | '5' | '4' | '3' | '2' | '1' | 'images' | 'verified';

export interface ReviewFilterParams {
  productId: string;
  filter?: ReviewFilter;
  page?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'oldest' | 'helpful';
}

