$(function(){
    //定义全局变量
    var currentPage=1;//当前第几页
    var pageSize=5;//每页多少条
    var id;//id
    var isDelete;//状态


    // 进入页面发送ajax请求,获取用户数据
    render();
    function render(){
        $.ajax({
            type:"get",
            url:'/user/queryUser',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("tpl",info);
                $("tbody").html(htmlStr);
                // 添加分页功能
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//版本设置3
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(info.total/pageSize),//一共多少页
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        render();
                    }
                })
            }
        })
    }

    // 给禁用启用按钮注册点击事件,点击按钮弹出模态框
    $("tbody").on("click",".btn",function(){
        // 显示模态框
        $("#statusmodal").modal("show");
        // 获取当前点击按钮的Id
        id=$(this).parent().data("id");
        // 获取当前状态
        isDelete=$(this).hasClass("btn-danger")?0:1;
        console.log(id,isDelete)
    })

    // 点击确认按钮,发送请求,修改数据,重新渲染页面
    $("#btn-ok").click(function(){
        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:id,
                isDelete:isDelete
            },
            dataType:"json",
            success:function(info){
                if(info.success){
                    // 关闭模态框
                    $("#statusmodal").modal("hide");
                    // 重新渲染页面
                    render();
                }
            }
        })

    })
})