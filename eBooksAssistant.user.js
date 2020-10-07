// ==UserScript==
// @name         eBooks Assistant
// @name:zh-CN   豆瓣读书助手
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      0.5.0
// @description  eBooks Assistant for douban.com
// @description:zh-cn 为豆瓣读书页面添加亚马逊Kindle、图灵社区、喜马拉雅等链接
// @author       Caspar Tse
// @license      MIT License
// @supportURL   https://github.com/caspartse/eBooksAssistant
// @match        https://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @connect      amazon.cn
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    function queryAmazon(title, isbn) {
            GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.amazon.cn/s?__mk_zh_CN=亚马逊网站&i=digital-text&k=" + isbn + "&ref=nb_sb_noss&url=search-alias%3Ddigital-text",
            headers: {
                'User-agent': window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var doc = responseDetail.responseText;
                var errorFlag = /("totalResultCount"\:0)|(在Kindle商店中未找到)/.exec(doc);
                if (!errorFlag) {
                    var regexAmazonUrl = /href="(\S+keywords=\d+[^"]+)"/gi;
                    var amazonUrl = "https://www.amazon.cn" + regexAmazonUrl.exec(doc)[1];
                    amazonUrl = amazonUrl.replace(isbn, title);
                    var partnerTemplate = '';
                    if ($(".online-partner").length) {
                        partnerTemplate = '<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}"> <img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" width="16" height="16"> <span>Kindle</span> </a> </div>';
                        $('.online-type[data-ebssistant="read"]').append(partnerTemplate.replace("{templateUrl}", amazonUrl));
                    } else {
                        partnerTemplate = '<div class="online-partner"> <div class="online-type" data-ebssistant="read"> <span>在线试读：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>';
                        $("#link-report").after(partnerTemplate.replace("{templateUrl}", amazonUrl));
                    }
                    var regexAmazonPrice = /<span class="a-offscreen">￥([0-9\.]+)<\/span>/gi;
                    var amazonPrice = regexAmazonPrice.exec(doc)[1];
                    console.log(amazonPrice);
                    var buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span style="color:#418FDE;"><img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);" width="16" height="16" border="0">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>';
                    if (amazonPrice == 0.00 ) {
                        buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span > <img alt="Kindle Unlimited" src="https://s1.ax1x.com/2020/10/05/0tmjLn.png" width="75" height="10" border="0"> </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>';
                        regexAmazonPrice = /<span dir="auto">或者￥([0-9\.]+)购买<\/span>/gi;
                        amazonPrice = regexAmazonPrice.exec(doc)[1];
                    }
                    buyItemTemplate = buyItemTemplate.replaceAll("{templateUrl}", amazonUrl);
                    buyItemTemplate = buyItemTemplate.replace("{templatePrice}", amazonPrice);
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        return;
    }

    function queryTuring(isbn) {
            GM_xmlhttpRequest({
            method: "GET",
            url: "http://127.0.0.1:8081/turing?isbn=" + isbn,
            headers: {
                'User-agent': window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == '') {
                    var turingUrl = result.data.url;
                    var turingPrice = result.data.price;
                    var partnerTemplate = '';
                    if ($(".online-partner").length) {
                        partnerTemplate = '<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}"> <img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" width="16" height="16"> <span>图灵社区</span> </a> </div>';
                        $('.online-type[data-ebssistant="read"]').append(partnerTemplate.replace("{templateUrl}", turingUrl));
                    } else {
                        partnerTemplate = '<div class="online-partner"> <div class="online-type" data-ebssistant="read"> <span>在线试读：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" width="16" height="16"> <span>图灵社区</span> </a> </div></div> </div>';
                        $("#link-report").after(partnerTemplate.replace("{templateUrl}", turingUrl));
                    }
                    var buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span style="color:#418FDE;"><img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);" width="16" height="16" border="0">&nbsp;图灵社区</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>';
                    buyItemTemplate = buyItemTemplate.replaceAll("{templateUrl}", turingUrl);
                    buyItemTemplate = buyItemTemplate.replace("{templatePrice}", turingPrice);
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        return;
    }

    function queryXimalaya(title) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://127.0.0.1:8081/ximalaya?title=" + title,
            headers: {
                'User-agent': window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var result = JSON.parse(responseDetail.responseText);
                console.log(result);
                if (result.errmsg == '') {
                    var ximalayaUrl = result.data.url;
                    var partnerTemplate = '';
                    if ($(".online-partner .online-type").length == 2) {
                        partnerTemplate = '<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}"> <img src="https://s1.ax1x.com/2020/10/07/0UbEuj.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div>';
                        $('.online-type[data-ebssistant="audio"]').append(partnerTemplate.replace("{templateUrl}", ximalayaUrl));
                    } else if ($(".online-partner .online-type").length == 1) {
                        partnerTemplate = '<div class="online-type" data-ebssistant="audio"> <span>在线试听：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/07/0UbEuj.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div>';
                        $('.online-type[data-ebssistant="read"]').after(partnerTemplate.replace("{templateUrl}", ximalayaUrl));
                    } else {
                        partnerTemplate = '<div class="online-partner"> <div class="online-type" data-ebssistant="audio"> <span>在线试听：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/07/0UbEuj.png" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div> </div>';
                        $("#link-report").after(partnerTemplate.replace("{templateUrl}", ximalayaUrl));
                    }
                }
                return;
            }
        });
        return;
    }

    var regexIsbn = /<span class="pl">ISBN:<\/span>\s*(\d+)\s*/g;
    var isbn = regexIsbn.exec($("#info").html())[1];
    console.log(isbn);
    var title = $("#wrapper h1 span").text().trim();
    console.log(title);
    try {
        $(".online-partner .online-type:nth-child(1)").attr("data-ebssistant", "read");
        $(".online-partner .online-type:nth-child(2)").attr("data-ebssistant", "audio");
    } catch(e) {
        console.log(e);
    }
    queryAmazon(title, isbn);
    queryTuring(isbn);
    queryXimalaya(title);
    return;
})();
