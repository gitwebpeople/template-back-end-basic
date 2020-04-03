import User from "../utils/user";
import jwt from "jwt-simple";

module.exports = {
  show(req, res) {
    const token = req.headers.authorization.replace("bearer ", "");
    try {
      if (token) {
        const _token = jwt.decode(token, process.env.SECRET);

        if (new Date(_token.exp * 1000) > new Date()) {
          return res.send(true);
        }
      }
    } catch (e) {
      // problema com o token
      return res.status(500).send(e.toString());
    }

    return res.send(false);
  }
};
