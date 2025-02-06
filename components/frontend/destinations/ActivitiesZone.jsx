// components/frontend/destinations/ActivitiesZone.jsx

import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";

export default function ActivitiesZone({ activities, zone }) {
  return (
    <section className="layout-pt-xl layout-pb-xl bg-dark-1 text-white">
      <Container>
        <Row className="justify-content-between">
          <Col md={6} xs={12}>
            <h2 className="text-30 fw-600">Activities</h2>
            {activities && activities.length > 0 ? (
              <ListGroup variant="flush" className="mt-3">
                {activities.map((active, index) => (
                  <ListGroup.Item
                    key={index}
                    className="bg-dark-1 text-white border-0 py-1"
                  >
                    {activities}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-16 mt-3">No activities available.</p>
            )}
          </Col>
          <Col md={6} xs={12}>
            <h2 className="text-30 fw-600">Zone</h2>
            <p className="text-16 mt-3">{zone}</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
