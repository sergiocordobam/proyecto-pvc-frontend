import axios from 'axios';

const API_URL = process.env.REACT_APP_DOCUMENTS_API_URL_BASE || 'http://localhost:8080';
class DocumentsService {
  async getAllUserDocumentsByID(userId) {
    try {
      const response = await axios.get(`${API_URL}/files/${userId}`);
        return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async requestSignedUrls(userId, filesInfo) {
    const requestBody = {
      userId: userId,
      files: filesInfo,
    };

    try {
      const response = await axios.post(`${API_URL}/files/upload`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          // Si necesitas cabeceras de autenticación (ej. Token JWT), añádelas aquí:
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      // Axios lanza errores para respuestas no 2xx, por lo que si llega aquí, fue 2xx.
      return response.data; // Retorna la data de la respuesta (esperando { documents: [...] })

    }catch (error) {
      console.error('Error solicitando URLs firmadas:', error);
      // Re-lanzar el error para que el componente que llama lo pueda manejar
      throw error;
    }
  }

async deleteDocument(userName, fileName) {
 console.log(`Deleting document for user: ${userName}, file: ${fileName}`);
  try {
    const response = await axios.delete(`${API_URL}/files/${userName}/${fileName}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}
  async verifyDocument(filename) {

  }
  async sendDocument(filename) {

  }
  async downloadDocuments(filename) {

  }
  extractUserInfoFromFilePath(filePath) {
    const components = filePath.split('/');
    const userId = components[0];
    const filename = components.slice(1).join('_');
    console.log("userId: ", userId);
    console.log("filename: ", filename);
    return { userId, filename };
  }
}


export default new DocumentsService();