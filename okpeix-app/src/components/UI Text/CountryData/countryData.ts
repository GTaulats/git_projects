export type Country = {
  name: string,
  code: string,
  phoneCode: string;
  phoneFormat: string;
  flag: string;
}

export const Countries = [
  { name: "Afghanistan", code: "AF", phoneCode: "93", phoneFormat: "xxx xxx xxxx", flag: "🇦🇫" },
  { name: "Albania", code: "AL", phoneCode: "355", phoneFormat: "xxx xxx xxxx", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", phoneCode: "213", phoneFormat: "xxxx xx xx xx", flag: "🇩🇿" },
  { name: "Andorra", code: "AD", phoneCode: "376", phoneFormat: "xxx xxx", flag: "🇦🇩" },
  { name: "Angola", code: "AO", phoneCode: "244", phoneFormat: "xxx xxx xxx", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "AG", phoneCode: "1-268", phoneFormat: "xxx-xxxx", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", phoneCode: "54", phoneFormat: "xxx-xxxx-xxxx", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", phoneCode: "374", phoneFormat: "xx-xxxxxx", flag: "🇦🇲" },
  { name: "Australia", code: "AU", phoneCode: "61", phoneFormat: "xxxx-xxx-xxx", flag: "🇦🇺" },
  { name: "Austria", code: "AT", phoneCode: "43", phoneFormat: "xxx-xxxxxx", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", phoneCode: "994", phoneFormat: "xx-xxx-xxxx", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", phoneCode: "1-242", phoneFormat: "xxx-xxxx", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", phoneCode: "973", phoneFormat: "xxxx-xxxx", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", phoneCode: "880", phoneFormat: "xxx-xxxxxxx", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", phoneCode: "1-246", phoneFormat: "xxx-xxxx", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", phoneCode: "375", phoneFormat: "xx-xxx-xx-xx", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", phoneCode: "32", phoneFormat: "xxx-xx-xx-xx", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", phoneCode: "501", phoneFormat: "xxx-xxxx", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", phoneCode: "229", phoneFormat: "xx-xx-xxxx", flag: "🇧🇯" },
  { name: "Bhutan", code: "BT", phoneCode: "975", phoneFormat: "xx-xxxxxx", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", phoneCode: "591", phoneFormat: "xxx-xxxx-xxx", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", phoneCode: "387", phoneFormat: "xx-xxx-xxx", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", phoneCode: "267", phoneFormat: "xx-xxxxxx", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", phoneCode: "55", phoneFormat: "xx-xxxxx-xxxx", flag: "🇧🇷" },
  { name: "Brunei", code: "BN", phoneCode: "673", phoneFormat: "xxx-xxxx", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", phoneCode: "359", phoneFormat: "xxx-xx-xxx-xxx", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", phoneCode: "226", phoneFormat: "xx-xx-xxxxxx", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", phoneCode: "257", phoneFormat: "xx-xx-xxxx", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "CV", phoneCode: "238", phoneFormat: "xxx-xx-xx", flag: "🇨🇻" },
  { name: "Cambodia", code: "KH", phoneCode: "855", phoneFormat: "xx-xxx-xxx", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", phoneCode: "237", phoneFormat: "xxx-xx-xxxxx", flag: "🇨🇲" },
  { name: "Canada", code: "CA", phoneCode: "1", phoneFormat: "xxx-xxx-xxxx", flag: "🇨🇦" },
  { name: "Central African Republic", code: "CF", phoneCode: "236", phoneFormat: "xx-xx-xxxx", flag: "🇨🇫" },
  { name: "Chad", code: "TD", phoneCode: "235", phoneFormat: "xx-xx-xxxx", flag: "🇹🇩" },
  { name: "Chile", code: "CL", phoneCode: "56", phoneFormat: "xx-xxxx-xxxx", flag: "🇨🇱" },
  { name: "China", code: "CN", phoneCode: "86", phoneFormat: "xxx-xxxx-xxxx", flag: "🇨🇳" },
  { name: "Colombia", code: "CO", phoneCode: "57", phoneFormat: "xxx-xxx-xxxx", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", phoneCode: "269", phoneFormat: "xx-xx-xx", flag: "🇰🇲" },
  { name: "Congo", code: "CG", phoneCode: "242", phoneFormat: "xx-xxx-xxxxx", flag: "🇨🇬" },
  { name: "Costa Rica", code: "CR", phoneCode: "506", phoneFormat: "xxx-xxxx-xxxx", flag: "🇨🇷" },
  { name: "Croatia", code: "HR", phoneCode: "385", phoneFormat: "xxx-xxx-xxxx", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", phoneCode: "53", phoneFormat: "xxx-xxx-xxxx", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", phoneCode: "357", phoneFormat: "xx-xxxxxx", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", phoneCode: "420", phoneFormat: "xxx-xxx-xxx", flag: "🇨🇿" },
  { name: "Denmark", code: "DK", phoneCode: "45", phoneFormat: "xx-xx-xx-xx", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", phoneCode: "253", phoneFormat: "xx-xx-xx-xx", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", phoneCode: "1-767", phoneFormat: "xxx-xxxx", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", phoneCode: "1-809, 1-829, 1-849", phoneFormat: "xxx-xxx-xxxx", flag: "🇩🇴" },
  { name: "Ecuador", code: "EC", phoneCode: "593", phoneFormat: "xxx-xxx-xxxx", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", phoneCode: "20", phoneFormat: "xx-xxx-xxxxx", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", phoneCode: "503", phoneFormat: "xxxx-xxxx", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", phoneCode: "240", phoneFormat: "xx-xxx-xxx", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", phoneCode: "291", phoneFormat: "xx-xxx-xxxx", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", phoneCode: "372", phoneFormat: "xxx-xxxxxxx", flag: "🇪🇪" },
  { name: 'Eswatini (fmr. "Swaziland")', code: "SZ", phoneCode: "268", phoneFormat: "xxxx-xxxx", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", phoneCode: "251", phoneFormat: "xx-xxxxxx", flag: "🇪🇹" },
  { name: "Fiji", code: "FJ", phoneCode: "679", phoneFormat: "xxx-xxxx", flag: "🇫🇯" },
  { name: "Finland", code: "FI", phoneCode: "358", phoneFormat: "xxx-xxxxxx", flag: "🇫🇮" },
  { name: "France", code: "FR", phoneCode: "33", phoneFormat: "xx-xx-xx-xx-xx", flag: "🇫🇷" },
  { name: "Gabon", code: "GA", phoneCode: "241", phoneFormat: "xx-xx-xxxxx", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", phoneCode: "220", phoneFormat: "xxx-xxxx", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", phoneCode: "995", phoneFormat: "xx-xxx-xxx", flag: "🇬🇪" },
  { name: "Germany", code: "DE", phoneCode: "49", phoneFormat: "xxx-xxxxxxxx", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", phoneCode: "233", phoneFormat: "xxx-xxxxxxx", flag: "🇬🇭" },
  { name: "Greece", code: "GR", phoneCode: "30", phoneFormat: "xx-xxx-xxxxxx", flag: "🇬🇷" },
  { name: "Grenada", code: "GD", phoneCode: "1-473", phoneFormat: "xxx-xxxx", flag: "🇬🇩" },
  { name: "Guatemala", code: "GT", phoneCode: "502", phoneFormat: "xxxx-xxxx", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", phoneCode: "224", phoneFormat: "xx-xxx-xxxx", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", phoneCode: "245", phoneFormat: "xxx-xxxx", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", phoneCode: "592", phoneFormat: "xxx-xxxx", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", phoneCode: "509", phoneFormat: "xxx-xxxx", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", phoneCode: "504", phoneFormat: "xxxx-xxxx", flag: "🇭🇳" },
  { name: "Hungary", code: "HU", phoneCode: "36", phoneFormat: "xxx-xxx-xxx", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", phoneCode: "354", phoneFormat: "xxx-xxxx", flag: "🇮🇸" },
  { name: "India", code: "IN", phoneCode: "91", phoneFormat: "xxxxx-xxxxx", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", phoneCode: "62", phoneFormat: "xxxx-xxxx-xxxx", flag: "🇮🇩" },
  { name: "Iran", code: "IR", phoneCode: "98", phoneFormat: "xx-xxxx-xxxx", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", phoneCode: "964", phoneFormat: "xx-xxx-xxxx", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", phoneCode: "353", phoneFormat: "xx-xxx-xxxx", flag: "🇮🇪" },
  { name: "Israel", code: "IL", phoneCode: "972", phoneFormat: "xx-xxx-xxxx", flag: "🇮🇱" },
  { name: "Italy", code: "IT", phoneCode: "39", phoneFormat: "xxx-xxx-xxxx", flag: "🇮🇹" },
  { name: "Jamaica", code: "JM", phoneCode: "1-876", phoneFormat: "xxx-xxxx", flag: "🇯🇲" },
  { name: "Japan", code: "JP", phoneCode: "81", phoneFormat: "xx-xxxx-xxxx", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", phoneCode: "962", phoneFormat: "xx-xxx-xxxx", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", phoneCode: "7", phoneFormat: "xxx-xxx-xx-xx", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", phoneCode: "254", phoneFormat: "xxx-xxxxxx", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", phoneCode: "686", phoneFormat: "xxx-xxxx", flag: "🇰🇮" },
  { name: "Kuwait", code: "KW", phoneCode: "965", phoneFormat: "xxxx-xxxx", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", phoneCode: "996", phoneFormat: "xxx-xx-xxxxx", flag: "🇰🇬" },
  { name: "Laos", code: "LA", phoneCode: "856", phoneFormat: "xx-xxxx-xxxx", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", phoneCode: "371", phoneFormat: "xxx-xxxxx-xxx", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", phoneCode: "961", phoneFormat: "xx-xxx-xxx", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", phoneCode: "266", phoneFormat: "xxx-xxxx", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", phoneCode: "231", phoneFormat: "xxx-xxxx", flag: "🇱🇷" },
  { name: "Libya", code: "LY", phoneCode: "218", phoneFormat: "xx-xxx-xxxx", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", phoneCode: "423", phoneFormat: "xxxxxx", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", phoneCode: "370", phoneFormat: "xxx-xxxxx", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", phoneCode: "352", phoneFormat: "xxxx-xxxx", flag: "🇱🇺" },
  { name: "Madagascar", code: "MG", phoneCode: "261", phoneFormat: "xx-xx-xxxxx", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", phoneCode: "265", phoneFormat: "xx-xxxxxxx", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", phoneCode: "60", phoneFormat: "xx-xxxx-xxxx", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", phoneCode: "960", phoneFormat: "xxx-xxxx", flag: "🇲🇻" },
  { name: "Mali", code: "ML", phoneCode: "223", phoneFormat: "xx-xx-xxxx", flag: "🇲🇱" },
  { name: "Malta", code: "MT", phoneCode: "356", phoneFormat: "xxx-xxxx", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", phoneCode: "692", phoneFormat: "xxx-xxxx", flag: "🇲🇭" },
  { name: "Mauritania", code: "MR", phoneCode: "222", phoneFormat: "xx-xx-xxxx", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", phoneCode: "230", phoneFormat: "xx-xxxxxx", flag: "🇲🇺" },
  { name: "Mexico", code: "MX", phoneCode: "52", phoneFormat: "xx-xxxx-xxxx", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", phoneCode: "691", phoneFormat: "xxx-xxxx", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", phoneCode: "373", phoneFormat: "xxx-xx-xxx", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", phoneCode: "377", phoneFormat: "xx-xx-xx-xx-xx", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", phoneCode: "976", phoneFormat: "xx-xxxx-xxxx", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", phoneCode: "382", phoneFormat: "xx-xxx-xxx", flag: "🇲🇪" },
  { name: "Morocco", code: "MA", phoneCode: "212", phoneFormat: "xx-xx-xx-xx-xx", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", phoneCode: "258", phoneFormat: "xx-xxxxxxx", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", phoneCode: "95", phoneFormat: "xxx-xxx-xxx", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", phoneCode: "264", phoneFormat: "xx-xxxxxxx", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", phoneCode: "674", phoneFormat: "xxx-xxxx", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", phoneCode: "977", phoneFormat: "xx-xxxxxxx", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", phoneCode: "31", phoneFormat: "xx-xxxxxx", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", phoneCode: "64", phoneFormat: "xxxx-xxx-xxx", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", phoneCode: "505", phoneFormat: "xxxx-xxxx", flag: "🇳🇮" },
  { name: "Niger", code: "NE", phoneCode: "227", phoneFormat: "xx-xx-xx-xx", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", phoneCode: "234", phoneFormat: "xxx-xxx-xxxx", flag: "🇳🇬" },
  { name: "North Macedonia", code: "MK", phoneCode: "389", phoneFormat: "xx-xxx-xxx", flag: "🇲🇰" },
  { name: "Norway", code: "NO", phoneCode: "47", phoneFormat: "xx-xx-xx-xx", flag: "🇳🇴" },
  { name: "Oman", code: "OM", phoneCode: "968", phoneFormat: "xxxx-xxxx", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", phoneCode: "92", phoneFormat: "xxx-xxxxxxx", flag: "🇵🇰" },
  { name: "Palau", code: "PW", phoneCode: "680", phoneFormat: "xxx-xxxx", flag: "🇵🇼" },
  { name: "Palestine", code: "PS", phoneCode: "970", phoneFormat: "xx-xxx-xxxx", flag: "🇵🇸" },
  { name: "Panama", code: "PA", phoneCode: "507", phoneFormat: "xxxx-xxxx", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", phoneCode: "675", phoneFormat: "xxx-xxxx", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", phoneCode: "595", phoneFormat: "xxx-xxxxxx", flag: "🇵🇾" },
  { name: "Peru", code: "PE", phoneCode: "51", phoneFormat: "xxx-xxx-xxx", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", phoneCode: "63", phoneFormat: "xxx-xxxx-xxx", flag: "🇵🇭" },
  { name: "Poland", code: "PL", phoneCode: "48", phoneFormat: "xxx-xxx-xxx", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", phoneCode: "351", phoneFormat: "xx-xxxxxxx", flag: "🇵🇹" },
  { name: "Qatar", code: "QA", phoneCode: "974", phoneFormat: "xxxx-xxxx", flag: "🇶🇦" },
  { name: "Romania", code: "RO", phoneCode: "40", phoneFormat: "xxx-xxx-xxx", flag: "🇷🇴" },
  { name: "Russia", code: "RU", phoneCode: "7", phoneFormat: "xxx-xxx-xx-xx", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", phoneCode: "250", phoneFormat: "xxx-xxx-xxx", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "KN", phoneCode: "1-869", phoneFormat: "xxx-xxxx", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", phoneCode: "1-758", phoneFormat: "xxx-xxxx", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "VC", phoneCode: "1-784", phoneFormat: "xxx-xxxx", flag: "🇻🇨" },
  { name: "Samoa", code: "WS", phoneCode: "685", phoneFormat: "xxx-xxxx", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", phoneCode: "378", phoneFormat: "xxxxxx", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", phoneCode: "239", phoneFormat: "xxx-xxxx", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", phoneCode: "966", phoneFormat: "xx-xxx-xxxx", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", phoneCode: "221", phoneFormat: "xx-xx-xxxxx", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", phoneCode: "381", phoneFormat: "xx-xxx-xx-xx", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", phoneCode: "248", phoneFormat: "xx-xxxx", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", phoneCode: "232", phoneFormat: "xxx-xxxxx", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", phoneCode: "65", phoneFormat: "xxxx-xxxx", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", phoneCode: "421", phoneFormat: "xxx-xxx-xxx", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", phoneCode: "386", phoneFormat: "xxx-xx-xxx", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", phoneCode: "677", phoneFormat: "xxx-xxx", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", phoneCode: "252", phoneFormat: "xx-xxxxxx", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", phoneCode: "27", phoneFormat: "xx-xxx-xxxx", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", phoneCode: "82", phoneFormat: "xx-xxxx-xxxx", flag: "🇰🇷" },
  { name: "South Sudan", code: "SS", phoneCode: "211", phoneFormat: "xx-xxx-xxxx", flag: "🇸🇸" },
  { name: "Spain", code: "ES", phoneCode: "34", phoneFormat: "xxx-xxx-xxx", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", phoneCode: "94", phoneFormat: "xx-xxxxxxx", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", phoneCode: "249", phoneFormat: "xxx-xxxxxxx", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", phoneCode: "597", phoneFormat: "xxx-xxxx", flag: "🇸🇷" },
  { name: "Sweden", code: "SE", phoneCode: "46", phoneFormat: "xxx-xxx-xxx", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", phoneCode: "41", phoneFormat: "xx-xxx-xx-xx", flag: "🇨🇭" },
  { name: "Syria", code: "SY", phoneCode: "963", phoneFormat: "xx-xxxx-xxx", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", phoneCode: "886", phoneFormat: "xx-xxxx-xxxx", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", phoneCode: "992", phoneFormat: "xx-xxx-xxxx", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", phoneCode: "255", phoneFormat: "xx-xxxx-xxx", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", phoneCode: "66", phoneFormat: "xxx-xxxx-xxxx", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", phoneCode: "670", phoneFormat: "xxx-xxxx", flag: "🇹🇱" },
  { name: "Togo", code: "TG", phoneCode: "228", phoneFormat: "xx-xx-xxxx", flag: "🇹🇬" },
  { name: "Tonga", code: "TO", phoneCode: "676", phoneFormat: "xxx-xxxx", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", phoneCode: "1-868", phoneFormat: "xxx-xxxx", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", phoneCode: "216", phoneFormat: "xx-xxx-xxx", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", phoneCode: "90", phoneFormat: "xxx-xxx-xxxx", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", phoneCode: "993", phoneFormat: "xx-xxx-xxx", flag: "🇹🇲" },
  { name: "Tuvalu", code: "TV", phoneCode: "688", phoneFormat: "xxx-xxxx", flag: "🇹🇻" },
  { name: "Uganda", code: "UG", phoneCode: "256", phoneFormat: "xx-xxxxxxx", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", phoneCode: "380", phoneFormat: "xx-xxx-xx-xx", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", phoneCode: "971", phoneFormat: "xx-xxx-xxxx", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", phoneCode: "44", phoneFormat: "xxxx-xxx-xxxx", flag: "🇬🇧" },
  { name: "United States of America", code: "US", phoneCode: "1", phoneFormat: "xxx-xxx-xxxx", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", phoneCode: "598", phoneFormat: "xxx-xxxx", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", phoneCode: "998", phoneFormat: "xx-xxx-xxxx", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", phoneCode: "678", phoneFormat: "xx-xxxx", flag: "🇻🇺" },
  { name: "Vatican City", code: "VA", phoneCode: "379", phoneFormat: "xxxxxx", flag: "🇻🇦" },
  { name: "Venezuela", code: "VE", phoneCode: "58", phoneFormat: "xxxx-xxx-xxxx", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", phoneCode: "84", phoneFormat: "xxx-xxxx-xxx", flag: "🇻🇳" },
  { name: "Yemen", code: "YE", phoneCode: "967", phoneFormat: "xx-xxxxxxx", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", phoneCode: "260", phoneFormat: "xx-xxxxxxx", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", phoneCode: "263", phoneFormat: "xx-xxxxxxx", flag: "🇿🇼" },
] as Country[];