import { useEffect, useState } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

function NavbarPvc() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const showLogout = !['/', '/login', '/register'].includes(currentPath);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked && !user && !['/', '/login', '/register'].includes(currentPath)) {
      localStorage.setItem('user_id', user.id);
      navigate('/');
    }
  }, [authChecked, user, currentPath, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 px-4">
      <Navbar.Brand href="/">Operador PVC</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        {user && (
          <Navbar.Text className="me-3">
            Welcome, {user.displayName || user.email}
          </Navbar.Text>
        )}
        {showLogout && (
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarPvc;
