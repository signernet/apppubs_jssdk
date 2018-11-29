# Apppubs-jssdk使用手册

TIME       | VERSION    | CHANGE
---------- | ---------- | --------------------
2016-07-19 | v0.0.1 dev | 初始化
2016-08-19 | v0.0.1 dev | 增加若干方法，更改初始化方式以及调用方法
2017-11-13 | v0.0.1 dev | 新增支付宝支付接口
2017-11-21 | v0.0.1 dev | 新增微信支付接口
2017-12-14 | v0.0.1 dev | 新增定位接口
2017-12-20 | v0.0.2 dev | 新增手写功能接口
2017-12-27 | v0.0.2 dev | 新增选人方法
2018-2-27  | v1.0.0     | 新增图片显示
2018-9-27  | v1.0.1     | 新增OCR、影像接口

# 概述

apppubs js-sdk 是apppubs提供给基于apppubs的网页开发者的网页开发工具包。 通过此sdk，开发者可以实现获取userid，控制标题栏菜单等功能。

# 使用方法

1.将apppubs_jssdk.js文件引入.

2.调用apppubs.init()方法后即可调用其他功能接口

3.如果需要在页面加载时就调用相关接口，则须把相关接口放在callback函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在callback函数中.

```
  apppubs.init(data,callback)
```

4.请使用ios代码版本在110200或者android代码版本在210200以上的客户端进行测试。

# 接口

## 获取userid

from jssdk:v0.0.1 android:210100;ios:110100

```
apppubs.getUserInfo({
      success:function(res){
          alert("得到的userid"+res);
      }
  })
```

## 显示控制菜单

from jssdk:v0.0.1 android:210100;ios:110100 //隐藏刷新按钮 apppubs.hideMenuItems(["menu_item_refresh"]);

## 打开新窗口

from jssdk:v0.0.1 android:210100;ios:110100

```
apppubs.openWindow("http://xxx.com");
```

## 关闭窗口

from jssdk:v0.0.1 android:210100;ios:110100

```
 apppubs.closeWindow();
```

## 选择图片

from jssdk:v0.0.1 android:210100;ios:110100

```
  apppubs.chooseImage({
    success: function (res) {
          var imagesDiv = document.getElementById("images");
          var htmlStr = "";
          for (var i = 0; i < res.length; i++) {
              htmlStr+="<img width='100%' src='data:image/png;base64,"+res[i]+"'>"
          }
          imagesDiv.innerHTML = htmlStr;
      }
})
```

## 获取设备id

from jssdk:v0.0.1 android:210100;ios:110100

```
apppubs.getDeviceId({
      success: function (res) {
           document.getElementById("text_span").innerHTML = res;
        }
})
```

## 获取用户信息

from jssdk:v1.0.0 android:210300;ios:110300

调用示例：

```
    apppubs.getUserInfo();
```

**调用示例说明**

略

success回调对象格式:

字段说明

略

## 打开二维码扫描

from jssdk:v0.0.1 android:210100;ios:110100

apppubs.scanQRCode()

**调用示例**

```
  apppubs.scanQRCode({
    selfResolve: false,
    success: function(res) {
      alert("扫描结果" + res.result.msg);
    }
  })
```

**示例说明**

> selfResolve<br>
> 二维码是否由客户端自己处理<br>
> true：是，此时客户端二维码扫描成功后，会自动执行打开链接或者拷贝文字到内存的动作。不会返回扫描结果给js；<br>
> false：扫描结果由js处理，success方法回调中会返回扫描结果。

**success回调对象格式:**

```
 {"success":true,"result":{"msg":"扫描结果"}}
```

## 切换app

from jssdk:v0.0.1 android:210100;ios:110100

```
apppubs.changeApp("http://123.56.46.218/,U1471251810276")
```

server和uid用"，"分隔作为参数掺入changeApp方法

## 支付宝支付

from jssdk:v0.0.1 android:210100;ios:110100

apppubs.alipay(data); 示例：

```

  apppubs.alipay(
            {
                orderstr:"xxxx",
                success:function(obj){
                    alert(obj);
                }
            }
        );
```

orderstr参考 <https://docs.open.alipay.com/54/106370/> success:支付回调方法 回调返回值，示例1：

