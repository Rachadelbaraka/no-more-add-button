import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookCard } from "@/components/BookCard";
import { ReviewForm } from "@/components/ReviewForm";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  cover_url?: string;
  price?: number;
  category?: string;
  publication_date?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
    fetchReviews();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les livres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    }
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    if (user) {
      setShowReviewForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedBook(null);
    fetchReviews();
    toast({
      title: "Succès",
      description: "Votre avis a été publié avec succès !",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(books.map(book => book.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">📚 Ma Librairie</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Bonjour, {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Se déconnecter
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher un livre ou un auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grille des livres */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              reviews={reviews.filter(r => r.book_id === book.id)}
              onReviewClick={() => handleBookSelect(book)}
              canReview={!!user}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun livre trouvé.</p>
          </div>
        )}
      </main>

      {/* Modales */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          setShowAuthModal(false);
          checkUser();
          if (selectedBook) {
            setShowReviewForm(true);
          }
        }}
      />

      <ReviewForm
        open={showReviewForm}
        onOpenChange={setShowReviewForm}
        book={selectedBook}
        onSuccess={handleReviewSubmitted}
      />
    </div>
  );
};

export default Index;