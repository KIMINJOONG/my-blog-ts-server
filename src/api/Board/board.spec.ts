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

describe("POST boards는", () => {
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
            content: `<p>헬로우</p><img src=‘data:image/jpeg;base64,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' style=""><span>마지막</span>`,
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

        it.only("img안에 파일들을 가져온다", (done) => {
            request(app)
                .post("/boards")
                .send(board)
                .expect(201)
                .end((err, res) => {
                    // should(res.body.data).have.property("id");
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
