## 环境要求

- 硬件要求：2G 以上内存（Swap 1G 以上）
- 系统要求：64 位 Linux（推荐 Ubuntu 22.04 LTS）
- 软件要求：
  - Python 3.8+
  - PostgreSQL
  - Redis
  - Google Chrome

  > 参考安装命令
  ```shell
  sudo apt-get update && \
  sudo apt-get -y install postgresql redis && \
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  sudo dpkg -i google-chrome-stable_current_amd64.deb && \
  sudo apt-get install -f
  ```



## 代码说明

### 代码模块

- 读书助手模块
  - eBooksAssistantServer.py : 读书助手服务端
  - eBooksAssistant.user.js : 读书助手客户端（油猴脚本）
- 开放接口模块
  - eBooksOpenAPIServer.py : 开放接口服务端
- 公共模块
  - common.py : 公共库
  - utilities.py : 工具函数
  - crawler.py : 爬虫函数

### 数据库设计

- metadata : 图书元数据
- market : 微信读书等第三方图书信息
- openapi_user : 开放接口用户列表
- openapi_token : 开放接口 Token 列表



## 安装部署

1. 克隆代码

   ```bash
   git clone https://github.com/caspartse/eBooksAssistant.git && \
   mv eBooksAssistant ebook
   ```

2. 配置数据库

   修改 `config/db_config.yaml` 文件，配置数据库连接信息。

3. 安装服务

   ```bash
   cd ebook && \
   sudo -v && \
   sudo python3 -m pip install -r ./requirements.txt && \
   python3 ./setup.py
   ```

   - 读书助手服务端：服务名称为 `ebooks_assistant.service`，端口为 `8081` ；
   - 开放接口服务端：服务名称为 `ebooks_openapi.service`，端口为 `8088` 。

4. 安装客户端

   安装油猴插件，然后导入 `eBooksAssistant.user.js` 脚本。


   移除以下行，以避免油猴脚本更新时覆盖自己的配置：

   ```javascript
   // @downloadURL https://update.greasyfork.org/scripts/412479/...
   // @updateURL https://update.greasyfork.org/scripts/412479/...
   ```

   并将脚本中的服务器地址需要修改为自己的服务器地址：

   ```javascript
   // @connect      http://xxx
   ...
   const REST_URL = "http://xxx:8081/v2";
   ```

5. Enjoy it!

   - 电子书助手模块： 浏览器访问下列链接，并点击浏览器右上角的油猴图标，选择 `eBooks Assistant` 脚本，即可看到效果。
     - 豆瓣读书页面： [https://book.douban.com/subject/34434342/](https://book.douban.com/subject/34434342/)
     - 微信读书页面： [https://weread.qq.com/web/bookDetail/9ef32b805abab59ef601a6c](https://weread.qq.com/web/bookDetail/9ef32b805abab59ef601a6c)

   - API 接口模块： 使用说明详见 《API 参考文档》（[API Reference](API_Reference.md)）。



## 请赞助本项目

如果你觉得本项目对你有所帮助，请考虑赞助我一杯咖啡以示支持。感谢你的慷慨！😊☕️

<a href="https://www.buymeacoffee.com/caspartse?utm_source=github" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

🥰 其他赞助方式：[爱发电](https://afdian.net/a/caspartse)



## 意见反馈

如果有任何问题，欢迎提交 [Issue](https://github.com/caspartse/eBooksAssistant/issues) 或加入 [Telegram 群组](https://t.me/+zeNNYQKkp71jNjc1) 交流讨论。