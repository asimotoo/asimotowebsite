
import { blogPosts } from "@/data/blog-posts";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const popularPosts = blogPosts.slice(0, 3);
  const archivePosts = blogPosts.slice(3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-[rgb(23,186,76)] text-black dark:text-white">
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
          <h1 className="font-display text-4xl font-bold mt-4 mb-2 text-black dark:text-white">Motosiklet Blog Yazıları</h1>
          <p className="text-muted-foreground dark:text-gray-400 text-lg">Motosiklet dünyasından en güncel bilgiler, rehberler ve ipuçları.</p>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
            <span className="w-2 h-8 bg-[rgb(23,186,76)] rounded-full"></span>
            Popüler Makaleler
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="flex gap-4 items-start group cursor-pointer hover:bg-secondary/10 dark:hover:bg-slate-900/50 p-4 rounded-xl transition-colors">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img 
                      src={post.img} 
                      alt={post.title}
                      className="w-full h-full object-cover rounded-full border-2 border-[rgb(23,186,76)]"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-2 text-black dark:text-white group-hover:text-[rgb(23,186,76)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground dark:text-gray-500">{post.author}</span>
                    </div>
                    <span className="text-xs text-[rgb(23,186,76)] font-semibold flex items-center gap-1">
                      Devamını Oku <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Archive */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
            <span className="w-2 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
            Arşiv
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden bg-secondary/20">
                    <img 
                      src={post.img} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-[rgb(23,186,76)]">{post.date}</span>
                      <span className="text-xs text-muted-foreground dark:text-gray-500">{post.author}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-[rgb(23,186,76)] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-3 mb-4">{post.content}</p>
                    <div className="text-sm font-medium text-[rgb(23,186,76)] flex items-center gap-1 group/btn">
                      Devamını Gör 
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
