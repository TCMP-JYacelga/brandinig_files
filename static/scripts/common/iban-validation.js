var ibanValidator = new IBANValidator();

function IBANValidator()
{
	this.validateStructure = validateStructure;
	
	function validateStructure(value)
	{
		var ibanMinLength = 5;
		var ibanMaxLength = 34;
		
		if(typeof value !== "undefined")
		{
			var iban = value.replace( / /g, "" ).toUpperCase();
			var ibanForModCheck = "", modResult;
			
			if ( iban.length < ibanMinLength ) 
			{
				return false;
			}
			if ( iban.length > ibanMaxLength ) 
			{
				return false;
			}
	
			if (!ibanRegexValidation(iban)) 
			{
				return false; 
			}
			
			ibanForModCheck = prepareIBANForModCheck(iban);
			
			modResult = calculateMod97_10(ibanForModCheck)
			
			return modResult === 1;
		}
		
		return false;
	}
	
	
   /**
	* Check Countrywise BBAN Format For Given IBAN 
	* @param {string} iban 
    * @returns {boolean} isvalid iban
    * 
	*/
	function ibanRegexValidation(iban)
	{
		var ibanRegex = new RegExp("^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$", "");			//first 2 country code next 2 check digits and 1 to 30 basic bank account number 
		return ibanRegex.test(iban);
	}
	
	
	/**
     * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
     * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
     *
     * @param {string} iban the IBAN
     * @returns {string} the prepared IBAN
     */
	function prepareIBANForModCheck(iban)
	{
		
		var ibanCheck, ibanCheckDigits = "";
		
		//For Checksum - Move the first four characters of the IBAN to the right of the number. ISO13616
		ibanCheck = iban.substring(4, iban.length) + iban.substring(0, 4);
		
		//Convert the letters into its numeric equivalent as per IBAN Validation Rule Table
		for (var i = 0; i < ibanCheck.length; i++) 
		{
			ibanCheckDigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ibanCheck.charAt(i));
		} 
		
		return ibanCheckDigits;
	}
	
	/**
     * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
     *
     * @param iban
     * @returns {number}
     */
    function calculateMod97_10(ibanCheckDigits) 
    {
        var remainder = ibanCheckDigits,  temp;

        while (remainder.length > 2){
            temp = remainder.slice(0, 9);
            remainder = parseInt(temp, 10) % 97 + remainder.slice(temp.length);
        }

        return parseInt(remainder, 10) % 97;
    }
    
}