
import React from 'react';
import Link from 'next/link';
import Header2 from '@/components/layout/header/Header2';
import FooterOne from '@/components/layout/footers/FooterOne';
import Pheaders from './Pheaders';

export const metadata = {
  title: 'Privacy and Cookies Policy | Serengeti Nexus',
  description:
    'Read the Privacy and Cookies Policy for Serengeti Nexus, outlining how we collect, use, protect your personal information, and manage cookies.',
  keywords: 'Serengeti Nexus, Privacy Policy, Cookies Policy, Data Protection, Confidentiality, GDPR, CCPA',
  openGraph: {
    title: 'Privacy and Cookies Policy | Serengeti Nexus',
    description:
      'Read the Privacy and Cookies Policy for Serengeti Nexus, outlining how we collect, use, protect your personal information, and manage cookies.',
    url: 'https://www.serengetinexus.com/privacy-and-cookies',
    type: 'website',
    images: [
      {
        url: 'https://www.serengetinexus.com/images/privacy-banner.jpg',
        width: 800,
        height: 600,
        alt: 'Privacy and Cookies Policy Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy and Cookies Policy | Serengeti Nexus',
    description:
      'Read the Privacy and Cookies Policy for Serengeti Nexus, outlining how we collect, use, protect your personal information, and manage cookies.',
    images: ['https://www.serengetinexus.com/images/privacy-banner.jpg'],
  },
};

export default function PrivacyAndCookies() {
  return (
    <>
    <Header2 />
    <Pheaders />
    <main className="container py-5">
      <h1 className="mb-4">Privacy and Cookies Policy</h1>

      <section>
        <h2 className="text-20 fw-500">1. Privacy Policy for Serengeti Nexus</h2>

        <h3 className="text-18 fw-500 mt-40">Guarantee of Confidentiality</h3>
        <p className="mt-10">
          We are committed to protecting your privacy online, and our privacy policy is designed to give you peace of mind and confidence. We may change this policy from time to time by updating this page, and you should check this page to ensure that you are happy with any changes. This policy is effective from 1st of December 2021 onwards.
        </p>

        <h3 className="text-18 fw-500 mt-40">2. Agreement</h3>
        <p className="mt-10">
          When contacting SerengetiNexus.com via our website, we request personal information including your name, phone number, and email address. We need this information to process a quotation for you and/or to contact you with our brochure. This information will not be given to any third party, except to the extent and for the purpose we may be required to do so by any law. We would like to hold your email address for our own future marketing purposes (with relevant promotions, offers, or information that you have expressed an interest in or that might be of interest to you). On our ‘Contact Us’ form, you will be given the opportunity to opt-out of receiving occasional marketing information from Serengeti Nexus.
        </p>
        <p className="mt-10">
          We will only disclose your name and booking details/holiday proposal to our suppliers for operational purposes. We will not share your personal information for marketing or any other purposes without your consent unless where required by law. We will always respect your privacy and any personal communication between you and ourselves. We will always comply with any data protection legislation currently in force. We collect information about visitors to our website for general reporting, to improve future content, and to help recognize and service a potential booking.
        </p>
        <p className="mt-10">
          Data security is of the utmost importance to us, and we are committed to ensuring the information we collect from you is secure. All the information you give us is protected by a secure server. The secure server software SSL (Secure Socket Layers) encrypts all information you enter before it is sent to us. The information is only de-encrypted when it reaches our server. We also have a Firewall (security software) in place to protect our internal information from the Internet.
        </p>
      </section>

      <section>
        <h2 className="text-20 fw-500 mt-60 md:mt-30">3. Cookie Usage</h2>

        <h3 className="text-18 fw-500 mt-40">3.1. What Are Cookies?</h3>
        <p className="mt-10">
          We use cookies on our website for a variety of reasons. Cookies let us identify the device you are using and how you use our website, but not you personally. Cookies record anonymous information about visits and clicks on each web page.
        </p>

        <h3 className="text-18 fw-500 mt-40">3.2. Types of Cookies We Use</h3>
        <p className="mt-10">
          Cookies are small files that are stored on your computer when you visit a website; however, they cannot be used to identify you personally and are not harmful to your computer. They are essential for many features of our website to work, helping us to identify which pages are being used to analyze data and improve our site. We only use this information for statistical analysis purposes, and they in no way give us any information about you.
        </p>
        <p className="mt-10">
          If you choose, you can opt-out by turning off cookies in the preferences settings in your web browser.
        </p>

        <h3 className="text-18 fw-500 mt-40">3.3. Visitor’s Activity Monitoring</h3>
        <p className="mt-10">
          We also use Google Analytics to measure and collect session information, length of visits to certain pages, repeat visits, and page interaction information. Google Analytics collects only the IP address assigned to you on the date you visit our website, rather than your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information.
        </p>
        <p className="mt-10">
          You can prevent Google Analytics from recognizing you on return visits to this site by disabling cookies on your browser. We may use the information from Google Analytics for marketing purposes to display adverts on our or other websites based upon your prior visits to our website. Any data collected will be used in accordance with our own privacy policy and Google’s privacy policy.
        </p>
        <p className="mt-10">
          In our website, we also provide links to other websites for your convenience and information. Please be aware that these sites may have different security and privacy policies, and we have no control over and take no responsibility for any information submitted to these sites.
        </p>
      </section>

      <section>
        <h2 className="text-20 fw-500 mt-60 md:mt-30">4. Questions and Modifications</h2>
        <p className="mt-10">
          If you want to change the consents you have given, you can do this at any time by contacting us directly by email at the following: <a href="mailto:info@serengetinexus.com">info@serengetinexus.com</a>
        </p>
        <p className="mt-10">
          We will endeavour to update your record as soon as we possibly can. Of course, if you tell us that you do not wish to receive marketing, you may still receive transactional and service-based communications confirming and servicing any bookings you make with us.
        </p>
        <p className="mt-10">
          We hope that you enjoy using our website, safe in the knowledge that we are committed to protecting your privacy. If you have any questions regarding the privacy policy of Serengeti Nexus, get in touch now.
        </p>
      </section>     
    </main>
    <FooterOne />
    </>
  );
}
