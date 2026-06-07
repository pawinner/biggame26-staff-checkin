const SPREADSHEET_ID = "105o7ABk2zn4ASM11wGjI3hw_UzT7NfRJlBzevJda1h0";

function doGet(e) {
  try {
    const action = e.parameter.action;
    const email = e.parameter.email;
    
    if (!action) {
      return jsonResponse({ success: false, error: "Action parameter is required" });
    }
    
    // Action: getSessionName (doesn't require email)
    if (action === "getSessionName") {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const configSheet = ss.getSheetByName("Configuration");
      if (!configSheet) {
        return jsonResponse({ success: false, error: "Configuration sheet not found" });
      }
      const sessionName = configSheet.getRange("A2").getValue().toString().trim();
      return jsonResponse({
        success: true,
        sessionName: sessionName
      });
    }
    
    if (!email) {
      return jsonResponse({ success: false, error: "Email parameter is required" });
    }
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const configSheet = ss.getSheetByName("Configuration");
    if (!configSheet) {
      return jsonResponse({ success: false, error: "Configuration sheet not found" });
    }
    const sessionName = configSheet.getRange("A2").getValue().toString().trim();
    if (!sessionName) {
      return jsonResponse({ success: false, error: "Session name not configured in Configuration!A2" });
    }
    
    const checkinSheet = ss.getSheetByName("CheckIn");
    if (!checkinSheet) {
      return jsonResponse({ success: false, error: "CheckIn sheet not found" });
    }
    
    // Get all values from the sheet
    const data = checkinSheet.getDataRange().getValues();
    if (data.length < 1) {
      return jsonResponse({ success: false, error: "CheckIn sheet is empty" });
    }
    
    const headers = data[0];
    const emailColIdx = headers.indexOf("Docchula_Email");
    const nicknameColIdx = headers.indexOf("Nickname");
    const nameColIdx = headers.indexOf("Name");
    const surnameColIdx = headers.indexOf("Surname");
    const jobColIdx = headers.indexOf("Job");
    const sessionColIdx = headers.indexOf(sessionName);
    
    if (emailColIdx === -1) {
      return jsonResponse({ success: false, error: "Column 'Docchula_Email' not found" });
    }
    if (nicknameColIdx === -1) {
      return jsonResponse({ success: false, error: "Column 'Nickname' not found" });
    }
    if (nameColIdx === -1) {
      return jsonResponse({ success: false, error: "Column 'Name' not found" });
    }
    if (surnameColIdx === -1) {
      return jsonResponse({ success: false, error: "Column 'Surname' not found" });
    }
    if (jobColIdx === -1) {
      return jsonResponse({ success: false, error: "Column 'Job' not found" });
    }
    if (sessionColIdx === -1) {
      return jsonResponse({ success: false, error: "Column '" + sessionName + "' not found" });
    }
    
    // Action: getUnlinkedUsers
    if (action === "getUnlinkedUsers") {
      const unlinkedUsers = [];
      for (let i = 1; i < data.length; i++) {
        const rowEmail = data[i][emailColIdx].toString().trim();
        if (!rowEmail) {
          unlinkedUsers.push({
            name: data[i][nameColIdx].toString().trim(),
            surname: data[i][surnameColIdx].toString().trim(),
            nickname: data[i][nicknameColIdx].toString().trim()
          });
        }
      }
      return jsonResponse({
        success: true,
        users: unlinkedUsers
      });
    }
    
    // Action: linkEmail
    if (action === "linkEmail") {
      const name = e.parameter.name;
      const surname = e.parameter.surname || "";
      if (!name) {
        return jsonResponse({ success: false, error: "Name parameter is required to link email" });
      }
      
      let userRowIdx = -1;
      const searchName = name.toLowerCase().trim();
      const searchSurname = surname.toLowerCase().trim();
      for (let i = 1; i < data.length; i++) {
        const rowName = data[i][nameColIdx].toString().toLowerCase().trim();
        const rowSurname = data[i][surnameColIdx].toString().toLowerCase().trim();
        if (rowName === searchName && rowSurname === searchSurname) {
          userRowIdx = i;
          break;
        }
      }
      
      if (userRowIdx === -1) {
        return jsonResponse({ success: false, error: "User not found with specified Name and Surname" });
      }
      
      const existingEmail = data[userRowIdx][emailColIdx].toString().trim();
      if (existingEmail) {
        return jsonResponse({ success: false, error: "This user already has a linked email" });
      }
      
      // Check if email already linked to another row
      const targetEmail = email.toLowerCase().trim();
      for (let i = 1; i < data.length; i++) {
        const rowEmail = data[i][emailColIdx].toString().toLowerCase().trim();
        if (rowEmail === targetEmail) {
          return jsonResponse({ success: false, error: "This email is already linked to another user" });
        }
      }
      
      // Write the email to cell (1-based index)
      checkinSheet.getRange(userRowIdx + 1, emailColIdx + 1).setValue(email.trim());
      
      return jsonResponse({
        success: true,
        message: "Email linked successfully"
      });
    }
    
    // Find the user row
    let userRowIdx = -1;
    const searchEmail = email.toLowerCase().trim();
    for (let i = 1; i < data.length; i++) {
      const rowEmail = data[i][emailColIdx].toString().toLowerCase().trim();
      if (rowEmail === searchEmail) {
        userRowIdx = i;
        break;
      }
    }
    
    if (userRowIdx === -1) {
      return jsonResponse({ success: false, error: "Email not found in CheckIn sheet" });
    }
    
    const userRow = data[userRowIdx];
    const nickname = userRow[nicknameColIdx];
    const job = userRow[jobColIdx];
    const checkedInVal = userRow[sessionColIdx];
    const checkedInTimeStr = formatTimeValue(checkedInVal);
    
    if (action === "getUser") {
      return jsonResponse({
        success: true,
        sessionName: sessionName,
        user: {
          email: email,
          nickname: nickname,
          job: job,
          checkedInTime: checkedInTimeStr
        }
      });
    } else if (action === "checkIn") {
      let timeStr = "";
      if (checkedInTimeStr) {
        timeStr = checkedInTimeStr;
      } else {
        // Format time in Thailand's timezone (GMT+7)
        timeStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "HH:mm:ss");
        // Write to cell (1-based index)
        checkinSheet.getRange(userRowIdx + 1, sessionColIdx + 1).setValue(timeStr);
      }
      return jsonResponse({
        success: true,
        sessionName: sessionName,
        time: timeStr
      });
    } else {
      return jsonResponse({ success: false, error: "Invalid action" });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    let action = e.parameter.action;
    let email = e.parameter.email;
    let name = e.parameter.name;
    let surname = e.parameter.surname;
    
    if (!action && e.postData && e.postData.contents) {
      const payload = JSON.parse(e.postData.contents);
      action = payload.action;
      email = payload.email;
      name = payload.name;
      surname = payload.surname;
    }
    
    return doGet({ parameter: { action: action, email: email, name: name, surname: surname } });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function formatTimeValue(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Bangkok", "HH:mm:ss");
  }
  
  const str = val.toString().trim();
  if (!str) return null;
  
  // Extract time pattern HH:MM:SS if present
  const timeMatch = str.match(/\b\d{2}:\d{2}:\d{2}\b/);
  if (timeMatch) {
    return timeMatch[0];
  }
  
  return str;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
