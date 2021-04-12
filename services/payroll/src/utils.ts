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