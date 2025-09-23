-- Créer la table pour les livres
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  description TEXT,
  cover_url TEXT,
  price DECIMAL(10,2),
  category TEXT,
  publication_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les avis
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les livres (lecture publique, écriture admin uniquement)
CREATE POLICY "Les livres sont visibles par tous" 
ON public.books 
FOR SELECT 
USING (true);

-- Politiques RLS pour les profils
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leur propre profil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Politiques RLS pour les avis
CREATE POLICY "Tous les avis sont visibles par tous" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres avis" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres avis" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres avis" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insérer quelques livres d'exemple
INSERT INTO public.books (title, author, isbn, description, category, price) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2070408504', 'Un conte philosophique et poétique qui raconte les aventures d''un petit prince venu d''une autre planète.', 'Fiction', 9.90),
('1984', 'George Orwell', '978-0451524935', 'Un roman dystopique qui dépeint une société totalitaire où la liberté individuelle est supprimée.', 'Fiction', 12.50),
('L''Étranger', 'Albert Camus', '978-2070360024', 'L''histoire de Meursault, un homme indifférent qui commet un meurtre apparemment sans motif.', 'Fiction', 8.90),
('Les Misérables', 'Victor Hugo', '978-2253096337', 'L''épopée de Jean Valjean dans la France du XIXe siècle, une œuvre monumentale sur la justice et la rédemption.', 'Classique', 15.90);