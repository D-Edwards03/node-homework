// This folder holds the functions that execute when a route is hit

/*
Handles the logic (getting the date) and sends the final response back to
the client
*/
function getTime(req, res) {
  res.status(200).json({
    time: new Date().toString(),
  });
}

function echoBody(req, res) {
  res.status(200).json({
    weReceived: req.body,
  });
}

/* 
Export these functions as an object so the router file
can import them and assign to specific URL endpoints
*/
module.exports = {
  getTime,
  echoBody,
}