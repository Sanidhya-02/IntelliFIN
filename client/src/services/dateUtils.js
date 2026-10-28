/**
 * Convert YYYY-MM-DD (from HTML input) + HH:MM:SS to ISO string
 * @param {string} dateStr - YYYY-MM-DD format
 * @param {string} timeStr - HH:MM:SS format
 * @returns {string} ISO string
 */
export function htmlDateAndTimeToISO(dateStr, timeStr) {
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
export function excelDateToISO(dateStr, timeStr) {
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
export function isoToDDMMYYYY(isoString) {
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
export function isoToHHMMSS(isoString) {
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

/**
 * Extract category from tag string (removes emoji and # prefix)
 * @param {string} tagStr - Tag string like "#🍔 Food"
 * @returns {string} Clean category name
 */
export function extractCategory(tagStr) {
  if (!tagStr) return "Misc";
  return tagStr.replace(/^#\s*[\p{Emoji}_]*\s*/u, "").trim() || "Misc";
}

/**
 * Extract numeric amount, handling +/- signs
 * @param {string} val - Amount string like "+115.00" or "-160.00"
 * @returns {number} Numeric amount
 */
export function extractAmount(val) {
  if (!val) return 0;
  const numStr = val.replace(/[^0-9.,-]/g, "");
  return parseFloat(numStr) || 0;
}

/**
 * Format number to Indian currency
 * @param {number} num - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(num) {
  if (num == null) num = 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Determine Credit or Debit from amount
 * @param {number} amount - Amount value
 * @returns {string} "Credit" or "Debit"
 */
export function getType(amount) {
  return amount >= 0 ? "Credit" : "Debit";
}
