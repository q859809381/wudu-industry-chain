# -*- coding: utf-8 -*-
"""从 PRD docx 提取结构化内容，生成 prd-content.js
页签结构：全局介绍（1 引言 / 2 用户角色 / 3 产品概述 / 4 全局业务规则）
         + 页面与功能描述（5.1-5.5 各模块），两个页签均带左侧锚点导航。
编号在页签内从 1 重排：一级「一、二、三」，二级「1、2」，三级「1.1」。
封面、文档信息与修订记录、目录不入抽屉。"""
import re, html, json

DOCX = r'D:/projects/AI_dowell_2.0/五度产业链/output/prd-industry-chain-20261111/stage3/产业链全景图谱平台PRD文档.docx'
OUT = r'D:/projects/AI_dowell_2.0/五度产业链/prd-content.js'

import zipfile
with zipfile.ZipFile(DOCX) as z:
    xml = z.read('word/document.xml').decode('utf-8')

body_m = re.search(r'<w:body>(.*)</w:body>', xml, re.S)
body = body_m.group(1)

blocks = []
token = re.compile(r'<w:tbl>.*?</w:tbl>|<w:p [^>]*>.*?</w:p>|<w:p/>', re.S)
for m in token.finditer(body):
    blocks.append(('tbl' if m.group(0).startswith('<w:tbl') else 'p', m.group(0)))

H_STYLE = {'000005': 1, '000001': 2, '000004': 3}

def para_text(p):
    parts = []
    for m in re.finditer(r'<w:t[^>]*>(.*?)</w:t>|<w:br\s*/?>', p, re.S):
        if m.group(0).startswith('<w:br'):
            parts.append('\n')
        else:
            parts.append(m.group(1))
    t = html.unescape(''.join(parts))
    # 清理域代码/样式 XML 泄漏（文档里目录域等被双重转义成可见文本）
    t = re.sub(r'</?w:[a-zA-Z]+[^>]*>', '', t)
    t = re.sub(r'</?v:[a-zA-Z]+[^>]*>', '', t)
    t = re.sub(r'</?o:[a-zA-Z]+[^>]*>', '', t)
    t = re.sub(r'HYPERLINK\s+\\l\s+"[^"]*"', '', t)
    t = re.sub(r'PAGEREF\s+[^ ]+\s+\\h', '', t)
    t = re.sub(r'xml:space=\\"preserve\\"', '', t)
    t = re.sub(r'\s{2,}', ' ', t)
    return t.strip()

def para_num(p):
    m = re.search(r'<w:numPr>.*?<w:ilvl w:val="(\d+)"/>.*?<w:numId w:val="(\d+)"', p, re.S)
    if not m:
        m2 = re.search(r'<w:numPr>.*?<w:numId w:val="(\d+)"', p, re.S)
        if m2:
            return 0, m2.group(1)
        return None
    return int(m.group(1)), m.group(2)

def is_heading(p, text):
    m = re.search(r'<w:pStyle w:val="([^"]+)"', p)
    if m and m.group(1) in ('000003', '000007'):
        return 'TOC'  # 目录条目（toc 1 / toc 2），不入正文
    if m and m.group(1) in H_STYLE:
        return H_STYLE[m.group(1)]
    if not re.match(r'^\d+(\.\d+)*\s+\S', text):
        return None
    if para_num(p):
        return None
    if len(text) > 40:
        return None
    return 1 if re.match(r'^\d+\.\s', text) else (2 if re.match(r'^\d+\.\d+\s', text) else 3)

# 正文交叉引用重写：抽屉内编号已按页签重排，正文中引用旧编号需映射到新编号表达
# （源 docx 编号体系不变，仅抽屉展示层替换）
REF_RULES = [
    ('对应 5.2 节', '对应「二、产业图谱（核心模块）」'),
    ('（详见 4.2）', '（详见全局业务规则-2、产业链查看与开通权限）'),
    ('受 4.2 权限规则约束', '受产业链查看与开通权限规则约束（全局业务规则-2）'),
    ('按 4.2 权限规则执行', '按产业链查看与开通权限规则执行（全局业务规则-2）'),
    ('（见 4.2）', '（见产业链查看与开通权限规则，全局业务规则-2）'),
    ('（见 5.2.4）', '（见 4、环节企业清单抽屉）'),
    ('（见 5.2.7）', '（见 6、企业详情）'),
    ('权限规则同 5.2.4', '权限规则同「4、环节企业清单抽屉」'),
]

def rewrite_refs(t):
    for old, new in REF_RULES:
        t = t.replace(old, new)
    return t

def table_html(tbl):
    rows = re.findall(r'<w:tr[ >].*?</w:tr>', tbl, re.S)
    out = ['<table class="prd-doc-table"><tbody>']
    for ri, tr in enumerate(rows):
        cells = re.findall(r'<w:tc>.*?</w:tc>', tr, re.S)
        tag = 'th' if ri == 0 else 'td'
        tds = []
        for tc in cells:
            t = ' '.join(para_text(tc).split())
            if not t:
                continue
            t = html.escape(rewrite_refs(t))
            tds.append(f'<{tag}>{t}</{tag}>')
        if tds:
            out.append('<tr>' + ''.join(tds) + '</tr>')
    out.append('</tbody></table>')
    return ''.join(out)

items = []
for kind, frag in blocks:
    if kind == 'tbl':
        items.append(('table', 0, table_html(frag)))
        continue
    text = para_text(frag)
    if not text:
        continue
    lvl = is_heading(frag, text)
    if lvl == 'TOC':
        continue
    if lvl:
        items.append((f'h{lvl}', lvl, text))
    else:
        n = para_num(frag)
        if n:
            ilvl, numid = n
            items.append(('li', min(ilvl, 2), text))
        else:
            items.append(('p', 0, text))

