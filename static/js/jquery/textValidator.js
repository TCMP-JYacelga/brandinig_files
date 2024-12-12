//Function to validate the values in textfield
jQuery.fn.ValidateText = function(pattern, firstCharChk, lastCharChk, allowSeek) {
	return this.each(function() {
		$(this).bind('keydown.ValidateTextKeydown',function(event) {
			if(event.key === "%" && allowSeek === "true"){
				return true;	
			}
			
			allowedPattern = new RegExp(pattern);
			var keynum = event.keyCode || event.which;
			if ((keynum == 8
									|| keynum == 9
									|| keynum == 27
									|| keynum == 46
									||
									// Allow: Ctrl+A
									(keynum == 65 && event.ctrlKey === true)
									|| (keynum == 86 && event.ctrlKey === true)
									||
									// Allow: home, end, left, right
									(keynum >= 35 && keynum <= 40) || (keynum >= 96 && keynum <= 105)))
				return true;
			var isSpecialSymbolPresent = allowedPattern.test(event.key);
			if(isSpecialSymbolPresent)
				$(document).trigger("invalidCharacterPressed",[$(this), event, event.key]);
			return !isSpecialSymbolPresent;
	});		
		
		$(this).bind('blur.ValidateTextBlur',function(event) {
			var text = $(this).val();
			//var alphanumericpattern = /^[^a-zA-Z0-9.]*|[^a-zA-Z0-9.]*$/g;
			alphanumericpattern = getAllowedPattern(pattern, firstCharChk, lastCharChk, 'Y');
			text = text.replace(alphanumericpattern, "");
			$(this).val(text);
		});
		//function to handle paste event
		$(this).bind('input.ValidateTextInput propertychange.ValidateTextPropertychange',function(event) {
			allowedPattern = new RegExp(pattern);
			var isSpecialSymbolPresent = allowedPattern.test($(this).val());
			var text = $(this).val();
			if( allowSeek === "true" && text.endsWith("%"))
				return true;
			var orgLength = text.length;
			//var alphanumericpattern = /^[^a-zA-Z0-9.]*/g;
			alphanumericpattern = getAllowedPattern(pattern, firstCharChk, lastCharChk, 'N');
			text = text.replace(alphanumericpattern, "");
			while(allowedPattern.test(text))
				text = text.replace(allowedPattern, "");
			var clocation = $(this).prop("selectionStart");
			if(text.trim().length === 0)
				$(this).val("");
			else
				$(this).val(text);
				
			var updatedLength = text.length;
			
			//If character is not accepted then keep cursor at it's original position.
			if(orgLength > updatedLength)
				clocation = clocation-1;
			var sAgent = window.navigator.userAgent;
			//Fails for IE hence added check
			if (this.setSelectionRange && (!(sAgent.indexOf("MSIE") > 0) && !(!!navigator.userAgent.match(/Trident.*rv\:11\./)))) {
		        this.setSelectionRange(clocation, clocation);
		    }
			event.preventDefault();
		});
	});
};
function getAllowedPattern(pattern, firstCharChk, lastCharChk, append)
{
    var allowedPattern = '';
    var defPattern = '[^a-zA-Z0-9.]';
    var allowedFirstCharPattern = pattern;
    var allowedLastCharPattern = pattern;
    if('Y' == firstCharChk)
        allowedFirstCharPattern = defPattern;
    if('Y' == lastCharChk)
        allowedLastCharPattern = defPattern;
    allowedPattern = allowedFirstCharPattern+'*';
    if('Y' == append)
        allowedPattern = allowedPattern+'|'+allowedLastCharPattern+'*$';
    return new RegExp('^'+allowedPattern,'g');
}
function setPatternValidator(isMetadataExists){
		var fieldJson = JSON.stringify(fieldInputConfig);
		fieldJson = JSON.parse(fieldJson);
		var RmWeight;
		if(typeof getMetaDataKey == 'function' && isMetadataExists)
			RmWeight = getMetaDataKey();
		else{
			RmWeight = intWeight;
		}
		if (fieldJson && typeof RmWeight != 'undefined') {
			var nodeForThisPage = fieldJson[RmWeight];
			if (nodeForThisPage && nodeForThisPage.length > 0) {
				for (var i = 0; i < nodeForThisPage.length; i++) {
					var arrFields = document
							.getElementsByName(nodeForThisPage[i].fieldName);
					if (arrFields && arrFields.length > 0) {
						for (var j = 0; j < arrFields.length; j++) {
							var fieldId = arrFields[j].getAttribute("id");
							$("#" + fieldId)
									.ValidateText(nodeForThisPage[i].pattern, nodeForThisPage[i].firstCharChk, nodeForThisPage[i].lastCharChk, nodeForThisPage[i].allowSeek);
						}
					}
				}
			}
		}
};
$(document).on('invalidCharacterPressed', function(event, field, e, key) {
	console.log(key);
});

//function to decode special characters
function getStringWithSpecialChars(str){		
		return str.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&apos;/g, "'")
               .replace(/&#39;/g, "'")
			   .replace(/&#039;/g, "'")
			   .replace(/&#034;/g,'"')
			   .replace(/&#34;/g,'"');
}

//function to encode special chars
function escapeSpecialChars(str) {
    return str.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}