// 1.登录拦截功能
    // 因为login页面不需要验证是否登录,所以需要另加判断
    // location.href可以获取当前页面的地址
    // indexOf("字符串"),如果有则返回索引值,如果没有,则返回-1
    if(location.href.indexOf("login.html")===-1){
        $.ajax({
            type:"get",
            url:"/employee/checkRootLogin",
            dataType:"json",
            success:function(info){
                if(info.success){
                    // 如果是已登录,什么都不做
                }
                if(info.error===400){
                    // 如果是未登录,拦截到登录页
                    location.href="login.html"
                }
            }
        })
    }

// 2.进度条功能
    // 在第一个ajax请求开始的时候,开启进度条
    $(document).ajaxStart(function(){
        // 开始加载
        NProgress.start();
    })
    // 在所有ajax请求结束后,关闭进度条
    $(document).ajaxStop(function(){
        // 结束进度条
        setTimeout(function(){
            NProgress.done();
        },500)
    })

$(function(){
   

    // 3.弹出退出模态框功能
    $(".icon_logout").click(function(){
        $("#logoutmodal").modal("show");
    })

    // 4.退出功能
    $("#logoutBtn").click(function(){
        // 发送ajax请求
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function(info){
                if(info.success){
                    location.href="login.html"
                }
            }
        })
    })

    

        // 功能1:点击分类栏,显示二级分类
        $(".lt_sidebar .category").click(function(){
            $(".category+.child").stop().slideToggle();
        })
    
        // 功能2:点击菜单隐藏显示侧边栏
        $(".icon_menu").click(function(){
            $(".lt_sidebar").toggleClass("hidemenu");
            $(".lt_torbar").toggleClass("hidemenu");
            $(".lt_main").toggleClass("hidemenu");
        })
})