```
    {"result":"","resultStatus":"6001","momo":"用户中途取消"}
```

```
示例2
```

```
    {"result":"这里会返回支付正常的账单信息","resultStatus":"9000","momo":""}
```

--------------------------------------------------------------------------------

## 微信支付

from jssdk:v0.0.1 android:210100;ios:110100

apppubs.wxpay(data);

```
data:json参考 https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=9_12&index=2
success:支付回调方法
```

## 获取地理位置

from jssdk:v0.0.1 android:210100;ios:110100

apppubs.amap(data);

data示例：

```
{
    success:function (obj){
        console.log(obj)
}
```

success回调对象格式:

```
{"latitude":32.3333,"longtitude":33.33333}
```

## 手写签名

from jssdk:v0.0.2 android:210200;ios:110200

调用示例：

```
    apppubs.handwriting({
      data: {
        "handwritingTitle": "手写意见",
        "inputTitle": "输入意见",
        "handwritingDes": "请书写意见",
        "inputDes":"请输入意见",
        "doneTxt": "输入完成",
        "themeColor":"#1874CD",
        "commonWords":["同意","不同意","很好","干得漂亮","待定","还需要讨论"],
        "defaultTxt":"同意"
      },
      success:function (obj){
        console.log(obj)
      }
    });
```

**调用示例说明**

字段               | 说明
---------------- | --------------------
handwritingTitle | 手写标题 String 必须
inputTitle       | 键盘输入标题 String 必须
handwritingDes   | 手写提醒（占位文字）String 必须
inputDes         | 键盘提醒(占位文字) String 必须
doneTxt          | 完成按钮文字 String 必须
themeColor       | 主题颜色，String 必须
commonWords      | 常用语，Array 必须
defaultTxt       | 默认，文字，String 非必须

success回调对象格式:

```
{
    "success":true,
    "result":{
        "type":0,
        "text":"手写意见",
        "image":"base64编码图片"
    }
}
```

字段说明

字段    | 说明
----- | ---------------------------------
type  | 0:文字，1：图片
text  | 键盘输入的文字，有且仅当type==0
image | base64编码后的png格式的图片字符串,有且仅当type==1

## 选择人员

from jssdk:v0.0.2 android:210200;ios:110200

调用示例：

```
apppubs.userPicker({
  data: {
    "selectMode":1,
    "deptsURL": "http://result.eolinker.com/gN1zjDlc87a75d671a2d954f809ebcdd19e7698dc2478fa?uri=depts",
    "usersURL": "http://result.eolinker.com/gN1zjDlc87a75d671a2d954f809ebcdd19e7698dc2478fa?uri=users",
    "searchURL": "http://result.eolinker.com/gN1zjDlc87a75d671a2d954f809ebcdd19e7698dc2478fa?uri=search_users",
    "rootDeptId": "001",
    "preIds":"001001,001002"
  },
  success:function (obj){
    alert(obj.userIds[0])
  }
});
```

**请求参数说明**

字段         | 说明
---------- | ---------------------------------------------------
selectMode | 0:单选，1：多选
deptsURL   | 部门接口 post方式，接受String deptId参数，可为空，此时客户端直接请求usersURL
usersURL   | 用户接口 post方式，接受String deptId参数
searchURL  | 搜索用户接口 post方式，接受String text参数
rootDeptId | 组织根目录id
preIds     | 已选择用户id，","分隔

**成功选择返回对象格式:**

```
{
    "code": 0,
    "msg": "选择成功！",
    "result": {
        "items": [{
                "id": "001",
                "name": "张三丰",
                "extra":"附加字段"
            },
            {
                "id": "002",
                "name": "张翠山",
                "extra":"附加字段"
            }
        ]
    }
}
```

**参数说明** **deptsURL** 地址：depts 方式：post 响应类型：json

**deptsURL说明** 传入组织id获取此组织下的组织

**deptsURL请求参数说明**

字段     | 说明
------ | ----
deptId | 组织id

**deptsURL正确返回时的json格式**

