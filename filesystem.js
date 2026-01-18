// 虚拟文件系统
const fileSystem = {
    '/': {
        type: 'directory',
        contents: {
            'home': {
                type: 'directory',
                contents: {
                    'guest': {
                        type: 'directory',
                        contents: {
                            'welcome.txt': {
                                type: 'file',
                                content: `===========================================
  电子科技大学招生信息
===========================================

📞 招生办联系方式：
   电话：028-61831137 / 61831139
   网址：https://zs.uestc.edu.cn

📧 咨询邮箱：zhaoban@uestc.edu.cn

🏫 学校地址：
   成都市高新区（西区）西源大道2006号
   邮编：611731

🎮 极客俱乐部微信群：占位符占位符占位符
   （想了解更多技术氛围？输入 'cat .club/info.txt' 查看详情）

💡 提示：
   想了解更多？试试以下命令：
   - cat about.txt        查看学校简介
   - ls -a                查看所有文件（包括隐藏文件）
   - cd /system/logs       探索系统日志
   
===========================================
成电欢迎你！
===========================================`
                            },
                            'about.txt': {
                                type: 'file',
                                content: `===========================================
  电子科技大学简介
===========================================

🎓 学校概况：
电子科技大学（University of Electronic Science and Technology of China）
坐落于四川省成都市，是中华人民共和国教育部直属高校，由教育部、工业和
信息化部、四川省和成都市共建。是国家"双一流"、"985工程"、"211工程"
重点建设大学。

🌟 学科特色：
以电子信息科学技术为核心，理工渗透，理、工、管、文、医协调发展。
学校现设有24个学院（部），65个本科专业。

📊 学科实力：
- 电子科学与技术、信息与通信工程为国家一级重点学科
- 在第四轮学科评估中，电子科学与技术、信息与通信工程两个学科获评A+
- 工程学、计算机科学、材料科学等多个学科进入ESI前1%

🏆 历史荣誉：
建校于1956年，原名成都电讯工程学院，是新中国首批重点建设的高校之一。
学校以"求实求真，大气大为"为校训，培养了大批电子信息领域的领军人才。

💫 校园文化：
- 清水河畔，银杏成荫，有"中国最美大学校园"美誉
- 科技创新氛围浓厚，学生科技竞赛成绩斐然
- 国际化办学，与世界众多知名高校建立合作关系

===========================================
探索更多秘密？试试使用 'ls -a' 发现隐藏的内容
===========================================`
                            },
                            '.club': {
                                type: 'directory',
                                hidden: true,
                                contents: {
                                    'info.txt': {
                                        type: 'file',
                                        content: `===========================================
  🎮 成电极客俱乐部
===========================================

你找到了隐藏的极客俱乐部信息！

这是一个由在校学生自发组织的技术交流社群，
我们讨论编程、硬件、AI、网络安全等各种技术话题。

🔥 加入我们的私域社群：
   微信群号：占位符占位符占位符
   (添加管理员微信并回复"极客"获取入群邀请)

💡 俱乐部特色：
   - 定期技术分享会
   - 项目组队开发
   - 竞赛组队参赛
   - 学长学姐答疑
   - 实习内推机会

⚡ 我们在等你！
   作为高中生的你，如果对技术充满热情，
   欢迎提前加入，感受大学的技术氛围。
===========================================`
                                    }
                                }
                            }
                        }
                    }
                }
            },
            'system': {
                type: 'directory',
                contents: {
                    'info.txt': {
                        type: 'file',
                        content: `UESTC Terminal System v1.0.0
Codename: Ginkgo
Build: 2026.01.18

System Architecture: Web-based Virtual Terminal
Purpose: Recruitment Exploration Platform

Maintained by: Project Ginkgo Team
For more info, check /system/logs/`
                    },
                    'logs': {
                        type: 'directory',
                        contents: {
                            'access.log': {
                                type: 'file',
                                content: `[2026-01-15 10:23:45] System initialized
[2026-01-15 10:23:46] User authentication: guest
[2026-01-15 10:24:12] File access: /home/guest/welcome.txt
[2026-01-15 14:32:08] Directory scan: /projects/ginkgo
[2026-01-15 14:32:19] Encrypted file detected: source.enc
[2026-01-15 14:33:45] Decryption attempt failed: missing key
[2026-01-15 16:47:23] Hint logged: "Key might be in /var/secrets"
[2026-01-15 18:12:34] Advanced user detected: checking /var/secrets
[2026-01-15 18:15:09] Successful decryption with ROT13
[2026-01-15 20:34:12] Easter egg discovered: domain relationship
[2026-01-16 09:15:33] Blog redirect: rumunius.top
[2026-01-17 11:22:47] Achievement unlocked: True Geek

提示：日志中提到了 /projects/ginkgo 和加密文件...`
                            },
                            'system.log': {
                                type: 'file',
                                content: `[INFO] Project Ginkgo - Named after UESTC's iconic ginkgo trees
[INFO] Domain: hx.rumunius.top
[DEBUG] Parent domain detected: rumunius.top
[HINT] Removing subdomain prefix reveals something...
[INFO] For true geeks: try 'whoami --truth'`
                            }
                        }
                    }
                }
            },
            'projects': {
                type: 'directory',
                contents: {
                    'ginkgo': {
                        type: 'directory',
                        contents: {
                            'README.md': {
                                type: 'file',
                                content: `# Project Ginkgo

银杏树项目 - 电子科技大学招生探索系统

## 项目背景
银杏是电子科技大学的标志性植物，每年秋季，
清水河校区的银杏大道金黄一片，吸引无数师生驻足。

这个项目以银杏为名，希望如同银杏树一般，
为即将到来的新生指引方向。

## 文件说明
- source.enc: 加密的源代码（需要密钥解密）

## 提示
密钥可能藏在系统的某个角落... 
试试查看系统日志？或者探索 /var 目录？`
                            },
                            'source.enc': {
                                type: 'file',
                                encrypted: true,
                                content: `Rapelcgrq Pbagrag:
====================

Pbatenghyngvbaf! Lbh sbhaq gur rapelcgrq svyr.

Guvf vf n frperg zrffntr sbe gur gehr trrxf.

Vs lbh ner ernqvat guvf, lbh zhfg unir sbhaq gur xrl 
naq qrpelcgrq guvf svyr. Jryy qbar!

🎉 Npuvrirzrag Haybpxrq: Pelcgb Znfgre 🎉

Urer'f lbhe erjneq:
Gur perngbe'f oybg: ehzhavhf.gbc

Erzbir "uk." sebz gur qbznva naq lbh'yy svaq zber...

Sbe gur hygvzngr rnfgre rtt, gel:
  jub nz v --gehgu

Znl lbhe wbhearl va HRFGP or svyyrq jvgu jbaqre!

- Cebwrpg Tvaxb Grnz`,
                                decrypted: `Decrypted Content:
====================

Congratulations! You found the encrypted file.

This is a secret message for the true geeks.

If you are reading this, you must have found the key 
and decrypted this file. Well done!

🎉 Achievement Unlocked: Crypto Master 🎉

Here's your reward:
The creator's blog: rumunius.top

Remove "hx." from the domain and you'll find more...

For the ultimate easter egg, try:
  whoami --truth

May your journey in UESTC be filled with wonder!

- Project Ginkgo Team`
                            }
                        }
                    },
                    'legacy': {
                        type: 'directory',
                        contents: {
                            'hint.txt': {
                                type: 'file',
                                content: `Legacy Project Files

这里存放着一些旧项目的提示信息。

密码学提示：
- ROT13 是一种简单的替换加密
- A->N, B->O, C->P ... N->A, O->B, P->C
- 它是对称的：加密和解密使用相同的操作

如果你找到了加密的文件，试试用 ROT13 解密？

命令提示：
  decrypt <filename> <method>
  例如: decrypt /projects/ginkgo/source.enc rot13`
                            }
                        }
                    }
                }
            },
            'var': {
                type: 'directory',
                contents: {
                    'secrets': {
                        type: 'directory',
                        contents: {
                            'key.txt': {
                                type: 'file',
                                content: `🔑 Decryption Key Found!

Encryption Method: ROT13
Algorithm: Simple substitution cipher

Usage:
  decrypt <file> rot13

Target File: /projects/ginkgo/source.enc

Good luck, hacker!`
                            }
                        }
                    }
                }
            }
        }
    }
};

