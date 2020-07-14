import { expect, should } from "chai";
import request from "supertest";
import app from "../../app";

describe("GET hashtags/:tag 는", () => {
  describe("성공시", () => {
    it("tag가 들어간 모든 게시글을 배열형태로 반환한다.", (done) => {
      const param = encodeURIComponent("bboy");
      request(app)
        .get(`/hashtags/${param}?limit=10`)
        .end((err, res) => {
          res.body.data.should.be.instanceOf(Array);
          done();
        });
    });
  });
});
