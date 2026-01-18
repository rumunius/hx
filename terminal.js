// 终端交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    const input = document.getElementById('command-input');
    const promptSpan = document.querySelector('.prompt');
    
    const commandHandler = new CommandHandler();
    
    // Tab补全状态
    let tabCompletionState = {
        matches: [],
        index: 0,
        lastInput: ''
    };
    
    // 更新提示符
    function updatePrompt() {
        const path = commandHandler.currentPath === '/home/guest' ? '~' : commandHandler.currentPath;
        promptSpan.textContent = `guest@uestc:${path}$`;
    }
    
    // 添加输出
    function addOutput(text, type = 'normal') {
        if (!text && type !== 'clear') return;
        
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        
        if (type === 'error') {
            outputLine.classList.add('output-error');
        } else if (type === 'warning') {
            outputLine.classList.add('output-warning');
        } else if (type === 'info') {
            outputLine.classList.add('output-info');
        } else if (type === 'success') {
            outputLine.classList.add('output-success');
        }
        
        outputLine.textContent = text;
        output.appendChild(outputLine);
    }
    
    // 添加命令回显
    function addCommandEcho(command) {
        const echoLine = document.createElement('div');
        echoLine.className = 'command-echo';
        
        const path = commandHandler.currentPath === '/home/guest' ? '~' : commandHandler.currentPath;
        echoLine.innerHTML = `<span class="prompt">guest@uestc:${path}$</span> ${escapeHtml(command)}`;
        
        output.appendChild(echoLine);
    }
    
    // 转义HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 显示成就通知
    function showAchievement(message) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement';
        achievement.innerHTML = `🎉 Achievement Unlocked!\n${message}`;
        output.appendChild(achievement);
    }
    
    // 滚动到底部
    function scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    // Tab补全函数
    function handleTabCompletion() {
        const currentValue = input.value;
        
        // 如果输入改变了，重置补全状态
        if (currentValue !== tabCompletionState.lastInput) {
            tabCompletionState.matches = [];
            tabCompletionState.index = 0;
        }
        
        // 如果还没有匹配项，生成匹配列表
        if (tabCompletionState.matches.length === 0) {
            const parts = currentValue.split(/\s+/);
            const lastPart = parts[parts.length - 1] || '';
            
            // 如果是第一个词，补全命令
            if (parts.length === 1 && !currentValue.endsWith(' ')) {
                const commands = ['help', 'ls', 'cd', 'cat', 'pwd', 'clear', 'whoami', 
                                'decrypt', 'tree', 'find', 'echo', 'date', 'uname', 
                                'history', 'achievements'];
                tabCompletionState.matches = commands.filter(cmd => cmd.startsWith(lastPart));
            } else {
                // 否则补全文件/目录名
                const pathToComplete = lastPart;
                const matches = getFileCompletions(pathToComplete);
                tabCompletionState.matches = matches;
            }
            
            if (tabCompletionState.matches.length === 0) {
                return; // 没有匹配
            }
        }
        
        // 循环选择匹配项
        const match = tabCompletionState.matches[tabCompletionState.index];
        const parts = currentValue.split(/\s+/);
        
        if (parts.length === 1 && !currentValue.endsWith(' ')) {
            input.value = match;
        } else {
            parts[parts.length - 1] = match;
            input.value = parts.join(' ');
        }
        
        // 更新状态
        tabCompletionState.lastInput = input.value;
        tabCompletionState.index = (tabCompletionState.index + 1) % tabCompletionState.matches.length;
    }
    
    // 获取文件/目录补全
    function getFileCompletions(partial) {
        let searchPath = commandHandler.currentPath;
        let prefix = '';
        
        // 处理路径
        if (partial.includes('/')) {
            const lastSlash = partial.lastIndexOf('/');
            const dirPath = partial.substring(0, lastSlash);
            prefix = partial.substring(lastSlash + 1);
            
            if (partial.startsWith('/')) {
                searchPath = dirPath || '/';
            } else {
                searchPath = resolvePath(commandHandler.currentPath, dirPath);
            }
        } else {
            prefix = partial;
        }
        
        // 获取目录内容
        const items = listDirectory(searchPath, true);
        if (!items) {
            return [];
        }
        
        // 过滤匹配的项
        const matches = items
            .filter(item => item.name.startsWith(prefix))
            .map(item => {
                const fullName = item.name;
                // 如果是目录，添加斜杠
                return item.type === 'directory' ? fullName + '/' : fullName;
            });
        
        return matches;
    }
    
    // 执行命令
    function executeCommand(command) {
        if (!command.trim()) {
            return;
        }
        
        addCommandEcho(command);
        
        const result = commandHandler.execute(command);
        
        if (result.clear) {
            output.innerHTML = '';
        } else {
            if (result.output) {
                addOutput(result.output, result.type);
            }
            
            // 检查成就
            if (result.achievement) {
                showAchievement(result.achievement);
            }
        }
        
        updatePrompt();
        scrollToBottom();
    }
    
    // 监听输入
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value;
            input.value = '';
            executeCommand(command);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            input.value = commandHandler.getHistoryCommand('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            input.value = commandHandler.getHistoryCommand('down');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            executeCommand('clear');
            input.value = '';
        } else {
            // 其他按键时重置Tab补全状态
            tabCompletionState.matches = [];
            tabCompletionState.index = 0;
        }
    });
    
    // 点击终端聚焦输入框（但不阻止文字选择）
    terminal.addEventListener('click', (e) => {
        // 如果正在选择文字，不要聚焦输入框
        if (window.getSelection().toString().length === 0) {
            input.focus();
        }
    });
    
    // 防止失去焦点（但允许选择文字）
    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (window.getSelection().toString().length === 0) {
                input.focus();
            }
        }, 100);
    });
    
    // 移动端优化
    if ('ontouchstart' in window) {
        terminal.addEventListener('touchstart', () => {
            input.focus();
        });
    }
    
    // 初始化
    updatePrompt();
    input.focus();
    
    // 启动动画
    const bootSequence = document.querySelector('.boot-sequence');
    const asciiArt = document.querySelector('.ascii-art');
    const welcomeMessage = document.querySelector('.welcome-message');
    
    setTimeout(() => {
        bootSequence.style.opacity = '0.7';
    }, 100);
    
    setTimeout(() => {
        asciiArt.style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
        welcomeMessage.style.opacity = '1';
    }, 1000);
    
    // 添加一些启动提示
    setTimeout(() => {
        addOutput('\n💡 Pro Tip: 大多数Linux命令都支持，桌面端按Tab键补全，试试 ls -a 发现隐藏文件', 'info');
        scrollToBottom();
    }, 1500);
    
    // 彩蛋：konami code
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        if (e.target !== input) return;
        
        konamiCode.push(e.key);
        if (konamiCode.length > 10) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            konamiCode = [];
            addOutput('\n🎮 Konami Code Detected!', 'success');
            addOutput('You are a true gamer and a geek. UESTC needs people like you!', 'info');
            addOutput('Hidden message: The best secrets are found by those who never stop exploring.\n', 'info');
            scrollToBottom();
        }
    });
    
    // 添加复制粘贴支持
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        input.value += text;
    });
    
    // 禁用右键菜单（可选）
    terminal.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // 添加欢迎彩蛋 - 检测首次访问
    const firstVisit = !localStorage.getItem('visited');
    if (firstVisit) {
        localStorage.setItem('visited', 'true');
        setTimeout(() => {
            addOutput('\n🌟 Welcome, first-time visitor!', 'success');
            addOutput('This terminal is full of secrets. Take your time to explore.', 'info');
            addOutput('Start with: cat welcome.txt\n', 'info');
            scrollToBottom();
        }, 2000);
    }
    
    // 性能优化：限制输出行数
    const MAX_OUTPUT_LINES = 1000;
    const observer = new MutationObserver(() => {
        const lines = output.children;
        if (lines.length > MAX_OUTPUT_LINES) {
            // 删除最旧的行
            for (let i = 0; i < lines.length - MAX_OUTPUT_LINES; i++) {
                output.removeChild(lines[0]);
            }
        }
    });
    
    observer.observe(output, { childList: true });
});

// 页面可见性API - 当页面重新可见时聚焦输入框
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const input = document.getElementById('command-input');
        if (input) {
            input.focus();
        }
    }
});

// Service Worker 注册（用于PWA支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 可以在这里注册service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// 防止页面缩放（移动端）
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// 添加键盘快捷键提示
document.addEventListener('keydown', (e) => {
    // Ctrl+K 或 Cmd+K 清屏
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('command-input');
        if (input) {
            input.value = 'clear';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
    }
});
