require('dotenv').config(); // Charger les variables d'environnement à partir du fichier .env

const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const utils = require('./utils');

const PORT = process.env.APP_PORT
const ENVIRONMENT = process.env.APP_ENV 
const LOCALHOST = process.env.APP_LOCALHOST

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url);

    if (pathname.startsWith('/assets/') && req.method === 'GET') {

        const filePath = `${__dirname}${pathname}`
        fs.readFile(filePath, (err, data) => {

            if (err) {

                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('File not found')

            } else {

                const type = pathname.substring(pathname.lastIndexOf('.'))
                let contentType = 'text/plain'

                if (type === '.css') {
                    contentType = 'text/css'
                }
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(data)
            }
        });
    
    // Page Principale

    } else if (pathname === '/' && req.method === 'GET') {

        const headerContent = fs.readFileSync('./view/header.html', 'utf8')
        const homePage = fs.readFileSync('./view/home.html', 'utf8')
        const finalPage = headerContent + homePage 

        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(finalPage);


    //Ajout d'un students

    } else if (pathname === '/add' && req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', () => {
            const parsedBody = querystring.parse(body)
            const { name, birth } = parsedBody
            utils.addStudent(name, birth)
            res.writeHead(302, { 'Location': '/' })
            res.end();
        })

    //Suprimer un students    

    } else if (pathname === '/delete' && req.method === 'POST') {
    
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', () => {
            const parsedBody = querystring.parse(body)
            const { name } = parsedBody
            utils.deleteStudent(name)
            res.writeHead(302, { 'Location': '/users' })
            res.end();
        })


    //Page users (liste des students)
        
    } else if (pathname === '/users' && req.method === 'GET') {

        const headerContent = fs.readFileSync('./view/header.html', 'utf8')
        const usersPage = fs.readFileSync('./view/users.html', 'utf8')

        const userListHTML = utils.students.map(student => {
            return `<li>${student.name} - ${utils.formatBirthdate(student.birth)} <button class="delete-button" data-name="${student.name}">Supprimer</button></li>`;
        }).join('')

        const finalPage = headerContent + usersPage.replace('{{users}}', userListHTML)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(finalPage)

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('page non trouvée :(')
    }
});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server is running in ${ENVIRONMENT} mode on ${LOCALHOST}:${PORT}`);
});