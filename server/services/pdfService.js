const PDFDocument = require('pdfkit');

/**
 * Generate PDF for an order
 * @param {Object} order - populated order object
 * @returns {Promise<Buffer>} - PDF buffer
 */
exports.generateOrderPDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const result = Buffer.concat(buffers);
      resolve(result);
    });

    // ─── Header ───
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('Smart Pani Puri Cart', 110, 57)
      .fontSize(10)
      .text('Delicious & Hygienic', 110, 80)
      .text(`Cart: ${order.cart.name}`, 200, 50, { align: 'right' })
      .text(`Bill #: ${order.billNumber}`, 200, 65, { align: 'right' })
      .text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 200, 80, { align: 'right' })
      .moveDown();

    // ─── Divider ───
    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // ─── Customer Details ───
    doc
      .fontSize(12)
      .text('Bill To:', 50, 120)
      .fontSize(10)
      .text(order.customer.name, 50, 135)
      .text(order.customer.phone, 50, 150)
      .moveDown();

    // ─── Table Header ───
    const tableTop = 200;
    doc
      .fontSize(10)
      .text('Item', 50, tableTop, { bold: true })
      .text('Quantity', 250, tableTop, { align: 'right' })
      .text('Price', 350, tableTop, { align: 'right' })
      .text('Total', 450, tableTop, { align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // ─── Table Items ───
    let i = 0;
    order.items.forEach((item) => {
      const y = tableTop + 25 + i * 25;
      doc
        .fontSize(10)
        .text(item.name || 'Pani Puri', 50, y)
        .text(item.quantity.toString(), 250, y, { align: 'right' })
        .text(`₹${item.price}`, 350, y, { align: 'right' })
        .text(`₹${item.total}`, 450, y, { align: 'right' });
      i++;
    });

    const subtotalY = tableTop + 25 + i * 25 + 20;
    doc.moveTo(300, subtotalY - 10).lineTo(550, subtotalY - 10).stroke();

    // ─── Totals ───
    doc
      .fontSize(10)
      .text('Discount:', 350, subtotalY, { align: 'right' })
      .text(`-₹${order.discount}`, 450, subtotalY, { align: 'right' })
      .fontSize(12)
      .text('Grand Total:', 350, subtotalY + 20, { bold: true, align: 'right' })
      .text(`₹${order.totalAmount}`, 450, subtotalY + 20, { bold: true, align: 'right' });

    // ─── Footer ───
    doc
      .fontSize(10)
      .fillColor('gray')
      .text('Thank you for choosing Smart Pani Puri!', 50, 700, { align: 'center', width: 500 });

    doc.end();
  });
};
