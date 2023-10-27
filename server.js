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
    const { Url, query } = url.parse(req.url);

    if (Url.startsWith('/assets/') && req.method === 'GET') {

        const filePath = `${__dirname}${Url}`
        fs.readFile(filePath, (err, data) => {

            if (err) {

                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('File not found')

            } else {

                const type = Url.substring(Url.lastIndexOf('.'))
                let contentType = 'text/plain'

                if (type === '.css') {
                    contentType = 'text/css'
                }
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(data)
            }
        });
    
    // Page Principale

    } else if (Url === '/' && req.method === 'GET') {
        const homePage = fs.readFileSync('./view/home.html', 'utf8')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(homePage);


    //Ajout d'un students

    } else if (Url === '/add' && req.method === 'POST') {
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

    } else if (Url === '/delete' && req.method === 'POST') {
    
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
        
    } else if (Url === '/users' && req.method === 'GET') {

        const usersPage = fs.readFileSync('./view/users.html', 'utf8')

        const userListHTML = utils.students.map(student => {
            return `<li>${student.name} - ${utils.formatBirthdate(student.birth)} <button class="delete-button" data-name="${student.name}">Supprimer</button></li>`;
        }).join('')

        const finalPage = usersPage.replace('{{users}}', userListHTML)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(finalPage)

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
    }
});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server is running in ${ENVIRONMENT} mode on ${LOCALHOST}:${PORT}`);
});