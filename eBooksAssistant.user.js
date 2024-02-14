// ==UserScript==
// @name         eBooks Assistant
// @name:zh-CN   豆瓣读书助手
// @namespace    https://github.com/caspartse/eBooksAssistant
// @version      24.02.4
// @description  eBooks Assistant for douban.com, weread.qq.com
// @description:zh-CN 为豆瓣读书页面添加微信读书、多看阅读、京东读书、当当云阅读、喜马拉雅等直达链接; 为微信读书增加豆瓣评分及链接。
// @icon         https://ebooks-assistant.oss-cn-guangzhou.aliyuncs.com/ebooks_assistant_logo_256.png
// @author       Caspar Tse
// @license      MIT License
// @supportURL   https://github.com/caspartse/eBooksAssistant
// @match        https://book.douban.com/subject/*
// @match        https://weread.qq.com/web/bookDetail/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @connect      127.0.0.1
// @connect      api.youdianzishu.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412479/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/412479/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const version = "24.02.4";
// 如果自己部署服务，这里修改成你的服务器地址
const REST_URL = "https://api.youdianzishu.com/v2";

// Base64 icons
const base64_icon_weread = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABMlBMVEU4tP83tP8ysf8xsf8ysP8xsP8xr/8xrv8xrf8xrf4xrP8xrP4wrP4wq/4wqv4wqf4wqP4vqP4vp/4up/4rpv4rpf4tpv5Arf53xP6X0v6Fy/5Utv4upv4vpv4tpf5Utf7Q6v/8/v/////s9/+Mzf4wpv40p/7C5P/W7f+T0P7+/v/L6P+a0//z+v9lvP4rpP4vpf4tpP5Hr/7o9f/q9v/H5//+///k8//K6P8qo/4upP46qf7T7P/9/v94xP4vpP4so/52w/7v+P/B5P88qf4to/4uo/4tov6g1f7S6//d8P+X0f5Aq/4sov5DrP42pv4+qv43p/4rof4roP0roPwrof0uov4qoP0qoPyWzvmWzfmTzPlsu/ozo/z3+/73/P7t9v2IyPv0+v72+/7k8v31+v52qLiyAAAAAWJLR0QiXWVcrAAAAAd0SU1FB+QKERMSBxvkIzYAAAFFSURBVDjLhYqHUsJAFEWfcWMQNRQFayyxYsWuawk2ELsiKKFI/f9fcN9uZtgENGfuK3PmAvxFn3OVfoaiiAhcAhSFOJ5dQviWBRCiElVVCcGt4nYLGPDBv6D5AFogoGkifDSPgAAyyCPRERAcQoJOxJUFDCNBZ8RyCRjxgRV059X5o3sE6D5ACNFDHjoCQj5AWCbC4xIQQaKRzgnzd3QsFovjD9GexMcnJqemZ9gHhpso37Nz8wumubi0bBjegmBldS2xvrG5tb1jQLIHu3v7B4dHxydm4jTZs0DPzk3k4pIVLItSi0HxUkskdXWNhZvbOwvSHMpCnQfJ3Gcfso9Pz+m0U+ji5fXt/SPDHsghnzyMfKGQ5+Ir981FDoq2bRdx4SmVK5VySRJFG6oSP9VavV5jRwIaLpqtVtNtPIVGu934v9DFL75RivuAiiVCAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTE3VDExOjI2OjE5KzA4OjAwmsnyVQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0xN1QxMToxODowNyswODowMPAqZ5gAAAAASUVORK5CYII=";
const base64_icon_duokan = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABUFBMVEXtkC/tkC/tkC/tkC/tkC/tkC/tkC/tkC/tkC/tjy7tjiztjyztkC7vnUjzs3Hyq2LulDbvmUDysGrulzztjy3wpVb76NT//fz++fT3y57tkzXzuHn++PLyr2r3zaL////+9u7xpln0u4H//Przs3D406zxqmDysWz99u353b/ulz3ysW3869nxql/tkTHyrmf3zKD1w47vnUftkzTvnEXtkjPuljvyrmj75c775MzyrGPulTntkDDulDf638P63b/xqFv517PumT/98+nwo1L2xpX75tH1wIj//v3tkTDvnkn87Nr3zJ/vnEb86df+9/D0uHv517X98ujxplfzt3j++fP+9+/2ypvwolDulTjumD7638T+/Pj1xJDtkjL98+j64sn63sD76NX++vX3zqTzt3f86tf//v787+H0un741K764cb64sj517T1v4bwoEzN5UsNAAAACHRSTlMcnfP0nh388p6FZyYAAAABYktHRB8FDRC9AAAAB3RJTUUH5AoRExEwiHTV+gAAAUFJREFUOMu9k9dTAkEMxg9E3L2LekoUsEXFXk4RFAuIYgHsXbFg7+3/f/NmnGt7A/fimLfN/ia7+fJFknx+VjFqArWSL8iqRDAg1bGq4ZeYR/wnwGUFrDSXQQCgvqFRNQloag6BA8CW1nAk2mYAcntHp+ys0EVE3T1oAL2xPgHo14HIgFIRwMEhouER4xPK6Ni44qygTUzGp7jZRSI5LbaJKFv3ep8uHSA0Y9OBgQjw1OzcvFVCW0g7AcgsEmVV872l5Rx3VlB1YGXV0AHX1gUlGeYLRNHibxY3NrfEWfDtHaLdvTSCPqjc/sEhCgDDo2Oik9OzUuI8dXF5ZfzR5odyPEJUuL65vbuPPZTADUD58SmsT4SeX/IZq2G7ozD5+vb+8fn1DTbJHJbjclHNaAracy5PgnD+A1d7rp7n8nqt/w9oaTwtTt+bTAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0xMC0xN1QxMToyNjoyNCswODowMHWRlHYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMTAtMTdUMTE6MTc6NDgrMDg6MDBzI0IGAAAAAElFTkSuQmCC";
const base64_icon_jd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE9GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZmFjLCAyMDIxLzExLzE3LTE3OjIzOjE5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDItMTJUMTA6MTY6MTErMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAyLTEyVDEwOjIwOjMwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAyLTEyVDEwOjIwOjMwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkMTI3ZDdmNi0wZjJlLTRmZGEtOTgxZS0yYzc1MWIxN2M4MzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZDEyN2Q3ZjYtMGYyZS00ZmRhLTk4MWUtMmM3NTFiMTdjODMxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZDEyN2Q3ZjYtMGYyZS00ZmRhLTk4MWUtMmM3NTFiMTdjODMxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkMTI3ZDdmNi0wZjJlLTRmZGEtOTgxZS0yYzc1MWIxN2M4MzEiIHN0RXZ0OndoZW49IjIwMjItMDItMTJUMTA6MTY6MTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy4xIChNYWNpbnRvc2gpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pkcx3wkAAALuSURBVFiFzZfNS1RhFMZ/7zv3js6oZdpMarYQUqSFolIpLRIKtCiotWTmPxAWtOgvcBMFQcvatQoyjT5Q84M+cCUJSi10YcUwVkIzzjhz5360uNrHzL02o6P2wOXCeQ/neS73vIfniHCgmjUcB/qAdsDP9iAOjAO3gSkAsSbgCnB/m0jd0As8EOFAdQPwfofJ19GoAP0ZYSFACMxwCJMUYpPVLUCiIg9UgmXZz9/oF+FAdQQoSVOA+W0JtakJ5Ug9Vkq3q+UCAUJV0Oc+kJqeRu4P4lAkqgBqetRcDuNta6NsYgQUJUfmNOg6yydPo029Q5YF009VCaTSo4ah4e3s2Do5gKLg7ezAMDSn05QjgwCsWOyftc1QiNWhpyjBCgounHfNs2Ix1z5y/0TTdAwbi4tow2MkBp+QGHzMKlBSVUNgAwFutTYWkE48v0Ck7zqJoQFSgAQKauoJXDyH73J3tmU2LyB26w6RoQH8hw5T3NNF4dlO1NbWTRPnLMBKJJFA6aOHqMeObpl4HTLbRKGqCEAonryR5yQAYfextZrYJQHbhKwFWJpmD9JUxtzaGQGYJiaAP79WIetbUHTzBt5T7agtzbsjQKmrRamrzSs5/NdNKDZrQ3Kr5SpAFBflj9/ny02AQKBP588m6rNzrmfOlswwMKMRfJe6UBsbsJIa1soKsrICX083orAgS2qL+N17RK5eQ+4pBa83PSHqLEB6QNcxvn/55eLW38HXb1FPtLlTxmNoYxMkX46gvRonNTuNLClHFBWDYWQIcL6GpgFS4Pm9tNiT8McyeDIbygyH0UbHSY6Mok1Moi98XHPECp7yg6B4nMgBew5kmFJHCIGFgfDZk9CYX0AbHSM5PIw2+QZ96TMAkkI8ZVU26boNd3dEqostd4aViKM2tyCDAZIvhjGiXwHwqCWIvXtASifvvxGiIhyofgacySZbKCpG6BMWOtK/z/6vglxJ/8TzXV/NJDCDvSjuNHqBGbHb6/lP9kL8xeX2i5QAAAAASUVORK5CYII=";
const base64_icon_dangdang = "data:image/png;base64,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";
const base64_icon_ximalaya = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABvFBMVEUAAAD7KAD6KAD6KQH7KAD6KAD6KAD6KAD6KAD7KQD6KAD6KAD7KQH7KAD6KAD6KAD6KAD6JwD6JgD6KwX6Pxv7QyD6PRj6KgP6KQL6PBf7QB36LAT6Lwj8lID93tn+5eD929X8hW/6KwP8gGj92tP+5OD+5+P9vbH6NhH6JQD7VDT+7+z++/v908v93tj+/v36RCH6Phr939r+/v7939n91Mz9x737a1D7YEL++Pf9w7j6PRn6Mw36Mgz7RCH90sr+8O77TSz6RiT+7Oj92dL7SCb6MAn6JwH++fj9rJ76KAH6LAf9v7P+8e/+7On6MAr9rZ76KQH6Lgf9v7T9yL76MQr6Lwr+6+f8nYv8mIb8mYb8moj8iXT6Mw7+6eX+///+/Pv8qZn+6+j929T7dl37cFX7cFb7blP8n43+/v/9sqT6LQr6JAD6IQD7bFP8m4n7blT8nIr9taj7Wz3+9fP+7uv8qpr8k3/7RSL6LQj9xbv7SSf6MQv6ORT9vrL7c1n9sKL6SCb+7er9xLn8l4T6Oxj7Z0v7ZEj6OBT7Vjb7ZUj6NxL6SCf93df8g2z7XkD7VDX6Lgj7Ti3///+bcN/WAAAAEHRSTlMAAAAAC1u87P0Vl/MVCv7ykU8bAQAAAAFiS0dEk+ED37YAAAAHdElNRQfkCgcIIAF69pagAAABeUlEQVQ4y2NgYGRhZWPnEMAAHOxsrCyMDAxMnFzcAjgANxcPMwMvF58ATsDHxcvAyi+AB/CzMrBBWIJCQCAIZ4EBiMfGwA4WFBYRBQIxcQEBCUlRKJCSBsqwM4DdLyMrJw8ECopKEsoqqvJgoKauATSRgwEkr6mlraOgq6unL29gaGRsogsCpmbmYLshCiwsraxtbO3sHRydnF1cbW1AwM0dWYGHp5egoLePr6OTn5m/IAQIoCgICBQQCAoGKQgJFUT2KKYCszCoLwWxKwiXj4iMAoHomFhBbAri4qEgITEIqwlJySmpaWnpGZlZYAOwuSE7JycnN884PwefLzQLjAs1h56CImEhoSAfnAqKS0rLyisqq7SrgQpqMBUI1tbpxHvUF8s3uDU2NcsIgBW0QBWAk5xga1t6e0dnV7dmT28fKIQ10436wYmWA5JoBQQ1czQFhTQFBW0mTATzRSZJgCXYYckeBgSFUGk2whmHYNbDn3k5mRgIZX8AAQWVTx3DBdsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTAtMDdUMDA6MzI6MDErMDg6MDBq1jCmAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTEwLTA3VDAwOjMyOjAxKzA4OjAwG4uIGgAAAABJRU5ErkJggg==";
const base64_icon_douban = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAABIUExURQB3EQB3EQB3EQB3EQB3EQB3EeDu4v///9Dm09jq24C7iLDVtbjZveLw5CCIL2SsbieMNRyGK3CzetLn1bnavonAkfj7+Ap8GhrTEDEAAAAFdFJOU0nm50rkZcBlpgAAAAFiS0dEBxZhiOsAAAAHdElNRQfnCR0IDiYqa5ViAAAAi0lEQVQ4y8WTSw6AIAxE8VNHRUVF5f43FYMLDQgaSJzVhD7SpgOMZeRRxvz1g6CA3gEVnKoSAvFDEtV2g/oz0LQXNQ6AXzvzf4DgkJF7IOqAfjjVA52VhdCXRmNHbYUFTPp0NnbWdrLTlMBi3AJIR9wrsKnDqA1Y7wAelBB48eRigMDnzVmR++plsQM+sxg4Ezfy+QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wOS0yOVQwODoxNDozOCswMDowMM3mLSUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDktMjlUMDg6MTQ6MzgrMDA6MDC8u5WZAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTA5LTI5VDA4OjE0OjM4KzAwOjAw6660RgAAAABJRU5ErkJggg==";
const base64_icon_douban_rating = "data:image/png;base64,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";

