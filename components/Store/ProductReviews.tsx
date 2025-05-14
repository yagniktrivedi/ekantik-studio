"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { ProductReview } from "@/lib/types/store";

interface ProductReviewsProps {
  reviews: ProductReview[];
  productId: string;
}

export default function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call for submitting review
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, we would call the Supabase API here
      // const { data, error } = await supabase
      //   .from('product_reviews')
      //   .insert({
      //     product_id: productId,
      //     user_id: user.id,
      //     rating,
      //     comment,
      //   });
      // if (error) throw error;
      
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {reviews.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                </div>
                
                <div className="flex items-center mb-3">
                  {review.userAvatar ? (
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName} 
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
      
      <Separator className="mb-8" />
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
        
        {!user ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">Please login to write a review</p>
            <Button className="bg-ekantik-600 hover:bg-ekantik-700">
              Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      (hoveredRating || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-ekantik-600 hover:bg-ekantik-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
