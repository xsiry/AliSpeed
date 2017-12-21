define([
    { field: 'cash_month', title: '收益月份', sortable: true, halign: 'center' },
    { field: 'cash_time', title: '提现时间', sortable: true, halign: 'center' },
    { field: 'cash_money', title: '提现金额', sortable: true, halign: 'center' },
    { field: 'tallage', title: '代扣税', sortable: true, halign: 'center' },
    { field: 'cash_costs', title: '手续费', sortable: true, halign: 'center' },
    { field: 'last_money', title: '实际提现', sortable: true, halign: 'center' },
    { field: 'status', title: '状态', sortable: true, halign: 'center', formatter: statusFormatter },
    { field: 'remarks', title: '备注', sortable: true, halign: 'center' }
]);

function statusFormatter(value) {
    var key = {2: '待审核', 3: '已审核，待付款', 4: '审核失败', 8: '已打款'};
    return key[value];
}