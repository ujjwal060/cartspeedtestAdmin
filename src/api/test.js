import axios from "./axios";
  // let adminId = localStorage.getItem('userId')

export const getQA = async (token, offset, limit, filters) => {
  try {
    const response = await axios.post(
      "/admin/QA/getQA",
      { offset, limit, filters },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading videos:", error);
    throw error;
  }
};


export const addQA = async (
  token, 
  sectionName,  
  question, 
  options, 
  answer,
  videoId,
  locationId,
  sectionId,
  adminId
) => {
  try {
    const formattedOptions = options.map((option) => ({
      text: option,
      isCorrect: option === answer,
    }));

    const data = {
      question,
      options: formattedOptions,
      sectionNumber: sectionName,  
      videoId,
      locationId,
      sectionId,
      adminId,
  
    };

    const response = await axios.post("/admin/QA/add", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export const getVideos = async (token,section) => {
  try {
    const response = await axios.post(
      "/admin/QA/getVideos",
      {section},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading videos:", error);
    throw error;
  }
};
