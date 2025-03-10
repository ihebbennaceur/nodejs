const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const auth = require("../middleware/auth");

router.post("/", auth, ticketController.createTicket);
router.get("/", auth, ticketController.getTickets);
router.put("/:id", auth, ticketController.updateTicket);
router.put("/:id/close", auth, ticketController.closeTicket);
router.delete("/:id", auth, ticketController.deleteTicket);
router.put("/assign/:id", auth, ticketController.assignTicket);

module.exports = router;
