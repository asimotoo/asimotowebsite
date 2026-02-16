import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { title: "Hakkımızda", href: "/about" },
  { title: "Yasal Bilgilendirme", href: "/legal" },
  { title: "Kişisel Verilerin Korunması", href: "/legal" },
  { title: "Alışveriş Rehberi", href: "/legal" },
  { title: "Garanti ve İade", href: "/legal" },
  { title: "İletişim", href: "/contact" },
];

export default function About() {
  const [location] = useLocation();

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      {/* Page Title */}
      <h1 className="text-4xl font-display font-bold mb-8 text-[#0E1A2B] dark:text-white">
        Hakkımızda
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 sticky top-24">
            <nav className="flex flex-col space-y-1">
              {sidebarLinks.map((link) => (
                <Link key={link.title} href={link.href}>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                      location === link.href
                        ? "bg-gray-50 dark:bg-slate-800 text-[#0E1A2B] dark:text-white font-bold"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {link.title}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                Asi Moto, motosiklet tutkusunu sadece bir iş değil, bir yaşam biçimi olarak benimseyenler için kuruldu. Sektördeki 10 yılı aşkın tecrübemizle, motosiklet dünyasının her aşamasında; pistlerden atölyeye, yarışlardan satışa kadar her noktada bizzat yer almanın gururunu yaşıyoruz.
              </p>

              <div>
                <h3 className="text-xl font-bold text-[#0E1A2B] dark:text-white mb-3">Nereden Geliyoruz?</h3>
                <p className="leading-relaxed">
                  Bizim hikayemiz sadece yedek parça rafları arasında başlamadı. Geçmişte katıldığımız motocross yarışmaları, motosikletin sadece mekaniğini değil, sınırlarını ve ruhunu da anlamamızı sağladı. Bu yarış tecrübesi, bugün sattığımız her bir parçanın ve motosikletin kalitesini seçerken kullandığımız en büyük filtremizdir.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0E1A2B] dark:text-white mb-3">Neler Yapıyoruz?</h3>
                <p className="leading-relaxed">
                  Motosiklet yedek parça ve satışında Türkiye’nin güvenilir adresi olma hedefiyle, 81 ilin tamamına gerçekleştirdiğimiz binlerce gönderimle yollardaki her motosiklete dokunuyoruz. Aradığınız ister nadir bir yedek parça ister hayalinizdeki motosiklet olsun, Asi Moto olarak süreci şeffaf, hızlı ve tamamen çözüm odaklı yönetiyoruz.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0E1A2B] dark:text-white mb-3">Vizyonumuz ve Değerlerimiz</h3>
                <p className="leading-relaxed">
                  Motosiklet alışverişini karmaşık bir süreçten çıkarıp; şeffaf, güvenilir ve uzman desteğiyle yürütülen bir deneyime dönüştürüyoruz. Gelişim ve değişim odaklı yaklaşımımızla, teknolojik altyapımızı sürekli güncelliyor, kullanıcı güvenliğini her zaman ön planda tutuyoruz.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0E1A2B] dark:text-white mb-3">Neden Biz?</h3>
                <p className="leading-relaxed">
                  Ekibimiz, motosiklet dünyasına tutkuyla bağlı, teknik bilgi birikimi yüksek profesyonellerden oluşmaktadır. Sadece bir satıcı değil, motosiklet camiasının güçlü bir parçasıyız. Kullanıcılarımızın ihtiyaçlarını, bir "binici" gözüyle analiz ediyor ve onlara en doğru, en dayanıklı çözümleri sunuyoruz.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="font-medium text-[#0E1A2B] dark:text-white leading-relaxed">
                  Siz de tutkunuzu güvenle yollara taşımak ve doğru parçaya, doğru motosiklete ulaşmak istiyorsanız; doğru yerdesiniz. Asi Moto, tecrübesiyle her zaman yanınızda!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
