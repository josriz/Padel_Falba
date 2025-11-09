import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from '../supabaseClient';

const GoogleLogo = () => (
  <svg style={{ width: 20, height: 20, marginRight: 8 }} viewBox="0 0 533.5 544.3">
    {/* SVG paths */}
  </svg>
);

const FacebookLogo = () => (
  <svg style={{ width: 20, height: 20, marginRight: 8 }} viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    {/* SVG path */}
  </svg>
);

const backgroundStyle = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundImage: 'url(/images/sfondo.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  opacity: 0.4,
  zIndex: -1,
};

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(255,255,255,0.3)',
  zIndex: 0,
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Inserisci email e password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert('Errore login Google: ' + error.message);
  };

  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
    if (error) alert('Errore login Facebook: ' + error.message);
  };

  const buttonStyle = { width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const facebookButtonStyle = { ...buttonStyle, marginTop: '1.5rem' };

  return (
    <>
      <div style={backgroundStyle} />
      <div style={overlayStyle} />
      <Container className="mt-5" style={{ position: 'relative', zIndex: 1, minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Row className="justify-content-md-center flex-grow-1">
          <Col md={6} lg={5}>
            <div className="text-center mb-3">
              <img
                src="/images/logo.png"
                alt="PadelApp Logo"
                style={{ maxWidth: '150px', width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="text-center mb-3" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>
              by Claudio Falba
            </div>
            <h2 className="mb-4 text-center">Accedi a PadelApp</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Inserisci email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Caricamento...' : 'Accedi'}
              </Button>
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted">o</span>
                <hr className="flex-grow-1" />
              </div>
              <Button variant="danger" style={buttonStyle} onClick={handleGoogleLogin}>
                <GoogleLogo />Accedi con Google
              </Button>
              <Button variant="primary" style={facebookButtonStyle} onClick={handleFacebookLogin}>
                <FacebookLogo />Accedi con Facebook
              </Button>
            </Form>
            <div className="d-flex justify-content-between mt-3">
              <a href="/register">Non hai un account? Registrati</a>
              <a href="/reset-password">Password dimenticata?</a>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
