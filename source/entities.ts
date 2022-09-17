export interface Store {
    id: number, 
    name_store: string
}

export interface systemError {
    code: number;
    message: string;
}

export interface sqlParameter {
    name: string;
    type: any;
    value: string | number;
}