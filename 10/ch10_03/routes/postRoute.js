const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/", postController.createPost);
router.get("/:id", postController.findPostById);
router.get("/", postController.findAllPosts);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
