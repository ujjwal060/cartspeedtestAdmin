import axios from "./axios";


export const addGLSVR = async (token, requestData) => {
  try {
    const response = await axios.post(
      "/admin/lsv/addGLSVR",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding GLSVR:", error);
    throw error;
  }
};

// export const getGLSVR = async (token) => {
//     try {
//         const response = await axios.get(
//             "/admin/lsv/getGLSVR",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching LSV rules:", error);
//         throw error;
//     }
// };