const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const { generateAccessToken, generateRefreshToken } = require("../utils/token"); // 로그인 시 사용할 액세스 토큰 모듈
const jwt = require("jsonwebtoken");

// 유지 기간이 긴 Refresh token끼리 비교해서 같을 시 Access token을 재발급하기
const refresh = (req, res) => {
  const { token } = req.body;
  if (!token) res.sendStatus(401);
  jwt.verify(token, "refresh_secret", (err, user) => {
    console.log(req.body);
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({
      accessToken,
    });
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // email을 이용해 등록된 회원의 정보를 가져오기
    const user = await userService.findUserByEmail(email);
    if (!user) {
      // 등록된 회원 중에 해당하는 email이 없다면
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // 현재 입력된 비밀번호와 등록된 인증정보를 비교하기: bcrypt 함수 사용
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  console.log(req.body);
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // req에서 받은 비밀번호를 암호화: sort를 추가해 같은 비밀번호도 다른 규칙으로 해쉬되도록 설정

  try {
    const user = await userService.createUser({
      email: email,
      name: name,
      password: hashedPassword,
    });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
};
