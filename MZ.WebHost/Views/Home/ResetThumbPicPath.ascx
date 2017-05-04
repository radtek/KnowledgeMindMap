﻿<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>

<form id="resetLogDateForm" action="" method="post">
<table>
    <tr>
        <td>
            替换前的字符串:
        </td>
        <td>
            <input type="text" style="width: 600px; font-size: 20px" name="preText" />
        </td>
        <td>
            tbName
        </td>
    </tr>
    <tr>
        <td>
            替换后的字符串:
        </td>
        <td>
            <input type="text" style="width: 600px; font-size: 20px" name="aftText" />
        </td>
        <td>
            tbName
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <input type="button" value="保存" onclick="resetTbData();" />
        </td>
    </tr>
</table>
</form>
<script type="text/javascript">
    function resetTbData() {
        var tbName = $("#resetLogDateForm").find("input[name=tbName]").val();

        $.ajax({
            url: "/Home/ReSetSysLogTime",
            type: 'post',
            data: {
                tbName: tbName
            },
            dataType: 'json',
            error: function () {
                MZ.msgbox.show("未知错误，请联系服务器管理员，或者刷新页面重试", 5);
            },
            success: function (data) {
                if (data.Success == false) {
                    MZ.msgbox.show(data.Message, 5);
                }
                else {
                    MZ.msgbox.show("更新成功", 4);
                }
            }
        });
    }
</script>
