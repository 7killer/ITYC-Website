"""Migrate the historical ITYC help articles without rewriting their content.

Run from any directory: python newSite/scripts/migrate-help.py
Only the Python standard library is required. The generated Markdown remains the
editable documentation source; rerun this importer only to reimport legacy HTML.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass, field
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "newSite/src/features/help/content"
ASSET_DEST = ROOT / "newSite/public/assets/help"
# Keep the dashboard's historical captures in place. Other articles use the
# current help categories, including screenshots renamed since the first import.
ASSET_DIRECTORIES = {
    "dash": "original/dash",
    "aideEnergy": "energy/tuto",
    "aidePena": "penalties/tuto",
    "tutoAutoSail": "autosail",
    "tutoCommon": "common",
    "tutoEnergie": "energy",
    "tutoPolar": "polar",
}
ASSET_RENAMES = {
    "pena_vueensemble.png": "penalties/pena_vueensemble.png",
    "select_boat_game.png": "common/select_boat_game.png",
    "select_boat_ityc.png": "common/select_boat_ityc.png",
    "select_boat_toxcct.png": "common/select_boat_toxcct.png",
    "aideEnergy/energy_loose_ref_curve_vr.png": "energy/tuto/el_ref_curve_vr.png",
    "aideEnergy/energy_recovery_ref_curve_vr.png": "energy/tuto/er_ref_curve_vr.png",
    "tutoEnergie/energie_loose_all.png": "energy/el/el_all.png",
    "tutoEnergie/energie_loose_cal.png": "energy/el/el_cal.png",
    "tutoEnergie/energie_loose_curve.png": "energy/el/el_curve.png",
    "tutoEnergie/energie_loose_curve_cursor.png": "energy/el/el_tooltip.png",
    "tutoEnergie/energie_recovery_all.png": "energy/er/er_all.png",
    "tutoEnergie/energie_recovery_cal.png": "energy/er/er_cal.png",
    "tutoEnergie/energie_recovery_curve.png": "energy/er/er_curve.png",
    "tutoEnergie/energie_recovery_curve_cursor.png": "energy/er/er_tooltip.png",
    "tutoAutoSail/autoSail_vueensemble.png": "autosail/autosail_all.png",
    "tutoAutoSail/autoSail_twa fixe_all.png": "autosail/curve/autosail_twa_all.png",
    "tutoAutoSail/autoSail_twa fixe_setting.png": "autosail/curve/autosail_twa_set.png",
    "tutoAutoSail/autoSail_twa_fixe.png": "autosail/curve/autosail_twa_curve.png",
    "tutoAutoSail/AutoSail_TooltipTWA.png": "autosail/curve/autosail_twa_tooltip.png",
    "tutoAutoSail/autoSail_tws fixe_all.png": "autosail/curve/autosail_tws_all.png",
    "tutoAutoSail/autoSail_tws fixe_setting.png": "autosail/curve/autosail_tws_set.png",
    "tutoAutoSail/autoSail_tws_fixe.png": "autosail/curve/autosail_tws_curve.png",
    "tutoAutoSail/AutoSail_TooltipTWS.png": "autosail/curve/autosail_tws_tooltip.png",
    "tutoAutoSail/autoSail_range_all.png": "autosail/curve/autosail_zu_all.png",
    "tutoAutoSail/autoSail_range_setting.png": "autosail/curve/autosail_zu_set.png",
    "tutoAutoSail/autoSail_range.png": "autosail/curve/autosail_zu_curve.png",
    "tutoAutoSail/autoSail_TooltipRange.png": "autosail/curve/autosail_zu_tooltip.png",
    "tutoPolar/polar_boatSpeedTwaCurve.png": "polar/curve/polar_twa_curve.png",
    "tutoPolar/polar_boatSpeedTwaval.png": "polar/curve/polar_twa_curve_set.png",
    "tutoPolar/polar_tooltip_twa.png": "polar/curve/polar_twa_tooltip.png",
    "tutoPolar/polar_boatSpeedTwscurve.png": "polar/curve/polar_tws_curve.png",
    "tutoPolar/polar_boatSpeedTwsval.png": "polar/curve/polar_tws_curve_set.png",
    "tutoPolar/polar_tooltip_tws.png": "polar/curve/polar_tws_tooltip.png",
    "tutoPolar/polar_boatSpeedBSPDCurve.png": "polar/curve/polar_bspd_curve.png",
    "tutoPolar/polar_tooltip_bspd.png": "polar/curve/polar_bspd_curve_tooltip.png",
    "tutoPolar/polar_boatSpeedBVMGCurve.png": "polar/curve/polar_bvmg_curve.png",
    "tutoPolar/polar_tooltip_bvmg.png": "polar/curve/polar_bvmg_curve_tooltip.png",
}
DOCUMENTS = (
    "aide_pena", "tuto_pena", "aide_energy", "tuto_energy",
    "tuto_polaire", "tuto_autoSail", "aide_dash",
)
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
IGNORED = {"script", "style", "svg"}
INLINE = {"a", "b", "strong", "em", "i", "span", "u", "small", "sup", "sub", "button", "br", "code"}


@dataclass(eq=False)
class Text:
    value: str


@dataclass(eq=False)
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list[Node | Text] = field(default_factory=list)

    def has_class(self, value: str) -> bool:
        return value in self.attrs.get("class", "").split()

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()


class LegacyParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, {key: value or "" for key, value in attrs})
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(Text(data))


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def plain(node: Node | Text) -> str:
    if isinstance(node, Text):
        return node.value
    if node.tag in IGNORED:
        return ""
    return "".join(plain(child) for child in node.children)


def text_nodes(node: Node):
    if node.tag in IGNORED:
        return
    for child in node.children:
        if isinstance(child, Text):
            if compact(child.value):
                yield child
        else:
            yield from text_nodes(child)


def clean(value: str) -> str:
    value = re.sub(r"[ \t]+\n", "\n", value)
    return re.sub(r"\n{3,}", "\n\n", value).strip()


def asset_relative(relative: str) -> str:
    path = Path(relative)
    dark = path.stem.endswith("_b")
    if dark:
        relative = path.with_name(path.stem[:-2] + path.suffix).as_posix()
    destination = ASSET_RENAMES.get(relative)
    if destination is None:
        directory, _, filename = relative.partition("/")
        if directory == "tutoPena":
            section = {"simple": "PS", "double": "PD", "renta": "RT"}[filename.split("_")[1]]
            filename = filename.replace("pena_renta_", "pena_Renta_")
            destination = f"penalties/{section}/{filename}"
        else:
            destination = f"{ASSET_DIRECTORIES[directory]}/{filename}"
    if dark:
        path = Path(destination)
        destination = path.with_name(path.stem + "_b" + path.suffix).as_posix()
    return destination


class Markdown:
    def __init__(self, article: Node, source: str, locale: str):
        self.article, self.source, self.locale = article, source, locale
        self.used: Counter[Text] = Counter()
        self.images: list[dict] = []
        self.anomalies: list[str] = []
        self.current_heading = ""
        self.first_heading = True
        self.tabs = {
            node.attrs.get("data-bs-target", "").lstrip("#"): node
            for node in article.walk()
            if node.tag == "button" and node.attrs.get("data-bs-toggle") == "tab"
        }
        self.sections: list[str] = []

    def inline(self, node: Node | Text) -> str:
        if isinstance(node, Text):
            if compact(node.value):
                self.used[node] += 1
            value = re.sub(r"\s+", " ", node.value)
            # MathJax accepted display delimiters anywhere in a paragraph. Put
            # them on their own lines for remark-math, retaining list indentation
            # later in render_list and leaving every mathematical symbol intact.
            return re.sub(r"\$\$(.*?)\$\$", lambda match: "\n\n$$\n" + match.group(1).strip() + "\n$$\n\n", value)
        if node.tag in IGNORED:
            return ""
        if node.tag == "br":
            return "<br>"
        value = "".join(self.inline(child) for child in node.children).strip()
        if not value:
            return ""
        if node.tag in {"b", "strong"}:
            return f"**{value}**"
        if node.tag in {"em", "i"}:
            return f"*{value}*"
        if node.tag == "code":
            return f"`{value}`"
        if node.tag == "a" and node.attrs.get("href"):
            href = node.attrs["href"]
            if href.startswith("assets/"):
                href = "https://ityc.fr/" + href
            elif not re.match(r"(?:[a-z]+:|#|/)", href):
                href = "https://ityc.fr/" + href.removeprefix("./")
            return f"[{value}]({quote(href, safe=':/?#=&%+@!;,$~-_.')})"
        return value

    def image_bundle(self, node: Node | Text) -> list[Node] | None:
        if isinstance(node, Text):
            return None
        if node.tag == "img":
            return [node]
        if node.tag in {"div", "p", "a"} and not compact(plain(node)):
            images = [child for child in node.walk() if child.tag == "img"]
            if images:
                return images
        return None

    def canonical_image(self, node: Node) -> tuple[str, str]:
        src = node.attrs.get("src", "")
        relative = src.removeprefix("assets/img/")
        base = re.sub(r"_b(?=\.[^.]+$)", "", relative)
        if base != relative and (ROOT / "assets/img" / base).is_file():
            relative = base
        parts = relative.split("/")
        corrected = "/".join(part for index, part in enumerate(parts) if index == 0 or part != parts[index - 1])
        if corrected != relative and (ROOT / "assets/img" / corrected).is_file():
            self.anomalies.append(f"Corrected duplicate directory in image path: {relative} -> {corrected}")
            relative = corrected
        alt = node.attrs.get("alt", "") or self.current_heading
        alt = re.sub(r"[\[\]]", "", compact(alt))
        return relative, alt

    def figure(self, images: list[Node], explanations: list[Node | Text]) -> str:
        # A light/dark pair is one pedagogical image. The original contains a
        # mismatched pair in the payback settings; retain its light image and
        # record the discrepancy rather than invent a corrected screenshot.
        selected: list[Node] = []
        for node in images:
            if node.has_class("darkPict") and selected:
                previous, _ = self.canonical_image(selected[-1])
                current, _ = self.canonical_image(node)
                if current != previous:
                    self.anomalies.append(f"Theme pair differs: {previous} / {node.attrs.get('src', '')}")
                continue
            canonical, _ = self.canonical_image(node)
            if selected and canonical == self.canonical_image(selected[-1])[0]:
                continue
            selected.append(node)

        if not selected:
            return self.children(explanations)
        first = selected[0]
        widths = [int(width) for width in re.findall(r"(?:^|\s)col-(?:(?:sm|md|lg|xl|xxl)-)?(\d+)(?:\s|$)", first.attrs.get("class", "") + " ")]
        overview = "vueensemble" in first.attrs.get("src", "").lower()
        side = bool(explanations and (overview or widths and min(widths) < 12))
        mode = "side" if side else "below"
        if side and (overview or 9 in widths):
            mode += " wide"
        elif side and 6 in widths:
            mode += " half"
        lines = [f":::figure {mode}"]
        unavailable = []
        for node in selected:
            relative, alt = self.canonical_image(node)
            target = asset_relative(relative)
            if not (ASSET_DEST / target).is_file() and not (ROOT / "assets/img" / relative).is_file():
                unavailable.append(relative)
                self.images.append({"path": relative, "source": node.attrs.get("src", ""), "layout": mode, "available": False})
                continue
            url = "/assets/help/" + quote(target, safe="/")
            lines.append(f"![{alt}]({url})")
            self.images.append({"path": relative, "source": node.attrs.get("src", ""), "layout": mode})
        explanation = self.children(explanations, figure_context=True)
        if unavailable:
            note = (
                f'Illustration absente des fichiers sources. [Voir la page d’origine](https://ityc.fr/{self.source} "original").'
                if self.locale == "fr" else
                f'Illustration missing from the source files. [View the original page](https://ityc.fr/{self.source} "original").'
            )
            if len(lines) == 1:
                return note + ("\n\n" + explanation if explanation else "")
            explanation = note + ("\n\n" + explanation if explanation else "")
        if explanation:
            lines.extend(["", explanation])
        lines.append(":::")
        return "\n".join(lines)

    def children(self, children: list[Node | Text], figure_context=False) -> str:
        items = [child for child in children if not isinstance(child, Text) or compact(child.value)]
        blocks: list[tuple[Node | Text | None, str]] = []
        inline_buffer: list[Node | Text] = []

        def flush():
            if inline_buffer:
                value = "".join(self.inline(child) for child in inline_buffer).strip()
                if value:
                    blocks.append((None, value))
                inline_buffer.clear()

        index = 0
        while index < len(items):
            child = items[index]
            bundle = self.image_bundle(child)
            if bundle:
                flush()
                images = list(bundle)
                index += 1
                while index < len(items):
                    next_bundle = self.image_bundle(items[index])
                    if not next_bundle:
                        break
                    images.extend(next_bundle)
                    index += 1
                explanations = []
                # Rows whose text appears to the left of the picture keep that
                # text beside the picture in the Markdown figure contract.
                if blocks and isinstance(blocks[-1][0], Node):
                    previous = blocks[-1][0]
                    if re.search(r"(?:^|\s)col-", previous.attrs.get("class", "")) and not any(desc.tag == "img" for desc in previous.walk()):
                        # The previous block has already consumed its text. Undo
                        # those counts before rendering it in its figure.
                        for text in text_nodes(previous):
                            self.used[text] -= 1
                        explanations.append(previous)
                        blocks.pop()
                while index < len(items):
                    following = items[index]
                    if isinstance(following, Node):
                        if following.tag.startswith("h") and following.tag[1:].isdigit():
                            break
                        if any(desc.tag == "img" or desc.has_class("tab-pane") or desc.has_class("accordion-item") for desc in following.walk()):
                            break
                    explanations.append(following)
                    index += 1
                blocks.append((None, self.figure(images, explanations)))
                continue

            if isinstance(child, Text) or (child.tag in INLINE and not any(desc.tag == "img" for desc in child.walk())):
                inline_buffer.append(child)
            else:
                flush()
                result = self.render(child, figure_context)
                if result:
                    blocks.append((child, result))
            index += 1
        flush()

        # The old annotated columns use separate rows for separate physical
        # regions of a screenshot. Preserve these explanatory groups explicitly.
        separator = "\n\n"
        if figure_context and len(blocks) > 1:
            group_nodes = [node for node, _ in blocks if isinstance(node, Node)]
            if len(group_nodes) == len(blocks) and all(node.tag == "div" for node in group_nodes):
                separator = "\n\n---\n\n"
        return separator.join(value for _, value in blocks)

    def render_list(self, node: Node) -> str:
        results = []
        number = 1
        for child in node.children:
            if isinstance(child, Text):
                if compact(child.value):
                    results.append(self.inline(child).strip())
            elif child.tag == "li":
                value = self.children(child.children)
                if value:
                    prefix = f"{number}. " if node.tag == "ol" else "- "
                    lines = value.splitlines()
                    results.append(prefix + lines[0] + "".join("\n" + " " * len(prefix) + line if line else "\n" for line in lines[1:]))
                    number += 1
            else:
                # Several legacy ULs contain explanatory DIVs directly. They
                # are meaningful content and must survive the migration too.
                value = self.render(child)
                if value:
                    results.append(value)
        return "\n\n".join(results)

    def render_table(self, node: Node) -> str:
        rows = []
        for row in node.walk():
            if row.tag != "tr":
                continue
            cells = [self.inline(cell).replace("|", "\\|").replace("\n", " ") for cell in row.children if isinstance(cell, Node) and cell.tag in {"td", "th"}]
            if cells:
                rows.append(cells)
        if not rows:
            return self.children(node.children)
        width = max(map(len, rows))
        rows = [row + [""] * (width - len(row)) for row in rows]
        lines = ["| " + " | ".join(rows[0]) + " |", "| " + " | ".join(["---"] * width) + " |"]
        lines.extend("| " + " | ".join(row) + " |" for row in rows[1:])
        return "\n".join(lines)

    def render(self, node: Node | Text, figure_context=False) -> str:
        if isinstance(node, Text):
            return self.inline(node).strip()
        if node.tag in IGNORED:
            return ""
        if node.has_class("nav-tabs"):
            return ""
        if re.fullmatch(r"h[1-6]", node.tag):
            level = 1 if self.first_heading else 2 if node.has_class("accordion-header") else max(3, int(node.tag[1]))
            self.first_heading = False
            self.current_heading = compact(plain(node))
            self.sections.append(self.current_heading)
            anchor = f"<!-- anchor:{node.attrs['id']} -->\n" if level > 1 and node.attrs.get("id") else ""
            return anchor + "#" * level + " " + self.inline(node)
        if node.has_class("tab-pane"):
            label = self.tabs.get(node.attrs.get("id", ""))
            title = ""
            if label:
                self.current_heading = compact(plain(label))
                self.sections.append(self.current_heading)
                title = f"<!-- anchor:{node.attrs['id']} -->\n### " + self.inline(label) + "\n\n"
            return title + self.children(node.children)
        if node.tag in {"ul", "ol"}:
            return self.render_list(node)
        if node.tag == "table":
            return self.render_table(node)
        if node.tag == "hr":
            return "---"
        if node.tag == "img":
            return self.figure([node], [])
        if node.tag in INLINE:
            return self.inline(node)
        return self.children(node.children, figure_context)

    def convert(self) -> tuple[str, dict]:
        output = clean(self.children(self.article.children)) + "\n"
        missing = [compact(text.value) for text in text_nodes(self.article) if not self.used[text]]
        duplicated = [compact(text.value) for text, count in self.used.items() if count > 1]
        if missing or duplicated:
            raise RuntimeError(f"Content audit failed for {self.source}: missing={missing!r}, duplicated={duplicated!r}")
        return output, {
            "source": self.source,
            "locale": self.locale,
            "headings": self.sections,
            "sectionCount": sum(1 for node in self.article.walk() if node.has_class("accordion-header")),
            "tabCount": len(self.tabs),
            "images": self.images,
            "sourceTextNodes": len(list(text_nodes(self.article))),
            "preservedTextNodes": sum(1 for count in self.used.values() if count == 1),
            "anomalies": sorted(set(self.anomalies)),
        }


def migrate():
    report = {"documents": [], "missingAssets": [], "copiedAssets": [], "notes": [
        "All article text nodes are audited for one-time preservation, including text directly inside malformed legacy lists.",
        "Accordion and tab labels become headings; theme variants become one figure with the original light/dark assets available to the renderer.",
        "The English originals contain untranslated French text; it is intentionally preserved.",
        "aide_penaEn.html describes the former polynomial reference curve; aide_pena.html describes the cosine reference curve and additionally documents magic furler and the stamina cap.",
        "tuto_pena.html repeats the boat-speed-without-sail-change setting in the payback section; both original occurrences are preserved.",
        "Legacy download and tool links remain explicit https://ityc.fr links.",
    ]}
    required_assets: set[str] = set()
    for locale in ("fr", "en"):
        output_dir = DEST / locale
        output_dir.mkdir(parents=True, exist_ok=True)
        for document in DOCUMENTS:
            source = document + ("En" if locale == "en" else "") + ".html"
            parser = LegacyParser()
            parser.feed((ROOT / source).read_text(encoding="utf-8-sig"))
            article = next(node for node in parser.root.walk() if node.has_class("entry-content"))
            converter = Markdown(article, source, locale)
            output, detail = converter.convert()
            destination = output_dir / (document + ".md")
            destination.write_text(output, encoding="utf-8", newline="\n")
            detail["markdown"] = str(destination.relative_to(DEST)).replace("\\", "/")
            detail["figureCount"] = len(re.findall(r"^:::figure ", output, re.M))
            detail["formulaCount"] = output.count("$$") // 2
            report["documents"].append(detail)
            for image in article.walk():
                if image.tag == "img" and image.attrs.get("src", "").startswith("assets/img/"):
                    required_assets.add(image.attrs["src"].removeprefix("assets/img/"))
            required_assets.update(image["path"] for image in detail["images"])

    for relative in sorted(required_assets):
        source_path = ROOT / "assets/img" / relative
        destination = ASSET_DEST / asset_relative(relative)
        if not source_path.is_file() and not destination.is_file():
            report["missingAssets"].append(relative)
            continue
        if not destination.is_file():
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_path, destination)
            report["copiedAssets"].append(relative)
        # Include an available theme variant even when the source page used only
        # one version, so the renderer can follow the user's current theme.
        variant = source_path.with_name(source_path.stem + "_b" + source_path.suffix)
        if not source_path.stem.endswith("_b") and variant.is_file():
            variant_relative = str(variant.relative_to(ROOT / "assets/img")).replace("\\", "/")
            variant_dest = ASSET_DEST / asset_relative(variant_relative)
            if not variant_dest.is_file():
                variant_dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(variant, variant_dest)
                report["copiedAssets"].append(variant_relative)
    report["copiedAssets"] = sorted(set(report["copiedAssets"]))
    report["totals"] = {
        "documents": len(report["documents"]),
        "sections": sum(document["sectionCount"] for document in report["documents"]),
        "tabs": sum(document["tabCount"] for document in report["documents"]),
        "figures": sum(document["figureCount"] for document in report["documents"]),
        "preservedTextNodes": sum(document["preservedTextNodes"] for document in report["documents"]),
        "copiedAssets": len(report["copiedAssets"]),
    }
    (DEST / "migration-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    for detail in report["documents"]:
        print(f"{detail['source']}: {len(detail['headings'])} headings, {detail['figureCount']} figures, {detail['preservedTextNodes']} text nodes preserved")
    print(f"{len(report['copiedAssets'])} assets copied; missing assets: {report['missingAssets']}")


if __name__ == "__main__":
    migrate()
