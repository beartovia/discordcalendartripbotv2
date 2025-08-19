function getFormattedTime(date, timezone) {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

function getFormattedDate(date, timezone) {
     if (!date) return 'N/A';
     return date.toLocaleDateString('en-CA', { // YYYY-MM-DD format
        timeZone: timezone,
    });
}


module.exports = { getFormattedTime, getFormattedDate };