import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import should from "should";
import Board from "../../config/models/Board";
import { sequelize } from "../../config/config";
import User from "../../config/models/User";

describe("GET boards는", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });

    before(() => {
        const boards = [
            { title: "test", content: "내용1" },
            { title: "test2", content: "내용2" },
            { title: "제목3", content: "내용3" },
        ];
        return Board.bulkCreate(boards);
    });
    describe("성공시", () => {
        it("유저 객체를 담은 배열로 응답한다.", (done) => {
            request(app)
                .get("/boards")
                .end((err, res) => {
                    should(res.body.data).be.instanceOf(Array);
                    done();
                });
        });
    });

    describe("검색일경우", () => {
        it("검색 조건에 맞는 리스트를 담은 배열로 응답한다", (done) => {
            request(app)
                .get("/boards?title=test")
                .end((err, res) => {
                    console.log("yaaa : ", res.body.data);
                    should(res.body.data).be.instanceOf(Array);
                    done();
                });
        });
    });
});

describe("GET boards/:id는", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });

    before(() => {
        const boards = [
            { title: "제목1", content: "내용1" },
            { title: "제목2", content: "내용2" },
            { title: "제목3", content: "내용3" },
        ];
        return Board.bulkCreate(boards);
    });

    describe("성공시", () => {
        it(`id가 1인 객체를 반환한다.`, (done) => {
            request(app)
                .get(`/boards/1`)
                .end((err, res) => {
                    should(res.body.data).have.property("id", 1);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("게시글 id값이 숫자가 아닐경우 404를 리턴", (done) => {
            request(app).put("/boards/one").expect(404).end(done);
        });

        it("id로 게시글을 찾을 수 없는 경우 400로 응답한다.", (done) => {
            request(app).get("/boards/999").expect(400).end(done);
        });
    });
});

describe.only("POST boards는", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });
    describe.only("성공시", () => {
        before(() => {
            const users = [
                { userId: "test", name: "alice", password: "test" },
                { userId: "hehe", name: "bek", password: "test" },
                { userId: "huhu", name: "chris", password: "test" },
            ];
            return User.bulkCreate(users);
        });
        let body: any;
        let board = {
            title: "제목",
            content: "내용",
        };

        it("생성된 보드객체를 반환함", (done) => {
            request(app)
                .post("/boards")
                .send(board)
                .expect(201)
                .end((err, res) => {
                    should(res.body.data).have.property("id");
                    done();
                });
        });
    });
});

describe("PUT boards/:id 는 ", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });

    before(() => {
        const boards = [
            { title: "제목1", content: "내용1" },
            { title: "제목2", content: "내용2" },
            { title: "제목3", content: "내용3" },
        ];
        return Board.bulkCreate(boards);
    });

    describe("성공시", () => {
        const title: string = "제목 수정";

        it("수정한 게시글 객체를 반환", (done) => {
            const title = "update";
            request(app)
                .put("/boards/1")
                .send({ title })
                .end((err, res) => {
                    should(res.body.data).have.property("title", title);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("게시글 id값이 숫자가 아닐경우 404를 리턴", (done) => {
            request(app).put("/boards/one").expect(404).end(done);
        });

        it("존재하지 않는 게시글일 경우 400을 리턴", (done) => {
            request(app).put("/boards/999").expect(400).end(done);
        });
    });
});

describe("DELETE /boards/:id는", () => {
    before(() => {
        return sequelize.sync({ force: true });
    });

    before(() => {
        const boards = [
            { title: "제목1", content: "내용1" },
            { title: "제목2", content: "내용2" },
            { title: "제목3", content: "내용3" },
        ];
        return Board.bulkCreate(boards);
    });
    describe("성공시", () => {
        it("200을 응답한다", (done) => {
            request(app).delete(`/boards/1`).expect(200).end(done);
        });
    });

    describe("실패시", () => {
        it("게시글 id값이 숫자가 아닐경우 404를 리턴", (done) => {
            request(app).put("/boards/one").expect(404).end(done);
        });

        it("없는 게시글일경우 400을 반환한다.", (done) => {
            request(app).delete(`/boards/23213a`).expect(400).end(done);
        });
    });
});
