import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Table,
    Container,
    Row,
    Col,
    Modal
} from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import FileListTable from "./FileListTable.jsx";
import FileUploadForm from "./Form.jsx"; // <--- NO OLVIDES ESTA
import DocumentsService from "../../services/DocumentsService.jsx";

function Dashboard() {
    const [filesData, setFilesData] = useState({ data: [] }); // <-- inicializa con objeto con data vacía
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleShowUploadModal = () => setShowUploadModal(true);
    const handleCloseUploadModal = () => setShowUploadModal(false);

    // Fetch user docs
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const storedUserId = localStorage.getItem('document_id');
            setUserId(storedUserId);

            if (!storedUserId) {
                setLoading(false);
                return;
            }

            try {
                const userDocs = await DocumentsService.getAllUserDocumentsByID(storedUserId);
                setFilesData(userDocs || { data: [] }); // Asegura siempre un objeto con data array
            } catch (err) {
                setError("Error en la obtención de documentos");
                setFilesData({ data: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Para refrescar la lista de documentos tras subir
    const handleUploaded = () => {
        setShowUploadModal(false);
        // Vuelve a cargar los documentos
        // (puedes extraer fetchData a fuera del useEffect si prefieres)
        (async () => {
            setLoading(true);
            const storedUserId = localStorage.getItem('user_id');
            try {
                const userDocs = await DocumentsService.getAllUserDocumentsByID(storedUserId);
                setFilesData(userDocs || { data: [] });
            } catch (err) {
                setError("Error en la obtención de documentos");
            } finally {
                setLoading(false);
            }
        })();
    };

    return (
        <Container>
            <Row>
                <Col md="8">
                    <Card>
                        <Card.Header> {/* ... title ... */} </Card.Header>
                        <Card.Body>
                            <Button
                                variant="success"
                                onClick={handleShowUploadModal}
                                className="me-2"
                            >
                                <Upload className="me-1" />
                                Subir Archivos
                            </Button>

                            <Modal show={showUploadModal} onHide={handleCloseUploadModal} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Subir Archivos</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FileUploadForm onUploaded={handleUploaded} />
                                </Modal.Body>
                            </Modal>
                        </Card.Body>
                        <Card.Footer> {/* ... legend/stats ... */} </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Card className="card-tasks">
                        <Card.Header>
                            <Card.Title as="h4">Mis Documentos</Card.Title>
                            <p className="card-category">Archivos asociados a tu cuenta</p>
                        </Card.Header>
                        <Card.Body>
                            {loading && <p>Cargando documentos...</p>}
                            {error && <p className="text-danger">{error}</p>}
                            {!loading && !error && !userId && (
                                <p>Por favor, inicia sesión para ver tus documentos.</p>
                            )}
                            {!loading && !error && userId && filesData.data.length === 0 && (
                                <p>No se encontraron documentos para este usuario.</p>
                            )}
                            {!loading && !error && filesData.data.length > 0 && (
                                <FileListTable files={filesData} userID={userId} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Más contenido aquí... */}
        </Container>
    );
}

export default Dashboard;