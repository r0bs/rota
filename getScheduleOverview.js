const moment = require("moment");
const weekdays = ["monday", "tuesday", "wedneday", "thursday", "friday", "saturday"];
const currentCalendarWeek = moment().week();
const dateMondayOfCurrentWeek = moment().day(1).week(currentCalendarWeek).format("DD.MM.");
const dateSaturdayOfCurrentWeek = moment().day(6).week(currentCalendarWeek).format("DD.MM.YYYY");
const absent = "-abwesend-";
const websiteUrl = "https://cutandmore-bs.de"

const weekdaysGerman = {
    "monday": "Montag",
    "tuesday": "Dienstag",
    "wedneday": "Mittwoch",
    "thursday": "Donnerstag",
    "friday": "Freitag",
    "saturday": "Samstag"
}

module.exports.generateHtml = (data) => {

    let html = "";

    Object.keys(data).forEach(key => {
        const stafferName = key;

        const scheduleHtml = days(data[stafferName]);

        html = html + `
        <div style="display:block;" class="friseur large-4 medium-6 columns">
            <h2 class="friseur-name">
                <a name="${stafferName}"> ${stafferName}</a>
            </h2>
            <center>
                <a name="${stafferName}">
                    <img alt="FriseurIn ${stafferName}" style="display:block; width: 200px; height: 200px; margin: 0 10px 10px 0; border-radius: 100%;"
                        src="${websiteUrl}/slir/w200-h200/wp-content/img/team/${stafferName}.jpg">
                </a>
            </center>
            <div style="display:block;" class="large-12 columns ${stafferName}">
                <center>
                    <span class="ts_heading">Einsatzorte vom ${dateMondayOfCurrentWeek} bis ${dateSaturdayOfCurrentWeek} </span>
                    <table class="ts_employee_table">
                        <tbody>
                            ${scheduleHtml}
                        </tbody>
                    </table>
                </center>
            </div>
        </div>`;
    })

    return html;
};


const days = stafferData => {

    let scheduleHtml = "";

    weekdays.forEach(weekday => {
        const branch = stafferData[weekday].branch ? stafferData[weekday].branch : null;
        const begin = stafferData[weekday].begin ? stafferData[weekday].begin : null;
        const end = stafferData[weekday].end ? stafferData[weekday].end : null;

        let placeAndTime = " - "

        if (branch && branch !== absent && begin && end) {
            placeAndTime = `<a style="text-transform:capitalize; text-decoration: underline;" '="" href="${websiteUrl}/salons/${branch}"'>${branch}</a> (${begin} - ${end})`;
        }

        scheduleHtml = scheduleHtml + `<tr class="ts_weekday_row">
                <td style="padding: 2px 10px 2px 10px;" class="ts_weekday_cell">
                    <b>${weekdaysGerman[weekday]}</b>
                </td>
                <td style="padding: 2px 10px 2px 10px;">
                    ${placeAndTime}
                </td>
            </tr>`;
    });

    return scheduleHtml;
};