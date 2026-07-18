import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workDir = "/Users/deemn/Desktop/Workspace-deeps/vsv-cricket-auction-app/.codex-work/player-auction-a4";
const outputDir = "/Users/deemn/Desktop/Workspace-deeps/vsv-cricket-auction-app/outputs/player-auction-a4";
const inputPath = path.join(workDir, "player-auction-list-source.xlsx");
const exportedPath = path.join(workDir, "player-auction-list-a4-prepatch.xlsx");
const finalPath = path.join(outputDir, "player-auction-list-a4.xlsx");

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 8000,
  tableMaxRows: 8,
  tableMaxCols: 8,
  tableMaxCellChars: 120,
});
console.log("WORKBOOK SUMMARY");
console.log(summary.ndjson);

const sheetInfo = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 4000,
});
console.log("SHEET INFO");
console.log(sheetInfo.ndjson);

const firstSheet = workbook.worksheets.getItemAt(0);
const used = firstSheet.getUsedRange();
console.log("FIRST SHEET USED RANGE", used.address);

firstSheet.freezePanes.freezeRows(1);
firstSheet.getRange("A1:A66").format.columnWidth = 11;
firstSheet.getRange("B1:B66").format.columnWidth = 29;
firstSheet.getRange("C1:C66").format.columnWidth = 15;
firstSheet.getRange("D1:D66").format.columnWidth = 13;
firstSheet.getRange("E1:E66").format.columnWidth = 14;
firstSheet.getRange("A1:E66").format.wrapText = false;
firstSheet.getRange("A1:E66").format.rowHeight = 22;

const styleCheck = await workbook.inspect({
  kind: "computedStyle",
  sheetId: firstSheet.name,
  range: "A1:E12",
  maxChars: 5000,
});
console.log("STYLE CHECK A1:E12");
console.log(styleCheck.ndjson);

const preview = await workbook.render({
  sheetName: firstSheet.name,
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "a4-sheet-preview.png"), new Uint8Array(await preview.arrayBuffer()));

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 4000,
});
console.log("FORMULA ERROR SCAN");
console.log(formulaErrors.ndjson);

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(exportedPath);

const patcher = String.raw`
import sys
import zipfile
import xml.etree.ElementTree as ET
from io import BytesIO

src, dst = sys.argv[1], sys.argv[2]
MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
MC = "http://schemas.openxmlformats.org/markup-compatibility/2006"
X14AC = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
XR = "http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
XR2 = "http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
XR3 = "http://schemas.microsoft.com/office/spreadsheetml/2016/revision3"
X15 = "http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
XR6 = "http://schemas.microsoft.com/office/spreadsheetml/2016/revision6"
XR10 = "http://schemas.microsoft.com/office/spreadsheetml/2016/revision10"
X15AC = "http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"

ET.register_namespace("", MAIN)
ET.register_namespace("r", REL)
ET.register_namespace("mc", MC)
ET.register_namespace("x14ac", X14AC)
ET.register_namespace("xr", XR)
ET.register_namespace("xr2", XR2)
ET.register_namespace("xr3", XR3)
ET.register_namespace("x15", X15)
ET.register_namespace("xr6", XR6)
ET.register_namespace("xr10", XR10)
ET.register_namespace("x15ac", X15AC)

def q(name):
    return "{" + MAIN + "}" + name

def serialize(root):
    return ET.tostring(root, encoding="utf-8", xml_declaration=True, short_empty_elements=True)

def set_sheet_printing(xml_bytes):
    root = ET.fromstring(xml_bytes)

    sheet_pr = root.find(q("sheetPr"))
    if sheet_pr is None:
        sheet_pr = ET.Element(q("sheetPr"))
        root.insert(0, sheet_pr)
    page_setup_pr = sheet_pr.find(q("pageSetUpPr"))
    if page_setup_pr is None:
        page_setup_pr = ET.SubElement(sheet_pr, q("pageSetUpPr"))
    page_setup_pr.set("fitToPage", "1")

    print_options = root.find(q("printOptions"))
    if print_options is None:
        print_options = ET.Element(q("printOptions"))
        insert_at = 0
        for i, child in enumerate(list(root)):
            if child.tag in {q("pageMargins"), q("pageSetup"), q("headerFooter")}:
                insert_at = i
                break
            insert_at = i + 1
        root.insert(insert_at, print_options)
    print_options.set("horizontalCentered", "1")

    page_margins = root.find(q("pageMargins"))
    if page_margins is None:
        page_margins = ET.Element(q("pageMargins"))
        root.append(page_margins)
    page_margins.attrib.update({
        "left": "0.35",
        "right": "0.35",
        "top": "0.5",
        "bottom": "0.5",
        "header": "0.25",
        "footer": "0.25",
    })

    page_setup = root.find(q("pageSetup"))
    if page_setup is None:
        page_setup = ET.Element(q("pageSetup"))
        root.append(page_setup)
    page_setup.attrib.update({
        "paperSize": "9",
        "orientation": "portrait",
        "fitToWidth": "1",
        "fitToHeight": "0",
    })
    page_setup.attrib.pop("scale", None)

    return serialize(root)

def set_workbook_print_names(xml_bytes):
    root = ET.fromstring(xml_bytes)
    defined_names = root.find(q("definedNames"))
    if defined_names is None:
        defined_names = ET.Element(q("definedNames"))
        calc_pr = root.find(q("calcPr"))
        if calc_pr is None:
            root.append(defined_names)
        else:
            root.insert(list(root).index(calc_pr), defined_names)

    desired = {
        "_xlnm.Print_Area": "'player-auction-list'!$A$1:$E$66",
        "_xlnm.Print_Titles": "'player-auction-list'!$1:$1",
    }
    for name, text in desired.items():
        matches = [
            node for node in defined_names.findall(q("definedName"))
            if node.get("name") == name and node.get("localSheetId") == "0"
        ]
        if matches:
            node = matches[0]
            for extra in matches[1:]:
                defined_names.remove(extra)
        else:
            node = ET.SubElement(defined_names, q("definedName"), {"name": name, "localSheetId": "0"})
        node.text = text

    return serialize(root)

with zipfile.ZipFile(src, "r") as zin:
    entries = [(item, zin.read(item.filename)) for item in zin.infolist()]

with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
    for item, data in entries:
        if item.filename == "xl/worksheets/sheet1.xml":
            data = set_sheet_printing(data)
        elif item.filename == "xl/workbook.xml":
            data = set_workbook_print_names(data)
        zi = zipfile.ZipInfo(item.filename)
        zi.date_time = item.date_time
        zi.external_attr = item.external_attr
        zi.compress_type = zipfile.ZIP_DEFLATED
        zout.writestr(zi, data)
`;

await new Promise((resolve, reject) => {
  const child = execFile(
    "/Users/deemn/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
    ["-c", patcher, exportedPath, finalPath],
    { maxBuffer: 1024 * 1024 },
    (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      if (error) reject(error);
      else resolve();
    },
  );
});

const finalInput = await FileBlob.load(finalPath);
const finalWorkbook = await SpreadsheetFile.importXlsx(finalInput);
const finalSummary = await finalWorkbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 6000,
  tableMaxRows: 5,
  tableMaxCols: 5,
});
console.log("FINAL SUMMARY");
console.log(finalSummary.ndjson);
console.log(`FINAL XLSX ${finalPath}`);
