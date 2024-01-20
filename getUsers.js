const {User} = require('./dbHandler/createTabel');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findOne({
      attributes: ['id', 'name', 'emailUser'],
      where: {
        id: userId,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getUsers;
