const express = require("express");
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/auth_middleward");
const router = express.Router();

router.post("/", authenticateToken, postController.createPost); // 게시글을 생성 컨트롤러를 실행하기 전에 로그인 체크를 먼저 실행
router.get("/:id", postController.findPostById);
router.get("/", postController.findAllPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
