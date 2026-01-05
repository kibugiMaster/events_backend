import express from "express";
import mainRoutes from "./src/routes/main_routes.js";
import cors from "cors";

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

app.use(cors()); // allow all origins
// OR restrict
// app.use(cors({ origin: "http://localhost:8080" }));


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
    // console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🚀 Server running at http://192.168.1.158:${PORT}`);
});

