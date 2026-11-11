# -*- coding: utf-8 -*-
"""从 PRD docx 提取结构化内容，生成 prd-content.js"""
import re, html, json, sys

DOCX = r'D:/projects/AI_dowell_2.0/五度产业链/output/prd-industry-chain-20261111/stage3/产业链全景图谱平台PRD文档.docx'
OUT = r'D:/projects/AI_dowell_2.0/五度产业链/prd-content.js'

import zipfile
with zipfile.ZipFile(DOCX) as z:
    xml = z.read('word/document.xml').decode('utf-8')

body_m = re.search(r'<w:body>(.*)</w:body>', xml, re.S)
body = body_m.group(1)

# 按文档顺序切出 w:p / w:tbl 顶层块
blocks = []
pos = 0
token = re.compile(r'<w:tbl>.*?</w:tbl>|<w:p [^>]*>.*?</w:p>|<w:p/>', re.S)
for m in token.finditer(body):
    blocks.append(('tbl' if m.group(0).startswith('<w:tbl') else 'p', m.group(0)))

H_STYLE = {'000005': 1, '000001': 2, '000004': 3}

def para_text(p):
    # 保留段落内换行 <w:br/>
    parts = []
    for m in re.finditer(r'<w:t[^>]*>(.*?)</w:t>|<w:br\s*/?>', p, re.S):
        if m.group(0).startswith('<w:br'):
            parts.append('\n')
        else:
            parts.append(m.group(1))
    t = ''.join(parts)
    t = html.unescape(t)
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
    if m and m.group(1) in H_STYLE:
        return H_STYLE[m.group(1)]
    if not re.match(r'^\d+(\.\d+)*\s+\S', text):
        return None
    if para_num(p):
        return None
    if len(text) > 40:
        return None
    return 1 if re.match(r'^\d+\.\s', text) else (2 if re.match(r'^\d+\.\d+\s', text) else 3)

def table_html(tbl):
    rows = re.findall(r'<w:tr[ >].*?</w:tr>', tbl, re.S)
    out = ['<table class="prd-doc-table"><tbody>']
    for ri, tr in enumerate(rows):
        cells = re.findall(r'<w:tc>.*?</w:tc>', tr, re.S)
        tag = 'th' if ri == 0 else 'td'
        tds = []
        for tc in cells:
            t = ' '.join(para_text(tc).split())
            tds.append(f'<{tag}>{html.escape(t)}</{tag}>')
        out.append('<tr>' + ''.join(tds) + '</tr>')
    out.append('</tbody></table>')
    return ''.join(out)

items = []  # (kind, level, text_or_html)
for kind, frag in blocks:
    if kind == 'tbl':
        items.append(('table', 0, table_html(frag)))
        continue
    text = para_text(frag)
    if not text:
        continue
    lvl = is_heading(frag, text)
    if lvl:
        items.append((f'h{lvl}', lvl, text))
    else:
        n = para_num(frag)
        if n:
            ilvl, numid = n
            items.append(('li', min(ilvl, 2), text))
        else:
            items.append(('p', 0, text))

# 组装 sections：模块 = H1 / H2（含封面前言）
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
            # 封面前言
            cur = {'level': 1, 'title': '文档封面', 'blocks': []}
            sections.append(cur)
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
    # 相邻 li 包 ul
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

def sec_html(sec, with_title=True):
    parts = []
    if with_title:
        tag = {1: 'h2', 2: 'h3'}[sec['level']]
        parts.append(f'<{tag} class="prd-doc-h{sec["level"]}" data-prd-title="{html.escape(sec["title"])}">{html.escape(sec["title"])}</{tag}>')
    parts.append(render_blocks(sec['blocks']))
    return ''.join(parts)

def sec_full_html(sec):
    """模块完整内容：标题 + 自身块 + 其下所有 H3 小节"""
    parts = [sec_html(sec, with_title=True)]
    return ''.join(parts)

# 模块列表：封面 + 每个 H1/H2
modules = []
for i, sec in enumerate(sections):
    label_prefix = '└ ' if sec['level'] == 2 else ''
    modules.append({'id': f'm{i}', 'level': sec['level'], 'title': sec['title']})

full_html = ''.join(sec_html(s, with_title=True) for s in sections)

# 每个模块的完整 html：自身 + 后续连续的更低层级 sections
mod_html = {}
for i, sec in enumerate(sections):
    parts = [sec_html(sec, with_title=True)]
    for nxt in sections[i+1:]:
        if nxt['level'] > sec['level']:
            parts.append(sec_html(nxt, with_title=True))
        else:
            break
    mod_html[f'm{i}'] = ''.join(parts)

data = {
    'title': '产业链全景图谱平台产品需求文档（PRD）',
    'modules': modules,
    'fullHtml': full_html,
    'moduleHtml': mod_html,
}

js = '/* 由 产业链全景图谱平台PRD文档.docx 自动生成，勿手工编辑 */\nwindow.WUDU_PRD = ' + json.dumps(data, ensure_ascii=False) + ';\n'
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)
print('sections:', len(sections))
for m in modules:
    print(' ', m['level'], m['title'][:40])
