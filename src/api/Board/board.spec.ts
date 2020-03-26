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

describe.only("GET boards/:id는", () => {
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
