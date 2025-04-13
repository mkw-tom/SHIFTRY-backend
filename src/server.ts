import dotenv from "dotenv";
import app from "./app";
import { PORT } from "./lib/env";
dotenv.config();

const port = PORT || 3000;

app.listen(port, () => {
	console.log(`🚀 Server running on port ${port}`);
});
