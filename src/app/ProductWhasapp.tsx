export const handleClickWhatsapp = (
  title?: string,
  phone: string = "250781691713",
  message?: string
) => {
  const whatsappNumber = phone;
  whatsappNumber.replace(/\D/g, ''); // Remove non-digit characters
  const finalMessage =
    message || `Hello, I'm interested in the product: ${title}. Could you provide more details?`;

  const url = `https://wa.me/250781691713?text=${encodeURIComponent(finalMessage)}`;
  window.open(url, "_blank");
};
