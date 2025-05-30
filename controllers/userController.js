const User = require("../models/User");
const Exercise = require("../models/Exercise");

exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const newUser = new User({ username });
    const savedUser = await newUser.save();

    res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add exercise to user
exports.addExercise = async (req, res) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create exercise
    const exerciseData = {
      userId: _id,
      description,
      duration: parseInt(duration),
      ...(date ? { date: new Date(date) } : {}),
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user logs
exports.getUserLogs = async (req, res) => {
  try {
    const userID = req.params._id;
    const { from, to, limit } = req.query;

    let filter = { userID };

    if (from || to) {
      filter.date = {};

      if (from) {
        filter.date.$gte = new Date(from);
      }

      if (to) {
        filter.date.$lte = new Date(to);
      }
    }

    let query = Exercise.find(filter);

    if (limit) {
      query = query.limit(Number(limit));
    }

    const exercises = await query.exec();
    res.json({
      count: exercises.length,
      log: exercises,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
