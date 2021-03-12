import supertest from "supertest";
import StatusCodes from "http-status-codes";
import { SuperTest, Test } from "supertest";

import { User, IUser } from "@entities/user.model";
import { pErr } from "@shared/functions";
import { paramMissingError } from "@shared/constants";
import { IReqBody, IResponse } from "../support/types";
import UserService from "@service/entities/user.service";

const user1 = new User(
  "id1",
  "rev1",
  "sean",
  null,
  "Sean",
  "Maxwell",
  "sean.maxwell@gmail.com",
  true
);
const user2 = new User(
  "id2",
  "rev2",
  "john",
  null,
  "John",
  "Smith",
  "john.smith@gmail.com",
  true
);
const user3 = new User(
  "id3",
  "rev3",
  "gordan",
  null,
  "Gordan",
  "Freeman",
  "gordan.freeman@gmail.com",
  true
);

describe("Users Routes", () => {
  const usersPath = "/api/users";
  const getUsersPath = `${usersPath}/all`;
  const addUsersPath = `${usersPath}/add`;
  const updateUserPath = `${usersPath}/update`;
  const deleteUserPath = `${usersPath}/delete/:id`;

  const { BAD_REQUEST, CREATED, OK } = StatusCodes;
  let agent: SuperTest<Test>;

  beforeAll((done) => {
    done();
  });

  describe(`"GET:${getUsersPath}"`, () => {
    it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
      // Setup spy
      const users = [user1, user2, user3];
      spyOn(UserService.prototype, "getAll").and.returnValue(
        Promise.resolve(users)
      );
      // Call API
      agent.get(getUsersPath).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        // Caste instance-objects to 'User' objects
        const respUsers = res.body.users;
        const retUsers: User[] = respUsers.map((user: IUser) => {
          return new User(
            user._id,
            user._rev,
            user.username,
            user.password,
            user.firstName,
            user.lastName,
            user.email
          );
        });
        expect(retUsers).toEqual(users);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
      // Setup spy
      const errMsg = "Could not fetch users.";
      spyOn(UserService.prototype, "getAll").and.throwError(errMsg);
      // Call API
      agent.get(getUsersPath).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(errMsg);
        done();
      });
    });
  });

  describe(`"POST:${addUsersPath}"`, () => {
    const callApi = (reqBody: IReqBody) => {
      return agent.post(addUsersPath).type("form").send(reqBody);
    };

    const userData = {
      user: user1,
    };

    it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
      // Setup Spy
      spyOn(UserService.prototype, "add").and.returnValue(Promise.resolve(userData.user));
      // Call API
      agent
        .post(addUsersPath)
        .type("form")
        .send(userData)
        .end((err: Error, res: IResponse) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.error).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
      // Call API
      callApi({}).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(paramMissingError);
        done();
      });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
      // Setup spy
      const errMsg = "Could not add user.";
      spyOn(UserService.prototype, "add").and.throwError(errMsg);
      // Call API
      callApi(userData).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(errMsg);
        done();
      });
    });
  });

  describe(`"PUT:${updateUserPath}"`, () => {
    const callApi = (reqBody: IReqBody) => {
      return agent.put(updateUserPath).type("form").send(reqBody);
    };

    const userData = {
      user: user1,
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
      // Setup spy
      spyOn(UserService.prototype, "update").and.returnValue(Promise.resolve(userData.user));
      // Call Api
      callApi(userData).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
      // Call api
      callApi({}).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(paramMissingError);
        done();
      });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
      // Setup spy
      const updateErrMsg = "Could not update user.";
      spyOn(UserService.prototype, "update").and.throwError(updateErrMsg);
      // Call API
      callApi(userData).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(updateErrMsg);
        done();
      });
    });
  });

  describe(`"DELETE:${deleteUserPath}"`, () => {
    const callApi = (id: number) => {
      return agent.delete(deleteUserPath.replace(":id", id.toString()));
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
      // Setup spy
      spyOn(UserService.prototype, "delete").and.returnValue(Promise.resolve(new User()));
      // Call api
      callApi(5).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
      // Setup spy
      const deleteErrMsg = "Could not delete user.";
      spyOn(UserService.prototype, "delete").and.throwError(deleteErrMsg);
      // Call Api
      callApi(1).end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(deleteErrMsg);
        done();
      });
    });
  });
});
