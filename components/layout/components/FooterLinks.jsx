const sections = [
  {
    title: "Serengeti Nexus",
    links: [
      { id: 1, text: "About Us", href: "/about" },
      { id: 2, text: "Contact Us", href: "/contact" },
      { id: 3, text: "Terms and conditions", href: "/terms" },
      { id: 4, text: "Privacy policy", href: "/privacy" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { id: 9, text: "All Trips ", href: "/tour-packages" },
      { id: 10, text: "Discover Tanzania", href: "/destinations" },
      { id: 11, text: "Safari Guides", href: "/tanzaniasafariguide" },
      { id: 12, text: "Blogs", href: "/travelarticles" },
    ],
  },
];

export default function FooterLinks() {
  return (
    <>
      {sections.map((elm, i) => (
        <div key={i} className="col-lg-3 col-md-6">
          <h4 className="text-20 fw-500">{elm.title}</h4>

          <div className="y-gap-10 mt-20">
            {elm.links.map((elm2, i2) => (
              <a key={i2} className="d-block fw-500" href={elm2.href}>
                {elm2.text}
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
