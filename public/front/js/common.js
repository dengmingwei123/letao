// 轮播图
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
});


// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
	deceleration: 0.0005//阻尼系数,系数越小滑动越灵敏
});

// 获取地址栏中的数据
function getSearch(k){
    // 进入页面渲染获取地址栏传过来的参数
    var search=location.search;
    // 因为中文会乱码,需要转义  decodeURI(获取的参数)
    search=decodeURI(search);
    // 删除?号 slice(起使索引,结束索引),截取字符串,结束索引不传则是到最后
    search=search.slice(1);
    // 先通过&符号 转为数组
    var arr=search.split("&");
    // 创建一个对象,存储数据
    var obj={};
    // 遍历循环数组
    arr.forEach(function(v,i){
        var key=v.split("=")[0];//通过=再分隔数组,0索引的是键
        var value=v.split("=")[1];//通过=再分隔数组,1索引的是value
        obj[key]=value;
    })

    return obj[k];
}