// components/frontend/destinations/FeatureCards.jsx

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

export default function FeatureCards({ featureCards }) {
  return (
    <section className="layout-pt-xl layout-pb-xl bg-accent-1-05">
      <Container>
        <Row className="y-gap-10 justify-content-between align-items-end">
          <Col md={6} xs={12}>
            <h2 data-aos="fade-up" className="text-30">
              Popular Things to Do
            </h2>
          </Col>

          <Col md={6} xs={12} className="text-md-end text-start mt-3 mt-md-0">
            <Link href="/tour-list-1" className="buttonArrow d-flex align-items-center justify-content-md-end justify-content-start" data-aos="fade-up">
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-2"></i>
            </Link>
          </Col>
        </Row>

        <Row className="y-gap-20 pt-40">
          {featureCards && featureCards.length > 0 ? (
            featureCards.map((card, index) => (
              <Col key={index} lg={2} md={4} sm={6} xs={12}>
                <Link href="/tour-list-1" className="featureCard -type-5 -hover-accent-1 text-center h-100 d-block">
                  <div className="featureCard__icon mb-3 mx-auto">
                    <Image
                      width={40}
                      height={41}
                      src={card.imageUrl}
                      alt={card.title}
                    />
                  </div>

                  <h4 className="text-18 fw-500 mt-20">{card.title}</h4>
                  <div className="lh-13 mt-5">{card.tourCount}+ Tours</div>
                </Link>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <p className="text-16">No features available.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
}
