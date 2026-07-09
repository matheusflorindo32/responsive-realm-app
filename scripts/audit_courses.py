#!/usr/bin/env python3
"""Auditoria + auto-fix de apos-master.json.

Fases 2 e 3 do plano. Gera relatório em docs/audit/report.json,
aplica correções determinísticas em src/data/apos-master.json e
grava histórico antes/depois em docs/audit/historico.json.

Executar de novo é idempotente."""

from __future__ import annotations
import json, re, copy, hashlib, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src/data/apos-master.json"
AUDIT_DIR = ROOT / "docs/audit"
AUDIT_DIR.mkdir(parents=True, exist_ok=True)

# ---------- Dicionário de correções de OCR (splits conhecidos) ----------
# Ordem importa: mais específico primeiro. Case-insensitive por padrão.
OCR_SPLITS = [
    # nomes próprios / instituições
    (r"\bBRA\s+SIL\b", "BRASIL"),
    (r"\bBra\s+sil\b", "Brasil"),
    (r"\bBra\s+sileira\b", "Brasileira"),
    (r"\bB\s+rasileira\b", "Brasileira"),
    (r"\bLeonar\s+do\b", "Leonardo"),
    (r"\bCentr\s+o\b", "Centro"),
    (r"\bUniv\s+ersitário\b", "Universitário"),
    (r"\bUNIA\s+SS\b", "UNIASSELVI"),
    (r"\bUnia\s+sselvi\b", "Uniasselvi"),
    (r"\bGr\s+ande\b", "Grande"),
    (r"\bRio\s+Gr\s+ande\b", "Rio Grande"),
    (r"\bPúbl\s+ica\b", "Pública"),
    (r"\bpúbl\s+ica\b", "pública"),
    (r"\bAdministr\s+ação\b", "Administração"),
    (r"\bEscola\s+Nacional\s+de\s+Administr\s+ação\b", "Escola Nacional de Administração"),
    (r"\bAgência\s+Espacial\s+B\s+rasileira\b", "Agência Espacial Brasileira"),
    (r"\bMi\s+litar\b", "Militar"),
    (r"\bP\s+olícia\b", "Polícia"),
    (r"\bF\s+ederal\b", "Federal"),
    (r"\bINSTITUT\s+O\b", "INSTITUTO"),
    (r"\bInstitut\s+o\b", "Instituto"),
    (r"\bPENINSUL\s+A\b", "PENÍNSULA"),
    (r"\bPeninsul\s+a\b", "Península"),
    (r"\bGoogle\s+I\s+nc\.", "Google Inc."),
    # palavras genéricas
    (r"\bBachar\s+elado\b", "Bacharelado"),
    (r"\bDIGIT\s+AIS\b", "DIGITAIS"),
    (r"\bGEOPOLÍT\s+ICA\b", "GEOPOLÍTICA"),
    (r"\bAEROESP\s+ACIAL\b", "AEROESPACIAL"),
    (r"\bPENSAMENT\s+O\b", "PENSAMENTO"),
    (r"\bCOMPUT\s+ACIONAL\b", "COMPUTACIONAL"),
    (r"\bHEAR\s+TH\b", "EARTH"),
    (r"\bTECNICA\s+S\b", "TÉCNICAS"),
    (r"\bTÁTICA\s+S\b", "TÁTICAS"),
    (r"\bPRÁTICA\s+S\b", "PRÁTICAS"),
    (r"\bPARCERIA\s+S\b", "PARCERIAS"),
    (r"\bFERRAMENT\s+AS\b", "FERRAMENTAS"),
    (r"\bFerrament\s+as\b", "Ferramentas"),
    (r"\bIMPOR\s+TÂNCIA\b", "IMPORTÂNCIA"),
    (r"\bSUPOR\s+TE\b", "SUPORTE"),
    (r"\bTIR\s+O\b", "TIRO"),
    (r"\bTir\s+o\b", "Tiro"),
    (r"\bFUZI\s+L\b", "FUZIL"),
    (r"\bFuzi\s+l\b", "Fuzil"),
    (r"\bmetr\s+os\b", "metros"),
    (r"\bAdestr\s+amento\b", "Adestramento"),
    (r"\bGuerr\s+a\b", "Guerra"),
    (r"\bMulher\s+es\b", "Mulheres"),
    (r"\bMenina\s+s\b", "Meninas"),
    (r"\bCONGRES\s+SO\b", "CONGRESSO"),
    (r"\bCongres\s+so\b", "Congresso"),
    (r"\bBUSINES\s+S\b", "BUSINESS"),
    (r"\bAMBIENT\s+AL\b", "AMBIENTAL"),
    (r"\bFISIOL\s+OGIA\b", "FISIOLOGIA"),
    (r"\bFisiol\s+ogia\b", "Fisiologia"),
    (r"\bGL\s+OBAL\b", "GLOBAL"),
    (r"\bGl\s+obal\b", "Global"),
    (r"\bESPOR\s+TE\b", "ESPORTE"),
    (r"\bDIDÁTICA\s+PARA\s+INSTRUT\s+ORES\b", "DIDÁTICA PARA INSTRUTORES"),
    (r"\bINSTRUT\s+ORES\b", "INSTRUTORES"),
    (r"\bCONCEIT\s+OS\b", "CONCEITOS"),
    (r"\bTURBINAR\s+A\b", "TURBINAR A"),
    (r"\bTUR\s+BINAR\b", "TURBINAR"),
    (r"\bMUND\s+O\b", "MUNDO"),
    (r"\bMund\s+o\b", "Mundo"),
    (r"\bT\s+OP\b", "TOP"),
    (r"\bCINO\s+TECNIA\b", "CINOTECNIA"),
    (r"\bCino\s+tecnia\b", "Cinotecnia"),
    (r"\bcongr\s+esso\b", "congresso"),
    (r"\bCongr\s+esso\b", "Congresso"),
    (r"\bS\s+eminário\b", "Seminário"),
    (r"\bExplosiv\s+os\b", "Explosivos"),
    (r"\bCar\s+ga\b", "Carga"),
    (r"\bhor\s+ária\b", "horária"),
    (r"\bIntroduction\s+T\s+o\b", "Introduction to"),
    (r"\bMato\s+Gr\s+oss?o\b", "Mato Grosso"),
    (r"\bGr\s+osso\b", "Grosso"),
    (r"\bEspeciali?\s+zação\b", "Especialização"),
    (r"\bEspecial\s+ização\b", "Especialização"),
    (r"\bespecial\s+ização\b", "especialização"),
    (r"\bEspecial\s+istas\b", "Especialistas"),
    (r"\bAcadêmic\s+o\b", "Acadêmico"),
    (r"\bacadêmic\s+o\b", "acadêmico"),
    (r"\bVIR\s+TUAL\b", "VIRTUAL"),
    (r"\bGENERA\s+TIVE\b", "GENERATIVE"),
    # OCR bizarros específicos
    (r"\bAL\s+AS\s+YOUR\b", "AI AS YOUR"),
    (r"\bPERTNER\b", "PARTNER"),
    (r"\bGENERATIVE\s+AL\b", "GENERATIVE AI"),
    # colagens em CamelCase
    (r"EspeciaisPMES", "Especiais - PMES"),
    (r"PolicialPMES", "Policial - PMES"),
]

# Siglas que devem permanecer em CAPS ao aplicar Title Case
KEEP_UPPER = {"PMES","PM","DPF","IFES","ENAP","UNIASSELVI","IFRS","UERGS","AEB",
              "CBEFIS","IP","MB","IA","AI","EAD","A3P","CORPAS","CENSIPAM",
              "SECTI","UFES","CEFD","OPENAI","OPEN","CBSP","M16","EUA",
              "UnB","USP","CNPq","UFRJ","INPE","BR","URL","PDF"}

# ---------- Helpers ----------

def apply_ocr(text: str) -> tuple[str, list[str]]:
    """Aplica dicionário de OCR e retorna (novo_texto, lista_de_regras_disparadas)."""
    if not text:
        return text, []
    hits = []
    out = text
    for pat, repl in OCR_SPLITS:
        new = re.sub(pat, repl, out, flags=re.IGNORECASE if pat.islower() else 0)
        if new != out:
            hits.append(pat)
            out = new
    # colapsa espaços duplos e espaços antes de pontuação
    out = re.sub(r"\s{2,}", " ", out)
    out = re.sub(r"\s+([,.;:])", r"\1", out)
    return out.strip(), hits


def is_all_caps(s: str) -> bool:
    letters = re.sub(r"[^A-Za-zÀ-ÿ]", "", s)
    return bool(letters) and letters == letters.upper() and len(letters) > 6


