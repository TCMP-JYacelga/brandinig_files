/* IRISADM-125,IRISADM-158: Managing special characters. Managing new line in process descritions. */
function toEscape(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.replace(/(\r\n|\n|\r)/mg, " ");
	}
}
function filterSplChar(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.replace(/([^0-9A-Za-z])/g, "");
	}
}
function filterSplCharFilterParam(ctrl) {
	if (ctrl) {
		ctrl.value = ctrl.value.replace(/([^0-9A-Za-z_])/g, "");
	}
}
function showActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).show();
	return false;
}

function hideActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).hide();
	return false;
}

function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function messagePopup() 
{
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
}

jQuery.fn.ForceIntegerOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e)
						{
							// allows numbers,backspace, tab
							var keycode = e.which || e.keyCode;							
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9)
								return true;
							return false;
						})
			})
};
jQuery.fn.ForceTimeOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e)
						{
							// allows numbers,backspace, tab, ':'
							var keycode = e.which || e.keyCode;							
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9 || keycode == 58)
								return true;
							return false;
						})
			})
};
jQuery.fn.forceTwoFiftyFiveCharsOnly = function() {
	return this
	.each(function() {
		$(this)
				.keypress(function(e) {
					var keyCode = $(this).val();
					var length = keyCode.length;
					if(length >= 255)
					{	
						return false;
					}
					else
					{
						return true;
					}
				})
	})	
};
/*<IRISADM-125>: <Managing Special characters.>*/
jQuery.fn.ForceNoSpecialSymbol = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = 0;
							if (window.event) { // IE
								key = e.keyCode;
							}
							if (e.which) { // Netscape/Firefox/Opera
								key = e.which;
							}
							if(((key >= 48 && key <= 57) || key==190)  && e.shiftKey)
								return false;
								
							// allow backspace, tab, delete, numbers 
							// keypad numbers, letters ONLY
							return (key == 8 || key == 9 || key == 46 
										|| (key >= 37 && key <= 40)
										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
							})
							
			})
};
jQuery.fn.ForceNumericOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e)
						{
							// allows numbers, backspace,'.' once ,tab
							var keycode = e.which || e.keyCode;
							var value=$(this).val();
							var i=0;
							for(i=0;i<value.length;i++)
							{
							  if(value.charAt(i)=='.' && keycode == 46)
							  {
							    return false;
							  }
							}
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9 || keycode == 46)
								return true;
							return false;
						})
			})
};
jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};
/*IRISADM-221 : Code analysis for better Performance :Covered Point 6 : Apply Validation on Server Side.*/
function isDecimalKey(event,ctrl) 
{
 // allows numbers, backspace,'.' once ,tab
	var keycode = event.which || event.keyCode;
	var value = $(ctrl).val();
	var i=0;
	for(i=0; i<value.length; i++)
	{
	  if(value.charAt(i)=='.' && keycode == 46)
	   {
	     return false;
	   }
	}
	if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9 || keycode == 46)
		return true;
	return false;
}
function isNumberKey(event,ctrl) 
{
	// allows numbers,backspace, tab
	var keycode = event.which || event.keyCode;							
	if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9)
		return true;
	return false;
}
function restrictLength255(ctrl) 
{	
   var keyCode = ctrl.value;
   var length = keyCode.length;
   if(length >= 255)
		return false;
    else
		return true;
}

function restrictLength4000(ctrl) 
{	
   var keyCode = ctrl.value;
   var length = keyCode.length;
   if(length >= 4000)
		return false;
    else
		return true;
}

function getFormatType(fileFormat)
{
	var fileFormatValue;
	var formatType;
	var splittedValues;

	if(null == fileFormat ||   '' == fileFormat)
	{
		fileFormat = document.getElementById('formatType');	
		if(fileFormat != null || fileFormat != undefined)
		{
			fileFormatValue = fileFormat.value;
		}
	}
	else
	{
		fileFormatValue = fileFormat;
	}
	
	if( null != fileFormatValue)
	{
		splittedValues = fileFormatValue.split('|');
		if( splittedValues != null && splittedValues.length >= 1)
		{
			formatType = splittedValues[0];
		}//if
	}//if
	return formatType;
}//getFormatType


function openConnectionpopup()
{
	$('#divDBConnection').dialog( {
		autoOpen : false,
		height : 400,
		width : 640,
		modal : true,
		buttons : {
			"Test Connection" : function() {
				//saveDataSource();
				//$(this).dialog('close');
				testDBConnection();
			},
			"Save" : function() {
				saveDataSource();
				$(this).dialog('close');				
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#divDBConnection').dialog('open');
}

function saveDataSource()
{
	var frm = document.getElementById('frmMain');
	if(interfaceType == 'D'){
		frm.action = "saveDownloadDBConnection.srvc";
	}
	else{
		frm.action = "saveDBConnection.srvc";
	}
	
	frm.target = "";
	frm.method = "POST";
	$('#productCode').removeAttr("disabled");
	$('#productTypes').removeAttr("disabled");
	$('#taxAgencyCode').removeAttr("disabled");
	$('#datastoreType').removeAttr("disabled");
	$('#frmMain').append($('#divDBConnection'));
	frm.submit();	
}

function testDBConnection()
{
	var data = {};
	data[csrfTokenName] = csrfTokenValue;
	data['driverClass'] = $('#driverClass').val();
	data['connectionUrl'] = $('#connectionUrl').val();
	data['classPath'] = $('#classPath').val();
	data['testSQL'] = $('#testSql').val();
	data['userName'] = $('#userName').val();
	data['userPassword'] = $('#userPassword').val();
	
	$.ajax(
		{
			type : 'POST',
			url : 'testDBConnection.srvc',
			data : data,
			dataType : 'json',
			success : function( data )
			{
				$.unblockUI();
				var $response = data;
				var successFlag = $response.success;
				
				if(successFlag == 'Y'){
					alert('Connection Successful');
				}
				else{
					alert('Connection Failed');
				}
			},
			error : function( request, status, error )
			{
				$.unblockUI();
				
			}
		} );
	
}