// next/image appelle cette fonction pour chaque largeur d'écran.
// Unsplash redimensionne lui-même l'image : pas besoin de l'optimiseur de Next.
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 75}`;
}