let x_unique_id = Math.random().toString(36).substring(2, 12);
console.log(x_unique_id);

// 信息查询：微信读书
const queryWeread = (isbn, title, subtitle, author, translator, publisher) => {
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url, price } = result.data;

            let html_template_purchase = `<li><div class="cell price-btn-wrapper"><div class="vendor-name"><img class="eba_vendor_icon" src="${base64_icon_weread}">
            <a target="_blank" href="${url}"><span>&nbsp;微信读书</span></a></div><div class="cell impression_track_mod_buyinfo"><div class="cell price-wrapper">
            <a target="_blank" href="${url}"><span class="buylink-price"> ${price}元 </span></a></div><div class="cell">
            <a target="_blank" href="${url}" class="buy-book-btn e-book-btn"><span>购买电子书</span></a></div></div></div></li>`;

            if ($("#buyinfo .current-version-list").length) {
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            } else {
                let elm_buyinfo_printed = `<div class="buyinfo-printed" id="buyinfo-printed"><h2><span>当前版本有售</span> &nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2><ul class="bs current-version-list"></ul></div>`;
                $("#buyinfo").prepend(elm_buyinfo_printed);
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            }
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${REST_URL}/weread?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        onload: handleResponse
    });
}

// 信息查询：多看阅读
const queryDuokan = (isbn, title, subtitle, author, translator, publisher) => {
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url, price } = result.data;

            let html_template_purchase = `<li><div class="cell price-btn-wrapper"><div class="vendor-name"><img class="eba_vendor_icon" src="${base64_icon_duokan}">
            <a target="_blank" href="${url}"><span>&nbsp;多看阅读</span></a></div><div class="cell impression_track_mod_buyinfo"><div class="cell price-wrapper">
            <a target="_blank" href="${url}"><span class="buylink-price"> ${price}元 </span></a></div><div class="cell">
            <a target="_blank" href="${url}" class="buy-book-btn e-book-btn"><span>购买电子书</span></a></div></div></div></li>`;

            if ($("#buyinfo .current-version-list").length) {
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            } else {
                let elm_buyinfo_printed = `<div class="buyinfo-printed" id="buyinfo-printed"><h2><span>当前版本有售</span> &nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2><ul class="bs current-version-list"></ul></div>`;
                $("#buyinfo").prepend(elm_buyinfo_printed);
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            }
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${REST_URL}/duokan?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        onload: handleResponse
    });
}

