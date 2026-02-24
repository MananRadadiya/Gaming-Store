import { formatPrice } from './helpers';

// ─── Invoice number generator ───────────────────────────────────────
// Produces: NX-2026-00021  (year + zero-padded sequence)
export const generateInvoiceNumber = (orderId) => {
  const year = new Date().getFullYear();
  // Extract numeric sequence from order IDs like "ORD-2026-021"
  const seq = String(orderId).replace(/\D/g, '').slice(-5) || '00001';
  return `NX-${year}-${seq.padStart(5, '0')}`;
};

// ─── WhatsApp invoice message builder ───────────────────────────────
export const generateInvoiceMessage = (order) => {
  if (!order) return '';

  const invoiceNo = order.invoiceNumber || generateInvoiceNumber(order.id);
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const customerName = order.customer
    ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()
    : 'Customer';
  const customerPhone = order.customer?.phone || '';
  const customerEmail = order.customer?.email || '';

  // Build item lines
  const items = (order.items || [])
    .map((item, i) => {
      const name = item.name || item.title || `Item #${item.id}`;
      const qty = item.quantity || 1;
      const unitPrice = item.price || 0;
      const lineTotal = unitPrice * qty;
      return [
        `${i + 1}. ${name}`,
        `   Qty: ${qty}`,
        `   Price: ${formatPrice(unitPrice)}`,
        `   Subtotal: ${formatPrice(lineTotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const subtotal = order.subtotal ?? 0;
  const tax = order.tax ?? 0;
  const shipping = order.shipping ?? 0;
  const discount = order.discount ?? 0;
  const total = order.totalAmount ?? order.total ?? 0;
  const paymentId = order.paymentId || 'N/A';
  const paymentStatus = order.paymentStatus === 'success' ? '✅ Paid' : '⏳ Pending';

  const lines = [
    `🧾 *NEXUS GAMING STORE*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `*Invoice No:* ${invoiceNo}`,
    `*Date:* ${date}`,
    `*Order ID:* ${order.id}`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `*Customer:* ${customerName}`,
    customerPhone ? `*Phone:* ${customerPhone}` : null,
    customerEmail ? `*Email:* ${customerEmail}` : null,
    `━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📦 *ITEMS:*`,
    ``,
    items,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `   Subtotal: ${formatPrice(subtotal)}`,
    `   GST (18%): ${formatPrice(tax)}`,
    `   Shipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}`,
    discount > 0 ? `   Discount: -${formatPrice(discount)}` : null,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `   *TOTAL: ${formatPrice(total)}*`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `💳 Payment: ${paymentStatus}`,
    paymentId !== 'N/A' ? `🔑 Payment ID: ${paymentId}` : null,
    ``,
    `Thank you for choosing *NEXUS* 🚀`,
    `🌐 nexusgaming.in`,
  ];

  return lines.filter(Boolean).join('\n');
};

// ─── Open WhatsApp with invoice ─────────────────────────────────────
// phoneNumber: with country code, e.g. "919876543210" (no + or spaces)
// If no phoneNumber is provided, opens WhatsApp's own share dialog.
const BUSINESS_NUMBER = '919099799445'; // fallback business number

export const openWhatsAppInvoice = (order, phoneNumber) => {
  const message = generateInvoiceMessage(order);
  const encoded = encodeURIComponent(message);

  const phone = (phoneNumber || BUSINESS_NUMBER).replace(/[\s+\-()]/g, '');
  const url = `https://wa.me/${phone}?text=${encoded}`;

  window.open(url, '_blank', 'noopener,noreferrer');
};
