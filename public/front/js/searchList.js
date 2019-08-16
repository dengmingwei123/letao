$(function(){
    // 创建全局变量
    var currentPage=1;//当前页
    var pageSize=2;//每页多少条

    // 进入页面,获取地址栏传入的参数,设置给搜索框
    var search=getSearch("key");

    // 设置搜索框的值
    $(".lt-search-input").val(search);

    // 功能1:通过搜索框中的数据发送ajax请求,获取数据,渲染页面
    // render();
    function render(callback){
        // 每次渲染之前,将结构重置
        // $(".lt-product").html('<div class="loding"></div>')


        var data={};
        // 必定传入的参数
        data.proName=$(".lt-search-input").val();
        data.page=currentPage;
        data.pageSize=pageSize;

        // 俩个不一定传入的参数
        // 判断排序中,有没有点击排序
        if($(".lt_sort a.current").length != 0){
            var key=$(".lt_sort a.current").data("type");
            // 1:升序 2:降序
            var value=$(".lt_sort a.current i").hasClass("fa-angle-down") ? 2 : 1;
            data[key]=value;
        }

        // 发送ajax请求
        // 设置加载效果
        setTimeout(function(){
            $.ajax({
                type:"get",
                url:"/product/queryProduct",
                data:data,
                dataType:"json",
                success:function(info){
                    callback && callback(info);
                }
            })
        },500)
    }

    // 下拉刷新功能,上拉加载
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // 下拉刷新
            down : {
                auto:true,//进入页面执行一次下拉刷新
                callback :function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    // 上拉刷新,只加载第一页的内容
                    currentPage=1;
                    render(function(info){
                        var htmlStr=template("productTpl",info);
                        $(".lt-product").html(htmlStr);

                        // 在数据返回之后,停止下拉刷新
                        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
                        
                        // 重新开启下拉加载
                        mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
                    });
                } 
            },
            // 上拉加载
            up:{
                callback:function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    // 上拉的时候,需要获取下一页的数据
                    currentPage++;
                    render(function(info){
                        var htmlStr=template("productTpl",info);
                        // 上拉加载是在原有的基础上添加数据
                        $(".lt-product").append(htmlStr);

                        // 判断返回来的数据长度,需要停止上拉加载
                        if(info.data.length===0){
                            // 如果0,则停止上拉加载,并禁用上拉加载,输出没有更多数据了
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }else{
                            // 否则只是停止
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }

                    })
                }
            }
        }
    });





    // 功能2:点击搜索按钮,重新发送请求渲染页面
    // mui中,下拉刷新和上拉加载默认禁用了a标签的点击事件,需要使用tap事件
    $(".lt-search-btn").on("tap",function(){
        // 获取搜索框的值
        var txt=$(".lt-search-input").val();
        // 判断搜索框的值是否为空
        if(txt.trim()===""){
            mui.toast("请输入搜索关键字");
            return;
        }
        // 需要将本地web存储的历史记录重新提交
        // 获取的是json字符串
        var jsonStr=localStorage.getItem("search_list");
        // 将json字符串转为数组
        var arr=JSON.parse(jsonStr);
        // 判断当前的值数组中是否有重复
        var index=arr.indexOf(txt);
        if(index != -1){
            // 证明有,需要先删除,然后再添加
            arr.splice(index,1);
        }
        // 判断历史记录是否超过十条,超过则删除最后一条
        if(arr.length >= 10){
            arr.pop();
        }
        // 将新的数据添加到数组最前面
        arr.unshift(txt);
        // 将数组转为json字符串,重新提交到本地web存储
        localStorage.setItem("search_list",JSON.stringify(arr));

        // 重新触发下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    })

    // 功能3:排序功能
    // 给带有data-type属性的排序,注册点击事件
    $(".lt_sort a[data-type]").on("tap",function(){
        // 判断当前点击的是否有current类
        if(!$(this).hasClass("current")){
            // 没有则添加,其他的元素删除
            $(this).addClass("current").siblings().removeClass("current");
        }
        else{
            // 有则改变i的类样式
            // 俩个toggle,有此样式就关闭,没有就打开
            //            没有此样式就打开,有就关闭
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }
        // 重新触发下拉刷新即可
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
    })

    // 给商品注册事件,点击进行跳转
    $(".lt-product").on("tap","a",function(){
        var id=$(this).data("id");
        console.log(id)
        location.href="product.html?productId="+id;
    })

})