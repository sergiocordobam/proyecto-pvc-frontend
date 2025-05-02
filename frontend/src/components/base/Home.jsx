import { Button, Container, Card } from 'react-bootstrap';

function Home() {

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center max-vh-75 bg-light" style={{ maxWidth: '500px' }}>
                <div className="w-100" style={{ maxWidth: '500px' }}>
                    <Card className="text-center">
                        <Card.Header>Welcome to Operador PVC</Card.Header>
                        <Card.Body>
                            <Card.Title>Register Now!</Card.Title>
                            <Card.Text>
                                <Button variant='primary' href='/login'>Log in</Button>
                                <br />
                                <Button variant='success' href='/register'>Sign up</Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    );
}

export default Home;
