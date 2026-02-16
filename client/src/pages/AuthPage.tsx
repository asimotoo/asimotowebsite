import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Register Schema
const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  username: z.string().email("Geçerli bir e-posta adresi giriniz"), // Using email as username
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

// Login Schema
const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı veya e-posta gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      username: "",
      password: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onRegister = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(
      { ...data, email: data.username }, // Send email as well if backend expects it
      {
        onSuccess: () => {
          toast({
            title: "Kayıt Başarılı",
            description: "Hesabınız oluşturuldu ve giriş yapıldı.",
          });
          setLocation("/");
        },
        onError: (error) => {
          toast({
            title: "Kayıt Hatası",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const onLogin = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
            title: "Giriş Başarılı",
            description: "Hoş geldiniz!",
          });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Giriş Hatası",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display font-bold">Hoş Geldiniz</CardTitle>
          <CardDescription>
            Devam etmek için giriş yapın veya kayıt olun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Kullanıcı Adı veya E-posta</Label>
                  <Input 
                    id="login-email" 
                    type="text" 
                    placeholder="Kullanıcı adı veya e-posta" 
                    className="text-black dark:text-black"
                    {...loginForm.register("username")} 
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Şifre</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    className="text-black dark:text-black"
                    {...loginForm.register("password")} 
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loginMutation.isPending}>
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Giriş Yap
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input id="firstName" className="text-black dark:text-black" {...registerForm.register("firstName")} />
                     {registerForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input id="lastName" className="text-black dark:text-black" {...registerForm.register("lastName")} />
                     {registerForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Telefon Numarası</Label>
                  <Input 
                    id="register-phone" 
                    type="tel" 
                    placeholder="0555 555 55 55"
                    className="text-black dark:text-black"
                    {...registerForm.register("phone")} 
                  />
                   {registerForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">E-posta Adresi</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="ornek@email.com" 
                    className="text-black dark:text-black"
                    {...registerForm.register("username")} 
                  />
                   {registerForm.formState.errors.username && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.username.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Şifre</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    className="text-black dark:text-black"
                    {...registerForm.register("password")} 
                  />
                   {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending}>
                  {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kayıt Ol
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
