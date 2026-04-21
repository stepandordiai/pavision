import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";

const PORT = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
