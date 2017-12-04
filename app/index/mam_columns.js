define([
    { field: 'months', title: '月份', sortable: true, halign: 'center' },
    { field: 'active_mac', title: '活跃终端(台)', sortable: true, halign: 'center' },
    { field: 'total_mac', title: '总终端(台)', sortable: true, halign: 'center' },
    { field: 'total_money', title: '月销售金额(元)', sortable: true, halign: 'center' },
    { field: 'total_profit', title: '月收益(元)', sortable: true, halign: 'center' },
    { field: 'status', title: '申请提现', halign: 'center', align: 'center', formatter: withdrawalFormatter, events: 'actionEvents', clickToSelect: false },
    { field: 'remarks', title: '备注', sortable: true, halign: 'center' },
    { field: 'detail', title: '查看详细', halign: 'center', align: 'center', formatter: detailFormatter, events: 'actionEvents', clickToSelect: false }
]);

function withdrawalFormatter(value, row, index) {
    var btn = '<a class="withdrawal ml10" href="javascript:;" data-toggle="tooltip" title="Withdrawal">'+(value === "4"? '审核失败！重新申请':'申请')+'</a>　';
    if (value !== "1"&&value !== "4") { btn = "已申请"}
    return [
        btn
    ].join('');
}

function detailFormatter(value, row, index) {
    return [
        '<a class="detail ml10" href="javascript:;" data-toggle="tooltip" title="Detail">详细</i></a>　'
    ].join('');
}
