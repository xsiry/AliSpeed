define([
    { field: 'months', title: '月份', sortable: true, halign: 'center' },
    { field: 'total_mac', title: '活跃终端(台)', sortable: true, halign: 'center' },
    { field: 'total_profit', title: '月收益(元)', sortable: true, halign: 'center' },
    { field: 'withdrawal', title: '申请提现', halign: 'center', align: 'center', formatter: withdrawalFormatter, events: 'actionEvents', clickToSelect: false },
    { field: 'detail', title: '查看详细', halign: 'center', align: 'center', formatter: detailFormatter, events: 'actionEvents', clickToSelect: false }
]);

function withdrawalFormatter(value, row, index) {
    return [
        '<a class="withdrawal ml10" href="javascript:;" data-toggle="tooltip" title="Withdrawal">申请</a>　'
    ].join('');
}

function detailFormatter(value, row, index) {
    return [
        '<a class="detail ml10" href="javascript:;" data-toggle="tooltip" title="Detail">详细</i></a>　'
    ].join('');
}
