module.exports = class {
  constructor(vote, itemId, userId, commentId) {
    this.userComment = vote;
    this.itemId = itemId;
    this.userId = userId;
    this.commentId = commentId;
  }

  async comment(model) {
    try {
      if (!this.itemId) return false;
      const item = await model.findById(this.itemId);
      item.comments.push({ user: this.userId, comment: this.userComment });
      await item.save();
      const newItem = await model
        .findById(this.itemId)
        .populate("comments.user");
      return newItem;
    } catch (e) {
      return e.toString();
    }
  }

  async deleteComment(model) {
    try {
      if (!this.itemId) return false;
      const item = await model.findById(this.itemId);
      if (!item) throw "Comentário não encontrado";
      this.removeItemArrayWithObj(item.comments, this.commentId, "id");
      await item.save();
      return item;
    } catch (e) {
      return e.toString();
    }
  }

  async updateComment(model) {
    try {
      if (!this.itemId) return false;
      const item = await model.findById(this.itemId);
      if (!item) throw "Comentário não encontrado";
      const index = item.comments.map(e => e._id).indexOf(this.commentId);
      item.comments[index].comment = this.userComment;
      await item.save();
      return item;
    } catch (e) {
      return e.toString();
    }
  }

  removeItemArrayWithObj(array, item, key) {
    var index = array.map(e => e[key]).indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }
  removeItemArray(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }
};
