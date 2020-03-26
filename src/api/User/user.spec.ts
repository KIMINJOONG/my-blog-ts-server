import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import "should";
import User from "../../models/User";

describe.only("GET users는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" }
    ];

    before(async () => {
        await User.create(users);
    });
    describe("성공시", () => {
        it("유저 객체를 담은 배열로 응답한다.", done => {
            request(app)
                .get("/users")
                .end((err, res) => {
                    res.body.data.should.be.instanceOf(Array);
                    done();
                });
        });
    });

    after(async () => {
        await User.deleteMany({});
    });
});

describe("GET users/:id는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" }
    ];

    let userId: string = "";

    before(async () => {
        await User.create(users);
        const user = await User.findOne({ name: "alice" });
        if (user) userId = user.id;
    });

    describe("성공시", () => {
        it(`id가 ${userId}인 객체를 반환한다.`, done => {
            request(app)
                .get(`/users/${userId}`)
                .end((err, res) => {
                    res.body.data.should.have.property("_id", userId);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("id로 유저를 찾을 수 없는 경우 404로 응답한다.", done => {
            request(app)
                .get("/users/999")
                .expect(404)
                .end(done);
        });
    });

    after(async () => {
        await User.deleteMany({});
    });
});

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
            body.user.should.have.property("_id");
            done();
        });

        after(async () => {
            return await User.deleteMany({});
        });
    });
});

describe("PUT users/:id 는 ", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" }
    ];

    let userId: string = "";

    before(async () => {
        await User.create(users);
        const user = await User.findOne({ name: "alice" });
        if (user) userId = user.id;
    });
    describe("성공시", () => {
        const name = "kim";
        it("변경된 유저 객체를 반환한다.", done => {
            request(app)
                .put(`/users/${userId}`)
                .send({ name })
                .end((err, res) => {
                    res.body.data.should.have.property("name", name);
                });
            done();
        });
    });

    describe("실패시", () => {
        it("존재하지 않는 유저일 경우 404로 응답한다", done => {
            request(app)
                .put("/users/12312")
                .expect(404)
                .end(done);
        });
    });

    after(async () => {
        return await User.deleteMany({});
    });
});

describe.only("DELETE /users/:id는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" }
    ];

    let userId: string = "";

    before(async () => {
        await User.create(users);
        const user = await User.findOne({ name: "alice" });
        if (user) userId = user.id;
    });
    describe("성공시", () => {
        it("200을 응답한다", done => {
            request(app)
                .delete(`/users/${userId}`)
                .expect(200)
                .end(done);
        });
    });

    describe("실패시", () => {
        it("없는 유저일경우 404를 반환한다.", done => {
            request(app)
                .delete(`/users/23213a`)
                .expect(404)
                .end(done);
        });
    });
    after(async () => {
        return await User.deleteMany({});
    });
});
