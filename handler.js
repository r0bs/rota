const getter = require("./retrieveData.js");
const overview = require("./getScheduleOverview.js");
const branchview = require("./getBranchData.js");


module.exports.dienstplan = function (event, context, callback) {

  getter.getScheduleData().then(scheduleData => {

    let data;

    if (event.queryStringParameters) {
      const branch = event.queryStringParameters.branch;
      if (["Meine", "Stöckheim", "Broitzemer Straße", "Lenaustraße"].includes(branch)) {
        data = branchview.createBranchHtml(scheduleData, branch);
      }
    } else {
      data = overview.generateHtml(scheduleData);
    }

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    };

    callback(null, response);

  });

};