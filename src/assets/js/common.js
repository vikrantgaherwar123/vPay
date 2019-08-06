function searchFunction(event, searchTableCondition) {
    event = event ? event : window.event;
    var v = event.srcElement.value.toLowerCase();
    $(searchTableCondition).filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(v) > -1)
    });
}
