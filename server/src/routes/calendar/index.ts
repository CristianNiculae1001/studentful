import express from "express";
import { createEvent, fetchEvents, removeEvent, editEvent } from "../../controllers/calendar/index";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/calendar", auth, fetchEvents);
router.post("/calendar", auth, createEvent);
router.delete("/calendar/:id", auth, removeEvent);
router.put("/calendar/:id", auth, editEvent);

export default router;
