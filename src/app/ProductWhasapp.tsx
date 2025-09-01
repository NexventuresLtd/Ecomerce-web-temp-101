export const handleClickWhatsapp = (title: string, phone = "250781691713") => {
    const whatsappNumber = phone; // Replace with your WhatsApp number
    const message = `Hello, I'm interested in the product: ${title}. Could you provide more details?`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }