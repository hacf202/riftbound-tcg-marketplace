import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCS_DIR = r"D:\BlockChain\docs"

def set_cell_background(cell, fill_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def format_run_text(p, text):
    # Regex parse bold (**text**), inline code (`code`), math ($...$), links ([text](url))
    # We parse token by token
    tokens = re.split(r'(\*\*.*?\*\*|`.*?`|\$.*?\$|\[.*?\]\(.*?\))', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**') and len(token) >= 4:
            run = p.add_run(token[2:-2])
            run.bold = True
        elif token.startswith('`') and token.endswith('`') and len(token) >= 2:
            run = p.add_run(token[1:-1])
            run.font.name = 'Consolas'
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(194, 65, 12) # Dark orange/rust
        elif token.startswith('$') and token.endswith('$') and len(token) >= 2:
            run = p.add_run(token[1:-1])
            run.italic = True
            run.font.name = 'Cambria Math'
        elif token.startswith('[') and '](' in token and token.endswith(')'):
            match = re.match(r'\[(.*?)\]\((.*?)\)', token)
            if match:
                link_text = match.group(1)
                run = p.add_run(link_text)
                run.font.color.rgb = RGBColor(37, 99, 235) # Blue
                run.underline = True
            else:
                p.add_run(token)
        else:
            p.add_run(token)

def add_styled_heading(doc, text, level):
    clean_text = re.sub(r'#+\s*', '', text).strip()
    h = doc.add_heading(level=level)
    h.paragraph_format.keep_with_next = True
    h.paragraph_format.space_before = Pt(14 if level == 1 else 10 if level == 2 else 8)
    h.paragraph_format.space_after = Pt(4)
    run = h.add_run(clean_text)
    if level == 1:
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(17)
        run.font.color.rgb = RGBColor(30, 58, 138) # Dark Navy #1E3A8A
        run.bold = True
    elif level == 2:
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(13.5)
        run.font.color.rgb = RGBColor(15, 23, 42) # Slate #0F172A
        run.bold = True
    elif level == 3:
        run.font.name = 'Segoe UI Semibold'
        run.font.size = Pt(11.5)
        run.font.color.rgb = RGBColor(13, 148, 136) # Teal #0D9488
        run.bold = True
    else:
        run.font.name = 'Segoe UI'
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(51, 65, 85)
        run.bold = True
    return h

def add_code_block(doc, code_lines, lang=""):
    code_text = "\n".join(code_lines)
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border highlight
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="3B82F6"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.0)
    run.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_mermaid_block(doc, mermaid_lines):
    full_text = "\n".join(mermaid_lines)
    # Determine type
    diag_type = "SƠ ĐỒ TRỰC QUAN (MERMAID DIAGRAM)"
    if "sequenceDiagram" in full_text:
        diag_type = "SƠ ĐỒ TUẦN TỰ WORKFLOW (SEQUENCE DIAGRAM)"
    elif "flowchart" in full_text:
        diag_type = "SƠ ĐỒ LUỒNG THỰC THI (FLOWCHART)"
    elif "graph" in full_text:
        diag_type = "SƠ ĐỒ KIẾN TRÚC & QUAN HỆ (ARCHITECTURE GRAPH)"
        
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(2)
    p_title.paragraph_format.keep_with_next = True
    r_badge = p_title.add_run(f"📊 {diag_type}")
    r_badge.font.name = 'Segoe UI Semibold'
    r_badge.font.size = Pt(10)
    r_badge.font.color.rgb = RGBColor(37, 99, 235)
    r_badge.bold = True
    
    # Add table with diagram code
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F0FDF4") # Light mint green
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="BBF7D0"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="16A34A"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="BBF7D0"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="BBF7D0"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(full_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(22, 101, 52)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_table_from_md(doc, table_lines):
    rows = []
    for line in table_lines:
        line = line.strip()
        if not line or not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.split('|')[1:-1]]
        # Skip separator row (e.g. |:---|:---|)
        if all(re.match(r'^:?-+:?$', c) for c in cells if c):
            continue
        rows.append(cells)
        
    if not rows:
        return
        
    num_cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=num_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)
    
    for r_idx, row_data in enumerate(rows):
        is_header = (r_idx == 0)
        tr = table.rows[r_idx]._tr
        trPr = tr.get_or_add_trPr()
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            
        for c_idx in range(num_cols):
            cell = table.cell(r_idx, c_idx)
            val = row_data[c_idx] if c_idx < len(row_data) else ""
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.1
            
            if is_header:
                set_cell_background(cell, "1E293B") # Dark slate
                format_run_text(p, val)
                for run in p.runs:
                    run.font.name = 'Segoe UI Semibold'
                    run.font.size = Pt(9.5)
                    run.font.color.rgb = RGBColor(255, 255, 255)
                    run.bold = True
            else:
                bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                format_run_text(p, val)
                for run in p.runs:
                    run.font.name = 'Segoe UI'
                    run.font.size = Pt(9.0)
                    if not run.bold:
                        run.font.color.rgb = RGBColor(51, 65, 85)
                        
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_callout_box(doc, text, alert_type="NOTE"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    
    color_map = {
        "NOTE": ("EFF6FF", "3B82F6", "Thông Tin Lưu Ý"),
        "TIP": ("F0FDF4", "16A34A", "Mẹo Trình Bày & Điểm Sáng"),
        "IMPORTANT": ("FEF2F2", "DC2626", "Quan Trọng"),
        "WARNING": ("FFFBEB", "D97706", "Cảnh Báo")
    }
    bg_hex, border_hex, title_txt = color_map.get(alert_type, ("EFF6FF", "3B82F6", "Ghi Chú"))
    
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    
    r_hdr = p.add_run(f"📌 {title_txt}: ")
    r_hdr.font.name = 'Segoe UI Semibold'
    r_hdr.font.size = Pt(9.5)
    r_hdr.font.color.rgb = RGBColor(15, 23, 42)
    r_hdr.bold = True
    
    format_run_text(p, text)
    for r in p.runs[1:]:
        r.font.name = 'Segoe UI'
        r.font.size = Pt(9.0)
        
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def markdown_to_docx_body(doc, md_content):
    lines = md_content.split('\n')
    i = 0
    in_code = False
    code_lines = []
    code_lang = ""
    table_lines = []
    
    while i < len(lines):
        line = lines[i]
        
        # Check code fence
        if line.strip().startswith('```'):
            if in_code:
                # end code block
                if code_lang.lower() == 'mermaid':
                    add_mermaid_block(doc, code_lines)
                else:
                    add_code_block(doc, code_lines, code_lang)
                in_code = False
                code_lines = []
                code_lang = ""
            else:
                # Flush table if any
                if table_lines:
                    add_table_from_md(doc, table_lines)
                    table_lines = []
                in_code = True
                code_lang = line.strip()[3:].strip()
                code_lines = []
            i += 1
            continue
            
        if in_code:
            code_lines.append(line)
            i += 1
            continue
            
        # Check table line
        if line.strip().startswith('|') and line.strip().endswith('|'):
            table_lines.append(line)
            i += 1
            continue
        else:
            if table_lines:
                add_table_from_md(doc, table_lines)
                table_lines = []
                
        # Empty line
        if not line.strip():
            i += 1
            continue
            
        # Horizontal rule
        if re.match(r'^-{3,}$', line.strip()) or re.match(r'^\*{3,}$', line.strip()):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            pBorder = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="1" w:color="CBD5E1"/></w:pBdr>')
            p._p.get_or_add_pPr().append(pBorder)
            i += 1
            continue
            
        # Blockquote / Alert
        if line.strip().startswith('>'):
            raw_quote = line.strip()[1:].strip()
            alert_type = "NOTE"
            if raw_quote.startswith('[!NOTE]'):
                alert_type = "NOTE"
                raw_quote = raw_quote[7:].strip()
            elif raw_quote.startswith('[!TIP]'):
                alert_type = "TIP"
                raw_quote = raw_quote[6:].strip()
            elif raw_quote.startswith('[!IMPORTANT]'):
                alert_type = "IMPORTANT"
                raw_quote = raw_quote[12:].strip()
            elif raw_quote.startswith('[!WARNING]'):
                alert_type = "WARNING"
                raw_quote = raw_quote[10:].strip()
                
            # Collect continuous blockquote lines
            quote_lines = [raw_quote]
            while i + 1 < len(lines) and lines[i+1].strip().startswith('>'):
                i += 1
                quote_lines.append(lines[i].strip()[1:].strip())
            add_callout_box(doc, " ".join(quote_lines), alert_type)
            i += 1
            continue
            
        # Headings
        if line.startswith('#'):
            match = re.match(r'^(#+)\s*(.*)$', line)
            if match:
                level = len(match.group(1))
                text = match.group(2)
                add_styled_heading(doc, text, level)
                i += 1
                continue
                
        # Bullet list
        if line.strip().startswith('* ') or line.strip().startswith('- '):
            item_text = line.strip()[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            format_run_text(p, item_text)
            for run in p.runs:
                if not run.font.name:
                    run.font.name = 'Segoe UI'
                run.font.size = Pt(10)
            i += 1
            continue
            
        # Numbered list
        num_match = re.match(r'^\d+\.\s*(.*)$', line.strip())
        if num_match:
            item_text = num_match.group(1)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            format_run_text(p, item_text)
            for run in p.runs:
                if not run.font.name:
                    run.font.name = 'Segoe UI'
                run.font.size = Pt(10)
            i += 1
            continue
            
        # Regular paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        format_run_text(p, line)
        for run in p.runs:
            if not run.font.name:
                run.font.name = 'Segoe UI'
            if not run.font.size:
                run.font.size = Pt(10.5)
        i += 1
        
    if table_lines:
        add_table_from_md(doc, table_lines)

def setup_document_styles(doc):
    # Set standard margins (1 inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer
        footer = section.footer
        p_ft = footer.paragraphs[0]
        p_ft.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_ft = p_ft.add_run("Báo Cáo Học Phần Blockchain - Riftbound TCG Marketplace")
        r_ft.font.name = 'Segoe UI'
        r_ft.font.size = Pt(8.5)
        r_ft.font.color.rgb = RGBColor(148, 163, 184)
        
        header = section.header
        p_hd = header.paragraphs[0]
        p_hd.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r_hd = p_hd.add_run("TRƯỜNG ĐẠI HỌC - KHOA CÔNG NGHỆ THÔNG TIN")
        r_hd.font.name = 'Segoe UI Semibold'
        r_hd.font.size = Pt(8.0)
        r_hd.font.color.rgb = RGBColor(148, 163, 184)

def create_single_doc(file_name, title, md_path):
    doc = docx.Document()
    setup_document_styles(doc)
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    markdown_to_docx_body(doc, content)
    
    out_path = os.path.join(DOCS_DIR, file_name)
    doc.save(out_path)
    print(f"-> Đã tạo thành công: {out_path}")

def create_master_report():
    doc = docx.Document()
    setup_document_styles(doc)
    
    # 1. Trang Bìa Trang Trọng (Academic Cover Page)
    p_top = doc.add_paragraph()
    p_top.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_top.paragraph_format.space_before = Pt(36)
    p_top.paragraph_format.space_after = Pt(4)
    r_uni = p_top.add_run("TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN\nKHOA KỸ THUẬT PHẦN MỀM & MẠNG MÁY TÍNH\n***")
    r_uni.font.name = 'Segoe UI Semibold'
    r_uni.font.size = Pt(12)
    r_uni.font.color.rgb = RGBColor(30, 41, 59)
    r_uni.bold = True
    
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(48)
    p_title.paragraph_format.space_after = Pt(12)
    r_main_title = p_title.add_run("BÁO CÁO GIỮA KỲ HỌC PHẦN\nCÔNG NGHỆ BLOCKCHAIN VÀ ỨNG DỤNG")
    r_main_title.font.name = 'Segoe UI'
    r_main_title.font.size = Pt(22)
    r_main_title.font.color.rgb = RGBColor(30, 58, 138) # Deep navy
    r_main_title.bold = True
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(12)
    p_sub.paragraph_format.space_after = Pt(48)
    r_sub = p_sub.add_run("ĐỀ TÀI: NGHIÊN CỨU & XÂY DỰNG SÀN GIAO DỊCH VẬT PHẨM ẢO\nVÀ THẺ BÀI KỸ THUẬT SỐ DỰA TRÊN CƠ CHẾ KÝ GỬI ESCROW\n(HỆ THỐNG RIFTBOUND TCG MARKETPLACE)")
    r_sub.font.name = 'Segoe UI Semibold'
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(13, 148, 136) # Teal
    
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(64)
    p_meta.paragraph_format.space_after = Pt(12)
    r_meta = p_meta.add_run(
        "Chuẩn Công Nghệ: EVM, ERC-20, ERC-1155, ERC-2981, Hardhat & React\n"
        "Đối Tượng Nghiên Cứu: True Digital Ownership & P2P Trustless Marketplace\n"
        "Năm Học: 2026 - 2027"
    )
    r_meta.font.name = 'Segoe UI'
    r_meta.font.size = Pt(10.5)
    r_meta.font.color.rgb = RGBColor(71, 85, 105)
    r_meta.italic = True
    
    doc.add_page_break()
    
    # 2. Đọc và ghép lần lượt các tài liệu vào Báo cáo tổng thể
    doc_files = [
        ("TOM_TAT_BAO_CAO_GIUA_KY_COT_LOI.md", "TÓM TẮT ĐIỀU HÀNH: BẢN CHẤT CÁC CƠ CHẾ BLOCKCHAIN QUA VÍ DỤ ĐỜI THỰC"),
        ("DOC_01_KIEM_THU_VA_SO_DO_HE_THONG.md", "PHẦN 1: BÁO CÁO KIỂM THỬ TỰ ĐỘNG & HỆ THỐNG SƠ ĐỒ WORKFLOW, SƠ ĐỒ LUỒNG, SƠ ĐỒ CHỨC NĂNG"),
        ("DOC_02_THANH_PHAN_CAU_THANH_VA_CO_CHE_BLOCKCHAIN.md", "PHẦN 2: PHÂN TÍCH CÁC THÀNH PHẦN CẤU THÀNH VÀ CƠ CHẾ CỐT LÕI CỦA BLOCKCHAIN"),
        ("DOC_03_SO_SANH_CONG_NGHE_VA_DIEM_SANG_DU_AN.md", "PHẦN 3: SO SÁNH CÔNG NGHỆ TRƯỚC - SAU (WEB2 VS WEB3), ĐIỂM SÁNG ĐỒ ÁN & BỘ CÂU HỎI VẤN ĐÁP")
    ]
    
    for idx, (fname, part_title) in enumerate(doc_files):
        fpath = os.path.join(DOCS_DIR, fname)
        if not os.path.exists(fpath):
            continue
            
        p_part = doc.add_paragraph()
        p_part.paragraph_format.space_before = Pt(20)
        p_part.paragraph_format.space_after = Pt(12)
        r_part = p_part.add_run(f"=== {part_title} ===")
        r_part.font.name = 'Segoe UI Semibold'
        r_part.font.size = Pt(15)
        r_part.font.color.rgb = RGBColor(30, 58, 138)
        r_part.bold = True
        
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        markdown_to_docx_body(doc, content)
        
        if idx < len(doc_files) - 1:
            doc.add_page_break()
            
    master_path = os.path.join(DOCS_DIR, "BAO_CAO_GIUA_KY_BLOCKCHAIN_RIFTBOUND.docx")
    doc.save(master_path)
    print(f"-> Đã tạo thành công BÁO CÁO TỔNG HỢP TOÀN DIỆN: {master_path}")

if __name__ == "__main__":
    print("==================================================")
    print("🚀 BẮT ĐẦU CHUYỂN ĐỔI BỘ TÀI LIỆU SANG MICROSOFT WORD (.DOCX)")
    print("==================================================")
    
    # 1. Tạo các file Word tài liệu
    create_single_doc(
        "TOM_TAT_BAO_CAO_GIUA_KY_COT_LOI.docx",
        "Tóm Tắt Cốt Lõi Báo Cáo Giữa Kỳ",
        os.path.join(DOCS_DIR, "TOM_TAT_BAO_CAO_GIUA_KY_COT_LOI.md")
    )
    create_single_doc(
        "DOC_01_KIEM_THU_VA_SO_DO_HE_THONG.docx",
        "Kiểm Thử & Sơ Đồ Hệ Thống",
        os.path.join(DOCS_DIR, "DOC_01_KIEM_THU_VA_SO_DO_HE_THONG.md")
    )
    create_single_doc(
        "DOC_02_THANH_PHAN_CAU_THANH_VA_CO_CHE_BLOCKCHAIN.docx",
        "Thành Phần Cấu Thành & Cơ Chế Blockchain",
        os.path.join(DOCS_DIR, "DOC_02_THANH_PHAN_CAU_THANH_VA_CO_CHE_BLOCKCHAIN.md")
    )
    create_single_doc(
        "DOC_03_SO_SANH_CONG_NGHE_VA_DIEM_SANG_DU_AN.docx",
        "So Sánh Công Nghệ & Điểm Sáng Đồ Án",
        os.path.join(DOCS_DIR, "DOC_03_SO_SANH_CONG_NGHE_VA_DIEM_SANG_DU_AN.md")
    )
    
    # 2. Tạo 1 file Báo Cáo Tổng Hợp Toàn Diện (Master Report) có Trang Bìa học thuật
    create_master_report()
    
    print("==================================================")
    print("🎉 HOÀN TẤT TẠO TOÀN BỘ 4 FILE WORD (.DOCX) CHUẨN ĐỒ ÁN!")
    print("==================================================")
