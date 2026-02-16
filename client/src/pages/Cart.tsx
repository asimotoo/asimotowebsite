import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [_, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 font-display dark:text-white">Sepetiniz Boş</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sepetinizde henüz ürün bulunmamaktadır. İhtiyacınız olan parçaları bulmak için mağazamıza göz atın.
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-[#17BA4C] hover:bg-[#14a041]">
            Alışverişe Başla
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary dark:text-gray-300 transition-colors group" onClick={() => setLocation("/products")}>
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Alışverişe Devam Et
      </Button>

      <h1 className="text-3xl font-display font-bold mb-8 dark:text-white">Alışveriş Sepeti ({items.length} Ürün)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="overflow-hidden border-gray-100 dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-700">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-2"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                         <p className="text-xs text-muted-foreground font-medium mb-1">{item.product.brand}</p>
                         <Link href={`/products/${item.product.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{item.product.name}</h3>
                         </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 -mr-2"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-l-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-300"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-r-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-300"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.product.stock !== null && item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {(item.product.stock !== null && item.quantity >= item.product.stock) && (
                         <span className="text-xs text-amber-600 font-medium">Maks. stok</span>
                      )}
                    </div>
                    
                    <div className="text-right">
                       <div className="font-bold text-lg text-[#17BA4C]">
                        {((item.product.price * item.quantity) / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                       </div>
                       {item.quantity > 1 && (
                         <div className="text-xs text-gray-500 dark:text-gray-400">
                           Birim: {(item.product.price / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
           <div className="flex justify-end pt-2">
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={clearCart}>
               Sepeti Temizle
            </Button>
           </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-gray-100 dark:border-slate-800 dark:bg-slate-900 shadow-md sticky top-24">
            <CardHeader className="pb-4 border-b border-gray-50 dark:border-slate-800">
              <CardTitle className="dark:text-white">Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ara Toplam</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(total() / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Kargo</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {total() > 50000 ? 'Ücretsiz' : '₺50,00'}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                   <span className="font-bold text-lg dark:text-white">Toplam</span>
                   <span className="font-bold text-2xl text-[#17BA4C]">
                     {((total() + (total() > 50000 ? 0 : 5000)) / 100).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                   </span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg font-bold bg-[#17BA4C] hover:bg-[#14a041] text-white shadow-lg shadow-[#17BA4C]/20">
                Siparişi Tamamla
              </Button>
              
               <div className="text-center">
                  <p className="text-xs text-gray-400 mt-4">
                     Güvenli ödeme altyapısı ile korunmaktadır.
                  </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
