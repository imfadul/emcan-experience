// Entry point for Phusion Passenger (cPanel's Application Manager). Passenger
// looks for a file named exactly "app.js" at the Application Path by default
// and expects it to listen on process.env.PORT — this wraps Next.js's request
// handler (middleware included) in a plain http server for that purpose.
const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js app:', err);
    process.exit(1);
  });
