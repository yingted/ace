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

var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;
var CstyleBehaviour = require("./cstyle").CstyleBehaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var checkDirective = /^#check /;
var labelDef = /^\s*(?:([0-9]+)|[a-z_][a-z_0-9]*)\)/i;
var labelRef = /\bby\s+[a-z_0-9]+\s+on\s+([-, 0-9]+)/i;

var GeorgeBehaviour = function () {

    this.inherit(CstyleBehaviour);

    this.add("parens", "insertion", function(state, action, editor, session, text) {
        if (text === ')') {
            var selection = editor.getSelectionRange();
            var doc = session.doc;
            if (doc.getTextRange(selection) === '') {
                var lines = doc.getAllLines();
                if (/\S/.test(lines[selection.start.row].substring(0, selection.end.column)))
                    return;
                var firstRow = selection.start.row - 1;
                var labels = {};
                while (firstRow >= 0 && !checkDirective.test(lines[firstRow]))
                    --firstRow;
                if (firstRow < 0)
                    return;
                var row = firstRow + 1;
                for (; row < selection.start.row && !checkDirective.test(lines[row]); ++row) {
                    var m = lines[row].match(labelDef);
                    if (m && m[1])
                        labels[parseInt(m[1])] = true;
                }
                var nextLabel = 1;
                while (labels[nextLabel])
                    ++nextLabel;
                text = nextLabel + text + ' ';
                for (; row < lines.length && !checkDirective.test(lines[row]); ++row) {
                    var m = lines[row].match(labelDef);
                    if (m && m[1])
                        labels[parseInt(m[1])] = true;
                }
                for (var lastLabel = nextLabel; labels[lastLabel]; ++lastLabel);
                for (row = firstRow + 1; row < lines.length && !checkDirective.test(lines[row]); ++row) {
                    var m = lines[row].match(labelDef);
                    if (m && m[1]) {
                        var curLabel = parseInt(m[1]);
                        if ((curLabel + '' == m[1]) && nextLabel <= curLabel && curLabel < lastLabel) {
                            var label = curLabel + '';
                            var ind = lines[row].indexOf(label);
                            doc.replace({start: {row: row, column: ind}, end: {row: row, column: ind + label.length}}, curLabel + 1 + '');
							lines = doc.getAllLines();
                        }
                    }
                    var m = labelRef.exec(lines[row]);
                    if (m && m[1]) {
                        var replacements = m[1].replace(/[0-9]+/g, function(num) {
                            var curLabel = parseInt(num);
                            if ((curLabel + '' == num) && nextLabel <= curLabel && curLabel < lastLabel)
                                return curLabel + 1;
                            return num;
                        });
                        var ind = m.index + m[0].length - m[1].length;
                        doc.replace({start: {row: row, column: ind}, end: {row: row, column: ind + m[1].length}}, replacements);
                    }
                }
                return {
                    text: text,
                    selection: [text.length, text.length],
                };
            }
        }
    });

}
oop.inherits(GeorgeBehaviour, CstyleBehaviour);

exports.GeorgeBehaviour = GeorgeBehaviour;
});