```
{
    "code": 0,
    "result": {
        "deptName": "部门名字",
        "deptId": "001",
       "items": [
            {
                "id": "00200200220",
                "name": "中铝河南国际贸易有限公司",
                "isLeaf": false
            },
            {
                "id": "00200200220",
                "name": "中铝河南国际贸易有限公司",
                "isLeaf": true
            }
        ]
    },
    "msg": "读取成功"
}
```

**deptsURL响应参数说明**

字段              | 说明
--------------- | ---------------------------------
items[i].id     | 组织id
items[i].name   | 组织名称
items[i].isLeaf | 此组织是否为叶子节点，如果是，则当前组织没有子组织，否则则有子组织

**usersURL** 地址：users 方式：post 响应类型：json

**usersURL说明** 通过组织id获取某组织下的用户列表

**usersURL请求参数说明**

字段     | 说明
------ | ----
deptId | 组织id

**usersURL正确返回时的json**

```
{
    "code": 0,
    "result": {
        "deptName": "部门名字",
        "deptId": "001",
        "items": [
            {
                "id": "001",
                "name": "张三丰",
                "extra":"附加字段"
            },
            {
                "id": "001",
                "name": "张翠山",
                "extra":"附加字段"
            },
            {
                "id": "003",
                "name": "张无忌",
                "extra":"附加字段"
            }
        ]
    },
    "msg": "读取成功"
}
```

**usersURL响应参数说明**

字段            | 说明
------------- | ----
items[i].id   | 用户id
items[i].name | 用户名称
items[i].extra | 附加字段


**searchURL** 地址：search_users 方式：post 响应类型：json

**searchURL说明** 通过组织id获取某组织下的用户列表

**searchURL请求参数说明**

字段       | 说明
-------- | -----------------
text     | 搜索文本
pageSize | 分页页面大小
pageNum  | 当前页面 pageNum >= 1

**searchURL正确返回时的json**

```
{
    "code": 0,
    "result": {
        "totalNum": 33,
        "items": [
            {
                "id": "001",
                "name": "张三丰",
                "deptName": "总公司",
                "extra":"附加字段"
            },
            {
                "id": "002",
                "name": "张翠山",
                "deptName": "分公司",
                "extra":"附加字段"
            },
            {
                "id": "003",
                "name": "张无忌",
                "deptName": "部门",
                "extra":"附加字段"
            }
        ]
    },
    "msg": "读取成功"
}
```

**searchURL响应参数说明**

字段            | 说明
------------- | ----
items[i].id   | 用户id
items[i].name | 用户名称
items[i].extra | 附加字段

### 选择部门

from jssdk:v0.0.2 android:210200;ios:110200

调用示例：

```
apppubs.deptpicker({
  data: {
    "selectMode":1,
    "deptsURL": "http://result.eolinker.com/gN1zjDlc87a75d671a2d954f809ebcdd19e7698dc2478fa?uri=depts"
    "searchURL": "http://result.eolinker.com/gN1zjDlc87a75d671a2d954f809ebcdd19e7698dc2478fa?uri=search_users",
    "rootDeptId": "001",
    "preIds":"001001,001002"
  },
  success:function (obj){
    alert(obj.userIds[0])
  }
});
```

**请求参数说明**

字段         | 说明
---------- | -----------------------------
selectMode | 0:单选，1：多选
deptsURL   | 部门接口 post方式，接受String deptId参数
searchURL  | 搜索用户接口 post方式，接受String text参数
rootDeptId | 组织根目录id
preIds     | 预先选择的部门id，用","分隔

**成功选择返回对象格式:**

```
{
    "code": 0,
    "msg": "选择成功！",
    "result": {
        "items": [{
                "id": "001",
                "name": "总公司"
            },
            {
                "id": "002",
                "name": "分公司"
            }
        ]
    }
}
```

**参数说明** **deptsURL** 地址：depts 方式：post 响应类型：json

**deptsURL说明** 传入组织id获取此组织下的组织

**deptsURL请求参数说明**

字段     | 说明
------ | ----
deptId | 组织id

**deptsURL正确返回时的json格式**

```
{
    "code": 0,
    "result": {
        "deptName": "部门名字",
        "deptId": "001",
       "items": [
            {
                "id": "00200200220",
                "name": "中铝河南国际贸易有限公司",
                "isLeaf": false
            },
            {
                "id": "00200200220",
                "name": "中铝河南国际贸易有限公司",
                "isLeaf": true
            }
        ]
    },
    "msg": "读取成功"
}
```

