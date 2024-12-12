$(document).ready(function(){
	if (window._dtLastLoginDate !== undefined)  
	{
		commonDateFormatting();
		commonStringFormatting();
		initSideMenu();
		$( ".sortable" ).sortable({revert: true, handle: ".widget-card-header"});
	}
});

var initSideMenu = function(){
	/*
	*  Initiate side menu components
	*  File: sidenav.js
	*/
	$('#side-menu').fcmNav({'data' : _strMenuData});
}
var commonDateFormatting =  function(){
	$('.urs-last-login-date').text(_dtLastLoginDate.datetime);
	setInterval(function(){
		var h = _dtCurrentDate.hour;
		var m = _dtCurrentDate.minute;
		var s = _dtCurrentDate.second++;
		if(s==60)
		{
			_dtCurrentDate.minute++;
			_dtCurrentDate.second = 0;
		}
		if(m==60)
		{
			_dtCurrentDate.hour++;
			_dtCurrentDate.minute = 0;
		}
		if(h<10) h = "0"+h;
		if(m<10) m = "0"+m;
		if(s<10) s = "0"+s;
		

		$('.urs-current-date').text(_dtCurrentDate.date+' '+h+':'+m+':'+s+' '+_dtCurrentDate.displayTimezone); 
	 }, 1000);
}
var commonStringFormatting =  function(){
	/*1. Add title for all element which has .text-truncate class
	* eg: <div class="text-truncate">Long Text</div>
	*/
	$('.text-truncate').each(function(){
		$(this).attr('title',$(this).text());
	});
}

var dateFormat =  function(date, separator)
{
	if(!separator)
	{
		separator = '';
	}
	let _strDate = $.datepicker.formatDate(_strDefaultDateFormat.replace('yyyy','yy').replace('MM','mm').replace('MMM','M').replace('MMMM','MM'), date);
    let _strHours = date.getHours();
    let _strMinutes = date.getMinutes();
    let _strSeconds = date.getSeconds();	
	
	_strHours   = _strHours < 9 ? '0'+_strHours : _strHours;
	_strMinutes = _strMinutes < 9 ? '0'+_strMinutes : _strMinutes;
	_strSeconds = _strSeconds < 9 ? '0'+_strSeconds : _strSeconds;
	
   _strDate += ' '+separator+' '+_strHours+':'+_strMinutes+':'+_strSeconds+' '+separator+' '+_dtCurrentDate.displayTimezone;
   return _strDate;
}

const languageChange = new LanguageChange();
function LanguageChange()
{
	this.changeUsrLang = changeUsrLang;
	this.setLanguageDropdwonLabel = setLanguageDropdwonLabel;
	
	function changeUsrLang(local,alignment)
	{
		if(local)
		{
			let localArray = local.split('_');
			$.ajax({
				type : 'POST',
				async : false,
				data :  {
						"$langCode" : localArray[0],
						"$countryCode" : localArray[1],
						"$align" : alignment
					},
				url : 'updateUserLang.lang',
				success : function(result) {
					if(result === 'SUCCESS') 
					{
						$.cookie('usr-lang', local);
						window.location.reload();
					}	
				},
				error : function() {
					//result = "error";
				}
			});	
		}	
	}
	
	function setLanguageDropdwonLabel()
	{
		let selectedLangCode = $("#selectedLanguage").attr("lang");
		
		let selectedLangDescription =   $('a[lang='+selectedLangCode+']').html();
		
		$("#selectedLanguage").html(selectedLangDescription);
	}
	
}





