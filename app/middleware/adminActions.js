import mongoose from "mongoose";
import User from "../utils/user";
import ModelPage from "../database/mongo/models/page";

export async function checkPagePermissions(req, res, next) {
  const user = new User().getUserPayload(req.headers.authorization);
  const { command, page } = req.body;

  const pageObj = await ModelPage.findById(mongoose.Types.ObjectId(page));

  const index = pageObj.admins.map(e => e.user).indexOf(user.id);
  if (index !== -1) {
    if (!pageObj.admins[index].actions[command]) {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(401);
  }

  next();
}
