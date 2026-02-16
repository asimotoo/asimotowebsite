
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Bike, MonitorCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/use-products";
import { ThreeScene } from "@/components/ThreeScene";
import { blogPosts } from "@/data/blog-posts";

export default function Home() {
  const { data: products, isLoading: productsLoading } = useProducts({ sort: "newest" });
  const { data: categories } = useCategories();
  const { scrollY, scrollYProgress } = useScroll();
  
  // Parallax effect for the text/background
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const rotate = useTransform(scrollY, [0, 500], [0, 10]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const features = [
    { 
      icon: ShieldCheck, 
      title: "Şeffaf ve Güvenli", 
      desc: "Platformumuz, hayalinizdeki motosikleti ararken içinizin rahat olması için açık ve adil bir teklif süreci sunmak üzere tasarlanmıştır." 
    },
    { 
      icon: Bike, 
      title: "Sadece Motosiklet", 
      desc: "Asi Moto olarak, sıradan bir araç alım-satım platformundan daha fazlasıyız; çünkü tamamen motosikletlere odaklanıyoruz." 
    },
    { 
      icon: MonitorCheck, 
      title: "Kolay & Zahmetsiz", 
      desc: "Motosiklet alım ve satım sürecini basitleştiriyoruz. İster ilk kez alıcı olun ister deneyimli bir satıcı, sitemizin kolay kullanımıyla sorunsuz bir deneyim sunuyoruz." 
    },
    { 
      icon: Truck, 
      title: "Motorun Kapında", 
      desc: "Motosikletinizin güvenli ve zamanında teslimatı için etkili bir çözüm sunuyoruz. Tüm lojistik süreci biz üstlenerek size kaygısız bir deneyim sağlıyoruz." 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 dark:opacity-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 dark:opacity-40" />

        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8 tracking-tighter text-black dark:text-white drop-shadow-sm">
                TÜRKİYE'NİN <br />
                <span className="text-black dark:text-white">
                  EN BÜYÜK
                </span> <br />
                YEDEK PARÇA BORSASI
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed mb-10 mx-auto md:mx-0 font-medium">
                Aradığınız tüm orijinal ve yan sanayi yedek parçalar, aksesuarlar ve ekipmanlar burada.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Link href="/products">
                <Button size="lg" style={{ backgroundColor: 'rgb(23, 186, 76)' }} className="h-16 px-12 text-xl font-black text-white shadow-xl rounded-full transition-all hover:scale-105 border-0 hover:bg-[rgb(20,160,65)]">
                  PARÇALARI KEŞFET
                </Button>
              </Link>
            </motion.div>

            <div className="flex gap-10 pt-10 border-t border-black/10 dark:border-white/10">
              <div>
                <div className="text-4xl font-black text-black dark:text-white">5K+</div>
                <div className="text-base font-bold text-black dark:text-gray-400 uppercase tracking-widest">Yedek Parça</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black dark:text-white">100%</div>
                <div className="text-base font-bold text-black dark:text-gray-400 uppercase tracking-widest">Memnuniyet</div>
              </div>
              <div>
                <div className="text-4xl font-black text-black dark:text-white">24/7</div>
                <div className="text-base font-bold text-black dark:text-gray-400 uppercase tracking-widest">Destek</div>
              </div>
            </div>
          </div>

          <motion.div 
            className="relative lg:h-[900px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
             <div className="w-full h-full lg:h-[650px] relative z-20 bg-transparent overflow-visible">
                <ThreeScene scrollProgress={scrollYProgress} />
             </div>
             {/* Decorative glow behind the 3D model */}
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10 dark:bg-primary/10" />
          </motion.div>
        </div>
      </section>

      {/* Why Asi Moto? Features */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4 text-black dark:text-white">Neden Asi Moto?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-transparent border-2 border-gray-900 dark:border-white flex items-center justify-center mb-6 group-hover:border-[rgb(23,186,76)] group-hover:text-[rgb(23,186,76)] transition-colors text-gray-900 dark:text-white">
                  <feature.icon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold mb-4 text-black dark:text-white">Güncel Yedek Parçalar</h2>
              <p className="text-muted-foreground dark:text-gray-400">En son eklenen orijinal yedek parçalar.</p>
            </div>
            <Link href="/new-arrivals">
              <Button variant="ghost" className="hidden sm:flex group text-black dark:text-white hover:text-primary dark:hover:text-primary">
                Tümünü Gör 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-[400px] bg-secondary/20 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/new-arrivals">
              <Button variant="outline" className="w-full">Tümünü Gör</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories / Discover */}
      <section className="py-24 bg-gradient-to-r from-secondary/20 to-transparent dark:from-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold mb-12 text-center text-black dark:text-white">Kategorileri Keşfet</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories?.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <div className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <h3 className="text-2xl font-display font-bold text-white tracking-wide text-center px-2 group-hover:scale-110 transition-transform">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            )) || (
              /* Fallback static categories if DB empty */
              <>
                {['Motor Bloğu', 'Fren Sistemi', 'Aydınlatma', 'Aksesuarlar'].map((cat, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer">
                     {/* motorcycle engine parts close up */}
                     <img 
                        src={`https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=500&h=500&fit=crop`} 
                        alt="Category"
                        className="w-full h-full object-cover"
                      />
                     <div className="absolute inset-0 bg-black/60 z-10" />
                     <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white">{cat}</h3>
                     </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Info/Blog Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-display text-4xl font-bold text-black dark:text-white">Motosiklet Blog Yazıları</h2>
            <Link href="/blog">
              <Button variant="ghost" className="hidden sm:flex group text-primary font-bold hover:text-[rgb(23,186,76)]">
                Tümünü Gör 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.slice(0, 4).map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-secondary/20">
                    <img 
                      src={post.img} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="text-sm text-[rgb(23,186,76)] font-bold mb-2">{post.date}</div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-[rgb(23,186,76)] transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-2">{post.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/blog">
              <Button variant="outline" className="w-full">Tümünü Gör</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
