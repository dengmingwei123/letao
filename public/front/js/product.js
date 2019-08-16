$(function(){
    // 进入页面,获取地址栏中的参数,发送ajax请求,渲染页面
    // 封装的方法,获取地址栏的参数
    var productId=getSearch("productId");
    // 发送ajax请求
    $.ajax({
        type:'get',
        url:"/product/queryProductDetail",
        data:{
            id:productId
        },
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr=template("productTpl",info);
            $(".lt-main .mui-scroll").html(htmlStr);

            // 动态渲染的页面,需要手动初始化轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
            });

            // 动态渲染页面,数字输入框,需要手动初始化
            mui(".mui-numbox").numbox()
        }
    })

    // 给尺码注册点击事件,点击尺码高亮
    $(".lt-main").on("click",".yardage",function(){
        $(this).addClass("current").siblings().removeClass("current");
    })

    // 点击加入购物车,获取尺码和数量还有id,发送请求,添加到购物车
    $("#addCart").click(function(){
        // 获取尺码
        var size=$(".lt-main .yardage.current").text();
        // 判断是否选中尺码
        if(!size){
            mui.toast("请选择尺码");
            return;
        }
        // 获取数量
        var num=$(".mui-numbox-input").val();

        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/cart/addCart",
            data:{
                productId:productId,
                num:num,
                size:size,
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                // 返回数据 error ,未登录
                if(info.error===400){
                    // 用户未登录,跳转到登录页,将之前页面地址转为参数,传入地址栏中,将来可以跳转回当前页面
                    location.href="login.html?retUrl="+location.href;
                }
                // 已登录
                if(info.success){
                    // 打开确认框，是否跳转
                    mui.confirm("添加成功","温馨提示",['去购物车',"继续浏览"],function(e){
                        if(e.index===0){
                            // 跳转购物车页面
                            location.href="cart.html"
                        }
                    })
                }
            }
        })
    })

})