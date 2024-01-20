const {User} = require ('../dbHandler/createTabel')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()


const Login = async (req, res) => {
    console.log('hey')
    try {
        const user = await User.findAll({
            where: {
                emailUser: req.body.emailUser
            }
        });
        if (user.length === 0) {
            return res.status(400).json({ msg: "Email not found" });
        }
        const match = await bcrypt.compare(req.body.password, user[0].password);

        if (!match) {
            return res.status(400).json({ msg: "Incorrect password" });
        }
        const userId = user[0].id;
        const name = user[0].name;
        const emailUser = user[0].emailUser;
        const accessToken = jwt.sign({ userId, name, emailUser }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({ userId, name, emailUser }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await User.update({ token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        delete user[0].dataValues.password;
        user[0].dataValues.accessToken = accessToken;
        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

module.exports = Login;