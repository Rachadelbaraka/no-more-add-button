import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { Review, Book } from "@/pages/Index";

interface ReviewsListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  reviews: Review[];
}

export const ReviewsList = ({ open, onOpenChange, book, reviews }: ReviewsListProps) => {
  if (!book) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Avis pour "{book.title}"
          </DialogTitle>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)}/5 ({reviews.length} avis)
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun avis pour ce livre.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {review.profiles?.first_name && review.profiles?.last_name
                          ? `${review.profiles.first_name} ${review.profiles.last_name}`
                          : "Utilisateur anonyme"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-sm mb-2 text-primary">
                    {review.title}
                  </h4>
                )}

                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};