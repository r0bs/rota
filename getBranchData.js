const moment = require("moment");
const weekdays = ["monday", "tuesday", "wedneday", "thursday", "friday", "saturday"];
const range = "A2:S40";
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

module.exports.createBranchHtml = (scheduleData, branch) => {
    const week = createWeekHtml(scheduleData, branch);

    const html = `
    <div class="large-12 columns schedule">
        <h2 class="ts_heading">Personalplan vom ${dateMondayOfCurrentWeek} bis ${dateSaturdayOfCurrentWeek}</h2>
        <table class="ts_branch_table">
            <tbody>
                ${week}
                <!-- <tr class="ts_weekday_row">
                    <td class="ts_weekday_cell">
                        <b>Montag</b>
                    </td>
                    <td class="staff-${branch}-0">
                        <span class="radius alert label" style="font-weight:bold;font-size: .875rem;">Montag geschloßen</span>
                    </td>
                </tr> -->
                
            </tbody>
        </table>
    </div>
    `;

    return html;
}

const createWeekHtml = (scheduleData, branch) => {

    let week = "";

    weekdays.forEach((weekday, index) => {

        let staff = "";

        Object.keys(scheduleData).forEach(staffer => {
            Object.keys(scheduleData[staffer]).forEach(day => {
                if (day === weekday) {
                    if (scheduleData[staffer][weekday].branch === branch) {
                        console.log("2", staff);
                        staff = staff + `
                            <div class="ts_employee_cell">
                                <span style="text-decoration:none;" href="team/index.php#${staffer}">
                                    <div class="employeeimg">
                                        <img src="//cutandmore-bs.de/slir/w52-h52/wp-content/img/team/${staffer}.jpg">
                                    </div>
                                    <div class="employeetime">
                                        ${staffer}
                                        <br> ${scheduleData[staffer][weekday].begin} - ${scheduleData[staffer][weekday].end}
                                    </div>
                                </span>
                            </div>
                    `;
                    }
                }
            });
        });

        week = week + `<tr class="ts_weekday_row">
            <td class="ts_weekday_cell">
                <b>${weekdaysGerman[weekday]}</b>
            </td>
            <td class="staff-${branch}-${index}">
                ${staff}
            </td>
        </tr>`;
    });

    return week;
}