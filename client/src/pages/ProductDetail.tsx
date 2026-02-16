
import { useState, useEffect } from "react";
import { useProduct } from "@/hooks/use-products";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Minus, Plus, ShoppingCart, Star, Truck, Shield, RotateCcw, Check, Heart, Share2, ShieldCheck, RefreshCw, ArrowLeft, PlayCircle, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "@/pages/Admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);

  const addToCart = useCart((state) => state.addToCart);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const isKwFavorite = product ? isFavorite(product.id) : false;

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product);
      toast({
        title: isKwFavorite ? "Favorilerden Çıkarıldı" : "Favorilere Ekle",
        description: `${product.name} favorilerinizden ${isKwFavorite ? "çıkarıldı" : "eklendi"}.`,
      });
    }
  };

  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      let images: string[] = [];
      try {
        if (product.images) {
           images = JSON.parse(product.images);
        }
      } catch (e) {
        console.error("Failed to parse product images", e);
      }
      
      // Fallback to imageUrl if images array is empty
      if (images.length === 0 && product.imageUrl) {
        images = [product.imageUrl];
      } else if (images.length > 0 && product.imageUrl && !images.includes(product.imageUrl)) {
         // Ensure main imageUrl is included if not present (though our server logic puts it first)
         // Actually server logic sets imageUrl to images[0] so it should be there.
      }

      setMediaList(images);
      setActiveMedia(images[0] || product.imageUrl);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Sepete Eklendi",
        description: `${product.name} sepetinize eklendi.`,
      });
    }
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      categoryId: "",
      brand: "",
      model: "",
      year: "",
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        price: (product.price / 100).toString(),
        stock: product.stock || 0,
        categoryId: product.categoryId?.toString() || "",
        brand: product.brand || "",
        model: product.model || "",
        year: (product.year || "") as any,
        isFeatured: product.isFeatured || false,
      });
    }
  }, [product, form]);

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi",
      });
      setLocation("/products");
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Math.round(data.price * 100).toString());
      formData.append("stock", data.stock.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("brand", data.brand || "");
      formData.append("model", data.model || "");
      if (data.year) formData.append("year", data.year.toString());
      formData.append("isFeatured", data.isFeatured.toString());
      
      // Handle file uploads if any (not implemented in this quick edit, but supported by backend)
      // For now we just update text fields. To update images, we'd need a file input in the edit dialog.

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update product");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi",
      });
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onUpdateSubmit = (data: any) => {
    updateProductMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">Ürün bulunamadı</div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors group dark:text-gray-200" onClick={() => setLocation("/products")}>
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Ürünlere Dön
        </Button>

        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-200 dark:border-slate-700 dark:text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Düzenle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-black dark:text-white">
                <DialogHeader>
                  <DialogTitle>Ürünü Düzenle</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onUpdateSubmit, (errors) => {
                  console.error("Form validation errors:", errors);
                  toast({
                    title: "Hata",
                    description: "Lütfen tüm alanları doğru doldurduğunuzdan emin olun.",
                    variant: "destructive",
                  });
                })} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black dark:text-gray-200">Ürün Adı</Label>
                    <Input id="name" {...form.register("name")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-black dark:text-gray-200">Açıklama</Label>
                    <Textarea id="description" {...form.register("description")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white h-32" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-black dark:text-gray-200">Fiyat (TL)</Label>
                      <Input id="price" type="number" step="0.01" {...form.register("price")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-black dark:text-gray-200">Stok Adedi</Label>
                      <Input id="stock" type="number" {...form.register("stock")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                    </div>
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="category" className="text-black dark:text-gray-200">Kategori</Label>
                    <Select onValueChange={(val) => form.setValue("categoryId", val)} defaultValue={form.getValues("categoryId") || product.categoryId?.toString()}>
                      <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Kategori Seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-black dark:text-white">
                        <SelectItem value="1">Yedek Parça</SelectItem>
                        <SelectItem value="2">Elektronik Ekipman</SelectItem>
                        <SelectItem value="3">Jant & Lastik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-black dark:text-gray-200">Marka</Label>
                      <Input id="brand" {...form.register("brand")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="model" className="text-black dark:text-gray-200">Model</Label>
                       <Input id="model" {...form.register("model")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                    </div>
                  </div>
                  
                   <div className="space-y-2">
                       <Label htmlFor="year" className="text-black dark:text-gray-200">Yıl</Label>
                       <Input id="year" type="number" {...form.register("year")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                    </div>

                  <Button type="submit" className="w-full" disabled={updateProductMutation.isPending}>
                    {updateProductMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-black dark:text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                    Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 dark:bg-slate-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700">İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteProductMutation.mutate()}
                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 sticky top-24 self-start">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 relative aspect-square bg-gray-50 overflow-hidden group">
            {activeMedia && (
              isVideo(activeMedia) ? (
                <video 
                  src={activeMedia} 
                  controls 
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <img 
                  src={activeMedia} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500"
                />
              )
            )}
            
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm group/btn"
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${isKwFavorite ? "fill-red-500 text-red-500" : "text-gray-600 group-hover/btn:text-red-500"}`} 
              />
            </button>
          </div>
          
          {mediaList.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {mediaList.map((media, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMedia(media)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all dark:bg-slate-900",
                    activeMedia === media ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300 dark:hover:border-slate-700"
                  )}
                >
                  {isVideo(media) ? (
                    <div className="w-full h-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-gray-500" />
                    </div>
                  ) : (
                    <img 
                      src={media} 
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8 py-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 mb-4">
              <span className="bg-secondary/10 text-secondary-foreground dark:text-gray-200 px-3 py-1 rounded-full font-medium">
                 {product.brand}
              </span>
              <span>•</span>
              <span className="font-medium">{product.model}</span>
              {product.year && (
                <>
                  <span>•</span>
                  <span>{product.year}</span>
                </>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-[#17BA4C]">
                {(product.price / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                {(product.stock ?? 0) > 0 ? (
                  <span className="text-[#17BA4C] flex items-center gap-1 font-medium bg-[#17BA4C]/10 px-3 py-1 rounded-full">
                    <Check className="w-4 h-4" /> Stokta Var ({product.stock})
                  </span>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm">Tükendi</Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg border-t border-b border-gray-100 dark:border-slate-800 py-6 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-[#17BA4C] hover:bg-[#14a041] text-white shadow-lg shadow-[#17BA4C]/20 transition-all hover:scale-[1.02]"
              disabled={(product.stock ?? 0) <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Sepete Ekle
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className={`h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white ${isKwFavorite ? 'text-red-500 hover:text-red-600 dark:text-red-500' : ''}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`mr-2 h-4 w-4 ${isKwFavorite ? 'fill-current' : ''}`} />
                {isKwFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              </Button>
              <Button variant="outline" size="lg" className="h-12 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white">
                <Share2 className="mr-2 h-4 w-4" />
                Paylaş
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Hızlı Kargo</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saat 15:00'e kadar verilen siparişler aynı gün kargoda.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Orijinal Ürün Garantisi</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tüm ürünlerimiz %100 orijinal ve garantilidir.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-500">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Kolay İade</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">14 gün içinde koşulsuz iade hakkı.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
