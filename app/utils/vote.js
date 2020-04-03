module.exports = class {
  constructor(vote, itemId, userId) {
    this.userVote = vote;
    this.itemId = itemId;
    this.userId = userId;
  }

  async vote(model) {
    try {
      if (!this.itemId) return false;
      const item = await model.findById(this.itemId);
      if (this.userVote == "up") {
        if (this.includesObj(item.votes.down, this.userId))
          this.removeItemArray(item.votes.down, this.userId);
        if (this.includesObj(item.votes.up, this.userId))
          this.removeItemArray(item.votes.up, this.userId);
        else item.votes.up.push({ user: this.userId });
      } else {
        if (this.includesObj(item.votes.up, this.userId))
          this.removeItemArray(item.votes.up, this.userId);
        if (this.includesObj(item.votes.down, this.userId))
          this.removeItemArray(item.votes.down, this.userId);
        else item.votes.down.push({ user: this.userId });
      }

      await item.save();
      return true;
    } catch (e) {
      return e.toString();
    }
  }

  includesObj(array, value) {
    let result = false;
    array.forEach(element => {
      if (element.user == value) {
        result = true;
      }
    });

    return result;
  }

  removeItemArray(array, item) {
    var index = array.map(e => e.user).indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }
};
