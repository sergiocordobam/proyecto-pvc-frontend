import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Form, Container, Button } from "react-bootstrap";
import NavbarPvc from "../base/Navbar";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/my-profile");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handle submit")
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            console.log("userCredential")
            const idToken = await userCredential.user.getIdToken();
            console.log("idToken")

            const res = await fetch("http://localhost:8000/auth/verify_token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });
            console.log("res")

            const result = await res.json();
            console.log("result")

            if (res.ok) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", formData.email));
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const documentId = userData.document_id;
    
                    localStorage.setItem("document_id", documentId);
                }
    
                setMessage(`Welcome, UID: ${result.uid}`);
                // window.location.href = "/my-profile";
            } else {
                setMessage("Invalid token");
            }
        } catch (error) {
            console.log("error")
            setMessage("Invalid email or password");
        }
    };

    return (
        <>
            <NavbarPvc />
            <Container className="d-flex justify-content-center align-items-center max-vh-75 bg-light" style={{ maxWidth: '500px' }}>
                <div className="w-100" style={{ maxWidth: '500px' }}>
                    <h2 className="text-center mb-4">Login</h2>
                    {message && <div>{message}</div>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br />
                        <Button type="submit">Login</Button>
                        {/* {message && <div>{message}</div>} */}
                    </Form>
                </div>
            </Container>
            <div className="text-center mt-3">
                <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
        </>
    );
}
