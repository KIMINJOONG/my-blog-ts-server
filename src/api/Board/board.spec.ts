import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import should from "should";
import Board from "../../models/Board";

describe("GET boards는", () => {
    const boards = [
        { title: "제목1", content: "내용1", category: 1 },
        { title: "제목2", content: "내용2", category: 2 },
        { title: "제목3", content: "내용3", category: 3 }
    ];

    before(async () => {
        await Board.create(boards);
    });
    describe("성공시", () => {
        it("유저 객체를 담은 배열로 응답한다.", done => {
            request(app)
                .get("/boards")
                .end((err, res) => {
                    should(res.body.data).be.instanceOf(Array);
                    done();
                });
        });
    });

    after(async () => {
        await Board.deleteMany({});
    });
});

describe("GET boards/:id는", () => {
    const boards = [
        { title: "제목1", content: "내용1", category: 1 },
        { title: "제목2", content: "내용2", category: 2 },
        { title: "제목3", content: "내용3", category: 3 }
    ];

    let boardId: string = "";

    before(async () => {
        await Board.create(boards);
        const board = await Board.findOne({ name: "제목1" });
        if (board) boardId = board.id;
    });

    describe("성공시", () => {
        it(`id가 ${boardId}인 객체를 반환한다.`, done => {
            request(app)
                .get(`/boards/${boardId}`)
                .end((err, res) => {
                    should(res.body.data).have.property("_id", boardId);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("id로 게시글을 찾을 수 없는 경우 404로 응답한다.", done => {
            request(app)
                .get("/boards/999")
                .expect(404)
                .end(done);
        });
    });

    after(async () => {
        await Board.deleteMany({});
    });
});

describe("POST boards는", () => {
    before(async () => {
        return await Board.remove({});
    });

    describe("성공시", () => {
        let title: string = "제목333";
        let content: string = "내용ㅇ용용";
        let category: number = 12;
        let body: any;
        before(done => {
            request(app)
                .post("/boards")
                .send({ title, content, category })
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });

        it("생성된 유저 객체를 반환한다.", done => {
            body.data.should.have.property("_id");
            done();
        });

        after(async () => {
            return await Board.deleteMany({});
        });
    });
});

describe("PUT boards/:id 는 ", () => {
    const boards = [
        { title: "제목1", content: "내용1", category: 1 },
        { title: "제목2", content: "내용2", category: 2 },
        { title: "제목3", content: "내용3", category: 3 }
    ];

    let boardId: string = "";

    before(async () => {
        await Board.create(boards);
        const board = await Board.findOne({ title: "제목1" });
        if (board) boardId = board.id;
    });
    describe("성공시", () => {
        const title = "제목1 수정";
        it("변경된 유저 객체를 반환한다.", done => {
            request(app)
                .put(`/boards/${boardId}`)
                .send({ title })
                .end((err, res) => {
                    res.body.data.should.have.property("title", title);
                });
            done();
        });
    });

    describe("실패시", () => {
        it("존재하지 않는 유저일 경우 404로 응답한다", done => {
            request(app)
                .put("/boards/12312")
                .expect(404)
                .end(done);
        });
    });

    after(async () => {
        return await Board.deleteMany({});
    });
});

describe.only("DELETE /boards/:id는", () => {
    const boards = [
        { title: "제목1", content: "내용1", hashtags: ["#bboy", "#break"] },
        { title: "제목2", content: "내용2", category: ["#bboy", "#break"] },
        { title: "제목3", content: "내용3", category: ["#bboy", "#break"] }
    ];

    let boardId: string = "";

    before(async () => {
        await Board.create(boards);
        const board = await Board.findOne({ title: "제목1" });
        if (board) boardId = board.id;
    });
    describe("성공시", () => {
        it("200을 응답한다", done => {
            request(app)
                .delete(`/boards/${boardId}`)
                .expect(200)
                .end(done);
        });
    });

    describe("실패시", () => {
        it("없는 유저일경우 404를 반환한다.", done => {
            request(app)
                .delete(`/boards/23213a`)
                .expect(404)
                .end(done);
        });
    });
    after(async () => {
        return await Board.deleteMany({});
    });
});
