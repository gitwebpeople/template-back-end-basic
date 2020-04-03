module.exports = {
  fieldValidation(object) {
    let _return = { return: true, message: "", field: "" };
    Object.keys(object).forEach(function(key) {
      if (!object[key]) {
        _return = { return: false, message: "Campo vazio: ", field: key };
      }
    });
    return _return;
  },
  validateEmail(value) {
    const usuario = value.substring(0, value.indexOf("@"));
    const dominio = value.substring(value.indexOf("@") + 1, value.length);

    if (
      usuario.length >= 1 &&
      dominio.length >= 3 &&
      usuario.search("@") == -1 &&
      dominio.search("@") == -1 &&
      usuario.search(" ") == -1 &&
      dominio.search(" ") == -1 &&
      dominio.search(".") != -1 &&
      dominio.indexOf(".") >= 1 &&
      dominio.lastIndexOf(".") < dominio.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
};
