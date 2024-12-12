function isFilterCodeExist(filterCode, filterSelect)
{
	if(!Ext.isEmpty(filterSelect))
	{
		var selectOption;
		for(var i = 0; i < filterSelect.length; i++)
		{
		    selectOption = filterSelect.options[i];
		    if(selectOption.value == filterCode)
		    {
		    	return true;
		    }
		}
		return false;
	}
	else
	{
		return true;
	}
}

function autoFocusOnFirstElement(event, divId, isOnLoad)
{
	if(isOnLoad)
	{
		if( typeof( event ) !== 'undefined' && event !== null )
		{
			event.preventDefault();
		}
		var elm;
		if('pageSettingPopUp'===divId)
			elm = $("#" + divId + " :input:enabled:visible:first");
		else
			elm = $("#"+divId).find('[tabindex=1]:visible:not([readonly])');
		if(undefined != elm && elm.length > 0 && undefined != elm[0])
		{
			if("DIV" === elm[0].localName || "div" === elm[0].localName || "A" === elm[0].localName || "a" === elm[0].localName)
			{
				elm[0].focus();
			}
			else
			{
				elm = $("#"+divId).find(':not(.ft-datepicker):[tabindex=1]:enabled:visible');
				if(undefined != elm && elm.length > 0 && undefined != elm[0])
					elm[0].focus();
			}
		}		
		return;
	}
	if( typeof( event ) !== 'undefined' && event !== null )
	{
		var keyPressed = event.charCode || event.keyCode || event.which || 0;
		if(!event.shiftKey && keyPressed == 9)
		{
			event.preventDefault();
			var elm;
			if('pageSettingPopUp'===divId)
				elm = $("#" + divId + " :input:enabled:visible:first");
			else
				elm = $("#"+divId).find('[tabindex=1]:visible:not([readonly])');
			if(undefined != elm && elm.length >0 && undefined != elm[0])
			{
				if("DIV" === elm[0].localName || "div" === elm[0].localName || "A" === elm[0].localName || "a" === elm[0].localName)
				{
					elm[0].focus();
				}
				else
				{
					elm = $("#"+divId).find(':not(.ft-datepicker):[tabindex=1]:enabled:visible');
					if(undefined != elm && elm.length > 0 && undefined != elm[0])
						elm[0].focus();
				}
			}
		}
	}
}

function autoFocusOnFirstElementCustom(event, divId, isOnLoad, ignoreChkBox, ignoreRadio)
{
	var elm;
	if( isOnLoad )
	{
		if( typeof( event ) !== 'undefined' && event !== null )
		{
			event.preventDefault();
		}
		elm = $("#"+divId).find('[tabindex=1]:visible:not([readonly])');
		
		if(undefined != elm && elm.length > 0 && undefined != elm[0])
		{
			if("DIV" === elm[0].localName || "div" === elm[0].localName)
			{
				elm[0].focus();
			}
			else
			{
				
				if( ignoreChkBox && ignoreRadio )
				{
					elm = $("#"+divId).find(':not(:checkbox):not(:radio):[tabindex=1]:enabled:visible');
				}
				else if( ignoreChkBox )
				{
					elm = $("#"+divId).find(':not(:checkbox):[tabindex=1]:enabled:visible');
				}
				else if( ignoreRadio )
				{
					elm = $("#"+divId).find(':not(:radio):[tabindex=1]:enabled:visible');
				}
				else
				{
					elm = $("#"+divId).find('[tabindex=1]:enabled:visible');
				}
				if(undefined != elm && elm.length > 0 && undefined != elm[0])
					elm[0].focus();
			}
		}		
		return;
	}
	if( typeof( event ) !== 'undefined' && event !== null )
	{
		var keyPressed = event.charCode || event.keyCode || event.which || 0;
		if(!event.shiftKey && keyPressed == 9)
		{
			event.preventDefault();
			elm = $("#"+divId).find('[tabindex=1]:visible:not([readonly])');
			if(undefined != elm && elm.length > 0 && undefined != elm[0])
			{
				if("DIV" === elm[0].localName || "div" === elm[0].localName)
				{
					elm[0].focus();
				}
				else
				{
					elm = $("#"+divId).find('[tabindex=1]:enabled:visible');
					
					if( ignoreChkBox && ignoreRadio )
					{
						elm = $("#"+divId).find(':not(:checkbox):not(:radio):[tabindex=1]:enabled:visible');
					}
					else if( ignoreChkBox )
					{
						elm = $("#"+divId).find(':not(:checkbox):[tabindex=1]:enabled:visible');
					}
					else if( ignoreRadio )
					{
						elm = $("#"+divId).find(':not(:radio):[tabindex=1]:enabled:visible');
					}
					if(undefined != elm && elm.length > 0 && undefined != elm[0])
						elm[0].focus();
				}
			}
		}
	}
}

