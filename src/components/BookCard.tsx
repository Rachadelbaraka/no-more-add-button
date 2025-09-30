import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Book, Review } from "@/pages/Index";

interface BookCardProps {
  book: Book;
  reviews: Review[];
  onReviewClick: () => void;
  onViewReviews: () => void;
  canReview: boolean;
}

export const BookCard = ({ book, reviews, onReviewClick, onViewReviews, canReview }: BookCardProps) => {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="h-full flex flex-col book-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-accent rounded-lg mb-4 flex items-center justify-center overflow-hidden border-2 border-border">
          {book.cover_url ? (
            <img 
              src={book.cover_url} 
              alt={`Couverture de ${book.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl opacity-60">📖</div>
          )}
        </div>
        <h3 className="font-bold text-xl line-clamp-2 text-primary">{book.title}</h3>
        <p className="text-sm text-muted-foreground font-medium">{book.author}</p>
      </CardHeader>

      <CardContent className="flex-1">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
        
        {book.category && (
          <Badge variant="secondary" className="mb-3 bg-accent text-accent-foreground font-medium">
            {book.category}
          </Badge>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex">{renderStars(averageRating)}</div>
          <button 
            onClick={onViewReviews}
            className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors underline"
          >
            ({reviews.length} avis)
          </button>
        </div>

        {book.price && (
          <p className="font-bold text-xl text-primary">
            {book.price.toFixed(2)} €
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={onReviewClick}
          className={`w-full font-semibold ${canReview ? 'leather-button' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          variant={canReview ? "default" : "outline"}
        >
          {canReview ? "💭 Donner mon avis" : "🔐 Se connecter pour donner un avis"}
        </Button>
      </CardFooter>
    </Card>
  );
};