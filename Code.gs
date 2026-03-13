const SheetName = 'CPR'; // Name of your sheet tab *Not Your File*
const HtmlName = 'CPR.html'; // Name of your HTML file
const CPRLoction = 'A'; // Column letter for CPR
const NameLoction = 'B'; // Column letter for Name
const ClassLoction = 'C'; // Column letter for Class
const AcademicNumberLoction = 'D'; // Column letter for Academic Number

function doGet() {
  return HtmlService.createHtmlOutputFromFile(HtmlName).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("الرقم الاكاديمي");
}

function SearchCPR(userInput) {
  const input = String(userInput).trim();
  if (!/^\d{9}$/.test(input)) {
    return { status: 'error', message: 'الرقم الشخصي يجب أن يتكون من 9 أرقام فقط' };
  }
  const cache = CacheService.getScriptCache();
  const userKey = "rate_" + Session.getTemporaryActiveUserKey();
  const currentCount = parseInt(cache.get(userKey) || "0");
  if (currentCount >= 10) {
    return { status: 'error', message: 'تم تجاوز الحد المسموح من عمليات البحث، حاول بعد 10 دقائق' };
  }
  cache.put(userKey, String(currentCount + 1), 600);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SheetName);
  if (!sheet) return { status: 'error', message: 'خطأ في إعدادات النظام' };
  const CPRCol = CPRLoction.toUpperCase().charCodeAt(0) - 64;
  const finder = sheet.getRange(1, CPRCol, sheet.getLastRow(), 1)
    .createTextFinder(input)
    .matchEntireCell(true)
    .findNext();
  if (!finder) {
    return { status: 'error', message: 'لم يتم العثور على بيانات لهذا الرقم الشخصي' };
  }
  const row = finder.getRow();
  const NameCol = NameLoction.toUpperCase().charCodeAt(0) - 64;
  const ClassCol = ClassLoction.toUpperCase().charCodeAt(0) - 64;
  const AcadCol = AcademicNumberLoction.toUpperCase().charCodeAt(0) - 64;
  const maxCol = Math.max(NameCol, ClassCol, AcadCol);
  const rowData = sheet.getRange(row, 1, 1, maxCol).getValues()[0];
  return {
    status: 'success',
    data: {
      name: String(rowData[NameCol - 1] || ""),
      class: String(rowData[ClassCol - 1] || ""),
      academic: String(rowData[AcadCol - 1] || "")
    }
  };
}