$(".jq-nice-select").change(function(){
	var id = $(this).attr('id');
	$('#'+id+'-niceSelect span').attr('title', $('#'+id+'-niceSelect span').html());
});

$(".jq-nice-select").each(function(){
	var id = $(this).attr('id');
	$('#'+id+'-niceSelect span').attr('title', $('#'+id+'-niceSelect span').html());
});

function comboBoxTooltip()
{
	$(".x-boundlist .x-boundlist-list-ct ul li").each(function(){
		var title = $(this).html();
		title = title.replace('<span class="x-combo-checker">&nbsp;</span>','')
		$(this).attr('title',title);
	});	
}

function onAnchorKeydown()
{
	$("a").on('keydown', function(e) {
		var keyPressed = e.charCode || e.keyCode || e.which || 0;
		switch(keyPressed) {
			case 32:
			case 13:
				{
				   if(!$(this).hasClass("t7-action-link-with-noline"))
				   {
					   $(this)[0].click();
				   }
					break;	
				}
		  }		
	});
}

function restrictTabKey(event)
{
	if( typeof( event ) !== 'undefined' && event !== null )
	{
		var keyPressed = event.charCode || event.keyCode || event.which || 0;
		if(keyPressed === 9)
		{
			 event.preventDefault();
			 event.stopPropagation();
		}
	}
}

function markRequired(inputField) {
	var isValid = true;
	var _jqValue = "";
	var _nsValue = "";
	inputField = $(inputField);
	if (inputField) {
		if (inputField.length > 0 && inputField.hasClass('hasDatepicker')
				&& inputField.datepicker("widget").is(":visible") == true) {
			// commenting below return statement, so that it will apply css to datepicker as well
			// Later, this if condition code shoud be removed
			// return;
		}
		if(undefined != inputField[0] && (inputField[0].id+'').indexOf("_jq")>-1){
			_jqValue = $("#"+inputField[0].id.replace("_jq","")).val();
		}else if(undefined != inputField[0] && (inputField[0].localName == 'div' || inputField[0].localName == 'DIV'))
		{
			_nsValue = $("#"+inputField[0].id.replace('-niceSelect','')).val();
		}else if(undefined != inputField[0] && (inputField[0].localName == 'button' || inputField[0].localName == 'BUTTON'))
		{
			_nsValue = $(inputField[0]).parent().find("select").getMultiSelectValue().join(",");
		} 
		if ($.trim(inputField.val()) == '' && (_jqValue == null || $.trim(_jqValue) == ''  )
			&& (_nsValue == null || $.trim(_nsValue) == '')) {
			isValid = false;
			inputField.addClass('requiredField');
			if(inputField[0].type == 'select-one')
			{
				if($("#"+inputField[0].id+"-niceSelect"))
				$("#"+inputField[0].id+"-niceSelect").addClass('requiredField');
			}
			else if(inputField[0].type == 'checkbox')
					isValid = true;
		} else {
			inputField.removeClass('requiredField');
			if(inputField[0].type == 'select-one')
			{
				if($("#"+inputField[0].id+"-niceSelect"))
				$("#"+inputField[0].id+"-niceSelect").removeClass('requiredField');
			}
		}
	}
	return isValid;
}

function removeMarkRequired( inputField )
{
	$( inputField ).removeClass( "requiredField" );
}

function markAdvFilterNameMandatory(checkboxId, labelId, textboxId, isClear)
{
	$("#"+textboxId).attr('maxlength','20');
	if($("#"+checkboxId).is(":checked"))
	{
		$("#"+labelId).addClass("required");
		$("#"+textboxId).blur(function()
		{
			markRequired($("#"+textboxId));
		});
		$("#"+textboxId).focus(function()
		{
			removeMarkRequired($("#"+textboxId));
		});
	}
	else
	{
		$("#"+labelId).removeClass("required");
		$("#"+textboxId).removeClass("requiredField");
		$("#"+textboxId).unbind( "blur" );
		$("#"+textboxId).unbind( "focus" );
		if(isClear)
		{
			$("#"+textboxId).val( "" );
		}
	}
}

