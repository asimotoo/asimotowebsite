import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Motorcycle } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Calendar, Gauge, Bike, MessageCircle, Phone, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
import { MotorcycleForm, type MotorcycleFormValues } from "@/components/MotorcycleForm";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function MotorcycleDetail() {
  const [, params] = useRoute("/motorcycles/:id");
  const id = params?.id ? parseInt(params.id) : undefined;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: moto, isLoading } = useQuery<Motorcycle>({
    queryKey: [`/api/motorcycles/${id}`],
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/motorcycles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Motosiklet ilanı silindi",
      });
      setLocation("/motorcycles");
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Silme işlemi sırasında bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ data, files, existingImages }: { data: MotorcycleFormValues, files: File[], existingImages: string[] }) => {
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
      
      // Send existing images list as JSON string
      formData.append("existingImages", JSON.stringify(existingImages));

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(`/api/motorcycles/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Güncelleme başarısız");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "İlan güncellendi",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/motorcycles/${id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Yükleniyor...</div>;
  }

  if (!moto) {
    return <div className="container mx-auto py-10 text-center">Motosiklet bulunamadı.</div>;
  }

  const images = JSON.parse(moto.images);
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-none bg-transparent">
            <Carousel className="w-full">
              <CarouselContent>
                {images.length > 0 ? (
                  images.map((img: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <img 
                          src={img} 
                          alt={`${moto.brand} ${moto.model} - ${index + 1}`} 
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <Bike className="w-20 h-20 text-gray-300" />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          </Card>

          {/* Details Tabs / Description */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Açıklama</h2>
              <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">
                {moto.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Info & Contact */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 space-y-6 sticky top-24">
            
            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 mb-4">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
                      <Pencil className="w-4 h-4" />
                      Düzenle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-black dark:text-white">
                    <DialogHeader>
                      <DialogTitle>İlanı Düzenle</DialogTitle>
                    </DialogHeader>
                    <MotorcycleForm 
                      defaultValues={{
                        ...moto,
                        heavyDamage: moto.heavyDamage || false,
                        images: JSON.parse(moto.images) as string[],
                      }}
                      onSubmit={(data, files, existingImages) => updateMutation.mutate({ data, files, existingImages })}
                      isSubmitting={updateMutation.isPending}
                      submitLabel="Güncelle"
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-slate-900 text-black dark:text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800">İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-black dark:text-white leading-tight">
                  {moto.brand} {moto.model}
                </h1>
              </div>
              <p className="text-3xl font-black text-[#17BA4C]">
                {formatPrice(moto.price)}
              </p>
              <div className="flex gap-2 mt-2">
                 <Badge variant="secondary" className="text-xs">{moto.year}</Badge>
                 <Badge variant="secondary" className="text-xs">{moto.type}</Badge>
                 {moto.heavyDamage && <Badge variant="destructive" className="text-xs">Ağır Hasarlı</Badge>}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500 dark:text-gray-400">Marka</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.brand}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Model</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.model}</div>

              <div className="text-gray-500 dark:text-gray-400">Yıl</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.year}</div>

              <div className="text-gray-500 dark:text-gray-400">KM</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.km.toLocaleString()}</div>

              <div className="text-gray-500 dark:text-gray-400">Motor Hacmi</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.engineVolume}</div>

              <div className="text-gray-500 dark:text-gray-400">Renk</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.color}</div>

              <div className="text-gray-500 dark:text-gray-400">Tarih</div>
              <div className="font-semibold text-right text-black dark:text-white">{new Date(moto.listingDate!).toLocaleDateString('tr-TR')}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Konum</div>
              <div className="font-semibold text-right text-black dark:text-white flex items-center justify-end gap-1">
                 <MapPin className="w-3 h-3" />
                 {moto.city} / {moto.district}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Mahalle</div>
              <div className="font-semibold text-right text-black dark:text-white">{moto.neighborhood}</div>
            </div>

            <Separator />
            
            <div className="space-y-3 pt-2">
               <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">İletişim & Pazarlık İçin</p>
                  <a href="https://wa.me/905526692332" target="_blank" rel="noopener noreferrer" className="text-xl font-black text-[#17BA4C] flex items-center justify-center gap-2 hover:underline">
                    <MessageCircle className="w-6 h-6" />
                    0552 669 23 32
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">WhatsApp Üzerinden Ulaşabilirsiniz</p>
               </div>

               <Button className="w-full h-12 text-lg font-bold bg-[#17BA4C] hover:bg-[#14a041] gap-2">
                 <Phone className="w-5 h-5" />
                 Hemen Ara
               </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
