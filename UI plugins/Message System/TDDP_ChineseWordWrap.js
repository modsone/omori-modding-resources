//=============================================================================
// Chinese Word Wrap
//=============================================================================
/*:
 * @plugindesc 中文对话按指定字符数自动换行 仅对对话文本生效
 * @author NirvanaCeleste
 *
 * @param Max Characters Per Line
 * @desc 每行最大字符数（中文字符算1个）默认31
 * @default 31
 *
 * @help
 * 仅处理对话文本
 * 自动识别并保留 RPG Maker 转义序列 不将其计入字符数
 * 保留原有手动换行符 且手动换行会重置字符计数
 *
 *  将本插件放入 js/plugins 文件夹
 *  在插件管理器中启用，并设置每行最大字符数（默认31）
 *  无需其他操作，所有 Show Message 命令将自动应用换行
 *
 * Max Characters Per Line    每行允许的最大字符数。达到此数值时自动换行
 *                            中文字符、英文字母、标点符号均计为1个字符
 *                            默认值：31
 *  开启换行（默认31字）      ChineseWrap on
 *  开启换行（自定义20字）    ChineseWrap on 20
 *  关闭换行（恢复默认）      ChineseWrap off
 *
 *   本插件与 YEP_MessageCore 的 Word Wrapping 功能冲突 插件内部已自动处理
 *   启用中文换行时会临时关闭 YEP 的 Word Wrap 处理完后恢复，无需手动干预
 */
var Imported = Imported || {};
Imported.TDDP_ChineseWordWrap = true;

(function() {
    var parameters = PluginManager.parameters('TDDP_ChineseWordWrap');
    var defaultMaxChars = Number(parameters['Max Characters Per Line']) || 31;
    var enabled = false;
    var maxChars = defaultMaxChars;

    // 换行处理函数（修复：正确识别反斜杠）
    function wrapText(text, maxLen) {
        if (!text || maxLen <= 0) return text;
        var result = '';
        var count = 0;
        var i = 0;
        var len = text.length;
        while (i < len) {
            var ch = text[i];
            // 处理 RPG Maker MV 转义序列（以反斜杠开头）
            if (ch === '\\') {   // 判断反斜杠字符 注意是用反斜杠 \（ASCII 92）  而不是 ESC 字符 \x1b（ASCII 27）
                var start = i;
                i++; // 跳过反斜杠
                if (i >= len) {
                    result += '\\';
                    continue;
                }
                var next = text[i];
                // 单字符控制码：\. \| \! \{ \} \< \> \^ \$ 等
                if (next === '.' || next === '|' || next === '!' || next === '{' || next === '}' || 
                    next === '<' || next === '>' || next === '^' || next === '$') {
                    result += text.substring(start, i + 1);
                    i++; // 跳过该字符
                    continue;
                }
                // 字母开头的控制码（含参数或尖括号内容）
                if (/[a-zA-Z]/.test(next)) {
                    i++; // 移到第一个字母之后
                    // 读取连续的字母（支持 \fn, \sinv, \swh 等）
                    while (i < len && /[a-zA-Z]/.test(text[i])) {
                        i++;
                    }
                    // 如果后面是 '[' 则跳过直到 ']'
                    if (i < len && text[i] === '[') {
                        while (i < len && text[i] !== ']') {
                            i++;
                        }
                        if (i < len) i++; // 跳过 ']'
                    }
                    // 检查尖括号内容：如 \n<NAME> 或 \fn<NAME>
                    else if (i < len && text[i] === '<') {
                        while (i < len && text[i] !== '>') {
                            i++;
                        }
                        if (i < len) i++; // 跳过 '>'
                    }
                    result += text.substring(start, i);
                    continue;
                }
                // 其他（如 \ 后跟数字等），直接跳过两个字符
                result += text.substring(start, i + 1);
                i++;
                continue;
            }
            // 处理手动换行标签 <br> 和 <line break>
            if (ch === '<') {
                var lower = text.substr(i, 12).toLowerCase();
                if (lower.indexOf('<br>') === 0) {
                    result += '<br>';
                    i += 4;
                    continue;
                }
                if (lower.indexOf('<line break>') === 0) {
                    result += '<line break>';
                    i += 12;
                    continue;
                }
                // 不是标签，当作普通字符处理
            }
            // 手动换行符 \n 重置计数
            if (ch === '\n') {
                result += ch;
                count = 0;
                i++;
                continue;
            }
            // 普通字符
            result += ch;
            count++;
            if (count >= maxLen) {
                result += '\n';
                count = 0;
            }
            i++;
        }
        return result;
    }

    // 保存原 addText 方法（如果 YEP 未加载，则定义备用）
    var _Game_Message_addText = Game_Message.prototype.addText || Game_Message.prototype.add;

    Game_Message.prototype.addText = function(text) {
        if (enabled) {
            var lines = text.split('\n');
            var processed = lines.map(function(line) {
                return wrapText(line, maxChars);
            }).join('\n');

            // 临时处理 YEP 的 Word Wrap
            var yepLoaded = Imported.YEP_MessageCore;
            var originalWrap = false;
            if (yepLoaded && typeof $gameSystem !== 'undefined' && $gameSystem) {
                originalWrap = $gameSystem.wordWrap();
                $gameSystem.setWordWrap(false);
            }

            // 临时启用双字节换行 针对 GTP_OmoriFixes
            var original2Byte = undefined;
            if (typeof $ !== 'undefined' && $._enable_2byte_linebreak !== undefined) {
                original2Byte = $._enable_2byte_linebreak;
                $._enable_2byte_linebreak = true;
            }

            // 调用YEP 的 addText 也可能是原生 add
            _Game_Message_addText.call(this, processed);

            // 恢复双字节换行
            if (original2Byte !== undefined) {
                $._enable_2byte_linebreak = original2Byte;
            }

            // 恢复 YEP 的 Word Wrap
            if (yepLoaded && typeof $gameSystem !== 'undefined' && $gameSystem) {
                $gameSystem.setWordWrap(originalWrap);
            }
        } else {
            // 未启用时 直接调用原方法
            _Game_Message_addText.call(this, text);
        }
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ChineseWrap') {
            switch (args[0]) {
                case 'on':
                    enabled = true;
                    maxChars = Number(args[1]) || defaultMaxChars;
                    break;
                case 'off':
                    enabled = false;
                    break;
            }
        }
    };

    window.ChineseWrap = {
        on: function(chars) {
            enabled = true;
            maxChars = chars || defaultMaxChars;
        },
        off: function() {
            enabled = false;
        }
    };
})();