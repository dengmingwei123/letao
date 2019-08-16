$(function(){
    // 定义全局变量
    var currentPage=1;//当前页
    var pageSize=5;//每页多少条
    // 进入页面,发送ajax请求获取数据,渲染页面
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("firstCateTpl",info);
                $("tbody").html(htmlStr);
                // 分页功能
                $("#paginator").bootstrapPaginator({
                    // 设置版本
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(info.total/info.size),//一共多少页
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        render();
                    }
                })
            }
        })
    }

    // 点击添加分类,显示模态框
    $("#add_cate").click(function(){
        $("#addmodal").modal("show");
    })

    // 表单校验
    $("#form").bootstrapValidator({
        //指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 选择字段
        fields:{
            // 通过name属性
            categoryName:{
                // 设置校验规则
                validators:{
                    // 非空
                    notEmpty:{
                        message:"请输入一级分类"
                    }
                }
            }
        }
    })

    
    // 注册表单校验成功事件,取消默认提交跳转事件
    $("#form").on("success.form.bv",function(e){
        // 取消提交的默认跳转事件
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                // 关闭模态框
                $("#addmodal").modal("hide");
                // 重新渲染页面,因为是添加到第一个,所以渲染第一页
                currentPage=1;
                render();
                // 清空表单的数据和校验样式
                $("#form").data("bootstrapValidator").resetForm(true);
            }
        })
    })

})