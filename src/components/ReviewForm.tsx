import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/pages/Index";

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onSuccess: () => void;
}

export const ReviewForm = ({ open, onOpenChange, book, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || rating === 0) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour publier un avis",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          book_id: book.id,
          rating,
          title: title || null,
          comment: comment || null,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Erreur",
            description: "Vous avez déjà donné votre avis sur ce livre",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        onSuccess();
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier votre avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donner votre avis</DialogTitle>
        </DialogHeader>

        {book && (
          <div className="mb-4">
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Note *</Label>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Titre de votre avis (optionnel)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre avis en quelques mots..."
            />
          </div>

          <div>
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre opinion sur ce livre..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1"
            >
              {loading ? "Publication..." : "Publier l'avis"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};