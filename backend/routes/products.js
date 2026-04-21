import Router from "express";
import pool from "../db.js";

const router = Router();

// Create todo
router.post("/", async (req, res) => {
	try {
		const { img, name, type, technology, brand } = req.body;
		const newRow = await pool.query(
			"INSERT INTO products (img, name, type, technology, brand) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[img, name, type, technology, brand],
		);
		res.json(newRow.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

// Get all todos
router.get("/", async (req, res) => {
	try {
		const allRows = await pool.query("SELECT * FROM products");
		res.json(allRows.rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

// Update todo
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { img, name, type, technology, brand, isActive } = req.body;
		const updatedRow = await pool.query(
			"UPDATE products SET img = $1, name = $2, type = $3, technology = $4, brand = $5, is_active = $6 WHERE id = $7 RETURNING *",
			[img, name, type, technology, brand, isActive, id],
		);
		res.json(updatedRow.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

// Delete todo
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM products WHERE id = $1", [id]);
		res.json("Product was deleted!");
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

export default router;
