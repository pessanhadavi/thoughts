const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = class ThoughtController {
  static async showThoughts(req, res) {
    res.render("thoughts/home");
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Thought,
      plain: true
    });

    const thoughts = user.Thoughts.map((result) => result.dataValues);

    let emptyThoughts = true;

    if (thoughts.length > 0) {
      emptyThoughts = false;
    }

    console.log(thoughts);
    console.log(emptyThoughts);

    res.render("thoughts/dashboard", { thoughts, emptyThoughts });
  }

  static createThought(req, res) {
    res.render("thoughts/create");
  }
};
