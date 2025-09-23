-- Ajouter des images aux livres existants
UPDATE public.books SET cover_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=faces' WHERE title = 'Le Petit Prince';

UPDATE public.books SET cover_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&crop=faces' WHERE title = '1984';

UPDATE public.books SET cover_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=faces' WHERE title = 'L''Étranger';

UPDATE public.books SET cover_url = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=faces' WHERE title = 'Les Misérables';

-- Ajouter quelques livres supplémentaires avec des images
INSERT INTO public.books (title, author, isbn, description, category, price, cover_url) VALUES
('Harry Potter à l''école des sorciers', 'J.K. Rowling', '978-2070518425', 'Le premier tome de la célèbre saga du jeune sorcier.', 'Fantastique', 14.90, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=faces'),
('Le Seigneur des Anneaux', 'J.R.R. Tolkien', '978-2266154095', 'L''épopée fantasy qui a défini le genre pour des générations.', 'Fantastique', 22.90, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&crop=faces'),
('Dune', 'Frank Herbert', '978-2266320084', 'Un classique de la science-fiction dans un univers désertique fascinant.', 'Science-Fiction', 18.90, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=faces'),
('Orgueil et Préjugés', 'Jane Austen', '978-2253004912', 'Un classique de la littérature anglaise sur l''amour et les préjugés sociaux.', 'Romance', 11.90, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=faces');