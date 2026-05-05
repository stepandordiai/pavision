import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.get("/health", (req, res) => {
	try {
		res.status(200).json({
			status: "ok",
			uptime: productRoutes.uptime(),
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
