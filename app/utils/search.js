import mongoose from "mongoose";
import ModelPage from "../database/mongo/models/page";
import view from "./view";
module.exports = class {
  constructor(search, user, categories) {
    this.search = search;
    this.categories = categories || [];
    this.user = user;
  }
  async _search(model) {
    const tags = this.search.replace(/[^a-zA-Z ]/gi, "").split(" ");
    const title = new RegExp("^" + this.search, "gi");
    const search = await model
      .find({
        $or: [{ title }, { tags: { $in: tags } }]
      })
      .populate("meme")
      .populate("comments.user")
      .populate("creator")
      .populate("views.user");
    return search.map(item => ({
      ...item._doc,
      ownRip: item.rips
        ? item.rips.includes(this.user ? this.user.id : null)
        : false
        ? true
        : false,
      ownVote: this.user
        ? {
            up: item.votes.up.includes(mongoose.Types.ObjectId(this.user.id))
              ? true
              : false,
            down: item.votes.down.includes(
              mongoose.Types.ObjectId(this.user.id)
            )
              ? true
              : false
          }
        : { up: false, down: false },
      creator: {
        name: item.creator.name,
        nickname: item.creator.nickname,
        media: item.creator.media
      },
      comments: item.comments.map(com => ({
        user: com.user
          ? {
              name: com.user.name,
              nickname: com.user.nickname,
              media: com.user.media
            }
          : {},
        comment: com.comment
      })),
      views: new view().countViews(item.views.map(v => v.count))
    }));
  }
  async searchPage() {
    const tags = this.search.replace(/[^a-zA-Z ]/gi, "").split(" ");
    const name = new RegExp("^" + this.search, "gi");
    const search = await ModelPage.find({
      $or: [{ name }, { tags: { $in: tags } }]
    });
    return search.map(page => ({
      ...page._doc,
      followed: page.followers.includes(
        mongoose.Types.ObjectId(this.user ? this.user.id : null)
      ),
      creator: {
        name: page.creator.name,
        nickname: page.creator.nickname,
        media: page.creator.media
      }
    }));
  }
  async searchWithCategory(model) {
    const tags = this.search.replace(/[^a-zA-Z ]/gi, "").split(" ");
    const title = new RegExp("^" + this.search, "gi");
    const catParsed = JSON.parse(this.categories);
    const search = await model.find({
      $and: [
        { $or: [{ title }, { tags: { $in: tags } }] },
        { categories: { $in: catParsed } }
      ]
    });
    return search.map(item => ({
      ...item._doc,
      ownRip: item.rips.includes(this.user ? this.user.id : null),
      ownVote: this.user
        ? {
            up: item.votes.up.includes(mongoose.Types.ObjectId(this.user.id))
              ? true
              : false,
            down: item.votes.down.includes(
              mongoose.Types.ObjectId(this.user.id)
            )
              ? true
              : false
          }
        : { up: false, down: false },
      creator: {
        name: item.creator.name,
        nickname: item.creator.nickname,
        media: item.creator.media
      },
      comments: item.comments.map(com => ({
        user: com.user
          ? {
              name: com.user.name,
              nickname: com.user.nickname,
              media: com.user.media
            }
          : {},
        comment: com.comment
      })),
      views: item.views.map(v => ({ user: v.nickname, count: v.count }))
    }));
  }
  async searchWithCategoryPage() {
    const tags = this.search.replace(/[^a-zA-Z ]/gi, "").split(" ");
    const name = new RegExp("^" + this.search, "gi");
    const catParsed = JSON.parse(this.categories);
    const search = await ModelPage.find({
      $and: [
        { $or: [{ name }, { tags: { $in: tags } }] },
        { categories: { $in: catParsed } }
      ]
    });
    return search.map(page => ({
      ...page._doc,
      followed: page.followers.includes(mongoose.Types.ObjectId(this.user.id)),
      creator: {
        name: page.creator.name,
        nickname: page.creator.nickname,
        media: page.creator.media
      }
    }));
  }
};
