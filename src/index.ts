import "dotenv/config";
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "https://drakecub.github.io" }));
app.use(express.json());

app.use("/api/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
