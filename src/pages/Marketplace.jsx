import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';

const prodotti = [
  { nome: "Racchetta Power Pro", descrizione: "Usata, ottime condizioni", prezzo: "€120" },
  { nome: "Overgrip Soft Touch", descrizione: "Nuovo, confezione da 3", prezzo: "€15" },
  { nome: "Scarpe Padel Runner", descrizione: "Usate poco, taglia 42", prezzo: "€80" }
];

export default function Marketplace() {
  return (
    <Container className="mt-4">
      <h2>Marketplace</h2>
      <Row>
        {prodotti.map((prodotto, i) => (
          <Col key={i} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{prodotto.nome}</Card.Title>
                <Card.Text>{prodotto.descrizione}</Card.Text>
                <Card.Text><strong>{prodotto.prezzo}</strong></Card.Text>
                <Button variant="primary">Acquista</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
