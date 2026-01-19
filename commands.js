// 命令处理系统
class CommandHandler {
    constructor() {
        this.currentPath = '/home/guest';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.achievements = new Set();
        this._rmDangerWarned = false;
    }
    
    // 执行命令
    execute(input) {
        const trimmedInput = input.trim();
        
        if (!trimmedInput) {
            return { success: true, output: '' };
        }
        
        // 检测并处理 sudo 前缀
        let actualInput = trimmedInput;
        let hasSudo = false;
        if (/^sudo\s+/i.test(trimmedInput)) {
            hasSudo = true;
            actualInput = trimmedInput.replace(/^sudo\s+/i, '').trim();
        }
        
        this.commandHistory.push(trimmedInput);
        this.historyIndex = this.commandHistory.length;
        
        const parts = actualInput.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // 命令路由
        let result;
        switch (command) {
            case 'help':
                result = this.help();
                break;
            case 'ls':
                result = this.ls(args);
                break;
            case 'cd':
                result = this.cd(args);
                break;
            case 'cat':
                result = this.cat(args);
                break;
            case 'pwd':
                result = this.pwd();
                break;
            case 'clear':
                result = this.clear();
                break;
            case 'whoami':
                result = this.whoami(args);
                break;
            case 'rm':
                result = this.rm(args);
                break;
            case 'decrypt':
                result = this.decrypt(args);
                break;
            case 'tree':
                result = this.tree(args);
                break;
            case 'find':
                result = this.find(args);
                break;
            case 'echo':
                result = this.echo(args);
                break;
            case 'date':
                result = this.date();
                break;
            case 'uname':
                result = this.uname();
                break;
            case 'history':
                result = this.history();
                break;
            case 'achievements':
            case 'achievement':
                result = this.showAchievements();
                break;
            default:
                result = {
                    success: false,
                    output: `Command not found: ${command}\nType 'help' for available commands.`,
                    type: 'error'
                };
        }
        
        // 如果有 sudo 前缀，添加警告
        if (hasSudo && result && result.output) {
            result.output = '请勿尝试获取 root 权限 — 已去掉 sudo 前缀并继续执行。\n\n' + result.output;
        }
        
        return result;
    }
    
