import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export default function Profilo() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Dati salvati: ' + JSON.stringify(formData));
  };

  return (
    <Container className="mt-4">
      <h2>Profilo Utente</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control name="nome" type="text" placeholder="Inserisci nome" value={formData.nome} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cognome">
          <Form.Label>Cognome</Form.Label>
          <Form.Control name="cognome" type="text" placeholder="Inserisci cognome" value={formData.cognome} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" placeholder="Inserisci email" value={formData.email} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefono">
          <Form.Label>Telefono</Form.Label>
          <Form.Control name="telefono" type="tel" placeholder="Inserisci numero di telefono" value={formData.telefono} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Salva</Button>{' '}
        <Button variant="danger" onClick={() => alert("Logout effettuato")}>Logout</Button>
      </Form>
    </Container>
  );
}
