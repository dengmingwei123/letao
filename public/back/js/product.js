$(function(){
    // 设置全局变量
    var currentPage=1; //当前页
    var pageSize=2; //每页多少条
    var picArr=[];//用于存储图片地址

    // 一进入商品页面,发送ajax请求,获取数据,渲染页面
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("productTpl",info);
                $("tbody").html(htmlStr);
    
                // 分页功能
                $("#paginator").bootstrapPaginator({
                    // 设置版本
                    bootstrapMajorVersion:3,
                    // 设置当前页
                    currentPage:currentPage,
                    // 总共多少页
                    totalPages:info.total/info.size,
                    // 配置按钮的显示文字,返回值就是设置的文本
                    itemTexts:function(type,page,current){
                        // type可以获取按钮的类型
                        // page获取页码
                        // current获取当前在哪页
                        // console.log(arguments);

                        switch ( type ){
                            case "page":return page;
                            case "prev":return "上一页";
                            case "next":return "下一页";
                            case "last":return "尾页";
                            case "first":return "首页";
                        }
                    },
                    // 注册页码点击事件
                    onPageClicked:function(a,b,c,page){
                        currentPage=page;
                        // 重新渲染页面
                        render();
                    }
                })
            }
            
        })    
    }

    // 点击添加商品,显示模态框
    $("#add_product").on("click",function(){
        $("#add_modal").modal("show");

        // 发送ajax请求,获取二级分类,动态渲染下拉框
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                var htmlStr=template("dropdownTpl",info);
                $("#dropdown_menu").html(htmlStr);
            }
        })

    })

    // 获取图片地址
    $("#fileupload").fileupload({
        dataType:"json",
        done:function(e,data){
            // 将图片数据传入数组中,后来的往前面加
            picArr.unshift(data.result);
            // 在页面中添加图片标签,prepend,将内容添加到被选元素子元素的前面
            $("#imgBox").prepend("<img src='"+data.result.picAddr+"'width='100'>");

            // 判断是否等于3张
            if(picArr.length===3){
                // 用户传够三张,设置校验状态为VALID
                $("#form").data("bootstrapValidator").updateStatus("fileStatus","VALID");
            }

            // 判断是否超过3张
            if(picArr.length>3){
                // 找到最后一个img标签,删除
                $("#imgBox img:last-of-type").remove();
            }
        }
    })

    // 下拉框选中后将值赋给input框，将来获取表单数据传递后台
    $("#dropdown_menu").on("click","a",function(){
        // 将当前a标签的文本赋值给下拉框
        var txt=$(this).text();
        $(".secondCate").text(txt);

        // 将ID赋值给input框
        var id=$(this).data("id");
        $("[name='brandId']").val(id);

        // 当前的校验状态改为 VALID
        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID")
    })

    // 表单校验
    $('#form').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],
    
        // 配置图标
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
    
        // 配置校验字段
        fields: {
          // 二级分类id, 归属品牌
          brandId: {
            validators: {
              notEmpty: {
                message: "请选择二级分类"
              }
            }
          },
          // 商品名称
          proName: {
            validators: {
              notEmpty: {
                message: "请输入商品名称"
              }
            }
          },
          // 商品描述
          proDesc: {
            validators: {
              notEmpty: {
                message: "请输入商品描述"
              }
            }
          },
          // 商品库存
          // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
          // 数字: \d
          // + 表示一个或多个
          // * 表示零个或多个
          // ? 表示零个或1个
          // {n} 表示出现 n 次
          num: {
            validators: {
              notEmpty: {
                message: "请输入商品库存"
              },
              //正则校验
              regexp: {
                regexp: /^[1-9]\d*$/,
                message: '商品库存格式, 必须是非零开头的数字'
              }
            }
          },
          // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
          size: {
            validators: {
              notEmpty: {
                message: "请输入商品尺码"
              },
              //正则校验
              regexp: {
                regexp: /^\d{2}-\d{2}$/,
                message: '尺码格式, 必须是 32-40'
              }
            }
          },
          // 商品价格
          price: {
            validators: {
              notEmpty: {
                message: "请输入商品价格"
              }
            }
          },
          // 商品原价
          oldPrice: {
            validators: {
              notEmpty: {
                message: "请输入商品原价"
              }
            }
          },
          // 标记图片是否上传满三张
          fileStatus: {
            validators: {
              notEmpty: {
                message: "请上传3张图片"
              }
            }
          }
        }
      });
    // 注册表单校验成功事件
    $("#form").on("success.form.bv",function(e){
        // 阻止默认提交跳转事件
        e.preventDefault();
        
        var dataStr=$("#form").serialize();
        // 字符串拼接,将图片地址和名字拼接到dataStr中
        picArr.forEach(function(v,i){
            dataStr+="&picName"+(i+1)+"="+v.picName+"&picAddr"+(i+1)+"="+v.picAddr+"";
        })

        // 通过ajax提交数据
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:dataStr,
            dataType:"json",
            success:function(info){
                if(info.success){
                    // 关闭模态框
                    $("#add_modal").modal("hide");

                    //重新渲染第一页
                    currentPage=1;
                    render();
                    
                    // 清空表单数据和校验样式
                    $("#form").data("bootstrapValidator").resetForm(true);

                    // 设置下拉框文本,删除图片
                    $(".secondCate").text("请选择二级分类");
                    $("#imgBox img").remove();

                    // 重置数组picArr
                    picArr=[];
                }
            }
        })
    })

    

})