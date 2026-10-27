function register (req, res) {
    const { name, email, password } = req.body;

    const newUser = { name, email, password };

    if (!global.users) {
        global.users = [];
    }

    global.users.push(newUser);
    global.user_id = newUser;

    return res.status(201).json({
        name: newUser.name,
        email: newUser.email
    });
}

function logon (req, res) {
    const { email, password } = req.body;

    const user = global.users.find(u => u.email === email && u.password === password);

    if (user) {
        global.user_id = user;
        return res.status(200).json({
            name: user.name,
            email: user.email
        });
    } else {
        return res.status(401).json({ error: "Invalid email or password" });
    }
}

function logoff (req, res) {
    global.user_id = null;
    return res.sendStatus(200);
}

module.exports = {
    register,
    logon,
    logoff
}