export const handleClickWhatsapp = (
  title?: string,
  phone: string = "250781691713",
  message?: string
) => {
  const whatsappNumber = phone;
  const finalMessage =
    message || `Hello, I'm interested in the product: ${title}. Could you provide more details?`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
  window.open(url, "_blank");
};