function blockUI(){
	$.blockUI({
		overlayCSS : {
			opacity : 0.5
		},
		baseZ : 2000,
		message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
		css:{ }});
}

function unblockUI(){
	$.unblockUI();
}

$(document).ready(function(){
	onAnchorKeydown();
	comboBoxTooltip();
});

function hideErrorPanel(errorDivId)
{
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function paintError(errorDiv,errorMsgDiv,errorMsg){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}

function paintErrors(errorDiv,errorMsgDiv,arrError) {
	doHandlePaintErrors(errorDiv,errorMsgDiv,arrError);
}

function doHandlePaintErrors(errorDiv,errorMsgDiv,arrError) {
	var element = null, strMsg = null, strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + errorMsgDiv).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode
							+ ')' : '';
						element = $('<p>').text(strMsg);
						element.appendTo($('#' + errorMsgDiv));
						$('#' + errorDiv).removeClass('ui-helper-hidden');
				});
	}
}

function makeNiceSelect(selectId, mandatory)
{
	$('#'+selectId).niceSelect();
	$('#'+selectId).niceSelect('update');
	if(!$('#'+selectId+'-niceSelect').hasClass('disabled'))
	{
		$('#'+selectId+'-niceSelect ').attr('tabindex', 1);
	}
	if(mandatory)
	{
		bindMarkRemoveRequired(selectId+'-niceSelect');
	}
}
function bindMarkRemoveRequired(selectId)
{
	$('#'+selectId).bind('blur', function () { markRequired(this);});
	$('#'+selectId).bind('focus', function () { removeMarkRequired(this);});
}
function unbindMarkRemoveRequired(selectId)
{
	$('#'+selectId).unbind('blur');
	$('#'+selectId).bind('focus');
}
function decodeFinComponent(encodedStr)
{
    var parser = new DOMParser;
    var dom = parser.parseFromString(encodedStr, 'text/html');
    var decodedString = dom.body == null ? "" : dom.body.textContent;
    return decodedString;
}
function decodeSpecialChar(encodedString) {
	var textArea = document.createElement('textarea');
	textArea.innerHTML = encodedString;
	return textArea.value;
}

function removeWhiteSpaces(element){
	$(element).val($(element).val().replace(/^\s+|\s+$/gm,''));
}

function enableDisableSortIcon(me, gridModel, isReconfCall)
{
	// If sorting is given from advance filter then do not allow sorting on grid.
	// And not even show sorting icon to any column in this case.
	// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
	var objectGroupView = me.getGroupView();
	var tempColumnModel = objectGroupView.cfgGridModel.columnModel ? objectGroupView.cfgGridModel.columnModel : objectGroupView.cfgPrefferedColumnModel;
	tempColumnModel = tempColumnModel ? tempColumnModel : objectGroupView.cfgGridModel.defaultColumnModel;
	var sortFlag = true;
	
	if(tempColumnModel)
	{
		if(me.advSortByData && me.advSortByData.length > 0)
		{
			sortFlag = false;
		}
		for( var i = 0 ; i < tempColumnModel.length ; i++)
		{
			if((tempColumnModel[i].colId !== "actionStatus") && (tempColumnModel[i].colId !== "defaultAccount"))
			{
				tempColumnModel[i].sortable = sortFlag;
			}			
		}
		if(Ext.isEmpty(gridModel))
		{
			gridModel =
			{
				columnModel : tempColumnModel
			};
		}
		else
		{
			gridModel.columnModel = tempColumnModel;
		}
		if(isReconfCall)
		{
			objectGroupView.reconfigureGrid(gridModel);
		}
	}
}

jQuery.fn.ForceNoSpecialSymbolWithSpaceFlt = function() {
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
							if(((key >= 48 && key <= 57) || key==190)  && e.shiftKey || event.ctrlKey)
								return false;
								
							// allow backspace, tab, delete, space, numbers 
							// keypad numbers, letters ONLY
							return (key == 8 || key == 9 || key == 46 || key == 32 
										|| (key >= 37 && key <= 40)
										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
							})
							
			})
};

window.getNextUniqueId = function() {
	  var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}
