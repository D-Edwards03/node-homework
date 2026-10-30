const { userSchema } = require("../validation/userSchema");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(inputPassword, storedHash) {
    const [salt, key] = storedHash.split(":");
    const derivedKey = await scrypt(inputPassword, salt, 64);
    return key === derivedKey.toString("hex");
}

async function register (req, res) {
    if (!req.body) req.body = {};

    const { error, value } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: "Validation failed"
        });
    }

    const { name, email, password } = value;
    const hashedPassword = await hashPassword(password);
    const newUser = { name, email, hashedPassword };

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

async function logon (req, res) {
    const { email, password } = req.body;

    const user = global.users.find(u => u.email === email);

    const goodCredentials = user && await comparePassword(password, user.hashedPassword);

    if (goodCredentials) {
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