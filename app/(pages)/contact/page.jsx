import dynamic from 'next/dynamic';

const ContactPage = dynamic(
  () => import('@/components/pages/contact/ContactPage'),
  {
    loading: () => (
      <div className="min-h-screen animate-pulse">
        <div className="h-20 bg-gray-100"></div>
        <div className="h-[400px] bg-gray-50"></div>
        <div className="container mx-auto p-6">
          <div className="h-[600px] bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-60 bg-gray-100"></div>
      </div>
    ),
    ssr: false
  }
);

export const metadata = {
  title: "Contact Serengeti Nexus | Get in Touch",
  description: "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
  openGraph: {
    title: "Contact Serengeti Nexus | Get in Touch",
    description: "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
    url: "https://www.serengetinexus.com/contact",
    siteName: "Serengeti Nexus",
    images: [
      {
        url: "https://www.serengetinexus.com/images/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Serengeti Nexus | Get in Touch",
    description: "Contact Serengeti Nexus for inquiries, support, and more. Reach us via phone, email, or visit our office in Arusha, Tanzania.",
    images: ["https://www.serengetinexus.com/images/twitter-image.jpg"],
  },
};

export default function Page() {
  return <ContactPage />;
}