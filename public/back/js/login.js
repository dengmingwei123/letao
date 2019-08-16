$(function(){
    // 1.表单校验功能
        // 1.用户名不能为空
        // 2.用户名必须是2-6位
        // 1.密码不能为空
        // 2.密码必须是6-12位
    // 初始化表单校验
    $("#form").bootstrapValidator({
        // 配置校验时的图标显示,默认bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 指定校验字段
        fields:{
            // 校验用户名,通过表单name属性
            username:{
                // 配置校验规则
                validators:{
                    // 为空
                    notEmpty:{
                        // 提示信息
                        message:"用户名不能为空"
                    },
                    // 判断长度
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名必须是2-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }
                }
            },
            // 校验密码,通过表单name属性
            password:{
                // 配置校验规则
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    // 判断长度
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码必须是6-12位"
                    },
                    callback:{
                        message:"密码错误"
                    }
                }
            }
        }
    })

    // 2.登录功能
    // 表单校验插件会在提交表单时进行校验
    // (1)校验成功,默认就是提交表单,会发生页面跳转
    //    我们需要注册表单校验成功事件,阻止默认的提交,通过ajax发送请求
    // (2)校验失败,不会提交表单,配置插件提示用户即可
    $("[type='submit']").click(function(e){
        // 阻止表单默认跳转事件
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$("#form").serialize(),
            dataType:"json",
            success:function(info){
                if(info.success){
                    // 登录成功,跳转首页
                    location.href="index.html";
                }
                if(info.error===1001){
                    // updateStatus
                    // 1.字段名称 
                    // 2.校验状态  VALID,INVALID  NOT_VALIDATED未校验的,VALIDATING校验中
                    // 3.校验规则,用于指定提示文本
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
                if(info.error===1000){
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback")
                }
            }
        })
    })



    // 3.重置功能
    $("[type='reset']").click(function(){
        // $("#form").data("bootstrapValidator")  获取表单校验的方法
        // 通过 .resetForm(Boolean) 可以清空表单内容及状态
        // 参数 传true 重置表单内容及校验状态   传false或者不传 重置表单校验状态
        $("#form").data('bootstrapValidator').resetForm();
    })
})