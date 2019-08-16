$(function(){
    // 点击登录按钮,获取用户名和密码,发送ajax请求,进行登录操作
    $("#loginBtn").click(function(){
        // 获取用户名
        var username=$("#username").val().trim();
        // 判断是否为空
        if(username===""){
            mui.toast("请输入用户名");
            return;
        }
        // 获取密码
        var password=$("#password").val().trim();
        // 判断是否为空
        if(password===""){
            mui.toast("请输入密码");
            return;
        }

        // 发送请求
        $.ajax({
            type:"post",
            url:"/user/login",
            data:{
                username:username,
                password:password
            },
            dataType:'json',
            success:function(info){
                // 用户名或者密码错误
                if(info.error===403){
                    mui.toast(info.message);
                }

                // 成功,跳转页面
                if(info.success){
                    // 获取一下地址栏中是否有参数,如果有参数,跳转到该页面,没有则跳转到用户中心
                    if(location.search.indexOf("retUrl") != -1){
                        var url=location.search;
                        url=url.slice(url.indexOf("http"));
                        location.href=url;
                    }else{
                        location.href="user.html";
                    }
                }
            }
        })
        
    })
})