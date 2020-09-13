import request from "supertest";
import app from "../../app";
import { should } from "chai";

should();

describe("PUT comments/:boardId/:commentId는", () => {
    describe("성공시", () => {
        it("수정한 게시글 객체를 반환", (done) => {
            const content = "나 수정";
            request(app)
                .put("/comments/17/41")
                .send({ content })
                .end((err, res) => {
                    res.body.data.should.have.property("content", content);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("정수가 아닌 boardId의 경우 404을 응답한다", (done) => {
            request(app).put("/comments/17/two").expect(404).end(done);
        });

        it("없는 게시글일 경우 400를 응답한다", (done) => {
            const content = "나 수정";
            request(app)
                .put("/comments/999/41")
                .send({ content })
                .expect(400)
                .end(done);
        });

        it("없는 댓글일 경우 400를 응답한다", (done) => {
            const content = "나 수정";
            request(app)
                .put("/comments/17/999")
                .send({ content })
                .expect(400)
                .end(done);
        });
    });
});

describe.only("DELETE comments/:boardId/:commentId는", () => {
    describe("성공시", () => {
        it("삭제한 게시글 객체를 반환", (done) => {
            request(app)
                .delete("/comments/17/41")
                .end((err, res) => {
                    res.body.data.should.have.property("id", 41);
                    done();
                });
        });
    });

    describe("실패시", () => {
        it("정수가 아닌 boardId의 경우 404을 응답한다", (done) => {
            request(app).delete("/comments/17/two").expect(404).end(done);
        });

        it("없는 게시글일 경우 400를 응답한다", (done) => {
            const content = "나 수정";
            request(app).delete("/comments/999/41").expect(400).end(done);
        });

        it("없는 댓글일 경우 400를 응답한다", (done) => {
            const content = "나 수정";
            request(app).delete("/comments/17/999").expect(400).end(done);
        });
    });
});
