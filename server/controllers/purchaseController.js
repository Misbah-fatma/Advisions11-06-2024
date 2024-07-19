const User = require('../model/UserModel');
const Course = require('../model/CourseModel');

exports.buyCourse = async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Course purchased successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPurchasedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchasedCourses');
    res.status(200).json(user.purchasedCourses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};