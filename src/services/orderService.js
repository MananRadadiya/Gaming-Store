import { formatPrice } from '../utils/helpers';

/**
 * Build a new order object from cart data + customer info
 */
export const buildOrderObject = ({ items, totals, customer, paymentMethod }) => {
  return {
    items: items.map(item => ({
      id: item.id,
      name: item.name || item.title,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      category: item.category || '',
    })),
    totalAmount: totals.total,
    subtotal: totals.subtotal,
    tax: totals.tax,
    shipping: totals.shipping,
    discount: totals.discountAmount || 0,
    paymentMethod: paymentMethod || 'razorpay',
    paymentId: '',
    paymentStatus: 'pending',
    customer: {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      pinCode: customer.pinCode || '',
    },
  };
};

/**
 * Generate invoice data from an order
 */
export const generateInvoiceData = (order) => {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    invoiceNumber: `INV-${order.id}`,
    date: invoiceDate,
    company: {
      name: 'NEXUS Gaming Store',
      address: '42 Cyber Lane, Electronic City',
      city: 'Bengaluru, Karnataka 560100',
      country: 'India',
      gstin: '29AABCU9603R1ZM',
      email: 'orders@nexusgaming.in',
      phone: '+91 80 4567 8900',
    },
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    discount: order.discount || 0,
    total: order.totalAmount,
    paymentId: order.paymentId,
    paymentStatus: order.paymentStatus,
    orderId: order.id,
  };
};

/**
 * Get estimated delivery date string
 */
export const getEstimatedDelivery = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get order status color
 */
export const getStatusColor = (status) => {
  const colors = {
    Processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    'Out for Delivery': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    Delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
    Cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  };
  return colors[status] || 'text-white/60 bg-white/5 border-white/10';
};

/**
 * Get payment status badge
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    success: 'text-green-400 bg-green-400/10 border-green-400/30',
    failed: 'text-red-400 bg-red-400/10 border-red-400/30',
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  };
  return colors[status] || 'text-white/60 bg-white/5 border-white/10';
};

/**
 * Generate PDF-ready HTML for invoice (used with window.print or html2canvas)
 */
export const generateInvoiceHTML = (invoiceData) => {
  const itemRows = invoiceData.items.map(item => `
    <tr style="border-bottom:1px solid #1a1f2e">
      <td style="padding:12px 8px;color:#e2e8f0">${item.name}</td>
      <td style="padding:12px 8px;text-align:center;color:#94a3b8">${item.quantity}</td>
      <td style="padding:12px 8px;text-align:right;color:#94a3b8">${formatPrice(item.price)}</td>
      <td style="padding:12px 8px;text-align:right;color:#e2e8f0;font-weight:600">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0B0F14; color: #e2e8f0; padding: 40px; }
        .invoice { max-width: 800px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 48px; border: 1px solid rgba(0,255,136,0.15); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 2px solid #00FF88; padding-bottom: 24px; }
        .logo { font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #00FF88, #00E0FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 48px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { text-align: left; padding: 12px 8px; color: #00FF88; border-bottom: 2px solid #00FF88; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; color: #94a3b8; }
        .total-final { display: flex; justify-content: space-between; padding: 16px 0; color: #00FF88; font-size: 20px; font-weight: 700; border-top: 2px solid #00FF88; margin-top: 8px; }
        @media print { body { background: white; color: #1a1a1a; } .invoice { border: 1px solid #ddd; background: white; } th { color: #059669; border-color: #059669; } .total-final { color: #059669; border-color: #059669; } .logo { -webkit-text-fill-color: #059669; } }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <div class="logo">NEXUS</div>
            <p style="color:#94a3b8;margin-top:4px">Gaming Store</p>
          </div>
          <div style="text-align:right">
            <p style="font-size:20px;font-weight:600">INVOICE</p>
            <p style="color:#00FF88;font-size:14px;margin-top:4px">${invoiceData.invoiceNumber}</p>
            <p style="color:#94a3b8;font-size:13px;margin-top:4px">${invoiceData.date}</p>
          </div>
        </div>
        <div class="info-grid">
          <div>
            <p style="color:#00FF88;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">FROM</p>
            <p style="font-weight:600">${invoiceData.company.name}</p>
            <p style="color:#94a3b8;font-size:14px;margin-top:4px">${invoiceData.company.address}</p>
            <p style="color:#94a3b8;font-size:14px">${invoiceData.company.city}</p>
            <p style="color:#94a3b8;font-size:14px">GSTIN: ${invoiceData.company.gstin}</p>
          </div>
          <div>
            <p style="color:#00FF88;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">BILL TO</p>
            <p style="font-weight:600">${invoiceData.customer.firstName} ${invoiceData.customer.lastName}</p>
            <p style="color:#94a3b8;font-size:14px;margin-top:4px">${invoiceData.customer.address}</p>
            <p style="color:#94a3b8;font-size:14px">${invoiceData.customer.city} - ${invoiceData.customer.pinCode}</p>
            <p style="color:#94a3b8;font-size:14px">${invoiceData.customer.email}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Price</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>Subtotal</span><span>${formatPrice(invoiceData.subtotal)}</span></div>
          <div class="total-row"><span>GST (18%)</span><span>${formatPrice(invoiceData.tax)}</span></div>
          <div class="total-row"><span>Shipping</span><span>${invoiceData.shipping === 0 ? 'FREE' : formatPrice(invoiceData.shipping)}</span></div>
          ${invoiceData.discount > 0 ? `<div class="total-row"><span>Discount</span><span>-${formatPrice(invoiceData.discount)}</span></div>` : ''}
          <div class="total-final"><span>TOTAL</span><span>${formatPrice(invoiceData.total)}</span></div>
        </div>
        <div style="margin-top:48px;padding-top:24px;border-top:1px solid #1a1f2e;text-align:center">
          <p style="color:#94a3b8;font-size:13px">Payment ID: ${invoiceData.paymentId || 'N/A'}</p>
          <p style="color:#94a3b8;font-size:13px;margin-top:4px">Order ID: ${invoiceData.orderId}</p>
          <p style="color:#64748b;font-size:12px;margin-top:16px">Thank you for shopping at NEXUS Gaming Store!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
