$(function(){

    // 在控制台中创建假数据,统一设置key=search_list
    // var arr=['陈梦妍','周佳佳','黄乐乐','林芷韵','凌月','凌雪'];
    // var jsonStr=JSON.stringify(arr);
    // localStorage.setItem("search_list",jsonStr);


    // 功能1:进入页面获取本地web存储数据,渲染搜索历史
    render();

    // 获取数据,转为数组封装
    function getHistoryArr(){
        // 获取本地web中的数据,取得的是json字符串
        var jsonStr=localStorage.getItem("search_list")||"[]";

        // 转为数组
        var arr=JSON.parse(jsonStr);

        // 将数组返回
        return arr;
    }
    
    // 模板引擎进行渲染
    function render(){
        var htmlStr=template("historyTpl",{ arr:getHistoryArr() });
        $(".lt-history").html(htmlStr);
    }

    // 功能2:点击清空记录按钮,删除所有的历史记录
    $(".lt-history").on("click",".history-clear-btn",function(){
        mui.confirm("您确定要清空历史记录吗?","温馨提示",["取消","确认"],function(e){
            if(e.index===1){
                // 将search_list直接删除
                localStorage.removeItem("search_list");
                // 重新渲染历史记录
                render();
            }
        })
    })

    // 功能3:点击X按钮,删除单个历史记录
    $(".lt-history").on("click",".history-del-btn",function(){
        // 需要将this存储到一个变量中
        var that=$(this);
        mui.confirm("您确定要删除该条记录吗?","温馨提示",["取消","确认"],function(e){
            var key=e.index;
            // 返回的是索引:1,则是确认,0则是取消
            if(key===1){
                // 点击获取当前的点击的索引值
                var index=that.data("index");
                // 获取数据
                var arr=getHistoryArr();
                // 删除数据
                arr.splice(index,1);
                // 将数据重新转为json字符串,上传到历史纪录
                localStorage.setItem("search_list",JSON.stringify(arr));
                // 重新渲染页面
                render();
            }
        })
    })

    // 功能4:点击搜索功能,获取input框中的文本,追加到历史数据中
    $(".lt-search-btn").click(function(){
        // 获取整个历史记录数据
        var arr=getHistoryArr();

        // 获取文本框中的内容
        var text=$(".lt-search-input").val();

        // 将文本框的数据添加到历史纪录中
        // 判断是否输入是否为空
        if(text.trim()===""){
            mui.toast("请输入搜索关键字");
            return;
        }

        // 判断是否有重复
        var index=arr.indexOf(text);
        if(index != -1){
            arr.splice(index,1);
        }
        
        // 判断历史纪录是否超过十个,如果超过了,删除最后一个
        if(arr.length >= 10){
            arr.pop();
        }

        // 添加
        arr.unshift(text);

        // 将数据转为json字符串重新传入本地web存储中
        localStorage.setItem("search_list",JSON.stringify(arr));

        // 文本框内容重置
        $(".lt-search-input").val(""); 

        // 重新渲染页面
        render();

        // 跳转页面
        location.href="searchList.html?key="+text+"";
    })

    // 功能5:点击历史纪录跳转页面
    $(".lt-history").on("click",".history-line",function(){
        // 获取数据
        var arr=getHistoryArr();
        // 将当前点击的历史记录移到最前面
        var txt=$(this).text();
        // 将当前的删除
        arr.splice(arr.indexOf(txt),1);
        // 重新添加最前面
        arr.unshift(txt);
        // 将数据传入本地web存储中
        localStorage.setItem("search_list",JSON.stringify(arr));
        // 重新渲染页面
        render();
    })
})