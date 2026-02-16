import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const isKwFavorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    toast({
      title: isKwFavorite ? "Favorilerden Çıkarıldı" : "Favorilere Ekle",
      description: `${product.name} favorilerinizden ${isKwFavorite ? "çıkarıldı" : "eklendi"}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
          {product.isFeatured && (
            <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground border-none font-bold">
              ÖNE ÇIKAN
            </Badge>
          )}
          {product.stock !== null && product.stock <= 0 && (
            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-1">Tükendi</Badge>
            </div>
          )}
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${isKwFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
            />
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <Link href={`/products/${product.id}`}>
              <Button variant="secondary" className="w-full gap-2 mb-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border-0">
                <Eye className="w-4 h-4" />
                İncele
              </Button>
            </Link>
          </div>
        </div>
        
        <CardContent className="p-4">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors block">
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-xl text-primary">
              {(product.price / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full gap-2 bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors group-hover:bg-primary"
            disabled={(product.stock !== null && product.stock <= 0) || product.price === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Sepete Ekle
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
