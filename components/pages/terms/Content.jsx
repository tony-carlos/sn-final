// src/components/Content.js

"use client";

import React from "react";

export default function Content() {
  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-30">
          <div className="col-lg-12">
            <div className="tabs__content js-tabs-content">
              <div
                id="termsContainer"
                style={{ transition: "opacity 0.5s ease-in-out" }}
                className="tabs__pane -tab-item-1 is-tab-el-active"
              >
                {/* Terms and Conditions Content Starts Here */}

                <h2 className="text-20 fw-500">Terms and Conditions</h2>
                
                <h3 className="text-18 fw-500 mt-40">1. Introduction</h3>
                <p className="mt-10">
                  Welcome to <strong>Serengeti Nexus</strong> ("we," "us," "our"). These Terms and Conditions ("Terms") govern your use of our website, services, and any related offerings (collectively, the "Services"). By accessing or using our Services, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not use our Services.
                </p>

                <h3 className="text-18 fw-500 mt-40">2. Definitions</h3>
                <p className="mt-10">
                  <strong>"Client," "You," or "Your":</strong> Refers to the individual or entity using the Services.
                </p>
                <p className="mt-10">
                  <strong>"Services":</strong> Includes all offerings provided by Serengeti Nexus, such as safaris, cultural tours, hiking adventures, customized itineraries, and related support.
                </p>
                <p className="mt-10">
                  <strong>"Booking":</strong> The process of reserving a service or package offered by Serengeti Nexus.
                </p>

                <h3 className="text-18 fw-500 mt-40">3. Booking and Reservations</h3>
                <h4 className="text-16 fw-500 mt-30">3.1. Making a Booking</h4>
                <p className="mt-10">
                  All bookings must be made through our official website, authorized agents, or direct contact with our sales team. A confirmed booking is only valid upon receipt of full payment or a non-refundable deposit as specified during the booking process.
                </p>

                <h4 className="text-16 fw-500 mt-30">3.2. Confirmation</h4>
                <p className="mt-10">
                  Upon successful booking, you will receive a confirmation email detailing your reservation, itinerary, and payment details. It is your responsibility to ensure the accuracy of all information provided during the booking process.
                </p>

                <h3 className="text-18 fw-500 mt-40">4. Payments</h3>
                <h4 className="text-16 fw-500 mt-30">4.1. Payment Methods</h4>
                <p className="mt-10">
                  We accept various payment methods, including credit/debit cards, bank transfers, and other approved online payment systems. All payments must be made in the currency specified during the booking process.
                </p>

                <h4 className="text-16 fw-500 mt-30">4.2. Payment Terms</h4>
                <p className="mt-10">
                  A non-refundable deposit may be required to secure your booking. The remaining balance must be paid by the due date specified in your booking confirmation. Failure to make timely payments may result in the cancellation of your booking without a refund.
                </p>

                <h3 className="text-18 fw-500 mt-40">5. Cancellations and Refunds</h3>
                <h4 className="text-16 fw-500 mt-30">5.1. Cancellation by Client</h4>
                <p className="mt-10">
                  Cancellations must be made in writing via email or through our official booking platform. Cancellation fees apply based on the timing of the cancellation relative to the start date of the Services:
                </p>
                <ul className="mt-10">
                  <li>
                    <strong>More than 60 days before:</strong> 0% of the total booking cost.
                  </li>
                  <li>
                    <strong>30-59 days before:</strong> 0% of the total booking cost.
                  </li>
                  <li>
                    <strong>Less than 30 days before:</strong> 5% of the total booking cost.
                  </li>
                </ul>
                <p className="mt-10">
                  No refunds will be provided for cancellations made less than 3 days before the start date.
                </p>

                <h4 className="text-16 fw-500 mt-30">5.2. Cancellation by Serengeti Nexus</h4>
                <p className="mt-10">
                  We reserve the right to cancel or reschedule any Services due to unforeseen circumstances such as natural disasters, political instability, or other events beyond our control. In such cases, clients will be offered a full refund or the option to reschedule without additional charges.
                </p>

                <h3 className="text-18 fw-500 mt-40">6. Changes to Bookings</h3>
                <p className="mt-10">
                  Clients may request changes to their bookings, such as itinerary adjustments, accommodation upgrades, or additional services. Changes are subject to availability and may incur additional costs. Any requested changes must be confirmed in writing, and additional payments must be made promptly to secure the changes.
                </p>

                <h3 className="text-18 fw-500 mt-40">7. Health and Safety</h3>
                <h4 className="text-16 fw-500 mt-30">7.1. Client Responsibilities</h4>
                <p className="mt-10">
                  Clients are responsible for ensuring they are in good health and physically capable of participating in the selected Services. Clients must inform Serengeti Nexus of any medical conditions, allergies, or special requirements prior to the commencement of Services.
                </p>

                <h4 className="text-16 fw-500 mt-30">7.2. Safety Measures</h4>
                <p className="mt-10">
                  We adhere to all safety standards and regulations to ensure a secure experience. Clients must follow all instructions provided by our guides and staff to maintain safety during the Services.
                </p>

                <h3 className="text-18 fw-500 mt-40">8. Travel Insurance</h3>
                <p className="mt-10">
                  <strong>Recommendation:</strong> We strongly recommend that clients obtain comprehensive travel insurance covering trip cancellations, medical emergencies, and other unforeseen events.
                </p>
                <p className="mt-10">
                  <strong>Disclaimer:</strong> Serengeti Nexus is not liable for any losses or damages arising from events not covered by our Services or any travel insurance you may have.
                </p>

                <h3 className="text-18 fw-500 mt-40">9. Liability</h3>
                <h4 className="text-16 fw-500 mt-30">9.1. Limited Liability</h4>
                <p className="mt-10">
                  Serengeti Nexus acts as an agent facilitating access to third-party services such as accommodations, transportation, and activities. We are not liable for any acts, omissions, or negligence of third-party service providers.
                </p>

                <h4 className="text-16 fw-500 mt-30">9.2. Indemnification</h4>
                <p className="mt-10">
                  Clients agree to indemnify and hold Serengeti Nexus harmless from any claims, damages, losses, or expenses arising out of their use of the Services, violation of these Terms, or infringement of any rights of another.
                </p>

                <h3 className="text-18 fw-500 mt-40">10. Governing Law and Dispute Resolution</h3>
                <p className="mt-10">
                  These Terms are governed by and construed in accordance with the laws of united republic of Tanzania. Any disputes arising out of or related to these Terms or the Services shall be resolved through negotiation in good faith. If unresolved, disputes may be submitted to mediation or binding arbitration in accordance with the rules of [Arbitration Body]. The venue for any legal proceedings shall be [Your Jurisdiction].
                </p>

                <h3 className="text-18 fw-500 mt-40">11. Amendments to Terms</h3>
                <p className="mt-10">
                  Serengeti Nexus reserves the right to modify or update these Terms at any time without prior notice. Clients are responsible for reviewing these Terms periodically for any changes. Continued use of our Services after any modifications constitutes acceptance of the revised Terms.
                </p>

                <h3 className="text-18 fw-500 mt-40">12. Severability</h3>
                <p className="mt-10">
                  If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.
                </p>

                <h3 className="text-18 fw-500 mt-40">13. Contact Information</h3>
                <p className="mt-10">
                  For any questions or concerns regarding these Terms, please contact us at:
                </p>
                <p className="mt-10">
                  <strong>Serengeti Nexus</strong>
                  <br />
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@serengetinexus.com">info@serengetinexus.com</a>
                  <br />
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+1234567890">+255759964985</a>
                  <br />
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
