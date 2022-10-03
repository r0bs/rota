const getter = require("./retrieveData.js");
const overview = require("./getScheduleOverview.js");
const branchview = require("./getBranchData.js");

module.exports.dienstplan = function (event, context, callback) {

  console.log({event});

  getter.getScheduleData().then(scheduleData => {
    const { format } = event.queryStringParameters;

    let data;

    if (format === "json") {
      data = JSON.stringify(scheduleData);
    } else {
      if (event.queryStringParameters) {
        const { branch } = event.queryStringParameters;
        if (typeof branch === "string") {
          data = branchview.createBranchHtml(scheduleData, branch);
        }
      } else {
        data = overview.generateHtml(scheduleData);
      }
    }

 

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": format === "json" ? "application/json" : "text/html",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    };

    callback(null, response);
  });

};