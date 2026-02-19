import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Motorcycle } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Gauge, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusing the brands list or fetching from API if dynamic
const brands = [
  "Aprilia", "Arora", "Bajaj", "Benelli", "BMW", "CF Moto", "Ducati", "GasGas", 
  "Harley-Davidson", "Hero", "Honda", "Husqvarna", "Indian", "Kanuni", "Kawasaki", 
  "KTM", "Kuba", "Mondial", "Moto Guzzi", "MV Agusta", "Peugeot", "Piaggio", "RKS", 
  "Royal Enfield", "Suzuki", "Triumph", "TVS", "Vespa", "Yamaha", "Yuki", "Universal"
].sort();

export default function Motorcycles() {
  const [filters, setFilters] = useState({
    brand: "all",
    type: "all",
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 2000,
    maxYear: new Date().getFullYear(),
    minKm: 0,
    maxKm: 100000,
    city: "",
  });

  const { data: motorcycles, isLoading } = useQuery<Motorcycle[]>({
    queryKey: ["/api/motorcycles", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.brand !== "all") params.append("brand", filters.brand);
      if (filters.type !== "all") params.append("type", filters.type);
      params.append("minPrice", (filters.minPrice * 100).toString());
      params.append("maxPrice", (filters.maxPrice * 100).toString());
      params.append("minYear", filters.minYear.toString());
      params.append("maxYear", filters.maxYear.toString());
      params.append("minKm", filters.minKm.toString());
      params.append("maxKm", filters.maxKm.toString());
      if (filters.city) params.append("city", filters.city);

      const res = await fetch(`/api/motorcycles?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch motorcycles");
      return res.json();
    },
  });

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#17BA4C]" />
              Filtrele
            </h3>
            
              <div className="space-y-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label>Marka</Label>
                <Select 
                  value={filters.brand} 
                  onValueChange={(val) => setFilters({...filters, brand: val})}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800">
                    <SelectValue placeholder="Marka Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {brands.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select 
                  value={filters.type} 
                  onValueChange={(val) => setFilters({...filters, type: val})}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800">
                    <SelectValue placeholder="Tip Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="SuperSport">SuperSport</SelectItem>
                    <SelectItem value="Naked">Naked</SelectItem>
                    <SelectItem value="Chopper">Chopper</SelectItem>
                    <SelectItem value="Touring">Touring</SelectItem>
                    <SelectItem value="Enduro">Enduro</SelectItem>
                    <SelectItem value="Scooter">Scooter</SelectItem>
                    <SelectItem value="Cross">Cross</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Price */}
              <div className="space-y-2">
                <Label>Fiyat Aralığı (TL)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minPrice || ""}
                    onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxPrice || ""}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <Separator />

              {/* Year */}
              <div className="space-y-2">
                <Label>Yıl</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minYear || ""}
                    onChange={(e) => setFilters({...filters, minYear: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxYear || ""}
                    onChange={(e) => setFilters({...filters, maxYear: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <Separator />

               {/* KM */}
               <div className="space-y-2">
                <Label>KM</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minKm || ""}
                    onChange={(e) => setFilters({...filters, minKm: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxKm || ""}
                    onChange={(e) => setFilters({...filters, maxKm: Number(e.target.value)})}
                    className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <Separator />

              {/* City */}
              <div className="space-y-2">
                <Label>Şehir</Label>
                <Input 
                  placeholder="Şehir Ara..." 
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="bg-white dark:bg-slate-950 text-black dark:text-white border-gray-200 dark:border-slate-800"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setFilters({
                  brand: "all",
                  type: "all",
                  minPrice: 0,
                  maxPrice: 1000000,
                  minYear: 2000,
                  maxYear: new Date().getFullYear(),
                  minKm: 0,
                  maxKm: 100000,
                  city: "",
                })}
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-black dark:text-white">Motosikletler</h1>
            <p className="text-gray-500 dark:text-gray-400">Hayalinizdeki motosikleti bulun.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[400px] bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : motorcycles && motorcycles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {motorcycles.map((moto) => (
                <Link key={moto.id} href={`/motorcycles/${moto.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-gray-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                        {/* Image Slider / Thumbnail */}
                        <img 
                          src={JSON.parse(moto.images)[0] || "/placeholder-motorcycle.png"} 
                          alt={`${moto.brand} ${moto.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                         <Badge className="absolute top-3 right-3 bg-white/90 text-black shadow-sm hover:bg-white">
                            {moto.year}
                         </Badge>
                         {moto.heavyDamage && (
                           <Badge variant="destructive" className="absolute top-3 left-3">
                             Ağır Hasarlı
                           </Badge>
                         )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-[#17BA4C] uppercase tracking-wide">{moto.brand}</p>
                          <h3 className="font-bold text-lg text-black dark:text-gray-100 line-clamp-1">{moto.model}</h3>
                        </div>
                        <p className="text-xl font-black text-[#17BA4C]">
                          {formatPrice(moto.price)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-500 dark:text-gray-400 mt-4">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-4 h-4" />
                          <span>{moto.km.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bike className="w-4 h-4" />
                          <span>{moto.type}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(moto.listingDate!).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{moto.city}/{moto.district}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun motosiklet bulunmamaktadır.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
