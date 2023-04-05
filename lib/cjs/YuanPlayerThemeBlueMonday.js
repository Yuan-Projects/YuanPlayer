/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function anonymous$3(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}var __line = 1
  , __lines = "<div class=\"yuan-audio\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"yuan-gui yuan-interface flexbox-column flexbox-wrap flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n    <div class=\"yuan-progress\">\r\n      <div class=\"yuan-seek-bar\" style=\"width: 100%;\">\r\n        <div class=\"yuan-play-bar\" style=\"width: 0%;\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"yuan-controls-row flexbox flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n      <div class=\"yuan-controls\">\r\n        <button class=\"yuan-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"yuan-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"yuan-next\" role=\"button\" tabindex=\"0\">next</button>\r\n        <button class=\"yuan-stop\" role=\"button\" tabindex=\"0\">stop</button>\r\n      </div>\r\n      <div class=\"yuan-volume-controls\">\r\n        <button class=\"yuan-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <div class=\"yuan-volume-bar\">\r\n          <div class=\"yuan-volume-bar-value\"></div>\r\n        </div>\r\n        <button class=\"yuan-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n      </div>\r\n      <div class=\"yuan-toggles\">\r\n        <button class=\"yuan-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"yuan-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n        <div class=\"cccontainer\" style=\"position: relative; display: inline-block;\">\r\n          <div class=\"cclist\" style=\"position: absolute; background: white; bottom: 0;\"></div>\r\n          <button class=\"yuan-closed-caption\" role=\"button\" tabindex=\"0\">CC</button>\r\n        </div>\r\n        <button class=\"yuan-full-screen\" role=\"button\" tabindex=\"0\">full screen</button>\r\n      </div>\r\n      <div class=\"yuan-time-holder\">\r\n        <div class=\"yuan-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"yuan-duration\" role=\"timer\" aria-label=\"duration\">00:00</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"yuan-no-solution\">\r\n    <span>Update Required</span>\r\n    To play the media you will need to update your browser to a recent version</a>.\r\n  </div>\r\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s; }
    ; __append("<div class=\"yuan-audio\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"yuan-gui yuan-interface flexbox-column flexbox-wrap flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n    <div class=\"yuan-progress\">\r\n      <div class=\"yuan-seek-bar\" style=\"width: 100%;\">\r\n        <div class=\"yuan-play-bar\" style=\"width: 0%;\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"yuan-controls-row flexbox flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n      <div class=\"yuan-controls\">\r\n        <button class=\"yuan-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"yuan-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"yuan-next\" role=\"button\" tabindex=\"0\">next</button>\r\n        <button class=\"yuan-stop\" role=\"button\" tabindex=\"0\">stop</button>\r\n      </div>\r\n      <div class=\"yuan-volume-controls\">\r\n        <button class=\"yuan-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <div class=\"yuan-volume-bar\">\r\n          <div class=\"yuan-volume-bar-value\"></div>\r\n        </div>\r\n        <button class=\"yuan-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n      </div>\r\n      <div class=\"yuan-toggles\">\r\n        <button class=\"yuan-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"yuan-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n        <div class=\"cccontainer\" style=\"position: relative; display: inline-block;\">\r\n          <div class=\"cclist\" style=\"position: absolute; background: white; bottom: 0;\"></div>\r\n          <button class=\"yuan-closed-caption\" role=\"button\" tabindex=\"0\">CC</button>\r\n        </div>\r\n        <button class=\"yuan-full-screen\" role=\"button\" tabindex=\"0\">full screen</button>\r\n      </div>\r\n      <div class=\"yuan-time-holder\">\r\n        <div class=\"yuan-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"yuan-duration\" role=\"timer\" aria-label=\"duration\">00:00</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"yuan-no-solution\">\r\n    <span>Update Required</span>\r\n    To play the media you will need to update your browser to a recent version</a>.\r\n  </div>\r\n</div>")
    ; __line = 41;
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

