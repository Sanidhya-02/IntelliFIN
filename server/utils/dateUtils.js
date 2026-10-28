/**
 * Convert YYYY-MM-DD (from HTML input) + HH:MM:SS to ISO string
 * @param {string} dateStr - YYYY-MM-DD format
 * @param {string} timeStr - HH:MM:SS format
 * @returns {string} ISO string
 */
function htmlDateAndTimeToISO(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    const time = timeStr || "00:00:00";
    // dateStr is already YYYY-MM-DD from HTML input
    const isoString = `${dateStr}T${time}`;
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateStr, timeStr);
      return null;
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
}

/**
 * Convert DD/MM/YYYY (from Excel) + HH:MM:SS to ISO string
 * @param {string} dateStr - DD/MM/YYYY format from Excel
 * @param {string} timeStr - HH:MM:SS format
 * @returns {string} ISO string
 */
function excelDateToISO(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    let d, m, y;
    // Handle both DD/MM/YYYY and YYYY-MM-DD formats
    if (dateStr.includes("/")) {
      [d, m, y] = dateStr.split("/");
    } else if (dateStr.includes("-")) {
      [y, m, d] = dateStr.split("-");
    } else {
      return null;
    }

    let t = timeStr || "00:00:00";
    if (!t.includes(":")) t += ":00";
    if (t.split(":").length === 2) t += ":00";

    // Pad single digits
    d = String(d).padStart(2, "0");
    m = String(m).padStart(2, "0");

    const isoString = `${y}-${m}-${d}T${t}`;
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateStr, timeStr);
      return null;
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
}

/**
 * Convert ISO string to DD/MM/YYYY format for display
 * @param {string} isoString - ISO format date
 * @returns {string} DD/MM/YYYY
 */
function isoToDDMMYYYY(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

/**
 * Convert ISO string to HH:MM:SS format for display
 * @param {string} isoString - ISO format date
 * @returns {string} HH:MM:SS
 */
function isoToHHMMSS(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return "";
  }
}

module.exports = {
  htmlDateAndTimeToISO,
  excelDateToISO,
  isoToDDMMYYYY,
  isoToHHMMSS,
};
