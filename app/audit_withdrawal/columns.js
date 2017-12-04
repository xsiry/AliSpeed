define([
    { field: 'account', title: '渠道账号', sortable: false, halign: 'center' },
    { field: 'mobile', title: '联系方式', sortable: false, halign: 'center' },
    { field: 'cash_time', title: '提现时间', sortable: true, halign: 'center' },
    { field: 'cash_money', title: '提现金额', sortable: true, halign: 'center' },
    { field: 'tallage', title: '代扣税', sortable: true, halign: 'center' },
    { field: 'cash_costs', title: '手续费', sortable: true, halign: 'center' },
    { field: 'last_money', title: '实际提现', sortable: true, halign: 'center' },
    { field: 'status', title: '状态', sortable: true, halign: 'center', formatter: statusFormatter },
    { field: 'remarks', title: '备注', sortable: true, halign: 'center' },
    { field: 'aud_user_name', title: '批准人', sortable: false, halign: 'center' },
    { field: 'aud_time', title: '批准时间', sortable: true, halign: 'center', formatter: audTimeFormatter },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function statusFormatter(value) {
    var key = {2: '申请提现', 3: '审核通过', 4: '审核失败', 8: '已打款'};
    return key[value];
}

function audTimeFormatter(v, r) {
    if (r.aud_user == undefined) {
        v = "-";
    }
    return v;
}

function actionFormatter(value, row, index) {
    var rolename = $('.x-rolename-hidden').val();
    var btn = '';
    if (row.status ==="2" && rolename === "渠道部" || row.status === "3" && rolename ==="财务部") btn = '<a class="edit ml10" href="javascript:;" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　';
    return [
        btn
    ].join('');
}
