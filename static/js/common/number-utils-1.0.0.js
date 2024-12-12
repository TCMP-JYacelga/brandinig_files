/**
* Formats the number according to the �format� string;
* adherses to the american number standard where a comma
* is inserted after every 3 digits.
*  note: there should be only 1 contiguous number in the format,
* where a number consists of digits, period, and commas
*        any other characters can be wrapped around this number, including '$', '%', or text
*        examples (123456.789):
*          '0' - (123456) show only digits, no precision
*          '0.00' - (123456.78) show only digits, 2 precision
*          '0.0000' - (123456.7890) show only digits, 4 precision
*          '0,000' - (123,456) show comma and digits, no precision
*          '0,000.00' - (123,456.78) show comma and digits, 2 precision
*          '0,0.00' - (123,456.78) shortcut method, show comma and digits, 2 precision
*
* @method format
* @param format {string} the way you would like to format this text
* @return {string} the formatted number
* @public
*/
Number.prototype.format = function(format) {
  if (! typeof(format) != 'string') {return ''} // sanity check

  var hasComma = -1 < format.indexOf(','),
	  psplit = stripNonNumeric().split('.'),
      that = this;

  // compute precision
  if (1 < psplit.length) {
    // fix number precision
    that = that.toFixed(psplit[1].length);
  }
  // error: too many periods
  else if (2 < psplit.length) {
    throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
  }
  // remove precision
  else {
    that = that.toFixed(0);
  }

  // get the string now that precision is correct
  var fnum = that.toString();

  // format has comma, then compute commas
  if (hasComma) {
    // remove precision for computation
    psplit = fnum.split('.');

    var cnum = psplit[0],
      parr = [],
      j = cnum.length,
      m = Math.floor(j / 3),
      n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

    // break the number into chunks of 3 digits; first chunk may be less than 3
    for (var i = 0; i < j; i += n) {
      if (i != 0) {n = 3;}
      parr[parr.length] = cnum.substr(i, n);
      m -= 1;
    }

    // put chunks back together, separated by comma
    fnum = parr.join(',');

    // add the precision back in
    if (psplit[1]) {fnum += '.' + psplit[1];}
  }

  // replace the number portion of the format with fnum
  return format.replace(/[\d,?\.?]+/, fnum);
};


function format_number(pnumber,decimals) {
    if (isNaN(pnumber)) { return 0};
    if (pnumber=='') { return 0};
    var snum = new String(pnumber);
    var sec = snum.split('.');
    var whole = parseFloat(sec[0]);
    var result = '';
    if(sec.length > 1){
        var dec = new String(sec[1]);
        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
        dec = String(whole + Math.round(parseFloat(dec))/Math.pow(10,decimals));
        var dot = dec.indexOf('.');
        if(dot == -1){
            dec += '.';
            dot = dec.indexOf('.');
        }
        while(dec.length <= dot + decimals) { dec += '0'; }
        result = dec;
    } else{
        var dot;
        var dec = new String(whole);
        dec += '.';
        dot = dec.indexOf('.');
        while(dec.length <= dot + decimals) { dec += '0'; }
        result = dec;
    }
    return result;
}

function formatNumber (obj, decimal) {
     //decimal  - the number of decimals after the digit from 0 to 3
     //-- Returns the passed number as a string in the xxx,xxx.xx format.
       anynum=eval(obj.value);
       divider =10;
       switch(decimal){
            case 0:
                divider =1;
                break;
            case 1:
                divider =10;
                break;
            case 2:
                divider =100;
                break;
            default:       //for 3 decimal places
                divider =1000;
        }

       workNum=Math.abs((Math.round(anynum*divider)/divider));

       workStr=""+workNum

       if (workStr.indexOf(".")==-1){workStr+="."}

       dStr=workStr.substr(0,workStr.indexOf("."));dNum=dStr-0
       pStr=workStr.substr(workStr.indexOf("."))

       while (pStr.length-1< decimal){pStr+="0"}

       if(pStr =='.') pStr ='';

       //--- Adds a comma in the thousands place.
       if (dNum>=1000) {
          dLen=dStr.length
          dStr=parseInt(""+(dNum/1000),10)+","+dStr.substring(dLen-3,dLen)
       }

       //-- Adds a comma in the millions place.
       if (dNum>=1000000) {
          dLen=dStr.length
          dStr=parseInt(""+(dNum/1000000),10)+","+dStr.substring(dLen-7,dLen)
       }
       retval = dStr + pStr
       //-- Put numbers in parentheses if negative.
       if (anynum<0) {retval="("+retval+")";}

    //You could include a dollar sign in the return value.
      //retval =  "$"+retval
      obj.value = retval;
}
