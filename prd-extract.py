# -*- coding: utf-8 -*-
"""从 PRD docx 提取结构化内容，生成 prd-content.js
页签结构：全局介绍（1 引言 / 2 用户角色 / 3 产品概述 / 4 全局业务规则）
         + 页面与功能描述（5.1-5.5 各模块，含左侧锚点导航）
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
            tds.append(f'<{tag}>{html.escape(t)}</{tag}>')
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

def sec_html(sec, with_title=True):
    parts = []
    if with_title:
        tag = {1: 'h2', 2: 'h3'}[sec['level']]
        parts.append(f'<{tag} class="prd-doc-h{sec["level"]}">{html.escape(sec["title"])}</{tag}>')
    parts.append(render_blocks(sec['blocks']))
    return ''.join(parts)

def chapter_html(prefix):
    """H1 章节（含其下 H2 小节）完整 html；prefix 如 '1.'"""
    for idx, sec in enumerate(sections):
        if sec['level'] == 1 and sec['title'].startswith(prefix):
            parts = [sec_html(sec, with_title=True)]
            for nxt in sections[idx + 1:]:
                if nxt['level'] > 1:
                    parts.append(sec_html(nxt, with_title=True))
                else:
                    break
            return ''.join(parts)
    return ''

def sub_sections(prefix):
    return [s for s in sections if s['level'] == 2 and s['title'].startswith(prefix)]

global_html = ''.join(chapter_html(p) for p in ('1.', '2.', '3.', '4.'))
chapter5 = next((s for s in sections if s['level'] == 1 and s['title'].startswith('5.')), None)
pages_nav = []
pages_parts = []
if chapter5:
    if chapter5['blocks']:
        pages_parts.append(sec_html(chapter5, with_title=True))
    for sec in sub_sections('5.'):
        sid = 'prd-sec-' + sec['title'].split(' ')[0].replace('.', '-')
        pages_nav.append({'id': sid, 'title': sec['title']})
        pages_parts.append(f'<div class="prd-module-sec" id="{sid}">{sec_html(sec, with_title=True)}</div>')
pages_html = ''.join(pages_parts)

data = {
    'title': '产业链全景图谱平台产品需求文档（PRD）',
    'tabs': [
        {'id': 'global', 'label': '全局介绍'},
        {'id': 'pages', 'label': '页面与功能描述'},
    ],
    'globalHtml': global_html,
    'pagesHtml': pages_html,
    'pagesNav': pages_nav,
}

js = '/* 由 产业链全景图谱平台PRD文档.docx 自动生成（python prd-extract.py），勿手工编辑 */\nwindow.WUDU_PRD = ' + json.dumps(data, ensure_ascii=False) + ';\n'
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)
print('global len:', len(global_html), ' pages len:', len(pages_html), ' nav:', len(pages_nav))
for n in pages_nav:
    print('  ', n['id'], n['title'])
bad = [kw for kw in ('<w:', 'w:val', 'HYPERLINK', 'PAGEREF') if kw in global_html or kw in pages_html]
print('leak check:', bad or 'clean')
