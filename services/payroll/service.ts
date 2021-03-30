import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import {employeesRouter} from './routes'
import {errorHandler, notFoundHandler} from './middlewares';


const port = process.env.SERVICE_PORT || 55050;

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use('/employees', employeesRouter);
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});