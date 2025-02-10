// app/api/send-booking-email/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      tourTitle,
      fullName,
      email,
      phoneNumber,
      adults,
      youths,
      startDate,
      endDate,
      totalPrice,
      message,
    } = data;

    // Convert Firestore timestamp => readable date
    const formatDate = (timestamp) => {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    // Build email content for client
    const clientEmailContent = `
      Dear ${fullName},

      Thank you for booking with Serengeti Nexus! We have received your booking request for the following tour:

      Tour Details:
      - Tour: ${tourTitle}
      - Start Date: ${formatDate(startDate)}
      - End Date: ${formatDate(endDate)}
      - Number of Adults: ${adults}
      - Number of Youths: ${youths}
      - Total Price: $${totalPrice}

      Your Contact Information:
      - Email: ${email}
      - Phone: ${phoneNumber}

      Additional Message:
      ${message}

      Our team will review your booking and contact you shortly to confirm the details and discuss the next steps.

      Best regards,
      Serengeti Nexus.
    `;

    // Build email content for your admin inbox
    const adminEmailContent = `
      New Booking Request:

      Tour Details:
      - Tour: ${tourTitle}
      - Start Date: ${formatDate(startDate)}
      - End Date: ${formatDate(endDate)}
      - Number of Adults: ${adults}
      - Number of Youths: ${youths}
      - Total Price: $${totalPrice}

      Customer Information:
      - Name: ${fullName}
      - Email: ${email}
      - Phone: ${phoneNumber}

      Customer Message:
      ${message}
    `;

    // 1) Send email to client
    const clientResponse = await sendEmail({
      to: email,
      subject: 'Booking Confirmation - Serengeti Nexus',
      textContent: clientEmailContent,
    });

    // 2) Send email to Serengeti Nexus admin
    const adminResponse = await sendEmail({
      to: 'info@serengetinexus.com',
      subject: `New Booking Request - ${tourTitle}`,
      textContent: adminEmailContent,
    });

    // Check for errors from SendGrid (or whichever service you use)
    if (!clientResponse.ok) {
      const errMsg = await clientResponse.text();
      console.error('Failed to send client email:', errMsg);
      return NextResponse.json({ error: 'Failed to send client email' }, { status: 500 });
    }
    if (!adminResponse.ok) {
      const errMsg = await adminResponse.text();
      console.error('Failed to send admin email:', errMsg);
      return NextResponse.json({ error: 'Failed to send admin email' }, { status: 500 });
    }

    // Both emails sent successfully
    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Failed to send emails', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * A helper function that sends email via SendGrid’s v3 Mail Send API
 */
async function sendEmail({ to, subject, textContent }) {
  // Grab your SendGrid API key from environment variables
  // Set SENDGRID_API_KEY in Cloudflare Pages -> Project Settings -> Environment Variables
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) {
    throw new Error('Missing SENDGRID_API_KEY environment variable');
  }

  // Build request payload
  const payload = {
    personalizations: [
      {
        to: [{ email: to }],
        subject,
      },
    ],
    from: { email: 'noreply@serengetinexus.com' }, // Must be a verified sender in SendGrid
    content: [
      {
        type: 'text/plain',
        value: textContent,
      },
    ],
  };

  // Send the HTTP POST request to SendGrid
  return await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
