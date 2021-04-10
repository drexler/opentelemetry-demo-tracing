import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader';

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const PAYCHECK_SERVICE_URI = process.env.PAYCHECK_SERVICE_URI;

// paycheck service 
const PAYCHECK_PROTO_PATH = `${__dirname}/protos/paycheck.proto`; 
const paycheckPackageDefinition = protoLoader.loadSync(PAYCHECK_PROTO_PATH, protoOptions);
const paycheckPackageObject: any = grpc.loadPackageDefinition(paycheckPackageDefinition).paycheck
export const paycheckService = new paycheckPackageObject.PayService(
     PAYCHECK_SERVICE_URI, 
    grpc.credentials.createInsecure()
);