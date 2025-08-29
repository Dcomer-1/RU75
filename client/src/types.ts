export interface LineInfo {
    id: string;
    page : number;
    lineNumber : number;
    charlength : number; 
    text : string;
    'exceeds limit' : boolean;
}

export interface UploadResponse {
    message : string;
    filename : string; 
    'character limit' : number;
    totalLines : number;
    longLinesCount : number;
    'long lines' : LineInfo[];
}
 
export interface StatusResponse {
    Status : string;
    Time : string;
}

export type DeleteSuccessResponse = {
    [filename : string] : 'Successfully Deleted Pdf';
}

export type DeleteErrorResponse = {
    error : 'Error Deleteing Pdf';
}

