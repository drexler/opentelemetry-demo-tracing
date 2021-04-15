import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from '../utils';

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const DIRECT_DEPOSIT_SERVICE_URI = process.env.DIRECT_DEPOSIT_SERVICE_URI;
const DIRECT_DEPOSIT_PROTO_PATH = `${__dirname}/protos/directdeposit.proto`; 

const directDepositPackageDefinition = protoLoader.loadSync(DIRECT_DEPOSIT_PROTO_PATH, protoOptions);
const directDepositPackageObject: any = grpc.loadPackageDefinition(directDepositPackageDefinition).directdeposit
const directDepositServiceClient = new directDepositPackageObject.DirectDepositService(
    DIRECT_DEPOSIT_SERVICE_URI, 
    grpc.credentials.createInsecure()
);

export const directDepositService = promisifyAll(directDepositServiceClient);