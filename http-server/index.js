const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const PORT = args.port || 3000;

let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("./home.html", (err, home) => {
    if (err) {
        throw err;
    }
    homeContent = home;
});

fs.readFile("./project.html", (err, project) => {
    if (err) {
        throw err;
    }
    projectContent = project;
});

fs.readFile("./registration.html", (err, registration) => {
    if (err) {
        throw err;
    }
    registrationContent = registration;
});

const server = http.createServer((request, response) => {
    const url = request.url;
    response.writeHead(200, { "Content-Type": "text/html" });

    if (request.method === 'POST' && url === '/register') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });
        request.on('end', () => {
            console.log('Registration Data:', body);
            response.write('<h1>Registration Successful!</h1>');
            response.end();
        });
    } else {
        switch (url) {
            case "/project":
                response.write(projectContent);
                response.end();
                break;
            case "/registration":
                response.write(registrationContent);
                response.end();
                break;
            default:
                response.write(homeContent);
                response.end();
                break;
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
