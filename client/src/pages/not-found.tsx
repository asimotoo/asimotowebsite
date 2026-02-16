import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-md shadow-md border border-gray-200 dark:border-slate-800 text-center max-w-md mx-4">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-[#17BA4C]" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">404 Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </p>

          <Link href="/" className="inline-flex items-center justify-center rounded-md bg-[#17BA4C] px-6 py-2 text-sm font-medium text-white hover:bg-[#15a543] transition-colors w-full cursor-pointer">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
  );
}
