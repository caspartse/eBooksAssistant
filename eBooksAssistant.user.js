// ==UserScript==
// @name         eBooks Assistant
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      0.2
// @description  eBooks Assistant for douban.com
// @author       Caspar Tse
// @match        https://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @connect      douban.com
// @connect      amazon.cn
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    function queryBook(title, ibsn) {
            GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.amazon.cn/s?__mk_zh_CN=亚马逊网站&i=digital-text&k=" + ibsn + "&ref=nb_sb_noss&url=search-alias%3Ddigital-text",
            headers: {
                'User-agent': window.navigator.userAgent,
                'Content-type': 'text/html;charset=UTF-8'
            },
            onload: function(responseDetail) {
                var doc = responseDetail.responseText;
                var errorFlag = /("totalResultCount"\:0)|(在Kindle商店中未找到)/.exec(doc);
                if (!errorFlag) {
                    var regexAmazonUrl = /href="(\S+keywords=\d+[^"]+)"/gi;
                    var amazonUrl = "https://www.amazon.cn" + regexAmazonUrl.exec(doc)[1];
                    amazonUrl = amazonUrl.replace(ibsn, title);
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
                    var buyItemTemplate = '<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="{templateUrl}"> <span>Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="{templateUrl}"> <span class="buylink-price "> {templatePrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="{templateUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>'
                    buyItemTemplate = buyItemTemplate.replaceAll("{templateUrl}", amazonUrl);
                    buyItemTemplate = buyItemTemplate.replace("{templatePrice}", amazonPrice);
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                return;
            }
        });
        return;
    }
    var regexIsbn = /<span class="pl">ISBN:<\/span>\s*(\d+)\s*/g;
    var ibsn = regexIsbn.exec($("#info").html())[1];
    console.log(ibsn);
    var title = $("#wrapper h1:nth-child(2) span:nth-child(1)").text().trim();
    console.log(title);
    queryBook(title, ibsn);
    return;
})();
