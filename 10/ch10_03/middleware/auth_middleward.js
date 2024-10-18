// 로그인을 검증해주는 미들웨어를 생성해 프로젝트에 어디에서든 이용할 수 있게 하기
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    // "Authorization: Bearer ${ token }"일 때 token만 분리해 사용하기 위해 split 함수를 사용
    token = req.headers.authorization.split(" ")[1]; // 띄어쓰기를 기준으로 2개의 값으로 분리: 실제 토큰의 값은 [1]번째 값
  }
  if (!token) res.sendStatus(401);

  jwt.verify(token, "access_secret", (err, user) => {
    if (err) res.sendStatus(401);
    req.user = user;
    next(); // 다음 미들웨어로 제어를 넘기고, 다음 미들웨어가 없을 시 현재 미들웨어를 장착한 라우터가 실행
  });
};

module.exports = {
  authenticateToken,
};
