define([
    { field: 'account', title: '登录账号', sortable: true, halign: 'center' },
    { field: 'relname', title: '真实姓名', sortable: true, halign: 'center' },
    { field: 'email', title: '邮箱', sortable: true, halign: 'center' },
    { field: 'mobile', title: '手机', sortable: true, halign: 'center' },
    { field: 'qq', title: 'QQ', sortable: true, halign: 'center' },
    { field: 'regtime', title: '注册时间', sortable: true, halign: 'center' },
    { field: 'rid', title: '用户类型', sortable: true, halign: 'center', formatter: ridFormatter },
    { field: 'status', title: '状态', sortable: true, halign: 'center', formatter: statusFormatter },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}

function ridFormatter(value, row, index) {
    var text = {1: '普通用户', 2: '公司内部用户', 9: '管理员用户'};
    return text[value];
}

function statusFormatter(value, row, index) {
    var text = {1: '正常', 2: '禁用'};
    return text[value];
}
