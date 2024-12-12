/**
* Language Change JS 
*
*/
 
const langChange = new LanguageChange();
function LanguageChange() 
{
	this.changeUsrLang = changeUsrLang;
	
	function changeUsrLang(local)
	{
		if(local)
		{
			let localArray = local.split('_');
			$.ajax({
				type : 'POST',
				data :  {
					"$langCode" : localArray[0],
					"$countryCode" : localArray[1]
				},
				url : 'updateUserLang.lang',
				success : function(data) {
					if(data === 'SUCCESS') {
						$.cookie('usr-lang', local);
						window.location.reload();
					}	
				},
				error : function() {
					//error
				}
			});	
		}	
	}
}