import "dotenv/config";
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload";
import submissionRouter from "./routes/submission";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({ origin: ["https://drakecub.github.io", "http://localhost:4200"] }),
);
app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/submission", submissionRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
