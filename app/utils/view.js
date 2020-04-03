import mongoose from "mongoose";
import moment from "moment";

export default class {
  constructor(user, item) {
    this.item = item;
    this.user = user;
  }

  countViews(views) {
    let sum = 0;
    views.forEach(v => {
      sum += v;
    });
    return sum;
  }

  async view(model) {
    try {
      if (!this.item) return false;
      const item = await model.findById(mongoose.Types.ObjectId(this.item));
      if (!item) throw "Item não encontrado";
      const index = this.getIndexOfItem(item.views, this.user);

      if (index == -1) {
        item.views.push({ user: this.user, count: 1, lastUpdate: Date.now() });
        await item.save();
      } else {
        const lastUpdate = moment(item.views[index].lastUpdate);
        const diff = moment().diff(lastUpdate, "days");
        if (diff > 0) {
          item.views[index].count++;
          item.views[index].lastUpdate = Date.now();
          await item.save();
        }
        return true;
      }
    } catch (e) {
      return e.toString();
    }
  }

  getIndexOfItem(array, data) {
    return array.map(e => e.user).indexOf(data);
  }
}
