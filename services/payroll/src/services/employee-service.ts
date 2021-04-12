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

const EMPLOYEE_SERVICE_URI = process.env.EMPLOYEE_SERVICE_URI;
const EMPLOYEE_PROTO_PATH = `${__dirname}/protos/employee.proto`; 

const employeePackageDefinition = protoLoader.loadSync(EMPLOYEE_PROTO_PATH, protoOptions);
const employeePackageObject: any = grpc.loadPackageDefinition(employeePackageDefinition).employee
const employeeServiceClient = new employeePackageObject.EmployeeService(
     EMPLOYEE_SERVICE_URI, 
    grpc.credentials.createInsecure()
);

export const employeeService = promisifyAll(employeeServiceClient);



