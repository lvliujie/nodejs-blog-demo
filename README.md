# Node.js

>全篇内容参考[Node.js开发指南](http://www.9958.pw/uploads/nodejs_guide.pdf)，部分因为版本问题有做说明改动

## 安装Node.js

[Node.js下载](https://nodejs.org/en/download/)
下载对应操作系统的installer文件,双击安装
node -v
npm -v

## Node.js使用

单文件运行

```
node xxx.js
```
web项目一般在项目根目录下使用`npm start`启动
**小技巧：** supervisor可以不需要手动重启http容器，它可以自动将每次修改内容实时部署

```
npm install -g supervisor
supervisor xxx.js
```

**注：** npm 安装软件时-g代表全局安装，适用于要使用命令行的那些包安装，不带则直接在当前目录下下载到对应的node_modules目录下

## 搭建一个小型web项目

### 安装express

老的资料中可能是`npm install -g express`，新express4.x版本后部分功能与express分离，一些安装命令不同
```
npm install -g express-generator
express --version
```

### 初始化项目

#### 初始化项目结构

3.x老版本产生的模版为ejs，新版本产生jade

```
express -t ejs microblog
```

4.x新版本初始化

```
express -e microblog //生成ejs
express -j microblog //生成jade
```

下载依赖包

```
cd xxx/xxx/your-project-root-dir
npm install
```

**注：** 在项目目录下运行npm install，npm命令会自动根据项目中的package.json文件配置自动下载安装对应模块功能

启动web项目

```
npm start
```

访问[http://localhost:3000/](http://localhost:3000/)查看效果
到此为止完成一个最简单的node.js项目

### 模版

[jade快速上手](https://segmentfault.com/a/1190000000357534#articleHeader11)

### 引入bootstrap样式和jquery

[bootstrap下载页面](http://twitter.github.com/bootstrap/)
[jquery下载页面](http://jquery.com/)
bootstrap下载下来后的文件

```
css/bootstrap-responsive.css
css/bootstrap-responsive.min.css
css/bootstrap.css
css/bootstrap.min.css
img/glyphicons-halflings-white.png
img/glyphicons-halflings.png
js/bootstrap.js
js/bootstrap.min.js
```

将三种文件放别放到项目`public`下的三个文件夹内

**需要注意的点：**
* jquery下载最新版后名称带有版本号，需要改名为jquery.js
* 新版4.x express的public目录下存放图片的文件夹名为images，而bootstrap样式中引用的是img，需要修改bootstrap中两处css样式引用图片的文件路径

### 修改模版文件

修改首页及layout.jade文件 
见[Node.js开发指南](http://www.9958.pw/uploads/nodejs_guide.pdf)5.5.4章节

### 用户注册／登录／登出

#### 安装mongodb

系统安装

```
brew install mongodb
mongo --version
```

启动数据库

```
mongod --config /usr/local/etc/mongod.conf
```

#### 项目引入使用

项目增加依赖包
在`package.json`的`dependencies`中增加一行

```
"mongodb": "~2.2.0"
在项目根目录执行
npm install
```

项目根目录增加数据库配置文件`settings.js`，内容如下：

```
module.exports = {
  db: 'microblog',
  host: '127.0.0.1',
  port: '27017',
  url: 'mongodb://localhost:27017/demo',
  cookieSecret: 'microblogbyvoid',
};
```

增加会话依赖包：

```
"connect-mongo": "~1.3.0"
npm install
```

使用，看看`connect-mongo`的README，不同版本用法很不一样，很多网上的老材料都不靠谱
4.x express需要单独下载express-session

```
npm install express-session
```

Express `4.x`, `5.0` and Connect `3.x`:

```js
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'foo',
    store: new MongoStore(options)
}));
```

Express `2.x`, `3.x` and Connect `1.x`, `2.x`:

```js
const MongoStore = require('connect-mongo')(express);

app.use(express.session({
    secret: 'foo',
    store: new MongoStore(options)
}));
```

这边使用前面第一种方式
引入依赖

```
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
```

使用会话

```
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore(settings)
}));
```

#### 创建注册页面

见[Node.js开发指南](http://www.9958.pw/uploads/nodejs_guide.pdf)5.6.3章节

#### 出现问题解决

Cannot read property 'DEFAULT_PORT' of undefined
修改db.js文件内容

```
var settings = require('../settings.js');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
module.exports = new Db(settings.db,new Server(settings.host, settings.port, {}),{safe:true});
```

app.dynamicHelpers is not a function

1. 新版本已经摒弃dynamicHelpers，改用locals
2. flash新版本需要单独下载

```
npm install connect-flash
var flash = require('connect-flash');
```

3. app.use使用需要注意顺序，一般为

```
自带中间件——session——flash——路由控制器
```

项目中使用代码

```
app.use(flash());
app.use(function(req,res,next){
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
   
  next();
});
```