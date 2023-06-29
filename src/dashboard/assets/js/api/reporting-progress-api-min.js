

$(document).ready(() => {
    const access_token = localStorage.getItem('access_token')
    $.ajax({
        url: ' https://data.esg-one.uk/esg1-api/api/GetReportingProgress?id=1',
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + access_token,
            "Content-Type": "application/json"
        },
        success: function (data) {

            console.log('success', data);
            const groupedData = breakByStandardsAndStatus(data);
            applyFormula(groupedData)
        },
        error: function (e) {
            console.log('error getting kpis api:', e)
        }
    })
})

function breakByStandardsAndStatus(arr) {
    return arr.reduce((group, data) => {
        const { ReportingStandard, Status } = data;
        group[ReportingStandard] = group[ReportingStandard] ?? { complete: [], incomplete: [] };
        const statusGroup = Status === 'Complete' ? 'complete' : 'incomplete';
        group[ReportingStandard][statusGroup].push(data);

        return group;
    }, {});
}

function applyFormula(arr) {
    for (const reportingStandard in arr) {
        const { complete, incomplete } = arr[reportingStandard];
        const totalComplete = complete.reduce((sum, obj) => sum + obj.Count, 0) ?? 0;
        const totalIncomplete = incomplete.reduce((sum, obj) => sum + obj.Count, 0) ?? 0;
        let formula = (totalComplete / (totalComplete / totalIncomplete)) * 100;
        formula = isNaN(formula) ? 0 : formula;
        arr[reportingStandard].result = formula;

    }
    console.log(arr)
}

