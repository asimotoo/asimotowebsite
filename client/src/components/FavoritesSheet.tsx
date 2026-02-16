import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useFavorites } from "@/lib/favorites-store";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export function FavoritesSheet() {
  const { favorites, removeFavorite } = useFavorites();
  const addToCart = useCart((state) => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hidden sm:flex text-black hover:text-[#17BA4C] dark:text-white dark:hover:text-[#17BA4C] relative">
          <Heart className="w-5 h-5" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#17BA4C] text-[10px] text-white flex items-center justify-center rounded-full font-bold">
              {favorites.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-2.5 pb-4 border-b border-gray-100 dark:border-slate-800">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#17BA4C] fill-current" />
            Favorilerim ({favorites.length})
          </SheetTitle>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-50">Favori listeniz boş</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
            </p>
            <SheetTrigger asChild>
              <Link href="/products">
                <Button className="bg-[#17BA4C] hover:bg-[#14a041] text-white">
                  Alışverişe Başla
                </Button>
              </Link>
            </SheetTrigger>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 -mx-4 px-4 space-y-4">
            {favorites.map((product) => (
              <div key={product.id} className="group relative flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                 <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                    />
                 </div>
                 
                 <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${product.id}`} className="block">
                         <h4 className="font-semibold text-sm line-clamp-2 text-slate-900 dark:text-slate-50 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors mb-1">
                           {product.name}
                         </h4>
                      </Link>
                      <div className="text-[#17BA4C] font-bold text-sm">
                        {(product.price / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                       <Button 
                         size="sm" 
                         className="h-8 flex-1 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white shadow-none text-xs"
                         onClick={() => handleAddToCart(product)}
                         disabled={(product.stock ?? 0) <= 0}
                       >
                         <ShoppingCart className="w-3 h-3 mr-1.5" />
                         {(product.stock ?? 0) > 0 ? "Sepete Ekle" : "Tükendi"}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                         onClick={() => removeFavorite(product.id)}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
