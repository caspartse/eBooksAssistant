# 豆瓣读书助手
eBooks Assistant for douban.com .

为豆瓣读书页面添加亚马逊Kindle、微信读书、多看阅读、京东读书、当当云阅读、喜马拉雅等直达链接。



## 主要功能

-  添加亚马逊 Kindle ([amazon.cn](https://www.amazon.cn/)) 在线试读链接、购买链接(可标识出 Kindle Unlimited 电子书)；
-  添加微信读书 ([weread.qq.com](https://weread.qq.com/)) 在线试读链接、购买链接；
-  添加多看阅读 ([duokan.com](http://www.duokan.com/)) 在线试读链接、购买链接；
-  添加京东读书 ([e.jd.com](https://e.jd.com/)) 在线试读链接、购买链接；
-  添加当当云阅读 ([e.dangdang.com](http://e.dangdang.com/)) 在线试读链接、购买链接；
-  添加喜马拉雅 ([ximalaya.com](https://www.ximalaya.com/)) 在线试听链接。


![](https://raw.githubusercontent.com/caspartse/eBooksAssistant/main/images/screenshots-01.jpg)

![](https://raw.githubusercontent.com/caspartse/eBooksAssistant/main/images/screenshots-02.jpg)



## 安装客户端

- 从 Greasy Fork 在线安装：[https://greasyfork.org/en/scripts/412479-ebooks-assistant](https://greasyfork.org/en/scripts/412479-ebooks-assistant)

- 下载到本地安装： [eBooksAssistant.user.js](https://github.com/caspartse/eBooksAssistant/blob/main/eBooksAssistant.user.js)



## 服务器端部署

### 工作流程图

![](https://raw.githubusercontent.com/caspartse/eBooksAssistant/main/images/diagrams-01.jpg)

![](https://raw.githubusercontent.com/caspartse/eBooksAssistant/main/images/diagrams-02.jpg)

### 安装步骤

#### 0. Clone 本项目

```bash
$ git clone https://github.com/caspartse/eBooksAssistant.git
$ cd ./eBooksAssistant && ls
```

#### 1. 安装 Redis 服务

```bash
$ sudo apt-get install redis-server
$ sudo systemctl enable redis-server.service
```

- 可选：可以使用 [redis-dump](https://github.com/delano/redis-dump) 的 `redis-load` 命令加载已存储的电子书数据。

```bash
$ sudo apt-get install ruby ruby-dev libc6-dev
$ gem install redis-dump
$ < ./data/db_full.json redis-load
```

#### 2. 安装 Docker 及 Selenium 服务

```bash
$ sudo apt-get install docker.io
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
$ docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-chrome:4.1.2-20220131
```

- docker-selenium 自定义配置请参考：[https://github.com/SeleniumHQ/docker-selenium](https://github.com/SeleniumHQ/docker-selenium)
- 容器配置

```bash
$ docker ps -a # 查看容器 ID
$ docker update --restart unless-stopped xxxxxx # 更新设置
```


![](https://raw.githubusercontent.com/caspartse/eBooksAssistant/main/images/screenshots-03.png)

#### 3. 安装 Python 依赖库

```bash
$ sudo apt-get install python3-dev
$ pip3 install -r ./requirements.txt
```

#### 4. 主服务配置

- 更改工作路径；
将 `./config/ebooks_assistant.service`、`./config/amazon.service` 两个文件中的工作路径改为**项目所在的路径**。
```bash
WorkingDirectory=/path/to/project
```
- 之后启用服务。

```bash
$ sudo cp ./config/*service /usr/lib/systemd/system/
$ sudo systemctl enable ebooks_assistant.service
$ sudo service ebooks_assistant restart
$ sudo systemctl enable amazon.service
$ sudo service amazon restart
```

#### 5. 修改服务地址

- 服务器端配置成功后，修改客户端（eBooksAssistant.user.js）中的服务器地址即可（**有两处**）。


```javascript
// @connect      xxx.xxx.xxx.xxx
```


```javascript
// 如果自己部署服务，这里修改成你的服务器地址
var domain = "http://xxx.xxx.xxx.xxx:8081";
```

## License

The MIT License (MIT). See [LICENSE](LICENSE) file for more details.