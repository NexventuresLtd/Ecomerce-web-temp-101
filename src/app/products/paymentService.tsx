import mainAxios from "../../Instance/mainAxios";
import { unwrap } from "../../utils/decrypt";

export interface PaymentInitiateResponse {
  external_id: string;
  transaction_id: string | null;
  invoice_number: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  amount: number;
  delivery_type: "delivery" | "pickup";
  message: string;
  checkout_url?: string;
}

export interface PaymentStatusResponse {
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  external_id: string;
  invoice_number: string;
  amount: number;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  item_total: number;
  color: any[];
  delivery: string;
  images: any[];
}

export interface Order {
  id: number;
  external_id: string;
  transaction_id: string | null;
  invoice_number: string;
  payer_phone: string;
  total_amount: number;
  currency: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  delivery_type: "delivery" | "pickup";
  delivery_address: string | null;
  delivery_status: "PENDING_DELIVERY" | "DELIVERED" | "PICKED_UP";
  items: OrderItem[];
  items_count: number;
  created_at: string;
}

export interface AdminOrder extends Order {
  user_id: number;
  buyer_name: string;
  buyer_email: string;
}

export interface DeliveryItem extends AdminOrder {}

export interface OrdersSummary {
  total_spent?: number;
  total_orders: number;
  successful_orders: number;
  pending_orders: number;
  failed_orders?: number;
  total_revenue?: number;
}

export interface OrdersPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface MyOrdersResponse {
  orders: Order[];
  summary: OrdersSummary;
  pagination: OrdersPagination;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  summary: OrdersSummary;
  pagination: OrdersPagination;
}

export interface CheckoutResponse {
  external_id: string;
  invoice_number: string;
  checkout_url: string;
  amount: number;
  delivery_type: "delivery" | "pickup";
  message: string;
}

export interface InvoiceVerifyResponse {
  valid: boolean;
  invoice_number: string;
  external_id: string;
  transaction_id: string | null;
  buyer_name: string;
  buyer_email: string | null;
  payer_phone: string;
  total_amount: number;
  currency: string;
  status: string;
  delivery_type: string;
  delivery_address: string | null;
  delivery_status: string;
  items: OrderItem[];
  created_at: string;
}

export const paymentService = {
  async initiatePayment(
    payerPhone: string,
    deliveryType: "delivery" | "pickup" = "pickup",
    deliveryAddress = "",
  ): Promise<PaymentInitiateResponse> {
    const r = await mainAxios.post("/payment/initiate", null, {
      params: { payer_phone: payerPhone, delivery_type: deliveryType, delivery_address: deliveryAddress },
    });
    return unwrap(r.data);
  },

  async initiateCheckout(
    payerPhone: string,
    redirectUrl: string,
    deliveryType: "delivery" | "pickup" = "pickup",
    deliveryAddress = "",
  ): Promise<CheckoutResponse> {
    const r = await mainAxios.post("/payment/checkout", null, {
      params: { payer_phone: payerPhone, redirect_url: redirectUrl, delivery_type: deliveryType, delivery_address: deliveryAddress },
    });
    return unwrap(r.data);
  },

  async getPaymentStatus(externalId: string): Promise<PaymentStatusResponse> {
    const r = await mainAxios.get(`/payment/status/${externalId}`);
    return unwrap(r.data);
  },

  async getMyOrders(): Promise<MyOrdersResponse> {
    const r = await mainAxios.get("/payment/my-orders");
    return unwrap(r.data);
  },

  async getMyOrdersPaged(page = 1, limit = 6, status = "all"): Promise<MyOrdersResponse> {
    const r = await mainAxios.get("/payment/my-orders", { params: { page, limit, status } });
    return unwrap(r.data);
  },

  async getAllOrders(page = 1, limit = 10, status = "all"): Promise<AdminOrdersResponse> {
    const r = await mainAxios.get("/payment/admin/orders", { params: { page, limit, status } });
    return unwrap(r.data);
  },

  async getPendingDeliveries(deliveryStatus = "PENDING_DELIVERY"): Promise<{ deliveries: DeliveryItem[]; count: number }> {
    const r = await mainAxios.get("/payment/admin/deliveries", { params: { delivery_status: deliveryStatus } });
    return unwrap(r.data);
  },

  async updateDeliveryStatus(purchaseId: number, newStatus: "DELIVERED" | "PICKED_UP" | "PENDING_DELIVERY"): Promise<any> {
    const r = await mainAxios.put(`/payment/admin/orders/${purchaseId}/delivery`, null, {
      params: { new_status: newStatus },
    });
    return r.data;
  },

  async verifyInvoice(invoiceNumber: string): Promise<InvoiceVerifyResponse> {
    const r = await mainAxios.get(`/payment/invoice/${invoiceNumber}`);
    return unwrap(r.data);
  },

  async adminResendInvoice(purchaseId: number): Promise<{ ok: boolean; message: string }> {
    const r = await mainAxios.post(`/payment/admin/resend-invoice/${purchaseId}`);
    return r.data;
  },

  getInvoiceViewUrl(invoiceNumber: string): string {
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    return `${base}/payment/invoice-view/${encodeURIComponent(invoiceNumber)}`;
  },

  /** Open WhatsApp chat with the payer's phone, pre-filled with the invoice link. */
  sendInvoiceWhatsapp(
    payerPhone: string,
    payerName: string,
    invoiceNumber: string,
    totalAmount: number,
    currency = 'RWF',
  ): void {
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    const invoiceUrl = `${base}/payment/invoice-view/${encodeURIComponent(invoiceNumber)}`;

    // Normalise to international format
    const digits = payerPhone.replace(/\D/g, '');
    const international = digits.startsWith('250') ? digits
      : digits.startsWith('0') ? `250${digits.slice(1)}`
      : digits.startsWith('7') ? `250${digits}`
      : digits;

    const first = (payerName || 'Customer').split(' ')[0];
    const message =
      `Hello ${first}! 🎉\n\n` +
      `Your *Umukamezi* order has been confirmed.\n\n` +
      `📄 *Invoice:* ${invoiceNumber}\n` +
      `💰 *Amount:* ${currency} ${Number(totalAmount).toLocaleString()}\n\n` +
      `👉 View & print your invoice:\n${invoiceUrl}\n\n` +
      `━━━━━━━━━━━━\n` +
      `Umukamezi | umukamezi.com\n` +
      `📞 +250 781 691 713`;

    const url = `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
};