def smart_title(s: str) -> str:
    """Title case respeitando siglas e stopwords."""
    if not s:
        return s
    stop = {"de","da","do","dos","das","e","em","a","o","na","no","para","com","por","à","ao","aos","às","um","uma"}
    words = re.split(r"(\s+|[-/])", s.lower())
    out = []
    for i, w in enumerate(words):
        if not w.strip() or w in ("-","/"):
            out.append(w); continue
        up = w.upper()
        if up in KEEP_UPPER:
            out.append(up)
        elif w in stop and i != 0:
            out.append(w)
        else:
            # capitaliza primeiro char preservando acentos
            out.append(w[:1].upper() + w[1:])
    return "".join(out)


def extract_hours(title: str) -> tuple[str, str | None]:
    """Extrai '(Carga horária: Xh)' do título e retorna (título_limpo, hours)."""
    if not title:
        return title, None
    m = re.search(r"\(?\s*Carga\s+hor[aá]ria\s*:?\s*(\d+)\s*h?\s*\)?", title, re.IGNORECASE)
    if not m:
        return title, None
    hours = f"{m.group(1)}h"
    clean = re.sub(r"[.\s]*\(?\s*Carga\s+hor[aá]ria\s*:?\s*\d+\s*h?\s*\)?\.?\s*$", "", title, flags=re.IGNORECASE).strip(" .")
    return clean, hours


def sep_glued_siglas(s: str) -> str:
    """Separa siglas grudadas: 'PolicialPMES' -> 'Policial - PMES'."""
    if not s: return s
    for sig in ("PMES","PMS","DPF","IFES","UFES","IFRS","AEB","ENAP","CBEFIS","UERGS"):
        s = re.sub(rf"([a-záéíóúãõâêôç])({sig})\b", r"\1 - \2", s)
    return s


# Instituições militares — preenchimento manual determinístico
MILITARY_INST = {
    "curso de formação de soldado da polícia militar do espírito santo": "Polícia Militar do Estado do Espírito Santo (PMES)",
    "curso de formação de soldados fuzileiros navais": "Marinha do Brasil (MB)",
    "curso de ações táticas especiais": "Polícia Militar do Estado do Espírito Santo (PMES)",
    "curso de cinotecnia policial": "Polícia Militar do Estado do Espírito Santo (PMES)",
    "curso de adestramento de cães para emprego policial": "Polícia Militar do Estado do Espírito Santo (PMES)",
    "seminário de faro de explosivos": "Polícia Militar do Estado do Espírito Santo (PMES)",
    "estágio de qualificação técnica especial em adestramento de cães de guerra": "Marinha do Brasil (MB)",
    "estágio de tiro de fuzil m16 - 200 metros": "Marinha do Brasil (MB)",
}
MILITARY_YEAR = {
    "curso de formação de soldado da polícia militar do espírito santo": "2013 - 2013",
    "curso de formação de soldados fuzileiros navais": "2010 - 2010",
    "curso de ações táticas especiais": "2014 - 2014",
    "curso de cinotecnia policial": "2014 - 2014",
    "curso de adestramento de cães para emprego policial": "2014 - 2014",
    "seminário de faro de explosivos": "2015 - 2015",
    "estágio de qualificação técnica especial em adestramento de cães de guerra": "2012 - 2012",
    "estágio de tiro de fuzil m16 - 200 metros": "2011 - 2011",
}

# ---------- Auditoria ----------

