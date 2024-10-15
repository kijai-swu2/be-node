const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const db_name = path.join(__dirname, "post.db");
const db = new Database(db_name);
const app = express();

const create_sql = `
  CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(100),
  createAt DATETIME DEFAULT current_timestamp,
  count INT DEFAULT 0,
  isDeleted BOOLEAN DEFAULT FALSE
  );
  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    postID INTEGER,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(postID) REFERENCES posts(id)
  );
  `;
db.exec(create_sql); // Better Sqlite3의 초기화 구문

/* GraphQL 세팅 */
// Schema 설정하기
const schema = buildSchema(`
    type Post {
      id: ID!
      title: String!
      content: String!
      author: String
      createdAt: String!
    }

    input PostInput {
      title: String!
      content: String!
      author: String!
    }

    type Query {
      getPosts: [Post]
      getPost(id: ID!): Post
    }

    type Mutation {
      createPost(input: PostInput): Post
      updatePost(id: ID!, input: PostInput): Post
      deletePost(id: ID!): String
    }
  `);

// Resolver 설정하기
const root = {
  getPosts: () => {
    const stmt = db.prepare(`SELECT * FROM posts WHERE isDeleted = FALSE ORDER BY createdAt DESC;`);
    return stmt.all();
  },
  getPost: ({ id }) => {
    const stmt = db.prepare(`SELECT * FROM posts WHERE id = ? AND isDeleted = FALSE;`);
    return stmt.get(id);
  },
  createPost: ({ input }) => {
    const stmt = db.prepare(`INSERT INTO posts(title, content, author) VALUES (?, ?, ?);`);
    const result = stmt.run(input.title, input.content, input.author);
    return { id: result.lastInsertRowid, ...input };
  },
  updatePost: ({ id, input }) => {
    const stmt = db.prepare(`UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ? AND isDeleted = FALSE;`);
    const result = stmt.run(input.title, input.content, input.author, id);
    return { id: result.lastInsertRowid, ...input };
  },
  deletePost: ({ id }) => {
    const stmt = db.prepare(`UPDATE posts SET isDeleted = TRUE WHERE id = ?;`).run(id);
    return `Post #${id} is successfully deleted.`;
  },
};

// 미들웨어 설정하기
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});
