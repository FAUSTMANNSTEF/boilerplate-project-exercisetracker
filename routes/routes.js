const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/api/users", userController.createUser);
router.get("/api/users", userController.getAllUsers);

router.post("/api/users/:_id/exercises", userController.addExercise);
router.get("/api/users/:_id/logs", userController.getUserLogs);

module.exports = router;
