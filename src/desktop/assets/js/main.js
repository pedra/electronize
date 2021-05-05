// Constantes URLs do Servidor
const SERVER_URL = 'http://presel.tk';
const SERVER_URL_RSAKEY = SERVER_URL + '/user/rsakey';
const SERVER_URL_LOGIN = SERVER_URL + '/user/login';
const SERVER_URL_LOGOUT = SERVER_URL + '/user/logout';
const SERVER_URL_PING = SERVER_URL + '/ping';


// for reports function
const ALERT = 'red';
const INFO = 'blu';
const WARN = 'ora';


// Add function CAPTALIZE: ex.: "name med last".captalize() == "Name Med Last";
String.prototype.capitalize = function () {
    var a = this.split(' ');
    var b = a.map(function (c) { return c.charAt(0).toUpperCase() + c.slice(1) })
    return b.join(' ');
}

// KEYDOWN from input:text to number (or currency)
function kdnumber(e) {
    var c = e.which;
    if (c == 32
        || c == 8
        || c == 9
        || c == 13
        || c == 190
        || c == 188
        || (c >= 37 && c <= 40)
        || (c >= 48 && c <= 57)
        || (c >= 96 && c <= 105)) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

// Converte uma string formatada em Real para Float 
function realToFloat(v) {
    if (v.trim() == '') v = '0';
    return parseFloat(v.replace(/\.| /g, '').replace(/,/g, '.'))
}
// Converte um Float para Real (sem R$)
function floatToReal(v) {
    return parseFloat(v).toLocaleString('pt-br', { minimumFractionDigits: 2 })
}


function noAcento(txt) {
    var charMap = { "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F", "G": "G", "H": "H", "I": "I", "J": "J", "K": "K", "L": "L", "M": "M", "N": "N", "O": "O", "P": "P", "Q": "Q", "R": "R", "S": "S", "T": "T", "U": "U", "V": "V", "W": "W", "X": "X", "Y": "Y", "Z": "Z", "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h", "i": "i", "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r", "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x", "y": "y", "z": "z", "ª": "a", "²": "2", "³": "3", "¹": "1", "º": "o", "À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A", "Ç": "C", "È": "E", "É": "E", "Ê": "E", "Ë": "E", "Ì": "I", "Í": "I", "Î": "I", "Ï": "I", "Ð": "D", "Ñ": "N", "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O", "Ø": "O", "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U", "Ý": "Y", "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ç": "c", "è": "e", "é": "e", "ê": "e", "ë": "e", "ì": "i", "í": "i", "î": "i", "ï": "i", "ð": "d", "ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ý": "y", "ÿ": "y", "Ā": "A", "ā": "a", "Ă": "A", "ă": "a", "Ą": "A", "ą": "a", "Ć": "C", "ć": "c", "Ĉ": "C", "ĉ": "c", "Ċ": "C", "ċ": "c", "Č": "C", "č": "c", "Ď": "D", "ď": "d", "Đ": "D", "đ": "d", "Ē": "E", "ē": "e", "Ĕ": "E", "ĕ": "e", "Ė": "E", "ė": "e", "Ę": "E", "ę": "e", "Ě": "E", "ě": "e", "Ĝ": "G", "ĝ": "g", "Ğ": "G", "ğ": "g", "Ġ": "G", "ġ": "g", "Ģ": "G", "ģ": "g", "Ĥ": "H", "ĥ": "h", "Ħ": "H", "ħ": "h", "Ĩ": "I", "ĩ": "i", "Ī": "I", "ī": "i", "Ĭ": "I", "ĭ": "i", "Į": "I", "į": "i", "İ": "I", "Ĵ": "J", "ĵ": "j", "Ķ": "K", "ķ": "k", "Ĺ": "L", "ĺ": "l", "Ļ": "L", "ļ": "l", "Ľ": "L", "ľ": "l", "Ŀ": "L", "ŀ": "l", "Ł": "L", "ł": "l", "Ń": "N", "ń": "n", "Ņ": "N", "ņ": "n", "Ň": "N", "ň": "n", "Ō": "O", "ō": "o", "Ŏ": "O", "ŏ": "o", "Ő": "O", "ő": "o", "Ŕ": "R", "ŕ": "r", "Ŗ": "R", "ŗ": "r", "Ř": "R", "ř": "r", "Ś": "S", "ś": "s", "Ŝ": "S", "ŝ": "s", "Ş": "S", "ş": "s", "Š": "S", "š": "s", "Ţ": "T", "ţ": "t", "Ť": "T", "ť": "t", "Ũ": "U", "ũ": "u", "Ū": "U", "ū": "u", "Ŭ": "U", "ŭ": "u", "Ů": "U", "ů": "u", "Ű": "U", "ű": "u", "Ų": "U", "ų": "u", "Ŵ": "W", "ŵ": "w", "Ŷ": "Y", "ŷ": "y", "Ÿ": "Y", "Ź": "Z", "ź": "z", "Ż": "Z", "ż": "z", "Ž": "Z", "ž": "z", "ſ": "s", "Ơ": "O", "ơ": "o", "Ư": "U", "ư": "u", "Ǎ": "A", "ǎ": "a", "Ǐ": "I", "ǐ": "i", "Ǒ": "O", "ǒ": "o", "Ǔ": "U", "ǔ": "u", "Ǖ": "U", "ǖ": "u", "Ǘ": "U", "ǘ": "u", "Ǚ": "U", "ǚ": "u", "Ǜ": "U", "ǜ": "u", "Ǟ": "A", "ǟ": "a", "Ǡ": "A", "ǡ": "a", "Ǧ": "G", "ǧ": "g", "Ǩ": "K", "ǩ": "k", "Ǫ": "O", "ǫ": "o", "Ǭ": "O", "ǭ": "o", "ǰ": "j", "Ǵ": "G", "ǵ": "g", "Ǹ": "N", "ǹ": "n", "Ǻ": "A", "ǻ": "a", "Ǿ": "O", "ǿ": "o", "Ȁ": "A", "ȁ": "a", "Ȃ": "A", "ȃ": "a", "Ȅ": "E", "ȅ": "e", "Ȇ": "E", "ȇ": "e", "Ȉ": "I", "ȉ": "i", "Ȋ": "I", "ȋ": "i", "Ȍ": "O", "ȍ": "o", "Ȏ": "O", "ȏ": "o", "Ȑ": "R", "ȑ": "r", "Ȓ": "R", "ȓ": "r", "Ȕ": "U", "ȕ": "u", "Ȗ": "U", "ȗ": "u", "Ș": "S", "ș": "s", "Ț": "T", "ț": "t", "Ȟ": "H", "ȟ": "h", "Ȧ": "A", "ȧ": "a", "Ȩ": "E", "ȩ": "e", "Ȫ": "O", "ȫ": "o", "Ȭ": "O", "ȭ": "o", "Ȯ": "O", "ȯ": "o", "Ȱ": "O", "ȱ": "o", "Ȳ": "Y", "ȳ": "y", "ʰ": "h", "ʲ": "j", "ʳ": "r", "ʷ": "w", "ʸ": "y", "ˡ": "l", "ˢ": "s", "ˣ": "x", "ͣ": "a", "ͤ": "e", "ͥ": "i", "ͦ": "o", "ͧ": "u", "ͨ": "c", "ͩ": "d", "ͪ": "h", "ͫ": "m", "ͬ": "r", "ͭ": "t", "ͮ": "v", "ͯ": "x", "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9", "߀": "0", "߁": "1", "߂": "2", "߃": "3", "߄": "4", "߅": "5", "߆": "6", "߇": "7", "߈": "8", "߉": "9", "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9", "੦": "0", "੧": "1", "੨": "2", "੩": "3", "੪": "4", "੫": "5", "੬": "6", "੭": "7", "੮": "8", "੯": "9", "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4", "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9", "୦": "0", "୧": "1", "୨": "2", "୩": "3", "୪": "4", "୫": "5", "୬": "6", "୭": "7", "୮": "8", "୯": "9", "௦": "0", "௧": "1", "௨": "2", "௩": "3", "௪": "4", "௫": "5", "௬": "6", "௭": "7", "௮": "8", "௯": "9", "౦": "0", "౧": "1", "౨": "2", "౩": "3", "౪": "4", "౫": "5", "౬": "6", "౭": "7", "౮": "8", "౯": "9", "౸": "0", "౹": "1", "౺": "2", "౻": "3", "౼": "1", "౽": "2", "౾": "3", "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9", "൦": "0", "൧": "1", "൨": "2", "൩": "3", "൪": "4", "൫": "5", "൬": "6", "൭": "7", "൮": "8", "൯": "9", "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4", "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9", "໐": "0", "໑": "1", "໒": "2", "໓": "3", "໔": "4", "໕": "5", "໖": "6", "໗": "7", "໘": "8", "໙": "9", "༠": "0", "༡": "1", "༢": "2", "༣": "3", "༤": "4", "༥": "5", "༦": "6", "༧": "7", "༨": "8", "༩": "9", "༪": "1", "༫": "2", "༬": "3", "༭": "4", "༮": "5", "༯": "6", "༰": "7", "༱": "8", "༲": "9", "༳": "0", "၀": "0", "၁": "1", "၂": "2", "၃": "3", "၄": "4", "၅": "5", "၆": "6", "၇": "7", "၈": "8", "၉": "9", "႐": "0", "႑": "1", "႒": "2", "႓": "3", "႔": "4", "႕": "5", "႖": "6", "႗": "7", "႘": "8", "႙": "9", "፩": "1", "፪": "2", "፫": "3", "፬": "4", "፭": "5", "፮": "6", "፯": "7", "፰": "8", "፱": "9", "០": "0", "១": "1", "២": "2", "៣": "3", "៤": "4", "៥": "5", "៦": "6", "៧": "7", "៨": "8", "៩": "9", "៰": "0", "៱": "1", "៲": "2", "៳": "3", "៴": "4", "៵": "5", "៶": "6", "៷": "7", "៸": "8", "៹": "9", "᠐": "0", "᠑": "1", "᠒": "2", "᠓": "3", "᠔": "4", "᠕": "5", "᠖": "6", "᠗": "7", "᠘": "8", "᠙": "9", "᥆": "0", "᥇": "1", "᥈": "2", "᥉": "3", "᥊": "4", "᥋": "5", "᥌": "6", "᥍": "7", "᥎": "8", "᥏": "9", "᧐": "0", "᧑": "1", "᧒": "2", "᧓": "3", "᧔": "4", "᧕": "5", "᧖": "6", "᧗": "7", "᧘": "8", "᧙": "9", "᧚": "1", "᪀": "0", "᪁": "1", "᪂": "2", "᪃": "3", "᪄": "4", "᪅": "5", "᪆": "6", "᪇": "7", "᪈": "8", "᪉": "9", "᪐": "0", "᪑": "1", "᪒": "2", "᪓": "3", "᪔": "4", "᪕": "5", "᪖": "6", "᪗": "7", "᪘": "8", "᪙": "9", "᭐": "0", "᭑": "1", "᭒": "2", "᭓": "3", "᭔": "4", "᭕": "5", "᭖": "6", "᭗": "7", "᭘": "8", "᭙": "9", "᮰": "0", "᮱": "1", "᮲": "2", "᮳": "3", "᮴": "4", "᮵": "5", "᮶": "6", "᮷": "7", "᮸": "8", "᮹": "9", "᱀": "0", "᱁": "1", "᱂": "2", "᱃": "3", "᱄": "4", "᱅": "5", "᱆": "6", "᱇": "7", "᱈": "8", "᱉": "9", "᱐": "0", "᱑": "1", "᱒": "2", "᱓": "3", "᱔": "4", "᱕": "5", "᱖": "6", "᱗": "7", "᱘": "8", "᱙": "9", "ᴬ": "A", "ᴮ": "B", "ᴰ": "D", "ᴱ": "E", "ᴳ": "G", "ᴴ": "H", "ᴵ": "I", "ᴶ": "J", "ᴷ": "K", "ᴸ": "L", "ᴹ": "M", "ᴺ": "N", "ᴼ": "O", "ᴾ": "P", "ᴿ": "R", "ᵀ": "T", "ᵁ": "U", "ᵂ": "W", "ᵃ": "a", "ᵇ": "b", "ᵈ": "d", "ᵉ": "e", "ᵍ": "g", "ᵏ": "k", "ᵐ": "m", "ᵒ": "o", "ᵖ": "p", "ᵗ": "t", "ᵘ": "u", "ᵛ": "v", "ᵢ": "i", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ᵹ": "g", "ᶜ": "c", "ᶞ": "d", "ᶠ": "f", "ᶻ": "z", "᷊": "r", "ᷓ": "a", "ᷗ": "c", "ᷘ": "d", "ᷙ": "d", "ᷚ": "g", "ᷜ": "k", "ᷝ": "l", "ᷠ": "n", "ᷤ": "s", "ᷥ": "s", "ᷦ": "z", "Ḁ": "A", "ḁ": "a", "Ḃ": "B", "ḃ": "b", "Ḅ": "B", "ḅ": "b", "Ḇ": "B", "ḇ": "b", "Ḉ": "C", "ḉ": "c", "Ḋ": "D", "ḋ": "d", "Ḍ": "D", "ḍ": "d", "Ḏ": "D", "ḏ": "d", "Ḑ": "D", "ḑ": "d", "Ḓ": "D", "ḓ": "d", "Ḕ": "E", "ḕ": "e", "Ḗ": "E", "ḗ": "e", "Ḙ": "E", "ḙ": "e", "Ḛ": "E", "ḛ": "e", "Ḝ": "E", "ḝ": "e", "Ḟ": "F", "ḟ": "f", "Ḡ": "G", "ḡ": "g", "Ḣ": "H", "ḣ": "h", "Ḥ": "H", "ḥ": "h", "Ḧ": "H", "ḧ": "h", "Ḩ": "H", "ḩ": "h", "Ḫ": "H", "ḫ": "h", "Ḭ": "I", "ḭ": "i", "Ḯ": "I", "ḯ": "i", "Ḱ": "K", "ḱ": "k", "Ḳ": "K", "ḳ": "k", "Ḵ": "K", "ḵ": "k", "Ḷ": "L", "ḷ": "l", "Ḹ": "L", "ḹ": "l", "Ḻ": "L", "ḻ": "l", "Ḽ": "L", "ḽ": "l", "Ḿ": "M", "ḿ": "m", "Ṁ": "M", "ṁ": "m", "Ṃ": "M", "ṃ": "m", "Ṅ": "N", "ṅ": "n", "Ṇ": "N", "ṇ": "n", "Ṉ": "N", "ṉ": "n", "Ṋ": "N", "ṋ": "n", "Ṍ": "O", "ṍ": "o", "Ṏ": "O", "ṏ": "o", "Ṑ": "O", "ṑ": "o", "Ṓ": "O", "ṓ": "o", "Ṕ": "P", "ṕ": "p", "Ṗ": "P", "ṗ": "p", "Ṙ": "R", "ṙ": "r", "Ṛ": "R", "ṛ": "r", "Ṝ": "R", "ṝ": "r", "Ṟ": "R", "ṟ": "r", "Ṡ": "S", "ṡ": "s", "Ṣ": "S", "ṣ": "s", "Ṥ": "S", "ṥ": "s", "Ṧ": "S", "ṧ": "s", "Ṩ": "S", "ṩ": "s", "Ṫ": "T", "ṫ": "t", "Ṭ": "T", "ṭ": "t", "Ṯ": "T", "ṯ": "t", "Ṱ": "T", "ṱ": "t", "Ṳ": "U", "ṳ": "u", "Ṵ": "U", "ṵ": "u", "Ṷ": "U", "ṷ": "u", "Ṹ": "U", "ṹ": "u", "Ṻ": "U", "ṻ": "u", "Ṽ": "V", "ṽ": "v", "Ṿ": "V", "ṿ": "v", "Ẁ": "W", "ẁ": "w", "Ẃ": "W", "ẃ": "w", "Ẅ": "W", "ẅ": "w", "Ẇ": "W", "ẇ": "w", "Ẉ": "W", "ẉ": "w", "Ẋ": "X", "ẋ": "x", "Ẍ": "X", "ẍ": "x", "Ẏ": "Y", "ẏ": "y", "Ẑ": "Z", "ẑ": "z", "Ẓ": "Z", "ẓ": "z", "Ẕ": "Z", "ẕ": "z", "ẖ": "h", "ẗ": "t", "ẘ": "w", "ẙ": "y", "ẛ": "s", "Ạ": "A", "ạ": "a", "Ả": "A", "ả": "a", "Ấ": "A", "ấ": "a", "Ầ": "A", "ầ": "a", "Ẩ": "A", "ẩ": "a", "Ẫ": "A", "ẫ": "a", "Ậ": "A", "ậ": "a", "Ắ": "A", "ắ": "a", "Ằ": "A", "ằ": "a", "Ẳ": "A", "ẳ": "a", "Ẵ": "A", "ẵ": "a", "Ặ": "A", "ặ": "a", "Ẹ": "E", "ẹ": "e", "Ẻ": "E", "ẻ": "e", "Ẽ": "E", "ẽ": "e", "Ế": "E", "ế": "e", "Ề": "E", "ề": "e", "Ể": "E", "ể": "e", "Ễ": "E", "ễ": "e", "Ệ": "E", "ệ": "e", "Ỉ": "I", "ỉ": "i", "Ị": "I", "ị": "i", "Ọ": "O", "ọ": "o", "Ỏ": "O", "ỏ": "o", "Ố": "O", "ố": "o", "Ồ": "O", "ồ": "o", "Ổ": "O", "ổ": "o", "Ỗ": "O", "ỗ": "o", "Ộ": "O", "ộ": "o", "Ớ": "O", "ớ": "o", "Ờ": "O", "ờ": "o", "Ở": "O", "ở": "o", "Ỡ": "O", "ỡ": "o", "Ợ": "O", "ợ": "o", "Ụ": "U", "ụ": "u", "Ủ": "U", "ủ": "u", "Ứ": "U", "ứ": "u", "Ừ": "U", "ừ": "u", "Ử": "U", "ử": "u", "Ữ": "U", "ữ": "u", "Ự": "U", "ự": "u", "Ỳ": "Y", "ỳ": "y", "Ỵ": "Y", "ỵ": "y", "Ỷ": "Y", "ỷ": "y", "Ỹ": "Y", "ỹ": "y", "⁰": "0", "ⁱ": "i", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "ⁿ": "n", "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "ₐ": "a", "ₑ": "e", "ₒ": "o", "ₓ": "x", "ₕ": "h", "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₚ": "p", "ₛ": "s", "ₜ": "t", "ℂ": "C", "ℊ": "g", "ℋ": "H", "ℌ": "H", "ℍ": "H", "ℎ": "h", "ℏ": "h", "ℐ": "I", "ℑ": "I", "ℒ": "L", "ℓ": "l", "ℕ": "N", "ℙ": "P", "ℚ": "Q", "ℛ": "R", "ℜ": "R", "ℝ": "R", "ℤ": "Z", "ℨ": "Z", "K": "K", "Å": "A", "ℬ": "B", "ℭ": "C", "ℯ": "e", "ℰ": "E", "ℱ": "F", "ℳ": "M", "ℴ": "o", "ℹ": "i", "ⅅ": "D", "ⅆ": "d", "ⅇ": "e", "ⅈ": "i", "ⅉ": "j", "Ⅰ": "I", "Ⅴ": "V", "Ⅹ": "X", "Ⅼ": "L", "Ⅽ": "C", "Ⅾ": "D", "Ⅿ": "M", "ⅰ": "i", "ⅴ": "v", "ⅹ": "x", "ⅼ": "l", "ⅽ": "c", "ⅾ": "d", "ⅿ": "m", "ↅ": "6", "①": "1", "②": "2", "③": "3", "④": "4", "⑤": "5", "⑥": "6", "⑦": "7", "⑧": "8", "⑨": "9", "Ⓐ": "A", "Ⓑ": "B", "Ⓒ": "C", "Ⓓ": "D", "Ⓔ": "E", "Ⓕ": "F", "Ⓖ": "G", "Ⓗ": "H", "Ⓘ": "I", "Ⓙ": "J", "Ⓚ": "K", "Ⓛ": "L", "Ⓜ": "M", "Ⓝ": "N", "Ⓞ": "O", "Ⓟ": "P", "Ⓠ": "Q", "Ⓡ": "R", "Ⓢ": "S", "Ⓣ": "T", "Ⓤ": "U", "Ⓥ": "V", "Ⓦ": "W", "Ⓧ": "X", "Ⓨ": "Y", "Ⓩ": "Z", "ⓐ": "a", "ⓑ": "b", "ⓒ": "c", "ⓓ": "d", "ⓔ": "e", "ⓕ": "f", "ⓖ": "g", "ⓗ": "h", "ⓘ": "i", "ⓙ": "j", "ⓚ": "k", "ⓛ": "l", "ⓜ": "m", "ⓝ": "n", "ⓞ": "o", "ⓟ": "p", "ⓠ": "q", "ⓡ": "r", "ⓢ": "s", "ⓣ": "t", "ⓤ": "u", "ⓥ": "v", "ⓦ": "w", "ⓧ": "x", "ⓨ": "y", "ⓩ": "z", "⓪": "0", "⓵": "1", "⓶": "2", "⓷": "3", "⓸": "4", "⓹": "5", "⓺": "6", "⓻": "7", "⓼": "8", "⓽": "9", "⓿": "0", "❶": "1", "❷": "2", "❸": "3", "❹": "4", "❺": "5", "❻": "6", "❼": "7", "❽": "8", "❾": "9", "➀": "1", "➁": "2", "➂": "3", "➃": "4", "➄": "5", "➅": "6", "➆": "7", "➇": "8", "➈": "9", "➊": "1", "➋": "2", "➌": "3", "➍": "4", "➎": "5", "➏": "6", "➐": "7", "➑": "8", "➒": "9", "ⱼ": "j", "ⱽ": "V", "〇": "0", "〡": "1", "〢": "2", "〣": "3", "〤": "4", "〥": "5", "〦": "6", "〧": "7", "〨": "8", "〩": "9", "꘠": "0", "꘡": "1", "꘢": "2", "꘣": "3", "꘤": "4", "꘥": "5", "꘦": "6", "꘧": "7", "꘨": "8", "꘩": "9", "Ꝺ": "D", "ꝺ": "d", "Ꝼ": "F", "ꝼ": "f", "Ᵹ": "G", "Ꞃ": "R", "ꞃ": "r", "Ꞅ": "S", "ꞅ": "s", "Ꞇ": "T", "ꞇ": "t", "Ꞡ": "G", "ꞡ": "g", "Ꞣ": "K", "ꞣ": "k", "Ꞥ": "N", "ꞥ": "n", "Ꞧ": "R", "ꞧ": "r", "Ꞩ": "S", "ꞩ": "s", "꣐": "0", "꣑": "1", "꣒": "2", "꣓": "3", "꣔": "4", "꣕": "5", "꣖": "6", "꣗": "7", "꣘": "8", "꣙": "9", "꤀": "0", "꤁": "1", "꤂": "2", "꤃": "3", "꤄": "4", "꤅": "5", "꤆": "6", "꤇": "7", "꤈": "8", "꤉": "9", "꧐": "0", "꧑": "1", "꧒": "2", "꧓": "3", "꧔": "4", "꧕": "5", "꧖": "6", "꧗": "7", "꧘": "8", "꧙": "9", "꩐": "0", "꩑": "1", "꩒": "2", "꩓": "3", "꩔": "4", "꩕": "5", "꩖": "6", "꩗": "7", "꩘": "8", "꩙": "9", "꯰": "0", "꯱": "1", "꯲": "2", "꯳": "3", "꯴": "4", "꯵": "5", "꯶": "6", "꯷": "7", "꯸": "8", "꯹": "9", "０": "0", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9", "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E", "Ｆ": "F", "Ｇ": "G", "Ｈ": "H", "Ｉ": "I", "Ｊ": "J", "Ｋ": "K", "Ｌ": "L", "Ｍ": "M", "Ｎ": "N", "Ｏ": "O", "Ｐ": "P", "Ｑ": "Q", "Ｒ": "R", "Ｓ": "S", "Ｔ": "T", "Ｕ": "U", "Ｖ": "V", "Ｗ": "W", "Ｘ": "X", "Ｙ": "Y", "Ｚ": "Z", "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e", "ｆ": "f", "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j", "ｋ": "k", "ｌ": "l", "ｍ": "m", "ｎ": "n", "ｏ": "o", "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t", "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y", "ｚ": "z" };
    var er = /\W/gi;
    txt = txt.replace(er, function (match) {
        var base = charMap[match];
        return !base || er.test(base) ? "" : match;
    });
}


// Converte um INTEIRO para a base 36 ou a DATA atual (timestamp)
function tokey(n) {
    return ("number" == typeof n ? n : (new Date).getTime()).toString(36);
}

// Reverte da base 36 para INTEIRO
function unkey(t) {
    return "string" == typeof t ? parseInt(t, 36) : false;
}

//formatando hora
function geraData(tipo) {
    var tipo = tipo || 'full';

    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var date = new Date();
    var data = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(pad).join('-');
    var hora = [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':');
    if (tipo == "full") return data + ' ' + hora;
    if (tipo == "data") return data;
    if (tipo == "hora") return hora;
}

// Alerts
function report(text, type, extra, tempo) {
    extra = extra || null;
    tempo = tempo || 4000;
    type = type || ALERT;

    // Mostra no console, também.
    LOG(text, type, extra);

    //Criando o toast, eu mesmo...
    var id = tokey();
    var toast = document.createElement('DIV');
    toast.className = 'toast ' + type;
    toast.id = id;
    toast.innerHTML = text;
    toast.onclick = function (e) {
        e.target.remove()
    };
    $('#ctoast').append(toast);

    setTimeout(function () {
        document.getElementById(id).classList.add('active');
        setTimeout(function () {
            document.getElementById(id).remove()
        }, tempo);
    }, 500);
}

// Log no console
function LOG(text, type, extra) {
    extra = extra || null;
    type = type || ALERT;
    var csl = 'log';
    if (type == ALERT) csl = 'error';
    if (type == WARN) csl = 'warn';

    return console[csl](text, extra);
}

// Gera um TOKEN aleatório
function rpass(chars) {
    if ("undefined" == typeof chars || chars > 40 || chars < 0) chars = 20;
    var pass = '',
        ascii = [
            [48, 57],
            [64, 90],
            [97, 122]
        ];
    for (var i = 0; i < chars; i++) {
        var b = Math.floor(Math.random() * ascii.length);
        pass += String.fromCharCode(Math.floor(Math.random() * (ascii[b][1] - ascii[b][0])) + ascii[b][0]);
    }
    return pass;
}

// Função para limpar tags HTML de uma string
// Ex.: quando alguém cola um texto externo em uma caixa de texto....
function clearText(txt) {
    var div = document.createElement("div");
    txt = txt.replace(/<div>.*?<\/div>/g, function (a) {
        return a.replace('<div>', "\n").replace('</div>', '');
    });
    div.innerHTML = txt;
    return div.textContent || div.innerText || "";
}

// Carrega um recurso
function loadPage(page) {
    return require(__dirname + '/js/page/' + page + '.js');
}

// Retorna o elemento indicado pelo ID
function _(id) {
    return document.getElementById(id)
}
/*

    Notificações

 */
let APP_INFO = {

    recibo_url: SERVER_URL + '/msg/recibo',
    contador: 0,


    push: (data) => {

        // Mostrando mensagens
        if ("undefined" != typeof data['msg']) {

            $("#notification .default").remove();

            data.msg.map((msg) => {
                var d = new Date(msg.envio);
                _("notification").innerHTML += '<div class="mensagem" onclick="APP_INFO.check(this, \'' + msg.id + '\', \'' + msg.link + '\')"><i class="check icon"></i><h3>' + msg.titulo + '</h3><p>' + msg.mensagem + '</p><span>' + d.toLocaleString() + '</span></div>';
                APP_INFO.contador++;
            })

            // Mostrando o ícone
            APP_INFO.displayBell()

            // Mostrando na área de notificação do Windows 10
            var p = data.msg.length > 1 ? 's' : '';
            ipcRenderer.send('showNotification', 'Notificações', 'Você recebeu ' + data.msg.length + ' nova' + p + ' mensagen' + p + '!')



        }
    },

    check: (e, id, link) => {
        if (link != "false") { SERVER.openLink(link) }
        SERVER.send(APP_INFO.recibo_url, { id: id }, () => {
            APP_INFO.contador--;
            APP_INFO.displayBell()
            e.remove()
        });
    },

    displayBell: () => {
        if (APP_INFO.contador <= 0) {
            APP_INFO.contador = 0;
            $("#topbell a").html('')
            $("#topbell a").hide()
            _("notification").innerHTML = '<span class="default">Você não tem novas notificações!<i class="bell slash outline icon"></i></span>';
        } else {
            $("#topbell a").html((APP_INFO.contador > 9 ? '+9' : APP_INFO.contador))
            $("#topbell a").show()
        }
    }



}
/** 
 * Envia arquivos ao servidor
 */

//var request = require('request')
var fs = require('fs')
var { dialog } = require('electron')

let SENDFILE = {

    noAdd: false,
    file: [],
    anexado: [],
    saveUrl: SERVER_URL + '/file2/save',
    listUrl: SERVER_URL + '/file2/list',
    deleteUrl: SERVER_URL + '/file2/delete',
    downloadUrl: SERVER_URL + '/file2/download',

    // Remove arquivo
    remove: function (id) {
        if ("undefined" != typeof SENDFILE.anexado[id]) {
            SENDFILE.anexado.splice(id, 1); // Retira um arquivo da lista
            SENDFILE.show(); // atualiza a listagem
        }
    },

    // Limpa todas as entradas
    clear: function () {
        // Limpando listagem dos anexados
        $(".file .file_attached").html('');

        // Limpando a listagens dos inseridos localmente
        SENDFILE.anexado = [];
        SENDFILE.show();
    },

    // Adiciona arquivos 
    add: function (e) {
        var f = e.target;

        // Caso o elemento só lista - não adiciona novos arquivos
        if (SENDFILE.noAdd == true) {
            f.type = 'hidden'
            return false;
        } else {
            f.type = 'file'
        }

        //var anexado = [];
        var n = SENDFILE.anexado.length;
        for (var i in f.files) {
            if ("undefined" == typeof f.files[i].path) continue;
            if (f.files[i].size > 5000000) {
                report('Arquivo <b>muito grande</b>!<br>' + f.files[i].path, WARN, null, 7000);
                continue;
            }
            SENDFILE.anexado[n] = f.files[i].path;
            n++;
        }

        f.value = null; // pega a referencia dos anexados no input->file
        return SENDFILE.show(); // show file list

    },

    // Show Files
    show: function () {

        // Limpando a listagem ...
        $(".file .file_results").html('');

        // Criando a listagem de anexado
        SENDFILE.anexado.map((a, i) => {
            $(".file .file_results").append('<div class="item"><div class="right floated content"><button type="button" class="circular ui icon button basic red" data-tooltip="Remover" data-inverted="" data-position="left center" onclick="SENDFILE.remove(' + i + ')"><i class="trash alternate icon"></i></button></div><i class="large file alternate middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">' + a + '</div></div>');
        })
    },

    // Listagem dos arquivos por TABELA/ID
    list: function (tabela, id, erasable) {
        // Busca lista de arquivos no servidor...
        SERVER.send(SENDFILE.listUrl, { tabela: tabela, tabela_id: id }, function (data) {
            if ("undefined" == typeof data['error'] || data.error !== false) {
                return false; // Se não tiver arquivos para esse registro...
            } else {
                SENDFILE.file = data.row; // Salva os arquivos no objeto
                return SENDFILE.showFile(erasable); // monta a listagem na tela
            }
        })
    },

    // mostra a listagem dos arquivos no servidor
    showFile: function (erasable) {
        // Limpando a listagem...           
        $(".file .file_attached").html('');

        // Criando a listagem de arquivos
        SENDFILE.file.map((a, id) => {
            $(".file .file_attached").append('<div class="item"><div class="right floated content"><button type="button" class="circular ui icon button basic green" data-tooltip="Baixar" data-inverted="" data-position="left center" onclick="SENDFILE.download(' + id + ')"><i class="download icon"></i></button>' + (erasable == false ? '' : '<button type="button" class="circular ui icon button basic red" data-tooltip="Excluir" data-inverted="" data-position="top right" onclick="SENDFILE.delete(' + id + ')"><i class="trash alternate icon"></i></button>') + '</div><i class="large file alternate middle aligned icon blue" style="padding-top:5px"></i><div class="content bottom aligned" style="padding-top:7px">' + a.nome + '</div></div>');
        });
    },

    // Delete do servidor
    delete: function (id) {
        // Deletando no servidor...
        SERVER.send(SENDFILE.deleteUrl, { id: SENDFILE.file[id].id, nome: SENDFILE.file[id].nome }, function (data) {
            report(data.msg);
            if (!data.error) {
                delete SENDFILE.file[id];
            }
            SENDFILE.showFile();
        });
    },

    // Download do arquivo
    download: function (id) {

        var download = { file: '' };
        dialog.showSaveDialog({ defaultPath: SENDFILE.file[id].nome }, function (file) {

            $("#filesenddownloadstatus").fadeIn(1000).html('');

            // Barra de download
            $("#filesenddownloadstatus").html('<div class="ui tiny indicating progress" data-percent="0" id="sendfiledownload"><div class="bar"></div><div class="label">Baixando arquivo...</div></div>');

            // Faz o download do arquivo...
            SENDFILE.downloadFile({
                remoteFile: SENDFILE.downloadUrl + '/' + SENDFILE.file[id].id,
                localFile: file,
                onProgress: function (rec, total) {
                    var p = (rec * 100) / total;
                    $('#sendfiledownload').progress({ percent: p });
                }
            }).then(function () {
                report('Arquivo baixado com sucesso!', INFO)
                $("#filesenddownloadstatus").fadeOut(1000).html('');
            });
        })
    },

    // Download file by STREAM
    downloadFile: function (configuration) {
        // return new Promise(function(resolve, reject){
        //     // Save variable to know progress
        //     var received_bytes = 0;
        //     var total_bytes = 0;            

        //     var req = request({
        //         method: 'GET',
        //         uri: configuration.remoteFile
        //     });

        //     var out = fs.createWriteStream(configuration.localFile);
        //     req.pipe(out);

        //     req.on('response', function ( data ) {
        //         // Change the total bytes value to get progress later.
        //         total_bytes = parseInt(data.headers['content-length' ]);
        //     });

        //     // Get progress if callback exists
        //     if(configuration.hasOwnProperty("onProgress")){
        //         req.on('data', function(chunk) {
        //             // Update the received bytes
        //             received_bytes += chunk.length;
        //             configuration.onProgress(received_bytes, total_bytes);
        //         });
        //     }else{
        //         req.on('data', function(chunk) {
        //             // Update the received bytes
        //             received_bytes += chunk.length;
        //         });
        //     }

        //     req.on('end', function() {
        //         resolve();
        //     });
        // });
    },

    // Preparando e enviando arquivos anexos
    save: function (tabela, tabela_id) {
        if (!tabela || !tabela_id) return false;

        // Varrendo os arquivos e processando
        SENDFILE.anexado.map(arquivo => {

            var data = {
                name: arquivo.replace(/\\/g, '/').split('/').pop(),
                ext: arquivo.split('.').pop(),
                tabela: tabela,
                tabela_id: tabela_id
            }
            console.log('FORA', data)

            fs.readFile(arquivo, function (e, f) {
                console.log('DENTRO', f, data, arquivo)
                // Converte em base64
                var bf = new Buffer(f, 'binary').toString('base64')

                // Enviando o arquivo ...
                SERVER.send(SENDFILE.saveUrl, data, function (dt) {
                    if (dt == false || dt.error == true || "undefined" == typeof dt['msg']) {
                        report('Não consegui enviar o arquivo<br>' + data[i].name + '!!<br>Tente novamente, mais tarde.', ALERT, null, 7000)
                    } else {
                        report(dt.msg, INFO, null, 10000);
                    }
                }, bf);
            })
        })

        // Limpando a listagem de anexado
        SENDFILE.anexado = [];
        SENDFILE.show();
    }
}
/**
 * Cadastro da Empresa e suas filiais
 * 
 */
APP_BASE = {

    config: {

        veiculos: SERVER_URL + '/cadastro/veiculo/list',
        empresas: SERVER_URL + '/cadastro/empresa/list',

    },


    // Pegando a listagem de veiculos
    getVeiculos: function (unSelected) {

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.veiculos, {}, function (data) {

            if ("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            var op = data.row.map((a) => {
                return '<option value="' + a.id + '">' + a.placa + '</option>';
            })
            if (unSelected) {
                op = '<option value="0" selected>Selecione...</option>' + op;
            }
            $("#veiculo").html(op);
        })
    },

    // Pegando a listagem de clientes
    getClientes: function (unSelected) {

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, { tipo: "cliente" }, function (data) {

            if ("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            var op = data.row.map((a) => {
                return '<option value="' + a.id + '">' + a.nome_fantasia + '</option>';
            })
            if (unSelected) {
                op = '<option value="0" selected>Selecione...</option>' + op;
            }
            $("#cliente").html(op);
        })
    },

    // Pegando a listagem de Seguradora
    getSeguradoras: function (unSelected) {

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, { tipo: "seguradora" }, function (data) {

            if ("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            var op = data.row.map((a) => {
                return '<option value="' + a.id + '">' + a.nome_fantasia + '</option>';
            })
            if (unSelected) {
                op = '<option value="0" selected>Selecione...</option>' + op;
            }
            $("#seguradora").html(op);
        })
    },

    // Pegando a listagem de Concessionaria
    getConcessionarias: function (unSelected) {

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, { tipo: "concessionaria" }, function (data) {

            if ("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            var op = data.row.map((a) => {
                return '<option value="' + a.id + '">' + a.nome_fantasia + '</option>';
            })
            if (unSelected) {
                op = '<option value="0" selected>Selecione...</option>' + op;
            }
            $("#concessionaria").html(op);
        })
    },

    // Pegando a listagem de Fornecedor
    getFornecedores: function (unSelected) {

        var unSelected = unSelected || false;

        SERVER.send(APP_BASE.config.empresas, { tipo: "fornecedor" }, function (data) {

            if ("undefined" == typeof data['row']) return false; // Se vier sem rows (nenhum resultado)

            var op = data.row.map((a) => {
                return '<option value="' + a.id + '">' + a.nome_fantasia + '</option>';
            })
            if (unSelected) {
                op = '<option value="0" selected>Selecione...</option>' + op;
            }
            $("#fornecedor").html(op);
        })
    }





}



