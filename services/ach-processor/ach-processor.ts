import express, { Request, Response } from 'express';
import cors from 'cors';


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

// start the express server
const server = app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );