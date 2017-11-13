define([
    { field: 'linkname', title: '链接名称', sortable: true, halign: 'center' },
    { field: 'clickurl', title: '链接地址', sortable: true, halign: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}

// 数据表格展开内容
function detailFormatter(index, row) {
    var swit = {menuname: true, level:true, menuorder:true, showtype: true, url:true};
    var html = [];
    $.each(row, function(key, value) {
        if (swit[key]) html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}

