import React from 'react';
import { useState, useEffect } from 'react';
import './DashboardLayout.css';
import FileListTable from "./FileListTable.jsx";
import DocumentsService from "../../services/DocumentsService.jsx"; // Asegúrate de crear este archivo CSS

const documentsService = DocumentsService
// Componente de Plantilla de Dashboard
function DashboardLayout({ sidebarContent}) {
    const [filesData, setFiles] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('user_id');
            console.log(userId);
            setUserId(userId);
            if (!userId) {
                return;
            }
            const userDocs = await documentsService.getAllUserDocumentsByID(userId);
            console.log("docs? :", userDocs);
            setFiles(userDocs);
        };

        fetchData();
    }, []);
    return (
        <div className="dashboard-container">
            {/* Opcional: Barra Superior / Header */}
            {/* <header className="dashboard-header">
        <h1>Nombre del Dashboard</h1>
        {/* Aquí podrías poner un menú, notificaciones, etc. *}
      </header> */}

            <div className="dashboard-main">
                {/* Barra Lateral */}
                <aside className="dashboard-sidebar">
                    {/* Contenido de la barra lateral (viene de la prop sidebarContent) */}
                    {sidebarContent}
                </aside>


                <main className="dashboard-content">
                    <FileListTable files={filesData} userID={userId}/>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;