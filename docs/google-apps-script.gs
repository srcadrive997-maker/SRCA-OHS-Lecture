/**
 * Google Apps Script - SRCA OHS Lecture
 * يتعامل مع نتائج الاختبار MCQ بشكل تراكمي من جميع الأجهزة
 * كل إدخال جديد يُضاف كصف جديد في الورقة (لا يُحذف أي شيء)
 * 
 * الورقة الأولى (Sheet1): نتائج MCQ
 * الأعمدة: الوقت | الاسم | الرقم الوظيفي | الفرع | النتيجة | الدرجة | الإجمالي | النسبة% | تفاصيل الإجابات
 */

// ====== doGet: يُعيد عدد الصفوف (الحضور) ======
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var lastRow = sheet.getLastRow();
    // الصف الأول هو رأس الجدول، لذا نطرح 1
    var count = Math.max(0, lastRow - 1);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: "ok", 
        count: count,
        records: getRecords(sheet)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString(), count: 0, records: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ====== دالة مساعدة: قراءة السجلات ======
function getRecords(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  return data.map(function(row) {
    return {
      timestamp:     row[0],
      name:          row[1],
      employeeId:    row[2],
      branch:        row[3],
      result:        row[4],
      correctCount:  row[5],
      totalQuestions:row[6],
      percentage:    row[7],
      details:       row[8]
    };
  });
}

// ====== doPost: يُضيف صفاً جديداً تراكمياً ======
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    
    // إنشاء رأس الجدول إذا كانت الورقة فارغة
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "الوقت",
        "الاسم",
        "الرقم الوظيفي",
        "الفرع",
        "النتيجة",
        "الدرجة",
        "الإجمالي",
        "النسبة%",
        "تفاصيل الإجابات"
      ]);
      // تنسيق رأس الجدول
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#c62828").setFontColor("#ffffff");
    }
    
    // قراءة البيانات المُرسلة
    var data = JSON.parse(e.postData.contents);
    
    // ====== إضافة الصف الجديد (تراكمي - لا يُحذف شيء) ======
    sheet.appendRow([
      data.timestamp     || new Date().toLocaleString('ar-SA', {timeZone: 'Asia/Riyadh'}),
      data.name          || "غير محدد",
      data.employeeId    || "غير محدد",
      data.branch        || "غير محدد",
      data.result        || "غير محدد",   // ناجح / راسب
      data.correctCount  || "0",           // عدد الإجابات الصحيحة
      data.totalQuestions|| "20",          // إجمالي الأسئلة
      data.percentage    || "0%",          // النسبة المئوية
      data.details       || ""             // تفاصيل الإجابات
    ]);
    
    // تلوين الصف حسب النتيجة
    var newRow = sheet.getLastRow();
    var resultCell = sheet.getRange(newRow, 5);
    if (data.result === "ناجح") {
      resultCell.setBackground("#e8f5e9").setFontColor("#2e7d32").setFontWeight("bold");
    } else if (data.result === "راسب") {
      resultCell.setBackground("#ffebee").setFontColor("#c62828").setFontWeight("bold");
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "تم الحفظ بنجاح",
        totalRows: sheet.getLastRow() - 1
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
