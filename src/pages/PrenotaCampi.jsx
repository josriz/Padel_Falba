import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';

export default function PrenotaCampi() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [formData, setFormData] = useState({
    data: '',
    ora: '',
    campo: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrenotazioni([...prenotazioni, formData]);
    setFormData({data: '', ora: '', campo: ''});
  };

  return (
    <Container className="mt-4">
      <h2>Prenota i Campi</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="data">
          <Form.Label>Data prenotazione</Form.Label>
          <Form.Control type="date" name="data" value={formData.data} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="ora">
          <Form.Label>Ora</Form.Label>
          <Form.Control type="time" name="ora" value={formData.ora} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="campo">
          <Form.Label>Campo</Form.Label>
          <Form.Control as="select" name="campo" value={formData.campo} onChange={handleChange} required>
            <option value="">Seleziona campo</option>
            <option value="Campo 1">Campo 1</option>
            <option value="Campo 2">Campo 2</option>
            <option value="Campo 3">Campo 3</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Prenota</Button>
      </Form>

      <h3 className="mt-4">Prenotazioni Effettuate</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Ora</th>
            <th>Campo</th>
          </tr>
        </thead>
        <tbody>
          {prenotazioni.map((p, idx) => (
            <tr key={idx}>
              <td>{p.data}</td>
              <td>{p.ora}</td>
              <td>{p.campo}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
