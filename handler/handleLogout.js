const {User} = require ('../dbHandler/createTabel')

const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({
    where: {
      token: refreshToken,
    },
  });

  if (!user) return res.sendStatus(204);

  if (user.token !== refreshToken) return res.sendStatus(403);

  await user.update({ token: null });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

module.exports = Logout;
