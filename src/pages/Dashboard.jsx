import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, ProgressBar, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    right: sidebarOpen ? 0 : '-250px',
    width: '250px',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
    transition: 'right 0.3s ease-in-out',
    zIndex: 1050,
    paddingTop: '60px',
  };

  const hamburgerStyle = {
    position: 'fixed',
    top: 15,
    right: 15,
    zIndex: 1100,
    fontSize: '30px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  };

  const contentStyle = {
    marginTop: '80px',
    padding: '20px',
  };

  return (
    <>
      <button onClick={toggleSidebar} style={hamburgerStyle} aria-label="Menu">&#9776;</button>

      <div style={sidebarStyle}>
        <Nav defaultActiveKey="/prenota-campi" className="flex-column">
          <Nav.Link as={Link} to="/prenota-campi" onClick={toggleSidebar}>Prenota i campi</Nav.Link>
          <Nav.Link as={Link} to="/eventi-tornei" onClick={toggleSidebar}>Eventi & Tornei</Nav.Link>
          <Nav.Link as={Link} to="/marketplace" onClick={toggleSidebar}>Marketplace</Nav.Link>
          <Nav.Link as={Link} to="/profilo" onClick={toggleSidebar}>Profilo e Logout</Nav.Link>
        </Nav>
      </div>

      <Container fluid style={contentStyle}>
        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Statistiche prenotazioni</Card.Title>
                <ProgressBar now={65} label="65% Prenotazioni Confermate" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Eventi in programma</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>Torneo Estivo - 15/06/2025</ListGroup.Item>
                  <ListGroup.Item>Evento Benefico - 22/07/2025</ListGroup.Item>
                  <ListGroup.Item>Campionato Regionale - 10/09/2025</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Migliori Racchette vendute</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>Racchetta Power Pro</ListGroup.Item>
                  <ListGroup.Item>Overgrip Soft Touch</ListGroup.Item>
                  <ListGroup.Item>Scarpe Padel Runner</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Benvenuto in Dashboard, Claudio</Card.Title>
                <Card.Text>
                  Qui puoi gestire prenotazioni, eventi, marketplace e profilo utente. Usa il menu hamburger in alto a destra per navigare.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
