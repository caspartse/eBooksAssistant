// ==UserScript==
// @name         eBooks Assistant
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      0.2.3.1
// @description  eBooks Assistant for douban.com
// @author       Caspar Tse
// @match        https://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @connect      douban.com
// @connect      amazon.cn
// @connect      106.52.138.60
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
                        partnerTemplate = '<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}"> <img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" width="16" height="16"> <span>Kindle</span> </a> </div>'
                        $(".online-partner .online-type:nth-child(1)").append(partnerTemplate.replace("{templateUrl}", amazonUrl));
                    } else {
                        partnerTemplate = '<div class="online-partner"> <div class="online-type"> <span>在线试读：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>';
                        $("#link-report").after(partnerTemplate.replace("{templateUrl}", amazonUrl));
                    }
                    var regexAmazonPrice = /<span class="a-offscreen">￥([0-9\.]+)<\/span>/gi;
                    var amazonPrice = regexAmazonPrice.exec(doc)[1];
                    console.log(amazonPrice);
                    var buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span style="color:#418FDE;"><img src="https://s1.ax1x.com/2020/10/05/0JbHKI.jpg" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);" width="16" height="16" border="0">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>'
                    if (amazonPrice == 0.00 ) {
                        buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span > <img alt="Kindle Unlimited" src="https://s1.ax1x.com/2020/10/05/0tmjLn.png" width="75" height="10" border="0"> </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>'
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
            url: "http://106.52.138.60:8081/turingebooks?isbn=" + isbn,
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
                        partnerTemplate = '<div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}"> <img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" width="16" height="16"> <span>图灵社区</span> </a> </div>'
                        $(".online-partner .online-type:nth-child(1)").append(partnerTemplate.replace("{templateUrl}", turingUrl));
                    } else {
                        partnerTemplate = '<div class="online-partner"> <div class="online-type"> <span>在线试读：</span> <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="{templateUrl}" one-link-mark="yes"> <img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" width="16" height="16"> <span>图灵社区</span> </a> </div></div> </div>';
                        $("#link-report").after(partnerTemplate.replace("{templateUrl}", turingUrl));
                    }
                    var buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span style="color:#418FDE;"><img src="https://s1.ax1x.com/2020/10/06/0UsLZj.png" style="border-radius: 50%; box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);" width="16" height="16" border="0">&nbsp;图灵社区</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>'
                    buyItemTemplate = buyItemTemplate.replaceAll("{templateUrl}", turingUrl);
                    buyItemTemplate = buyItemTemplate.replace("{templatePrice}", turingPrice);
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        return;
    }

    var regexIsbn = /<span class="pl">ISBN:<\/span>\s*(\d+)\s*/g;
    var isbn = regexIsbn.exec($("#info").html())[1];
    console.log(isbn);
    var title = $("#wrapper h1:nth-child(2) span:nth-child(1)").text().trim();
    console.log(title);
    queryAmazon(title, isbn);
    queryTuring(isbn);
    return;
})();
