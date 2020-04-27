import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import "should";
import User from "../../config/models/User";
import { sequelize } from "../../config/config";
import { savePassword } from "../../utils/password";

describe("GET /users는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" },
    ];
    before(() => {
        return sequelize.sync({ force: true });
    });
    before(() => {
        return User.bulkCreate(users);
    });
    describe("성공시", () => {
        it("유저 객체를 담은 배열로 응답한다.", (done) => {
            request(app)
                .get("/users")
                .end((err, res) => {
                    res.body.data.should.be.instanceOf(Array);
                    done();
                });
        });
    });
});

describe("GET /users/:id 는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" },
    ];
    before(() => {
        return sequelize.sync({ force: true });
    });
    before(() => {
        return User.bulkCreate(users);
    });
    describe("성공시", () => {
        it("id가 1인 유저 객체를 반환한다.", (done) => {
            request(app)
                .get("/users/1")
                .end((err, res) => {
                    res.body.data.should.have.property("id", 1);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("id가 숫자가 아닐경우는 400으로 응답한다.", (done) => {
            request(app).get("/users/one").expect(400).end(done);
        });
        it("id로 유저를 찾을 수 없는 경우 404로 응답한다.", (done) => {
            request(app).get("/users/999").expect(404).end(done);
        });
    });
});

describe.only("POST users는", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });

    describe("성공시", async () => {
        let name: string = "김";
        let email: string = "test@test.com";
        let password: string = "1234567";
        let body: any;

        before((done) => {
            request(app)
                .post("/users")
                .send({ email, name, password })
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });

        it("생성된 유저 객체를 반환한다", (done) => {
            body.data.should.have.property("id");
            done();
        });
    });
});

describe("PUT /users/:id", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" },
    ];

    before(() => {
        return sequelize.sync({ force: true });
    });
    before(() => {
        return User.bulkCreate(users);
    });

    describe("성공시", () => {
        it("변경된 name을 응답한다.", (done) => {
            const name = "kimInJoong";
            request(app)
                .put("/users/1")
                .send({ name })
                .end((err, res) => {
                    res.body.data.should.have.property("name", name);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("정수가 아닌 id의 경우 400을 응답한다", (done) => {
            request(app).put("/users/one").expect(400).end(done);
        });

        it("name이 없을 경우 400을 응답한다", (done) => {
            request(app).put("/users/1").send({}).expect(400).end(done);
        });

        it("없는 유저일 경우 404를 응답한다", (done) => {
            const name = "kimInJoong";
            request(app).put("/users/999").send({ name }).expect(404).end(done);
        });
    });
});

describe("DELETE /users/:id는", () => {
    const users = [
        { name: "alice", email: "test@test.com", password: "test1234" },
        { name: "bek", email: "test@test1.com", password: "test123" },
        { name: "chris", email: "test@test2.com", password: "test12" },
    ];

    before(() => {
        return sequelize.sync({ force: true });
    });
    before(() => {
        return User.bulkCreate(users);
    });

    describe("성공시", () => {
        it("200을 반환한다.", (done) => {
            request(app).delete("/users/1").expect(200).end(done);
        });
    });

    describe("실패시", () => {
        it("아이디가 숫자가 아닐경우 400을 반환한다", (done) => {
            request(app).delete("/users/one").expect(400).end(done);
        });

        it("없는 유저일경우 404를 반환한다.", (done) => {
            request(app).delete("/users/999").expect(404).end(done);
        });
    });
});

// describe("POST /users/login은", () => {
//     const user = {
//         name: "alice",
//         email: "test@test.com",
//         password: "test1234",
//     };

//     before(async () => {
//         const hashedPassword = await savePassword(user.password);
//         user.password = hashedPassword!;
//         await User.create(user);
//     });

//     describe("성공시", () => {
//         const user = { email: "test@test.com", password: "test1234" };
//         it("token을 반환한다", (done) => {
//             request(app)
//                 .post(`/users/login`)
//                 .send(user)
//                 .end((err, res) => {
//                     res.body.data.should.be.instanceOf(String);
//                 });
//             done();
//         });
//     });

//     after(async () => {
//         return await User.deleteMany({});
//     });
// });

// describe.only("GET /users/me", () => {
//     const user = {
//         name: "alice",
//         email: "test@test.com",
//         password: "test1234",
//     };
//     let token = "";

//     before(async () => {
//         const hashedPassword = await savePassword(user.password);
//         user.password = hashedPassword!;
//         await User.create(user);
//     });
//     describe("로그인 시도", () => {
//         const loginUser = {
//             email: "test@test.com",
//             password: "test1234",
//         };

//         it("성공시 토큰 발급 후 유저 가져오기", (done) => {
//             request(app)
//                 .post("/users/login")
//                 .send(loginUser)
//                 .end((err, res) => {
//                     token = res.body.data;
//                     request(app)
//                         .get("/users/me")
//                         .set("Authorization", token)
//                         .end((err, res) => {
//                             res.body.data.should.have.property(
//                                 "email",
//                                 loginUser.email
//                             );
//                             done();
//                         });
//                 });
//         });
//     });

//     after(async () => {
//         return await User.deleteMany({});
//     });
// });
