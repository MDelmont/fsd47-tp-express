/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const  getDashboardController = async (req, res) => {
  // render dashboard page
  res.render("dashboard", { token: req.session.token });
}


export default  {
  getDashboardController
}