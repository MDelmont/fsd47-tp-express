/**
 * 
 * @param {*} req 
 * @param {*} requiredFields List of string
 * @returns 
 */
const checkMissingField = (req, requiredFields) => {
    const missingFields = [];
  
    for (const field of requiredFields) {
        if (req.body[field] === null || req.body[field] === undefined) {
            missingFields.push(field);
        }
    }
    return missingFields
    
  };

    /**
   * Check if the password respect condition for register
   * @param {string} password 
   * @param {string} password2 
   */
const checkPasswordCondition = async (password,password2) => {
    let errors = [];
    // Check if the passwords match
    if (password !== password2) {
      errors.push({ msg: "Les mot de passe doivent etre identique" });
    }
    // Check length of password
    if (password.length < 6) {
      errors.push({ msg: "La taille du password doit etre au minimum de 6 caractère" });
    }
    return errors
}

export default  {
  checkMissingField,
  checkPasswordCondition
}

