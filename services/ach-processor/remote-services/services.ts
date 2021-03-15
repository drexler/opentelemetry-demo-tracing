import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader';

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

// employee service 
const EMPLOYEE_PROTO_PATH = `${__dirname}/protos/employee.proto`; 
const employeePackageDefinition = protoLoader.loadSync(EMPLOYEE_PROTO_PATH, protoOptions);
const employeePackageObject: any = grpc.loadPackageDefinition(employeePackageDefinition).employee
export const employeeService = new employeePackageObject.EmployeeService(
    "employee-service:50052", 
    grpc.credentials.createInsecure()
);
