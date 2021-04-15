import { promisify } from 'util';
import { HttpError } from "./models";

// Using the error codes from https://grpc.github.io/grpc/core/md_doc_statuscodes.html
export function convertGrpcToHttpErrorCode(grpcError: any): HttpError {
    switch (grpcError.code) {
        case 3: 
        case 9:
        case 11: 
            return  new HttpError(400, 'Bad request');

        case 5:
            return new HttpError(404, 'The requested resource cannot be found'); 

        case 6: 
            return new HttpError(409, 'The resource already exists'); 

        case 7: 
        case 16:
           return new HttpError(401, 'Permission denied'); 

        default: 
           return new HttpError(500, 'Server ist kaput!'); 
    }
}

 /**
  * Extracts the descriptive message from an RPC Error. 
  * @param rawErrorMessage 
  * @returns 
  */
export function getGrpcErrorMessage(rawErrorMessage: string) : string {
    const messageStartIndex = rawErrorMessage.indexOf(':');
    return rawErrorMessage.substring(messageStartIndex + 1).trim();
}

// Workaround utility for converting @grpc/grpc-js callbacks to promises until it is
// natively offered. Reference: https://github.com/grpc/grpc-node/issues/54
export function promisifyAll(client: any): any {
    const promisifiedFuncs: any = {}; 
    for (const k in client) {
        if (typeof client[k] != 'function') continue;
        promisifiedFuncs[k] = promisify(client[k].bind(client));
    }

    return promisifiedFuncs;
}

export function formatResponse(response: any) : any {
    if (Array.isArray(response) && response.length > 0) {
        return {
            count: response.length,
            results: response,
        }
    }
    if (response && !Array.isArray(response)) {
        return { ...response }
    }

    return undefined;
}