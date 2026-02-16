import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sidebarLinks = [
  { title: "Hakkımızda", href: "/about" },
  { title: "Yasal Bilgilendirme", href: "/legal" },
  { title: "Kişisel Verilerin Korunması", href: "/legal" },
  { title: "Alışveriş Rehberi", href: "/legal/shopping" },
  { title: "Garanti ve İade", href: "/legal/warranty" },
  { title: "İletişim", href: "/contact" },
];

export default function Legal() {
  const [match, params] = useRoute("/legal/:section?");
  const section = params?.section || "legal";

  const getTitle = () => {
    switch (section) {
      case "shopping": return "Alışveriş Rehberi";
      case "warranty": return "Garanti ve İade";
      default: return "Yasal Bilgilendirme";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      {/* Page Title */}
      <h1 className="text-4xl font-display font-bold mb-8 text-[#0E1A2B] dark:text-white">
        {getTitle()}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800 sticky top-24">
            <nav className="flex flex-col space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = link.href === "/legal" 
                  ? section === "legal" 
                  : link.href === `/legal/${section}`;
                
                return (
                  <Link key={link.title} href={link.href}>
                    <div
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-gray-50 dark:bg-slate-800 text-[#0E1A2B] dark:text-white font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:bg-gray-50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      {link.title}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800">
            <Accordion type="single" collapsible className="w-full space-y-4">
              
              {section === "legal" && (
                <>
                  <AccordionItem value="item-1" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Üyelik Sözleşmesi
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">ASİ MOTO (İBRAHİM ÜNAL) ÜYELİK VE KULLANIM SÖZLEŞMESİ</h4>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">1. TARAFLAR</h4>
                          <p>
                            İşbu Üyelik Sözleşmesi ("Sözleşme"); bir tarafta Mevlana sokak no 3/c yeni sanayi sitesi, 71100 Yahşihan/Kırıkkale adresinde mukim İbrahim Ünal Şahıs Şirketi (bundan böyle "Asi Moto" olarak anılacaktır) ile diğer tarafta asimoto.com internet sitesine ("Site") üye olan internet kullanıcısı ("Üye") arasında, Üye'nin Site'ye üyelik kaydı oluşturması aşamasında elektronik ortamda akdedilmiştir.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">2. TANIMLAR</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Ürün:</strong> Site üzerinde satışa sunulan sıfır ve ikinci el motosikletleri, her türlü yedek parçayı, lastiği ve aksesuarları ifade eder.</li>
                            <li><strong>Doğrudan Satış:</strong> İhale veya açık artırma usulü olmaksızın, Asi Moto tarafından belirlenen fiyat üzerinden yapılan satış sistemidir.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">3. SÖZLEŞMENİN KONUSU VE KAPSAMI</h4>
                          <p>
                            İşbu Sözleşme'nin konusu, Asi Moto'nun 10 yılı aşkın sektörel tecrübesi ve motocross yarış geçmişinden süzülen uzmanlığı ile sunduğu ürünlerin Site üzerinden satışına dair usul ve esaslar ile tarafların karşılıklı hak ve yükümlülüklerinin belirlenmesidir.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">4. ÜYELİK VE GÜVENLİK YÜKÜMLÜLÜKLERİ</h4>
                          <div className="space-y-2">
                            <p><strong>4.1. Veri Doğruluğu:</strong> Üye, üyelik tesisi esnasında verdiği bilgilerin (ad, soyad, telefon, adres) gerçeğe uygun olduğunu, bu bilgilerin hatalı olması nedeniyle Asi Moto'nun uğrayacağı tüm zararları tazmin edeceğini beyan ve taahhüt eder.</p>
                            <p><strong>4.2. Hesap Güvenliği:</strong> Üye, kullanıcı adı ve şifresini üçüncü şahıslara açıklayamaz; hesabın kötüye kullanımından doğan hukuki ve cezai sorumluluk bizzat Üye'ye aittir.</p>
                            <p><strong>4.3. Teknik Uyumluluk:</strong> Satın alınan yedek parçaların veya lastiklerin Üye’nin motosikletine teknik uyumluluğunu kontrol etme yükümlülüğü Üye’ye aittir.</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">5. SATIŞ VE TESLİMAT KOŞULLARI (RİSKİN DEVRİ)</h4>
                          <div className="space-y-2">
                            <p><strong>5.1. Kargo Hizmeti:</strong> Asi Moto, Türkiye'nin 81 iline kargo gönderimi yapmaktadır.</p>
                            <p><strong>5.2. Muayene ve İhbar Yükümlülüğü:</strong> Üye, Ürün'ü kargo görevlisinden teslim alırken dış ambalajı kontrol etmekle yükümlüdür. Dış ambalajda hasar, delik veya ıslanma olması durumunda "Hasar Tespit Tutanağı" tutulmaksızın teslim alınan ürünlerde Asi Moto'nun hiçbir sorumluluğu bulunmamaktadır.</p>
                            <p><strong>5.3. Nakliye Riski:</strong> Ürün'ün kargo firmasına usulüne uygun tesliminden itibaren oluşabilecek gecikme ve hasarlardan Asi Moto sorumlu tutulamaz.</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">6. YEDEK PARÇA VE MONTAJ ÖZEL HÜKÜMLERİ</h4>
                          <div className="space-y-2">
                            <p><strong>6.1. Yetkili Servis Şartı:</strong> Tüm yedek parça ve lastiklerin montajı profesyonel ve yetkili servislerde yapılmalıdır.</p>
                            <p><strong>6.2. Sorumluluk Reddi:</strong> Yetkisiz kişilerce yapılan, teknik standartlara aykırı montaj işlemleri sonucu Ürün'de veya motorun genel aksamında meydana gelebilecek hasarlardan Asi Moto sorumlu değildir.</p>
                            <p><strong>6.3. İkinci El Ürünlerin Niteliği:</strong> İkinci el Ürünler, kullanım geçmişine bağlı aşınma payları ile birlikte "mevcut haliyle" (as-is) satılmaktadır. Bu ürünlerde garanti süresi, ürün açıklamasında aksi belirtilmedikçe bulunmamaktadır.</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">7. MOTOSİKLET SATIŞLARI VE RESMİ TESCİL</h4>
                          <div className="space-y-2">
                            <p><strong>7.1. Mülkiyetin Devri:</strong> Motosiklet satışlarında mülkiyetin geçişi ancak noter huzurunda yapılan resmi tescil ile tamamlanır.</p>
                            <p><strong>7.2. İade Kısıtlaması:</strong> Üye adına tescili yapılmış (plakası çıkarılmış) motosikletler, mevzuat gereği "ikinci el" statüsüne geçtiği için sebepsiz cayma hakkı kapsamında iade edilemez.</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">8. FİYATLANDIRMA VE STOK HATALARI</h4>
                          <p>
                            Sistem hatalarından kaynaklanan bariz fiyat yanlışlıklarında (piyasa değerinin %50 ve daha altında görünen fiyatlar vb.) Asi Moto, siparişi tek taraflı iptal etme ve tahsil edilen tutarı iade ederek akdi sona erdirme hakkına sahiptir.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">9. SORUMLULUĞUN SINIRLANDIRILMASI</h4>
                          <p>
                            Asi Moto, Site'nin kullanımı sırasında meydana gelebilecek teknik kesintiler, siber saldırılar veya veri tabanı arızaları nedeniyle oluşabilecek dolaylı zararlardan ve kâr mahrumiyetinden sorumlu tutulamaz.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">10. SÖZLEŞMENİN FESHİ</h4>
                          <p>
                            Üye'nin işbu Sözleşme hükümlerine aykırı davranması halinde Asi Moto, herhangi bir ihbara gerek olmaksızın üyeliği askıya alma veya feshetme hakkına sahiptir.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">11. DELİL SÖZLEŞMESİ VE YETKİLİ MAHKEME</h4>
                          <div className="space-y-2">
                            <p><strong>11.1. Delil:</strong> Taraflar, uyuşmazlıklarda Asi Moto’nun elektronik kayıtlarının HMK 193. madde uyarınca kesin delil teşkil edeceğini kabul ederler.</p>
                            <p><strong>11.2. Yetki:</strong> İşbu Sözleşme'den doğan ihtilaflarda Kırıkkale (Yahşihan) Mahkemeleri ve İcra Daireleri münhasır yetkilidir.</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      İletişim Formu ve Aydınlatma Metni
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">ASİ MOTO (İBRAHİM ÜNAL) İLETİŞİM FORMU AYDINLATMA METNİ</h4>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">1. Veri Sorumlusu</h4>
                          <p>
                            6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, Mevlana sokak no 3/c yeni sanayi sitesi, Yahşihan/Kırıkkale adresinde mukim İbrahim Ünal Şahıs Şirketi (“Asi Moto”) olarak, kişisel verilerinizin güvenliğine ve gizliliğine azami önem veriyoruz. İşbu metin ile iletişim formumuzu doldurmanız suretiyle işlenen verileriniz hakkında sizi bilgilendirmeyi amaçlıyoruz.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">2. İşlenen Kişisel Verileriniz, Amaçlar ve Hukuki Sebepler</h4>
                          <p className="mb-4">
                            Aşağıdaki tabloda, iletişim formumuz aracılığıyla toplanan verilerinizin hangi amaçlarla ve hangi yasal dayanakla işlendiği belirtilmektedir:
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                              <thead className="bg-gray-100 dark:bg-slate-800 text-[#0E1A2B] dark:text-white">
                                <tr>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">İşlenen Kişisel Veriler</th>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">Veri İşleme Amaçları</th>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">Veri İşlemenin Hukuki Sebebi</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">Kimlik Bilgileri: Ad, Soyadı</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Mesaj, talep ve önerilerinizin takibi, sonuçlandırılması ve sorularınızın cevaplanması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2 (f): İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması.</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">İletişim Bilgileri: E-posta adresi, Telefon numarası</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Talebiniz doğrultusunda sizinle iletişime geçilmesi ve bilgilendirme yapılması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2 (f): Veri sorumlusunun meşru menfaatleri.</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">İşlem Güvenliği: IP adresi, log kayıtları</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Bilgi güvenliği süreçlerinin yürütülmesi ve sitemizin güvenliğinin sağlanması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2 (ç): Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">Talep İçeriği: Mesaj içeriği, şikayet veya öneri detayları</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Müşteri memnuniyetine yönelik aktivitelerin yürütülmesi ve hizmet kalitemizin artırılması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2 (e): Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">3. Kişisel Verilerin Aktarıldığı Taraflar</h4>
                          <p>Kişisel verileriniz, Kanun'un aktarım kurallarına uygun olarak yalnızca aşağıdaki taraflarla paylaşılabilir:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Yetkili Kurum ve Kuruluşlar:</strong> Yasal bir yükümlülük nedeniyle resmi bir talep gelmesi durumunda adli veya idari makamlar ile paylaşılabilir.</li>
                            <li><strong>Hizmet Tedarikçileri:</strong> Sitemizin teknik altyapısını sağlayan ve veri depolama hizmeti sunan bulut tabanlı sistemler (verilerin korunması kaydıyla) ile sınırlı olarak paylaşılabilir.</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">4. Veri Toplama Yöntemi</h4>
                          <p>
                            Kişisel verileriniz, asimoto.com internet sitemizdeki iletişim formunun sizin tarafınızdan doldurulması ve "Gönder" butonuna basılması suretiyle tamamen elektronik ortamda toplanmaktadır.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">5. Veri Sahibi Olarak Haklarınız</h4>
                          <p>
                            Kanun’un 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, silinmesini isteme veya eksik verilerin düzeltilmesini talep etme haklarınız saklıdır. Bu haklarınızı kullanmak için:
                          </p>
                          <ul className="list-none space-y-2 mt-2">
                            <li><strong>E-posta:</strong> Sistemimizde kayıtlı e-postanız üzerinden <a href="mailto:asimoto0671@gmail.com" className="text-[#17BA4C] hover:underline">asimoto0671@gmail.com</a> adresine mesaj gönderebilirsiniz.</li>
                            <li><strong>Posta:</strong> Mevlana sokak no 3/c yeni sanayi sitesi, 71100 Yahşihan/Kırıkkale adresine yazılı dilekçe ile başvurabilirsiniz.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Kullanım Koşulları
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">ASİ MOTO (İBRAHİM ÜNAL) İNTERNET SİTESİ KULLANIM KOŞULLARI</h4>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">A. GİRİŞ</h4>
                          <p>
                            İşbu Kullanım Koşulları, asimoto.com internet sitesinin (“İnternet Sitesi”) kullanımına ilişkin kuralları belirlemekte ve Tarafların hak ve yükümlülüklerini düzenlemektedir. İnternet Sitesi’ne erişim sağlayan her kullanıcı, işbu koşulları peşinen kabul etmiş sayılır.
                          </p>
                          <p className="mt-2">
                            İnternet Sitesi işleteni ve veri sorumlusu; Mevlana sokak no 3/c yeni sanayi sitesi, 71100 Yahşihan/Kırıkkale adresinde mukim İbrahim Ünal Şahıs Şirketi’dir (Bundan böyle “Asi Moto” olarak anılacaktır).
                          </p>
                          <p className="mt-2">
                            Asi Moto, dilediği zaman bildirimde bulunmaksızın işbu Kullanım Koşulları’nı değiştirebilir. Değişiklikler sitede yayınlandığı an yürürlüğe girer.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">B. GENEL ŞARTLAR VE SORUMLULUK SINIRI</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Teknik Kesintiler:</strong> Asi Moto, kullanıcının cihaz veya internet bağlantısından kaynaklı erişim sorunlarından, sistemsel yavaşlıklardan veya geçici kesintilerinden sorumlu değildir.</li>
                            <li><strong>İçerik Değişikliği:</strong> Asi Moto, önceden bildirimde bulunmaksızın ürün fiyatlarını, stok bilgilerini, teknik açıklamaları ve diğer içerikleri değiştirme veya kaldırma hakkını saklı tutar.</li>
                            <li><strong>Zarar Muafiyeti:</strong> İnternet Sitesi’nin kullanılmasından veya hatalı kullanımından kaynaklanan kâr kaybı, veri kaybı veya dolaylı zararlardan Asi Moto hiçbir şekilde sorumlu tutulamaz.</li>
                            <li><strong>Üçüncü Taraf Bağlantıları:</strong> Sitede yer alan dış bağlantıların (link) içeriğinden ve güvenliğinden Asi Moto sorumlu değildir; bu bağlantıların kullanımı kullanıcının kendi riskindedir.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">C. KULLANIM KOŞULLARI VE YASAKLI EYLEMLER</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Dürüstlük İlkesi:</strong> Kullanıcı, Site üzerinden gerçekleştirdiği tüm işlemlerde kanuna, ahlaka, adaba ve dürüstlük ilkelerine uygun davranacağını kabul eder.</li>
                            <li><strong>Veri Girişi:</strong> Bilgi girişi yapılırken başkalarına ait kişisel verilerin izinsiz kullanılması, müstehcen veya yasa dışı içerik paylaşılması kesinlikle yasaktır.</li>
                            <li><strong>Müdahale Yasağı:</strong> Site’nin işleyişini engelleyecek robot, warm veya otomatik mekanizmalarla erişim sağlamak, kaynak kodlarını kopyalamak veya tersine mühendislik yapmak yasaktır.</li>
                            <li><strong>Sorumluluk Reddi:</strong> Asi Moto, Site’de yayınlanmış olsa dahi, kullanıcılar tarafından sağlanan görsellerin veya yorumların mutlak doğruluğunu kontrol etmekle yükümlü değildir.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">D. FİKRİ MÜLKİYET HAKLARI</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Mülkiyet:</strong> İnternet Sitesi’nde yer alan unvan, marka, logo, ürün fotoğrafları, tasarım, metinler ve 10 yıllık tecrübe ile oluşturulmuş teknik bilgiler İbrahim Ünal Şahıs Şirketi’ne (Asi Moto) aittir ve uluslararası hukuk nezdinde koruma altındadır.</li>
                            <li><strong>Kopyalama Yasağı:</strong> Sitede yer alan bilgiler, Asi Moto’nun yazılı izni olmaksızın kısmen veya tamamen çoğaltılamaz, kopyalanamaz veya başka bir mecrada yayınlanamaz.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">E. KİŞİSEL VERİLERİN KORUNMASI</h4>
                          <p>
                            İnternet Sitesi üzerinden alınan talepler ve üyelik işlemleri sırasında kişisel verileriniz işlenmektedir. Kişisel verilerinizin işlenmesine ilişkin detaylı bilgilere sitemizde yer alan Aydınlatma Metni üzerinden ulaşabilirsiniz.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">F. ÇEŞİTLİ HÜKÜMLER</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Yetkili Mahkeme:</strong> İşbu Kullanım Koşulları’ndan doğabilecek her türlü uyuşmazlığın çözümünde Kırıkkale (Yahşihan) Mahkemeleri ve İcra Daireleri münhasır yetkilidir.</li>
                            <li><strong>Tebligat:</strong> Kullanıcı ile yapılacak tüm yazışmalar, Üye'nin bildirdiği e-posta adresi üzerinden gerçekleştirilecektir.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Hesap Sözleşmesi
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">ASİ MOTO (İBRAHİM ÜNAL) ÜYE VE MÜŞTERİ AYDINLATMA METNİ</h4>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">1. Veri Sorumlusu</h4>
                          <p>
                            Asi Moto (İbrahim Ünal Şahıs Şirketi) (“Asi Moto”) olarak, kişisel verilerinizin gizliliğini korumaya ve güvende tutmaya büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, veri sorumlusu olarak hareket ederken asimoto.com üzerinden gerçekleştirdiğiniz üyelik ve alışveriş süreçleri kapsamında işlenen kişisel verilerinize ilişkin sizleri aydınlatmayı amaçlıyoruz.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">2. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepler</h4>
                          <p className="mb-4">
                            Kişisel verileriniz, Kanun’un 5. maddesinde belirtilen şartlar dahilinde aşağıdaki amaçlar ve hukuki sebeplerle işlenebilecektir:
                          </p>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                              <thead className="bg-gray-100 dark:bg-slate-800 text-[#0E1A2B] dark:text-white">
                                <tr>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">İşlenen Kişisel Veriler</th>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">Veri İşleme Amaçları</th>
                                  <th className="p-3 border border-gray-200 dark:border-slate-700">Veri İşlemenin Hukuki Sebebi</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">Kimlik ve İletişim Bilgileri: Ad, Soyadı, Tel No, E-posta adresi</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Reklam, kampanya, indirim ve motocross tecrübemize dayalı teknik bilgilendirmelerin ticari ileti olarak gönderilmesi.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/1: İlgili kişinin açık rızasının bulunması.</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">İşlem Güvenliği Bilgileri: IP adresi, log kayıtları, erişim detayları</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Elektronik ortamda alınan onayların yetkili kurumlara bildirilmesi ve hukuki uyuşmazlıklarda delil olarak sunulması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2(ç) ve (e): Hukuki yükümlülük ve bir hakkın tesisi.</td>
                                </tr>
                                <tr className="border-b border-gray-100 dark:border-slate-800">
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">Finans ve Araç Bilgileri: IBAN, Kredi Kartı bilgileri, Motosiklet marka/model, şasi, motor no, km ve ruhsat detayları</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Üyelik oluşturulması, yedek parça ve motosiklet alım-satım sözleşmelerinin ifası, ödeme süreçlerinin yönetilmesi ve kargo takibi.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2(c): Bir sözleşmenin kurulması veya ifası için zorunlu olması.</td>
                                </tr>
                                <tr>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700 font-medium">Müşteri Deneyimi Verileri: Şikayet, talep, öneri içeriği ve usta yorumları</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">10 yıllık tecrübemiz ışığında hizmet kalitemizin artırılması, üye ilişkilerinin yönetimi ve şikayetlerin sonuçlandırılması.</td>
                                  <td className="p-3 border border-gray-200 dark:border-slate-700">Kanun md. 5/2(f): Veri sorumlusunun meşru menfaatleri.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">3. Kişisel Verilerin Paylaşıldığı Üçüncü Kişiler ve Amaçları</h4>
                          <p>Kişisel verileriniz, Kanun'un aktarım kurallarına uygun olarak aşağıdaki taraflarla paylaşılabilir:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Yetkili Kurum ve Kuruluşlar:</strong> Noterlikler (araç devir işlemleri için), vergi daireleri ve adli makamlar.</li>
                            <li><strong>İş Ortakları:</strong> Kargo ve lojistik firmaları (81 ile gönderim kapsamında), ödeme kuruluşları ve teknik altyapı sağlayıcıları.</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">4. Kişisel Veri Toplama Yöntemleri</h4>
                          <p>
                            Kişisel verileriniz, asimoto.com sitesindeki Üye Ol Formu, İletişim Formu ve alışveriş sepeti süreçlerinde elektronik ortamda doldurduğunuz bilgiler vasıtasıyla otomatik ve kısmen otomatik yöntemlerle toplanmaktadır.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">5. Kişisel Verilerinize İlişkin Haklarınız</h4>
                          <p>
                            Kanun’un 11. maddesi uyarınca haklarınızı kullanmak üzere bizimle iletişime geçebilirsiniz:
                          </p>
                          <ul className="list-none space-y-2 mt-2">
                            <li><strong>E-posta yoluyla:</strong> <a href="mailto:asimoto0671@gmail.com" className="text-[#17BA4C] hover:underline">asimoto0671@gmail.com</a>.</li>
                            <li><strong>Posta yoluyla:</strong> Mevlana sokak no 3/c yeni sanayi sitesi, 71100 Yahşihan/Kırıkkale.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Ticari Elektronik İleti Açık Rıza Metni
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-[#0E1A2B] dark:text-white mb-2">ASİ MOTO (İBRAHİM ÜNAL) TİCARİ ELEKTRONİK İLETİ AÇIK RIZA METNİ</h4>
                          <p>
                            Asi Moto (İbrahim Ünal Şahıs Şirketi) (“Asi Moto”) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) kapsamında kişisel verilerinizi veri sorumlusu olarak işliyoruz.
                          </p>
                        </div>

                        <div>
                          <p>
                            Açık rızanız bulunması halinde; tarafınıza ticari elektronik ileti gönderilmesi kapsamında kimlik (ad, soyadı) ve iletişim (e-posta adresi, telefon numarası) bilgileriniz; Asi Moto tarafından sunulan sıfır/ikinci el motosiklet, yedek parça, lastik ve aksesuar ürünlerine ilişkin reklam, kampanya, indirim, teknik bilgilendirme ve fırsatların tarafınıza iletilmesi amacıyla işlenmektedir.
                          </p>
                        </div>

                        <div>
                          <p>
                            Kişisel verileriniz, Kanun’daki kurallara uygun olarak; yukarıda belirtilen tanıtım faaliyetlerinin yürütülmesi amacıyla hizmet aldığımız altyapı sağlayıcıları, kargo/lojistik firmaları (81 ile gönderim süreçleri kapsamında) ve yasal yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşları ile paylaşılabilmektedir.
                          </p>
                        </div>

                        <div>
                          <p>
                            Ticari elektronik ileti gönderimleri için verdiğiniz bu rızayı, dilediğiniz zaman herhangi bir gerekçe göstermeksizin reddetme hakkına sahipsiniz. İletişim tercihlerinizi değiştirmek veya rızanızı geri almak için <a href="mailto:asimoto0671@gmail.com" className="text-[#17BA4C] hover:underline">asimoto0671@gmail.com</a> adresine mail atabilir veya size ulaşan iletilerdeki "Red" seçeneğini kullanabilirsiniz.
                          </p>
                        </div>

                        <div>
                          <p>
                            Kişisel verilerinizin işlenmesi hakkında daha detaylı bilgi almak için Üye ve Müşteri Aydınlatma Metni’ne [buradan] ulaşabilirsiniz.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}

              {section === "shopping" && (
                <>
                  <AccordionItem value="shopping-0" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Nasıl Sipariş Verebilirim?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <div className="space-y-4">
                        <p>
                          <strong className="text-[#0E1A2B] dark:text-white">Ürününüzü Seçin:</strong> Sitemizdeki kategorileri inceleyerek ihtiyacınız olan yedek parçayı veya motosikleti belirleyin. 10 yılı aşkın tecrübemizle sunduğumuz sıfır ve ikinci el ürünlerin detaylarını ve fotoğraflarını inceleyebilirsiniz.
                        </p>
                        <p>
                          <strong className="text-[#0E1A2B] dark:text-white">Bizimle İletişime Geçin:</strong> Beğendiğiniz ürünün stok durumunu teyit etmek ve teknik detaylar hakkında (uyumluluk, kondisyon vb.) bilgi almak için web sitemizde yer alan telefon numaralarımızı arayın veya doğrudan WhatsApp hattımız üzerinden mesaj atın.
                        </p>
                        <p>
                          <strong className="text-[#0E1A2B] dark:text-white">Uzman Desteği Alın:</strong> Ekibimiz, motocross yarış geçmişinden gelen teknik bilgi birikimiyle, seçtiğiniz parçanın motorunuza uygunluğunu sizinle birlikte kontrol eder; böylece hatalı sipariş riskini en aza indiririz.
                        </p>
                        <p>
                          <strong className="text-[#0E1A2B] dark:text-white">Siparişi Onaylayın ve Ödeme Yapın:</strong> Ürün üzerinde mutabık kalındığında, size iletilen ödeme bilgilerini (Havale/EFT) kullanarak siparişinizi kesinleştirin.
                        </p>
                        <p>
                          <strong className="text-[#0E1A2B] dark:text-white">Hızlı Kargo:</strong> Ödemesi onaylanan siparişleriniz, Yahşihan/Kırıkkale’deki merkezimizden Türkiye’nin 81 iline gönderilmek üzere özenle paketlenir ve en kısa sürede kargoya teslim edilir.
                        </p>
                        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                          <p className="text-sm italic">
                            <strong className="text-[#0E1A2B] dark:text-white not-italic">Not:</strong> Yakın zamanda tüm satın alma sürecini doğrudan web sitemiz üzerinden tamamlayabileceğiniz "Sepete Ekle" ve "Online Ödeme" sistemimiz aktif olacaktır. O zamana kadar size bir telefon uzağındayız!
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shopping-1" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Ödeme Seçenekleri Nelerdir?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <p>
                        Ödemelerinizi <strong>Havale/EFT</strong> yoluyla banka hesaplarımıza yapabilir veya mağazamızda <strong>yüz yüze nakit</strong> olarak gerçekleştirebilirsiniz.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shopping-2" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Kargo ve Teslimat Süreleri
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <p>
                        Anlaşmalı olduğumuz <strong>DHL</strong> ve <strong>Sürat Kargo</strong> firmaları ile gönderim sağlamaktayız. Teslimat süreleri, bulunduğunuz şehre bağlı olarak genellikle <strong>3 ila 7 gün</strong> arasında değişiklik göstermektedir.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shopping-3" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Sipariş Takibi
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <p>
                        Siparişiniz kargoya verildiğinde size iletilen takip numarası ile ilgili kargo firmasının web sitesi üzerinden kargonuzun durumunu anlık olarak sorgulayabilirsiniz.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shopping-4" className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                    <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                      Kapıda Ödeme Var mı?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                      <p>
                        Evet, kapıda ödeme seçeneğimiz mevcuttur. Bu hizmeti tercih etmeniz durumunda, kargo firması tarafından <strong>300 TL</strong> tutarında bir hizmet bedeli yansıtılmaktadır.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </>
              )}

              {section === "warranty" && (
                <>
                  {[
                    "İade ve Değişim Şartları",
                    "Garanti Kapsamı Nedir?",
                    "Parça Uyumluluğu Sorgulama",
                    "Hasarlı Kargo Bildirimi",
                    "Orijinal Parça Garantisi"
                  ].map((item, index) => (
                    <AccordionItem key={index} value={`warranty-${index}`} className="border border-gray-100 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:bg-gray-50/50 dark:data-[state=open]:bg-slate-800/50">
                      <AccordionTrigger className="text-lg font-bold text-[#0E1A2B] dark:text-white hover:text-[#17BA4C] dark:hover:text-[#17BA4C] hover:no-underline py-6">
                        {item}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-6 text-base">
                        <p>Bu başlık hakkında detaylı bilgi yakında eklenecektir. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </>
              )}

            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
