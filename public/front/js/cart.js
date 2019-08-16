$(function(){
    // 进入页面,发送请求,获取数据,页面渲染
    // render();
    function render(){
        setTimeout(function(){
            $.ajax({
                type:"get",
                url:"/cart/queryCart",
                dataType:"json",
                success:function(info){
                    console.log(info);
                    // 判断是否登录
                    if(info.error===400){
                        // 未登录,拦截到登录页
                        location.href="login.html";
                    }
                    // 页面渲染
                    var htmlStr=template("cartTpl",{ info:info });
                    $(".lt-main .mui-table-view").html(htmlStr);

                    // 在页面渲染之后,停止下拉刷新
                    mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                }
            })
        },500)
    }

    // 下拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
            auto:true,
            callback :function(){
                // 下拉刷新完毕后发送请求,渲染页面
                render();
            }
            }
        }
    });

    // 功能1:点击删除按钮,删除当前选中的商品
    $(".lt-main").on("tap",".btn_del",function(){
        console.log(1)
        // 获取当前点击的商品id
        var id=$(this).data("id");
        // 发送请求,删除数据
        $.ajax({
            type:"get",
            url:"/cart/deleteCart",
            data:{
                id:[id]
            },
            dataType:"json",
            success:function(info){
                // 成功.重新刷新页面
                if(info.success){
                    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()
                }
            }
        })
    })

    // 功能2:点击编辑按钮,弹出编辑框
    $(".lt-main").on("tap",".btn_edit",function(){
        // 获取当前点击按钮的数据
        var obj=this.dataset;
        var id=$(this).data("id");
        
        var htmlStr=template("editTpl",obj);
        htmlStr=htmlStr.replace(/\n/g,"");

        mui.confirm(htmlStr,"编辑商品",['确认','取消'],function(e){
            if(e.index===0){
                // 点击确定,获取数据,发送请求,修改数据,重新渲染页面
                // 获取当前尺码
                var size=$(".yardage.current").text();
                var num=$(".mui-numbox-input").val();

                $.ajax({
                    type:"post",
                    url:"/cart/updateCart",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function(info){
                        // 如果修改成功,下拉刷新页面
                        if(info.success){
                            // 开启下拉刷新
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                })
            }
        })
        // 动态渲染的数字框,需要手动初始化
        mui(".mui-numbox").numbox()

        // 编辑框的尺码按钮动态设置点击事件
        $("body").on("click",".yardage",function(){
            $(this).addClass("current").siblings().removeClass("current");
        })
    })

    

})