def audit_course(idx: int, c: dict) -> list[dict]:
    achados = []
    course = c.get("course") or ""
    inst = c.get("institution") or ""
    yp = c.get("year_period") or ""
    hrs = c.get("hours")

    # ocr
    new_course, hits_c = apply_ocr(course)
    new_inst, hits_i = apply_ocr(inst)
    if hits_c or hits_i:
        achados.append({
            "categoria": "ocr_split",
            "gravidade": "alto",
            "descricao": f"Palavras quebradas por OCR ({len(hits_c)+len(hits_i)} padrões)",
            "acao": "auto_fix",
            "payload": {"course": new_course, "institution": new_inst},
        })
        course, inst = new_course, new_inst

    # hours embutida
    clean_title, hh = extract_hours(course)
    if hh and not hrs:
        achados.append({
            "categoria": "hours_embed",
            "gravidade": "medio",
            "descricao": f"Carga horária embutida no título: {hh}",
            "acao": "auto_fix",
            "payload": {"course": clean_title, "hours": hh},
        })
        course = clean_title
        hrs = hh

    # sigla grudada
    sep = sep_glued_siglas(course)
    if sep != course:
        achados.append({
            "categoria": "sigla_grudada",
            "gravidade": "alto",
            "descricao": "Sigla colada ao texto anterior",
            "acao": "auto_fix",
            "payload": {"course": sep},
        })
        course = sep

    # caixa alta
    if is_all_caps(course):
        tc = smart_title(course)
        achados.append({
            "categoria": "caixa_alta",
            "gravidade": "medio",
            "descricao": "Título 100% em CAPS",
            "acao": "auto_fix",
            "payload": {"course": tc},
        })
        course = tc

    # instituição também
    if is_all_caps(inst):
        ti = smart_title(inst)
        achados.append({
            "categoria": "caixa_alta",
            "gravidade": "baixo",
            "descricao": "Instituição em CAPS",
            "acao": "auto_fix",
            "payload": {"institution": ti},
        })
        inst = ti

    # instituição militar faltando
    key = course.lower().strip()
    if not inst.strip() and key in MILITARY_INST:
        achados.append({
            "categoria": "campos_faltando",
            "gravidade": "alto",
            "descricao": "Instituição militar preenchida por regra determinística",
            "acao": "auto_fix",
            "payload": {"institution": MILITARY_INST[key]},
        })
        inst = MILITARY_INST[key]
    if not yp and key in MILITARY_YEAR:
        achados.append({
            "categoria": "campos_faltando",
            "gravidade": "alto",
            "descricao": "Período militar estimado a partir do CV Lattes",
            "acao": "auto_fix",
            "payload": {"year_period": MILITARY_YEAR[key]},
        })
        yp = MILITARY_YEAR[key]

    # limpa "instituição" tipo "Grande do Sul, IFRS, Brasil" que virou fragmento
    inst_cleaned = re.sub(r"^(?:Grande do Sul|Espírito Santo|Brasil),\s*", "", inst).strip()
    if inst_cleaned != inst and inst_cleaned:
        # não aplica auto — sugere revisão manual
        pass

    # pendentes p/ revisão manual
    if not inst.strip():
        achados.append({
            "categoria": "campos_faltando",
            "gravidade": "alto",
            "descricao": "Instituição vazia — precisa preencher manualmente",
            "acao": "manual",
            "payload": {},
        })
    if not yp:
        achados.append({
            "categoria": "campos_faltando",
            "gravidade": "medio",
            "descricao": "Período vazio — precisa preencher manualmente",
            "acao": "manual",
            "payload": {},
        })
    if not hrs and c.get("category") not in ("Congresso","Simpósio","Seminário"):
        achados.append({
            "categoria": "campos_faltando",
            "gravidade": "baixo",
            "descricao": "Carga horária vazia",
            "acao": "manual",
            "payload": {},
        })

    for a in achados:
        a["idx"] = idx
        a["course"] = course[:100]
    return achados


def audit_formacao(idx: int, e: dict) -> list[dict]:
    achados = []
    for field in ("course","institution"):
        v = e.get(field) or ""
        nv, hits = apply_ocr(v)
        if hits:
            achados.append({
                "idx": idx, "categoria": "ocr_split", "gravidade": "alto",
                "descricao": f"OCR em formação.{field}",
                "acao": "auto_fix",
                "payload": {field: nv},
            })
    return achados


# ---------- Aplicação ----------

def apply_course_fixes(c: dict, achados: list[dict]) -> dict:
    out = copy.deepcopy(c)
    for a in achados:
        if a["acao"] != "auto_fix": continue
        for k, v in a["payload"].items():
            out[k] = v
    return out


