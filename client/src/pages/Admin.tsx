import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { type Message } from "@shared/schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, Mail, Package, MessageSquare, ChevronsUpDown, Trash2, Bike } from "lucide-react";
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

// Comprehensive list of motorcycle brands
const brands = [
  "Aprilia", "Arora", "Bajaj", "Benelli", "BMW", "CF Moto", "Ducati", "GasGas", 
  "Harley-Davidson", "Hero", "Honda", "Husqvarna", "Indian", "Kanuni", "Kawasaki", 
  "KTM", "Kuba", "Mondial", "Moto Guzzi", "MV Agusta", "Peugeot", "Piaggio", "RKS", 
  "Royal Enfield", "Suzuki", "Triumph", "TVS", "Vespa", "Yamaha", "Yuki", "Universal"
].sort();

// Extend the schema for client-side form which includes file
export const productFormSchema = z.object({
  name: z.string().min(1, "Ürün adı zorunludur"),
  description: z.string().optional(),
  // Allow string input for price, parse as float
  price: z.coerce.number().min(0, "Geçerli bir fiyat giriniz"),
  stock: z.coerce.number().min(0),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().optional(),
  isFeatured: z.boolean().default(false),
});

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

export default function Admin() {
  const [_, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [openBrand, setOpenBrand] = useState(false);

  // Protect route
  if (!isLoading && (!user || user.role !== "admin")) {
    setLocation("/");
    return null;
  }

  // Fetch Messages
  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "", // Changed to string for input
      stock: 0,
      categoryId: "",
      brand: "",
      model: "",
      year: "", 
      isFeatured: false,
    },
  });

  const motoForm = useForm({
    resolver: zodResolver(motorcycleFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      price: "",
      city: "",
      district: "",
      neighborhood: "",
      type: "",
      year: "",
      km: "",
      engineVolume: "",
      color: "",
      heavyDamage: false,
      description: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      // Convert TL to Kuruş (x100)
      formData.append("price", Math.round(data.price * 100).toString());
      formData.append("stock", data.stock.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("brand", data.brand || "");
      formData.append("model", data.model || "");
      if (data.year) formData.append("year", data.year.toString());
      formData.append("isFeatured", data.isFeatured.toString());
      
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(api.products.create.path, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create product");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla oluşturuldu",
      });
      form.reset();
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createMotoMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("brand", data.brand);
      formData.append("model", data.model);
      formData.append("price", Math.round(data.price * 100).toString());
      formData.append("city", data.city);
      formData.append("district", data.district);
      formData.append("neighborhood", data.neighborhood);
      formData.append("type", data.type);
      formData.append("year", data.year.toString());
      formData.append("km", data.km.toString());
      formData.append("engineVolume", data.engineVolume);
      formData.append("color", data.color);
      formData.append("heavyDamage", data.heavyDamage.toString());
      formData.append("description", data.description);
      
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch("/api/motorcycles", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create motorcycle listing");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Motosiklet ilanı başarıyla oluşturuldu",
      });
      motoForm.reset();
      setSelectedFiles([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onMotoSubmit = (data: any) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Görsel Gerekli",
        description: "Lütfen en az bir görsel seçin",
        variant: "destructive",
      });
      return;
    }
    createMotoMutation.mutate(data);
  };

  const onSubmit = (data: any) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Görsel Gerekli",
        description: "Lütfen ürün için en az bir görsel seçin",
        variant: "destructive",
      });
      return;
    }
    createProductMutation.mutate(data);
  };

  // Fetch Products
  const { data: products } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-display font-bold mb-8 text-black dark:text-white">Admin Panel</h1>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-[800px] mb-8 bg-gray-100 dark:bg-slate-800">
          <TabsTrigger value="messages" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-black dark:data-[state=active]:text-white dark:text-gray-400">
            <MessageSquare className="w-4 h-4" />
            Mesajlar
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-black dark:data-[state=active]:text-white dark:text-gray-400">
             <Package className="w-4 h-4" />
             Ürün Ekle
          </TabsTrigger>
          <TabsTrigger value="motorcycles" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-black dark:data-[state=active]:text-white dark:text-gray-400">
             <Bike className="w-4 h-4" />
             Motosiklet Ekle
          </TabsTrigger>
          <TabsTrigger value="products-list" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-black dark:data-[state=active]:text-white dark:text-gray-400">
             <Package className="w-4 h-4" />
             Ürün Listesi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Gelen Kutusu</CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">Yükleniyor...</div>
              ) : messages && messages.length > 0 ? (
                <div className="rounded-md border border-gray-200 dark:border-slate-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-slate-800">
                        <TableHead className="text-gray-500 dark:text-gray-400">Tarih</TableHead>
                        <TableHead className="text-gray-500 dark:text-gray-400">İsim</TableHead>
                        <TableHead className="text-gray-500 dark:text-gray-400">E-posta</TableHead>
                        <TableHead className="text-gray-500 dark:text-gray-400">Telefon</TableHead>
                        <TableHead className="w-[40%] text-gray-500 dark:text-gray-400">Mesaj</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((msg) => (
                        <TableRow key={msg.id} className="border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <TableCell className="whitespace-nowrap font-medium text-muted-foreground dark:text-gray-400">
                            {msg.createdAt ? format(new Date(msg.createdAt), "dd MMM yyyy HH:mm") : "-"}
                          </TableCell>
                          <TableCell className="font-bold text-black dark:text-white">{msg.name}</TableCell>
                          <TableCell className="text-black dark:text-gray-300">{msg.email}</TableCell>
                          <TableCell className="text-black dark:text-gray-300">{msg.phone}</TableCell>
                          <TableCell className="text-sm text-black dark:text-gray-300">{msg.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground dark:text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Henüz hiç mesaj yok.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card className="max-w-2xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-black dark:text-white">Yeni Ürün Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                toast({
                  title: "Hata",
                  description: "Lütfen zorunlu alanları doldurunuz.",
                  variant: "destructive",
                });
                console.error("Form errors", errors);
              })} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black dark:text-gray-200">Ürün Adı</Label>
                  <Input id="name" {...form.register("name")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-black dark:text-gray-200">Açıklama</Label>
                  <Textarea id="description" {...form.register("description")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message as string}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-black dark:text-gray-200">Fiyat (TL)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="0.00" {...form.register("price")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-black dark:text-gray-200">Stok Adedi</Label>
                    <Input id="stock" type="number" {...form.register("stock")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-black dark:text-gray-200">Kategori</Label>
                    <Select onValueChange={(val) => form.setValue("categoryId", val)} defaultValue={form.getValues("categoryId")}>
                      <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white font-bold border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Kategori Seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-black dark:text-white">
                        <SelectItem value="1" className="font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">Yedek Parça</SelectItem>
                        <SelectItem value="2" className="font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">Elektronik Ekipman</SelectItem>
                        <SelectItem value="3" className="font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">Jant & Lastik</SelectItem>
                      </SelectContent>
                    </Select>
                     {form.formState.errors.categoryId && (
                      <p className="text-sm text-destructive">{form.formState.errors.categoryId.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="brand" className="text-black dark:text-gray-200">Marka</Label>
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
                                  className="font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 aria-selected:text-black dark:aria-selected:text-white data-[selected=true]:bg-slate-100 dark:data-[selected=true]:bg-slate-800 data-[selected=true]:text-black dark:data-[selected=true]:text-white"
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
                      <p className="text-sm text-destructive">{form.formState.errors.brand.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="model" className="text-black dark:text-gray-200">Model</Label>
                    <Input id="model" placeholder="örn. CBR 650R" {...form.register("model")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                     {form.formState.errors.model && (
                      <p className="text-sm text-destructive">{form.formState.errors.model.message as string}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="year" className="text-black dark:text-gray-200">Yıl (İsteğe Bağlı)</Label>
                    <Input id="year" type="number" placeholder="örn. 2023" {...form.register("year")} className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images" className="text-black dark:text-gray-200">Ürün Görselleri ve Videoları</Label>
                  <Input 
                    id="images" 
                    type="file" 
                    multiple
                    accept="image/*,video/*" 
                    onChange={handleFileSelect}
                    className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-black dark:text-white file:text-black dark:file:text-white file:bg-gray-100 dark:file:bg-slate-800"
                  />
                  <p className="text-sm text-muted-foreground">Birden fazla fotoğraf veya video seçebilirsiniz.</p>
                  {selectedFiles.length > 0 && (
                     <div className="text-sm font-medium mt-2">
                        {selectedFiles.length} dosya seçildi:
                        <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                          {selectedFiles.slice(0, 5).map((f, i) => (
                            <li key={i}>{f.name}</li>
                          ))}
                          {selectedFiles.length > 5 && <li>...ve {selectedFiles.length - 5} diğer</li>}
                        </ul>
                     </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending ? "Oluşturuluyor..." : "Ürünü Oluştur"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motorcycles">
          <Card className="max-w-2xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-black dark:text-white">Yeni Motosiklet Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={motoForm.handleSubmit(onMotoSubmit, (errors) => {
                toast({
                  title: "Hata",
                  description: "Lütfen zorunlu alanları doldurunuz.",
                  variant: "destructive",
                });
                console.error("Moto Form errors", errors);
              })} className="space-y-6">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">Marka</Label>
                    <Select onValueChange={(val) => motoForm.setValue("brand", val)}>
                       <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
                         <SelectValue placeholder="Marka Seçin" />
                       </SelectTrigger>
                       <SelectContent>
                         {brands.map((brand) => (
                           <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                         ))}
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">Model</Label>
                    <Input {...motoForm.register("model")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">Fiyat (TL)</Label>
                    <Input type="number" {...motoForm.register("price")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">Tip</Label>
                    <Select onValueChange={(val) => motoForm.setValue("type", val)}>
                       <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
                         <SelectValue placeholder="Tip Seçin" />
                       </SelectTrigger>
                       <SelectContent>
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
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">Şehir</Label>
                     <Input {...motoForm.register("city")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">İlçe</Label>
                     <Input {...motoForm.register("district")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">Mahalle</Label>
                     <Input {...motoForm.register("neighborhood")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">Yıl</Label>
                     <Input type="number" {...motoForm.register("year")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                   <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">KM</Label>
                    <Input type="number" {...motoForm.register("km")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                   <div className="space-y-2">
                    <Label className="text-black dark:text-gray-200">Motor Hacmi</Label>
                    <Input placeholder="örn. 250 cc" {...motoForm.register("engineVolume")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                   </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">Renk</Label>
                     <Select onValueChange={(val) => motoForm.setValue("color", val)}>
                       <SelectTrigger className="bg-white dark:bg-slate-900 text-black dark:text-white">
                         <SelectValue placeholder="Renk Seçin" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Beyaz">Beyaz</SelectItem>
                         <SelectItem value="Siyah">Siyah</SelectItem>
                         <SelectItem value="Kırmızı">Kırmızı</SelectItem>
                         <SelectItem value="Mavi">Mavi</SelectItem>
                         <SelectItem value="Sarı">Sarı</SelectItem>
                         <SelectItem value="Yeşil">Yeşil</SelectItem>
                         <SelectItem value="Gri">Gri</SelectItem>
                         <SelectItem value="Turuncu">Turuncu</SelectItem>
                       </SelectContent>
                    </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-black dark:text-gray-200">Ağır Hasar Kayıtlı Mı?</Label>
                     <Select onValueChange={(val) => motoForm.setValue("heavyDamage", val === "true")}>
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
                  <Textarea {...motoForm.register("description")} className="bg-white dark:bg-slate-900 text-black dark:text-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-black dark:text-gray-200">Görseller</Label>
                  <Input 
                    type="file" 
                    multiple
                    accept="image/*" 
                    onChange={handleFileSelect}
                    className="bg-white dark:bg-slate-900 text-black dark:text-white"
                  />
                  {selectedFiles.length > 0 && (
                     <div className="text-sm text-muted-foreground mt-2">
                        {selectedFiles.length} dosya seçildi
                     </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={createMotoMutation.isPending}>
                  {createMotoMutation.isPending ? "Oluşturuluyor..." : "İlanı Oluştur"}
                </Button>

              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products-list">
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Ürün Listesi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-200 dark:border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-slate-800">
                      <TableHead className="text-gray-500 dark:text-gray-400">Ürün Adı</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Marka</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Model</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Fiyat</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Stok</TableHead>
                      <TableHead className="text-right text-gray-500 dark:text-gray-400">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product) => (
                      <TableRow key={product.id} className="border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <TableCell className="font-medium text-black dark:text-white">{product.name}</TableCell>
                        <TableCell className="text-black dark:text-gray-300">{product.brand || "-"}</TableCell>
                        <TableCell className="text-black dark:text-gray-300">{product.model || "-"}</TableCell>
                        <TableCell className="text-black dark:text-gray-300">{(product.price / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</TableCell>
                        <TableCell className="text-black dark:text-gray-300">{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                                <Trash2 className="w-4 h-4" />
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
                                  onClick={() => deleteProductMutation.mutate(product.id)}
                                  className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
