import mongoose from "mongoose";

module.exports = class {
  constructor(report, item, user) {
    this.reportUser = report;
    this.item = item;
    this.user = user;
  }

  async report(model) {
    try {
      if (!this.item) return false;
      const item = await model.findById(mongoose.Types.ObjectId(this.item));

      const index = this.getIndexOfItem(item.reports, this.user);
      if (index == -1) {
        item.reports.push({ user: this.user, report: this.reportUser });
        await item.save();
        return item;
      }

      return false;
    } catch (e) {
      console.log(e);
      return e.toString();
    }
  }
  getIndexOfItem(array, data) {
    return array.map(e => e.user).indexOf(data);
  }
};
