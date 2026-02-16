import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { ProductFilters } from "@/components/ProductFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Products() {
  const [filters, setFilters] = useState({
    sort: "newest",
    minPrice: "",
    maxPrice: "",
    categoryId: null as string | null
  });
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useProducts({
    ...filters,
    search,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    category: filters.categoryId || undefined
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Yedek Parçalar</h1>
            <p className="text-muted-foreground">Aradığınız tüm parçalar tek bir yerde.</p>
          </div>
          
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Parça ara..." 
                className="pl-10 bg-secondary/20 border-white/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

        {/* Category Buttons and Sort - Similar to NewArrivals */}
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-8 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
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

             <ProductFilters 
               filters={filters} 
               setFilters={setFilters} 
               categories={categories}
               hideSort={true}
             />
          </div>
        </div>



        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-[400px] bg-secondary/20 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-24 bg-secondary/10 rounded-3xl border border-white/5">
                <h3 className="text-2xl font-bold mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground">Aramanızla eşleşen ürün bulunamadı.</p>
                <Button 
                  variant="ghost" 
                  className="text-primary mt-4"
                  onClick={() => { 
                    setSearch(""); 
                    setFilters({ sort: "newest", minPrice: "", maxPrice: "", categoryId: null }); 
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
