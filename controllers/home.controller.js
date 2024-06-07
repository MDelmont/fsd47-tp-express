const  home = async (req, res) => {
  res.render("inscription", { token: req.session.token });
}

const  getDashboardController = async (req, res) => {
  res.render("dashboard", { token: req.session.token });
}


export default  {
  home,
  getDashboardController
}