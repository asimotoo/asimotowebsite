import { Link, useLocation } from "wouter";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { ModeToggle } from "@/components/mode-toggle";
import { FavoritesSheet } from "@/components/FavoritesSheet";

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/categories", label: "Kategoriler" },
    { href: "/new-arrivals", label: "Yeni Eklenenler" },
    { href: "/motorcycles", label: "Motosikletler" },
    { href: "/shipping-info", label: "Kargo Bilgisi" },
    { href: "/contact", label: "İletişim" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 shadow-sm flex flex-col transition-colors duration-300">
      {/* Top Row: Logo & Actions */}
      <div className="max-w-[1920px] mx-auto px-6 h-20 w-full flex items-center justify-between border-b border-gray-100">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 justify-start">
          <img 
            src={logo} 
            alt="Asi Moto" 
            className="h-12 w-auto object-contain hover:scale-105 transition-transform" 
          />
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0 justify-end">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="hidden sm:flex text-black hover:text-[#17BA4C] dark:text-white dark:hover:text-[#17BA4C]">
            <Search className="w-5 h-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex border-black/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-slate-800 font-semibold text-black dark:text-white gap-2">
                  <User className="w-4 h-4 text-[#17BA4C]" />
                  <span className="truncate max-w-[100px]">{user.firstName || user.username || 'Hesabım'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                <DropdownMenuLabel className="text-black dark:text-white">Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-slate-800 cursor-pointer">
                    <Link href="/admin" className="cursor-pointer w-full">
                      <div className="flex items-center gap-2 text-black dark:text-gray-200">
                         <span className="text-[#17BA4C]">⚡</span> Yönetim Paneli
                      </div>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-gray-100 dark:focus:bg-slate-800" onClick={() => logoutMutation.mutate()}>
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="outline" className="hidden sm:flex border-black/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-slate-800 font-semibold text-black dark:text-white">
                <User className="w-4 h-4 mr-2" />
                Giriş Yap
              </Button>
            </Link>
          )}
          
          <FavoritesSheet />

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-black hover:text-[#17BA4C] dark:text-white dark:hover:text-[#17BA4C] relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#17BA4C] text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden text-black">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="flex flex-col gap-2 mt-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-lg font-bold px-4 py-3 rounded-lg transition-colors ${
                      location === link.href ? "bg-[#17BA4C] text-white" : "text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Row: Navigation Menu */}
      <div className="w-full border-b border-gray-200 bg-gray-50/50 dark:bg-slate-900/50 dark:border-slate-800 hidden xl:block relative transition-colors duration-300">
        <nav className="max-w-[1920px] mx-auto px-6 flex items-center justify-center">
           <div className="flex items-center gap-2 py-2">
            {navLinks.map((link) => (
              link.label === "Kategoriler" ? (
                <div key={link.href} className="group static">
                  <button 
                    className={`text-[15px] font-bold uppercase tracking-wide px-6 py-3 rounded-md transition-all duration-300 flex items-center gap-1
                      ${location.startsWith("/products") || location === "/categories" ? "bg-[#17BA4C] text-white shadow-md" : "text-black dark:text-gray-200 hover:bg-[#17BA4C] hover:text-white group-hover:bg-[#17BA4C] group-hover:text-white"}`}
                  >
                    KATEGORİLER
                  </button>
                  
                  {/* Mega Menu Overlay */}
                  <div className="absolute left-0 top-full w-full bg-white dark:bg-slate-900 shadow-xl border-t border-gray-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] transform translate-y-2 group-hover:translate-y-0">
                    <div className="max-w-[1920px] mx-auto px-10 py-12">
                      <div className="grid grid-cols-3 gap-12">
                        {/* Cat 1: Yedek Parça */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="w-12 h-12 bg-[#17BA4C]/10 rounded-full flex items-center justify-center text-[#17BA4C]">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                             </div>
                             <h3 className="text-xl font-black text-black dark:text-white">Yedek Parça</h3>
                           </div>
                           <ul className="grid grid-cols-2 gap-2">
                             {["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "KTM", "Bajaj", "Ducati"].map(b => (
                               <li key={b}><Link href={`/products?category=yedek-parca&brand=${b}`} className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] font-semibold transition-colors block py-1">{b} Parçaları</Link></li>
                             ))}
                           </ul>
                           <Link href="/brands" className="inline-block mt-4 text-[#17BA4C] font-bold underline decoration-2 underline-offset-4">Tümünü Gör →</Link>
                        </div>

                        {/* Cat 2: Elektronik Ekipman */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="w-12 h-12 bg-[#17BA4C]/10 rounded-full flex items-center justify-center text-[#17BA4C]">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                             </div>
                             <h3 className="text-xl font-black text-black dark:text-white">Elektronik Ekipman</h3>
                           </div>
                           <ul className="space-y-2">
                             {["Aydınlatma Sistemleri", "Akü & Şarj", "Gösterge Panelleri", "GPS & Takip", "Kamera Sistemleri"].map(type => (
                               <li key={type}><Link href={`/products?category=elektronik-ekipman&q=${type}`} className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] font-semibold transition-colors block py-1">{type}</Link></li>
                             ))}
                           </ul>
                           <Link href="/products?category=elektronik-ekipman" className="inline-block mt-4 text-[#17BA4C] font-bold underline decoration-2 underline-offset-4">Tümünü Gör →</Link>
                        </div>

                        {/* Cat 3: Jant & Lastik */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="w-12 h-12 bg-[#17BA4C]/10 rounded-full flex items-center justify-center text-[#17BA4C]">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M2.05 10a10 10 0 0 1 .15-1"/></svg>
                             </div>
                             <h3 className="text-xl font-black text-black dark:text-white">Jant & Lastik</h3>
                           </div>
                           <ul className="space-y-2">
                             {["Michelin", "Pirelli", "Anlas", "Metzeler", "Bridgestone", "Jant Şeritleri"].map(brand => (
                               <li key={brand}><Link href={`/products?category=jant-lastik&q=${brand}`} className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] font-semibold transition-colors block py-1">{brand}</Link></li>
                             ))}
                           </ul>
                           <Link href="/products?category=jant-lastik" className="inline-block mt-4 text-[#17BA4C] font-bold underline decoration-2 underline-offset-4">Tümünü Gör →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-[15px] font-bold uppercase tracking-wide px-6 py-3 rounded-md transition-all duration-300 ${
                    location === link.href 
                      ? "bg-[#17BA4C] text-white shadow-md" 
                      : "text-black dark:text-gray-200 hover:bg-[#17BA4C] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
           </div>
        </nav>
      </div>
    </header>
  );
}