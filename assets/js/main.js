var api = "https://blog-arksector.pages.dev/";

$(document).ready(function () {
    $(".loading").hide();
    getAchives();
    getHitokoto();
});

$('.menu a').click(function () {
    target = $(this).attr('goto');
    switchTo(target);
});

function switchTo(target) {
    $('.right section').each(function () {
        $(this).removeClass('active');
    });
    $(target).addClass('active');
}

/**
 * Fetch posts from Hexo content.json
 * Optimized for direct array format: [{"title":"...", "path":"..."}]
 */
function getAchives() {
    var t = "";
    $.ajax({
        type: "GET",
        url: api + "content.json",
        dataType: "json",
        success: function (json) {
            // Limits to the 10 most recent posts
            var limit = json.length > 10 ? 10 : json.length;

            for (var i = 0; i < limit; i++) {
                var title = json[i].title;
                var path = json[i].path;

                // Ensure no double slashes when joining URL and Path
                var cleanPath = path.startsWith('/') ? path.substring(1) : path;
                var link = api + cleanPath;

                var time = new Date(json[i].date).Format("yyyy-MM-dd");

                t += `<li><a href="${link}" target="_blank">${title} <span class="meta">/ ${time}</span></a></li>`;
            }
            $('.archive-list').html(t);
        },
        error: function () {
            $('.archive-list').html("<li>Failed to load recent posts.</li>");
        }
    });
}

/**
 * Hitokoto
 */
function getHitokoto() {
    $.ajax({
        url: "https://v1.hitokoto.cn/",
        dataType: "json",
        success: function (result) {
            write(result.hitokoto + " —— " + result.from);
        },
        error: function () {
            write("Error...");
        }
    });
}

function write(text) {
    if (text.length < 30) {
        $('#hitokoto').html(text);
    } else {
        getHitokoto();
    }
}

/**
 * Date prototype for "yyyy-MM-dd" formatting
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * Async Background Loader
 */
function blobToDataURI(blob, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    }
    reader.readAsDataURL(blob);
}

var url = "assets/img/bg.jpg";
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.responseType = "blob";
xhr.onload = function () {
    if (this.status == 200) {
        var blob = this.response;
        blobToDataURI(blob, function (t) {
            $("body").css("background-image", "url('" + t + "')");
            $("#background-small").addClass("smallBg");
            $("#background-small").css("opacity", "0");
        });
    }
}
xhr.send();