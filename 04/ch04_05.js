console.clear();

const http = require("http");
const url = require("url");
const fs = require("fs");

http
  .createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.setHeader("Content-type", "application/json");

    // URI에 따라 Map 실행하기
    if (path in urlMap) {
      urlMap[path](req, res);
    } else {
      res.end("<h1>Defualt page</h1>");
    }
  })
  .listen(4500);

/* URL별로 실행할 함수 선언하기 */
// Home 페이지
const home = (req, res) => {
  res.end("<h1>Home page</h1>");
};

// 게시글 전체 리스트
const list = (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);
  const resStr = JSON.stringify(result);
  res.end(resStr);
};

// 게시글 상세보기 - 게시글 id 값을 가지고 해당 게시글 호출하기
const view = (req, res) => {
  // test.json 파일 읽고 해석하기
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);
  const posts = result["result"];

  // 브라우저에서 띄운 URL의 id 값 추출하기
  const param = url.parse(req.url, true).query;
  const id = param.id;

  // test.json 파일에서 URL의 id 값과 매칭되는 객체 호출하기
  const post = posts.filter((item) => {
    return item.id == id;
  });

  // 화면에 띄우기
  const postStr = JSON.stringify(post);
  res.end(postStr);
};

// 게시글 추가하기
const write = (req, res) => {
  // 브라우저에서 띄운 URL 분석하기
  const param = url.parse(req.url, true).query;
  const title = param.title;
  const content = param.content;

  // 파일을 읽고 컨텐츠 분석하기
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);

  // 새로운 게시글을 배열에 담기
  const posts = result["result"];
  posts.push({
    id: posts.length + 1,
    title: `${title} #${posts.length + 1}`,
    content: `${content} #${posts.length + 1}`,
  });

  // 추가된 게시글이 담긴 새로운 객체 만들기
  const newData = {
    result: posts,
  };

  // 파일 업데이트하기
  fs.writeFileSync("test.json", JSON.stringify(newData));
  res.end("");
};

const edit = (req, res) => {
  // 브라우저에서 띄운 URL 분석하기
  const param = url.parse(req.url, true).query;
  const id = param.id;
  const title = param.title;
  const content = param.content;

  // 파일을 읽고 컨텐츠 분석하기
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);
  const posts = result["result"];

  // 기존 객체에서 id가 같은 게시물을 찾아 수정된 사항을 적용하기
  const newPost = [];
  posts.forEach((item) => {
    if (item.id == id) {
      item.title = title;
      item.content = content;
      newPost.push(item);
    } else {
      // id가 같은 게시글이 없으면 기존 객체 그대로 적용하기
      newPost.push(item);
    }
  });

  // 수정된 게시글이 담긴 새로운 객체 만들기
  const newData = {
    result: newPost,
  };

  // 파일 업데이트하기
  fs.writeFileSync("test.json", JSON.stringify(newData));
  res.end("");
};

const remove = (req, res) => {
  // 브라우저에서 띄운 URL 분석하기
  const param = url.parse(req.url, true).query;
  const id = param.id;

  // 파일을 읽고 컨텐츠 분석하기
  const data = fs.readFileSync("test.json", "utf-8");
  const result = JSON.parse(data);

  // 기존 객체 중 id가 같은 객체를 제외한 후 새로운 배열에 담기
  const posts = result["result"];
  const newPosts = posts.filter((item) => {
    return item.id != id;
  });

  // 수정된 게시글이 담긴 새로운 객체 만들기
  const newData = {
    result: newPosts,
  };

  // 파일 업데이트하기
  fs.writeFileSync("test.json", JSON.stringify(newData));
  res.end("");
};

/* Map을 이용해 외부의 함수들을 실행시켜 URL을 통합 관리하기 */
const urlMap = {
  "/": home,
  "/list": list,
  "/view": view,
  "/write": write,
  "/edit": edit,
  "/remove": remove,
};
