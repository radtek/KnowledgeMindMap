/*
//by zuizui 2014.7.14
//huangzuizui@gmail.com
//定义全局变量GLOBAL,方便各匿名函数间数据通信，有效防止全局变量冲突
//使用方法：
//   1、定义命名空间（命名空间冲突会弹框提示）： GLOBAL.namespace('GLOBAL.ANIMAL.DOG'); GLOBAL.namespace('ANIMAL.CAT'); GLOBAL.namespace('ANIMAL.FISH')...
//   2、定义命名空间变量： var GLOBAL.ANIMAL.DOG.name='jim', GLOBAL.ANIMAL.DOG.age='11', GLOBAL.ANIMAL.CAT.name='tom', GLOBAL.ANIMAL.CAT.age='13'...
*/

var GLOBAL={};
GLOBAL.namespace=function(name){
 var arr=name.split('.');
 var o=GLOBAL,len=arr.length;
 for(var i= (arr[0] =='GLOBAL')?1:0;i<len;i++){
  if(i==len-1){
   if(typeof(eval("GLOBAL."+name.replace(/^GLOBAL./,'')))!='undefined') alert('namespace "'+name+'" already exist');
  }
  o[arr[i]]=o[arr[i]] || {};
  o=o[arr[i]]
 }
}

;(function($){ 
	$.fn.extend({ 
		//定义鼠标右键方法，接收一个函数参数 
		"rightClick":function(fn){ 
			//调用这个方法后将禁止系统的右键菜单 
			$(document).bind('contextmenu',function(e){ 
			return false; 
		}); 
		//为这个对象绑定鼠标按下事件 
		$(this).mousedown(function(e){ 
		//如果按下的是右键，则执行函数 
			if(3 == e.which){ 
				fn(); 
				} 
			}); 
		} 
	}); 

})(jQuery);

var ZZ={
	dump:function (data){
		for(i in data){
			alert('下标：'+i+'\n值：'+data[i]);
		}
	},
	stopPropagation:function(e) {
		e = e || window.event;
		if(e.stopPropagation) { //W3C阻止冒泡方法
			e.stopPropagation();
		} else {
			e.cancelBubble = true; //IE阻止冒泡方法
		}
	}
	
}