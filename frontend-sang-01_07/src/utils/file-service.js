import { getToken } from "./helper";

const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fileUploadService(image) {
  const token = getToken();
  const url = `${URL_SERVER}/upload`;

  const formData = new FormData();
  formData.append("files", image);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function fileDeleteService(imageId) {
  const token = getToken();
  const url = `${URL_SERVER}/upload/files/${imageId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
