# Node.js Fundamentals

## What is Node.js?
A JavaScript runtime environment that executes Javascript code outside of the web browser.

## How does Node.js differ from running JavaScript in the browser?
Node can run on a computer or server. It has certain capabilities that the browser doesn't, for example node
can read and write files.

## What is the V8 engine, and how does Node use it?
The V8 engine was built by Google to be used in its Chrome browser to run JavaScript. This same engine is
used in Node to run JavaScript. 

## What are some key use cases for Node.js?
Backend applications, servers, APIs

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**
```js
CommonJS:
-Loads modules synchronously
-Server-side use
-Access to global variables
`const x = require('./x')`
```

**ES Modules (supported in modern Node.js):**
```js
ES Modules:
-Async loading
-Browser and Node supported
-Supports tree shaking
`import x from './x.js'`
``` 