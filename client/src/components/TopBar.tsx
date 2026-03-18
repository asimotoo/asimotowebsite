import { Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function TopBar() {
  return (
    <div className="bg-black/40 border-b border-white/5 backdrop-blur-sm text-xs md:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-muted-foreground">
        <div className="flex items-center gap-4 md:gap-6">
          <a href="tel:05534402914" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span>0553 440 2914</span>
          </a>
          <a href="https://wa.me/905526692332" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-500 transition-colors">
            <FaWhatsapp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            <span>0552 669 23 32</span>
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <span>Kırıkkale, Türkiye</span>
        </div>
      </div>
    </div>
  );
}
