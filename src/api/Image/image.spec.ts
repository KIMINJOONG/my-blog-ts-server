import { expect, should } from "chai";
import request from "supertest";
import app from "../../app";

describe("DELETE images/:imageKey 는", () => {
  describe("성공시", () => {
    it("해당 key의 이미지를 aws에서 삭제한다.", (done) => {
      const param = "bfaf02e298dd3f198779414e58d98e62";
      request(app)
        .delete(`/images/${param}`)
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });
  });
});
