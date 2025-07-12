import type { StatusResponse, UploadResponse } from "./types";

const API_BASE_URL = 'http://localhost:5000';

export const backendApi = {
    checkStatus: async (): Promise<StatusResponse> => {
	const response = await fetch(`${API_BASE_URL}/Status`);
	if (!response.ok){
	    throw new Error('Failed to check status of server')
	}	
	return response.json();
    },

    uploadPdf: async (file: File, charLimit: number): 
	Promise<UploadResponse> => {
	const formData = new FormData;
	formData.append('file', file);
	formData.append('charLimit', charLimit.toString());

	const response = await fetch(`${API_BASE_URL}/upload`, {
	    method: 'POST',
	    body: formData,
	});

	if (!response.ok){
	    throw new Error('Failed to upload file');
	}
	return response.json();
    },
};
