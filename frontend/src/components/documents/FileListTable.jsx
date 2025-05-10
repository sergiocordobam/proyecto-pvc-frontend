import React, { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Trash3Fill, CheckCircleFill, SendFill } from 'react-bootstrap-icons';
import DocumentsService from "../../services/DocumentsService.jsx";
// --- Funciones Helper (DEFINIDAS FUERA DEL COMPONENTE) ---

// Helper function to format file size
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper function to infer file type from name (simple extension check)
const inferFileType = (fileName) => {
    const parts = fileName.split('.');
    if (parts.length > 1) {
        return parts.pop().toUpperCase(); // Retorna la extensión en mayúsculas
    }
    return 'Desconocido';
};
const documentsService = DocumentsService

function FileListTable({ files,userID,setDeletedAction,setVerifyAction }) {

    // **** Validar la prop 'files' al inicio ****
    // Si 'files' no es un array válido (ej. undefined, null, no es array), usar un array vacío
    const validFiles = Array.isArray(files.data) ? files.data : [];


    // Estado para manejar los IDs de los archivos seleccionados (usaremos abs_path como ID)
    const [selectedFileIds, setSelectedFileIds] = useState([]);

    // --- Funciones para Manejar Selección ---

    // Manejar la selección de un archivo individual
    const handleSelectFile = (absPath) => { // Usamos abs_path como ID único
        setSelectedFileIds((prevSelected) => {
            if (prevSelected.includes(absPath)) {
                // Si ya estaba seleccionado, lo quitamos
                return prevSelected.filter((id) => id !== absPath);
            } else {
                // Si no estaba seleccionado, lo agregamos
                return [...prevSelected, absPath];
            }
        });
    };

    // Manejar la selección de todos los archivos
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            // Si se marca "Seleccionar Todos", seleccionamos todos los abs_path de los archivos válidos
            const allFileIds = validFiles.map((file) => file.metadata.abs_path);
            setSelectedFileIds(allFileIds);
        } else {
            // Si se desmarca "Seleccionar Todos", limpiamos la selección
            setSelectedFileIds([]);
        }
    };

    // Verificar si todos los archivos están seleccionados (para el checkbox "Seleccionar Todos")
    // Usar validFiles.length aquí
    const isAllSelected = selectedFileIds.length === validFiles.length && validFiles.length > 0;


    // --- Funciones para Acciones (DEFINIDAS DENTRO DEL COMPONENTE PARA ACCEDER AL ESTADO) ---

    const handleDeleteSelected = () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para borrar.");
            return;
        }
        const fetchDeleteData= async (userId,fileName) => {
            const response = await documentsService.deleteDocument(userId,fileName);
            console.log("response: ", response.data);
        }
        selectedFileIds.forEach((absPath) => {
            const { userId, filename } = documentsService.extractUserInfoFromFilePath(absPath);
            fetchDeleteData(userId,filename);

        })

        // ***************************************************************************
    };

    const handleVerifySelected = () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para verificar.");
            return;
        }
        const files=[]
        selectedFileIds.forEach((absPath) => {
            const { userId, filename } = documentsService.extractUserInfoFromFilePath(absPath);
            files.push(filename)

        })
        const reqBody={
            owner: parseInt(userID),
            files: files
        }
        console.log("reqBody: ", reqBody);

        const fetchVerifyData= async()=>{
            const response= await documentsService.verifyDocument(reqBody);
            console.log("response: ", response.data);
        }
        fetchVerifyData()
        // ****** Aquí iría la lógica REAL para verificar ******
        // Típicamente: llamada a API, y luego actualizar el estado de los archivos afectados en la lista.
        // ****************************************************
    };

    const handleSendSelected = () => {
        if (selectedFileIds.length === 0) {
            alert("Selecciona al menos un archivo para enviar.");
            return;
        }
        console.log(">>> Acción ENVIAR solicitada para abs_paths:", selectedFileIds);
        // ****** Aquí iría la lógica REAL para enviar ******
        // **************************************************
    };


    // --- Renderizado del Componente ---

    // Si no hay archivos válidos para mostrar
    if (validFiles.length === 0) {
        // Importante: Considera si quieres mostrar un indicador de carga aquí si el padre
        // está aún esperando la respuesta de la API. El padre debe manejar el estado de carga.
        // Este mensaje es para cuando la lista *finalmente* está vacía.
        return <p>No hay archivos para mostrar.</p>;
    }

    return (
        <div>
            {/* Botones de acción (usar selectedFileIds.length para habilitar/deshabilitar) */}
            <div>
                <Button
                    variant="danger"
                    onClick={handleDeleteSelected}
                    disabled={selectedFileIds.length === 0} // Deshabilitar si no hay nada seleccionado
                    className="me-2" // Margen derecho
                >
                    <Trash3Fill className="me-1" />
                    Borrar Seleccionados ({selectedFileIds.length}) {/* Mostrar cuantos hay seleccionados */}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleVerifySelected}
                    disabled={selectedFileIds.length === 0}
                    className="me-2"
                >
                    Verificar Seleccionados ({selectedFileIds.length})
                </Button>
                <Button
                    variant="success"
                    onClick={handleSendSelected}
                    disabled={selectedFileIds.length === 0}
                >
                    Enviar Seleccionados ({selectedFileIds.length})
                </Button>
            </div>

            {/* Tabla de React-Bootstrap */}
            {/* className="mt-3" añade margen superior de 3 unidades de espaciado Bootstrap */}
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                <tr>
                    {/* Columna para "Seleccionar Todos" */}
                    {/* Checkbox principal para seleccionar/deseleccionar todo */}
                    <th style={{ width: '50px' }}> {/* Darle un ancho fijo para que no se mueva */}
                        <Form.Check
                            type="checkbox"
                            checked={isAllSelected} // Determina si el checkbox está marcado
                            onChange={handleSelectAll} // Manejador para la selección de todo
                            // Deshabilitar el checkbox "Seleccionar Todos" si no hay archivos para seleccionar
                            disabled={validFiles.length === 0}
                        />
                    </th>
                    <th>Nombre</th>
                    <th>Tipo de documento</th>
                    <th>Tamaño</th>
                    <th>Estado</th>
                    <th>Fecha de Creación</th>
                    {/* Si añades acciones por fila, descomenta esta columna */}
                    {/* <th>Acciones</th> */}
                </tr>
                </thead>
                <tbody>
                {/* Mapear sobre el array validFiles para crear cada fila */}
                {validFiles.map((file) => {
                    // Asegurarse de que metadata existe antes de intentar acceder a sus propiedades
                    if (!file || !file.metadata) {
                        console.warn("Skipping file entry due to missing metadata:", file);
                        return null; // Saltar esta entrada si no tiene metadata
                    }

                    // Extraer y formatear data de file.metadata.*
                    // Usar abs_path como fallback si name no existe
                    const fileName = file.metadata.name ? file.metadata.name.split('/').pop() : file.metadata.abs_path ? file.metadata.abs_path.split('/').pop() : 'Nombre Desconocido';
                    const rawSize = file.metadata.size || 0; // Usar 0 si size es undefined/null
                    const formattedSize = formatBytes(rawSize);

                    // Determinar el tipo: usar content_type si existe y no es "undefined", sino inferir de la extensión
                    const fileType = (file.metadata.type)
                        ? file.metadata.type
                        : "Desconocido";

                    // Formatear la fecha de creación
                    const creationDate = file.metadata.creation_date
                        ? new Date(file.metadata.creation_date).toLocaleDateString() // Puedes ajustar el formato (ej. con opciones)
                        : 'Fecha Desconocida';
                    const status = file.metadata.status
                        ?  file.metadata.status
                        : 'Temporal xd';

                    // Usamos abs_path como key porque es único por archivo
                    // Es CRUCIAL usar un ID ÚNICO y ESTABLE como key para que React renderice correctamente
                    const fileId = file.metadata.abs_path;
                    if (!fileId) {
                        console.warn("Skipping file entry due to missing abs_path (required for key):", file);
                        return null; // Saltar si no tiene un ID válido
                    }


                    return (
                        // Usar fileId (abs_path) como key para el <tr>
                        <tr key={fileId}>
                            {/* Celda para el checkbox de selección */}
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    // Marcar si el ID (abs_path) está en la lista de seleccionados
                                    checked={selectedFileIds.includes(fileId)}
                                    // Llamar a la función de selección con el ID (abs_path)
                                    onChange={() => handleSelectFile(fileId)}
                                />
                            </td>
                            {/* Celdas para los datos del archivo, usando la data transformada/formateada */}
                            <td>{fileName}</td>
                            <td>{fileType}</td>
                            <td>{formattedSize}</td>
                            {/* Como el estado no viene en tu JSON actual, ponemos un valor por defecto */}
                            <td>{status}</td> {/* O file.metadata.status si existiera */}
                            <td>{creationDate}</td>
                            {/* Si añades acciones por fila, descomenta esta celda */}
                            {/* <td>
                                <Button variant="outline-primary" size="sm" className="me-1">Ver</Button>
                                <Button variant="outline-danger" size="sm">Borrar</Button>
                            </td> */}
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </div>
    );
}

export default FileListTable;