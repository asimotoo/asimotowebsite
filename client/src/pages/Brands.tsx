import { useState } from "react";
import { Link } from "wouter";
import { MOTORCYCLE_DATA, Brand } from "@/lib/motorcycle-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Filter brands based on search
  const filteredBrands = MOTORCYCLE_DATA.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center relative">
          <h1 className="text-4xl font-black font-display text-[#0E1A2B] dark:text-white mb-4">Motosiklet Markaları</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Aradığınız yedek parçaya ulaşmak için motosikletinizin markasını seçin. Tüm marka ve modeller için geniş ürün yelpazesi.
          </p>
          <Link href="/products">
            <Button className="bg-[#17BA4C] hover:bg-[#14a041] text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Tüm Yedek Parçaları Gör
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <Input
            type="text"
            placeholder="Marka arayın (örn: Honda, Yamaha)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-[#17BA4C] dark:focus:border-[#17BA4C] focus:ring-[#17BA4C]/20 shadow-sm text-lg text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBrands.map((brand) => (
            <Dialog key={brand.name}>
              <DialogTrigger asChild>
                <div 
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 hover:border-[#17BA4C] dark:hover:border-[#17BA4C] transition-all cursor-pointer group flex flex-col items-center gap-4 text-center"
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500 group-hover:bg-[#17BA4C] group-hover:text-white transition-colors">
                    {brand.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#17BA4C] transition-colors">{brand.name}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded-full group-hover:bg-[#17BA4C]/10 group-hover:text-[#17BA4C]">
                    {brand.models.length} Model
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                  <DialogHeader>
                      <DialogTitle className="text-2xl font-black flex items-center gap-2 text-black dark:text-white">
                          <span className="text-[#17BA4C]">{brand.name}</span> Modelleri
                      </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {brand.models.map(model => (
                          <Link 
                            key={model} 
                            href={`/products?category=yedek-parca&brand=${brand.name}&model=${model}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:border-[#17BA4C] dark:hover:border-[#17BA4C] hover:bg-[#17BA4C]/5 dark:hover:bg-[#17BA4C]/10 transition-colors group"
                          >
                              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#17BA4C]">{model}</span>
                              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#17BA4C]" />
                          </Link>
                      ))}
                  </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredBrands.length === 0 && (
            <div className="text-center py-20">
                <p className="text-xl text-gray-400 dark:text-gray-500">Aradığınız kriterlere uygun marka bulunamadı.</p>
            </div>
        )}
      </div>
    </div>
  );
}
