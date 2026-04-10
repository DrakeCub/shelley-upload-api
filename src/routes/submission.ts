import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, class: className } = req.body;

  if (!name || !className) {
    return res.status(400).json({ message: "Name and class are required" });
  }

  const { error } = await supabase
    .from("submissions")
    .insert({ name, class: className });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({ message: "Submission saved" });
});

export default router;
