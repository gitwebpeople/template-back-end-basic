import Model from "../database/mongo/models/meme";
import mongoose from "mongoose";
import View from "./view";
import Vote from "./vote";

export default class {
  constructor(id, user) {
    this.id = id;
    this.user = user;
  }

  async getMemeTreated() {
    const meme = await Model.findOne({
      _id: mongoose.Types.ObjectId(this.id.toString())
    })
      .populate("comments.user")
      .populate("creator")
      .populate("views.user");
    if (!meme) return res.status(400).send("Meme não encontrado");
    const ownVote = {
      up: false,
      down: false
    };
    if (new Vote().includesObj(meme.votes.up, this.user.id)) ownVote.up = true;
    if (new Vote().includesObj(meme.votes.down, this.user.id))
      ownVote.down = true;

    const payload = {
      ...meme._doc,
      ownRip: meme.rips.includes(this.user && this.user.id) ? true : false,
      ownVote,
      report: meme.reports.map(e => e.user).includes(this.user.id),
      creator: {
        name: meme.creator.name,
        nickname: meme.creator.nickname,
        media: meme.creator.media
      },
      comments: meme.comments.map(com => ({
        user: com.user
          ? {
              name: com.user.name,
              nickname: com.user.nickname,
              media: com.user.media
            }
          : {},
        comment: com.comment,
        id: com._id
      })),
      views: new View().countViews(meme.views.map(v => v.count))
    };
    return payload;
  }

  async getMemesTreated(query, sort) {
    const memes = await Model.find(query)
      .sort(sort)
      .populate("comments.user")
      .populate("creator")
      .populate("views.user");

    return memes.map(meme => ({
      ...meme._doc,
      ownRip: meme.rips.includes(this.user && this.user.id) ? true : false,
      ownVote: {
        up: new Vote().includesObj(meme.votes.up, this.user && this.user.id),
        down: new Vote().includesObj(meme.votes.down, this.user && this.user.id)
      },
      creator: {
        name: meme.creator.name,
        nickname: meme.creator.nickname,
        media: meme.creator.media
      },
      comments: meme.comments.map(com => ({
        user: com.user
          ? {
              name: com.user.name,
              nickname: com.user.nickname,
              media: com.user.media
            }
          : {},
        comment: com.comment,
        id: com._id
      })),
      views: new View().countViews(meme.views.map(v => v.count))
    }));
  }
}
