
import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ProductFilters } from "@/components/ProductFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewArrivals() {
  const [filters, setFilters] = useState({
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    categoryId: null as string | null
  });

  const { data: products, isLoading } = useProducts({
    ...filters,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    category: filters.categoryId || undefined
  });

  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-[rgb(23,186,76)] text-black dark:text-white mb-4">
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-[#0E1A2B] dark:text-white mb-4">
                Yeni Eklenenler
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Stoklarımıza yeni giren motosiklet yedek parçaları, aksesuarlar ve ekipmanlar.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="flex gap-2">
                {[
                  "Yedek Parça",
                  "Elektronik Ekipman",
                  "Jant & Lastik"
                ].map((catName) => {
                  const category = categories?.find(c => c.name === catName);
                  if (!category) return null;
                  const isActive = filters.categoryId === String(category.id);
                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setFilters(prev => ({ ...prev, categoryId: isActive ? null : String(category.id) }))}
                      className="whitespace-nowrap"
                    >
                      {catName}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <Select 
                  value={filters.sort} 
                  onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
                >
                  <SelectTrigger className="w-[180px] bg-white dark:bg-slate-950 text-black dark:text-white border border-gray-200 dark:border-white">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">En Yeniler</SelectItem>
                    <SelectItem value="oldest">En Eskiler</SelectItem>
                    <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                    <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden md:block">
                  <span className="text-sm font-bold text-[#17BA4C] bg-[#17BA4C]/10 px-4 py-2 rounded-full whitespace-nowrap">
                    {products?.length || 0} Ürün Listelendi
                  </span>
                </div>
              </div>
            </div>
            
            {/* Filter Trigger */}
            <ProductFilters 
              filters={filters} 
              setFilters={setFilters} 
              categories={categories}
              hideSort={true}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">


          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-[#17BA4C]" />
              </div>
            ) : (
              <>
                {products && products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                    <p className="text-xl text-gray-500 dark:text-gray-400">Henüz yeni eklenen ürün bulunmuyor.</p>
                    <Button 
                      variant="ghost" 
                      className="text-primary mt-4"
                      onClick={() => setFilters({ sort: "newest", minPrice: "", maxPrice: "", categoryId: null })}
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
