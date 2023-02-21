const express = require("express");
const app = express();
const { getCategories } = require("./controllers/controllers");

app.get("/api/categories", getCategories);

app.use("*", (request, response, next) => {
    response.status(404).send({ msg: "not found" });
});
app.use((error, request, response, next) => {
	console.log(error);
});
module.exports = app;