// 获取文件系统路径
function resolvePath(currentPath, targetPath) {
    if (targetPath.startsWith('/')) {
        return targetPath;
    }
    
    if (targetPath === '..') {
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        return '/' + parts.join('/');
    }
    
    if (targetPath === '.') {
        return currentPath;
    }
    
    if (currentPath === '/') {
        return '/' + targetPath;
    }
    
    return currentPath + '/' + targetPath;
}

// 获取路径对应的文件系统对象
function getFileSystemObject(path) {
    if (path === '/') {
        return fileSystem['/'];
    }
    
    const parts = path.split('/').filter(p => p);
    let current = fileSystem['/'];
    
    for (const part of parts) {
        if (!current.contents || !current.contents[part]) {
            return null;
        }
        current = current.contents[part];
    }
    
    return current;
}

// 列出目录内容
function listDirectory(path, showHidden = false) {
    const obj = getFileSystemObject(path);
    
    if (!obj) {
        return null;
    }
    
    if (obj.type !== 'directory') {
        return null;
    }
    
    const items = [];
    for (const [name, item] of Object.entries(obj.contents)) {
        if (!showHidden && name.startsWith('.')) {
            continue;
        }
        items.push({
            name,
            type: item.type,
            hidden: name.startsWith('.'),
            encrypted: item.encrypted || false
        });
    }
    
    return items;
}

// 读取文件内容
function readFile(path) {
    const obj = getFileSystemObject(path);
    
    if (!obj) {
        return null;
    }
    
    if (obj.type !== 'file') {
        return null;
    }
    
    return obj;
}

// ROT13 解密
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode(
            (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        );
    });
}
