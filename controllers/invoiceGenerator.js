const PDFDocument = require('pdfkit');

const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Send PDF as response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=invoice_${order.orderId}.pdf`
  );

  doc.pipe(res);

  // ---------------- HEADER ----------------
  doc
    .fontSize(20)
    .text('Invoice', { align: 'center' })
    .moveDown();

  doc.fontSize(12).text(`Order ID: #${order.orderId}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.text(`Status: ${order.orderStatus}`);
  doc.moveDown();

  // ---------------- CUSTOMER ----------------
  doc.fontSize(14).text('Shipping Info:', { underline: true });
  const ship = order.shippingAddress;
  doc
    .fontSize(12)
    .text(`Name: ${ship.fullName}`)
    .text(`Email: ${ship.email}`)
    .text(`Phone: ${ship.mobile}`)
    .text(`Address: ${ship.addressLine}, ${ship.city}, ${ship.state} - ${ship.pincode}`)
    .text(`Landmark: ${ship.landmark || '-'}`)
    .text(`Address Type: ${ship.addressType}`)
    .moveDown();

  // ---------------- ITEMS ----------------
  doc.fontSize(14).text('Order Items:', { underline: true }).moveDown(0.5);

  const tableTop = doc.y;
  const itemMargin = 20;

  doc
    .fontSize(12)
    .text('Product', 50, tableTop)
    .text('Qty', 300, tableTop)
    .text('Price', 350, tableTop)
    .text('Total', 450, tableTop);

  let y = tableTop + 20;

  order.orderItems.forEach((item) => {
    doc
      .text(item.name, 50, y)
      .text(item.qty, 300, y)
      .text(`₹${item.price}`, 350, y)
      .text(`₹${item.qty * item.price}`, 450, y);
    y += itemMargin;
  });

  doc.moveDown();

  // ---------------- TOTAL ----------------
  doc.fontSize(14).text(`Total Price: ₹${order.totalPrice}`, { align: 'right' });

  doc.end();
};

module.exports = generateInvoicePDF;
