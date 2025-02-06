// src/components/Meta.js


export default function Meta({
  title = 'Serengeti Nexus | Premier Safari and Hiking Adventures in Tanzania',
  description = 'Serengeti Nexus offers unparalleled safari and hiking experiences in Tanzania. Explore the Serengeti, witness the Great Migration, and immerse yourself in Tanzania\'s rich cultural heritage with our expert guides.',
  keywords = 'Tanzania Safari, Serengeti Tours, Hiking in Tanzania, African Safaris, Great Migration, Wildlife Conservation, Custom Safari Packages, Kilimanjaro Hiking, Ngorongoro Conservation, Cultural Tours Tanzania',
  author = 'Serengeti Nexus',
  url = 'https://www.serengetinexus.com/about-us',
  image = 'https://www.serengetinexus.com/images/og-image.jpg',
  twitterImage = 'https://www.serengetinexus.com/images/twitter-image.jpg',
}) {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charset="UTF-8" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Serengeti Nexus" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:site" content="@SerengetiNexus" />
      <meta name="twitter:creator" content="@SerengetiNexus" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#ff7f50" />
    </Head>
  );
}
