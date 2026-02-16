import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "wouter";

export function Footer() {
  return (
    // Outer Container: Transparent wrapper
    <footer className="w-full pt-20 pb-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* Background with Fade Mask & Stone Texture */}
      <div className="absolute inset-x-0 top-0 bottom-0 w-full -z-10">
         <div 
            className="w-full h-full bg-gradient-to-br from-[#17BA4C] via-[#0b7d30] to-[#044d1c]"
            style={{ 
                maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
            }}
         >
             {/* Stone/Noise Texture Overlay */}
             <div 
               className="absolute inset-0 opacity-40 mix-blend-overlay" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                 filter: 'contrast(120%) brightness(120%)'
               }} 
             />
         </div>
      </div>
      
      {/* Main Card Container */}
      <div className="max-w-[1920px] mx-auto bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-slate-800 p-8 md:p-16 transition-colors duration-300">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Asi Moto" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                 <span className="font-display font-black text-xl leading-none text-black dark:text-white tracking-tighter">ASI MOTO</span>
                 <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Yedek Parça</span>
              </div>
            </Link>
            
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                <span className="font-bold">Telefon</span>
                <br />
                Hafta içi 09:00 - 18:00
                <br />
                0553 440 2914
                <br />
                0552 669 2332
                <br />
                <br />
                <span className="font-bold">Adres</span>
                <br />
                Mevlana Sokak No: 3/C Yeni Sanayi Sitesi, 71100 Yahşihan/Kırıkkale
                <br />
                Kırıkkale, Türkiye
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <a 
                href="https://www.instagram.com/asimotoyedekparca/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0E1A2B] dark:bg-white flex items-center justify-center text-white dark:text-[#0E1A2B] hover:bg-[#17BA4C] dark:hover:bg-[#17BA4C] dark:hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/905534402914"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0E1A2B] dark:bg-white flex items-center justify-center text-white dark:text-[#0E1A2B] hover:bg-[#17BA4C] dark:hover:bg-[#17BA4C] dark:hover:text-white transition-all duration-300 hover:scale-110"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Motosiklet Borsası */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-bold text-[#0E1A2B] dark:text-white">Asi Moto Store</h4>
            <ul className="space-y-3 text-sm">
              {['Hakkımızda', 'İletişim', 'Blog'].map((item) => (
                <li key={item}>
                  {item === 'İletişim' ? (
                    <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                      {item}
                    </Link>
                  ) : item === 'Hakkımızda' ? (
                    <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                      {item}
                    </Link>
                  ) : item === 'Blog' ? (
                    <Link href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                      {item}
                    </Link>
                  ) : (
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Yasal Bilgilendirme */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-bold text-[#0E1A2B] dark:text-white">Yasal Bilgilendirme</h4>
            <ul className="space-y-3 text-sm">
              {['Üyelik Sözleşmesi', 'Kullanım Koşulları', 'Kişisel Verilerin Korunması', 'Hesap Sözleşmesi'].map((item) => (
                <li key={item}>
                   <Link href="/legal" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Alışveriş Rehberi */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-bold text-[#0E1A2B] dark:text-white">Alışveriş Rehberi</h4>
            <ul className="space-y-3 text-sm">
              {['Nasıl Sipariş Verebilirim?', 'Ödeme Seçenekleri Nelerdir?', 'Kargo ve Teslimat Süreleri', 'Sipariş Takibi', 'Kapıda Ödeme Var mı?'].map((item) => (
                <li key={item}>
                   <Link href="/legal/shopping" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Garanti ve İade */}
          <div className="space-y-6">
            <h4 className="font-display text-lg font-bold text-[#0E1A2B] dark:text-white">Garanti ve İade</h4>
             <ul className="space-y-3 text-sm">
              {['İade ve Değişim Şartları', 'Garanti Kapsamı Nedir?', 'Parça Uyumluluğu Sorgulama', 'Hasarlı Kargo Bildirimi', 'Orijinal Parça Garantisi'].map((item) => (
                <li key={item}>
                   <Link href="/legal/warranty" className="text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
             <a href="#" className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-[#17BA4C] transition-colors underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4">AsiMotoStore.com</a>
             <p className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()}. Tüm hakları saklıdır.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
