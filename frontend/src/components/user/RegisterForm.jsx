import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    document_id: '',
    document_type: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    terms_accepted: false,
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error during registration');
      setMessage({ type: 'success', text: data.message });              
      setTimeout(() => {
        window.location.href = '/my-profile';
      }, 4000);    
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center max-vh-75 bg-light" style={{ maxWidth: '500px' }}>
        <div className="w-100" style={{ maxWidth: '500px' }}>
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <h2 className="text-center mb-4">User Registration</h2>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    </Col>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Document ID</Form.Label>
                        <Form.Control
                        type="number"
                        name="document_id"
                        value={formData.document_id}
                        onChange={handleChange}
                        required
                        isInvalid={formData.document_id && (formData.document_id.length < 7 || formData.document_id.length > 10)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Document ID must be between 7 and 10 digits.
                        </Form.Control.Feedback>
                    </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Document Type</Form.Label>
                        <Form.Select
                        name="document_type"
                        value={formData.document_type}
                        onChange={handleChange}
                        required
                        >
                            <option value="">Select Document Type</option>
                            <option value="CC">CC</option>
                            <option value="TI">TI</option>
                            <option value="Passport">Passport</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                    <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    isInvalid={formData.phone && formData.phone.length !== 10}
                    />
                    <Form.Control.Feedback type="invalid">
                        Phone number must be 10 digits.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                    <Form.Text muted>
                    Must include uppercase, number, special character, and be at least 8 characters long.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                    name="terms_accepted"
                    label="I accept the terms and conditions"
                    checked={formData.terms_accepted}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Register
                </Button>
            </Form>
        </div>
    </Container>
);
}

export default RegisterForm;
