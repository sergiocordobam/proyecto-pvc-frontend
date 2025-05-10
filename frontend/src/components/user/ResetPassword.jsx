import { useState, useRef } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import NavbarPvc from "../base/Navbar";

export default function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        email: "",
        address: "",
        phone: "",
        document_type: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const confirmRef = useRef();

    const passwordRegex = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&#]{8,}$';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "confirmPassword") {
            confirmRef.current.setCustomValidity(
                e.target.value !== formData.password ? "Passwords do not match." : ""
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const { confirmPassword, ...payload } = formData;
            const response = await fetch("http://localhost:8000/auth/reset_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.text();
            setMessage(result);
        } catch (err) {
            setError("An error occurred while resetting the password.");
        }
    };

    return (
        <>
            {/* <NavbarPvc /> */}
            <Container className="mt-5" style={{ maxWidth: "600px" }}>
                <h3 className="mb-4 text-center">Reset Password</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

                <Form onSubmit={handleSubmit}>
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
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Document Type</Form.Label>
                        <Form.Control
                            type="text"
                            name="document_type"
                            value={formData.document_type}
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
                            pattern={passwordRegex}
                            title="Password must be at least 8 characters, include one letter, one number, and one special character."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            ref={confirmRef}
                            required
                            title="Passwords must match."
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Reset Password
                    </Button>
                </Form>
            </Container>
        </>
        
    );
}
