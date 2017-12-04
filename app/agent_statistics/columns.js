define([
    { field: 'account', title: '渠道账号', sortable: true, halign: 'center', formatter: accountFormatter },
    { field: 'agent_id', title: '推广码', sortable: true, halign: 'center' },
    { field: 'active_mac', title: '日活跃终端', sortable: true, halign: 'center' },
    { field: 'day_total_mac', title: '昨日活跃终端', sortable: true, halign: 'center' },
    { field: 'total_mac', title: '总终端', sortable: true, halign: 'center' },
    { field: 'total_money', title: '销售金额（元）', sortable: true, halign: 'center' },
    { field: 'total_profit', title: '本月分成金额（元）', sortable: true, halign: 'center' }
]);

function accountFormatter(value, row, index) {
    return "<a class='x-anget-account-detail' href='javascript:;' data-value='"+ value +"'>"+ value +"</a>";
}