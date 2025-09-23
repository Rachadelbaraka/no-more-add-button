import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Book, Review } from "@/pages/Index";

interface BookCardProps {
  book: Book;
  reviews: Review[];
  onReviewClick: () => void;
  canReview: boolean;
}

export const BookCard = ({ book, reviews, onReviewClick, canReview }: BookCardProps) => {
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-[3/4] bg-gray-100 rounded-md mb-4 flex items-center justify-center">
          {book.cover_url ? (
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="text-6xl">📖</div>
          )}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>

      <CardContent className="flex-1">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {book.description}
          </p>
        )}
        
        {book.category && (
          <Badge variant="secondary" className="mb-3">
            {book.category}
          </Badge>
        )}

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(averageRating)}</div>
          <span className="text-sm text-muted-foreground">
            ({reviews.length} avis)
          </span>
        </div>

        {book.price && (
          <p className="font-semibold text-lg text-primary">
            {book.price.toFixed(2)} €
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onReviewClick}
          className="w-full"
          variant={canReview ? "default" : "outline"}
        >
          {canReview ? "Donner mon avis" : "Se connecter pour donner un avis"}
        </Button>
      </CardFooter>
    </Card>
  );
};