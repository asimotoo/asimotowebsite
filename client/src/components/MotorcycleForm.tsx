
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";

// Comprehensive list of motorcycle brands (sorted)
const brands = [
  "Aprilia", "Arora", "Bajaj", "Benelli", "BMW", "CF Moto", "Ducati", "GasGas", 
  "Harley-Davidson", "Hero", "Honda", "Husqvarna", "Indian", "Kanuni", "Kawasaki", 
  "KTM", "Kuba", "Mondial", "Moto Guzzi", "MV Agusta", "Peugeot", "Piaggio", "RKS", 
  "Royal Enfield", "Suzuki", "Triumph", "TVS", "Vespa", "Yamaha", "Yuki", "Universal"
].sort();

export const motorcycleFormSchema = z.object({
  brand: z.string().min(1, "Marka zorunludur"),
  model: z.string().min(1, "Model zorunludur"),
  price: z.coerce.number().min(0, "Geçerli bir fiyat giriniz"),
  city: z.string().min(1, "Şehir zorunludur"),
  district: z.string().min(1, "İlçe zorunludur"),
  neighborhood: z.string().min(1, "Mahalle zorunludur"),
  type: z.string().min(1, "Motosiklet tipi zorunludur"),
  year: z.coerce.number().min(1900, "Geçerli bir yıl giriniz"),
  km: z.coerce.number().min(0),
  engineVolume: z.string().min(1, "Motor hacmi zorunludur"),
  color: z.string().min(1, "Renk zorunludur"),
  heavyDamage: z.boolean().default(false),
  description: z.string().min(1, "Açıklama zorunludur"),
});

export type MotorcycleFormValues = z.infer<typeof motorcycleFormSchema>;

