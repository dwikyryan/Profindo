const express = require("express");
const cors = require("cors");
const PORT = 3300;
const app = express();
const { drugsRouter, transactionRouter, adminRouter } = require("./router");
app.use(cors());
app.use(express.json());

app.use(`/obat`, drugsRouter);
app.use(`/transaksi`, transactionRouter);
app.use(`/admin`, adminRouter);

app.listen(PORT, () => console.log("API running:", PORT));
