const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/publish', (req, res) => {
  const content = req.body.content;
  console.log('Received content:', content);
  fs.writeFileSync('docs/content.md', content);

  exec('git add docs/content.md && git commit -m "Update from Figma" && git push', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err}`);
      return res.status(500).send('Failed to publish content');
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    res.send({ status: 'Content published and pushed to GitHub!' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
