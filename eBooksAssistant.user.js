// ==UserScript==
// @name         eBooks Assistant
// @name:zh-CN   豆瓣读书助手
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      0.18.0
// @description  eBooks Assistant for douban.com
// @description:zh-CN 为豆瓣读书页面添加亚马逊Kindle、微信读书、多看阅读、京东读书、当当云阅读、喜马拉雅等直达链接
// @author       Caspar Tse
// @license      MIT License
// @supportURL   https://github.com/caspartse/eBooksAssistant
// @match        https://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @connect      amazon.cn
// @connect      api.youdianzishu.com
// @connect      8.210.230.166
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    var version = "0.18.0";
    // 如果自己部署服务，这里修改成你的服务器地址
    var domain = "https://api.youdianzishu.com"
    // var domain = "http://127.0.0.1:8081";
    // for debug
    // var domain = "http://127.0.0.1:8082";

    // Base64 icons
    var b64_icon_kindle = "data:image/png;base64,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";
    var b64_icon_ku = "data:image/png;base64,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";
    var b64_icon_weread = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABMlBMVEU4tP83tP8ysf8xsf8ysP8xsP8xr/8xrv8xrf8xrf4xrP8xrP4wrP4wq/4wqv4wqf4wqP4vqP4vp/4up/4rpv4rpf4tpv5Arf53xP6X0v6Fy/5Utv4upv4vpv4tpf5Utf7Q6v/8/v/////s9/+Mzf4wpv40p/7C5P/W7f+T0P7+/v/L6P+a0//z+v9lvP4rpP4vpf4tpP5Hr/7o9f/q9v/H5//+///k8//K6P8qo/4upP46qf7T7P/9/v94xP4vpP4so/52w/7v+P/B5P88qf4to/4uo/4tov6g1f7S6//d8P+X0f5Aq/4sov5DrP42pv4+qv43p/4rof4roP0roPwrof0uov4qoP0qoPyWzvmWzfmTzPlsu/ozo/z3+/73/P7t9v2IyPv0+v72+/7k8v31+v52qLiyAAAAAWJLR0QiXWVcrAAAAAd0SU1FB+QKERMSBxvkIzYAAAFFSURBVDjLhYqHUsJAFEWfcWMQNRQFayyxYsWuawk2ELsiKKFI/f9fcN9uZtgENGfuK3PmAvxFn3OVfoaiiAhcAhSFOJ5dQviWBRCiElVVCcGt4nYLGPDBv6D5AFogoGkifDSPgAAyyCPRERAcQoJOxJUFDCNBZ8RyCRjxgRV059X5o3sE6D5ACNFDHjoCQj5AWCbC4xIQQaKRzgnzd3QsFovjD9GexMcnJqemZ9gHhpso37Nz8wumubi0bBjegmBldS2xvrG5tb1jQLIHu3v7B4dHxydm4jTZs0DPzk3k4pIVLItSi0HxUkskdXWNhZvbOwvSHMpCnQfJ3Gcfso9Pz+m0U+ji5fXt/SPDHsghnzyMfKGQ5+Ir981FDoq2bRdx4SmVK5VySRJFG6oSP9VavV5jRwIaLpqtVtNtPIVGu934v9DFL75RivuAiiVCAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTE3VDExOjI2OjE5KzA4OjAwmsnyVQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0xN1QxMToxODowNyswODowMPAqZ5gAAAAASUVORK5CYII=";
    var b64_icon_duokan = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABUFBMVEXtkC/tkC/tkC/tkC/tkC/tkC/tkC/tkC/tkC/tjy7tjiztjyztkC7vnUjzs3Hyq2LulDbvmUDysGrulzztjy3wpVb76NT//fz++fT3y57tkzXzuHn++PLyr2r3zaL////+9u7xpln0u4H//Przs3D406zxqmDysWz99u353b/ulz3ysW3869nxql/tkTHyrmf3zKD1w47vnUftkzTvnEXtkjPuljvyrmj75c775MzyrGPulTntkDDulDf638P63b/xqFv517PumT/98+nwo1L2xpX75tH1wIj//v3tkTDvnkn87Nr3zJ/vnEb86df+9/D0uHv517X98ujxplfzt3j++fP+9+/2ypvwolDulTjumD7638T+/Pj1xJDtkjL98+j64sn63sD76NX++vX3zqTzt3f86tf//v787+H0un741K764cb64sj517T1v4bwoEzN5UsNAAAACHRSTlMcnfP0nh388p6FZyYAAAABYktHRB8FDRC9AAAAB3RJTUUH5AoRExEwiHTV+gAAAUFJREFUOMu9k9dTAkEMxg9E3L2LekoUsEXFXk4RFAuIYgHsXbFg7+3/f/NmnGt7A/fimLfN/ia7+fJFknx+VjFqArWSL8iqRDAg1bGq4ZeYR/wnwGUFrDSXQQCgvqFRNQloag6BA8CW1nAk2mYAcntHp+ys0EVE3T1oAL2xPgHo14HIgFIRwMEhouER4xPK6Ni44qygTUzGp7jZRSI5LbaJKFv3ep8uHSA0Y9OBgQjw1OzcvFVCW0g7AcgsEmVV872l5Rx3VlB1YGXV0AHX1gUlGeYLRNHibxY3NrfEWfDtHaLdvTSCPqjc/sEhCgDDo2Oik9OzUuI8dXF5ZfzR5odyPEJUuL65vbuPPZTADUD58SmsT4SeX/IZq2G7ozD5+vb+8fn1DTbJHJbjclHNaAracy5PgnD+A1d7rp7n8nqt/w9oaTwtTt+bTAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0xMC0xN1QxMToyNjoyNCswODowMHWRlHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMTAtMTdUMTE6MTc6NDgrMDg6MDBzI0IGAAAAAElFTkSuQmCC";
    var b64_icon_jd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE9GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDItMTJUMTA6MTY6MTErMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAyLTEyVDEwOjIwOjMwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAyLTEyVDEwOjIwOjMwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkMTI3ZDdmNi0wZjJlLTRmZGEtOTgxZS0yYzc1MWIxN2M4MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZDEyN2Q3ZjYtMGYyZS00ZmRhLTk4MWUtMmM3NTFiMTdjODMxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZDEyN2Q3ZjYtMGYyZS00ZmRhLTk4MWUtMmM3NTFiMTdjODMxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkMTI3ZDdmNi0wZjJlLTRmZGEtOTgxZS0yYzc1MWIxN2M4MzEiIHN0RXZ0OndoZW49IjIwMjItMDItMTJUMTA6MTY6MTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkcx3wkAAALuSURBVFiFzZfNS1RhFMZ/7zv3js6oZdpMarYQUqSFolIpLRIKtCiotWTmPxAWtOgvcBMFQcvatQoyjT5Q84M+cCUJSi10YcUwVkIzzjhz5360uNrHzL02o6P2wOXCeQ/neS73vIfniHCgmjUcB/qAdsDP9iAOjAO3gSkAsSbgCnB/m0jd0As8EOFAdQPwfofJ19GoAP0ZYSFACMxwCJMUYpPVLUCiIg9UgmXZz9/oF+FAdQQoSVOA+W0JtakJ5Ug9Vkq3q+UCAUJV0Oc+kJqeRu4P4lAkqgBqetRcDuNta6NsYgQUJUfmNOg6yydPo029Q5YF009VCaTSo4ah4e3s2Do5gKLg7ezAMDSn05QjgwCsWOyftc1QiNWhpyjBCgounHfNs2Ix1z5y/0TTdAwbi4tow2MkBp+QGHzMKlBSVUNgAwFutTYWkE48v0Ck7zqJoQFSgAQKauoJXDyH73J3tmU2LyB26w6RoQH8hw5T3NNF4dlO1NbWTRPnLMBKJJFA6aOHqMeObpl4HTLbRKGqCEAonryR5yQAYfextZrYJQHbhKwFWJpmD9JUxtzaGQGYJiaAP79WIetbUHTzBt5T7agtzbsjQKmrRamrzSs5/NdNKDZrQ3Kr5SpAFBflj9/ny02AQKBP588m6rNzrmfOlswwMKMRfJe6UBsbsJIa1soKsrICX083orAgS2qL+N17RK5eQ+4pBa83PSHqLEB6QNcxvn/55eLW38HXb1FPtLlTxmNoYxMkX46gvRonNTuNLClHFBWDYWQIcL6GpgFS4Pm9tNiT8McyeDIbygyH0UbHSY6Mok1Moi98XHPECp7yg6B4nMgBew5kmFJHCIGFgfDZk9CYX0AbHSM5PIw2+QZ96TMAkkI8ZVU26boNd3dEqostd4aViKM2tyCDAZIvhjGiXwHwqCWIvXtASifvvxGiIhyofgacySZbKCpG6BMWOtK/z/6vglxJ/8TzXV/NJDCDvSjuNHqBGbHb6/lP9kL8xeX2i5QAAAAASUVORK5CYII=";
    var b64_icon_dangdang = "data:image/png;base64,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";
    var b64_icon_ximalaya = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABvFBMVEUAAAD7KAD6KAD6KQH7KAD6KAD6KAD6KAD6KAD7KQD6KAD6KAD7KQH7KAD6KAD6KAD6KAD6JwD6JgD6KwX6Pxv7QyD6PRj6KgP6KQL6PBf7QB36LAT6Lwj8lID93tn+5eD929X8hW/6KwP8gGj92tP+5OD+5+P9vbH6NhH6JQD7VDT+7+z++/v908v93tj+/v36RCH6Phr939r+/v7939n91Mz9x737a1D7YEL++Pf9w7j6PRn6Mw36Mgz7RCH90sr+8O77TSz6RiT+7Oj92dL7SCb6MAn6JwH++fj9rJ76KAH6LAf9v7P+8e/+7On6MAr9rZ76KQH6Lgf9v7T9yL76MQr6Lwr+6+f8nYv8mIb8mYb8moj8iXT6Mw7+6eX+///+/Pv8qZn+6+j929T7dl37cFX7cFb7blP8n43+/v/9sqT6LQr6JAD6IQD7bFP8m4n7blT8nIr9taj7Wz3+9fP+7uv8qpr8k3/7RSL6LQj9xbv7SSf6MQv6ORT9vrL7c1n9sKL6SCb+7er9xLn8l4T6Oxj7Z0v7ZEj6OBT7Vjb7ZUj6NxL6SCf93df8g2z7XkD7VDX6Lgj7Ti3///+bcN/WAAAAEHRSTlMAAAAAC1u87P0Vl/MVCv7ykU8bAQAAAAFiS0dEk+ED37YAAAAHdElNRQfkCgcIIAF69pagAAABeUlEQVQ4y2NgYGRhZWPnEMAAHOxsrCyMDAxMnFzcAjgANxcPMwMvF58ATsDHxcvAyi+AB/CzMrBBWIJCQCAIZ4EBiMfGwA4WFBYRBQIxcQEBCUlRKJCSBsqwM4DdLyMrJw8ECopKEsoqqvJgoKauATSRgwEkr6mlraOgq6unL29gaGRsogsCpmbmYLshCiwsraxtbO3sHRydnF1cbW1AwM0dWYGHp5egoLePr6OTn5m/IAQIoCgICBQQCAoGKQgJFUT2KKYCszCoLwWxKwiXj4iMAoHomFhBbAri4qEgITEIqwlJySmpaWnpGZlZYAOwuSE7JycnN884PwefLzQLjAs1h56CImEhoSAfnAqKS0rLyisqq7SrgQpqMBUI1tbpxHvUF8s3uDU2NcsIgBW0QBWAk5xga1t6e0dnV7dmT28fKIQ10436wYmWA5JoBQQ1czQFhTQFBW0mTATzRSZJgCXYYckeBgSFUGk2whmHYNbDn3k5mRgIZX8AAQWVTx3DBdsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTAtMDdUMDA6MzI6MDErMDg6MDBq1jCmAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTEwLTA3VDAwOjMyOjAxKzA4OjAwG4uIGgAAAABJRU5ErkJggg==";

    function adjustMargin() {
        if ($('[data-ebassistant="read"]').height() > 36) {
            $('[data-ebassistant="read"]').attr("style", "margin-right:0!important;");
            $('[data-ebassistant="read"] .online-read-or-audio').each(function() {
                if(($(this).offset().left - $('[data-ebassistant="read"]').offset().left) == 0) {
                    $(this).attr("style", "margin-left:65px!important;");
                }
            });
        }
    }

    // 客户端本地抓取，如有结果，结果共享给服务器
    function queryAmazon_Local(isbn, title, author, token="") {
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
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var bookPrice = "";
                    try {
                        var regexbookPrice1 = /<span[^>]*class="a-offscreen"[^>]*>\s*[￥¥]([\d\.]+)\s*<\/span>/gi;
                        bookPrice = regexbookPrice1.exec(doc)[1];
                    } finally {
                        var regexAmazonPrice2 = /<span[^>]*id="kindle-price"[^>]*>\s*[￥|¥]([\d\.]+)\s*<\/span>/gi;
                        bookPrice = regexAmazonPrice2.exec(doc)[1];
                    }
                    var regexAmazonKu = /(免费借阅)|(免费阅读此书)|(涵盖在您的会员资格中)|(或者[￥¥][\d\.]+购买)/gi;
                    var amazonKu = regexAmazonKu.test(doc);
                    var buyItemTemplate = ""
                    if (amazonKu) {
                        var regexbookPrice = /或者[￥¥]([\d\.]+)购买/gi
                        bookPrice = regexbookPrice.exec(doc)[1];
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                        <img alt="Kindle Unlimited" src="${b64_icon_ku}" width="75" height="10" border="0">
                        </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="${bookUrl}">
                        <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn">
                        <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>`;
                    } else {
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                        <img class="eba-vendor-icon" src="${b64_icon_kindle}">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                        <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                        <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    }
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                    var amazonShortUrl = /(https:\/\/www\.amazon\.cn\/dp\/[0-9a-zA-Z]+\/)/gi.exec(bookUrl)[1];
                    title = encodeURIComponent(title);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${domain}/amazon/push?isbn=${isbn}`,
                        data: `isbn=${isbn}&title=${title}&author=${author}&price=${bookPrice}&url=${amazonShortUrl}&ku=${amazonKu}&token=${token}&version=${version}`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
                }
                adjustMargin();
                return;
            }
        });
        return;
    }

    // 为提升查询速度，服务器预先缓存了一批数据。
    // 但目前遇到一个问题是，难以保证数据最新的，因为请求量较大，屡屡触发亚马逊的反爬虫机制。
    // 因此，需要借助各位的力量，去中心化地对数据进行校验和更新。下面这个函数，只会更新当前页面书籍的信息(价格、是否KU)

    function feedbackAmazon(isbn, url, token="") {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-agent": window.navigator.userAgent,
            },
            onload: function(responseDetail) {
                var doc = responseDetail.responseText;
                var regexbookPrice = /<span[^>]*id="kindle-price"[^>]*>\s*[￥|¥]([\d\.]+)\s*<\/span>/gi;
                var bookPrice = regexbookPrice.exec(doc)[1];
                console.log(bookPrice);
                var regexAmazonKu = /(免费借阅)|(免费阅读此书)|(涵盖在您的会员资格中)/gi;
                var amazonKu = regexAmazonKu.test(doc);
                console.log(amazonKu);
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
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_kindle}" width="16" height="16"> <span>Kindle</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"><span>
                    <img class="eba-vendor-icon" src="${b64_icon_kindle}">&nbsp;Kindle</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    if (ku === true) {
                        buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                        <img alt="Kindle Unlimited" src="${b64_icon_ku}" width="75" height="10" border="0">
                        </span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper"> <a target="_blank" href="${bookUrl}">
                        <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell"> <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn">
                        <span>购买电子书</span> </a> </div> </div> </div> <div class="more-info"> <span class="buyinfo-promotion">KU可免费借阅</span> </div> </li>`;
                    }
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                    var ext = result.ext;
                    if (ext == "r") {
                        feedbackAmazon(isbn, bookUrl, token);
                    }
                } else {
                    console.log("call queryAmazon_Local.");
                    queryAmazon_Local(isbn, title, token);
                }
                adjustMargin();
                return;
            }
        });
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
                        <img src="${b64_icon_weread}" width="16" height="16"> <span>微信读书</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_weread}" width="16" height="16"> <span>微信读书</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_weread}" width="16" height="16"> <span>微信读书</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img class="eba-vendor-icon" src="${b64_icon_weread}">&nbsp;微信读书</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                adjustMargin();
                return;
            }
        });
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
                        <img src="${b64_icon_duokan}" width="16" height="16"> <span>多看阅读</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_duokan}" width="16" height="16"> <span>多看阅读</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_duokan}" width="16" height="16"> <span>多看阅读</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img class="eba-vendor-icon" src="${b64_icon_duokan}">&nbsp;多看阅读</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                adjustMargin();
                return;
            }
        });
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
                        <img src="${b64_icon_ximalaya}" width="16" height="16"> <span>喜马拉雅</span> </a> </div>`;
                        $('.online-type[data-ebassistant="audio"]').append(partnerTemplate);
                    } else if ($(".online-partner .online-type").length == 1) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="audio"> <span>在线试听：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${alubmUrl}" one-link-mark="yes">
                        <img src="${b64_icon_ximalaya}" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="read"]').after(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="audio"> <span>在线试听：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${alubmUrl}" one-link-mark="yes">
                        <img src="${b64_icon_ximalaya}" width="16" height="16"> <span>喜马拉雅</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                }
                adjustMargin();
                return;
            }
        });
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
                        <img src="${b64_icon_jd}" width="16" height="16"> <span>京东读书</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_jd}" width="16" height="16"> <span>京东读书</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_jd}" width="16" height="16"> <span>京东读书</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img class="eba-vendor-icon" src="${b64_icon_jd}">&nbsp;京东读书</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                adjustMargin();
                return;
            }
        });
        return;
    }

    // 使用服务器上的资源
    function queryDangdang_Remote(isbn, title, subtitle, author, translator, publisher) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${domain}/dangdang?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}`,
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
                        <img src="${b64_icon_dangdang}" width="16" height="16"> <span>当当云阅读</span> </a> </div>`;
                        $('.online-type[data-ebassistant="read"]').append(partnerTemplate);
                    } else if ($('.online-type[data-ebassistant="audio"]').length) {
                        partnerTemplate = `<div class="online-type" data-ebassistant="read"> <span>在线试读：</span> <div class="online-read-or-audio">
                        <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_dangdang}" width="16" height="16"> <span>当当云阅读</span> </a> </div></div>`;
                        $('.online-type[data-ebassistant="audio"]').before(partnerTemplate);
                    } else {
                        partnerTemplate = `<div class="online-partner"> <div class="online-type" data-ebassistant="read"> <span>在线试读：</span>
                        <div class="online-read-or-audio"> <a class="impression_track_mod_buyinfo" target="_blank" href="${bookUrl}" one-link-mark="yes">
                        <img src="${b64_icon_dangdang}" width="16" height="16"> <span>当当云阅读</span> </a> </div></div> </div>`;
                        $("#link-report").after(partnerTemplate);
                    }
                    var buyItemTemplate = `<li> <div class="cell price-btn-wrapper"> <div class="vendor-name"> <a target="_blank" href="${bookUrl}"> <span>
                    <img class="eba-vendor-icon" src="${b64_icon_dangdang}">&nbsp;当当云阅读&nbsp;</span> </a> </div> <div class="cell impression_track_mod_buyinfo"> <div class="cell price-wrapper">
                    <a target="_blank" href="${bookUrl}"> <span class="buylink-price"> ${bookPrice}元 </span> </a> </div> <div class="cell">
                    <a target="_blank" href="${bookUrl}" class="buy-book-btn e-book-btn"> <span>购买电子书</span> </a> </div> </div> </div> </li>`;
                    $("#buyinfo ul:nth-child(2)").prepend(buyItemTemplate);
                }
                adjustMargin();
                return;
            }
        });
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
    .online-partner .online-type:last-child{margin-right:0}.online-partner .online-type:nth-child(2){padding-left:0}[data-ebassistant=read] div:last-child a{margin-right:0}
    .eba-vendor-icon {text-decoration:none;display:inline-block;vertical-align:middle;width:15px;height:15px;margin-top:-2px;border:0;border-radius:50%;box-shadow: 0 0 1px 0 rgba(0,0,0,0.6);}</style>`;
    $("#content").append(newStyle);

    var _doc = document.documentElement.innerHTML;
    var regexLinkedData = /<script type="application\/ld\+json">([\s\S]+?)<\/script>/gi;
    var linkedData = regexLinkedData.exec(_doc)[1].trim();
    linkedData = JSON.parse(linkedData);
    console.log(linkedData);
    var isbn = linkedData.isbn;
    console.log(isbn);
    var title = linkedData.name;
    console.log(title);
    _doc = _doc.replace(/&nbsp;/gi, " ");
    var subtitle = "";
    try {
        var regexSubtitle = /<span class="pl">\s*副标题:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi;
        subtitle = regexSubtitle.exec(_doc)[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(subtitle);
    var authorStr = "";
    for (var i=0, j=linkedData.author.length; i<j; i++) {
        authorStr += linkedData.author[i].name + " ";
    }
    var author = authorStr;
    console.log(author);
    var translator = "";
    try {
        var regexTranslator = /<span class="pl">\s*译者:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi;
        translator = regexTranslator.exec(_doc)[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(translator);
    var publisher = "";
    try {
        var regexPublisher = /<span class="pl">\s*出版社:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi;
        publisher = regexPublisher.exec(_doc)[1].trim();
    } catch(e) {
        console.log(e);
    }
    console.log(publisher);

    queryWeread_Remote(isbn, title, subtitle, author, translator, publisher);
    queryAmazon_Remote(isbn, title, subtitle, author, translator, publisher);
    queryDuokan_Remote(isbn, title, subtitle, author, translator, publisher);
    queryXimalaya_Remote(isbn, title, subtitle, author, translator, publisher);
    queryJingdong_Remote(isbn, title, subtitle, author, translator, publisher);
    queryDangdang_Remote(isbn, title, subtitle, author, translator, publisher);
    // queryAmazon_Local(isbn, title, author);

    return;
})();