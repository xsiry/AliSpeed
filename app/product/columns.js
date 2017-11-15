define([
    { field: 'product', title: '链接名称', sortable: true, halign: 'center' },
    { field: 'factory', title: '所属厂商', sortable: true, halign: 'center' },
    { field: 'price', title: '商品价格', sortable: true, halign: 'center' },
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

