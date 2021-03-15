import express, { Request, Response } from "express";
import { employeeService } from './remote-services/services';

export const employeesRouter = express.Router();

/**
 * Generates information for all employeees
 */
employeesRouter.get('/', (_request: Request, response: Response) => {
    console.log('calling into employee service'); 
    employeeService.getAllEmployees({}, (err: any, result: any) => {
        response.send(result);
    });
});
