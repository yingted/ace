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
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var GeorgeHighlightRules = function() {

    var keywordMapper = this.createKeywordMapper({
        "support.function": "dom|ran",
        "support.constant": "empty|univ|N",
        "support.type": "schema|begin|pred|end|for|some|forall|exists|assume",
    }, "text", true);

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start : [{
            token: "directive.meta",
            regex: "^#[uaq]\\b",
            next: "names",
        }, {
            token: "keyword.operator",
            regex: "^#check (?:NONE|PRED|ND|TP|PROP|Z|PC)",
        }, {
            token: "comment",
            regex: "%[^\n]*",
        }, {
            token: "paren.lparen",
            regex: "\\(\\||[[({]"
        }, {
            token: "paren.rparen",
            regex: "\\|\\)|[\\])}]"
        }, {
            token: "label",
            regex: "^\\s*(?:[0-9]+|[a-zA-Z_][a-zA-Z_0-9]*)(?=\\))",
            next: "labelend",
        }, {
            token: "constant.numeric",
            regex: "[0-9]+",
        }, {
            token: "operator.by",
            regex: "by",
            next: "rulename",
        }, {
            token: "keyword.control",
            regex: "<==>|\\|="
        }, {
            token: "keyword.operator",
            regex: "!|'|&|\\*|\\-|\\+|~|==|!=|<=|>=|=>|<=>|<|>|!|&&|\\|\\||\\||;|<\\||\\|>|<-\\||\\|->|\\(\\+\\)"
        }, {
            token: "punctuation.operator",
            regex: ":|,|;;"
        }, {
            token: keywordMapper,
            regex: "[0-9]+|[a-zA-Z_][a-zA-Z_0-9]*",
        }],
        rulename: [{
            token: "keyword.tp",
            regex: "comm|distr|assoc|dm|lem|neg|impl|equiv|idemp|contrapos|simp[12]|magic",
            next: "start",
        }, {
            token: "keyword.nd",
            regex: "and_i|and_e|or_i|or_e|lem|cases|imp_i|imp_e|raa|not_e|not_not_i|not_not_e|iff_i|iff_e|iff_mp|trans|forall_e|forall_i|exists_e|exists_i",
            next: "ndon",
        }, {
            token: "text",
            regex: "$",
            next: "start",
        }],
        ndon: [{
            token: "operator.on",
            regex: "\\bon\\b",
            next: "ndlabels",
        }, {
            token: "text",
            regex: "$",
            next: "start",
        }],
        ndlabels: [{
            token: "label",
            regex: "(?:[0-9]+|[a-zA-Z_][a-zA-Z_0-9]*)\\s*$",
            next: "start",
        }, {
            token: "label",
            regex: "[0-9]+|[a-zA-Z_][a-zA-Z_0-9]*",
        }, {
            token: "punctuation.operator",
            regex: "[-,]",
        }, {
            token: "text",
            regex: "$",
            next: "start",
        }],
        labelend: [{
            token: "punctuation.labelend",
            regex: "\\)",
            next: "start",
        }],
        names: [{
            token: "string",
            regex: "\\w+",
            next: "names",
        }, {
            token: "text",
            regex: "$",
            next: "start",
        }]
    };

    this.normalizeRules();
};

oop.inherits(GeorgeHighlightRules, TextHighlightRules);

exports.GeorgeHighlightRules = GeorgeHighlightRules;

});
