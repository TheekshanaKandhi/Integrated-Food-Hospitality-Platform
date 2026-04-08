const Order = require("../models/Order");
const PDFDocument = require("pdfkit");

const generateInvoiceNumber = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `INV-${Date.now()}-${randomPart}`;
};

const placeOrder = async (req, res) => {
  try {
    const {
      user,
      restaurant,
      items,
      totalPrice,
      customerName,
      deliveryAddress,
      paymentMethod,
      paymentStatus
    } = req.body;

    const order = await Order.create({
      user,
      restaurant,
      items,
      totalPrice,
      customerName,
      deliveryAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentStatus || "Pending",
      invoiceNumber: generateInvoiceNumber()
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name cuisine address")
      .populate("items.menuItem", "name price category imageUrl");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const safeText = (value) => value || "N/A";

const drawRoundedBox = (doc, x, y, w, h, radius = 8, fill = null, stroke = "#D1D5DB") => {
  doc.save();
  if (fill) {
    doc.roundedRect(x, y, w, h, radius).fillAndStroke(fill, stroke);
  } else {
    doc.roundedRect(x, y, w, h, radius).stroke(stroke);
  }
  doc.restore();
};

const drawText = (doc, text, x, y, options = {}) => {
  doc.text(text, x, y, options);
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("restaurant", "name cuisine address")
      .populate("items.menuItem", "name price category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 30
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${order.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    const dark = "#111827";
    const muted = "#6B7280";
    const light = "#F8FAFC";
    const border = "#D1D5DB";
    const blue = "#1D4ED8";
    const blueDark = "#1E3A8A";
    const blueLight = "#EFF6FF";
    const green = "#166534";
    const greenBg = "#DCFCE7";
    const amber = "#92400E";
    const amberBg = "#FEF3C7";
    const grayLight = "#F3F4F6";

    const subtotal = order.items.reduce((sum, item) => {
      const price = item.menuItem?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    const deliveryFee = 0;
    const taxRate = 0.05;
    const taxableAmount = subtotal + deliveryFee;
    const taxAmount = Math.round(taxableAmount * taxRate);
    const grandTotal = order.totalPrice;

    const paymentBadgeBg = order.paymentStatus === "Paid" ? greenBg : amberBg;
    const paymentBadgeText = order.paymentStatus === "Paid" ? green : amber;

    // Page border
    drawRoundedBox(doc, 18, 18, 559, 805, 10, null, "#E5E7EB");

    // Header band
    drawRoundedBox(doc, 30, 30, 535, 95, 12, blue, blue);

    // Logo badge
    drawRoundedBox(doc, 45, 45, 64, 64, 12, "#FFFFFF", "#FFFFFF");
    doc
      .fillColor(blueDark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("FD", 66, 67);

    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(21)
      .text("Food Delivery and Dine-Out Platform", 122, 50);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Tax Invoice / Bill of Supply / Cash Memo", 122, 78);

    doc
      .font("Helvetica")
      .fontSize(9)
      .text("Professional billing statement", 405, 80, {
        width: 130,
        align: "right"
      });

    // Left / right cards
    drawRoundedBox(doc, 30, 140, 260, 120, 10, "#FFFFFF", border);
    drawRoundedBox(doc, 305, 140, 260, 120, 10, "#FFFFFF", border);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Billing Address", 45, 156);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(safeText(order.customerName), 45, 180);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text(`Email: ${safeText(order.user?.email)}`, 45, 200)
      .text(`Delivery Address: ${safeText(order.deliveryAddress)}`, 45, 218, {
        width: 225
      });

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Invoice Details", 320, 156);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text(`Invoice Number: ${order.invoiceNumber}`, 320, 180)
      .text(`Order ID: ${order._id}`, 320, 198)
      .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`, 320, 216)
      .text(`Invoice Time: ${new Date(order.createdAt).toLocaleTimeString()}`, 320, 234);

    // Restaurant block
    drawRoundedBox(doc, 30, 275, 535, 78, 10, light, border);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Restaurant Information", 45, 292);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(safeText(order.restaurant?.name), 45, 314);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text(`Cuisine: ${safeText(order.restaurant?.cuisine)}`, 240, 314)
      .text(`Restaurant Address: ${safeText(order.restaurant?.address)}`, 45, 332, {
        width: 460
      });

    // Table title
    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Order Items", 30, 372);

    // Table box
    const tableX = 30;
    const tableY = 390;
    const tableW = 535;
    const headerH = 28;
    const rowH = 30;

    drawRoundedBox(doc, tableX, tableY, tableW, headerH, 6, blueLight, border);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Item Description", 42, tableY + 9)
      .text("Category", 250, tableY + 9)
      .text("Qty", 355, tableY + 9, { width: 30, align: "center" })
      .text("Unit Price", 410, tableY + 9, { width: 55, align: "right" })
      .text("Amount", 485, tableY + 9, { width: 60, align: "right" });

    let rowY = tableY + headerH;

    order.items.forEach((item, index) => {
      const itemName = item.menuItem?.name || "Menu Item";
      const category = item.menuItem?.category || "-";
      const unitPrice = item.menuItem?.price || 0;
      const qty = item.quantity;
      const lineTotal = unitPrice * qty;

      drawRoundedBox(
        doc,
        tableX,
        rowY,
        tableW,
        rowH,
        0,
        index % 2 === 0 ? "#FFFFFF" : "#FCFCFD",
        border
      );

      doc
        .fillColor(dark)
        .font("Helvetica")
        .fontSize(10)
        .text(itemName, 42, rowY + 10, { width: 190 })
        .text(category, 250, rowY + 10, { width: 90 })
        .text(String(qty), 355, rowY + 10, { width: 30, align: "center" })
        .text(`₹${unitPrice}`, 410, rowY + 10, { width: 55, align: "right" })
        .text(`₹${lineTotal}`, 485, rowY + 10, { width: 60, align: "right" });

      rowY += rowH;
    });

    // vertical table lines
    const tableBottom = rowY;
    [240, 345, 400, 480].forEach((x) => {
      doc
        .strokeColor(border)
        .moveTo(x, tableY)
        .lineTo(x, tableBottom)
        .stroke();
    });

    // Payment & totals block
    const summaryTop = tableBottom + 22;

    drawRoundedBox(doc, 30, summaryTop, 255, 155, 10, "#FFFFFF", border);
    drawRoundedBox(doc, 310, summaryTop, 255, 155, 10, "#FFFFFF", border);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Payment Information", 45, summaryTop + 15);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text(`Payment Method: ${order.paymentMethod}`, 45, summaryTop + 42)
      .text(`Payment Status: ${order.paymentStatus}`, 45, summaryTop + 62)
      .text(`Order Status: ${order.status}`, 45, summaryTop + 82);

    drawRoundedBox(doc, 45, summaryTop + 108, 110, 24, 6, paymentBadgeBg, paymentBadgeBg);
    doc
      .fillColor(paymentBadgeText)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(order.paymentStatus, 45, summaryTop + 115, {
        width: 110,
        align: "center"
      });

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Amount Summary", 325, summaryTop + 15);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(10)
      .text("Subtotal", 325, summaryTop + 40)
      .text(`₹${subtotal}`, 470, summaryTop + 40, { width: 70, align: "right" })

      .text("Delivery Fee", 325, summaryTop + 62)
      .text(`₹${deliveryFee}`, 470, summaryTop + 62, { width: 70, align: "right" })

      .text("Taxable Amount", 325, summaryTop + 84)
      .text(`₹${taxableAmount}`, 470, summaryTop + 84, { width: 70, align: "right" })

      .text("Tax (5%)", 325, summaryTop + 106)
      .text(`₹${taxAmount}`, 470, summaryTop + 106, { width: 70, align: "right" });

    drawRoundedBox(doc, 322, summaryTop + 126, 230, 22, 6, blueLight, blueLight);
    doc
      .fillColor(blue)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Grand Total", 338, summaryTop + 133)
      .text(`₹${grandTotal}`, 470, summaryTop + 133, { width: 65, align: "right" });

    // Tax / declaration / signature block
    const footerTop = summaryTop + 172;

    drawRoundedBox(doc, 30, footerTop, 535, 110, 10, "#FFFFFF", border);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Tax & Policy Information", 45, footerTop + 15);

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(9)
      .text("• This is a computer-generated invoice and does not require a physical signature.", 45, footerTop + 38)
      .text("• Tax shown above is illustrative for project/demo billing purposes.", 45, footerTop + 54)
      .text("• Products and services are subject to restaurant and platform refund/cancellation terms.", 45, footerTop + 70)
      .text("• For support, contact: support@foodapp.com", 45, footerTop + 86);

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Authorized Signatory", 410, footerTop + 82);

    // Bottom footer strip
    drawRoundedBox(doc, 30, 792, 535, 18, 6, grayLight, grayLight);
    doc
      .fillColor("#6B7280")
      .font("Helvetica")
      .fontSize(8)
      .text(
        "Food Delivery and Dine-Out Platform | Thank you for ordering with us",
        30,
        797,
        {
          width: 535,
          align: "center"
        }
      );

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  updateOrderStatus,
  downloadInvoice
};