// 信息查询：京东读书
const queryJingdong = (isbn, title, subtitle, author, translator, publisher) => {
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url, price } = result.data;

            let html_template_purchase = `<li><div class="cell price-btn-wrapper"><div class="vendor-name"><img class="eba_vendor_icon" src="${base64_icon_jd}">
            <a target="_blank" href="${url}"><span>&nbsp;京东读书</span></a></div><div class="cell impression_track_mod_buyinfo"><div class="cell price-wrapper">
            <a target="_blank" href="${url}"><span class="buylink-price"> ${price}元 </span></a></div><div class="cell">
            <a target="_blank" href="${url}" class="buy-book-btn e-book-btn"><span>购买电子书</span></a></div></div></div></li>`;

            if ($("#buyinfo .current-version-list").length) {
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            } else {
                let elm_buyinfo_printed = `<div class="buyinfo-printed" id="buyinfo-printed"><h2><span>当前版本有售</span> &nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2><ul class="bs current-version-list"></ul></div>`;
                $("#buyinfo").prepend(elm_buyinfo_printed);
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            }
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${REST_URL}/jd?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        onload: handleResponse
    });
}

// 信息查询：当当云阅读
const queryDangdang = (isbn, title, subtitle, author, translator, publisher) => {
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url, price } = result.data;

            let html_template_purchase = `<li><div class="cell price-btn-wrapper"><div class="vendor-name"><img class="eba_vendor_icon" src="${base64_icon_dangdang}">
            <a target="_blank" href="${url}"><span>&nbsp;当当阅读&nbsp;</span></a></div><div class="cell impression_track_mod_buyinfo"><div class="cell price-wrapper">
            <a target="_blank" href="${url}"><span class="buylink-price"> ${price}元 </span></a></div><div class="cell">
            <a target="_blank" href="${url}" class="buy-book-btn e-book-btn"><span>购买电子书</span></a></div></div></div></li>`;

            if ($("#buyinfo .current-version-list").length) {
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            } else {
                let elm_buyinfo_printed = `<div class="buyinfo-printed" id="buyinfo-printed"><h2><span>当前版本有售</span> &nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2><ul class="bs current-version-list"></ul></div>`;
                $("#buyinfo").prepend(elm_buyinfo_printed);
                $("#buyinfo .current-version-list").prepend(html_template_purchase);
            }
        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${REST_URL}/dangdang?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        onload: handleResponse
    });
}

