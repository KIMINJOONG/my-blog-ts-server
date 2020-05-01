import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import should from "should";

describe("GET hashtags/:tag 는", () => {
    describe("성공시", () => {
        it("tag가 들어간 모든 게시글을 배열형태로 반환한다.", (done) => {
            const param = encodeURIComponent("bboy");
            request(app)
                .get(`/hashtags/${param}?limit=10`)
                .end((err, res) => {
                    should(res.body.data).be.instanceOf(Array);
                    done();
                });
        });
    });
});
