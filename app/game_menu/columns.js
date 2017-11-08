define([
    { field: 'menuname', title: '菜单名称', sortable: true, halign: 'center' },
    { field: 'level', title: '菜单级别', sortable: true, halign: 'center', formatter: levelFormatter  },
    { field: 'menuorder', title: '排序', sortable: true, halign: 'center' },
    { field: 'showtype', title: '展现类型', sortable: true, halign: 'center', formatter: showtypeFormatter },
    { field: 'url', title: '链接', sortable: true, halign: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}

function levelFormatter(value, row, index) {
    let text = {1:'一级', 2:'二级', 3:'三级', 4:'四级', 5:'五级'};
    return text[value];
}

function showtypeFormatter(value, row, index) {
    let text = {0:'游戏', 1:'网页'};
    return text[value];
}

// 数据表格展开内容
function detailFormatter(index, row) {
    let swit = {menuname: true, level:true, menuorder:true, showtype: true, url:true};
    let html = [];
    $.each(row, function(key, value) {
        if (swit[key]) html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}
