module.exports = class {
  constructor(item, user) {
    this.item = item;
    this.user = user;
  }

  async toFollow(model) {
    if (!this.item) return false;
    try {
      const item = await model.findById(this.item);
      if (!item) throw "Página não encontrada";
      console.log(this.user, item.followers.includes(this.user));
      if (item.followers.includes(this.user)) {
        const index = item.followers.indexOf(this.user);
        item.followers.splice(index, 1);
      } else item.followers.push(this.user);

      await item.save();
      return item;
    } catch (e) {
      return e.toString();
    }
  }
};
