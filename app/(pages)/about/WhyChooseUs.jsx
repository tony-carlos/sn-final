// WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css'; // Import the custom CSS

const WhyChooseUs = () => {
  // List of features
  const features = [
    '100% specialized in Tanzania mainland and Zanzibar',
    'We Always Deliver Impeccable Value',
    'We Are a Local Tour Operator',
    'Guarantee for an amazing safari experience',
    'Personalized service, from booking to on-site support',
    'Approachable and quick response',
  ];

  // Split features into two columns
  const leftFeatures = features.slice(0, 3);
  const rightFeatures = features.slice(3, 6);

  return (
    <section className="layout-pt-xl layout-pb-xl bg-light">
      <div className="container">
      <div className="row">
        {/* Section Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose Serengeti Nexus</h2>
        </div>
        </div>

        {/* Description */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <p className="lead text-center">
              Professional private guides, comfortable private jeeps, flexible itineraries, and the best customer experiences. Our meticulous trip preparation ensures you can enjoy your journey stress-free and worry-free. 
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="row justify-content-center">
          {/* Left Column */}
          <div className="col-lg-6">
            <ul className="list-unstyled">
              {leftFeatures.map((feature, index) => (
                <li key={index} className="d-flex align-items-start mb-4">
                  {/* Tick Icon in Round Box */}
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle tick-bg-custom"
                      style={{ width: '40px', height: '40px' }}
                    >
                      {/* SVG Tick Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-lg text-white"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.287.29.756.01 1.05L6.81 12.632a.733.733 0 0 1-1.058.02L2.217 9.384a.733.733 0 0 1 1.047-1.05l2.72 2.72 6.97-7.723z" />
                      </svg>
                    </div>
                  </div>
                  {/* Feature Text */}
                  <div>
                    <p className="mb-0">{feature}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="col-lg-6">
            <ul className="list-unstyled">
              {rightFeatures.map((feature, index) => (
                <li key={index} className="d-flex align-items-start mb-4">
                  {/* Tick Icon in Round Box */}
                  <div className="me-3 flex-shrink-0">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle tick-bg-custom"
                      style={{ width: '40px', height: '40px' }}
                    >
                      {/* SVG Tick Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-lg text-white"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.287.29.756.01 1.05L6.81 12.632a.733.733 0 0 1-1.058.02L2.217 9.384a.733.733 0 0 1 1.047-1.05l2.72 2.72 6.97-7.723z" />
                      </svg>
                    </div>
                  </div>
                  {/* Feature Text */}
                  <div>
                    <p className="mb-0">{feature}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
