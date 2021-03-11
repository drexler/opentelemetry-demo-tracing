import express, { Request, Response } from 'express';
import cors from 'cors';

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = `${__dirname}/protos/hello.proto`; 
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

const packageObject: any = grpc.loadPackageDefinition(packageDefinition).helloworld
const hello_client = new packageObject.Greeter(
    "grpc-server:50051", 
    grpc.credentials.createInsecure()
);


const port = process.env.SERVER_PORT || 3050;

const app = express();
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('hi from ACH');
});


app.get('/:test', (req: Request, res: Response) => {
    const param = req.params.test;
    res.status(200).send('hi from ACH- Get');
});

app.get('/grpc/:name', (request: Request, response: Response) => {
    const user = request.params.name;
    console.log('calling into gRPC service'); 
    hello_client.sayHello({name: user}, (err: any, result: any) => {
        response.send(result.message);
    })
})

// start the express server
const server = app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );