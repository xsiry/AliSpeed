define([
    { field: 'card_no', title: '卡号', sortable: true, halign: 'center' },
    { field: 'card_pwd', title: '卡密', sortable: true, halign: 'center', formatter: cardwdFormatter, visible: false},
    { field: 'product', title: '类型', sortable: false, halign: 'center' },
    { field: 'created_at', title: '生成日期', sortable: true, halign: 'center' },
    { field: 'relname', title: '生成者', sortable: false, halign: 'center' },
    { field: 'activate_at', title: '激活日期', sortable: true, halign: 'center' },
    { field: 'uuid', title: '激活账号', sortable: true, halign: 'center' },
    { field: 'nickname', title: '昵称', sortable: false, halign: 'center'},
    { field: 'status', title: '激活状态', sortable: true, halign: 'center', formatter: statusFormatter },
]);

function cardwdFormatter() {
    return arguments[0]?arguments[0]:'空';
}

function statusFormatter() {
    var key = {'0': '未激活', '1': '已激活'};
    return key[arguments[0]];
}