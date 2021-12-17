const express = require("express")
const router = express.Router()
const ThoughtController = require("../controllers/ThoughtController")

// helpers
const checkAuth = require("../helpers/auth").checkAuth

router.get("/add", checkAuth, ThoughtController.createThought)
router.get("/dashboard", checkAuth, ThoughtController.dashboard)
router.get("/", ThoughtController.showThoughts)

module.exports = router