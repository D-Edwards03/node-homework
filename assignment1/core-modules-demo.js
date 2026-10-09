const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleFilesDir = path.join(__dirname, 'sample-files');
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// OS module
console.log('Platform:', os.platform());
console.log('CPU:', os.cpus()[0].model);
console.log('Total Memory:', os.totalmem());

// Path module
const joinedPath = path.join(sampleFilesDir, 'folder', 'file.txt');
console.log('Joined path:', joinedPath);

// fs.promises API
async function demoFile() {
  const demoFilePath = path.join(sampleFilesDir, 'demo.txt');
  try {
    await fs.promises.writeFile(demoFilePath, 'Hello from fs.promises!');
    const data = await fs.promises.readFile(demoFilePath, 'utf-8');
    console.log('fs.promises read:', data);
  } catch (err) {
    console.error('fs.promises error:', err);
  }
}

demoFile();

// Streams for large files- log first 40 chars of each chunk
