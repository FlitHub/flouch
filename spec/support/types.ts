import { Response } from 'supertest';
import { IUser } from '@entities/user';


export interface IResponse extends Response {
    body: {
        users: IUser[];
        error: string;
    };
}

export interface IReqBody {
    user?: IUser;
}
