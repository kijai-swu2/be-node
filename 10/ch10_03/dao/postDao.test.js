const postDao = require("./postDao");

describe("Test DAO", () => {
  test("should", async () => {
    const data = {
      title: "4 - 1",
      content: "4 - 1",
      userId: 4,
    };
    const result = await postDao.createPost(data);
    expect(result.title).toBe(data.title);
  });
});
