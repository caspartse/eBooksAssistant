// ==UserScript==
// @name         eBooks Assistant
// @name:zh-CN   豆瓣读书助手
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      0.16.0
// @description  eBooks Assistant for douban.com
// @description:zh-CN 为豆瓣读书页面添加亚马逊Kindle、微信读书、多看阅读、喜马拉雅等直达链接
// @author       Caspar Tse
// @license      MIT License
// @supportURL   https://github.com/caspartse/eBooksAssistant
// @match        https://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      amazon.cn
// @connect      duokan.com
// @connect      8.210.230.166
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var version = "0.16.0";
    // 如果自己部署服务，这里修改成你的服务器地址
    var domain = "http://8.210.230.166:8081";
    // for debug
    // var domain = "http://127.0.0.1:8082";

    function adjustMargin() {
        if ($('[data-ebassistant="read"]').height() > 36) {
            $('[data-ebassistant="read"]').attr("style", "margin-right:0;");
        }
    }

    // 客户端本地抓取，如有结果，结果共享给服务器
    function queryAmazon_Local(isbn, title, token="") {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.amazon.cn/s?__mk_zh_CN=亚马逊网站&i=digital-text&k=${isbn}&ref=nb_sb_noss&url=search-alias%3Ddigital-text`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var doc = responseDetail.responseText;
                var errorFlag = /("totalResultCount"\:0)/gi.exec(doc);
                if (!errorFlag) {
                    var regexbookUrl = /href="(\S+keywords=\d+[^"]+)"[^>]*>Kindle电子书<\/a>/gi;
                    var bookUrl = "https://www.amazon.cn" + regexbookUrl.exec(doc)[1];
                    bookUrl = bookUrl.replace(isbn, title);
                    var partnerTemplate = "";
                    if ($('.online-type[data-ebassistant="read"]').length) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var regexbookPrice = /<span class="a-offscreen">[￥¥]([0-9\.]+)<\/span>/gi;
                    var bookPrice = regexbookPrice.exec(doc)[1];
                    var amazonKu = false;
                    var buyItemTemplate = ""
                    if (bookPrice == 0.00 ) {
                        regexbookPrice = /(免费借阅)|(免费阅读此书)|(涵盖在您的会员资格中)|(或者[￥¥][0-9\.]+购买)/gi;
                        bookPrice = regexbookPrice.exec(doc)[1];
                        amazonKu = true;
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span >
                        <img alt="Kindle Unlimited" src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_ku.png" width="75" height="10" border="0">
                        </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="${bookUrl}">
                        <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn">
                        <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>`;
                    } else {
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);"
                         width="16" height="16" border="0">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                        <a target="_blank" href="${bookUrl}"> <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell">
                        <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    }
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                    var amazonShortUrl = /(https:\/\/www\.amazon\.cn\/dp\/[0-9a-zA-Z]+\/)/gi.exec(bookUrl)[1];
                    title = encodeURIComponent(title);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${domain}/amazon/update?isbn=${isbn}`,
                        data: `isbn=${isbn}&title=${title}&price=${bookPrice}&url=${amazonShortUrl}&ku=${amazonKu}&token=${token}&version=${version}`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    // 为提升查询速度，服务器预先缓存了一批数据。
    // 但目前遇到一个问题是，难以保证数据最新的，因为请求量较大，屡屡触发亚马逊的反爬虫机制。
    // 因此，需要借助各位的力量，去中心化地对数据进行校验和更新。下面这个函数，只会更新当前页面书籍的信息(价格、是否KU)

    function feedBackAmazon(isbn, url, token="") {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var doc = responseDetail.responseText;
                var regexbookPrice = /<span id="kindle-price"[^>]+>\s*[￥|¥]([0-9\.]+)\s*<\/span>/gi;
                var bookPrice = regexbookPrice.exec(doc)[1];
                var regexAmazonKu = /(免费借阅)|(免费阅读此书)|(涵盖在您的会员资格中)|(或者[￥¥][0-9\.]+购买)/gi;
                var amazonKu = regexAmazonKu.test(doc);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${domain}/amazon/feedback?isbn=${isbn}`,
                    data: `isbn=${isbn}&price=${bookPrice}&ku=${amazonKu}&token=${token}&version=${version}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            }
        });
        return;
    }

    // 使用服务器上的资源
    function queryAmazon_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/amazon?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                var token = result.token;
                if (result.errmsg == "") {
                    var bookUrl = result.data.url;
                    var bookPrice = result.data.price;
                    var ku = result.data.ku;
                    var partnerTemplate = "";
                    if ($('.online-type[data-ebassistant="read"]').length) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}">
                    <span><img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_kindle.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);"
                     width="16" height="16" border="0">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    if (ku === true) {
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span >
                        <img alt="Kindle Unlimited" src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_ku.png" width="75" height="10" border="0">
                        </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="${bookUrl}">
                        <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn">
                        <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>`;
                    }
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                    var ext = result.ext;
                    if (ext == "r") {
                        feedBackAmazon(isbn, bookUrl, token);
                    }
                } else {
                    console.log("call queryAmazon_Local.");
                    queryAmazon_Local(isbn, title, token);
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    // 使用服务器上的资源
    function queryWeread_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/weread?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == "") {
                    var bookUrl = result.data.url;
                    var bookPrice = result.data.price;
                    var partnerTemplate = "";
                    if ($('.online-type[data-ebassistant="read"]').length) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_weread.png" width="16" height="16"> <span>微信读书</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_weread.png" width="16" height="16"> <span>微信读书</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_weread.png" width="16" height="16"> <span>微信读书</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_weread.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);"
                     width="16" height="16" border="0">&nbsp;微信读书</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    // 使用服务器上的资源
    function queryDuokan_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/duokan?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == "") {
                    var bookUrl = result.data.url;
                    var bookPrice = result.data.price;
                    var partnerTemplate = "";
                    if ($('.online-type[data-ebassistant="read"]').length) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_duokan.png" width="16" height="16"> <span>多看阅读</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_duokan.png" width="16" height="16"> <span>多看阅读</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_duokan.png" width="16" height="16"> <span>多看阅读</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_duokan.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);"
                     width="16" height="16" border="0">&nbsp;多看阅读</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    // 使用服务器上的资源
    function queryXimalaya_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/ximalaya?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == "") {
                    var alubmUrl = result.data.url;
                    var partnerTemplate = "";
                    if ($(".online-partner .online-type").length == 2) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${alubmUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_ximalaya.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div>`;
                        $('.online-type[data-ebassistant="audio"]').append(partnerTemplate);
                    } else if ($(".online-partner .online-type").length == 1) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="audio"> <span>在线试听：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${alubmUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_ximalaya.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="read"]').after(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="audio"> <span>在线试听：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${alubmUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_ximalaya.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    // 使用服务器上的资源
    function queryJingdong_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/jd?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == "") {
                    var bookUrl = result.data.url;
                    var bookPrice = result.data.price;
                    var partnerTemplate = "";
                    if ($('.online-type[data-ebassistant="read"]').length) {
                        partnerTemplate = `<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_jd.png" width="16" height="16"> <span>京东读书</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_jd.png" width="16" height="16"> <span>京东读书</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_jd.png" width="16" height="16"> <span>京东读书</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img src="https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/icon_jd.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);"
                     width="16" height="16" border="0">&nbsp;京东读书</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price "> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        adjustMargin();
        return;
    }

    try {
        $(".online-partner .online-type:nth-child(1)").attr("data-ebassistant", "read");
        $(".online-partner .online-type:nth-child(2)").attr("data-ebassistant", "audio");
    } catch(e) {
        console.log(e);
    }
    var newStyle = `<style type="text/css" media="screen">.online-partner{flex-wrap:wrap;padding-top:5px;padding-bottom:5px}.online-type{flex-wrap:wrap}
    .online-read-or-audio{margin-top:5px;margin-bottom:5px}.online-partner .online-type:nth-child(1){margin-right:20px}
    .online-partner .online-type:last-child{margin-right:0}.online-partner .online-type:nth-child(2){padding-left:0}[data-ebassistant=read] div:last-child a{margin-right:0}</style>`;
    $("#content").append(newStyle);

    var regexLinkedData = /<script type="application\/ld\+json">([\s\S]+?)<\/script>/gi;
    var linkedData = regexLinkedData.exec(document.documentElement.innerHTML)[1].trim();
    linkedData = JSON.parse(linkedData);
    console.log(linkedData);
    var isbn = linkedData.isbn;
    console.log(isbn);
    var title = linkedData.name;
    console.log(title);
    var subtitle = "";
    try {
        var regexSubtitle = /<span class="pl">\s*副标题:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi;
        subtitle = regexSubtitle.exec(document.documentElement.innerHTML.replace(/&nbsp;/gi, " "))[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(subtitle);
    var authorStr = "";
    for (var i=0, j=linkedData.author.length; i<j; i++) {
        authorStr += linkedData.author[i].name + " " ;
    }
    var author = authorStr;
    console.log(author);
    var translator = "";
    try {
        var regexTranslator = /<span class="pl">\s*译者:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi;
        translator = regexTranslator.exec(document.documentElement.innerHTML.replace(/&nbsp;/gi, " "))[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(translator);
    var publisher = "";
    try {
        var regexPublisher = /<span class="pl">\s*出版社:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi;
        publisher = regexPublisher.exec(document.documentElement.innerHTML.replace(/&nbsp;/gi, " "))[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(publisher);

    queryWeread_Remote(isbn, title, subtitle, author, translator, publisher);
    queryAmazon_Remote(isbn, title, subtitle, author, translator, publisher);
    queryDuokan_Remote(isbn, title, subtitle, author, translator, publisher);
    queryXimalaya_Remote(isbn, title, subtitle, author, translator, publisher);
    queryJingdong_Remote(isbn, title, subtitle, author, translator, publisher);

    return;
})();