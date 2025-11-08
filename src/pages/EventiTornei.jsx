import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const eventi = [
  { titolo: "Torneo Estivo", data: "2025-06-15", descrizione: "Torneo aperto a tutti i livelli, premi e divertimento." },
  { titolo: "Evento Benefico", data: "2025-07-22", descrizione: "Partite di beneficenza con raccolta fondi per associazioni." },
  { titolo: "Campionato Regionale", data: "2025-09-10", descrizione: "Competizione regionale per squadre selezionate." }
];

export default function EventiTornei() {
  return (
    <Container className="mt-4">
      <h2>Eventi & Tornei</h2>
      <Row>
        {eventi.map((evento, i) => (
          <Col key={i} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{evento.titolo}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{evento.data}</Card.Subtitle>
                <Card.Text>{evento.descrizione}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
