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
    let parentid = row.game_menu_id;

    let cloumns = [
        { field: 'menuname', title: '菜单名称', sortable: true, halign: 'center' },
        { field: 'level', title: '菜单级别', sortable: true, halign: 'center', formatter: levelFormatter  },
        { field: 'menuorder', title: '排序', sortable: true, halign: 'center' },
        { field: 'showtype', title: '展现类型', sortable: true, halign: 'center', formatter: showtypeFormatter },
        { field: 'url', title: '链接', sortable: true, halign: 'center' },
        { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
    ];
    let table_detail_block = $('<div class="x-table-detail"><table></table></div>');
    let table_detail = table_detail_block.find('table');
    table_detail.bootstrapTable({
        url: '/game_menu',
        queryParams: function(params) {
            let x_params = {};
            x_params.source = 't_game_menu';
            x_params.qhstr = JSON.stringify({
                qjson: [{parentid: parentid}]
            });
            x_params.page = params.offset;
            x_params.pagesize = params.limit;
            x_params.sortname = params.sort;
            x_params.sortorder = params.order;
            return x_params;
        },
        idField: 'game_menu_id',
        sortName: 'menuorder',
        sortOrder: 'asc',
        pageNumber:1,      //初始化加载第一页，默认第一页
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        columns: cloumns,
        striped: true,
        search: false,
        searchOnEnterKey: true,
        showRefresh: true,
        showToggle: true,
        showColumns: true,
        minimumCountColumns: 2,
        showPaginationSwitch: true,
        clickToSelect: true,
        detailView: true,
        detailFormatter: 'detailFormatter',
        pagination: true,
        paginationLoop: false,
        classes: 'table table-hover table-no-bordered',
        sidePagination: 'server',
        silentSort: false,
        smartDisplay: false,
        escape: true,
        maintainSelected: true
    }).on('all.bs.table', function(e, name, args) {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });

    return table_detail_block;
}
