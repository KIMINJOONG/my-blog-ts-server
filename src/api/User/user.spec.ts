import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import "should";
import User from "../../models/User";

describe("POST users는", () => {
    before(async () => {
        return await User.remove({});
    });
    describe("성공시", () => {
        let name: string = "김";
        let email: string = "test@test.com";
        let password: string = "1234567";
        let body: any;

        before(done => {
            request(app)
                .post("/users")
                .send({ name, email, password })
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });

        it("생성된 유저 객체를 반환한다.", done => {
            console.log(body.data);
            body.user.should.have.property("_id");
            done();
        });
    });
});