def dedupe_militares(courses: list[dict]) -> tuple[list[dict], list[dict]]:
    """Remove entradas vazias e mescla duplicatas militares."""
    log = []
    # remove entradas 100% vazias
    kept = []
    for c in courses:
        title = (c.get("course") or "").strip()
        if not title:
            log.append({"acao":"remove","motivo":"registro vazio","id":c.get("id")})
            continue
        kept.append(c)

    # detecta duplicatas por título normalizado (agressivo p/ militares)
    def norm(s):
        s = unicodedata.normalize("NFKD", s.lower())
        s = "".join(ch for ch in s if not unicodedata.combining(ch))
        s = re.sub(r"[^a-z0-9]+"," ", s).strip()
        # remove prefixos/sufixos comuns que causam falsos negativos
        s = re.sub(r"^(curso de|estagio de|seminario de|especializacao em)\s+", "", s)
        s = re.sub(r"\s+(pmes|dpf|mb|policial)\s*$", "", s)
        return s.strip()
    seen = {}
    result = []
    for c in kept:
        k = norm(c.get("course") or "")
        if k in seen:
            # mescla: preserva campos preenchidos do primeiro, complementa com o segundo
            first = seen[k]
            merged = {**first}
            for field in ("institution","year_period","hours","certificate_url","source_lattes"):
                if not merged.get(field) and c.get(field):
                    merged[field] = c[field]
            # se ambos têm campo, mantém o mais longo (menos truncado)
            for field in ("course","institution"):
                a, b = merged.get(field) or "", c.get(field) or ""
                if len(b) > len(a) and b:
                    merged[field] = b
            # substitui no result
            for i, r in enumerate(result):
                if r is first:
                    result[i] = merged
                    seen[k] = merged
                    break
            log.append({"acao":"merge","chave":k,"id_removido":c.get("id"),"id_mantido":first.get("id")})
        else:
            seen[k] = c
            result.append(c)
    return result, log


def hash_obj(o) -> str:
    return hashlib.md5(json.dumps(o, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:10]


# ---------- Main ----------

def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    before = copy.deepcopy(data)

    report = {"cursos": [], "formacao": [], "dedupe": [], "resumo": {}}
    hist = []

    # Cursos
    new_cursos = []
    for i, c in enumerate(data.get("07_Cursos", [])):
        achados = audit_course(i, c)
        report["cursos"].extend(achados)
        fixed = apply_course_fixes(c, achados)
        if hash_obj(fixed) != hash_obj(c):
            hist.append({"secao":"07_Cursos","idx":i,"id":c.get("id"),
                         "antes":c,"depois":fixed})
        new_cursos.append(fixed)

    # Dedupe militares + remove vazios
    new_cursos, dedupe_log = dedupe_militares(new_cursos)
    report["dedupe"] = dedupe_log
    data["07_Cursos"] = new_cursos

    # Formação
    new_form = []
    for i, e in enumerate(data.get("06_Formacao", [])):
        achados = audit_formacao(i, e)
        report["formacao"].extend(achados)
        fixed = copy.deepcopy(e)
        for a in achados:
            if a["acao"] == "auto_fix":
                for k, v in a["payload"].items():
                    fixed[k] = v
        if hash_obj(fixed) != hash_obj(e):
            hist.append({"secao":"06_Formacao","idx":i,"antes":e,"depois":fixed})
        new_form.append(fixed)
    data["06_Formacao"] = new_form

    # Resumo
    from collections import Counter
    cat = Counter(a["categoria"] for a in report["cursos"])
    acao = Counter(a["acao"] for a in report["cursos"])
    report["resumo"] = {
        "cursos_total_antes": len(before.get("07_Cursos", [])),
        "cursos_total_depois": len(data["07_Cursos"]),
        "achados_por_categoria": dict(cat),
        "achados_por_acao": dict(acao),
        "dedupe_operacoes": len(dedupe_log),
    }

    # Salva
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    (AUDIT_DIR / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    (AUDIT_DIR / "historico.json").write_text(json.dumps(hist, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps(report["resumo"], ensure_ascii=False, indent=2))
    print(f"\nRelatório: {AUDIT_DIR/'report.json'}")
    print(f"Histórico: {AUDIT_DIR/'historico.json'}")


if __name__ == "__main__":
    main()
