/**
 * WhatsApp Service
 * Currently setup as a simplified integration using a generic placeholder / log 
 * In a production environment, you would integrate Twilio, Gupshup, or UltraMsg here.
 */

const axios = require('axios');

const sendWhatsAppBill = async (customerPhone, billData) => {
  try {
    const message = `
*Smart Pani Puri Cart*
Hello ${billData.customerName},
Thank you for your order!

*Bill Details:*
Bill No: #${billData.billNumber}
Amount: ₹${billData.amount}
Items: ${billData.itemsSummary}

Download your digital bill: ${billData.billLink}

Visit us again! 🥟
    `.trim();

    // Mock Implementation: In production, use Twilio/Gupshup API call here
    console.log(`--- WHATSAPP NOTIFICATION ---`);
    console.log(`To: ${customerPhone}`);
    console.log(`Message: ${message}`);
    console.log(`-----------------------------`);

    /**
     * Example Twilio Integration (Uncomment if keys available)
     * 
     * const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
     * await client.messages.create({
     *   from: 'whatsapp:+14155238886',
     *   to: `whatsapp:+91${customerPhone}`,
     *   body: message
     * });
     */

    return { success: true };
  } catch (error) {
    console.error('WhatsApp Service Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWhatsAppBill
};
