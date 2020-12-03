exports.getDay = function () {
    let today = new Date();
    let currentDay = today.getDay();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }
    return today.toLocaleDateString("en-US", options);
}