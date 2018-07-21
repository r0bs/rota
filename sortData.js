const weekdays = ["monday", "tuesday", "wedneday", "thursday", "friday", "saturday"];

module.exports.sortData = (data) => {
    const sortedData = {}

    data.values.forEach(row => {

        if (!row[0]) return;

        sortedData[row[0]] = {};

        weekdays.forEach((weekday, index) => {

            const branch = row[1 + (index * 3)];
            const begin = row[2 + (index * 3)];
            const end = row[3 + (index * 3)];

            sortedData[row[0]][weekday] = {
                branch,
                begin,
                end
            }

        })
    });

    return sortedData;
}