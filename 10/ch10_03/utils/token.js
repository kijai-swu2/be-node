const jwt = require("jsonwebtoken");

// 사용자 검증을 위한 단기 토큰을 생성하기: 15분 동안 유지
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "access_secret",
    { expiresIn: "15m" }
  );
};

// 로그인을 유지해주는 토큰을 생성하기: 14일까지 유지
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "refresh_secret",
    { expiresIn: "14d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