/**
 * Cadastros
 * 
 */
APP_CADASTRO = {

    page: {
        index: {
            url: 'Assets/html/cadastro/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'Assets/html/cadastro/dashboard.html',
            title: ''
        },
        usuario: {
            url: 'Assets/html/cadastro/usuario.html'
        },
        empresa: {
            url: 'Assets/html/cadastro/empresa.html',
            title: 'Cadastro da Empresa',
            tipo: 'empresa'
        },
        seguradora: {
            url: 'Assets/html/cadastro/empresa.html',
            title: 'Cadastro de Seguradora',
            tipo: 'seguradora'
        },
        cliente: {
            url: 'Assets/html/cadastro/empresa.html',
            title: 'Cadastro de Cliente',
            tipo: 'cliente'
        },
        concessionaria: {
            url: 'Assets/html/cadastro/empresa.html',
            title: 'Cadastro de Concessionária',
            tipo: 'concessionaria'
        },
        fornecedor: {
            url: 'Assets/html/cadastro/empresa.html',
            title: 'Cadastro de Fornecedor',
            tipo: 'fornecedor'
        },
        fabricante: {
            url: 'Assets/html/cadastro/fabricante.html',
            title: 'Cadastro de Fabricante de Veículo'
        },
        veiculo: {
            url: 'Assets/html/cadastro/veiculo.html'
        },
        tipo_infracao: {
            url: 'Assets/html/cadastro/tipo_infracao.html'
        },
        status_infracao: {
            url: 'Assets/html/cadastro/status_infracao.html'
        },
        tipo_nota: {
            url: 'Assets/html/cadastro/tipo_nota.html'
        },
        tipo_os: {
            url: 'Assets/html/cadastro/tipo_os.html'
        },
        item: {
            url: 'Assets/html/cadastro/item.html'
        },
        veiculo_historico_acao: {
            url: 'Assets/html/cadastro/veiculo_historico_acao.html'
        }
    },
    listField: false, // referencia para a seção de listagem de cadastro
    editField: false, // referencia para a seção de formulário de cadastro
    list_page_atual: 1,


    init: function () {

        APP_CADASTRO.show(); // carrega o módulo
    },

    // Carrega a página HTML do MÓDULO
    show: function () {

        $.get(APP_CADASTRO.page.index.url)
            .done(function (html) {
                $("#body").html(html)
                $("title").html(APP_CADASTRO.page.index.title)
                $("#toptitle").html(APP_CADASTRO.page.index.title)

            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    },

    // Carrega a partição de HTML (página)
    form: function () {
        $.get(APP_CADASTRO.page[APP_MODULE_PAGE].url)
            .done(function (html) {// Carrega o HTML ...
                $("#form").html(html)
            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    }
}
/**
 * Relatórios
 * 
 */
APP_RELATORIO = {

    page: {
        index: {
            url: 'Assets/html/relatorio/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'Assets/html/relatorio/dashboard.html',
            title: ''
        },
        veiculo: {
            url: 'Assets/html/relatorio/veiculo.html'
        },
        nota: {
            url: 'Assets/html/relatorio/nota.html'
        },
        sinistro: {
            url: 'Assets/html/relatorio/sinistro.html'
        },
        os: {
            url: 'Assets/html/relatorio/os.html'
        },
        infracao: {
            url: 'Assets/html/relatorio/infracao.html'
        },
        venda: {
            url: 'Assets/html/relatorio/venda.html'
        }
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function () {

        APP_RELATORIO.show();

    },

    // Carrega a página HTML
    show: function () {

        $.get(APP_RELATORIO.page.index.url)
            .done(function (html) {
                $("#body").html(html)
                $("title").html(APP_RELATORIO.page.index.title)
                $("#toptitle").html(APP_RELATORIO.page.index.title)

            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    },

    // Carrega formulário
    form: function () {
        $.get(APP_RELATORIO.page[APP_MODULE_PAGE].url)
            .done(function (html) {
                $("#form").html(html)
            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    }
}
/**
 * Lançamentos
 * 
 */
APP_LANCAMENTO = {

    page: {
        index: {
            url: 'Assets/html/lancamento/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'Assets/html/lancamento/dashboard.html',
            title: ''
        },
        veiculo_historico: {
            url: 'Assets/html/lancamento/veiculo_historico.html'
        },
        contrato: {
            url: 'Assets/html/lancamento/contrato.html'
        },
        sinistro: {
            url: 'Assets/html/lancamento/sinistro.html'
        },
        infracao: {
            url: 'Assets/html/lancamento/infracao.html'
        },
        os: {
            url: 'Assets/html/lancamento/os.html'
        },
        venda: {
            url: 'Assets/html/lancamento/venda.html'
        },
        nota: {
            url: 'Assets/html/lancamento/nota.html'
        }
    },
    template: {
        relatorio: 'Assets/html/print/relatorio.html'
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function () {

        APP_LANCAMENTO.show();

    },

    // Carrega a página HTML
    show: function () {

        $.get(APP_LANCAMENTO.page.index.url)
            .done(function (html) {
                $("#body").html(html)
                $("title").html(APP_LANCAMENTO.page.index.title)
                $("#toptitle").html(APP_LANCAMENTO.page.index.title)

            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    },

    // Carrega formulário
    form: function () {
        $.get(APP_LANCAMENTO.page[APP_MODULE_PAGE].url)
            .done(function (html) {
                $("#form").html(html)
            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    }
}
/**
 * Notificações
 * 
 */
APP_NOTIFICACAO = {

    page: {
        title: 'Notificação',
        index: {
            url: 'Assets/html/notificacao/index.html',
            title: 'W5Frota'
        },
        dashboard: {
            url: 'Assets/html/notificacao/dashboard.html',
            title: ''
        },
        infracao: {
            url: 'Assets/html/notificacao/infracao.html'
        }
    },
    listField: false,
    editField: false,
    list_page_atual: 1,


    init: function () {

        APP_NOTIFICACAO.show();

    },

    // Carrega a página HTML
    show: function () {

        $.get(APP_NOTIFICACAO.page.index.url)
            .done(function (html) {
                $("#body").html(html)
                $("title").html(APP_NOTIFICACAO.page.index.title)
                $("#toptitle").html(APP_NOTIFICACAO.page.index.title)

            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    },

    // Carrega formulário
    form: function () {
        $.get(APP_NOTIFICACAO.page[APP_MODULE_PAGE].url)
            .done(function (html) {
                $("#form").html(html)
            }).fail(function (e) {
                report('Não consegui carregar a página!')
            })
    }
}
// Controle de versão - modificar conforme a versão, para upload no usuário
const versionname = 'W5Frota';
const versionbuild = '1811220350';
const version = '0.6.1';

// Acionando o ContextMenu
const { Menu, MenuItem } = require('electron')


window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // var contextMenu = Menu.getApplicationMenu().items.filter(function(item){
    //   return item.label == "Edit";
    // })[0].submenu;

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Desfazer',
        role: 'undo',
    }, {
        label: 'Refazer',
        role: 'redo',
    }, {
        type: 'separator',
    }, {
        label: 'Cortar',
        role: 'cut',
    }, {
        label: 'Copiar',
        role: 'copy',
    }, {
        label: 'Colar',
        role: 'paste',
    }, {
        type: 'separator',
    }, {
        label: 'Selecionar tudo',
        role: 'selectall',
    },
    ]);

    let node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            contextMenu.popup(remote.getCurrentWindow());
            break;
        }
        node = node.parentNode;
    }

}, false);

// Low-DB
//const low = require('lowdb')
//const FileSync = require('lowdb/adapters/FileSync')
//const adapter = new FileSync('config.json')
//const db = low(adapter)
const shell = require('electron').shell;

// IPC (comunicação com a base "main.js")
const { ipcRenderer } = require('electron')

// Variáveis da Aplicação
const APP_MODULE = {
    cadastro: APP_CADASTRO,
    lancamento: APP_LANCAMENTO,
    relatorio: APP_RELATORIO,
    notificacao: APP_NOTIFICACAO
}
let APP_MODULE_ID = 'cadastro'
let APP_MODULE_PAGE = 'dashboard'

// debug only - delete-me after...
let TMP1 = []
let TMP2 = ''
let TMP3 = ''


// START Application
window.onload = () => {

    // Start MENU principal da aplicação
    APP_MENU.init();

    // Checando login
    APP_LOGIN.init();

    // Botão de FECHAR a JANELA
    $('#topclose').on('click', () => { ipcRenderer.send('fechar') })

    // Botão de MAXIMIZAR a JANELA
    $('#topmax').on('click', () => { ipcRenderer.send('maximize') })

    // Logout
    ipcRenderer.on('logout', () => { APP_LOGIN.logout() })

    // Modal message to APP_PAGE
    ipcRenderer.on('modalMsg', function (e, a, b, c) {
        if ("function" == typeof APP_PAGE['modalMsg']) {
            APP_PAGE.modalMsg(e, a, b, c);
        }
    })




    // AUTO UPDATE ---- teste
    ipcRenderer.on('message', (e, t) => console.log(e, t))





    // Change menu - notification
    $("#topbell").on('click', () => {
        $("#topmenu").removeClass('on')
        $("#topbell").addClass('on')
        //$("#topbell a").hide();
        $("#menu").fadeOut(0, () => {
            $("#notification").fadeIn('slow')
        })
    })
    $("#topmenu").on('click', () => {
        $("#topmenu").addClass('on')
        $("#topbell").removeClass('on')
        //$("#topbell a").hide();
        $("#notification").fadeOut(0, () => {
            $("#menu").fadeIn('slow')
            //$("#notification").html('<span class="default">Você não tem novas notificações!<i class="bell slash outline icon"></i></span>')
        })
    })

    // Acendendo "blackout" & mostrando o "corpo"
    _('blackout').style.display = 'none';

    // Ouvindo o redimensionamento da tela
    document.body.onresize = () => {
        if (!APP_LOGIN.logged) { return false }

        if (document.body.offsetWidth > 800) {
            APP_MENU.show()
        } else {
            APP_MENU.hide()
        }
    }

    // Abrir e fechar o menu ao clicar no logo
    _('logo').onclick = () => {
        if (!APP_LOGIN.logged) { return false }
        APP_MENU.toggle()
    }
}

// Gerencia menu 
const APP_MENU = {

    status: 'hide',

    init: () => {

        // Atualiza a versão do software
        $("#appinfo").html('<b>' + versionname + '</b> - build ' + versionbuild + '/' + version);

        // Inicia o Accordion para o menu do Semantic-ui
        $('.ui.accordion').accordion();

        // Click no MENU
        let menu = document.querySelectorAll('#mmenu .title')
        for (var i = 0; i < menu.length; i++) {
            menu[i].onclick = (e) => {

                // Identificando o módulo
                APP_MODULE_PAGE = 'dashboard';
                APP_MODULE_ID = e.target.getAttribute('data-module');

                // Resetando o submenu dos módulos
                var s = document.querySelector('.submenu li.active');
                if ("undefined" != typeof s && null != s) s.classList.remove('active');

                // Carregando e ropdando os recursos do módulo
                APP_MODULE[APP_MODULE_ID].init();
                APP_MODULE[APP_MODULE_ID].form(APP_MODULE_PAGE);
            }
        }

        // Click no submenu
        let submenu = document.querySelectorAll('.submenu li');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].onclick = (e) => {

                // Resetando o submenu ACTIVE
                var s = document.querySelector('.submenu li.active');
                if ("undefined" != typeof s && null != s) s.classList.remove('active');

                // Ativando o submenu clicado
                e.target.classList.add('active');

                // Setando as variáveis da APP
                APP_MODULE_PAGE = e.target.getAttribute('data-page');
                APP_MODULE_ID = e.target.getAttribute('data-module');

                // Carregando módulo e form conforme seleção
                APP_MODULE[APP_MODULE_ID].init();
                APP_MODULE[APP_MODULE_ID].form(APP_MODULE_PAGE);

                // Escondendo o menu, se necessário
                if (APP_MENU.status == 'float') APP_MENU.hide()
            }
        }
    },
    hide: () => {
        _('mmenu').classList.remove('on')
        _('mmenu').classList.remove('float')
        _('body').classList.add('on')
        APP_MENU.status = 'hide'
    },
    show: () => {
        if (document.body.offsetWidth > 800) {
            _('mmenu').classList.add('on')
            _('mmenu').classList.remove('float')
            _('body').classList.remove('on')
            APP_MENU.status = 'show'
        } else {
            _('mmenu').classList.add('on');
            _('mmenu').classList.add('float');
            APP_MENU.status = 'float'
        }
    },
    toggle: () => {
        if (APP_MENU.status == 'show' || APP_MENU.status == 'float') {
            APP_MENU.hide();
        } else {
            APP_MENU.show();
        }
    }
}


// Login ...
const APP_LOGIN = {

    logged: false,

    securityUrl: 'Assets/html/security.html',

    init: () => {

        // Pegando a configuração de usuário do sistema
        //var user = db.get('user').value();

        //if ("undefined" == typeof user && 1 == 0) {
        user = {
            "auto": true,
            "id": 0,
            "life": 0,
            "name": "",
            "token": "",
            "datein": 0,
            "logged": false
        }
        //db.set('user', user).write();
        //}

        // Verificando se está logado.
        if (user.id == 0 || user.token == '' || user.logged == false || (new Date(user.life)) < (new Date)) {
            APP_LOGIN.logout();
        } else {
            // Roda a aplicação
            APP_LOGIN.startApp();
        }
    },

    logout: function (quiet) {
        var quiet = quiet || false;

        APP_LOGIN.logged = false;

        // Logout no servidor
        if (quiet === false) {
            //SERVER.send(SERVER_URL_LOGOUT, { id: db.get('user').value().id, log: 'logout' });
        }

        // Apaga a configuração (file ".frota")
        // db.set('user', {
        //     auto: true,
        //     id: 0,
        //     life: 0,
        //     name: "",
        //     token: "",
        //     datein: 0,
        //     logged: false
        // }).write();

        // Carrega a tela de segurança
        $.get(APP_LOGIN.securityUrl).done(function (html) {

            $("#body").html(html)
            $("title").html('Controle de Frota :: Login')
            $("#toptitle").html('')
            $("#loginsobre").html('<b>' + versionname + '</b> - build ' + versionbuild + '/' + version)

            APP_MENU.hide(); // esconde o menu

            // Escutando o botão de login
            $('#formlogin').on('submit', function (e) {
                e.preventDefault();
                $("#btlogin").addClass('loading');

                // Call login...
                APP_LOGIN.login();
            })

            document.body.style.display = 'block';
        })
    },

    startApp: () => {

        // Status
        APP_LOGIN.logged = true;

        // Inicializa SERVER (configuração armazenada no 'user')
        //var u = db.get('user').value();
        //SERVER.init(u.token, u.id);

        // Carrega página inicial do módulo ...
        APP_MODULE[APP_MODULE_ID].init();
        APP_MODULE[APP_MODULE_ID].form();

        document.body.style.display = 'block';

        // Show menu ...
        APP_MENU.show();
    },

    // Checa o login e senha e obtem o TOKEN para comunicações posteriores
    login: () => {

        // Obtendo a chave publica do servidor
        $.get(SERVER_URL_RSAKEY).done(function (data) {

            if ("undefined" != data.key) {
                SERVER.RSA = data.key;

                // Gerando uma chave aleatória para AES
                SERVER.KEY = rpass(20);

                var loginData = JSON.stringify({
                    login: $("#login").val(),
                    passw: $("#passw").val(),
                    token: SERVER.KEY
                })

                // Criptografando com RSA
                var cripto = RSA.encrypt(loginData, RSA.getPublicKey(SERVER.RSA));

                // Checando login x senha
                $.post(SERVER_URL_LOGIN, {
                    data: cripto
                })
                    .done(function (data) {

                        if ("undefined" != typeof data.error) {
                            if (data.error == true) {
                                $("#btlogin").removeClass('loading');
                                return report('Seu login ou senha estão incorretos!', ALERT);
                            }

                            // decriptando
                            AES.size(256);
                            var dt = AES.dec(data.data, SERVER.KEY);

                            if (!dt) {
                                $("#btlogin").removeClass('loading');
                                return report('Seu login ou senha estão incorretos!', ALERT);
                            }

                            // decodificando string para json
                            var user = JSON.parse(dt);

                            // Salvando "auto login"
                            //user.auto = _('autologin').checked;

                            // Salvar login
                            user.datein = (new Date).getTime();
                            user.logged = true;

                            //db.set('user', user).write();

                            // Roda a aplicação
                            APP_LOGIN.startApp();

                        } else {
                            $("#btlogin").removeClass('loading');
                            return report('Não consegui me conectar com o servidor!<br>Verifique se está conectado à internet.', ALERT);
                        }
                    })
                    .fail(function (e) {
                        $("#btlogin").removeClass('loading');
                        report('Não consegui me conectar com o servidor!<br>Verifique se está conectado à internet.', ALERT);
                    })

            } else {
                $("#btlogin").removeClass('loading');
                report('Algo inexperado ocorreu e não pude carregar a chave do servidor.<br>Verifique sua conexão de internet.', ALERT);
            }

        }).fail(() => {
            $("#btlogin").removeClass('loading');
            report('Algo inexperado ocorreu e não pude me conectar ao servidor.', ALERT);
        })
    }
}


// PROXY para transporte criptografado com o servidor 
const SERVER = {
    RSA: '',
    KEY: '',
    ID: 0,
    URL: '',
    WDOG: false,
    PING_TIMER: 0,
    LEDBLINK: false,

    init: function (token, id) {
        SERVER.KEY = token;
        SERVER.ID = id;

        // Starts a server WDOG to ping in server (for sincronizes)
        SERVER.WDOG = setInterval(() => {
            SERVER.watchdog()
        }, 1000);
    },

    // Interrupção à cada 1 segundo - para "acordar" funções periódicas
    watchdog: () => {

        ////console.log('[WATCH DOG]');

        // -------------------- Ping
        SERVER.PING_TIMER++;

        if (SERVER.PING_TIMER == 30) {
            SERVER.PING_TIMER = 0;

            // Se NÃO estiver logado, sai sem fazer nada.
            if (APP_LOGIN.logged === false) return false;

            // Roda "ping"!
            SERVER.ping();
        }

        // --- Others counters
    },


    // Para transportar dados criptografados com o servidor
    // param = dado a ser transferido sem criptografia
    //      ex.: param ==> {base: dataBase} 
    send: function (url, data, callback, param) {
        TMP2 = data;

        SERVER.led(true); // Start LED INDICATOR

        AES.size(256);
        var data = AES.enc(JSON.stringify(data), SERVER.KEY);
        var data = {
            data: data,
            id: SERVER.ID
        };

        // Para enviar dados não criptografados
        if (param) {
            data['param'] = param;
        }

        // Enviando via POST
        $.post(url, data).done(function (dta) {

            TMP = dta; // To debug

            try {

                // Decriptando
                var dec = AES.dec(dta.data, SERVER.KEY);

                // Recuperando objeto JSON
                var dt = JSON.parse(dec);

            } catch (e) {

                // Ocorrendo um erro, resulta em [false]
                dt = false
            }

            TMP1 = dt; // To debug

            // Se a chave não conseguir decodificar, força o logout
            if (!dt) {
                setTimeout(() => { APP_LOGIN.logout(true) }, 1000);
                SERVER.led(false); // Start LED INDICATOR
                return report('Violação de segurança!<br>Para manter a segurança refaça seu LOGIN.');
            }

            // Zerando o PING
            SERVER.PING_TIMER = 0;

            // Se a chave foi alterada no servidor, atualiza o local.
            // if (SERVER.KEY !== dt.key) {
            //     SERVER.KEY = dt.key;
            //     var user = db.get('user').value();
            //     user.token = dt.key;
            //     db.set('user', user).write();
            // }

            delete dt.key; // Apaga a key dos dados recebidos
            SERVER.led(false); // Start LED INDICATOR

            // Retorna pelo CallBACK ou pela chamada a função (uma promisse)
            if ("function" == typeof callback) {
                return callback(dt, dta.extra, dec);
            }

        }).fail(function (e) {
            SERVER.led(false); // Start LED INDICATOR
            //console.log('[FAIL]:', e, data);
            report('Não consegui me comunicar com o servidor de dados!<br>Verifique a conexão de internet.')
        })
    },

    // Checa se o servidor está acessível
    ping: () => {

        SERVER.led(true); // Start LED INDICATOR

        AES.size(256);
        var data = AES.enc(JSON.stringify({
            key: SERVER.KEY,
            id: SERVER.ID,
            version: version,
            versionname: versionname,
            versionbuild: versionbuild
        }), SERVER.KEY);
        var data = {
            data: data,
            id: SERVER.ID
        };

        $.post(SERVER_URL_PING, data).done(function (dt) {

            try {
                var dt = JSON.parse(AES.dec(dt.data, SERVER.KEY))
            } catch (e) {
                dt = false
            }

            if (!dt || "undefined" == typeof dt[0] || "undefined" == typeof dt[0]['key']) {

                setTimeout(() => { APP_LOGIN.logout() }, 2000);

                SERVER.led(false); // Start LED INDICATOR
                return //console.log('[' + (new Date).toLocaleString() + '] Sincronização falhou!!')
            }

            dt = dt[0];

            // Se a chave foi alterada no servidor, atualiza o local.
            // if (SERVER.KEY !== dt.key) {
            //     SERVER.KEY = dt.key;
            //     var user = db.get('user').value();
            //     user.token = dt.key;
            //     db.set('user', user).write();
            // }

            // Para verificar as notificações ...
            APP_INFO.push(dt);

            SERVER.led(false); // Start LED INDICATOR  

        }).fail(function (e) {
            SERVER.led(false); // Start LED INDICATOR
            //console.log('[' + (new Date).getTime().toLocaleString() + '] Sincronização falhou, com erro: ', e);
        })
    },

    // Sinalização de acesso à rede
    led: function (status) {
        var status = status || false;
        clearInterval(SERVER.LEDBLINK);

        if (status == false) {
            $("#topconnect").removeClass('on');
        } else {
            SERVER.LEDBLINK = setInterval(() => {
                $("#topconnect").toggleClass('on')
            }, 100);
        }
    },

    // Open external link in default browser
    openLink: function (link) {
        shell.openExternal(link);
    }
}