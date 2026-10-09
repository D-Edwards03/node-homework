const fs = require('fs');
const path = require('path');


// Write a sample file for demonstration
const dirPath = path.join(__dirname, 'sample-files');
const filePath = path.join(dirPath, 'sample.txt');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

fs.writeFileSync(filePath, 'Hello, async world!');

// 1. Callback style
function readFileCallback() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Callback error:', err);
      return;
    }
    console.log(`callback: ${data}`);
  });
}

readFileCallback();

  // Callback hell example (test and leave it in comments):
  /*
  fs.readFile('file1.txt', 'utf8', (err, data1) => {
    fs.readFile('file2.txt', 'utf8', (err, data2) => {
      fs.readFile('file3.txt', 'utf8', (err, data3) => {
        fs.readFile('file4.txt', 'utf8', (err, data4) => {
          console.log('This is callback hell!');
        });
      });
    });
  });

  Nesting becomes hard to read and maintain. Promises and async/await solve this issue.
  */

  // 2. Promise style
  function readFilePromise() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  readFilePromise()
    .then((data) => {
      console.log(`promise: ${data}`);
    })
    .catch((err) => {
      console.error('Promise error:', err);
    });

      // 3. Async/Await style
      async function readFileAsyncAwait() {
        try {
          const data = await readFilePromise();
          console.log(`async await: ${data}`);
        } catch (err) {
          console.error('Async/Await error:', err);
        }
      }

      readFileAsyncAwait();
