import { expect, should } from "chai";
import request from "supertest";
import app from "../../app";
import Board from "../../config/models/Board";
import { sequelize } from "../../config/config";
import User from "../../config/models/User";

describe("GET boards는", () => {
  before(() => {
    const boards = [
      { title: "test", content: "내용1" },
      { title: "test2", content: "내용2" },
      { title: "제목3", content: "내용3" },
      { title: "제목4", content: "내용4" },
      { title: "제목5", content: "내용5" },
      { title: "제목6", content: "내용6" },
    ];
    return Board.bulkCreate(boards);
  });
  describe("성공시", () => {
    it("유저 객체를 담은 배열로 응답한다.", (done) => {
      request(app)
        .get("/boards")
        .end((err, res) => {
          res.body.data.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe("검색일경우", () => {
    it("검색 조건에 맞는 리스트를 담은 배열로 응답한다", (done) => {
      request(app)
        .get("/boards?title=test")
        .end((err, res) => {
          res.body.data.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe("limit가 존재할경우", () => {
    it("해당 리미트 값만큼만 리스트를 담은 배열로 응답한다", (done) => {
      request(app)
        .get("/boards?limit=3")
        .end((err, res) => {
          res.body.data.should.have.length(3);
          done();
        });
    });
  });

  describe("page가 1이 아닐경우", () => {
    it("해당 페이지번째의 데이터를 limit값 만큼 담은 배열로 응답한다", (done) => {
      request(app)
        .get("/boards?page=2&limit=3")
        .end((err, res) => {
          res.body.data[0].should.have.property("title", "제목4");
          res.body.data.should.have.length(3);
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
          res.body.data.should.have.property("id", 1);
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
  describe.only("성공시", () => {
    // before(() => {
    //   const users = [
    //     { userId: "test", name: "alice", password: "test" },
    //     { userId: "hehe", name: "bek", password: "test" },
    //     { userId: "huhu", name: "chris", password: "test" },
    //   ];
    //   return User.bulkCreate(users);
    // });
    let body: any;
    let board = {
      title: "제목",
      content: `<div style="box-sizing: border-box; max-width: 100%; white-space: pre; color: rgb(238, 255, 255); background-color: rgb(38, 50, 56); font-family: menlo, monaco, &quot;courier new&quot;, monospace; font-weight: normal; font-size: 12px; line-height: 18px;"><div style="box-sizing: border-box; max-width: 100%; white-space: pre-wrap;"><span style="box-sizing: border-box; color: rgb(137, 221, 255);">@</span><span style="box-sizing: border-box; color: rgb(130, 170, 255);">ForeignKey</span><span style="box-sizing: border-box; color: rgb(238, 255, 255);">(</span><span style="box-sizing: border-box; color: rgb(137, 221, 255);">()</span><span style="box-sizing: border-box; color: rgb(199, 146, 234);">=&gt;</span><span style="box-sizing: border-box; color: rgb(255, 203, 107);">Board</span><span style="box-sizing: border-box; color: rgb(238, 255, 255);">)</span></div><div style="box-sizing: border-box; max-width: 100%; white-space: pre-wrap;"><span style="box-sizing: border-box; color: rgb(137, 221, 255);">@</span><span style="box-sizing: border-box; color: rgb(130, 170, 255);">Column</span></div><div style="box-sizing: border-box; max-width: 100%; white-space: pre-wrap;"><span style="box-sizing: border-box; color: rgb(238, 255, 255);">boardId</span><span style="box-sizing: border-box; color: rgb(137, 221, 255);">?:</span><span style="box-sizing: border-box; color: rgb(255, 203, 107);">number</span><span style="box-sizing: border-box; color: rgb(137, 221, 255);">;</span></div></div><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1em; max-width: 100%;"><br style="box-sizing: border-box; color: rgba(0, 0, 0, 0.65); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"></p><p>#비보이 #김인중</p>"`,
    };

    it("생성된 보드객체를 반환함", (done) => {
      request(app)
        .post("/boards")
        .send(board)
        .expect(201)
        .end((err, res) => {
          res.body.data.should.have.property("id");
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
          res.body.data.should.have.property("title", title);
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

describe("GET /boards/countByDate는", () => {
  describe("성공시", () => {
    it("데일리 게시글 개수 오브젝트를 리턴", (done) => {
      request(app)
        .get("/boards/countByDate")
        .end((err, res) => {
          res.body.data.should.be.a("object");
          done();
        });
    });
  });
});

describe("GET /boards/countByToday는", () => {
  describe("성공시", () => {
    it("오늘 게시글 개수를 리턴", (done) => {
      request(app)
        .get("/boards/countByToday")
        .end((err, res) => {
          console.log(res.body.data);
          done();
        });
    });
  });
});
