<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<input type="button" value="发送信息" onclick="sendMessage();" />
<script type="text/javascript">
    function sendMessage() {
        $.ajax({
            url: "/Home/SendMsg",
            type: 'post',
            data: {},
            dataType: 'json',
            error: function () {
                MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试", 5);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5);
                }
                else {
                    MZ.msgbox.show("发送成功", 4);
                }
            }
        });
    }
</script>
