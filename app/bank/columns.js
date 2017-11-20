define([
    { field: 'company', title: '公司名称', sortable: true, halign: 'center' },
    { field: 'rece_name', title: '收款人', sortable: true, halign: 'center' },
    { field: 'bank', title: '开户银行', sortable: true, halign: 'center' },
    { field: 'bank_account', title: '银行账户', sortable: true, halign: 'center' },
    { field: 'bank_branch', title: '开户支行', sortable: true, halign: 'center' },
    { field: 'bank_address', title: '支行地址', sortable: true, halign: 'center' },
    { field: 'bank_license', title: '营业执照', sortable: true, halign: 'center', formatter: licenseFormatter, events: 'licenseEvents' },
    { field: 'createtime', title: '添加时间', sortable: true, halign: 'center', align: 'center' },
    { field: 'action', title: '操作', halign: 'center', align: 'center', formatter: actionFormatter, events: 'actionEvents', clickToSelect: false }
]);

function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-remove"></i></a>'
    ].join('');
}

function licenseFormatter(value, row, index) {
    let img = "<div style='position:relative;'><a class='x-pre-img-btn' target='_blank' href='"+value+"'>预览</a><img class='x-pre-img' src="+ value +" hidden/></div>";
    return value? img: "-";
}
