import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, FileText } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { generateInvoiceData, generateInvoiceHTML } from '../../services/orderService';

const InvoicePreview = ({ order }) => {
  const invoiceRef = useRef(null);

  if (!order) return null;

  const invoice = generateInvoiceData(order);

  const handleDownloadPDF = () => {
    const html = generateInvoiceHTML(invoice);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrint = () => {
    handleDownloadPDF();
  };

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl text-sm hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-shadow"
        >
          <Download size={16} />
          Download Invoice
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/70 font-semibold rounded-xl text-sm hover:border-[#00FF88]/30 hover:text-white transition-all"
        >
          <Printer size={16} />
          Print
        </motion.button>
      </div>

      {/* Invoice preview card */}
      <div
        ref={invoiceRef}
        className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                NEXUS
              </h2>
              <p className="text-white/40 text-sm mt-1">Gaming Store</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-white/50">
                <FileText size={16} />
                <span className="text-sm font-medium">INVOICE</span>
              </div>
              <p className="text-[#00FF88] font-bold mt-1">{invoice.invoiceNumber}</p>
              <p className="text-white/40 text-xs mt-1">{invoice.date}</p>
            </div>
          </div>
        </div>

        {/* Billing info */}
        <div className="grid grid-cols-2 gap-8 p-8 border-b border-white/[0.06]">
          <div>
            <p className="text-[#00FF88] text-[10px] font-bold tracking-[2px] uppercase mb-3">From</p>
            <p className="text-white font-semibold text-sm">{invoice.company.name}</p>
            <p className="text-white/40 text-xs mt-1">{invoice.company.address}</p>
            <p className="text-white/40 text-xs">{invoice.company.city}</p>
            <p className="text-white/40 text-xs mt-2">GSTIN: {invoice.company.gstin}</p>
          </div>
          <div>
            <p className="text-[#00FF88] text-[10px] font-bold tracking-[2px] uppercase mb-3">Bill To</p>
            <p className="text-white font-semibold text-sm">
              {invoice.customer.firstName} {invoice.customer.lastName}
            </p>
            <p className="text-white/40 text-xs mt-1">{invoice.customer.address}</p>
            <p className="text-white/40 text-xs">
              {invoice.customer.city} - {invoice.customer.pinCode}
            </p>
            <p className="text-white/40 text-xs mt-2">{invoice.customer.email}</p>
          </div>
        </div>

        {/* Items table */}
        <div className="p-8 border-b border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#00FF88]/20">
                <th className="text-left text-[10px] font-bold tracking-[2px] uppercase text-[#00FF88] pb-3">
                  Product
                </th>
                <th className="text-center text-[10px] font-bold tracking-[2px] uppercase text-[#00FF88] pb-3">
                  Qty
                </th>
                <th className="text-right text-[10px] font-bold tracking-[2px] uppercase text-[#00FF88] pb-3">
                  Price
                </th>
                <th className="text-right text-[10px] font-bold tracking-[2px] uppercase text-[#00FF88] pb-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="py-3 text-sm text-white">{item.name}</td>
                  <td className="py-3 text-sm text-center text-white/50">{item.quantity}</td>
                  <td className="py-3 text-sm text-right text-white/50">{formatPrice(item.price)}</td>
                  <td className="py-3 text-sm text-right text-white font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8">
          <div className="ml-auto max-w-xs space-y-2">
            <div className="flex justify-between text-sm text-white/50">
              <span>Subtotal</span>
              <span>{formatPrice(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/50">
              <span>GST (18%)</span>
              <span>{formatPrice(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/50">
              <span>Shipping</span>
              <span>{invoice.shipping === 0 ? 'FREE' : formatPrice(invoice.shipping)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Discount</span>
                <span>-{formatPrice(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-3 border-t border-[#00FF88]/20">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-lg font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                {formatPrice(invoice.total)}
              </span>
            </div>
          </div>

          {/* Payment info */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-white/30 text-xs">
              Payment ID: <span className="text-white/50">{invoice.paymentId || 'N/A'}</span>
            </p>
            <p className="text-white/30 text-xs mt-1">
              Order ID: <span className="text-white/50">{invoice.orderId}</span>
            </p>
            <p className="text-white/20 text-xs mt-4">
              Thank you for shopping at NEXUS Gaming Store!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
