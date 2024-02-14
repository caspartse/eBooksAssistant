## 获得 Open API Key

- 使用本站提供的服务

可前往 [https://forms.gle/91z4wrtQngrbkK1g9](https://forms.gle/91z4wrtQngrbkK1g9) 申请使用 Open API Key。
为避免资源滥用，每个 Open API Key 有每月 1000 次请求的限制。如有特殊需求，可联系作者。


- 使用本地部署的服务

部署项目后，自行生成 API Key 即可。

```shell
python3 tools/gen_api_key.py -h
```



## API 接口说明

### 1. 请求地址

- 使用本站提供的服务

```shell
https://openapi.youdianzishu.com/metadata
```

- 本地部署的服务

```shell
http://xxx:8088/metadata
```


### 2. 请求方式

**GET**

### 3. 请求参数

#### 3.1 请求头部

| 参数名 | 类型 | 是否必须 | 说明 |
| --- | --- | --- | --- |
| Authorization | string | 是 | `Bearer` + **空格** + `<your_api_key>` |

#### 3.2 URL 参数

| 参数名 | 类型 | 是否必须 | 说明 |
| --- | --- | --- | --- |
| api_key | string | 是 | `<your_api_key>` |
| isbn | string | 是 | ISBN 号码 |

**注：** `Authorization` 和 `api_key` 两者二选一即可。


### 4. 请求示例

- curl 请求示例

```shell
curl -X GET "https://openapi.youdianzishu.com/metadata?isbn=9787532172313" \
-H "Authorization: Bearer <your_api_key>"
```

- python 请求示例

```python
import requests
session = requests.Session()
session.headers.update({'Authorization': 'Bearer <your_api_key>'})
url = 'https://openapi.youdianzishu.com/metadata'
params = {'isbn': '9787532172313'}
response = session.get(url, params=params)
print(response.json())
```

### 5. 返回示例

```json
{
  "data": {
    "isbn": "9787532172313",
    "douban_rating": 8.2,
    "douban_url": "https://book.douban.com/subject/34434342/",
    "weread_url": "https://weread.qq.com/web/bookDetail/8e0321c0718a6c928e0ab0e",
    "title": "人类群星闪耀时",
    "author": "[奥]斯蒂芬·茨威格",
    "publisher": "上海文艺出版社",
    "producer": "果麦文化",
    "subtitle": "十四篇历史特写",
    "original_title": "Sternstunden der Menschheit：Vierzehn historische Miniaturen",
    "translator": "姜乙",
    "published": "2019-7",
    "pages": 288,
    "price": "49.00元",
    "binding": "软精装",
    "series": "果麦·外国文学经典",
    "douban_intro": "当改变命运的时刻降临，犹豫就会败北！《悉达多》译者姜乙三年打磨，重磅推出的全新译作“传记之王”斯蒂芬·茨威格代表作品，德文直译无删节版十四篇历史特写，十四个扭转乾坤的关键时刻，十四个英雄瞬间《...",
    "weread_intro": "《人类群星闪耀时》的内容正如它的副标题——十四篇历史特写（Vierzehn historische Miniaturen）。作者茨威格以诗人和艺术家的笔触，尊崇历史的真相，以其完全个人的独特视野创作而成。十四个故事，横跨不同时代和地域，虽然篇幅精短，但内容丰富完整，既保留了事件发生时的种种细节，也凭借茨威格深厚纯熟的笔力，展现了以旁观者视角面对这些关键时刻的复杂情绪：对悲剧英雄命运的关注、共情、怜惜，对造物主的敬畏，对人在有限生命中具备的神性，迸发的创造力的肯定以及对人间正义价值的遵照和捍卫。遥远如古罗马政治家、演说家西塞罗在面对恺撒遇刺、局势混乱时的犹豫不决；又如极富戏剧性的瞬间，格鲁希墨守成规而造成拿破仑滑铁卢的失败以致影响了之后的整个欧洲历史……十四个生死攸关、超越时代的故事，如群星般璀璨而不渝地照耀着暂时的黑夜。",
    "cover_url": "https://img1.doubanio.com/view/subject/l/public/s33300419.jpg",
    "cover_url_proxy_weserv": "https://images.weserv.nl/?url=https://img1.doubanio.com/view/subject/l/public/s33300419.jpg",
    "cover_url_proxy_baidu": "https://image.baidu.com/search/down?url=https://img1.doubanio.com/view/subject/l/public/s33300419.jpg"
  },
  "code": 200,
  "errmsg": "",
  "request_id": "9c134c707c6b4ababc417dbe181edfbe",
  "credit": 983,
  "api_version": "1.0"
}
```

### 6. 返回数据

#### 6.1 数据格式

返回的数据是一个 JSON 对象，包含以下几部分：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data | object | 图书元数据（Metadata） |
| code | int | 状态码 |
| errmsg | string | 错误信息 |
| request_id | string | 请求 ID |
| credit | int | 可用额度（当月剩余请求次数） |
| api_version | string | API 版本 |

#### 6.2 data 对象字段

| 字段 | 类型 | 说明 | 举例 |
| --- | --- | --- | --- |
| isbn | string | 13 位 ISBN | "9787532172313" |
| douban_rating | float | 豆瓣评分 | 8.2 |
| douban_url | string | 豆瓣链接 | "https://book.douban.com/subject/34434342/" |
| weread_url | string | 微信读书链接 | "https://weread.qq.com/web/bookDetail/8e0321c0718a6c928e0ab0e" |
| title | string | 书名 | "人类群星闪耀时" |
| author | string | 作者 | "[奥]斯蒂芬·茨威格" |
| publisher | string | 出版社 | "上海文艺出版社" |
| producer | string | 出品方 | "果麦文化" |
| subtitle | string | 副标题 | "十四篇历史特写" |
| original_title | string | 原作名 | "Sternstunden der Menschheit：Vierzehn historische Miniaturen" |
| translator | string | 译者 | "姜乙" |
| published | string | 出版年 | "2019-7" |
| pages | int | 页数 | 288 |
| price | string | 定价 | "49.00元" |
| binding | string | 装帧 | "软精装" |
| series | string | 丛书 | "果麦·外国文学经典" |
| douban_intro | string | 豆瓣简介 | "当改变命运的时刻降临，犹豫就会败北！《悉达多》译者姜乙三年打磨 ..." |
| weread_intro | string | 微信读书简介 | "《人类群星闪耀时》的内容正如它的副标题——十四篇历史特写 ..." |
| cover_url | string | 图书封面图片链接 | "https://img1.doubanio.com/view/subject/l/public/s33300419.jpg" |
| cover_url_proxy_weserv | string | 图书封面图片链接（使用 weserv 代理），用于解决图片防盗链问题 | "https://images.weserv.nl/?url=https://img1.doubanio.com/view/subject/l/public/s33300419.jpg" |
| cover_url_proxy_baidu | string | 图书封面图片链接（使用百度代理），用于解决图片防盗链问题 | "https://image.baidu.com/search/down?url=https://img1.doubanio.com/view/subject/l/public/s33300419.jpg" |

#### 6.3 错误代码

| code | errmsg | 说明 |
| --- | --- | --- |
| 200 | "" | 请求成功 |
| 400 | Bad Request | 请求参数错误, 具体原因请查看 errmsg |
| 401 | Unauthorized | 未授权, 具体原因请查看 errmsg |
| 403 | Forbidden | 拒绝服务, 具体原因请查看 errmsg |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |



## 请赞助本项目

如果你觉得本项目对你有所帮助，请考虑赞助我一杯咖啡以示支持。感谢你的慷慨！😊☕️

<a href="https://www.buymeacoffee.com/caspartse?utm_source=github" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

🥰 其他赞助方式：[爱发电](https://afdian.net/a/caspartse)



## 意见反馈

如果有任何问题，欢迎提交 [Issue](https://weread.qq.com/web/bookDetail/8e0321c0718a6c928e0ab0e) 或加入 [Telegram 群组](https://t.me/+zeNNYQKkp71jNjc1) 交流讨论。