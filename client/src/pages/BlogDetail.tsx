
import { useRoute, Link } from "wouter";
import { blogPosts } from "@/data/blog-posts";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const id = params?.id ? parseInt(params.id) : null;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog yazısı bulunamadı</h1>
        <Link href="/blog">
          <Button>Blog'a Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors duration-300 pt-8 pb-24">
      {/* Hero Image with Overlay */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <img 
          src={post.img} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-4 text-sm font-medium uppercase tracking-wider opacity-90">
                <span className="bg-[rgb(23,186,76)] px-3 py-1 rounded-full">Blog</span>
                <span>{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg">
                <User className="w-5 h-5 text-[rgb(23,186,76)]" />
                <span className="font-semibold">{post.author}</span>
                <span className="opacity-75 mx-2">•</span>
                <span className="opacity-75">{post.authorRole}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-card dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-border/50 dark:border-slate-800">
            {/* Premium Back Button */}
            <Link href="/blog">
              <button 
                className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-[rgb(23,186,76)] rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-110 mb-8 font-extrabold tracking-wide uppercase border border-gray-100 dark:border-slate-700"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                TÜM YAZILARA DÖN
              </button>
            </Link>

            {/* Content */}
            <article className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-[rgb(23,186,76)] max-w-none text-foreground dark:text-gray-200">
                <p className="lead text-xl text-muted-foreground dark:text-gray-400 font-medium mb-8">
                    {post.desc}
                </p>
                <div className="whitespace-pre-line text-foreground/90 dark:text-gray-300 leading-relaxed">
                    {post.content}
                </div>
            </article>

            {/* Share / Tags Footer */}
            <div className="mt-12 pt-8 border-t border-border dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground dark:text-gray-500" />
                    <span className="text-sm text-muted-foreground dark:text-gray-500">Motosiklet, Rehber, {post.id % 2 === 0 ? "Bakım" : "Ekipman"}</span>
                </div>
                {/* Could add share buttons here */}
            </div>
        </div>
      </div>
    </div>
  );
}
