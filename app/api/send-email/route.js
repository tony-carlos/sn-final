// app/api/send-email/route.js
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, tourTitle, from, to } = body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
      logger: true,
    });

    // Test the connection
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw verifyError;
    }

    // Admin email
    const adminEmailContent = {
      from: {
        name: "Serengeti Nexus Bookings",
        address: process.env.EMAIL_USER,
      },
      to: "info@serengetinexus.com",
      subject: `New Tour Booking Inquiry - ${tourTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Tour Booking Inquiry</h2>
          <h3>Tour Details:</h3>
          <ul>
            <li><strong>Tour:</strong> ${tourTitle}</li>
            <li><strong>From:</strong> ${from}</li>
            <li><strong>To:</strong> ${to}</li>
          </ul>
          <h3>Client Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>
          <h3>Message:</h3>
          <p>${message}</p>
          <hr>
          <p><em>This inquiry was submitted on ${new Date().toLocaleString()}</em></p>
        </div>
      `,
    };

    // Client email
    const clientEmailContent = {
      from: {
        name: "Serengeti Nexus",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `Your Tour Booking Inquiry - ${tourTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #947a57;">Thank You for Your Tour Inquiry</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in booking a tour with Serengeti Nexus. We have received your inquiry for:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p ><strong>Tour:</strong > ${tourTitle}</p>
            <p><strong>From:</strong> ${from}</p>
            <p><strong>To:</strong> ${to}</p>
          </div>
          
          <p>Our team will review your requirements and get back to you soon.</p>
          
          <p>Your contact information:</p>
          <ul>
            <li>Phone: ${phone}</li>
            <li>Email: ${email}</li>
          </ul>
          
          <p>Your Message:</p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          
          <p>For immediate assistance:</p>
          <ul>
            <li>Call: +255 759 964 985</li>
            <li>Email: serengetinexus@gmail.com</li>
            <li>WhatsApp: +255 759 964 985</li>
          </ul>
          
          <p style="margin-top: 20px;">Best regards,<br>
          The Serengeti Nexus </p>
        </div>
      `,
    };

    // Send emails
    const adminResult = await transporter.sendMail(adminEmailContent);

    const clientResult = await transporter.sendMail(clientEmailContent);

    return NextResponse.json({
      message: "Emails sent successfully",
      adminMessageId: adminResult.messageId,
      clientMessageId: clientResult.messageId,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Failed to send emails",
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
