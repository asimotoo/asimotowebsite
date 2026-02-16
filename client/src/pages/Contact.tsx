import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/routes";
import { useCreateMessage } from "@/hooks/use-messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const mutation = useCreateMessage();
  
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertMessage) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">İletişime Geçin</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya siparişlerinizle ilgili destek almak için bize ulaşın.
            Size en kısa sürede dönüş yapacağız.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="grid gap-6">
              <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Telefon</h3>
                  <p className="text-muted-foreground mb-1">Hafta içi 09:00 - 18:00</p>
                  <a href="tel:05534402914" className="block text-lg hover:text-primary font-medium">0553 440 2914</a>
                  <a href="tel:05526692332" className="block text-lg hover:text-primary font-medium">0552 669 2332</a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Adres</h3>
                  <p className="text-muted-foreground text-lg">
                    Mevlana Sokak No: 3/C Yeni Sanayi Sitesi, 71100 Yahşihan/Kırıkkale<br />
                    Kırıkkale, Türkiye
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-secondary/20 border border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">E-posta</h3>
                  <p className="text-muted-foreground mb-1">7/24 bize yazabilirsiniz</p>
                  <a href="mailto:info@asimoto.com" className="block text-lg hover:text-primary font-medium">asimoto0671@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-3xl bg-card border border-white/5 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Mesaj Gönder</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Soyad</FormLabel>
                        <FormControl>
                          <Input placeholder="Adınız Soyadınız" {...field} className="bg-secondary/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="0555 555 5555" {...field} className="bg-secondary/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta</FormLabel>
                      <FormControl>
                        <Input placeholder="ornek@email.com" {...field} className="bg-secondary/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesajınız</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bize iletmek istediğiniz mesaj..." 
                          className="min-h-[150px] bg-secondary/30" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