interface MotorcycleFormProps {
  defaultValues?: Partial<MotorcycleFormValues> & { images?: string[] };
  onSubmit: (data: MotorcycleFormValues, files: File[], existingImages: string[]) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function MotorcycleForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "İlanı Oluştur" }: MotorcycleFormProps) {
  const [openBrand, setOpenBrand] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Only for edit mode: keep track of existing images not deleted by user
  const [existingImages, setExistingImages] = useState<string[]>(defaultValues?.images || []);

  const form = useForm<MotorcycleFormValues>({
    resolver: zodResolver(motorcycleFormSchema),
    defaultValues: {
      brand: defaultValues?.brand || "",
      model: defaultValues?.model || "",
      price: defaultValues?.price ? defaultValues.price / 100 : 0, // Convert cents to TL if editing
      city: defaultValues?.city || "",
      district: defaultValues?.district || "",
      neighborhood: defaultValues?.neighborhood || "",
      type: defaultValues?.type || "",
      year: defaultValues?.year || undefined,
      km: defaultValues?.km || undefined,
      engineVolume: defaultValues?.engineVolume || "",
      color: defaultValues?.color || "",
      heavyDamage: defaultValues?.heavyDamage || false,
      description: defaultValues?.description || "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleSubmit = (data: MotorcycleFormValues) => {
    // Pass existing images so parent can handle "keep existing" logic
    onSubmit(data, selectedFiles, existingImages);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 flex flex-col">
          <Label>Marka</Label>
          <Popover open={openBrand} onOpenChange={setOpenBrand}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBrand}
                className={cn(
                  "w-full justify-between font-bold bg-white dark:bg-slate-900 text-black dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                  !form.watch("brand") && "text-slate-500 dark:text-gray-400"
                )}
              >
                {form.watch("brand")
                  ? brands.find((brand) => brand === form.watch("brand"))
                  : "Marka Seçin"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-black dark:text-white">
              <Command className="bg-white dark:bg-slate-900 text-black dark:text-white">
                <CommandInput placeholder="Marka ara..." className="text-black dark:text-white placeholder:text-slate-500 font-bold" />
                <CommandList>
                  <CommandEmpty className="py-6 text-center text-sm">Marka bulunamadı.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {brands.map((brand) => (
                      <CommandItem
                        key={brand}
                        value={brand}
                        className="font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 aria-selected:text-black dark:aria-selected:text-white"
                        onSelect={(currentValue) => {
                          const selectedBrand = brands.find(b => b.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                          form.setValue("brand", selectedBrand === form.watch("brand") ? "" : selectedBrand);
                          setOpenBrand(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.watch("brand") === brand ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {brand}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
           {form.formState.errors.brand && (
            <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-black dark:text-gray-200">Model</Label>
          <Input {...form.register("model")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
          {form.formState.errors.model && (
            <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-black dark:text-gray-200">Fiyat (TL)</Label>
          <Input type="number" {...form.register("price")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
           {form.formState.errors.price && (
            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-black dark:text-gray-200">Tip</Label>
          <Select onValueChange={(val) => form.setValue("type", val)} defaultValue={form.getValues("type")}>
             <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
               <SelectValue placeholder="Tip Seçin" />
             </SelectTrigger>
             <SelectContent>
               {["SuperSport", "Naked", "Chopper", "Touring", "Enduro", "Scooter", "Cross"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
               ))}
             </SelectContent>
          </Select>
           {form.formState.errors.type && (
            <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">Şehir</Label>
           <Input {...form.register("city")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
            {form.formState.errors.city && (
            <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
          )}
         </div>
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">İlçe</Label>
           <Input {...form.register("district")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
            {form.formState.errors.district && (
            <p className="text-sm text-destructive">{form.formState.errors.district.message}</p>
          )}
         </div>
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">Mahalle</Label>
           <Input {...form.register("neighborhood")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
            {form.formState.errors.neighborhood && (
            <p className="text-sm text-destructive">{form.formState.errors.neighborhood.message}</p>
          )}
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">Yıl</Label>
           <Input type="number" {...form.register("year")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
            {form.formState.errors.year && (
            <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>
          )}
         </div>
         <div className="space-y-2">
          <Label className="text-black dark:text-gray-200">KM</Label>
          <Input type="number" {...form.register("km")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
           {form.formState.errors.km && (
            <p className="text-sm text-destructive">{form.formState.errors.km.message}</p>
          )}
         </div>
         <div className="space-y-2">
          <Label className="text-black dark:text-gray-200">Motor Hacmi</Label>
          <Input placeholder="örn. 250 cc" {...form.register("engineVolume")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
           {form.formState.errors.engineVolume && (
            <p className="text-sm text-destructive">{form.formState.errors.engineVolume.message}</p>
          )}
         </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">Renk</Label>
           <Select onValueChange={(val) => form.setValue("color", val)} defaultValue={form.getValues("color")}>
             <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
               <SelectValue placeholder="Renk Seçin" />
             </SelectTrigger>
             <SelectContent>
               {["Beyaz", "Siyah", "Kırmızı", "Mavi", "Sarı", "Yeşil", "Gri", "Turuncu"].map(c => (
                   <SelectItem key={c} value={c}>{c}</SelectItem>
               ))}
             </SelectContent>
          </Select>
           {form.formState.errors.color && (
            <p className="text-sm text-destructive">{form.formState.errors.color.message}</p>
          )}
         </div>
         <div className="space-y-2">
           <Label className="text-black dark:text-gray-200">Ağır Hasar Kayıtlı Mı?</Label>
           <Select onValueChange={(val) => form.setValue("heavyDamage", val === "true")} defaultValue={form.getValues("heavyDamage").toString()}>
             <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
               <SelectValue placeholder="Seçiniz" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="false">Hayır</SelectItem>
               <SelectItem value="true">Evet</SelectItem>
             </SelectContent>
          </Select>
         </div>
      </div>

      <div className="space-y-2">
        <Label className="text-black dark:text-gray-200">İlan Açıklaması</Label>
        <Textarea {...form.register("description")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
         {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-black dark:text-gray-200">Görseller</Label>
        
        {/* Existing Images */}
        {existingImages.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto p-2">
                {existingImages.map((img, i) => (
                    <div key={i} className="relative group shrink-0">
                        <img src={img} alt={`Existing ${i}`} className="w-20 h-20 object-cover rounded-md border border-gray-200" />
                        <button type="button" onClick={() => removeExistingImage(img)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        )}

        <Input 
          type="file" 
          multiple
          accept="image/*" 
          onChange={handleFileSelect}
          className="bg-white dark:bg-slate-900 text-black dark:text-white"
        />
        {selectedFiles.length > 0 && (
           <div className="text-sm text-muted-foreground mt-2">
              {selectedFiles.length} yeni dosya seçildi
              <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                  {selectedFiles.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                        {f.name}
                        <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
                           <Trash2 className="w-3 h-3" /> 
                        </button>
                    </li>
                  ))}
              </ul>
           </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "İşleniyor..." : submitLabel}
      </Button>

    </form>
  );
}
