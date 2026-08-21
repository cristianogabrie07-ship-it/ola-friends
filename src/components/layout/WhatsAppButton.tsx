import { Phone } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "5511999999999"; // Default/Placeholder
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos da Martins Multimarcas.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      aria-label="Fale conosco no WhatsApp"
    >
      <Phone className="w-6 h-6" fill="currentColor" />
    </a>
  );
}
