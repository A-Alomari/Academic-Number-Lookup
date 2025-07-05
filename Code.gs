const SheetName = 'CPR'; // Name of your sheet tab *Not Your File*
const HtmlName = 'CPR.html'; // Name of your HTML file
const CPRLoction = 'A'; // Column letter for CPR
const NameLoction = 'B'; // Column letter for Name
const ClassLoction = 'C'; // Column letter for Class
const AcademicNumberLoction = 'D'; // Column letter for Academic Number

function doGet() {
  return HtmlService.createHtmlOutputFromFile(HtmlName).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("الرقم الاكاديمي").setFaviconUrl('https://www.moe.gov.bh/images/favicon.ico');
}

function SearchCPR(userInput) {
  const CPRColumn = CPRLoction.toLowerCase().charCodeAt(0) - 97;
  const NameColumn = NameLoction.toLowerCase().charCodeAt(0) - 97;
  const ClassColumn = ClassLoction.toLowerCase().charCodeAt(0) - 97;
  const AcademicNumberColumn = AcademicNumberLoction.toLowerCase().charCodeAt(0) - 97;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SheetName);
  if (!sheet) {
    return "لم يتم العثور على صفحة البيانات، تأكد من اسم الصفحة";
  }
  const data = sheet.getDataRange().getValues();
  if (data.length = 0) {
    return "لا توجد بيانات في الصفحة";
  }

 for (let i = 0; i < data.length; i++) {
    if (String(data[i][CPRColumn]).trim() === String(userInput).trim()) {
      return [data[i][NameColumn] || '', data[i][ClassColumn] || '', data[i][AcademicNumberColumn] || ''];
    }
  }
  return "لم يتم العثور على بيانات لهذا الرقم الشخصي";
}