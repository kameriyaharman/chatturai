// Dial codes + timezone guess — same list as the old themes/advanced/js/contact.js
export const COUNTRIES = [["US","1","United States"],["GB","44","United Kingdom"],["IN","91","India"],
["CA","1","Canada"],["AU","61","Australia"],["AE","971","UAE"],["SA","966","Saudi Arabia"],
["SG","65","Singapore"],["DE","49","Germany"],["FR","33","France"],["NL","31","Netherlands"],
["ES","34","Spain"],["IT","39","Italy"],["IE","353","Ireland"],["CH","41","Switzerland"],
["SE","46","Sweden"],["NO","47","Norway"],["DK","45","Denmark"],["FI","358","Finland"],
["BE","32","Belgium"],["AT","43","Austria"],["PT","351","Portugal"],["PL","48","Poland"],
["CZ","420","Czechia"],["GR","30","Greece"],["RO","40","Romania"],["HU","36","Hungary"],
["NZ","64","New Zealand"],["ZA","27","South Africa"],["NG","234","Nigeria"],["KE","254","Kenya"],
["EG","20","Egypt"],["MA","212","Morocco"],["GH","233","Ghana"],["TZ","255","Tanzania"],
["BR","55","Brazil"],["MX","52","Mexico"],["AR","54","Argentina"],["CL","56","Chile"],
["CO","57","Colombia"],["PE","51","Peru"],["JP","81","Japan"],["KR","82","South Korea"],
["CN","86","China"],["HK","852","Hong Kong"],["TW","886","Taiwan"],["TH","66","Thailand"],
["VN","84","Vietnam"],["ID","62","Indonesia"],["MY","60","Malaysia"],["PH","63","Philippines"],
["PK","92","Pakistan"],["BD","880","Bangladesh"],["LK","94","Sri Lanka"],["NP","977","Nepal"],
["IL","972","Israel"],["TR","90","Turkey"],["QA","974","Qatar"],["KW","965","Kuwait"],
["BH","973","Bahrain"],["OM","968","Oman"],["JO","962","Jordan"],["LB","961","Lebanon"],
["RU","7","Russia"],["UA","380","Ukraine"],["IS","354","Iceland"],["LU","352","Luxembourg"]]
  .slice().sort((a, b) => a[2].localeCompare(b[2]));

const TZ = {"Asia/Kolkata":"IN","Asia/Calcutta":"IN","Asia/Dubai":"AE","Asia/Riyadh":"SA",
"Asia/Singapore":"SG","Asia/Tokyo":"JP","Asia/Seoul":"KR","Asia/Shanghai":"CN",
"Asia/Hong_Kong":"HK","Asia/Taipei":"TW","Asia/Bangkok":"TH","Asia/Jakarta":"ID",
"Asia/Kuala_Lumpur":"MY","Asia/Manila":"PH","Asia/Karachi":"PK","Asia/Dhaka":"BD",
"Asia/Colombo":"LK","Asia/Kathmandu":"NP","Asia/Jerusalem":"IL","Asia/Istanbul":"TR",
"Europe/London":"GB","Europe/Dublin":"IE","Europe/Paris":"FR","Europe/Berlin":"DE",
"Europe/Amsterdam":"NL","Europe/Madrid":"ES","Europe/Rome":"IT","Europe/Zurich":"CH",
"Europe/Stockholm":"SE","Europe/Oslo":"NO","Europe/Copenhagen":"DK","Europe/Helsinki":"FI",
"Europe/Brussels":"BE","Europe/Vienna":"AT","Europe/Lisbon":"PT","Europe/Warsaw":"PL",
"Europe/Prague":"CZ","Europe/Athens":"GR","Europe/Bucharest":"RO","Europe/Budapest":"HU",
"Europe/Moscow":"RU","Europe/Kiev":"UA","Europe/Kyiv":"UA",
"America/New_York":"US","America/Chicago":"US","America/Denver":"US","America/Phoenix":"US",
"America/Los_Angeles":"US","America/Anchorage":"US","Pacific/Honolulu":"US",
"America/Toronto":"CA","America/Vancouver":"CA","America/Edmonton":"CA","America/Winnipeg":"CA",
"America/Mexico_City":"MX","America/Sao_Paulo":"BR","America/Argentina/Buenos_Aires":"AR",
"America/Santiago":"CL","America/Bogota":"CO","America/Lima":"PE",
"Australia/Sydney":"AU","Australia/Melbourne":"AU","Australia/Brisbane":"AU",
"Australia/Perth":"AU","Pacific/Auckland":"NZ",
"Africa/Johannesburg":"ZA","Africa/Lagos":"NG","Africa/Nairobi":"KE","Africa/Cairo":"EG",
"Africa/Casablanca":"MA","Africa/Accra":"GH","Africa/Dar_es_Salaam":"TZ"};

export function flag(iso) {
  return String.fromCodePoint(...iso.toUpperCase().split('').map((c) => 0x1F1A5 + c.charCodeAt(0)));
}

export function guessCountry() {
  try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (TZ[tz]) return TZ[tz]; } catch (e) { /* ignore */ }
  try { const m = (navigator.language || '').split('-')[1]; if (m && m.length === 2) return m.toUpperCase(); } catch (e) { /* ignore */ }
  return 'US';
}
