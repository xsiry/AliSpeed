define([
    { field: 'state', checkbox: true },
    { field: 'id', title: '编号', sortable: true, halign: 'center' },
    { field: 'username', title: '账号', sortable: true, halign: 'center' },
    { field: 'password', title: '密码', sortable: true, halign: 'center' },
    { field: 'name', title: '姓名', sortable: true, halign: 'center' },
    { field: 'sex', title: '性别', sortable: true, halign: 'center' },
    { field: 'age', title: '年龄', sortable: true, halign: 'center' },
    { field: 'phone', title: '手机', sortable: true, halign: 'center' },
    { field: 'email', title: '邮箱', sortable: true, halign: 'center' },
    { field: 'address', title: '地址', sortable: true, halign: 'center' },
    { field: 'remark', title: '备注', sortable: true, halign: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
])

function actionFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" data-toggle="tooltip" title="Like"><i class="glyphicon glyphicon-heart"></i></a>　',
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}