function anonymous$2(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}var __line = 1
  , __lines = "<div class=\"yuan-video\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"yuan-gui yuan-interface flexbox-column flexbox-wrap flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n    <div class=\"yuan-progress\">\r\n      <div class=\"yuan-seek-bar\" style=\"width: 100%;\">\r\n        <div class=\"yuan-play-bar\" style=\"width: 0%;\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"yuan-controls-row flexbox flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n      <div class=\"yuan-controls\">\r\n        <button class=\"yuan-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"yuan-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"yuan-next\" role=\"button\" tabindex=\"0\">next</button>\r\n      </div>\r\n      <div class=\"yuan-volume-controls\">\r\n        <button class=\"yuan-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <div class=\"yuan-volume-bar\">\r\n          <div class=\"yuan-volume-bar-value\"></div>\r\n        </div>\r\n        <button class=\"yuan-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n      </div>\r\n      <div class=\"yuan-toggles\">\r\n        <button class=\"yuan-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"yuan-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n        <div class=\"cccontainer\" style=\"position: relative; display: inline-block;\">\r\n          <div class=\"cclist\" style=\"position: absolute; background: white; bottom: 0;\"></div>\r\n          <button class=\"yuan-closed-caption\" role=\"button\" tabindex=\"0\">CC</button>\r\n        </div>\r\n        <button class=\"yuan-full-screen\" role=\"button\" tabindex=\"0\">full screen</button>\r\n      </div>\r\n      <div class=\"yuan-time-holder\">\r\n        <div class=\"yuan-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"yuan-duration\" role=\"timer\" aria-label=\"duration\">00:00</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"yuan-no-solution\">\r\n    <span>Update Required</span>\r\n    To play the media you will need to update your browser to a recent version</a>.\r\n  </div>\r\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s; }
    ; __append("<div class=\"yuan-video\" role=\"application\" aria-label=\"media player\">\r\n  <div class=\"yuan-gui yuan-interface flexbox-column flexbox-wrap flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n    <div class=\"yuan-progress\">\r\n      <div class=\"yuan-seek-bar\" style=\"width: 100%;\">\r\n        <div class=\"yuan-play-bar\" style=\"width: 0%;\"></div>\r\n      </div>\r\n    </div>\r\n    <div class=\"yuan-controls-row flexbox flexbox-justify-content-space-between flexbox-align-items-center flexbox-align-content-center\">\r\n      <div class=\"yuan-controls\">\r\n        <button class=\"yuan-previous\" role=\"button\" tabindex=\"0\">previous</button>\r\n        <button class=\"yuan-play\" role=\"button\" tabindex=\"0\">play</button>\r\n        <button class=\"yuan-next\" role=\"button\" tabindex=\"0\">next</button>\r\n      </div>\r\n      <div class=\"yuan-volume-controls\">\r\n        <button class=\"yuan-mute\" role=\"button\" tabindex=\"0\">mute</button>\r\n        <div class=\"yuan-volume-bar\">\r\n          <div class=\"yuan-volume-bar-value\"></div>\r\n        </div>\r\n        <button class=\"yuan-volume-max\" role=\"button\" tabindex=\"0\">max volume</button>\r\n      </div>\r\n      <div class=\"yuan-toggles\">\r\n        <button class=\"yuan-repeat\" role=\"button\" tabindex=\"0\">repeat</button>\r\n        <button class=\"yuan-shuffle\" role=\"button\" tabindex=\"0\">shuffle</button>\r\n        <div class=\"cccontainer\" style=\"position: relative; display: inline-block;\">\r\n          <div class=\"cclist\" style=\"position: absolute; background: white; bottom: 0;\"></div>\r\n          <button class=\"yuan-closed-caption\" role=\"button\" tabindex=\"0\">CC</button>\r\n        </div>\r\n        <button class=\"yuan-full-screen\" role=\"button\" tabindex=\"0\">full screen</button>\r\n      </div>\r\n      <div class=\"yuan-time-holder\">\r\n        <div class=\"yuan-current-time\" role=\"timer\" aria-label=\"time\">00:00</div>\r\n        <div class=\"yuan-duration\" role=\"timer\" aria-label=\"duration\">00:00</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"yuan-no-solution\">\r\n    <span>Update Required</span>\r\n    To play the media you will need to update your browser to a recent version</a>.\r\n  </div>\r\n</div>")
    ; __line = 40;
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css$2 = "/*! Blue Monday Skin for jPlayer 2.9.2 ~ (c) 2009-2014 Happyworm Ltd ~ MIT License */\n/*\r\n * Skin for jPlayer Plugin (jQuery JavaScript Library)\r\n * http://www.jplayer.org\r\n *\r\n * Skin Name: Blue Monday\r\n *\r\n * Copyright (c) 2010 - 2014 Happyworm Ltd\r\n * Licensed under the MIT license.\r\n *  - http://www.opensource.org/licenses/mit-license.php\r\n *\r\n * Author: Silvia Benvenuti\r\n * Skin Version: 5.1 (jPlayer 2.8.0)\r\n * Date: 13th November 2014\r\n */\n.yuanplayer-bluemonday-player {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  /* @group CONTROLS */\n  /* @end */\n  /* @group progress bar */\n  /* The seeking class is added/removed inside jPlayer */\n  /* @end */\n  /* @group volume controls */\n  /* @end */\n  /* @group current time and duration */\n  /* @end */\n  /* @group TOGGLES */\n  /* The audio toggles are nested inside jp-time-holder */\n  /* @end */\n  /* @group NO SOLUTION error feedback */ }\n  .yuanplayer-bluemonday-player .hidden {\n    display: none !important; }\n  .yuanplayer-bluemonday-player .yuan-audio *:focus,\n  .yuanplayer-bluemonday-player .yuan-audio-stream *:focus {\n    /* Disable the browser focus highlighting. */\n    outline: none; }\n  .yuanplayer-bluemonday-player .yuan-audio button::-moz-focus-inner,\n  .yuanplayer-bluemonday-player .yuan-audio-stream button::-moz-focus-inner {\n    /* Disable the browser CSS3 focus highlighting. */\n    border: 0; }\n  .yuanplayer-bluemonday-player .yuan-audio,\n  .yuanplayer-bluemonday-player .yuan-audio-stream {\n    font-size: 16px;\n    font-family: Verdana, Arial, sans-serif;\n    line-height: 1.6;\n    color: #666;\n    background-color: #eee;\n    border-radius: .6rem .6rem 0 0; }\n  .yuanplayer-bluemonday-player .yuan-audio-stream {\n    width: 182px; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-previous,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-next,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-play,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-mute,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-volume-max {\n    width: 28px;\n    height: 28px;\n    margin: 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-repeat-one,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-repeat-one:focus,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-repeat,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-repeat:focus {\n    background-position: 0 0 !important; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-volume-bar {\n    margin-top: 9px; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-toggles button {\n    width: 24px;\n    height: 24px;\n    margin: 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-repeat {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjgwIDk3NiAxMjAgODE2bDE2MC0xNjAgNTYgNTgtNjIgNjJoNDA2VjYxNmg4MHYyNDBIMjc0bDYyIDYyLTU2IDU4Wm0tODAtNDQwVjI5Nmg0ODZsLTYyLTYyIDU2LTU4IDE2MCAxNjAtMTYwIDE2MC01Ni01OCA2Mi02MkgyODB2MTYwaC04MFoiLz48L3N2Zz4=) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-repeat:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-shuffle {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNTYwIDg5NnYtODBoMTA0TDUzNyA2ODlsNTctNTcgMTI2IDEyNlY2NTZoODB2MjQwSDU2MFptLTM0NCAwLTU2LTU2IDUwNC01MDRINTYwdi04MGgyNDB2MjQwaC04MFYzOTJMMjE2IDg5NlptMTUxLTM3N0wxNjAgMzEybDU2LTU2IDIwNyAyMDctNTYgNTZaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-shuffle:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-closed-caption {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjAwIDg5NnEtMzMgMC01Ni41LTIzLjVUMTIwIDgxNlYzMzZxMC0zMyAyMy41LTU2LjVUMjAwIDI1Nmg1NjBxMzMgMCA1Ni41IDIzLjVUODQwIDMzNnY0ODBxMCAzMy0yMy41IDU2LjVUNzYwIDg5NkgyMDBabTAtODBoNTYwVjMzNkgyMDB2NDgwWm04MC0xMjBoMTIwcTE3IDAgMjguNS0xMS41VDQ0MCA2NTZ2LTQwaC02MHYyMGgtODBWNTE2aDgwdjIwaDYwdi00MHEwLTE3LTExLjUtMjguNVQ0MDAgNDU2SDI4MHEtMTcgMC0yOC41IDExLjVUMjQwIDQ5NnYxNjBxMCAxNyAxMS41IDI4LjVUMjgwIDY5NlptMjgwIDBoMTIwcTE3IDAgMjguNS0xMS41VDcyMCA2NTZ2LTQwaC02MHYyMGgtODBWNTE2aDgwdjIwaDYwdi00MHEwLTE3LTExLjUtMjguNVQ2ODAgNDU2SDU2MHEtMTcgMC0yOC41IDExLjVUNTIwIDQ5NnYxNjBxMCAxNyAxMS41IDI4LjVUNTYwIDY5NlpNMjAwIDgxNlYzMzZ2NDgwWiIvPjwvc3ZnPg==) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-closed-caption:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-full-screen {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMzIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGRkYiPjxwYXRoIGQ9Ik02LjY2NyAyOGgtNS4zMzNjLTAuOCAwLTEuMzMzLTAuNTMzLTEuMzMzLTEuMzMzdi01LjMzM2MwLTAuOCAwLjUzMy0xLjMzMyAxLjMzMy0xLjMzM3MxLjMzMyAwLjUzMyAxLjMzMyAxLjMzM3Y0aDRjMC44IDAgMS4zMzMgMC41MzMgMS4zMzMgMS4zMzNzLTAuNTMzIDEuMzMzLTEuMzMzIDEuMzMzek0zMC42NjcgMjhoLTUuMzMzYy0wLjggMC0xLjMzMy0wLjUzMy0xLjMzMy0xLjMzM3MwLjUzMy0xLjMzMyAxLjMzMy0xLjMzM2g0di00YzAtMC44IDAuNTMzLTEuMzMzIDEuMzMzLTEuMzMzczEuMzMzIDAuNTMzIDEuMzMzIDEuMzMzdjUuMzMzYzAgMC44LTAuNTMzIDEuMzMzLTEuMzMzIDEuMzMzek0zMC42NjcgMTJjLTAuOCAwLTEuMzMzLTAuNTMzLTEuMzMzLTEuMzMzdi00aC00Yy0wLjggMC0xLjMzMy0wLjUzMy0xLjMzMy0xLjMzM3MwLjUzMy0xLjMzMyAxLjMzMy0xLjMzM2g1LjMzM2MwLjggMCAxLjMzMyAwLjUzMyAxLjMzMyAxLjMzM3Y1LjMzM2MwIDAuOC0wLjUzMyAxLjMzMy0xLjMzMyAxLjMzM3pNMS4zMzMgMTJjLTAuOCAwLTEuMzMzLTAuNTMzLTEuMzMzLTEuMzMzdi01LjMzM2MwLTAuOCAwLjUzMy0xLjMzMyAxLjMzMy0xLjMzM2g1LjMzM2MwLjggMCAxLjMzMyAwLjUzMyAxLjMzMyAxLjMzM3MtMC41MzMgMS4zMzMtMS4zMzMgMS4zMzNoLTR2NGMwIDAuOC0wLjUzMyAxLjMzMy0xLjMzMyAxLjMzM3oiPjwvcGF0aD48L3N2Zz4=) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-full-screen:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-mute {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjAwIDY5NlY0NTZoMTYwbDIwMC0yMDB2NjQwTDM2MCA2OTZIMjAwWm00NDAgNDBWNDE0cTQ1IDIxIDcyLjUgNjV0MjcuNSA5N3EwIDUzLTI3LjUgOTZUNjQwIDczNlpNNDgwIDQ1MGwtODYgODZIMjgwdjgwaDExNGw4NiA4NlY0NTBaTTM4MCA1NzZaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-mute:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-volume-max {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNTYwIDkyNXYtODJxOTAtMjYgMTQ1LTEwMHQ1NS0xNjhxMC05NC01NS0xNjhUNTYwIDMwN3YtODJxMTI0IDI4IDIwMiAxMjUuNVQ4NDAgNTc1cTAgMTI3LTc4IDIyNC41VDU2MCA5MjVaTTEyMCA2OTZWNDU2aDE2MGwyMDAtMjAwdjY0MEwyODAgNjk2SDEyMFptNDQwIDQwVjQxNHE0NyAyMiA3My41IDY2dDI2LjUgOTZxMCA1MS0yNi41IDk0LjVUNTYwIDczNlpNNDAwIDQ1MGwtODYgODZIMjAwdjgwaDExNGw4NiA4NlY0NTBaTTMwMCA1NzZaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-volume-max:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-play {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMzIwIDg1NlYyOTZsNDQwIDI4MC00NDAgMjgwWm04MC0yODBabTAgMTM0IDIxMC0xMzQtMjEwLTEzNHYyNjhaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-play:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-previous {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjIwIDgxNlYzMzZoODB2NDgwaC04MFptNTIwIDBMMzgwIDU3NmwzNjAtMjQwdjQ4MFptLTgwLTI0MFptMCA5MFY0ODZsLTEzNiA5MCAxMzYgOTBaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-previous:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-next {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNjYwIDgxNlYzMzZoODB2NDgwaC04MFptLTQ0MCAwVjMzNmwzNjAgMjQwLTM2MCAyNDBabTgwLTI0MFptMCA5MCAxMzYtOTAtMTM2LTkwdjE4MFoiLz48L3N2Zz4=) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player .yuan-video .yuan-next:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-video .yuan-current-time,\n  .yuanplayer-bluemonday-player .yuan-video .yuan-duration {\n    color: white; }\n  .yuanplayer-bluemonday-player.yuan-state-playing .yuan-video .yuan-play {\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNTYwIDg1NlYyOTZoMTYwdjU2MEg1NjBabS0zMjAgMFYyOTZoMTYwdjU2MEgyNDBaIi8+PC9zdmc+);\n    background-position: 0 0; }\n    .yuanplayer-bluemonday-player.yuan-state-playing .yuan-video .yuan-play:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player.yuan-state-playing .yuan-video .yuan-previous {\n    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjIwIDgxNlYzMzZoODB2NDgwaC04MFptNTIwIDBMMzgwIDU3NmwzNjAtMjQwdjQ4MFptLTgwLTI0MFptMCA5MFY0ODZsLTEzNiA5MCAxMzYgOTBaIi8+PC9zdmc+) 0 0 no-repeat; }\n    .yuanplayer-bluemonday-player.yuan-state-playing .yuan-video .yuan-previous:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player.yuan-state-muted .yuan-video .yuan-mute:focus {\n    background-position: 0 0; }\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat-one,\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat-one:focus,\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat,\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat:focus {\n    /*\r\n        background: none;\r\n        */\n    background-color: gray;\n    background-position: 0 0; }\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat {\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjgwIDk3NiAxMjAgODE2bDE2MC0xNjAgNTYgNTgtNjIgNjJoNDA2VjYxNmg4MHYyNDBIMjc0bDYyIDYyLTU2IDU4Wm0tODAtNDQwVjI5Nmg0ODZsLTYyLTYyIDU2LTU4IDE2MCAxNjAtMTYwIDE2MC01Ni01OCA2Mi02MkgyODB2MTYwaC04MFoiLz48L3N2Zz4=); }\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-video .yuan-repeat-one {\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNMjgwIDk3NiAxMjAgODE2bDE2MC0xNjAgNTYgNTgtNjIgNjJoNDA2VjYxNmg4MHYyNDBIMjc0bDYyIDYyLTU2IDU4Wm0xODAtMjgwVjUxNmgtNjB2LTYwaDEyMHYyNDBoLTYwWk0yMDAgNTM2VjI5Nmg0ODZsLTYyLTYyIDU2LTU4IDE2MCAxNjAtMTYwIDE2MC01Ni01OCA2Mi02MkgyODB2MTYwaC04MFoiLz48L3N2Zz4=); }\n  .yuanplayer-bluemonday-player .flexbox {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex; }\n  .yuanplayer-bluemonday-player .flexbox-row {\n    -webkit-flex-direction: row;\n    -ms-flex-direction: row;\n    flex-direction: row; }\n  .yuanplayer-bluemonday-player .flexbox-column {\n    -webkit-flex-direction: column;\n    -ms-flex-direction: column;\n    flex-direction: column; }\n  .yuanplayer-bluemonday-player .flexbox-wrap {\n    -webkit-flex-wrap: wrap;\n    -ms-flex-wrap: wrap;\n    flex-wrap: wrap; }\n  .yuanplayer-bluemonday-player .flexbox-justify-content-space-between {\n    -webkit-justify-content: space-between;\n    -ms-flex-pack: justify;\n    justify-content: space-between; }\n  .yuanplayer-bluemonday-player .flexbox-align-content-center {\n    -webkit-align-content: center;\n    -ms-flex-line-pack: center;\n    align-content: center; }\n  .yuanplayer-bluemonday-player .flexbox-align-items-center {\n    -webkit-align-items: center;\n    -ms-flex-align: center;\n    align-items: center; }\n  .yuanplayer-bluemonday-player .yuan-interface {\n    position: static;\n    /*\r\n    background-color: #eee;\r\n    */\n    background-color: transparent;\n    width: 100%;\n    box-sizing: border-box;\n    padding: .6rem;\n    justify-content: space-between;\n    align-items: center;\n    gap: .6rem;\n    border-radius: .6rem .6rem 0 0; }\n    .yuanplayer-bluemonday-player .yuan-interface.flexbox .yuan-controls-row {\n      margin-top: 0; }\n  .yuanplayer-bluemonday-player .yuan-controls-holder {\n    clear: both;\n    width: 440px;\n    margin: 0 auto;\n    position: relative;\n    overflow: hidden;\n    top: -8px;\n    /* This negative value depends on the size of the text in jp-currentTime and jp-duration */ }\n  .yuanplayer-bluemonday-player .yuan-interface .yuan-controls {\n    margin: 0;\n    padding: 0;\n    overflow: hidden; }\n  .yuanplayer-bluemonday-player .yuan-controls button {\n    display: block;\n    float: left;\n    overflow: hidden;\n    text-indent: -9999px;\n    border: none;\n    cursor: pointer; }\n  .yuanplayer-bluemonday-player .yuan-play {\n    width: 40px;\n    height: 40px; }\n  .yuanplayer-bluemonday-player .yuan-play,\n  .yuanplayer-bluemonday-player .yuan-stop,\n  .yuanplayer-bluemonday-player .yuan-previous,\n  .yuanplayer-bluemonday-player .yuan-next,\n  .yuanplayer-bluemonday-player .yuan-seek-bar,\n  .yuanplayer-bluemonday-player .yuan-play-bar,\n  .yuanplayer-bluemonday-player .yuan-mute,\n  .yuanplayer-bluemonday-player .yuan-volume-max,\n  .yuanplayer-bluemonday-player .yuan-volume-bar,\n  .yuanplayer-bluemonday-player .yuan-volume-bar-value,\n  .yuanplayer-bluemonday-player .yuan-full-screen,\n  .yuanplayer-bluemonday-player .yuan-repeat,\n  .yuanplayer-bluemonday-player .yuan-repeat-one,\n  .yuanplayer-bluemonday-player .yuan-shuffle {\n    background-image: url(\"data:image/png;base64,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\");\n    background-repeat: no-repeat; }\n  .yuanplayer-bluemonday-player .yuan-play {\n    background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-play:focus {\n    background-position: -41px 0; }\n  .yuanplayer-bluemonday-player.yuan-state-playing .yuan-play {\n    background-position: 0 -42px; }\n    .yuanplayer-bluemonday-player.yuan-state-playing .yuan-play:focus {\n      background-position: -41px -42px; }\n  .yuanplayer-bluemonday-player .yuan-stop, .yuanplayer-bluemonday-player .yuan-previous, .yuanplayer-bluemonday-player .yuan-next {\n    width: 28px;\n    height: 28px;\n    margin-top: 6px; }\n  .yuanplayer-bluemonday-player .yuan-stop {\n    background-position: 0 -83px;\n    margin-left: 10px; }\n  .yuanplayer-bluemonday-player .yuan-stop:focus {\n    background-position: -29px -83px; }\n  .yuanplayer-bluemonday-player .yuan-previous {\n    background-position: 0 -112px; }\n  .yuanplayer-bluemonday-player .yuan-previous:focus {\n    background-position: -29px -112px; }\n  .yuanplayer-bluemonday-player .yuan-next {\n    background-position: 0 -141px; }\n  .yuanplayer-bluemonday-player .yuan-next:focus {\n    background-position: -29px -141px; }\n  .yuanplayer-bluemonday-player .yuan-progress {\n    overflow: hidden;\n    background-color: #ddd;\n    width: 100%;\n    height: 0.6rem; }\n  .yuanplayer-bluemonday-player .yuan-seek-bar {\n    background-position: 0 -202px;\n    background-repeat: repeat-x;\n    width: 0px;\n    height: 100%;\n    cursor: pointer; }\n  .yuanplayer-bluemonday-player .yuan-play-bar {\n    background-position: 0 -218px;\n    background-repeat: repeat-x;\n    width: 0px;\n    height: 100%; }\n  .yuanplayer-bluemonday-player .yuan-seeking-bg {\n    background: url(\"data:image/gif;base64,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\"); }\n  .yuanplayer-bluemonday-player.yuan-state-no-volume .yuan-volume-controls {\n    display: none; }\n  .yuanplayer-bluemonday-player .yuan-volume-controls {\n    display: none; }\n    .yuanplayer-bluemonday-player .yuan-volume-controls > * {\n      float: left; }\n  .yuanplayer-bluemonday-player .yuan-audio-stream .yuan-volume-controls {\n    left: 70px; }\n  .yuanplayer-bluemonday-player .yuan-volume-controls button {\n    display: block;\n    overflow: hidden;\n    text-indent: -9999px;\n    border: none;\n    cursor: pointer; }\n  .yuanplayer-bluemonday-player .yuan-mute,\n  .yuanplayer-bluemonday-player .yuan-volume-max {\n    width: 18px;\n    height: 15px; }\n  .yuanplayer-bluemonday-player .yuan-mute {\n    background-position: 0 -170px; }\n  .yuanplayer-bluemonday-player .yuan-mute:focus {\n    background-position: -19px -170px; }\n  .yuanplayer-bluemonday-player.yuan-state-muted .yuan-mute {\n    background-position: -60px -170px; }\n    .yuanplayer-bluemonday-player.yuan-state-muted .yuan-mute:focus {\n      background-position: -79px -170px; }\n  .yuanplayer-bluemonday-player.yuan-state-muted .yuan-video .yuan-mute {\n    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgOTYgOTYwIDk2MCIgd2lkdGg9IjI0IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNzkyIDEwMDAgNjcxIDg3OXEtMjUgMTYtNTMgMjcuNVQ1NjAgOTI1di04MnExNC01IDI3LjUtMTB0MjUuNS0xMkw0ODAgNjg4djIwOEwyODAgNjk2SDEyMFY0NTZoMTI4TDU2IDI2NGw1Ni01NiA3MzYgNzM2LTU2IDU2Wm0tOC0yMzItNTgtNThxMTctMzEgMjUuNS02NXQ4LjUtNzBxMC05NC01NS0xNjhUNTYwIDMwN3YtODJxMTI0IDI4IDIwMiAxMjUuNVQ4NDAgNTc1cTAgNTMtMTQuNSAxMDJUNzg0IDc2OFpNNjUwIDYzNGwtOTAtOTBWNDE0cTQ3IDIyIDczLjUgNjZ0MjYuNSA5NnEwIDE1LTIuNSAyOS41VDY1MCA2MzRaTTQ4MCA0NjQgMzc2IDM2MGwxMDQtMTA0djIwOFptLTgwIDIzOHYtOTRsLTcyLTcySDIwMHY4MGgxMTRsODYgODZabS0zNi0xMzBaIi8+PC9zdmc+);\n    background-position: 0 0; }\n    .yuanplayer-bluemonday-player.yuan-state-muted .yuan-video .yuan-mute:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-volume-max {\n    background-position: 0 -186px;\n    margin-left: 5px; }\n  .yuanplayer-bluemonday-player .yuan-volume-max:focus {\n    background-position: -19px -186px; }\n  .yuanplayer-bluemonday-player .yuan-volume-bar {\n    overflow: hidden;\n    background-position: 0 -250px;\n    background-repeat: repeat-x;\n    margin-top: 5px;\n    width: 46px;\n    height: 5px;\n    cursor: pointer; }\n  .yuanplayer-bluemonday-player .yuan-volume-bar-value {\n    background-position: 0 -256px;\n    background-repeat: repeat-x;\n    width: 0px;\n    height: 5px; }\n  .yuanplayer-bluemonday-player .yuan-current-time,\n  .yuanplayer-bluemonday-player .yuan-duration {\n    font-size: .64em;\n    font-style: oblique;\n    line-height: 40px; }\n  .yuanplayer-bluemonday-player .yuan-current-time {\n    display: inline;\n    cursor: default; }\n  .yuanplayer-bluemonday-player .yuan-duration {\n    display: inline;\n    text-align: right;\n    cursor: pointer;\n    margin-left: 1rem; }\n  .yuanplayer-bluemonday-player .yuan-jplayer audio,\n  .yuanplayer-bluemonday-player .yuan-jplayer {\n    width: 0px;\n    height: 0px; }\n  .yuanplayer-bluemonday-player .yuan-jplayer {\n    background-color: #000000; }\n  .yuanplayer-bluemonday-player .yuan-toggles {\n    padding: 0;\n    margin: 0 auto;\n    /*\r\n    overflow: hidden;\r\n    */ }\n  .yuanplayer-bluemonday-player .yuan-audio .yuan-type-single .yuan-toggles {\n    width: 25px; }\n  .yuanplayer-bluemonday-player .yuan-audio .yuan-toggles {\n    margin: 0;\n    height: 40px; }\n  .yuanplayer-bluemonday-player .yuan-controls-row {\n    width: 100%;\n    margin-top: .6rem; }\n  .yuanplayer-bluemonday-player .yuan-toggles button {\n    display: inline-block;\n    width: 22px;\n    height: 18px;\n    text-indent: -9999px;\n    line-height: 100%;\n    /* need this for IE6 */\n    border: none;\n    cursor: pointer;\n    margin-top: 11px; }\n  .yuanplayer-bluemonday-player .yuan-toggles .yuan-full-screen {\n    display: none; }\n  .yuanplayer-bluemonday-player .yuan-toggles .yuan-closed-caption {\n    display: none; }\n  .yuanplayer-bluemonday-player.yuan-state-full-screen {\n    position: fixed;\n    left: 0px;\n    bottom: 0;\n    width: 100%; }\n  .yuanplayer-bluemonday-player .yuan-repeat {\n    background-position: 0 -290px; }\n  .yuanplayer-bluemonday-player .yuan-repeat:focus {\n    background-position: -30px -290px; }\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-repeat {\n    background-position: -60px -290px; }\n    .yuanplayer-bluemonday-player.yuan-state-looped .yuan-repeat:focus {\n      background-position: -90px -290px; }\n  .yuanplayer-bluemonday-player .yuan-repeat-one {\n    background-position: -120px -290px; }\n    .yuanplayer-bluemonday-player .yuan-repeat-one:focus {\n      background-position-x: -150px; }\n  .yuanplayer-bluemonday-player.yuan-state-looped .yuan-repeat-one {\n    background-position-x: -180px; }\n    .yuanplayer-bluemonday-player.yuan-state-looped .yuan-repeat-one:focus {\n      background-position-x: -210px; }\n  .yuanplayer-bluemonday-player .yuan-shuffle {\n    background-position: 0 -270px;\n    margin-left: 5px; }\n  .yuanplayer-bluemonday-player .yuan-shuffle:focus {\n    background-position: -30px -270px; }\n  .yuanplayer-bluemonday-player.yuan-state-shuffled .yuan-shuffle {\n    background-position: -60px -270px; }\n    .yuanplayer-bluemonday-player.yuan-state-shuffled .yuan-shuffle:focus {\n      background-position: -90px -270px; }\n  .yuanplayer-bluemonday-player.yuan-state-shuffled .yuan-video .yuan-shuffle {\n    background-color: gray;\n    background-position: 0 0; }\n    .yuanplayer-bluemonday-player.yuan-state-shuffled .yuan-video .yuan-shuffle:focus {\n      background-position: 0 0; }\n  .yuanplayer-bluemonday-player .yuan-no-solution {\n    padding: 5px;\n    font-size: .8em;\n    background-color: #eee;\n    border: 2px solid #009be3;\n    color: #000;\n    display: none; }\n  .yuanplayer-bluemonday-player .yuan-no-solution a {\n    color: #000; }\n  .yuanplayer-bluemonday-player .yuan-no-solution span {\n    font-size: 1em;\n    display: block;\n    text-align: center;\n    font-weight: bold; }\n\n/* @end */\n@media screen and (max-width: 480px) {\n  .yuanplayer-bluemonday-player .yuan-volume-bar {\n    left: 12px; }\n  .yuanplayer-bluemonday-player .yuan-stop {\n    margin-left: 0; }\n  .yuanplayer-bluemonday-player .yuan-current-time {\n    width: 50px; }\n  .yuanplayer-bluemonday-player .yuan-duration {\n    width: 40px; }\n  .yuanplayer-bluemonday-player .yuan-volume-max {\n    left: 60px; } }\n\n@media screen and (max-width: 320px) {\n  .yuanplayer-bluemonday-player .yuan-controls .yuan-stop {\n    display: none; } }\n\n@media screen and (min-width: 810px) {\n  .yuanplayer-bluemonday-player .yuan-volume-controls {\n    display: block; } }\n\n.yuan-state-closed-caption .yuanplayer-bluemonday-player .yuan-toggles {\n  overflow: visible; }\n\n.cclist ul {\n  list-style: none;\n  padding: 5px;\n  margin: 0;\n  min-width: 100px; }\n  .cclist ul label {\n    display: block; }\n    .cclist ul label input[type=\"radio\"] {\n      float: right;\n      display: none; }\n      .cclist ul label input[type=\"radio\"]:checked {\n        display: inline-block; }\n";
n(css$2,{});

/**
 * The higher-order function receives YuanPlayerUI class as the argument
 * and returns a new class which supports GUI.
 * @param Base - YuanPlayerUI class
 * @returns - A new class
 */
function getClass$2(Base) {
    return /** @class */ (function (_super) {
        __extends(YuanPlayer, _super);
        function YuanPlayer(options) {
            var _this = this;
            options.useStateClassSkin = true;
            options.stateClass = {
                seeking: 'yuan-seeking-bg'
            };
            _this = _super.call(this, options) || this;
            _this.updateGUI = function () {
                var _a;
                if (!_this.mediaElement)
                    return false;
                var mediaType = _this.mediaElement.tagName.toLowerCase();
                var div = _this.container.querySelector(_this.cssSelectorAncestor);
                var con = div.querySelector(".yuan-".concat(mediaType));
                if (con)
                    return;
                div.innerHTML = _this.mediaElement.tagName === 'AUDIO' ? anonymous$3() : anonymous$2();
                _this.updateVolume();
                _this.updateFullScreenButton();
                // If current browser support flex wrapping, use flexbox layout
                // Some old browsers does not support this feature, such as Android 4.2 default browsers
                if (document.createElement("p").style.flexWrap === '') {
                    (_a = div.querySelector('.yuan-interface')) === null || _a === void 0 ? void 0 : _a.classList.add('flexbox');
                }
            };
            _this.on('setmedia', _this.updateGUI);
            return _this;
        }
        YuanPlayer.prototype.onReady = function () {
            var _this = this;
            var _a;
            var div = document.createElement('div');
            if (this.cssSelectorAncestor) {
                var substr = this.cssSelectorAncestor.substring(1);
                if (this.cssSelectorAncestor.indexOf('#') === 0) {
                    div.id = substr;
                }
                else {
                    div.classList.add(substr);
                }
            }
            div.classList.add('yuanplayer-bluemonday-player');
            div.innerHTML = this.mediaElement.tagName === 'AUDIO' ? anonymous$3() : anonymous$2();
            //this.container.appendChild(div);
            this.mediaElement.parentNode.appendChild(div);
            this.mediaElement.parentNode.style.position = 'relative';
            // If current browser support flex wrapping, use flexbox layout
            // Some old browsers does not support this feature, such as Android 4.2 default browsers
            if (document.createElement("p").style.flexWrap === '') {
                (_a = div.querySelector('.yuan-interface')) === null || _a === void 0 ? void 0 : _a.classList.add('flexbox');
            }
            this.addEventListener(div, 'click', function (e) {
                var div = _this.container.querySelector(_this.cssSelectorAncestor);
                var target = e.target;
                if (target.tagName === 'INPUT') {
                    var value = target.value;
                    _this.setActiveCC(value);
                    var cclist = div.querySelector('.cclist');
                    cclist.innerHTML = '';
                    _this.updateCCButton();
                }
                else if (_this.isMatchedWithSelector(target, '.yuan-closed-caption')) {
                    _this.showList();
                }
            });
        };
        YuanPlayer.prototype.showList = function () {
            var list = this.getCCList();
            var ul = document.createElement('ul');
            list.forEach(function (item) {
                var li = document.createElement('li');
                var label = document.createElement('label');
                label.textContent = item.label;
                var radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'cc';
                radio.value = item.label;
                radio.checked = item.checked;
                label.appendChild(radio);
                li.appendChild(label);
                ul.appendChild(li);
            });
            var cclist = this.container.querySelector('.cclist');
            cclist.innerHTML = "";
            cclist.appendChild(ul);
        };
        return YuanPlayer;
    }(Base));
}

var innerText = function (element, text) {
    (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
};
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Test whether the element would be selected by the specified CSS selector.
 * @param element - An element
 * @param selectors - A string containing valid CSS selectors to test the Element against.
 * @returns
 */
function matches(element, selectors) {
    try {
        if (element.matches) {
            return element.matches(selectors);
        }
        else if (element.msMatchesSelector) {
            return element.msMatchesSelector(selectors);
        }
        else if (element.webkitMatchesSelector) {
            return element.webkitMatchesSelector(selectors);
        }
    }
    catch (e) {
        return false;
    }
    return false;
}

var css$1 = ".yuanplayer-bluemonday-lyric {\n  box-sizing: border-box;\n  margin-top: 0;\n  text-align: center;\n  height: 100px;\n  overflow: hidden;\n  padding-top: 50px;\n  margin-left: auto;\n  margin-right: auto;\n  background: #ccc;\n  font-size: 14px;\n  /* Make all lyric items relative to the container */ }\n  .yuanplayer-bluemonday-lyric.empty {\n    height: auto;\n    padding-top: 0; }\n  .yuanplayer-bluemonday-lyric div {\n    margin-bottom: 5px;\n    min-height: 1em;\n    /* Make the empty lyric container visible. */ }\n  .yuanplayer-bluemonday-lyric .lyric-wrapcontainer {\n    position: relative; }\n  .yuanplayer-bluemonday-lyric .highlight {\n    font-weight: bold;\n    color: #0d88c1; }\n";
n(css$1,{});

function getClass$1(Base) {
    return /** @class */ (function (_super) {
        __extends(YuanPlayerLyric, _super);
        function YuanPlayerLyric(otpions) {
            var _this = this;
            otpions.cssSelectorAncestor = '.yuanplayer-bluemonday-lyric';
            _this = _super.call(this, otpions) || this;
            _this.addContainer();
            return _this;
        }
        YuanPlayerLyric.prototype.addContainer = function () {
            if (typeof this.lyric === 'string') {
                if (!this.container.querySelector('.yuanplayer-bluemonday-lyric')) {
                    // Add container for lyric
                    var lyricDiv = document.createElement('div');
                    var wrapContainer = document.createElement('div');
                    lyricDiv.classList.add('yuanplayer-bluemonday-lyric');
                    lyricDiv.classList.add(this.stateClass.empty);
                    wrapContainer.classList.add('lyric-wrapcontainer');
                    this.container.appendChild(lyricDiv);
                    lyricDiv.appendChild(wrapContainer);
                    var emptyElement = document.createElement('div');
                    emptyElement.classList.add(this.cssSelector.noContent.substring(1));
                    emptyElement.textContent = 'No lyric available.';
                    lyricDiv.appendChild(emptyElement);
                }
            }
        };
        YuanPlayerLyric.prototype.addLyricItems = function (items) {
            var wrapContainer = this.container.querySelector('.lyric-wrapcontainer');
            for (var i = 0, l = items.length; i < l; i++) {
                var div = document.createElement('div');
                div.classList.add(this.cssSelector.item.substring(1));
                var content = items[i].split(']')[1];
                innerText(div, content);
                wrapContainer === null || wrapContainer === void 0 ? void 0 : wrapContainer.appendChild(div);
            }
        };
        return YuanPlayerLyric;
    }(Base));
}

function anonymous$1(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}var __line = 1
  , __lines = "<div class=\"yuan-type-playlist\">\r\n  <div class=\"yuan-playlist\">\r\n    <ul style=\"display: block;\">\r\n      <% locals.tracks.forEach(function(track, index){ %>\r\n        <li class=\"yuan-playlist-item\">\r\n          <div>\r\n            <a href=\"javascript:;\" class=\"yuan-playlist-item-remove\" style=\"display: none;\">×</a>\r\n            <a href=\"javascript:;\" data-index=\"<%= index %>\" data-trackid=\"<%= track.id %>\" tabindex=\"0\"><%= track.title %></a>\r\n          </div>\r\n        </li>\r\n      <% }); %>\r\n    </ul>\r\n    <div class=\"yuan-playlist-empty\" style=\"display: <%= locals.tracks.length ? 'none' : 'block'  %>;\">The playlist is empty.</div>\r\n  </div>\r\n</div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s; }
    ; __append("<div class=\"yuan-type-playlist\">\r\n  <div class=\"yuan-playlist\">\r\n    <ul style=\"display: block;\">\r\n      ")
    ; __line = 4
    ;  locals.tracks.forEach(function(track, index){ 
    ; __append("\r\n        <li class=\"yuan-playlist-item\">\r\n          <div>\r\n            <a href=\"javascript:;\" class=\"yuan-playlist-item-remove\" style=\"display: none;\">×</a>\r\n            <a href=\"javascript:;\" data-index=\"")
    ; __line = 8
    ; __append(escapeFn( index ))
    ; __append("\" data-trackid=\"")
    ; __append(escapeFn( track.id ))
    ; __append("\" tabindex=\"0\">")
    ; __append(escapeFn( track.title ))
    ; __append("</a>\r\n          </div>\r\n        </li>\r\n      ")
    ; __line = 11
    ;  }); 
    ; __append("\r\n    </ul>\r\n    <div class=\"yuan-playlist-empty\" style=\"display: ")
    ; __line = 13
    ; __append(escapeFn( locals.tracks.length ? 'none' : 'block'  ))
    ; __append(";\">The playlist is empty.</div>\r\n  </div>\r\n</div>")
    ; __line = 15;
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

function anonymous(locals, escapeFn, include, rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}var __line = 1
  , __lines = "  <div>\r\n    <a href=\"javascript:;\" class=\"yuan-playlist-item-remove\" style=\"display: none;\">×</a>\r\n    <a href=\"javascript:;\" data-index=\"<%= locals.index %>\" data-trackid=\"<%= locals.track.id %>\" tabindex=\"0\"><%= locals.track.title %></a>\r\n  </div>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s; }
    ; __append("  <div>\r\n    <a href=\"javascript:;\" class=\"yuan-playlist-item-remove\" style=\"display: none;\">×</a>\r\n    <a href=\"javascript:;\" data-index=\"")
    ; __line = 3
    ; __append(escapeFn( locals.index ))
    ; __append("\" data-trackid=\"")
    ; __append(escapeFn( locals.track.id ))
    ; __append("\" tabindex=\"0\">")
    ; __append(escapeFn( locals.track.title ))
    ; __append("</a>\r\n  </div>")
    ; __line = 4;
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

var css = "/* @group playlist */\n.yuanplayer-bluemonday-playlist {\n  /* Note that the first-child (IE6) and last-child (IE6/7/8) selectors do not work on IE */ }\n  .yuanplayer-bluemonday-playlist .yuan-details {\n    font-weight: bold;\n    text-align: center;\n    cursor: default; }\n  .yuanplayer-bluemonday-playlist .yuan-details,\n  .yuanplayer-bluemonday-playlist .yuan-playlist {\n    border-radius: 0 0 .6rem 0.6rem;\n    width: 100%;\n    background-color: #ccc;\n    border-top: 1px solid #009be3; }\n  .yuanplayer-bluemonday-playlist .yuan-type-single .yuan-details,\n  .yuanplayer-bluemonday-playlist .yuan-type-playlist .yuan-details {\n    border-top: none; }\n  .yuanplayer-bluemonday-playlist .yuan-details .yuan-title {\n    margin: 0;\n    padding: 5px 20px;\n    font-size: .72em;\n    font-weight: bold; }\n  .yuanplayer-bluemonday-playlist .yuan-playlist ul {\n    list-style-type: none;\n    margin: 0;\n    padding: 0 20px;\n    font-size: .72em; }\n  .yuanplayer-bluemonday-playlist .yuan-playlist li {\n    padding: .6rem 0 .6rem 1.5rem;\n    border-bottom: 1px solid #eee; }\n  .yuanplayer-bluemonday-playlist .yuan-playlist li div {\n    display: inline; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist li:last-child {\n    border-bottom: none; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist li.yuan-playlist-current {\n    list-style-type: square;\n    list-style-position: inside;\n    padding-left: 7px; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist a {\n    color: #333;\n    text-decoration: none; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist a:hover {\n    color: #0d88c1; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist .yuan-playlist-current a {\n    color: #0d88c1 !important; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist a.yuan-playlist-item-remove {\n    float: right;\n    display: inline;\n    text-align: right;\n    margin-right: 10px;\n    font-weight: bold;\n    color: #666; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist a.yuan-playlist-item-remove:hover {\n    color: #0d88c1; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist li a.yuan-playlist-item-remove {\n    display: inline !important; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist span.yuan-free-media {\n    float: right;\n    display: inline;\n    text-align: right;\n    margin-right: 10px; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist span.yuan-free-media a {\n    color: #666; }\n  .yuanplayer-bluemonday-playlist div.yuan-type-playlist div.yuan-playlist span.yuan-free-media a:hover {\n    color: #0d88c1; }\n  .yuanplayer-bluemonday-playlist span.yuan-artist {\n    font-size: .8em;\n    color: #666; }\n  .yuanplayer-bluemonday-playlist .yuan-playlist-empty {\n    font-size: 14px;\n    font-weight: normal;\n    text-align: center;\n    padding: 10px; }\n\n.yuan-state-full-screen .yuanplayer-bluemonday-playlist {\n  display: none; }\n\n/* @end */\n";
n(css,{});

function getClass(Base) {
    return /** @class */ (function (_super) {
        __extends(YuanPlayerPlayList, _super);
        function YuanPlayerPlayList(options) {
            var _this = this;
            options.cssSelectorAncestor = "#yuanplayer-bluemonday-playlist_".concat(uuidv4());
            _this = _super.call(this, options) || this;
            var player = _this.player;
            _this.addEventListener(_this.container, 'click', function (e) {
                var _a;
                var target = e.target;
                if (player.cssSelector.repeat && matches(target, (_a = player.cssSelector) === null || _a === void 0 ? void 0 : _a.repeat)) {
                    _this.switchModes();
                }
            });
            return _this;
        }
        YuanPlayerPlayList.prototype.onListUpdated = function () {
            this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = anonymous$1({ tracks: this.list });
            this.updateList();
        };
        YuanPlayerPlayList.prototype.onAdd = function (trackItem) {
            var ul = this.container.querySelector('.yuan-playlist ul');
            var li = document.createElement('li');
            li.classList.add('yuan-playlist-item');
            li.innerHTML = anonymous({ index: this.list.length - 1, track: trackItem });
            ul.appendChild(li);
            this.updateList();
        };
        YuanPlayerPlayList.prototype.onRemove = function () {
            this.updateList();
        };
        YuanPlayerPlayList.prototype.onReady = function () {
            var div = document.createElement('div');
            div.id = this.cssSelectorAncestor.replace('#', '');
            div.className = 'yuanplayer-bluemonday-playlist';
            div.innerHTML = anonymous$1({ tracks: this.list });
            this.container.appendChild(div);
        };
        YuanPlayerPlayList.prototype.updateList = function () {
            if (this.list.length === 0) {
                this.container.querySelector('.yuan-playlist-empty').style.display = 'block';
            }
            else {
                this.container.querySelector('.yuan-playlist-empty').style.display = 'none';
            }
        };
        return YuanPlayerPlayList;
    }(Base));
}

var obj = {
    Player: getClass$2,
    Lyric: getClass$1,
    PlayList: getClass
};

module.exports = obj;
