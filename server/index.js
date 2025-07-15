const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/sent') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = querystring.parse(body);
            const msg = data['input'] || 'no msg';
            // console.log('Received message:', msg);

            const filePath = path.join(__dirname, '../client/index.html');

            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const updated = data.replace(
                    /(<div class="feed" id="msg-box">)([\s\S]*?)(<\/div>)/,
                    (match, startTag, innerContent, endTag) => {
                        return `${startTag} ${innerContent}\n <p>${msg}</p>${endTag}`
                    }
                );

                fs.writeFile(filePath, updated, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("appended data");
                })
            })
        });
    } else {
        res.end('Not Found');
    }
}).listen(8080, () => {
    console.log('Server running 8080');
});