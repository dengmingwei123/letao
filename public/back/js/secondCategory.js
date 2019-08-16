$(function(){
    // 定义全局变量
    var currentPage=1;//当前页
    var pageSize=5;//每页多少条
    var txt;//文本
    var imgUrl;//图片地址

    // 进入页面发送ajax请求,获取数据,渲染页面
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("secondTpl",info);
                $("tbody").html(htmlStr);
                // 分页功能
                $("#paginator").bootstrapPaginator({
                    // 设置版本
                    bootstrapMajorVersion:3,
                    // 当前页
                    currentPage:currentPage,
                    // 一共多少页
                    totalPages:Math.ceil(info.total/info.size),
                    // 点击页码切换事件
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        render();
                    }
                })
            }
        })
    }

    // 点击添加分类,弹出模态框
    $("#add_btn").click(function(){
        $("#addmodal").modal("show");
        // 发送ajax请求,获取数据,渲染下拉框
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("firstTpl",info);
                $("#secondOptions").html(htmlStr);
            }
        })
    })

    // 给下拉框的a注册点击事件
    $("#secondOptions").on("click","a",function(){
        // 点击获取文本,添加给下拉框文本
        txt=$(this).text();
        $(".optionText").text(txt);
        // 获取当前选中的分类的id
        $('[name=categoryId]').val($(this).data("id"));
        // 表单校验成功
        $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
    })

    // 上传图片
    $("#fileupload").fileupload({
        dataType:"json",
        // e:事件参数对象
        // data:图片上传后返回的对象,data.result.picAddr可以获取图片地址
        done:function(e,data){
            imgUrl=data.result.picAddr;
            $("#img_preview").attr("src",imgUrl);
            $("[name=brandLogo]").val(imgUrl);
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID")
        }
    })
    
    // 表单验证
    $("#form").bootstrapValidator({
        //指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
        },

        // 指定字段
        fields:{
            // 一级分类
            categoryId:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请选择一级分类"
                    }
                }
            },
            // 二级分类
            brandName:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请输入二级分类"
                    }
                }
            },
            // 图片
            brandLogo:{
                // 校验规则
                validators:{
                    notEmpty:{
                        message:"请选择图片"
                    }
                }
            }
            
        }
    })

    // 注册表单校验成功事件
    $("#form").on("success.form.bv",function(e){
        // 取消默认提交事件
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type:"post",
            url:'/category/addSecondCategory',
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                console.log(info)                
                if(info.success){
                    // 关闭模态框
                    $("#addmodal").modal("hide");
                    // 重新渲染第一页
                    currentPage=1;
                    render();
                    // 清空form表单数据和表单校验样式
                    $("#form").data("bootstrapValidator").resetForm(true);
                    // 下拉框重置
                    $(".optionText").text("请选择一级分类");
                    // 图片清空
                    $("#img_preview").attr("src","images/none.png")
                }
            }
        })
    })

    // 点击取消,重置表单样式
    $("#btn_off").click(function(){
        $("#form").data("bootstrapValidator").resetForm(true)
    })
})