define([
    { field: 'product', title: '商品名称', sortable: true, halign: 'center' },
    { field: 'order_code', title: '订单号', sortable: true, halign: 'center' },
    { field: 'order_time', title: '创建时间', sortable: true, halign: 'center' },
    { field: 'num', title: '数量（个）', sortable: true, halign: 'center' },
    { field: 'days', title: '可用天数', sortable: true, halign: 'center' },
    { field: 'price', title: '单价（元）', sortable: true, halign: 'center' },
    { field: 'total_fee', title: '总价（元）', sortable: true, halign: 'center' },
    { field: 'pay_type', title: '支付方式', sortable: true, halign: 'center', formatter: payTypeFormatter },
    { field: 'order_type', title: '订单类型', sortable: true, halign: 'center', formatter: orderTypeStatusFormatter },
    { field: 'pay_status', title: '状态', sortable: true, halign: 'center', formatter: payStatusFormatter },
    { field: 'nickname', title: '付款用户', sortable: false, halign: 'center'}
]);

function payTypeFormatter(value, row, index) {
    var key = {'alipay': '支付宝', 'wxpay': '微信支付'};
    return key[value];
}

function payStatusFormatter(value, row, index) {
    var key = {'P': '处理中', 'T': '交易成功', 'E': '交易失败', 'N': '未付款'};
    return key[value];
}

function orderTypeStatusFormatter(value, row, index) {
    var key = {1: '购买', 2: '抽奖', 3: '赠送'};
    return key[value];
}