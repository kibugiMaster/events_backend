import express from "express";
import mainRoutes from "./src/routes/main_routes.js";

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello, modern Node.js with ES Modules!");
});

app.use("/api", mainRoutes);
app.use((req, res, next) => {
    res.status(404).json({
        status: 1,
        message: 'Endpoint not found',
    });
});

BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

