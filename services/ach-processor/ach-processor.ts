import express, { Request, Response } from 'express';
import cors from 'cors';

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader';

const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const EMPLOYEE_PROTO_PATH = `${__dirname}/protos/employee.proto`; 

const employeePackageDefinition = protoLoader.loadSync(EMPLOYEE_PROTO_PATH, protoOptions);
const employeePackageObject: any = grpc.loadPackageDefinition(employeePackageDefinition).employee
const employee_client = new employeePackageObject.EmployeeService(
    "employee-service:50052", 
    grpc.credentials.createInsecure()
);


const port = process.env.SERVER_PORT || 3050;

const app = express();
app.use(cors());


app.get('/employee-service', (_request: Request, response: Response) => {
    console.log('calling into employee service'); 
    employee_client.getAllEmployees({}, (err: any, result: any) => {
        response.send(result);
    })
})

// start the express server
const server = app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
});