    // 帮助命令
    help() {
        return {
            success: true,
            output: `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

基础命令 (Basic Commands):
  help              显示此帮助信息
  clear             清空终端屏幕
  
文件操作 (File Operations):
  ls [options] [path]  列出目录的文件（默认当前目录）
                    -a : 显示所有文件（包括隐藏文件）
                    -l : 详细信息
  cd <directory>    切换目录
                    .. : 返回上级目录
                    /  : 返回根目录
                    ~  : 返回家目录
  pwd               显示当前目录路径
  cat <file>        查看文件内容
  tree              显示目录树结构
  find <name>       搜索文件或目录

系统信息 (System Info):
  whoami            显示当前用户信息
  date              显示当前日期时间
  uname             显示系统信息
  history           显示命令历史
  achievements      查看已达成的成就

高级功能 (Advanced):
  decrypt <file> <method>  解密文件
  echo <text>       输出文本

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* 新手提示：
   - 输入 'cat welcome.txt' 查看招生信息和极客俱乐部
   - 输入 'cat .club/info.txt' 了解技术社群详情
   - 使用 'ls -a' 发现更多隐藏的秘密
   - 探索 /system/logs 了解更多线索

* 给极客的挑战：
   - 找到加密文件并解密
   - 发现所有隐藏的成就
   - 找到通往创作者博客的路径
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            type: 'info'
        };
    }
    
    // 列出目录
    ls(args) {
        let showHidden = false;
        let detailed = false;
        let targetPath = this.currentPath;
        
        // 解析参数
        for (const arg of args) {
            if (arg === '-a') showHidden = true;
            else if (arg === '-l') detailed = true;
            else if (arg === '-la' || arg === '-al') {
                showHidden = true;
                detailed = true;
            }
            else if (!arg.startsWith('-')) {
                // 路径参数
                targetPath = resolvePath(this.currentPath, arg);
            }
        }
        
        const items = listDirectory(targetPath, showHidden);
        
        if (items === null) {
            return {
                success: false,
                output: 'Error reading directory',
                type: 'error'
            };
        }
        
        if (items.length === 0) {
            return {
                success: true,
                output: 'Directory is empty'
            };
        }
        
        // 检查是否发现隐藏文件
        if (showHidden && items.some(item => item.hidden)) {
            this.unlockAchievement('explorer');
        }
        
        let output = '';
        
        if (detailed) {
            output = items.map(item => {
                const type = item.type === 'directory' ? 'DIR' : 'FILE';
                const hidden = item.hidden ? '(hidden)' : '';
                const encrypted = item.encrypted ? '[LOCKED]' : '';
                return `${type.padEnd(8)} ${item.name} ${hidden} ${encrypted}`;
            }).join('\n');
        } else {
            // 分类显示
            const dirs = items.filter(i => i.type === 'directory');
            const files = items.filter(i => i.type === 'file');
            
            let result = [];
            
            if (dirs.length > 0) {
                result.push('Directories:');
                result.push(dirs.map(d => `  [DIR] ${d.name}${d.hidden ? ' (hidden)' : ''}`).join('\n'));
            }
            
            if (files.length > 0) {
                if (dirs.length > 0) result.push('');
                result.push('Files:');
                result.push(files.map(f => 
                    `  [FILE] ${f.name}${f.hidden ? ' (hidden)' : ''}${f.encrypted ? ' [LOCKED]' : ''}`
                ).join('\n'));
            }
            
            output = result.join('\n');
        }
        
        return {
            success: true,
            output
        };
    }
    
    // 切换目录
    cd(args) {
        if (args.length === 0) {
            this.currentPath = '/home/guest';
            return { success: true, output: '' };
        }
        
        // 支持 ~ 返回家目录
        let target = args[0];
        if (target === '~') {
            this.currentPath = '/home/guest';
            return { success: true, output: '' };
        }
        // 支持 ~/path 格式
        if (target.startsWith('~/')) {
            target = '/home/guest' + target.substring(1);
        }
        
        // 移除末尾的斜杠
        target = target.replace(/\/+$/, '');
        
        const targetPath = resolvePath(this.currentPath, target);
        const obj = getFileSystemObject(targetPath);
        
        if (!obj) {
            return {
                success: false,
                output: `cd: ${args[0]}: No such directory`,
                type: 'error'
            };
        }
        
        if (obj.type !== 'directory') {
            return {
                success: false,
                output: `cd: ${args[0]}: Not a directory`,
                type: 'error'
            };
        }
        
        this.currentPath = targetPath;
        return { success: true, output: '' };
    }
    
    // 显示当前路径
    pwd() {
        return {
            success: true,
            output: this.currentPath
        };
    }
    
    // rm 命令 - 危险操作检测
    rm(args) {
        if (args.length === 0) {
            return {
                success: false,
                output: 'rm: missing operand\nTry \'rm --help\' for more information.',
                type: 'error'
            };
        }
        
        // 检测危险操作: rm -rf / 或 rm -rf /*
        const hasRf = args.includes('-rf') || (args.includes('-r') && args.includes('-f'));
        const hasRoot = args.includes('/') || args.includes('/*');
        
        if (hasRf && hasRoot) {
            if (!this._rmDangerWarned) {
                // 第一次警告
                this._rmDangerWarned = true;
                return {
                    success: false,
                    output: `=== 危险操作警告 ===

你正在尝试执行 'rm -rf /' 或 'rm -rf /*'
这将删除系统中的所有文件！

这是一个极其危险的操作，会导致：
  整个文件系统被删除
  系统完全崩溃
  所有数据永久丢失
  终端无法恢复

如果你再次执行此命令，终端将会崩溃并停止响应。

请三思而后行！`,
                    type: 'warning'
                };
            } else {
                // 第二次执行 - 触发终端崩溃
                this._rmDangerWarned = false; // 重置标志
                return {
                    success: false,
                    output: `=== FATAL ERROR ===

Deleting system files...
rm: cannot remove '/': System corruption
rm: cannot remove '/bin': Permission denied
rm: cannot remove '/boot': I/O error
Segmentation fault (core dumped)

Kernel panic - not syncing: VFS: Unable to mount root fs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM HALTED
TERMINAL CORRUPTED
NO RECOVERY POSSIBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                    type: 'error',
                    crash: true // 特殊标志：触发终端崩溃
                };
            }
        }
        
        // 正常的 rm 操作（模拟）
        return {
            success: true,
            output: `rm: removed '${args[args.length - 1]}'`
        };
    }
    
    // 读取文件
    cat(args) {
        if (args.length === 0) {
            return {
                success: false,
                output: 'cat: missing file operand',
                type: 'error'
            };
        }
        
        const filePath = resolvePath(this.currentPath, args[0]);
        const file = readFile(filePath);
        
        if (!file) {
            return {
                success: false,
                output: `cat: ${args[0]}: No such file`,
                type: 'error'
            };
        }
        
        if (file.encrypted) {
            return {
                success: true,
                output: `[!] This file is encrypted!\n\n${file.content}\n\n* Hint: Use 'decrypt ${filePath} <method>' to decrypt this file.`,
                type: 'warning'
            };
        }
        
        // 检查特殊成就
        if (filePath.includes('.club')) {
            this.unlockAchievement('club_finder');
        }
        
        return {
            success: true,
            output: file.content
        };
    }
    
    // 清空屏幕
    clear() {
        return {
            success: true,
            output: '',
            clear: true
        };
    }
    
    // 用户信息
    whoami(args) {
        if (args.includes('--truth')) {
            this.unlockAchievement('true_geek');
            return {
                success: true,
                output: `!!! Ultimate Easter Egg Unlocked! !!!

You are: A True Geek

Congratulations! You've completed the full journey.

Special Rewards:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* Creator's Blog: https://rumunius.top
* 极客俱乐部微信群: 占位符占位符占位符
* UESTC招生网: https://zs.uestc.edu.cn
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Domain Easter Egg:
  Current site: hx.rumunius.top
  Remove "hx." → rumunius.top (Creator's main blog)
  
You've shown exceptional curiosity and technical skill.
We believe you'll thrive at UESTC!

"求实求真，大气大为" - UESTC

* Tip: 输入 'achievements' 查看所有达成的成就

Welcome to UESTC, future geek! :D`,
                type: 'success'
            };
        }
        
        return {
            success: true,
            output: `Current User: guest
Hostname: uestc
Groups: students, explorers
Home: /home/guest

* Hint: It is not a truth until you find the truth.`
        };
    }
    
    // 解密文件
    decrypt(args) {
        if (args.length < 2) {
            return {
                success: false,
                output: 'Usage: decrypt <file> <method>',
                type: 'error'
            };
        }
        
        const filePath = resolvePath(this.currentPath, args[0]);
        const method = args[1].toLowerCase();
        const file = readFile(filePath);
        
        if (!file) {
            return {
                success: false,
                output: `decrypt: ${args[0]}: No such file`,
                type: 'error'
            };
        }
        
        if (!file.encrypted) {
            return {
                success: false,
                output: 'This file is not encrypted.',
                type: 'warning'
            };
        }
        
        if (method === 'rot13' || method === 'ROT13') {  //改成不区分大小写的rot13
            this.unlockAchievement('crypto_master');
            
            return {
                success: true,
                output: `[UNLOCKED] Decryption successful!\n\n${file.decrypted}`,
                type: 'success'
            };
        } else {
            return {
                success: false,
                output: `Unsupported decryption method: ${method}`,
                type: 'error'
            };
        }
    }
    
    // 目录树
    tree(args) {
        const depth = args[0] ? parseInt(args[0]) : 3;
        
        const buildTree = (path, prefix = '', level = 0, showHidden = false) => {
            if (level >= depth) return '';
            
            const items = listDirectory(path, showHidden);
            if (!items) return '';
            
            let output = '';
            const filtered = items.filter(item => showHidden || !item.hidden);
            
            filtered.forEach((item, index) => {
                const isLast = index === filtered.length - 1;
                const connector = isLast ? '└── ' : '├── ';
                const icon = item.type === 'directory' ? '[DIR]' : '[FILE]';
                const encrypted = item.encrypted ? ' [LOCKED]' : '';
                
                output += `${prefix}${connector}${icon} ${item.name}${encrypted}\n`;
                
                if (item.type === 'directory') {
                    const newPrefix = prefix + (isLast ? '    ' : '│   ');
                    const newPath = path === '/' ? `/${item.name}` : `${path}/${item.name}`;
                    output += buildTree(newPath, newPrefix, level + 1, showHidden);
                }
            });
            
            return output;
        };
        
        const showHidden = args.includes('-a');
        const header = `${this.currentPath}\n`;
        return {
            success: true,
            output: header + buildTree(this.currentPath, '', 0, showHidden)
        };
    }
    
    // 查找文件
    find(args) {
        if (args.length === 0) {
            return {
                success: false,
                output: 'Usage: find <name>',
                type: 'error'
            };
        }
        
        const searchTerm = args[0].toLowerCase();
        const results = [];
        
        const search = (path, obj) => {
            if (obj.type === 'directory' && obj.contents) {
                for (const [name, item] of Object.entries(obj.contents)) {
                    const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
                    
                    if (name.toLowerCase().includes(searchTerm)) {
                        const icon = item.type === 'directory' ? '[DIR]' : '[FILE]';
                        results.push(`${icon} ${fullPath}`);
                    }
                    
                    if (item.type === 'directory') {
                        search(fullPath, item);
                    }
                }
            }
        };
        
        search('/', fileSystem['/']);
        
        if (results.length === 0) {
            return {
                success: true,
                output: `No results found for: ${searchTerm}`
            };
        }
        
        return {
            success: true,
            output: `Found ${results.length} result(s):\n\n${results.join('\n')}`
        };
    }
    
    // 回显
    echo(args) {
        return {
            success: true,
            output: args.join(' ')
        };
    }
    
    // 日期
    date() {
        const now = new Date();
        return {
            success: true,
            output: now.toString()
        };
    }
    
    // 系统信息
    uname() {
        return {
            success: true,
            output: `UESTC Terminal v1.0.0
Kernel: WebTerminal 5.15.0
Architecture: x86_64
Platform: Project Ginkgo`
        };
    }
    
    // 命令历史
    history() {
        if (this.commandHistory.length === 0) {
            return {
                success: true,
                output: 'No command history'
            };
        }
        
        const output = this.commandHistory
            .map((cmd, idx) => `  ${(idx + 1).toString().padStart(3)} ${cmd}`)
            .join('\n');
        
        return {
            success: true,
            output
        };
    }
    
    // 查看成就
    showAchievements() {
        const allAchievements = {
            'explorer': {
                name: 'Explorer',
                name_cn: '探索者',
                name_hidden: 'Ex?????r',
                name_cn_hidden: '探???',
                desc: '发现了隐藏目录',
                desc_hidden: '发现了???目录',
                hint: '提示：使用 ls -a 可以查看隐藏目录'
            },
            'club_finder': {
                name: 'Club Finder',
                name_cn: '俱乐部发现者',
                name_hidden: 'C??? F?????',
                name_cn_hidden: '??????者',
                desc: '找到了极客俱乐部',
                desc_hidden: '找到了??????',
                hint: '提示：探索隐藏目录 .club'
            },
            'crypto_master': {
                name: 'Crypto Master',
                name_cn: '解密大师',
                name_hidden: 'C????? M?????',
                name_cn_hidden: '???大师',
                desc: '成功解密了加密文件',
                desc_hidden: '成功???了???文件',
                hint: '提示：在 /var/secrets 中寻找密钥'
            },
            'true_geek': {
                name: 'True Geek',
                name_cn: '真正的极客',
                name_hidden: 'T??? G???',
                name_cn_hidden: '???的???',
                desc: '解锁了终极彩蛋',
                desc_hidden: '解锁了??????',
                hint: '提示：真理藏在命令参数中...'
            }
        };
        
        let output = `成就系统 (Achievements)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

已解锁: ${this.achievements.size}/${Object.keys(allAchievements).length}

`;
        
        for (const [key, achievement] of Object.entries(allAchievements)) {
            const unlocked = this.achievements.has(key);
            if (unlocked) {
                output += `[UNLOCKED] ${achievement.name} (${achievement.name_cn})
   - ${achievement.desc}\n\n`;
            } else {
                output += `[LOCKED] ${achievement.name_hidden} (${achievement.name_cn_hidden})
   - ${achievement.desc_hidden}
   ${achievement.hint}\n\n`;
            }
        }
        
        output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* 继续探索系统，解锁更多成就！`;
        
        return {
            success: true,
            output,
            type: 'info'
        };
    }
    
    // 成就系统
    unlockAchievement(achievement) {
        if (this.achievements.has(achievement)) {
            return;
        }
        
        this.achievements.add(achievement);
        
        const achievements = {
            'explorer': {
                name: 'Explorer',
                name_cn: '探索者',
                desc: '发现了隐藏文件'
            },
            'club_finder': {
                name: 'Club Finder',
                name_cn: '俱乐部发现者',
                desc: '找到了极客俱乐部'
            },
            'crypto_master': {
                name: 'Crypto Master',
                name_cn: '解密大师',
                desc: '成功解密了加密文件'
            },
            'true_geek': {
                name: 'True Geek',
                name_cn: '真正的极客',
                desc: '解锁了终极彩蛋'
            }
        };
        
        const ach = achievements[achievement];
        if (ach) {
            // 这将在terminal.js中处理
            return {
                achievement: `${ach.name} (${ach.name_cn}) - ${ach.desc}`
            };
        }
    }
    
    // 获取历史命令
    getHistoryCommand(direction) {
        if (this.commandHistory.length === 0) return '';
        
        if (direction === 'up') {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
        } else {
            this.historyIndex = Math.min(this.commandHistory.length, this.historyIndex + 1);
        }
        
        if (this.historyIndex === this.commandHistory.length) {
            return '';
        }
        
        return this.commandHistory[this.historyIndex];
    }
}
