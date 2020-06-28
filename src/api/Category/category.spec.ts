import { expect } from "chai";
import request from "supertest";
import app from "../../app";
import should from "should";
import Category from "../../config/models/Category";

describe("GET /categories 는", () => {
    before(() => {
        const categories = [
            { code: 1, name: "개발" },
            { code: 2, name: "동영상" },
        ];
        return Category.bulkCreate(categories);
    });
    describe("성공시", () => {
        it("모든 category들을 배열 형태로 반환한다.", (done) => {
            request(app)
                .get(`/categories`)
                .end((err, res) => {
                    should(res.body.data).be.instanceOf(Array);
                    done();
                });
        });
    });
});

describe.only("POST /categories는", () => {
    let category = {
        code: 3,
        name: "테스트",
    };
    describe("성공시", () => {
        it("생성된 카테고리를 반환한다.", (done) => {
            request(app)
                .post("/categories")
                .send(category)
                .end((err, res) => {
                    should(res.body.data).have.property("id");
                    done();
                });
        });
    });
});
