import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { vehicleDetails, proxyName, ownerIdBase64, signatureBase64 } = req.body;

    // Remove the data URI part of the base64 string
    const cleanBase64 = (b64: string) => b64.replace(/^data:image\/\w+;base64,/, '');

    const attachments = [];
    
    if (ownerIdBase64) {
      attachments.push({
        filename: 'owner-id.jpg',
        content: cleanBase64(ownerIdBase64),
      });
    }
    
    if (signatureBase64) {
      attachments.push({
        filename: 'signature.png',
        content: cleanBase64(signatureBase64),
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Tow Guys App <onboarding@resend.dev>', // Use resend's onboarding email to avoid unverified domain errors
      to: ['alex@towguysgresham.com'],
      subject: `🚨 VEHICLE RELEASE: ${vehicleDetails}`,
      html: `
        <h2>Vehicle Release Authorization</h2>
        <p><strong>Vehicle Details:</strong> ${vehicleDetails}</p>
        <p><strong>Authorized Proxy Name:</strong> ${proxyName}</p>
        <p>Please find the owner's photo ID and signature attached.</p>
      `,
      attachments,
    });

    if (error) {
      console.error('Failed to send email via Resend API:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Unexpected error fetching to Resend:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
