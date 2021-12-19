const Thought = require("../models/Thought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ThoughtController {
  static showThoughts(req, res) {
    // check if user is searching
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    // order results, newest first
    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    Thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` }
      },
      order: [["createdAt", order]]
    })
      .then((data) => {
        let thoughtsQty = data.length;

        if (thoughtsQty === 0) {
          thoughtsQty = false;
        }

        const thoughts = data.map((result) => result.get({ plain: true }));

        res.render("thoughts/home", { thoughts, thoughtsQty, search });
      })
      .catch((err) => console.log(err));
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

    // check if user exists
    if (!user) {
      res.redirect("/login");
    }

    const thoughts = user.Thoughts.map((result) => result.dataValues);

    let emptyThoughts = true;

    if (thoughts.length > 0) {
      emptyThoughts = false;
    }

    res.render("thoughts/dashboard", { thoughts, emptyThoughts });
  }

  static createThought(req, res) {
    res.render("thoughts/create");
  }

  static createThoughtSave(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid
    };

    Thought.create(thought)
      .then(() => {
        req.flash("message", "Pensamento criado com sucesso!");
        req.session.save(() => {
          res.redirect("/thoughts/dashboard");
        });
      })
      .catch((err) => console.log(err));
  }

  static removeThought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    Thought.destroy({ where: { id: id, UserId: UserId } })
      .then(() => {
        req.flash("message", "Pensamento removido com sucesso!");
        req.session.save(() => {
          res.redirect("/thoughts/dashboard");
        });
      })
      .catch((err) => console.log(err));
  }

  static updateThought(req, res) {
    const id = req.params.id;

    Thought.findOne({ where: { id: id }, raw: true })
      .then((thought) => {
        res.render("thoughts/edit", { thought });
      })
      .catch((err) => console.log(err));
  }

  static updateThoughtSave(req, res) {
    const id = req.body.id;

    const thought = {
      title: req.body.title
    };

    Thought.update(thought, { where: { id: id } })
      .then(() => {
        req.flash("message", "Pensamento atualizado com sucesso!");
        req.session.save(() => {
          res.redirect("/thoughts/dashboard");
        });
      })
      .catch((err) => console.log(err));
  }
};
