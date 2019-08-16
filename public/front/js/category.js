$(function(){
    // 一进入页面,发送ajax请求,渲染左侧导航
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function(info){
            var htmlStr=template("leftTpl",info);
            $(".lt-cate-left ul").html(htmlStr);
            
            // 获取导航栏中第一个按钮的id值
            var id=$(".lt-cate-left li:first-child a").data("id");
            
            // 渲染第一个导航的右侧主体内容
            render(id);
        }
    })

    // 根据id获取数据渲染页面
    function render(id){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("rightTpl",info);
                $(".lt-cate-container").html(htmlStr);
            }
        })
    }


    // 给导航栏所有按钮注册点击事件
    $(".lt-cate-left").on("click","a",function(){
        // 获取当前点击按钮的id
        var id=$(this).data("id");
        // 排他功能,当前按钮高亮,其他的按钮删除类
        $(this).addClass("current");
        $(this).parent().siblings().find("a").removeClass("current");
        // 重新渲染页面
        render(id);
    })


    
    
})