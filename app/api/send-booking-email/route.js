// app/api/send-booking-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
      message
    } = data;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Format dates
    const formatDate = (timestamp) => {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

    // Email template for client
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

    // Email template for Serengeti Nexus
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

    // Send email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Serengeti Nexus',
      text: clientEmailContent
    });

    // Send email to Serengeti Nexus
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'info@serengetinexus.com',
      subject: `New Booking Request - ${tourTitle}`,
      text: adminEmailContent
    });

    return NextResponse.json({ 
      message: 'Emails sent successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ 
      error: 'Failed to send emails',
      details: error.message 
    }, { status: 500 });
  }
}