// 信息查询：喜马拉雅
const queryXimalaya = (isbn, title, subtitle, author, translator, publisher) => {
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url } = result.data;

            const constructHtmlTemplatePartner = (type) => {
                let template = `<div class="online-read-or-audio">
                    <div class="vendor-info">
                        <img class="vendor-icon" src="${base64_icon_ximalaya}">
                        <a class="vendor-name impression_track_mod_buyinfo" target="_blank" href="${url}">
                            喜马拉雅
                        </a>
                    </div>
                    <a class="vendor-link" target="_blank" href="${url}">
                        去试听
                    </a>
                </div>`;

                if (type === 'header') {
                    template = `<div class="online-type" data-ebassistant="audio"><h2>在线试听：</h2>${template}</div>`;
                }

                if (type === 'parent') {
                    template = `<div class="gray_ad online-partner"><h2>在线试听：</h2>${template}</div>`;
                }

                return template;
            }

            let html_template_partner;
            if ($('.online-type[data-ebassistant="audio"]').length) { // 如果有试读听条目
                html_template_partner = constructHtmlTemplatePartner();
                $('.online-type[data-ebassistant="audio"] h2').after(html_template_partner);
            } else if ($('.online-type[data-ebassistant="read"]').length) { // 如果没有试读听条目，但有试读条目
                html_template_partner = constructHtmlTemplatePartner('header');
                $('.online-type[data-ebassistant="read"]').after(html_template_partner);
            } else { // 如果既没有试读听条目，也没有试读条目
                if ($('.gray_ad.online-partner').length) { // 如果有 <div class="gray_ad online-partner"> 节点，插入元素
                    html_template_partner = constructHtmlTemplatePartner('header');
                    $('.gray_ad.online-partner').after(html_template_partner);
                } else { // 如果没有 <div class="gray_ad online-partner"> 节点，创建节点
                    html_template_partner = constructHtmlTemplatePartner('parent');
                    $('#buyinfo').append(html_template_partner);
                }
            }

        }
    }
    GM_xmlhttpRequest({
        method: "GET",
        url: `${REST_URL}/ximalaya?isbn=${isbn}&title=${title}&subtitle=${subtitle}&author=${author}&translator=${translator}&publisher=${publisher}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href
        },
        onload: handleResponse
    });
}

// 同步图书元数据
const syncMetadata = (isbn, metadata) => {
    GM_xmlhttpRequest({
        method: "POST",
        url: `${REST_URL}/sync_metadata?isbn=${isbn}&version=${version}&r=${Math.random()}`,
        headers: {
            "Content-Type": "application/json",
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        data: JSON.stringify(metadata),
        onload: (responseDetail) => {
            const result = JSON.parse(responseDetail.responseText);
            console.log(result);
        }
    });
}

// 样式调整：添加新样式
const addNewStyle = () => {
    const new_style = `<style type="text/css" media="screen">
    /* 豆瓣读书页面 */
    .eba_vendor_icon {
        text-decoration: none;
        display: inline-block;
        vertical-align: middle;
        width: 15px;
        height: 15px;
        margin-top: -2px;
        border: 0;
        border-radius: 50%;
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.6);
    }

    /* 微信读书页面 */
    .douban_rating {
        width: 75px;
        height: 15px;
        display: inline-block;
        background-image: url("${base64_icon_douban_rating}");
        background-size: 75px 165px;
        background-repeat: no-repeat;
    }
    .douban_rating_star_0 {
        background-position: 0 -150px;
    }
    .douban_rating_star_1 {
        background-position: 0 -135px;
    }
    .douban_rating_star_2 {
        background-position: 0 -120px;
    }
    .douban_rating_star_3 {
        background-position: 0 -105px;
    }
    .douban_rating_star_4 {
        background-position: 0 -90px;
    }
    .douban_rating_star_5 {
        background-position: 0 -75px;
    }
    .douban_rating_star_6 {
        background-position: 0 -60px;
    }
    .douban_rating_star_7 {
        background-position: 0 -45px;
    }
    .douban_rating_star_8 {
        background-position: 0 -30px;
    }
    .douban_rating_star_9 {
        background-position: 0 -15px;
    }
    .douban_rating_star_10 {
        background-position: 0 0;
    }
    </style>`;
    $("html").append(new_style);
}

// 豆瓣读书页面主函数
const doubanMain = () => {
    try {
        const types = ['在线试读', '在线试听'];
        const data = ['read', 'audio'];
        types.forEach((type, index) => {
            $('.online-partner .online-type h2:contains("' + type + '")').parent('.online-type').attr("data-ebassistant", data[index]); // 添加 data-ebassistant 属性
        });
    } catch(e) {
        console.log(e);
    }

    let _doc = document.documentElement.innerHTML;
    const regex_linked_data = /<script type="application\/ld\+json">([\s\S]+?)<\/script>/gi;
    let linked_data = JSON.parse(regex_linked_data.exec(_doc)[1].trim());
    const { isbn, name: title, url } = linked_data;
    const author = linked_data.author.map(author => author.name).join(', ');

    _doc = _doc.replace(/&nbsp;/gi, " ");

    // 豆瓣评分 rating_score
    let rating_score = extractData(_doc, /<strong class="ll rating_num " property="v:average">([\s\S]+?)<\/strong>/gi);
    // 出版社 publisher
    let publisher = extractData(_doc, /<span class="pl">\s*出版社:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi);
    if (!publisher) {
        publisher = extractData(_doc, /<span class="pl">\s*出版社:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    }
    // 出品方 producer
    let producer = extractData(_doc, /<span class="pl">\s*出品方:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi);
    if (!producer) {
        producer = extractData(_doc, /<span class="pl">\s*出品方:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    }
    // 副标题 subtitle
    let subtitle = extractData(_doc, /<span class="pl">\s*副标题:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 原作名 original_title
    let original_title = extractData(_doc, /<span class="pl">\s*原作名:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 译者 translator
    let translator = extractData(_doc, /<span class="pl">\s*译者:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi);
    if (!translator) {
        translator = extractData(_doc, /<span class="pl">\s*译者:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    }
    // 出版年 published
    let published = extractData(_doc, /<span class="pl">\s*出版年:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 页数 pages
    let pages = extractData(_doc, /<span class="pl">\s*页数:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 定价 price
    let price = extractData(_doc, /<span class="pl">\s*定价:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 装帧 binding
    let binding = extractData(_doc, /<span class="pl">\s*装帧:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    // 丛书 series
    let series = extractData(_doc, /<span class="pl">\s*丛书:?<\/span>\s*:?\s*<a[^>]+>([\s\S]+?)<\/a>/gi);
    if (!series) {
        series = extractData(_doc, /<span class="pl">\s*丛书:?<\/span>\s*:?\s*([\s\S]+?)<br\/?>/gi);
    }
    // 内容简介 description
    let description = extractData(_doc, /<meta property="og:description" content="([^"]+?)"/gi);
    description = description.replace(/<[^>]+>|\n/g, "");
    // 封面图片 cover_url
    let cover_url = extractData(_doc, /<meta property="og:image" content="([^"]+?)"/gi);
    // 🚀🎉🎊🥳 图书元数据开放接口已上线，可前往 https://forms.gle/91z4wrtQngrbkK1g9 申请使用。
    const metadata = {
        isbn, rating_score, url, title, author, publisher, producer, subtitle, original_title, translator, published, pages, price, binding, series, description, cover_url
    };
    console.log(metadata);

    queryWeread(isbn, title, subtitle, author, translator, publisher);
    queryDuokan(isbn, title, subtitle, author, translator, publisher);
    queryJingdong(isbn, title, subtitle, author, translator, publisher);
    queryDangdang(isbn, title, subtitle, author, translator, publisher);
    queryXimalaya(isbn, title, subtitle, author, translator, publisher);
    syncMetadata(isbn, metadata);
};
const extractData = (doc, regex) => {
    try {
        return regex.exec(doc)[1].trim();
    } catch(e) {
        console.log(e);
        return "";
    }
};

// 微信读书页面主函数
const wereadMain = () => {
    let vbookid = "";
    const regex_vbookid = /bookDetail\/([0-9a-zA-Z]+)/gi;
    const result_vbookid = regex_vbookid.exec(String(window.location.href));
    if (result_vbookid) {
      vbookid = result_vbookid[1];
      console.log(vbookid);
    } else {
      console.log('vbookid not match.');
    }
    const handleResponse = (responseDetail) => {
        const result = JSON.parse(responseDetail.responseText);
        console.log(result);
        if (result.errmsg === "") {
            const { url, douban_rating_score, douban_rating_star } = result.data;
            const book_ratings_container = $(".book_ratings_container");
            const douban_info = `
                <div id="eba_douban_rating" class="book_ratings_header" style="margin-bottom:24px;cursor:pointer!important;">
                    <a style="text-decoration:none!important;color:#1b88ee!important;" target="_blank" href="${url}">
                    <span style="display:flex;align-items:center;">
                        <img src="${base64_icon_douban}" style="display:inline-block;height:15px;">
                        <span style="display:inline-block;height:24px;padding:0 4px;">豆瓣评分&nbsp;${douban_rating_score}&nbsp;</span>
                        <span class="douban_rating ${douban_rating_star}"></span>
                    </span>
                    </a>
                </div>`;
            $("#eba_douban_rating").remove();
            book_ratings_container.prepend(douban_info);
        }
    };
    GM_xmlhttpRequest ({
        method: "GET",
        url: `${REST_URL}/weread/douban_info?vbookid=${vbookid}&version=${version}&r=${Math.random()}`,
        headers: {
            "User-agent": window.navigator.userAgent,
            "X-Referer": window.location.href,
            "X-Unique-ID": x_unique_id
        },
        onload: handleResponse
    });
};

// 主函数
(() => {
    'use strict';
    addNewStyle();
    const hostname = window.location.hostname;
    if (/book\.douban\.com/.test(hostname)) {
        doubanMain();
    } else if (/weread\.qq\.com/.test(hostname)) {
        setTimeout(() => wereadMain(), 100);
    }
})();