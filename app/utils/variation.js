import Model from "../database/mongo/models/variation";
import View from "./view";
import mongoose from "mongoose";
import moment from "moment";
import Vote from "./vote";

export default class {
  constructor(id, user) {
    this.id = id;
    this.user = user;
  }
  async getVariationTreated() {
    const variation = await Model.findById(mongoose.Types.ObjectId(this.id))
      .populate("meme")
      .populate("comments.user")
      .populate("creator")
      .populate("views.user");
    if (!variation) throw "Variação não encontrada";
    const ownVote = {
      up: false,
      down: false
    };
    if (new Vote().includesObj(variation.votes.up, this.user.id))
      ownVote.up = true;
    if (new Vote().includesObj(variation.votes.down, this.user.id))
      ownVote.down = true;
    return {
      ...variation._doc,
      ownVote,
      creator: {
        name: variation.creator.name,
        nickname: variation.creator.nickname,
        media: variation.creator.media
      },
      comments: variation.comments
        .sort((a, b) => moment(b.created_at) - moment(a.created_at))
        .map(com => ({
          user: com.user
            ? {
                id: com.user._id,
                name: com.user.name,
                nickname: com.user.nickname,
                media: com.user.media
              }
            : {},
          comment: com.comment,
          id: com._id,
          created_at: com.created_at
        })),
      views: new View().countViews(variation.views.map(v => v.count))
    };
  }

  async getVariationsTreated(query, sort) {
    try {
      //if (!id) throw "ID is null";
      const variations = await Model.find(query)
        .sort(sort)
        .populate("meme")
        .populate("comments.user")
        .populate("creator")
        .populate("views.user");

      return variations.map(vari => ({
        ...vari._doc,
        ownVote: {
          up: new Vote().includesObj(vari.votes.up, this.user && this.user.id),
          down: new Vote().includesObj(
            vari.votes.down,
            this.user && this.user.id
          )
        },
        creator: {
          name: vari.creator.name,
          nickname: vari.creator.nickname,
          media: vari.creator.media
        },
        comments: vari.comments.map(com => ({
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
        views: new View().countViews(vari.views.map(v => v.count))
      }));
    } catch (e) {
      return e.toString();
    }
  }
}
