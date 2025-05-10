import React, { useState } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import { Trash3Fill, CheckCircleFill, FileEarmark, Download } from 'react-bootstrap-icons';
import DocumentsService from "../../services/DocumentsService.jsx";

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const inferFileType = (fileName) => {
    const parts = fileName.split('.');
    if (parts.length > 1) {
        return parts.pop().toUpperCase();
    }
    return 'Desconocido';
};

function FileListTable({ files, userID, SetAction }) {
    const validFiles = Array.isArray(files.data) ? files.data : [];
    const [selectedFileIds, setSelectedFileIds] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCloseSuccessModal = () => setShowSuccessModal(false);
    const handleShowSuccessModal = () => setShowSuccessModal(true);

    // ...MISMAS LÓGICAS DE SELECCIÓN, BORRAR, VERIFICAR, DESCARGAR...

    const handleSelectFile = (absPath) => {
        setSelectedFileIds((prevSelected) => {
            if (prevSelected.includes(absPath)) {
                return prevSelected.filter((id) => id !== absPath);
            } else {
                return [...prevSelected, absPath];
            }
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allFileIds = validFiles.map((file) => file.metadata.abs_path);
            setSelectedFileIds(allFileIds);
        } else {
            setSelectedFileIds([]);
        }
    };

    const isAllSelected = validFiles.length > 0 && selectedFileIds.length === validFiles.length;

    const handleDeleteSelected = async () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para borrar.");
            return;
        }
        try {
            await Promise.all(selectedFileIds.map(async (absPath) => {
                const { userId, filename } = DocumentsService.extractUserInfoFromFilePath(absPath);
                await DocumentsService.deleteDocument(userId, filename);
            }));
            handleShowSuccessModal();
            setSelectedFileIds([]);
        } catch (err) {
            alert("Ocurrió un error al borrar: " + (err.message ?? JSON.stringify(err)));
        }
    };

    const handleVerifySelected = async () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para verificar.");
            return;
        }
        const files = [];
        selectedFileIds.forEach((absPath) => {
            const { filename } = DocumentsService.extractUserInfoFromFilePath(absPath);
            files.push(filename);
        });
        const reqBody = {
            owner: parseInt(userID),
            files: files,
            email: localStorage.getItem("email")
        };

        try {
            const response = await DocumentsService.verifyDocument(reqBody);
            if (response.data === "ok") {
                handleShowSuccessModal();
            }
        } catch (err) {
            alert("Error verificando documentos: " + (err.message ?? JSON.stringify(err)));
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para descargar.");
            return;
        }
        const files = [];
        selectedFileIds.forEach((absPath) => {
            const { filename } = DocumentsService.extractUserInfoFromFilePath(absPath);
            files.push(filename);
        });
        const reqBody = {
            owner: userID,
            file_names: files
        };

        try {
            // Implement download logic
            const response = await DocumentsService.downloadDocuments(reqBody);
            handleShowSuccessModal();
        } catch (err) {
            alert("Error al descargar documentos: " + (err.message ?? JSON.stringify(err)));
        }
    };

    if (validFiles.length === 0) {
        return <p>No hay archivos para mostrar.</p>;
    }

    return (
        <div>
            <div className="mb-2">
                <Button
                    variant="danger"
                    onClick={handleDeleteSelected}
                    disabled={selectedFileIds.length === 0}
                    className="me-2"
                >
                    <Trash3Fill className="me-1" />
                    Borrar Seleccionados ({selectedFileIds.length})
                </Button>
                <Button
                    variant="primary"
                    onClick={handleVerifySelected}
                    disabled={selectedFileIds.length === 0}
                    className="me-2"
                >
                    <CheckCircleFill className="me-1" />
                    Verificar Seleccionados ({selectedFileIds.length})
                </Button>
                <Button
                    variant="success"
                    onClick={handleDownloadSelected}
                    disabled={selectedFileIds.length === 0}
                    className="me-2"
                >
                    <Download className="me-1" />
                    Descargar Seleccionados ({selectedFileIds.length})
                </Button>
                {/* Ya NO hay botón de subir aquí */}
            </div>

            {/* MODAL DE ÉXITO */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Operación Exitosa</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <CheckCircleFill size={50} color="green" className="mb-3" />
                    <h4>¡La operación se completó con éxito!</h4>
                    <p>Tu acción ha sido procesada correctamente.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseSuccessModal}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover responsive className="mt-3">
                <thead>
                <tr>
                    <th style={{ width: '50px' }}>
                        <Form.Check
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            disabled={validFiles.length === 0}
                        />
                    </th>
                    <th>Nombre</th>
                    <th>Tipo de documento</th>
                    <th>Tamaño</th>
                    <th>Estado</th>
                    <th>Fecha de Creación</th>
                </tr>
                </thead>
                <tbody>
                {validFiles.map((file) => {
                    if (!file || !file.metadata) return null;
                    const fileName = file.metadata.name
                        ? file.metadata.name.split('/').pop()
                        : file.metadata.abs_path
                            ? file.metadata.abs_path.split('/').pop()
                            : 'Nombre Desconocido';
                    const rawSize = file.metadata.size || 0;
                    const formattedSize = formatBytes(rawSize);

                    const fileType = file.metadata.type
                        ? file.metadata.type
                        : inferFileType(fileName);

                    const creationDate = file.metadata.creation_date
                        ? new Date(file.metadata.creation_date).toLocaleDateString()
                        : 'Fecha Desconocida';
                    const status = file.metadata.status || 'Temporal';

                    const fileId = file.metadata.abs_path;
                    if (!fileId) return null;

                    return (
                        <tr key={fileId}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedFileIds.includes(fileId)}
                                    onChange={() => handleSelectFile(fileId)}
                                />
                            </td>
                            <td><FileEarmark className="me-1" /> {fileName}</td>
                            <td>{fileType}</td>
                            <td>{formattedSize}</td>
                            <td>{status}</td>
                            <td>{creationDate}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </div>
    );
}

export default FileListTable;