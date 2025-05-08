import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios'; // Axios todavía se necesita para las peticiones PUT de subida directa
import './FileUploadForm.css';
import DocumentsService from "../../services/DocumentsService.jsx"; // Importa los estilos CSS

// Importar la función de servicio para solicitar URLs firmadas
const documentsService = DocumentsService // <--- AJUSTA LA RUTA

// Eliminamos API_URL_REQUEST_UPLOAD ya que está en el servicio

const USER_ID_STORAGE_KEY = 'user_id'; // <--- REEMPLAZA si usas otra clave


function FileUploadForm() {
    // --- Estados del Componente ---
    const [selectedFilesInfo, setSelectedFilesInfo] = useState([]);
    const [uploadStatus, setUploadStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    // --- Manejadores de Eventos ---

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const initialFilesInfo = files.map(file => ({
            file: file,
            documentType: ''
        }));
        setSelectedFilesInfo(initialFilesInfo);
        setUploadStatus([]);
    };

    const handleDocumentTypeChange = (index, value) => {
        setSelectedFilesInfo(prevFilesInfo => {
            const newFilesInfo = [...prevFilesInfo];
            newFilesInfo[index].documentType = value;
            return newFilesInfo;
        });
    };

    // --- Lógica de Subida del Formulario ---

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // --- Validaciones ---
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

        if (!storedUserId) {
            appendUploadStatus('Error: No se encontró el ID de usuario en la sesión. Por favor, inicia sesión.', 'danger');
            console.error('USER ID not found in localStorage');
            return;
        }

        let userId;
        try {
            userId = JSON.parse(storedUserId);
            if (typeof userId === 'object' && userId !== null && userId.id !== undefined) {
                userId = userId.id;
            }
        } catch (e) {
            userId = storedUserId;
            console.warn("Could not parse user ID from localStorage as JSON, using raw value.", e);
        }

        const userIdInt = parseInt(userId);
        if (isNaN(userIdInt)) {
            appendUploadStatus('Error: El ID de usuario obtenido no es un número válido.', 'danger');
            console.error('Invalid user ID format obtained from localStorage:', userId);
            return;
        }

        if (selectedFilesInfo.length === 0) {
            alert('Por favor, selecciona al menos un archivo.');
            return;
        }

        const allTypesFilled = selectedFilesInfo.every(fileInfo => fileInfo.documentType.trim() !== '');
        if (!allTypesFilled) {
            alert('Por favor, especifica el tipo de documento para cada archivo.');
            return;
        }

        // --- Iniciar Proceso de Subida ---
        setIsLoading(true);
        setUploadStatus(['Preparando subida...']);

        try {
            // 1. Preparar la información de los archivos para la API
            const filesInfoForApi = selectedFilesInfo.map(fileInfo => ({
                fileName: fileInfo.file.name,
                contentType: fileInfo.file.type || 'application/octet-stream',
                size: fileInfo.file.size,
                documentType: fileInfo.documentType.trim(),
            }));

            appendUploadStatus('Solicitando URLs firmadas a la API...');
            console.log("Cuerpo de la solicitud a la API:", JSON.stringify({ userId: userIdInt, files: filesInfoForApi }, null, 2)); // Log del cuerpo que se enviará


            const responseData = await documentsService.requestSignedUrls(userIdInt, filesInfoForApi);
            console.log("Respuesta de la API:", responseData); // Log de la respuesta de la API
            const documents = responseData.data;

            if (!documents || documents.length === 0) {
                appendUploadStatus('La API no devolvió URLs firmadas válidas.', 'warning');
                setIsLoading(false); // Asegurarse de quitar el loading
                return;
            }

            appendUploadStatus(`URLs firmadas recibidas (${documents.length}). Iniciando subida directa...`, 'success');

            if (documents.length !== selectedFilesInfo.length) {
                appendUploadStatus(`Advertencia: El número de URLs firmadas (${documents.length}) no coincide con el número de archivos seleccionados (${selectedFilesInfo.length}).`, 'warning');
            }


            // 3. Usar las URLs firmadas para subir cada archivo directamente a Cloud Storage (igual que antes)
            const uploadPromises = documents.map(async (documentInfo) => {
                const fileInfo = selectedFilesInfo.find(file => file.file.name === documentInfo.fileName);
                if (!fileInfo) {
                    appendUploadStatus(`Error: No se encontró información para el archivo "${documentInfo.fileName}".`, 'danger');
                    return;
                }
                console.log("fileInfo: ", fileInfo);
                console.log("documentInfo!!!: ", documentInfo);
                const file = fileInfo.file;
                const signedUrl = documentInfo.signedUrl;
                const metadata = documentInfo.customMetadata || {};
                const contentType = documentInfo.contentType || 'application/octet-stream';
                const headers= {
                    'Content-Type': contentType || 'application/octet-stream',
                }
                Object.entries(metadata).forEach(([key, value]) => {
                    headers[key] = value;
                });
                console.log("headers: ", metadata);
                if (!signedUrl) {
                    appendUploadStatus(`Error: La URL firmada para "${file.name}" es inválida.`, 'danger');
                    return;
                }

                appendUploadStatus(`Subiendo "${file.name}" a Cloud Storage...`);
                console.log("contentType: ", file.type);
                try {
                    const uploadResponse = await axios.put(signedUrl, file, {
                        headers:headers,
                    });

                    if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
                        appendUploadStatus(`"${file.name}" subido exitosamente.`, 'success');
                    } else {
                        appendUploadStatus(`Error al subir "${file.name}": ${uploadResponse.status} - ${uploadResponse.statusText}`, 'danger');
                    }
                } catch (uploadError) {
                    appendUploadStatus(`Error de red o subida para "${file.name}": ${uploadError.message}`, 'danger');
                    console.error(`Error al subir "${file.name}":`, uploadError);
                }
            });

            await Promise.all(uploadPromises);

            appendUploadStatus('Proceso de subida completado.', 'info');

        } catch (error) {
            // El error del servicio requestSignedUrls llegará aquí
            appendUploadStatus(`Ocurrió un error: ${error.message}`, 'danger');
            console.error('Error general en el proceso de subida (o en la solicitud de URLs):', error);
        } finally {
            setIsLoading(false);
            // Opcional: Limpiar formulario
            // setSelectedFilesInfo([]);
        }
    };

    // --- Funciones de Utilidad para el Estado ---

    const appendUploadStatus = (message, type = 'info') => {
        setUploadStatus(prevStatus => [...prevStatus, { message, type }]);
    };

    // --- Renderizado ---

    return (
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <Card className="p-4">
                <Card.Title className="text-center mb-4">Subir Archivos</Card.Title>

                <Form onSubmit={handleFormSubmit}>
                    {/* El campo de ID de Usuario fue eliminado */}

                    {/* Campo Seleccionar Archivos */}
                    <Form.Group className="mb-3" controlId="formFileInput">
                        <Form.Label>Seleccionar Archivos:</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            required
                        />
                    </Form.Group>

                    {/* Contenedor para Archivos Seleccionados Dinámicos y sus inputs de tipo */}
                    {selectedFilesInfo.length > 0 && (
                        <div className="mt-3">
                            <h5>Archivos Seleccionados:</h5>
                            {selectedFilesInfo.map((fileInfo, index) => (
                                <div key={index} className="file-info-item">
                                    <p>
                                        <strong>Archivo {index + 1}:</strong> {fileInfo.file.name}
                                    </p>
                                    <Form.Group className="mb-3" controlId={`formDocumentType_${index}`}>
                                        <Form.Label>Tipo de Documento:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ej: Cédula, Recibo, Factura"
                                            value={fileInfo.documentType}
                                            onChange={(e) => handleDocumentTypeChange(index, e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botón de Subir Archivos */}
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3"
                        // Deshabilitado si carga, o no hay archivos seleccionados
                        disabled={isLoading || selectedFilesInfo.length === 0}
                    >
                        {isLoading ? 'Subiendo...' : 'Subir Archivos'}
                    </Button>
                </Form>

                {/* Área de Estado de Subida */}
                {uploadStatus.length > 0 && (
                    <div id="uploadStatus">
                        {uploadStatus.map((status, index) => (
                            <Alert key={index} variant={status.type} className="mt-2 py-2 px-3">
                                <p className={`mb-0 text-${status.type}`}>{status.message}</p>
                            </Alert>
                        ))}
                    </div>
                )}
            </Card>
        </Container>
    );
}

export default FileUploadForm;