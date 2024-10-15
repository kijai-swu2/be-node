const { Sequelize, Model, DataTypes } = require("sequelize");

// Sequelize 객체 생성 및 Sqlite3 DB 선택하기
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "post.db",
});

// User 모델을 생성하기 - CREATE TABLE 구문과 유사
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
});

// 비동기 처리(Await)를 위해 빈 Async 함수를 만들기
(async () => {
  // 실제 모델, 데이터를 생성하고 호출하는 연습하기
  await sequelize.sync({ force: false });

  // User 추가하기
  const user1 = await User.create({
    username: "admin",
    email: "admin@a.com",
  });

  // User 목록 호출하기
  const users = await User.findAll();
  console.log(`users: ${JSON.stringify(users)}`);

  // User 호출하기
  const user = await User.findOne({
    where: {
      username: "user 1",
    },
  });
  console.log(`user: ${JSON.stringify(user)}`);

  // User 정보 업데이트하기
  await User.update(
    {
      username: "admin",
      email: "admin@a.com",
    },
    {
      where: {
        id: 1,
      },
    }
  );

  // User 정보 삭제하기
  await User.destroy({
    where: {
      id: 8,
    },
  });
})();
