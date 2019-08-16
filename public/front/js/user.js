$(function(){
    // 一进入页面发送ajax请求,渲染用户信息
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function(info){
            console.log(info);
            // 判断是否登录
            if(info.error===400){
                // 未登录,拦截到登录页
                location.href="login.html";
            }
            // 已登录
            var htmlStr=template("userTpl",info);
            $(".lt-main .lt-user").html(htmlStr);
        }
    })

    // 点击退出按钮,发送请求,删除用户数据,跳转回登录页
    $("#logout-btn").click(function(){
        $.ajax({
            type:"get",
            url:"/user/logout",
            dataType:"json",
            success:function(info){
                // 退出成功
                if(info.success){
                    location.href="login.html"
                }
            }
        })
    })
})