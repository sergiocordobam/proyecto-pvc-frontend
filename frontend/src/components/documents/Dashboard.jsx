import React, { useState, useEffect } from "react"; // Import useState and useEffect
// react-bootstrap components
import {
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    // Make sure you have all necessary react-bootstrap components imported
    // for the FileListTable if it uses them internally
} from "react-bootstrap";
import NavbarPvc from "../base/Navbar.jsx";

// !!! IMPORTANT: You need to import your FileListTable component and DocumentsService
// Adjust the import paths based on your project structure
import FileListTable from "./FileListTable.jsx"; // Assuming FileListTable is in the same directory or adjust path
import DocumentsService from "../../services/DocumentsService.jsx"; // Assuming DocumentsService path

// Instantiate the service
const documentsService = DocumentsService;


function Dashboard() {
    // State from your original DashboardLayout
    const [filesData, setFilesData] = useState([]); // Renamed for clarity (filesData vs files)
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // Effect for fetching data, similar to your original DashboardLayout
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            setError(null); // Reset error

            const storedUserId = localStorage.getItem('user_id'); // Use a different variable name
            console.log("Fetched userId from localStorage:", storedUserId);

            setUserId(storedUserId); // Update state with the found userId

            if (!storedUserId) {
                console.warn("No user_id found in localStorage. Cannot fetch documents.");
                setLoading(false); // Stop loading if no user ID
                // Optionally set a specific error state for "no user ID" or render a login prompt
                return; // Stop execution if no user ID is found
            }

            try {
                const userDocs = await documentsService.getAllUserDocumentsByID(storedUserId);
                console.log("Fetched user documents:", userDocs);
                // Assuming userDocs is an array of document objects
                setFilesData(userDocs); // Update state with fetched documents
            } catch (err) {
                console.error("Error fetching user documents:", err);
                setError("Error en la obtención de documentos"); // Set error state
                setFilesData([]); // Clear files data on error
            } finally {
                setLoading(false); // Stop loading after fetch (success or error)
            }
        };

        fetchData();
        // Dependency array: Ensure the effect runs again if userId state *itself* changes
        // Although in this specific case, you read from localStorage only once on mount.
        // An empty array `[]` makes it run only on mount and unmount. If user_id
        // can change during the component's lifecycle (e.g., after login/logout *without* a page reload),
        // you'd need a different approach (like context or state in a higher component)
        // to trigger a re-fetch here. For simplicity based on your original code, [] is kept.
    }, []);


    return (
        <>
            {/*<NavbarPvc />*/}
            <Container>
                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header> {/* ... title ... */} </Card.Header>
                            <Card.Body> {/* ... chart ... */} </Card.Body>
                            <Card.Footer> {/* ... legend/stats ... */} </Card.Footer>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card>
                            <Card.Header> {/* ... title ... */} </Card.Header>
                            <Card.Body> {/* ... chart ... */} </Card.Body>
                            <Card.Footer> {/* ... legend/stats ... */} </Card.Footer>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md="12"> {/* Use a full-width column or adjust as needed */}
                        <Card className="card-tasks"> {/* Use a Card for styling */}
                            <Card.Header>
                                <Card.Title as="h4">Mis Documentos</Card.Title>
                                <p className="card-category">Archivos asociados a tu cuenta</p>
                            </Card.Header>
                            <Card.Body>
                                {<FileListTable files={filesData} userID={userId}/>}
                                {loading && <p>Cargando documentos...</p>}
                                {error && <p className="text-danger">{error}</p>}
                                {!loading && !error && !userId && (
                                    <p>Por favor, inicia sesión para ver tus documentos.</p>
                                )}
                                {!loading && !error && userId && filesData.length === 0 && (
                                    <p>No se encontraron documentos para este usuario.</p>
                                )}
                                {!loading && !error && filesData.length > 0 && (
                                    // Render your FileListTable component here
                                    <FileListTable files={filesData} userID={userId} />
                                )}
                            </Card.Body>
                            {/* Optional Card Footer */}
                            {/* <Card.Footer>
                 <hr />
                 <div className="stats">
                   <i className="fas fa-sync-alt"></i> Datos actualizados
                 </div>
               </Card.Footer> */}
                        </Card>
                    </Col>
                </Row>
                {/* --- END NEW SECTION --- */}


                {/* Existing template structure: Bottom Table/Charts */}
                <Row>
                    <Col md="6">
                        <Card>
                            <Card.Header> {/* ... title ... */} </Card.Header>
                            <Card.Body> {/* ... chart ... */} </Card.Body>
                            <Card.Footer> {/* ... legend/stats ... */} </Card.Footer>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="card-tasks">
                            <Card.Header> {/* ... title ... */} </Card.Header>
                            <Card.Body>
                                {/* ... Existing Tasks Table Content ... */}
                            </Card.Body>
                            <Card.Footer> {/* ... stats ... */} </Card.Footer>
                        </Card>
                    </Col>
                </Row>


            </Container>
        </>
    );
}

export default Dashboard; // Export the updated Dashboard component