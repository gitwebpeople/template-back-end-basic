import User from "../utils/user";

const CronJob = require("cron").CronJob;
export const DisblockUser = function() {
  new CronJob(
    "*/10 * * * * *",
    function() {
      //console.log("You will see this message every second");
      new User().disblockUsers();
    },
    null,
    true,
    "America/Los_Angeles"
  );
};
