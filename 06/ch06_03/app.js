const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

/* 데이터를 읽기 위한 GraphQL schema 정의하기 */
const schema = buildSchema(`
  type Query { 
    hello: String
    welcome(name: String!): String
  }
`);

/* 요청을 처리하는 Resolver 정의하기 */
const root = {
  hello: () => {
    return "Hello, GraphQL!";
  },
  welcome: ({ name }) => {
    return `Welcome, ${name}`;
  },
};

/* Server Setup */
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);
