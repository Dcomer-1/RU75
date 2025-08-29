import type { DeletedPDFResponse, StatusResponse, UploadResponse } from "./types";

const API_BASE_URL = 'http://localhost:5000';

export const backendApi = {
    checkStatus: async (): Promise<StatusResponse> => {
	const response = await fetch(`${API_BASE_URL}/Status`);
	if (!response.ok){
	    throw new Error('Failed to check status of server')
	}	
	return response.json();
    },

    uploadPdf: async (file: File, charLimit: number, token: any): 
	Promise<UploadResponse> => {
	const formData = new FormData;
	formData.append('file', file);
	formData.append('charLimit', charLimit.toString());

	const response = await fetch(`${API_BASE_URL}/upload`, {
	    method: 'POST',
	    headers: {
		'Authorization' : `Bearer ${token}`
	    },
	    body: formData,
	});

	if (!response.ok){
	    throw new Error('Failed to upload file');
	}
	return response.json();
    },

    deletePdf: async (file: File, token: any):
	Promise<DeletedPDFResponse> => {
	    const response = await fetch(`${API_BASE_URL}/deletePdf/${file.name}`,{
		method: 'DELETE',
		headers: {
		    'Authorization' : `Bearer ${token}`
		},
	    });
	    
	    if (!response.ok){
		throw new Error
		('Failed to delete file');
	    }
	    return response.json();
    },
};