**deptsURL响应参数说明**

字段              | 说明
--------------- | ---------------------------------
items[i].id     | 组织id
items[i].name   | 组织名称
items[i].isLeaf | 此组织是否为叶子节点，如果是，则当前组织没有子组织，否则则有子组织

**usersURL说明** 通过组织id获取某组织下的用户列表

**searchURL** 地址：search_users 方式：post 响应类型：json

**searchURL说明** 通过组织id获取某组织下的用户列表

**searchURL请求参数说明**

字段       | 说明
-------- | -----------------
text     | 搜索文本
pageSize | 分页页面大小
pageNum  | 当前页面 pageNum >= 1

**searchURL正确返回时的json**

```
{
    "code": 0,
    "result": {
        "totalNum": 33,
        "items": [
            {
                "id": "001",
                "name": "总公司"
            },
            {
                "id": "002",
                "name": "分公司"
            },
            {
                "id": "003",
                "name": "部门"
            }
        ]
    },
    "msg": "读取成功"
}
```

**searchURL响应参数说明**

字段            | 说明
------------- | ----
items[i].id   | 部门id
items[i].name | 部门名称

## 时间选择

from jssdk:v1.0.0 android:210300;ios:110300

调用示例：

```
      apppubs.timepicker({
              "data":{"type":0},
              "success":function(res){
                console.log(res.result.time);
              }
      });
```

**调用示例说明**

字段   | 说明
---- | -------------
type | 0:默认日期选择（年月日）

success回调对象格式:

{ "code": 0, "result": { "time":"2018-05-12" }, "msg": "读取成功" }

字段说明

略

## 显示图片

from jssdk:v1.0.0 android:210202;ios:110204

调用示例：

```
      apppubs.displayImg({
        data: {
          imgs: [
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519745589880&di=8ebe5a79927136d551f2ec789bcc3d2c&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Fe1fe9925bc315c608f63886c87b1cb13485477bb.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519745590003&di=4846bf776eb4df267666a93680e1fc6e&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F160725%2F16-160H5164337.jpg",
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519745638860&di=f2a6fbb99a76aa345fb522bd9fb77844&imgtype=0&src=http%3A%2F%2Fp3.gexing.com%2FG1%2FM00%2FD6%2F96%2FrBACJlZsDyjxNgVNAAHrfE50YJY389_600x.jpg"
          ]
        }
      });
```

**调用示例说明**

略

success回调对象格式:

无

字段说明

略

## 版本检查

from jssdk:v1.0.0 android:210300;ios:110300

调用示例：

```
      apppubs.checkVersion();
```

**调用示例说明**

略

success回调对象格式:

无

字段说明

略

## 打开OCR识别

from jssdk:v1.0.1 android:20300001;ios:20300001

调用示例：

```
    apppubs.startOCR({
      data: {
        "inputType": "camera"
      },
      success:function (obj){
        console.log(obj)
      }
    });
```

**调用示例说明**

字段        | 说明
--------- | ---------------
inputType | camera ,gallery

success回调对象格式:

```
{
  "code": 0,
  "msg": '识别成功',
  "result": {
    {
      "发票类型": "电子普通发票",
      "销方名称": "江苏圆周电子商务有限公司北京分公司",
      "价税合计": "199.40",
      "销方识别号": "91110302585816506R",
      "开票税额": "0.00",
      "开票金额": "199.40",
      "校验码": "662583",
      "发票号码": "85716124",
      "购方名称": "北京合正云计算科技有限公司",
      "开票日期": "",
      "购方识别号": "911101085731779466",
      "发票代码": "011001800211"
    }
  }
}
```

字段说明

略

## 打开“影像”系统

from jssdk:v1.0.1 android:20300001;ios:20300001

调用示例：

```
    apppubs.startTIMS({
      data: {
        "serverURL": "http://192.168.36.97:8199",
        "info": {
          "userNo": "tchzt",
          "bussinessNo": "TCHZT4444",
          "billNum": "001",
          "authority": "0"
        }
      });
```

**调用示例说明**

见TIMS说明文档