sections = []
cur = None
for kind, lvl, content in items:
    if kind in ('h1', 'h2', 'h3'):
        if kind == 'h3' and cur is not None:
            cur['blocks'].append((kind, content))
            continue
        cur = {'level': lvl, 'title': content, 'blocks': []}
        sections.append(cur)
    else:
        if cur is None:
            continue  # 封面前言不入抽屉
        cur['blocks'].append((kind, content))

def render_blocks(blocks):
    out = []
    for kind, content in blocks:
        if kind == 'table':
            out.append(content)
        elif kind == 'li':
            out.append(f'<li>{html.escape(content)}</li>')
        elif kind == 'h3':
            out.append(f'<h4 class="prd-doc-h3">{html.escape(content)}</h4>')
        else:
            out.append(f'<p>{html.escape(content)}</p>')
    html_out = []
    in_ul = False
    for piece in out:
        if piece.startswith('<li>'):
            if not in_ul:
                html_out.append('<ul class="prd-doc-list">')
                in_ul = True
            html_out.append(piece)
        else:
            if in_ul:
                html_out.append('</ul>')
                in_ul = False
            html_out.append(piece)
    if in_ul:
        html_out.append('</ul>')
    return ''.join(html_out)

CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

def strip_num(t):
    return re.sub(r'^\d+(?:\.\d+)*\.?\s+', '', t)

def orig_num(t):
    m = re.match(r'^(\d+(?:\.\d+)*)\.?\s+', t)
    return m.group(1) if m else ''

def sec_id(orig, fallback):
    return 'prd-sec-' + orig.replace('.', '-') if orig else fallback

# 组织树：h1 章 → h2 节（h3 已并入上级 blocks）
tree = []
cur1 = None
for sec in sections:
    if sec['level'] == 1:
        cur1 = {'sec': sec, 'subs': []}
        tree.append(cur1)
    elif sec['level'] == 2 and cur1 is not None:
        cur1['subs'].append(sec)

def renumber_blocks(blocks, mode, base):
    """重排 blocks 中的 h3 标题：mode 'dot' 编号为 base.k（全局三级），mode 'flat' 编号为 k（页面模块二级）"""
    out = []
    k = 0
    for kind, content in blocks:
        if kind == 'h3':
            k += 1
            content = (f'{base}.{k}、' if mode == 'dot' else f'{k}、') + strip_num(content)
        out.append((kind, content))
    return out

def h1_html(t):
    return f'<h2 class="prd-doc-h1">{html.escape(t)}</h2>'

def h2_html(t):
    return f'<h3 class="prd-doc-h2">{html.escape(t)}</h3>'

render_blocks_src = render_blocks

def render_blocks(blocks):
    return render_blocks_src([(k, rewrite_refs(c)) for k, c in blocks])

# ---- 全局介绍：章=一、二、三、四；节=1、2；子节=1.1 ----
global_parts = []
global_nav = []
g_nodes = [n for n in tree if re.match(r'^[1-4]\.', n['sec']['title'])]
for i, node in enumerate(g_nodes):
    sid = sec_id(orig_num(node['sec']['title']), f'prd-sec-g{i + 1}')
    t1 = f'{CN_NUM[i]}、{strip_num(node["sec"]["title"])}'
    global_nav.append({'id': sid, 'title': t1})
    inner = [h1_html(t1), render_blocks(node['sec']['blocks'])]
    for j, sub in enumerate(node['subs'], 1):
        inner.append(h2_html(f'{j}、{strip_num(sub["title"])}'))
        inner.append(render_blocks(renumber_blocks(sub['blocks'], 'dot', j)))
    global_parts.append(f'<div class="prd-module-sec" id="{sid}">' + ''.join(inner) + '</div>')
global_html = ''.join(global_parts)

# ---- 页面与功能描述：模块=一、二、三、四、五；子节=1、2 ----
pages_parts = []
pages_nav = []
n5 = next((n for n in tree if re.match(r'^5\.', n['sec']['title'])), None)
if n5 and n5['sec']['blocks']:
    pages_parts.append(render_blocks(n5['sec']['blocks']))
for i, sub in enumerate(n5['subs'] if n5 else [], 1):
    sid = sec_id(orig_num(sub['title']), f'prd-sec-p{i}')
    t1 = f'{CN_NUM[i - 1]}、{strip_num(sub["title"])}'
    pages_nav.append({'id': sid, 'title': t1})
    inner = [h1_html(t1), render_blocks(renumber_blocks(sub['blocks'], 'flat', None))]
    pages_parts.append(f'<div class="prd-module-sec" id="{sid}">' + ''.join(inner) + '</div>')
pages_html = ''.join(pages_parts)

data = {
    'title': '产业链全景图谱平台产品需求文档（PRD）',
    'tabs': [
        {'id': 'global', 'label': '全局介绍'},
        {'id': 'pages', 'label': '页面与功能描述'},
    ],
    'globalHtml': global_html,
    'pagesHtml': pages_html,
    'globalNav': global_nav,
    'pagesNav': pages_nav,
}

js = '/* 由 产业链全景图谱平台PRD文档.docx 自动生成（python prd-extract.py），勿手工编辑 */\nwindow.WUDU_PRD = ' + json.dumps(data, ensure_ascii=False) + ';\n'
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)
print('global len:', len(global_html), ' pages len:', len(pages_html))
print('global nav:')
for n in global_nav:
    print('  ', n['id'], n['title'])
print('pages nav:')
for n in pages_nav:
    print('  ', n['id'], n['title'])
bad = [kw for kw in ('<w:', 'w:val', 'HYPERLINK', 'PAGEREF') if kw in global_html or kw in pages_html]
print('leak check:', bad or 'clean')
