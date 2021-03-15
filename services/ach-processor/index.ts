import express from 'express';
import cors from 'cors';
import {employeesRouter} from './routes';


const port = process.env.SERVER_PORT || 3050;

const app = express();
app.use(cors());
app.use('/employees', employeesRouter);

// Start server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});