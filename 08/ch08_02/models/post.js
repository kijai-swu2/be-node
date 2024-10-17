module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.STRING,
    author: DataTypes.STRING(50),
    fileName: DataTypes.STRING,
  });
  // API에서 Post 정보 호출 시 게시글과 함께 댓글 정보를 호출하기 위해 1:N 관계 설정
  Post.associate = function (models) {
    Post.hasMany(models.Comment);
  };
  return Post;
};
