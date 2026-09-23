const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3001;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath = req.url.split("?")[0];
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(__dirname, urlPath);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 - غير موجود");
        return;
      }
      res.writeHead(200, { "Content-Type": types[ext] || "text/plain; charset=utf-8" });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });