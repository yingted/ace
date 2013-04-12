/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var reservedKeywords = exports.reservedKeywords = (
        'addressint|all|and|array|asm|assert|begin|bind|bits|body|boolean|break|by|case|char|cheat|checked|class|close|collection|condition|const|decreasing|def|deferred|div|else|elsif|end|enum|exit|export|external|false|fcn|flexible|for|fork|forward|free|function|get|handler|if|implement|import|in|include|inherit|init|int|int1|int2|int4|invariant|label|loop|mod|module|monitor|nat|nat1|nat2|nat4|new|not|objectclass|of|opaque|open|or|packed|pause|pervasive|pointer|post|pre|priority|proc|procedure|process|put|quit|read|real|real4|real8|record|register|rem|result|return|seek|self|set|shl|shr|signal|skip|string|tag|tell|then|timeout|to|true|type|unchecked|union|unqualified|var|wait|when|write|xor'
    );

var languageConstructs = exports.languageConstructs = (
    'abs|addr|arctan|arctand|anyclass|break|buttonchoose|buttonmoved|buttonwait|ceil|chr|clock|cls|color|colorback|colour|colourback|cos|cosd|date|delay|drawarc|drawbox|drawdot|drawfill|drawfillarc|drawfillbox|drawfillmapleleaf|drawfilloval|drawfillpolygon|drawfillstar|drawline|drawmapleleaf|drawoval|drawpic|drawpolygon|drawstar|empty|eof|erealstr|exp|fetcharg|floor|frealstr|getch|getchar|getenv|getpid|getpriority|hasch|index|intreal|intstr|length|ln|locate|locatexy|lower|max|maxcol|maxcolor|maxcolour|maxint|maxnat|maxrow|maxx|maxy|min|minint|minnat|mousehide|mouseshow|mousewhere|nargs|natreal|natstr|nil|ord|palette|play|playdone|pred|rand|randint|randnext|randomize|randseed|realstr|repeat|round|setpriority|setscreen|sign|simutime|sin|sind|sizeof|sizepic|sound|sqrt|strint|strintok|strnat|strnatok|strreal|strrealok|succ|sysclock|sysexit|system|takepic|time|upper|wallclock|whatcol|whatcolor|whatcolorback|whatcolour|whatcolourback|whatdotcolor|whatdotcolour|whatpalette|whatrow|whattextchar|whattextcolor|whattextcolorback|whattextcolour|whattextcolourback'
);

var TuringHighlightRules = function() {
    var keywordMapper = this.createKeywordMapper({
        "keyword": reservedKeywords,
        "support.function.builtin": languageConstructs,
    }, "identifier");

    var integer = "(?:\\d*#)?(?:(?:[1-9]\\d*)|(?:0))";

    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" +  intPart + ")" + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";

    var variableName = "[a-zA-Z_][a-zA-Z0-9_]*";
    var variable = variable; // "(?:(?:\\$" + variableName + ")|(?:" + variableName + "=))";

    var builtinVariable = "(?:black|blue|brightblue|brightcyan|brightgreen|brightmagenta|brightpurple|brightred|brightwhite|brown|brushErrorBase|cdMaxNumColors|cdMaxNumColours|cdMaxNumPages|cdScreenHeight|cdScreenWidth|clLanguageVersion|clMaxNumDirStreams|clMaxNumRunTimeArgs|clMaxNumStreams|clRelease|cmFPU|cmOS|cmProcessor|colorbg|colourbg|colorfg|colourfg|configErrorBase|cyan|darkgray|darkgrey|defFontID|defWinID|dirErrorBase|drawErrorBase|errWinID|fileErrorBase|fontDefaultID|fontErrorBase|fsysErrorBase|generalErrorBase|gray|green|grey|guiErrorBase|joystick1|joystick2|lexErrorBase|magenta|mouseErrorBase|musicErrorBase|penErrorBase|picXor|placeCenterDisplay|placeCentreWindow|printerErrorBase|purple|red|rgbErrorBase|spriteErrorBase|streamErrorBase|textErrorBase|timeErrorBase|unixSignalToException|viewErrorBase|white|windowErrorBase|yellow)";

    var func = "(?:" + variableName + "\\s*\\(\\))";

    this.$rules = {
        "start" : [ {
            token : ["text", "comment"],
            regex : /(^|\s)(%.*)$/
        }, {
            token : "comment", // multi line comment
            regex : /\/\*/,
            next : "comment"
        }, {
            token : "string",           // " string
            regex : '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "variable.language",
            regex : builtinVariable
        }, {
            token : "variable",
            regex : variable
        }, {
            token : "support.function",
            regex : func
        }, {
            token : "string",           // ' char
            regex : "'(?:[^\\\\]|\\\\.)?'"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "[-+*/^@#&|~<,:=>;]"
        }, {
            token : "paren.lparen",
            regex : "\\("
        }, {
            token : "paren.rparen",
            regex : "\\)"
        } ],
        "comment" : [
            {token : "comment", regex : "\\*\\/", next : "no_regex"},
            {defaultToken : "comment"}
        ]
    };
};

oop.inherits(TuringHighlightRules, TextHighlightRules);

exports.TuringHighlightRules = TuringHighlightRules;
});
