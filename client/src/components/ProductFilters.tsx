import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductFiltersProps {
  filters: {
    sort: string;
    minPrice: string;
    maxPrice: string;
    categoryId: string | null;
  };
  setFilters: (filters: any) => void;
  categories?: { id: number; name: string }[];
  className?: string;
  hideSort?: boolean;
}

export function ProductFilters({ filters, setFilters, categories, className, hideSort = false }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      categoryId: null
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      {categories && (
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select 
            value={localFilters.categoryId || "all"} 
            onValueChange={(val) => setLocalFilters({ ...localFilters, categoryId: val === "all" ? null : val })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-950 text-black dark:text-white border border-gray-200 dark:border-slate-800">
              <SelectValue placeholder="Kategori Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort Filter */}
      {!hideSort && (
        <div className="space-y-2">
          <Label>Sıralama</Label>
          <Select 
            value={localFilters.sort} 
            onValueChange={(val) => setLocalFilters({ ...localFilters, sort: val })}
          >
            <SelectTrigger className="bg-white dark:bg-slate-950 text-black dark:text-white border border-gray-200 dark:border-slate-800">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeniler</SelectItem>
              <SelectItem value="oldest">En Eskiler</SelectItem>
              <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
              <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label>Fiyat Aralığı (TL)</Label>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Min" 
            type="number"
            value={localFilters.minPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
            className="w-full bg-white dark:bg-slate-950 text-black dark:text-white border border-gray-200 dark:border-slate-800"
          />
          <span className="text-muted-foreground">-</span>
          <Input 
            placeholder="Max" 
            type="number"
            value={localFilters.maxPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
            className="w-full bg-white dark:bg-slate-950 text-black dark:text-white border border-gray-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="flex bg-secondary/20 p-4 rounded-lg gap-2 mt-8">
        <Button variant="outline" className="flex-1" onClick={handleClear}>
          Temizle
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Uygula
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Filter className="w-4 h-4" />
          Filtrele
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filtrele & Sırala</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
