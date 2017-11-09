define([
    { field: 'gamename', title: '游戏名称', sortable: true, halign: 'center' },
    { field: 'category', title: '游戏类型', sortable: true, halign: 'center', formatter: categoryFormatter },
    { field: 'showtype', title: '按钮类型', sortable: true, halign: 'center', formatter: showtypeFormatter },
    { field: 'runtype', title: '启动模式', sortable: true, halign: 'center', formatter: runtypeFormatter },
    { field: 'menuname', title: '应用菜单', sortable: true, halign: 'center', formatter: menunameFormatter },
    { field: 'namedes', title: '副标题', sortable: true, halign: 'center'  },
    { field: 'pngname', title: '游戏图标', sortable: true, halign: 'center', formatter: pngnameFormatter, events: 'pngnameEvents' },
    { field: 'url', title: '点击链接', sortable: true, halign: 'center' },
    { field: 'classname', title: '游戏分类', sortable: true, halign: 'center' },
    { field: 'searname', title: '游戏目录', sortable: true, halign: 'center' },
    { field: 'mainexe', title: '执行文件', sortable: true, halign: 'center' },
    { field: 'offstarterpath', title: '官方启动相对目录', sortable: true, halign: 'center' },
    { field: 'status', title: '状态', sortable: true, halign: 'center', formatter: statusFormatter },
    { field: 'createtime', title: '添加时间', sortable: true, halign: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    let apply = '<a class="apply ml10" href="javascript:void(0)" data-up="1" data-toggle="tooltip" title="上架"><i class="glyphicon glyphicon-circle-arrow-up"></i></a>　';
    if (row.status==="1") apply = '<a class="apply ml10" href="javascript:void(0)" data-up="0" data-toggle="tooltip" title="下架"><i class="glyphicon glyphicon-circle-arrow-down"></i></a>　';
    let del = '';
    if (row.status==="0") del = '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>　';
    return [
        apply,
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        del
    ].join('');
}

function runtypeFormatter(value, row, index) {
    let text = {0:'加速', 1:'直接'};
    return text[value];
}

function categoryFormatter(value, row, index) {
    let text = {0:'图标', 1:'按钮'};
    return text[value];
}

function showtypeFormatter(value, row, index) {
    let text = {0:'普通按钮', 1:'图片图片'};
    return text[value];
}

function statusFormatter(value, row, index) {
    let text = {0:'未上架', 1:'已上架'};
    return "<span style='color:"+(value==="0"?"red":"green")+";font-weight: bold;font-size: 14px;'>" + text[value] + "</span>";;
}

function menunameFormatter(value, row, index) {
    let text = "<span style='color:red;font-weight: bold;font-size: 14px;'>" + value + "</span>";
    return value? text: "-";
}

function pngnameFormatter(value, row, index) {
    let img = "<div style='position:relative;'><a class='x-pre-img-btn' href='javascript:void(0);'>预览</a><img class='x-pre-img' src="+ value +" hidden/></div>";
    return value? img: "-";
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
