(function($, $sHelper) {	
	 
/**
 *字符串，整数处理API
 */ 
   //返回2个数字相加
	$sHelper.AddMumberText = function (arg1,arg2){  
        var a1,a2,m;  
        try{  
            a1 = arg1.toString().split(".")[1].length  
        }catch(e){  
            a1 = 0;  
        }  
        try{  
            a2 = arg2.toString().split(".")[1].length  
        }catch(e){  
            a2 = 0;  
        }  
        m = Math.pow(10, Math.max(a1,a2));  
        return (arg1*m+arg2*m)/m;  
    };
  
    //判断是否整数
    $sHelper.isNumber = function (oNum) { 
		  if(!oNum) return false; 
		  var strP=/^\d+(\.\d+)?$/; 
		  if(!strP.test(oNum)) 
		     return false; 
		  try { 
		    if(parseFloat(oNum)!=oNum) 
			  return false; 
		  } 
		  catch(ex) 
		  { 
		   return false; 
		  } 
		  return true; 
	} ;
	
	//自增长
	$sHelper.sequenceNumber = function (num){
	    return (num.toInt()+1).toTime();
	}
	//返回一个整数
	$sHelper.getStrNumber = function (oNum) { 
	  if (isNumber(oNum))
	     return oNum ;
	  else return 0 ;
	}
	
	$sHelper.negativeToZero = function (num){
	    var number = parseInt(num,10);
	    return number<-1?0:number;
	}
	
	//判断一个字符串是否为空
	$sHelper.isNull = function (data){ 
	    return (data == undefined || data == ""  || data == null)  ;
	}
	
	$sHelper.getNotNullStr = function (data){ 
	    if ($sHelper.isNull(data)) 
	      return "";
	    else return data ;
	}
	
	/* 处理数据库后面带0的时间  
            处理为 断时间格式 ：2015-12-13
	 * */
	$sHelper.smallFormatTime = function (data){ 
		 if ($sHelper.isNull(data)) 
	      return "";
//	     return data.substr(0,data.length-2) ; 
         return data.substr(0,data.indexOf(" ")) ;  
	}
	/* 返回 yyyy年MM月dd 时间 */ 
	$sHelper.getZhDateFormat = function (data){ 
		 if ($sHelper.isNull(data)) 
	      return "";
		return new Date($sHelper.smallFormatTime(data)).Format("yyyy年MM月dd") ;
	}
	
	
	
	//JSON字符串IE中可能对unicode ，可以使用如下来解码：
	$sHelper.unicode2Char = function (str) {
	   if (str!=undefined) 
	        return (str.replace(/\\/g, "%"));
	   else return str;
	     
	}
	
	//source.replace(/(^[\s\t\xa0\u3000]+|[\s\t\xa0\u3000]+$)/g, '');
	$sHelper.trim= function (str){ //删除左右两端的空格
		if (str!=undefined)
	       return str.replace(/(^\s*)|(\s*$)/g, "");
	   else return str;
	}
	
	$sHelper.ltrim =function (str){ //删除左边的空格
	   if (str!=undefined) return str.replace(/(^\s*)/g,"");
	    else return str;
	}
	
	$sHelper.rtrim =function (str){ //删除右边的空格
	   if (str!=undefined) return str.replace(/(\s*$)/g,"");
	    else return str;
	}
 
/**
 * ----------新窗体---------------
 */ 
   
    $sHelper.NewWindows = function(){
       if ($("#newwindows").length<=0)
	       $("body").append('<div id="newwindows"></div>');
       $('#newwindows').append('<div id="mydialogdiv" style="overflow:auto"><div id="mytargetdiv"></div></div>') ;
    }
 
	//document.getElementById("") 
	$sHelper.NewWindowsForm = function(fid){
	   if (!fid)  fid="formauto" ;
       if ($("#newwindows").length<=0) {
       	  $("body").append('<div id="newwindows"></div>');
       }  
       if ($("#mydialogdiv",$("#newwindows")).length<=0) {
       	  $("#newwindows").append('<div id="mydialogdiv" style="overflow:hidden;"></div>');
       }   
       if ($("#"+fid,$("#mydialogdiv")).length<=0) {
       	  $('#mydialogdiv').append('<form id="'+fid+'"> </form> ') ;  
       } 
	       
	}
 
/**
 * 
 * ----------数据异步提交想处理API ---------------
 */ 
  
  //获取URL 的参数，
  /**
   * 综上： javascript对参数编码解码方法要一致： 
escape()   unescape() 
encodeURI()   decodeURI()  
encodeURIComponent()    decodeURIComponent()  
     * 获取到URL的参数
   * @param {Object} fndname
   */
  $sHelper.GetUrlParms = function(fndname)  { 
//  var args=new Object();    
//  var query=location.search.substring(1);//获取查询串   
    var url = location.search ;//一般的查询
//  debugPrint("GetUrlParms url search:= "+url) ;
    if (!url)
       url= location.hash ; //AJAX查询，在#后面后，search获取不到值
//  debugPrint("GetUrlParms url hash:= "+url) ;
    var query=url.substr(url.indexOf("?")+1) ;
//  debugPrint("query:="+query) ;
    var pairs=query.split("&");//在逗号处断开   
    for(var   i=0;i<pairs.length;i++)   
    {    
        var pos=pairs[i].indexOf('=');//查找name=value  
        if(pos==-1)   
           continue;//如果没有找到就跳过
        var argname=pairs[i].substring(0,pos);//提取name  
        var value=pairs[i].substring(pos+1);//提取value 
        if (argname==fndname)
           return value ; 
//      args[argname]=unescape(value);//存为属性 / 
    } 
    return null;

}
  
      
 	/**
 	 * 带GRID的调用此方法，方便刷新  callback(message) ;	
 	 * message类型一直传递到最后一个处理函数
 	 * @param {Object} urlpath
 	 * @param {Object} param
 	 * @param {Object} grid
 	 * @param {Object} callback
 	 * @param {Object} ismustback boolean 表示不管成功还是失败，都必须调用 callback函数
 	 */
	$sHelper.AjaxSendData  = function(urlpath,param,grid,callback,ismustback) {
	    $.ajax({
			type: 'post',
			url: urlpath,
			data: param,
			cache: false,
			dataType: 'json',
			success: function (message) {			
				  if (message.success)
				  {		 
				  	     //好的习惯，应该返回函数也需要处理msg ，单默认情况下，只有执行正确，才调用返回函数
						 if (callback) 
						    callback(message) ;	//message类型一直传递到最后一个处理函数		
						 if (grid)
						    grid.reload() ; 
				  }
				  else
				  {
					  $.ligerDialog.error(message.msg);
					  if (ismustback==true) {
					  	 if (callback) 
						    callback(message) ;	 
					  }
				  }				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				$.ligerDialog.alert("请求对象XMLHttpRequest: "+XMLHttpRequest.responseText+" ,错误类型textStatus: "+textStatus+",异常对象errorThrown: "+errorThrown);
				if (ismustback==true) { //ismustback如何情况下，都必须调用返回函数
				  	 if (callback) 
					    callback(message) ;	 
				} 
			}
		});
	};

    $sHelper.Get  = function(urlpath,param,callback) {
        $sHelper.Ajax(urlpath,param,callback,'get');
    };

    $sHelper.Post  = function(urlpath,param,callback) {
        $sHelper.Ajax(urlpath,param,callback,'post');
    };

    $sHelper.Ajax  = function(urlpath,param,callback,ajaxType) {
        $.ajax({
            type: ajaxType,
            url: urlpath,
            data: param,
            cache: false,
            dataType: 'json',
            success: function (message) {
                if (callback)
                    callback(message) ;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    $sHelper.alert  = function(title) {
        $.confirm({
            animationSpeed: 300,
            title: false,
            columnClass: 'col-md-4 col-md-offset-4',
            content: title,
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button jconfirm-x-btn'
                }
            }
        });
    };





	
	 //异步提交，成功后关闭页面 弹出页面 ,是Dialog的页面调用此方法
	$sHelper.AjaxDialogSendData = function(url,values,pwindow) {
		   $.ajax({
				type: 'post',
				url: url,
				data: values,
				cache: false,
				dataType: 'json',
				success: function (resultJson) { 	
	                 if (resultJson.success==false)			
					 {
					     $.ligerDialog.error(resultJson.msg) ;
					 }
					 else
					 {
					    if (pwindow)
						 pwindow.closeWin(true)  ;         
					 }
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$.ligerDialog.alert("请求对象XMLHttpRequest: "+XMLHttpRequest.responseText+",错误类型textStatus: "+textStatus,"异常对象errorThrown: "+errorThrown); 
				}
			});
	};
    
    /**
     * 
     * @param {Object} urladdress
     * @param {Object} urldata
     * @param {Object} crGrid
     * @param {Object} callback
     * @param {Object} newmsg 自定义提示
     */
	$sHelper.deleteData = function(urladdress,urldata,crGrid,callback,newmsg){ 
	   if (!newmsg) 
	       newmsg='确定删除数据?' ;
	   if (urladdress=="") 
	      urladdress="ssoftPublicDelete"; 
	   $.ligerDialog.confirm(newmsg, function (yes)
	   {
		   if (yes) {
		       $.ajax({
					type: 'post',
					url: urladdress,
					data: urldata,
					cache: false,
					dataType: 'json',
					success: function (msg) { 	
						if (crGrid)
						 crGrid.reload()  ;  
						if (callback) 
						   callback(msg);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						$.ligerDialog.alert("请求对象XMLHttpRequest: "+XMLHttpRequest.responseText+",错误类型textStatus: "+textStatus,"异常对象errorThrown: "+errorThrown); 
					}
				});
			 }
		 });						
    } ;
	

	
	//清空过滤表单内容
    $sHelper.resetFilterGroup = function(form) {
    	form = $(form);
    	if (!form.length) return;
 
    	$(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(
    			function() {
    				if (!this.name)	return;
    				if ($.trim($(this).val()) == "")
    					return;
    				var ltype = $(this).attr("ltype");
    				var optionsJSON = $(this).attr("ligerui"), options;    			 
    				// 如果是下拉框，那么读取下拉框关联的隐藏控件的值(ID值,常用与外表关联)
    				if (ltype == "select" && options && options.valueFieldID) {
    					  $("#" + options.valueFieldID).val('');
    					 
    				} 
					 else 
					  $(this).val('');    	 
    			});
 
    };
	
	//创建过滤规则(查询表单)
    $sHelper.bulidFilterGroup = function(form) {
    	form = $(form);
    	if (!form.length) return;
    	var group = {};
    	$(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(
    			function() {
    				if (!this.name)	return;
    				//if ($.trim($(this).val()) == "")
    				//	return;
    				var ltype = $(this).attr("ltype");
    				var optionsJSON = $(this).attr("ligerui"), options;
    				var value = $.trim($(this).val());
    				var name = this.name;
    				// 如果是下拉框，那么读取下拉框关联的隐藏控件的值(ID值,常用与外表关联)
    				if (ltype == "select" && options && options.valueFieldID) {
    					value = $("#" + options.valueFieldID).val();
    					name = options.valueFieldID;
    				} else if (ltype == "checkbox") {
					     value = this.checked ;
					}
					if (value== "")
    				  return;
    				group[name] = value;
    			});
    	return group;
    };
    
    //根据QueryString参数名称获取值
	var getQueryStringByName = function (name) {
		var result = location.search.match(new RegExp(
				"[\?\&]" + name + "=([^\&]+)", "i"));
		if (result == null || result.length < 1) {
			return "";
		}
		return result[1];
	};
	
	$sHelper.getQueryStringByName = function(name){
		return getQueryStringByName(name);
	};
	
/*
 * 时间处理相关-------------------------------
 */

   // 格式化时间
	$sHelper.YMDDate = function(data) {
		var A = new Date(data.LL);
        return A.getFullYear() + "-" + (A.getMonth() + 1) + "-" + A.getDay();
	};
	
	/**
	 * 获得指定日期的星期
	 * @param datestr 格式2015-01-31
	 * @returns {string}
	 */
	$sHelper.getDay = function (datestr){
	    var str = datestr.replace(/-/g,"/");
	    var date = new Date(str);
	    return weekArray1[date.getDay()];
	} ;
	
	//求出当前周内的星期一和星期日的日期
	$sHelper.getThisWeekDate = function () {
	    var now = new Date();
	    var currentWeek = now.getDay();
	    if (currentWeek == 0) {
	        currentWeek = 7;
	    }
	    var monday = now.getTime() - (currentWeek - 1) * 24 * 60 * 60 * 1000; // 星期一
	    var sunday = now.getTime() + (7 - currentWeek) * 24 * 60 * 60 * 1000; // 星期日
	    monday = new Date(monday).Format("yyyy-MM-dd");
	    sunday = new Date(sunday).Format("yyyy-MM-dd");
	} ;
	
	/**
	 * 比较2个时间相差的天数
	 * 用结束时间 减开始时间
	 */
	$sHelper.daysBetween = function(startdate,enddate) { 
	  var cha = (Date.parse(enddate) - Date.parse(startdate)) / 86400000 * 24;
	  return cha ;
    }
	
/**
 * 公共处理函数
 * 
 */

	//把一串字符中的数字截取出来
	$sHelper.replaceNum = function (str) {
	    return str.replace(/[^0-9]/ig,"");
	};
	 
	//去除字符串中的所有汉字
	$sHelper.removeChinese = function(str){
	    return this.replace(/[\u4e00-\u9fa5]/g,"");
	}
	//日期格式化
	$sHelper.FormatDate = function (fmt) { //author: meizz
	    var o = {
	        "M+": this.getMonth() + 1, //月份
	        "d+": this.getDate(), //日
	        "h+": this.getHours(), //小时
	        "m+": this.getMinutes(), //分
	        "s+": this.getSeconds(), //秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	        "S": this.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	};

	//将表单序列化成json 对象
	$.fn.serializeObject = function(){
	    var obj = {};
	    var count = 0;
	    $.each( this.serializeArray(), function(i,o){
	        var n = o.name, v = o.value;
	        count++;
	        obj[n] = obj[n] === undefined ? v
	            : $.isArray( obj[n] ) ? obj[n].concat( v )
	            : [ obj[n], v ];
	    });
	    //obj.nameCounts = count + "";//表单name个数
	    return obj;
	};
	
	/**
	 * 对专职、兼职老师的图标处理
	 * @param employment
	 * @returns {string}
	 */
	function teacherEmployment(employment){
	    if(isnull(employment)===""){
	        return "";
	    }
	    return employment=="1"?""+ctx+"/styles/img/zhuan.jpg":""+ctx+"/styles/img/jianz.jpg";
	};
	/**
	 * 性别字体
	 * @param gender
	 * @param name
	 * @returns {string}
	 */
	function genderFont(gender,name){
	    if(isnull(gender)===""){
	        return "";
	    }
	    return "<font class=\"fl_l "+(gender==1?'f-blue':'f-prin')+"\">"+name+"</font>";
	};

/**
 * -------------------------数组处理API 
 */

	/**
	 * 查看此数组中是否包含指定元素
	 * @param obj
	 * @returns boolean
	 */
	$sHelper.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	};
	
	/**
	 * 把数组的所有项生成name1=value1&name2=value2&...的URL参数字符串
	 *
	 * @private
	 * @param urlParams:
	 *            传入字符串
	 * @param params:
	 *            函数所有参数的数组
	 * @param start:
	 *            从第几个参数开始截取
	 */
	$sHelper.arrayToUrl = function (urlParams, params, start)
	{
	    for (var i = start; i < params.length - 1; i = i + 2)
	    {
	        if (urlParams != '')
	            urlParams += "&";
	        urlParams += params[i] + "=" + params[i+1];
	    }
	    return urlParams;
	};
	
	//去重规则和自由中重复的日期
	$sHelper.isDateSame = function (array1,array2){
	    for(var i=0;i<array1.length;i++){
	        var flag = true;
	        for(var j=0;j<array2.length;j++){
	            if(array1[i]==array2[j]){//比较两个array中如果有不同的则加入到array2中，如果有相同的则不加入
	                console.log("相同的日期为："+array1[i]);
	                flag = false;
	                //array2.splice(j,1);
	            }
	        }
	        if(flag){
	            array2.push(array1[i]);
	        }
	    }
	    console.log(array2);
	    var datestr = "";
	    for (var i = 0; i < array2.length; i++) {
	        datestr+=array2[i]+",";
	    }
	    return datestr.trimEnd(",");
	} ;
	
	$sHelper.uuid = function(len, radix) {
		    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		    var uuid = [], i;
		    radix = radix || chars.length; 
		    if (len) {
		      // Compact form
		      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		    } else {
		      // rfc4122, version 4 form
		      var r; 
		      // rfc4122 requires these characters
//		      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		      uuid[14] = '4'; 
		      // Fill in random data.  At i==19 set the high bits of clock sequence as
		      // per rfc4122, sec. 4.1.5
		      for (i = 0; i < 36; i++) {
		        if (!uuid[i]) {
		          r = 0 | Math.random()*16;
		          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		        }
		      }
		    } 
		    return uuid.join('');
	}
	 
	 /**
	  * 操作完成提示
	  * @param {Object} msg
	  */
	$sHelper.showMsgTs= function(msg,callback) {
		 $.ligerDialog.waitting(msg); 
         setTimeout(function () { 
         	$.ligerDialog.closeWaitting(); 
         	if (callback) callback();
         }, 1000);
	}
	
	/**
	 * 判断数组是否已经有值
	 * @param {Object} text
	 * @param {Object} list
	 */
	$sHelper.checkInArray = function(text,list) {
	    for(var i in list) {
	    	if (list[i]==text){
	    		return true;
	    	}  
	    }
	    return false;
	}
	
	/**
	 * 获取指定数组里，NAME 的JSON对象
	 * @param {Object} name
	 * @param {Object} arr
	 *   
	            name:'直接访问',
	            type:'bar',
	            data:[320, 332, 301, 334, 390, 330, 320]
	         
	 */
	$sHelper.getJsonForArray = function(fname,arr) {
	    var len = arr.length,i;
	    for(i = 0; i < len; i++) {
	    	var jsontmp = arr[i] ;
	    	if (jsontmp.name==fname){
	    		return jsontmp;
	    	} 
	    }
	    return null ;
	} 
	
	/**
	 * 生成一点范围内是随机数
	 * @param {Object} Min
	 * @param {Object} Max
	 */
	$sHelper.GetRandomNum =function(Min,Max)
	{   
	  var Range = Max - Min;   
	  var Rand = Math.random();   
	  return(Min + Math.round(Rand * Range));   
	}   
 
})(jQuery, window.$sHelper={});