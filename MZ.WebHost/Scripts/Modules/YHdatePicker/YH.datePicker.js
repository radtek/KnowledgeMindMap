/**
该插件仅能选择年份与月份
调用方法$(selector).datePicker();
*/
; (function ($, window, undefined) {
    $.fn.datePicker = function(){
        return this.each(function(){
            var $obj = $(this); //输入框
            var myDate = new Date();
            var thisYear = parseInt(myDate.getFullYear()); //当前年份
            var thisMonth = parseInt(myDate.getMonth()+1); //当前月份
            var yearStr = thisYear.toString();
            var lastNum = parseInt(yearStr.substring(yearStr.length-1));
            var minYear = parseInt(thisYear-lastNum);

            var yearContent = "<div class='datetimepicker-years' style='display: block;'>"+
                              "<table width='100%'><thead><tr>"+ 
                              "<th class='prev' style='visibility: visible;'><span class='glyphicon glyphicon-arrow-left'><</span></th>"+
                              "<th colspan='5' class='switch'><span class='min'>"+minYear+"</span>-<span class='max'>"+(minYear+9)+"</span></th>"+
                              "<th class='next' style='visibility: visible;'><span class='glyphicon glyphicon-arrow-right'>></span></th>"+
                              "</tr></thead><tbody><tr><td colspan='7'>";
            
            for(var i=-1;i<=10;i++){
//                if((minYear+i)==thisYear)
//                    yearContent += "<span class='year active'>"+ (minYear + i) +"</span>";
//                else
                    yearContent += "<span class='year'>"+ (minYear + i) +"</span>";
            }
            yearContent +="</td></tr></tbody></table></div>";

            var monthContent = "<div class='datetimepicker-months' style='display: none;'><table width='100%'><thead><tr>"+
                               "<th class='prev' style='visibility: visible;'><span class='glyphicon glyphicon-arrow-left'><</span></th>"+
                               "<th colspan='5' class='switch'>2014</th>"+
                               "<th class='next' style='visibility: visible;'><span class='glyphicon glyphicon-arrow-right'>></span></th>"+
                               "</tr></thead><tbody><tr><td colspan='7'>"+
                               "<span class='month' value='1'>一月</span><span class='month' value='2'>二月</span>"+
                               "<span class='month' value='3'>三月</span><span class='month' value='4'>四月</span>"+
                               "<span class='month' value='5'>五月</span><span class='month' value='6'>六月</span>"+
                               "<span class='month' value='7'>七月</span><span class='month' value='8'>八月</span>"+
                               "<span class='month' value='9'>九月</span><span class='month' value='10'>十月</span>"+
                               "<span class='month' value='11' style='font-size: 14px;'>十一月</span><span class='month' value='12' style='font-size: 14px;'>十二月</span>"+
                               "</td></tr></tbody></table></div>";
            var $dateContent = $("<div class='datetimepicker' style='width:200px;'></div>");
            $dateContent.html(yearContent+monthContent);
            
            $obj.on("click",function(){
                var top = $obj.offset().top+$obj.height();
                var left = $obj.offset().left;
                $obj.parent().append($dateContent);
                $dateContent.css({"position":"absolute","top":top,"left":"left"}).show();
                $(document).on('click', inpClickOuside);
            });

            $dateContent.on("click",".switch", function () { //切换到年份视图
                $(".datetimepicker-years").show();
                $(".datetimepicker-months").hide();
            });

            $dateContent.on("click", ".datetimepicker-years .glyphicon-arrow-right", function () { //年份视图
                var $this = $(this);
                var yearSpan = $this.closest("table").find("tbody").find("span");
                yearSpan.each(function () {
                    var newVal = parseInt($(this).text()) + 10;
                    $(this).text(newVal);
                });
                var min = $this.closest("table").find(".min");
                var max = $this.closest("table").find(".max");
                min.text(parseInt(min.text())+10);
                max.text(parseInt(max.text())+10);
            }).on("click", ".datetimepicker-years .glyphicon-arrow-left", function () {
                var $this = $(this);
                var yearSpan = $this.closest("table").find("tbody").find("span");
                yearSpan.each(function () {
                    var newVal = parseInt($(this).text()) - 10;
                    $(this).text(newVal);
                });
                var min = $this.closest("table").find(".min");
                var max = $this.closest("table").find(".max");
                min.text(parseInt(min.text())-10);
                max.text(parseInt(max.text())-10);
            }).on("click", ".datetimepicker-years tbody span.year", function () {
                var newYear = parseInt($(this).text());
                var yearView = $(".datetimepicker-years");
                var monthView = $(".datetimepicker-months");
                yearView.hide();
                monthView.show();
                monthView.find("thead .switch").text(newYear);
            });

            //月份视图
            $dateContent.on("click", ".datetimepicker-months .glyphicon-arrow-right", function () {
                var $this = $(this);
                var yearSpan = $this.closest("tr").find(".switch");
                var newYear = parseInt(yearSpan.text()) + 1;
                yearSpan.text(newYear);
            }).on("click", ".datetimepicker-months .glyphicon-arrow-left", function () {
                var $this = $(this);
                var yearSpan = $this.closest("tr").find(".switch");
                var newYear = parseInt(yearSpan.text()) - 1;
                yearSpan.text(newYear);
            }).on("click", ".datetimepicker-months tbody span.month", function () {
                var $month = $(this);
                var year = parseInt($month.closest("table").find(".switch").text()); //年份
                var month = $month.attr("value");
                $obj.val(year + "-" + month);
                $dateContent.detach();
            });
            
            var inpClickOuside = function (e) {//点击空白处隐藏
                if ($(e.target).closest($dateContent).length==0 && $(e.target).closest($obj).length==0) {
                    $(document).off('click', arguments.callee)
                    $dateContent.detach();
                }
            };
        });
    }
})(jQuery);