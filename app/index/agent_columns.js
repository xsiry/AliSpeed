define([
    { field: 'account', title: '渠道账号', sortable: true, halign: 'center'},
    { field: 'agent_id', title: '推广码', sortable: true, halign: 'center' },
    { field: 'total_money', title: '销售金额（元）', sortable: true, halign: 'center', formatter: moneyFormatter },
    { field: 'total_profit', title: '分成（元）', sortable: true, halign: 'center', formatter: profitFormatter }
]);

function moneyFormatter(value, row, index) {
    return parseFloat(value).toFixed(2);
}

function profitFormatter(value, row, index) {
    return parseFloat(value).toFixed(2);
}