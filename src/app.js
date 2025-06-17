const express = require("express");

const app = express();

// app.use("/hello", (req, res) => {
//   res.send("This is the hello hello hello");
// });
// app.use("/hello/23", (req, res) => {
//   res.send("This is difference");
// });
app.get("/user/:userId", (req, res) => {
 console.log(req.params)
//  console.log(req.query)
  res.send({ firstName: "Jamal", lastName: "Nasir" });
});

app.post("/user", (req, res) => {
  // Save data to the database
  res.send("Data saved to the database successfully");
});
app.delete("/user", (req, res) => {
  // delete data to the database
  res.send("Data deleted from the database successfully");
});

app.use("/test", (req, res) => {
  res.send("This the test server.");
});

// app.use("/", (req, res) => {
//   res.send("This is the dashboard");
// });

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
