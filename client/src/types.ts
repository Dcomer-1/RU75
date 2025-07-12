export interface LineInfo {
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
