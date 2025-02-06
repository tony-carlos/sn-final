// pages/api/sendSMS.js

import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    adult,
    child,
    dateVal,
    tripType,
    duration,
    budget,
    additionalInfo,
    fullName,
    email,
    country,
    dialCode,
    phone,
  } = req.body;

  const messageBody = `
  New Itinerary Request:
  Name: ${fullName}
  Email: ${email}
  Phone: ${dialCode} ${phone}
  Adults: ${adult}
  Children: ${child}
  Start Date: ${dateVal}
  Trip Type: ${tripType}
  Duration: ${duration}
  Budget: $${budget}
  Additional Info: ${additionalInfo}
  Country: ${country}
  `;

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: '+12526802518', // Replace with your Twilio number
      to: '+255759964985', // Replace with your personal/business number
    });

    console.log('SMS sent:', message.sid);
    res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
}
