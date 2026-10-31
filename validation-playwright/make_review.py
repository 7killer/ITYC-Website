"""Build the local audit of reviewed Playwright references and source changes."""
from pathlib import Path
import difflib
import hashlib
import html
import json
from urllib.parse import quote

report_dir = Path(__file__).resolve().parent
project = report_dir.parent
references = project / "tests/visual/responsive.spec.ts-snapshots"

reasons = {
    **dict.fromkeys([
        "polaires-mobile-360", "polaires-tablette-768", "polaires-ipad-air",
        "polaires-laptop", "polaires-desktop",
    ], "La référence montrait encore trois graphiques en calcul (86 à 98 %). Le rendu vérifié contient six graphiques terminés. Les contrôles TWA/TWS correspondent aux axes ; les commandes ne se recouvrent plus à 1280/1440 px."),
    **dict.fromkeys([
        "penalites-mobile-360", "penalites-mobile-390",
    ], "La grille de Rentabilité débordait et superposait ses champs. Les réglages sont empilés et le graphique conserve au moins 320 px. Les données restent identiques ; les audits contrôlent aussi la largeur et la carte suivante."),
    "penalites-ipad-air": "La référence utilisait l'ancien ordre des cartes et les temps en secondes seulement. Le rendu actuel respecte les tests existants : Simples, Rentabilité, Doubles, avec secondes et minutes, et résultats sous les réglages.",
    **dict.fromkeys([
        "energie-ipad-air", "energie-laptop",
    ], "Les champs trop étroits recouvraient leurs libellés. Leur largeur est corrigée et leur lisibilité est vérifiée à 820/1280 px. La référence iPad conservait aussi une ancienne disposition et un axe en secondes ; les valeurs calculées n'ont pas changé."),
    **dict.fromkeys([
        "voiles-auto-mobile-360", "voiles-auto-mobile-390", "voiles-auto-tablette-768",
    ], "La référence contenait des calculs incomplets et d'anciennes légendes. Les graphiques terminés ont un cadre indépendant du canvas, une hauteur stable et six libellés lisibles. Les plages TWS 2,8–36,7 nds et TWA 62,9–132,1° sont conservées ; le recouvrement vide est explicite."),
}

def uri(path):
    return quote(path.relative_to(report_dir).as_posix())

records = []
sections = []
for original in sorted((report_dir / "references-before").glob("*.png")):
    current = references / original.name
    before = hashlib.sha256(original.read_bytes()).hexdigest()
    after = hashlib.sha256(current.read_bytes()).hexdigest()
    if before == after:
        continue
    case = original.name.removesuffix("-win32.png")
    if case not in reasons:
        raise ValueError(f"Unreviewed changed reference: {case}")
    reviewed = list((report_dir / "review").glob(f"*/{case}-actual.png"))
    if len(reviewed) != 1 or reviewed[0].read_bytes() != current.read_bytes():
        raise ValueError(f"Reference differs from the reviewed image: {case}")
    records.append({"reference": original.name, "before_sha256": before,
                    "after_sha256": after, "reason": reasons[case]})
    panels = []
    for title, path in [("Référence d'origine", original), ("Rendu vérifié", reviewed[0])]:
        panels.append(f'<figure><figcaption><a href="{uri(path)}" target="_blank">{title} · ouvrir</a></figcaption>'
                      f'<div class="image"><img src="{uri(path)}" alt="{html.escape(title + " : " + case)}" loading="lazy"></div></figure>')
    sections.append(f'<details><summary>{html.escape(case)}</summary><p>{html.escape(reasons[case])}</p>'
                    f'<div class="comparison">{"".join(panels)}</div></details>')

if len(records) != len(reasons):
    raise ValueError(f"Expected {len(reasons)} reviewed references, got {len(records)}")
(report_dir / "reviewed-references.json").write_text(
    json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

document = '''<!doctype html><html lang="fr"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Comparaison des rendus Playwright</title>
<style>
body{font:16px/1.55 system-ui,sans-serif;background:#111722;color:#e8edf5;margin:0 auto;padding:2rem;max-width:1400px}
a{color:#95c8ff}h1{line-height:1.2}details{margin:1rem 0;padding:1rem;border:1px solid #485568;border-radius:8px}
summary{cursor:pointer;font-weight:700}.comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
figure{margin:0;min-width:0}figcaption{padding:.5rem 0}.image{height:65vh;overflow:auto;background:#202225;border:1px solid #485568}
img{display:block;max-width:100%;height:auto;margin:auto}@media(max-width:700px){body{padding:1rem}.comparison{grid-template-columns:1fr}}
</style>
<h1>Comparaison des rendus Playwright</h1>
<p>13 références actualisées après correction et revue visuelle ; 23 références restent inchangées.
Les anciennes captures sont conservées. La tolérance de comparaison reste à 1 % et aucun test existant n'a été supprimé.</p>
<p>Les nouveaux tests contrôlent les défauts corrigés indépendamment des images : débordements, chevauchements,
hauteur des graphiques, état vide et stabilité après les calculs.</p>
<p><a href="changes.diff">Voir les modifications des sources</a> · <a href="reviewed-references.json">Empreintes et justification de chaque capture</a></p>
'''
(report_dir / "references-review.html").write_text(
    document + "\n".join(sections) + "</html>\n", encoding="utf-8")

pairs = [
    ("src/styles/analysis.css", "ityc-analysis-css-before-mobile-fix-20261028.css"),
    ("src/styles/polar.css", "polar.before-controls-layout-20261028-235842.css"),
    ("src/styles/autosail.css", "ityc-autosail-css-before-stable-chart-height-20261029.css"),
    ("src/features/autosail/AutoSailPage.tsx", "ityc-autosail-empty-usage-vsccnwsj/AutoSailPage.tsx"),
    ("tests/visual/help-captures.spec.ts", "help-captures.before-fixture-20261028-234248.spec.ts"),
    ("tests/visual/responsive.spec.ts", "ityc-responsive-chart-ready-8pe99h_p/responsive.spec.ts"),
    ("src/features/help/content/fr/nouvelle-interface.md", "ityc-help-image-urls-06uon3nj/fr/nouvelle-interface.md"),
    ("src/features/help/content/en/nouvelle-interface.md", "ityc-help-image-urls-06uon3nj/en/nouvelle-interface.md"),
    ("src/features/help/content/fr/tuto_autoSail.md", "ityc-help-image-urls-06uon3nj/fr/tuto_autoSail.md"),
    *[(f"tests/visual/{name}.spec.ts", None) for name in [
        "energy-responsive", "autosail-empty-zone", "penalties-mobile-layout",
        "polar-controls-layout", "autosail-layout",
    ]],
]
temporary = Path("C:/Users/sebas/AppData/Local/Temp")
diff = []
for relative, backup in pairs:
    before = (temporary / backup).read_text(encoding="utf-8").splitlines(keepends=True) if backup else []
    after = (project / relative).read_text(encoding="utf-8").splitlines(keepends=True)
    diff.extend(difflib.unified_diff(before, after, fromfile="a/" + relative, tofile="b/" + relative))
(report_dir / "changes.diff").write_text("".join(diff), encoding="utf-8")
print(f"Reviewed references: {len(records)}; source diff: {len(diff)} lines")
