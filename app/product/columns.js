define([
    { field: 'product', title: '商品名称', sortable: true, halign: 'center' },
    { field: 'types', title: '商品类型', sortable: true, halign: 'center', formatter: typesFormatter },
    { field: 'factory', title: '所属厂商', sortable: false, halign: 'center' },
    { field: 'price', title: '商品价格', sortable: true, halign: 'center' },
    { field: 'original_price', title: '商品原价', sortable: true, halign: 'center' },
    { field: 'days', title: '有效天数', sortable: true, halign: 'center' },
    { field: 'factory_rate', title: '上游分成', sortable: true, halign: 'center' },
    { field: 'agent_rate', title: '渠道分成', sortable: true, halign: 'center' },
    { field: 'product_url', title: '商品链接', sortable: true, halign: 'center' },
    { field: 'createtime', title: '添加时间', sortable: true, halign: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}

function typesFormatter(value, row, index) {
    var key = {1:'商品',2:'奖品',3:'新用户'};
    return key[value];
}

