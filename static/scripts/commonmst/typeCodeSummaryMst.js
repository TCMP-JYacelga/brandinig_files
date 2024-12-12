function gotoPage(strUrl)
{
	var frm = document.forms["frmMain"];
	$('input').removeAttr('disabled');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function viewChanges(strUrl,viewMode)
{
	var frm = document.forms["frmMain"];
	$('input').removeAttr('disabled');
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', viewMode));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function createFormField(element, type, name, value) 
{
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function hideShowFormulaSection()
{
	if($('#typeCodeCategory').val()=='Extended' || $('#typeCodeTxnLevel').val()=='Detail')
	{
		$('#formulaSection').hide();	
	}
	else
	{
		$('#formulaSection').show();
	}
	
	if($('#typeCodeTxnLevel').val()=='Detail')
	{
		$('#chkViewImageFlag').attr('src','static/images/icons/icon_unchecked.gif');
		$('#chkIncludeWidgetFlag').attr('src','static/images/icons/icon_unchecked.gif');
		$('#chkViewImageFlag').attr('onclick','toggleCheckUncheck(this,"viewImageFlag")');
		$('#chkIncludeWidgetFlag').attr('onclick','enableDisableFields(this);toggleCheckUncheck(this,"includeWidgetFlag");');		
	}	
	else
	{
		$('#chkViewImageFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkIncludeWidgetFlag').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkViewImageFlag').removeAttr('onclick');
		$('#viewImageFlag').val('N');
		$('#chkIncludeWidgetFlag').removeAttr('onclick');
		$('#includeWidgetFlag').val('N');
		$('#widgetSection').attr('disabled','disabled');
		$('#widgetSection').addClass('disabled');
		$('#widgetSection').val('');		
	}
	
	if($('#typeCodeTxnLevel').val()=='Status')
	{
		$('#summaryComputationType').val('S');
		$('#summaryComputationType').attr('disabled','disabled');
		$('#summaryComputationType').addClass('disabled');
	}

	if($('#typeCodeTxnLevel').val()=='Summary')
	{
		$('#summaryComputationType').val('');
		$('#summaryComputationType').removeAttr('disabled');
		$('#summaryComputationType').removeClass('disabled');
	}
	if($('#typeCodeTxnLevel').val()=='Detail' || $('#typeCodeTxnLevel').val()=='' || null==$('#typeCodeTxnLevel').val())
	{
		$('#summaryComputationType').val('');
		$('#summaryComputationType').attr('disabled','disabled');
		$('#summaryComputationType').addClass('disabled');
	}		
}

function enableDisableFields(imgElement)
{
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		$('#widgetSection').removeAttr('disabled');
		$('#widgetSection').removeClass('disabled');
	}
	else
	{
		$('#widgetSection').attr('disabled','disabled');
		$('#widgetSection').addClass('disabled');
		$('#widgetSection').val('');
	}	
}

function toggleCheckUncheck(imgElement,flag) 
{
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";	
		$('#'+flag).val('Y');
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('N');
	}
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;

	//Previous day
	selectTypeCodeLists("selectedPositiveList");
	selectTypeCodeLists("selectedNegativeList");
	selectTypeCodeListsDesc("selectedPositiveList","addTypeCodesDescList");
	selectTypeCodeListsDesc("selectedNegativeList","subTypeCodesDescList");
	
	//Intraday
	selectTypeCodeLists("selectedIntraPositiveList");
	selectTypeCodeLists("selectedIntraNegativeList");
	selectTypeCodeListsDesc("selectedIntraPositiveList","addIntraTypeCodesDescList");
	selectTypeCodeListsDesc("selectedIntraNegativeList","subIntraTypeCodesDescList");	
	$("#typeCodeCategory").removeAttr('disabled');
	$("#typeCodeTxnLevel").removeAttr('disabled');
	$("#typeCodeTxnType").removeAttr('disabled');
	$("#mappingTypeCode").removeAttr('disabled');
	$("#summaryComputationType").removeAttr('disabled');
	$("#typeCode").removeAttr('disabled');	
	$("#formula").removeAttr('readonly');
	$("#intradayFormula").removeAttr('readonly');
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function setDirtyBit()
{
	dityBitSet=true;
}

jQuery.fn.ForceAlphaNumericOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9)
								return true;

							return false;
						})
			})
};


jQuery.fn.stdTypeCodeSeekAutoComplete= function() {
var objTpCode = null;
var objTpDesc = null;
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/standardTypeCodesList.json",
									type: "POST",
									dataType : "json",
									data : {
										$filter : request.term,
										$top:-1
									},
									success : function(data) {
										if(data.length!=0)
										{
											var rec = data.d.profile;
											response($.map(rec, function(item) {
													return {														
														label : item.typeCode+ ": "+item.typeCodeDescription,
														typeCodeDtl : item
													}
												}));
										}
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.typeCodeDtl;
						if (data) {
							if (!isEmpty(data.typeCode))
							{
								objTpCode = data.typeCode;	
								objTpDesc  = data.typeCodeDescription;								
								
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$('#mappingTypeCode').val(objTpCode);
						$('#mappingTypeCodeDesc').text(objTpDesc);		
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

var strAddedCodesList = [],strSubtractedCodesList = [];
var strAddedCodesListForIntra = [],strSubtractedCodesListForIntra = [];
function PopulateSelectedTypeCode(fromList, toList)
{
	var i, cntr ;
	var isNew = true;
	if (document.getElementById(fromList).selectedIndex !=-1)
	{
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<=AddLength-1; i++)
		{			
			if (document.getElementById(fromList).options[i].selected)
			{
				selectedItem = document.getElementById(fromList).selectedItem;				     
				selectedText = document.getElementById(fromList).options[i].text;		
				selectedValue = document.getElementById(fromList).options[i].value;
				var strSourceType = '';
				var strSrcValue =$('input[name=sourceFrom]:checked').val(); 
				if('P'==strSrcValue)
				{
					strSourceType = ' (Previous)';
				}
				else if('H'==strSrcValue)
				{
					strSourceType = ' (History)';
				}
				else if('I'==strSrcValue)
				{
					strSourceType = ' (Intraday)';
				}
				else if('T'==strSrcValue)
				{
					strSourceType = ' (Transaction)';
				}				
				newoption = new Option(selectedText+strSourceType, selectedValue, false, false);
				document.getElementById(toList).options[RemLength] = newoption;					
				RemLength = document.getElementById(toList).length;
				if(toList=='selectedPositiveList')
				{
					strAddedCodesList.push(selectedValue);
				}
				else if(toList=='selectedNegativeList')
				{
					strSubtractedCodesList.push(selectedValue);
				}
				else if(toList=='selectedIntraPositiveList')
				{
					strAddedCodesListForIntra.push(selectedValue);
				}
				else if(toList=='selectedIntraNegativeList')
				{
					strSubtractedCodesListForIntra.push(selectedValue);
				}				
			}
		}
		i=0;
		cntr=0;

		while(i<AddLength)
		{	
			if (document.getElementById(fromList).options[cntr].selected)
			{					
				document.getElementById(fromList).options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 
		document.getElementById(fromList).selectedIndex=-1;
	}
	designFormula();
	designIntradayFormula();
}

var strRemovedAddCodesList = [],strRemovedSubCodesList = [];
var strRemovedAddCodesListForIntra = [],strRemovedSubCodesListForIntra = [];
function RemoveSelectedTypeCode(fromList, toList)   
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById(toList).selectedIndex !=-1)
	{
		var RemLength = document.getElementById(toList).length;	
		var AddLength = document.getElementById(fromList).length;		
		var selectedItem; 		
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<RemLength; i++)
		{			
			if (document.getElementById(toList).options[i].selected)
			{	
				selectedItem = document.getElementById(toList).selectedItem;				     
				selectedText = document.getElementById(toList).options[i].text;		
				selectedValue = document.getElementById(toList).options[i].value;

				var strSourceType = '';
				var strSrcValue =$('input[name=sourceFrom]:checked').val();
				
				newoption = new Option(selectedText, selectedValue, false, false);
				//document.getElementById(fromList).options[AddLength] = newoption;
				if(null != strSrcValue)
					populateTypeCodeByType(strSrcValue);
				
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById(fromList).options[AddLength] = newoption;				
				AddLength = document.getElementById(fromList).length;
				if(toList=='selectedPositiveList')
				{
					strRemovedAddCodesList.push(selectedValue);
				}
				else if(toList=='selectedNegativeList')
				{
					strRemovedSubCodesList.push(selectedValue);
				}
				else if(toList=='selectedIntraPositiveList')
				{
					strRemovedAddCodesListForIntra.push(selectedValue);
				}
				else if(toList=='selectedIntraNegativeList')
				{
					strRemovedSubCodesListForIntra.push(selectedValue);
				}					
			}
		}
		i=0;
		cntr=0;

		while(i<RemLength)
		{	
			if (document.getElementById(toList).options[cntr].selected)
			{					
				document.getElementById(toList).options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 
		document.getElementById(toList).selectedIndex=-1;
	}
	designFormula();
	designIntradayFormula();
}

function selectTypeCodeLists(listName)
{
	 var obj = document.getElementById(listName);
	    for (var i=0;i<obj.options.length; i++)
		{
		  obj.options[i].value=obj.options[i].value;
	      obj.options[i].selected = true;
		}
		return true;
}

function selectTypeCodeListsDesc(listName,destinationListName)
{
	 var obj = document.getElementById(listName);
	
	    for (var i=0;i<obj.options.length; i++)
		{
		  obj.options[i].value=obj.options[i].text;
	      obj.options[i].selected = true;
		}
	    obj;
		$('#'+destinationListName).val($(obj).val());
		return true;
}

function setCheckUnchek(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked.gif');		
	}	
}

function setCheckUnchekGrey(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked_grey.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');		
	}	
}

function designFormula()
{
	var strAddCodesList = [], strSubCodesList=[];
	var strFormula='';
	if( $('#selectedPositiveList').has('option').length > 0 )
	{
		$('#selectedPositiveList').each(function(){ 
			if(null!=$(this).val())
			{
				strAddCodesList.push($(this).val());
			}
		});
	}
	if( $('#selectedNegativeList').has('option').length > 0 )
	{
		$('#selectedNegativeList').each(function(){ 
			if(null!=$(this).val())
			{
				strSubCodesList.push($(this).val());
			}	
		});	
	}
	
	if(strAddedCodesList.length >0)
	{
		for(l=0;l<strAddedCodesList.length;l++)
		{
			strAddCodesList.push(strAddedCodesList[l]);
		}	
	}
	if(strRemovedAddCodesList.length>0)
	{
		for(p=0;p<strRemovedAddCodesList.length;p++)
		{
			strAddCodesList.splice(strAddCodesList.indexOf(strRemovedAddCodesList[p]),1);
		}
	}
	
	if(strAddCodesList.length>0)
	{
		for(j=0;j<strAddCodesList.length;j++)
		{
			if(''==strFormula)
			{
				strFormula=strAddCodesList[j];	
			}
			else
			{
				strFormula=strFormula+strAddCodesList[j];
			}
			if(j!=strAddCodesList.length-1)
			{
				strFormula=strFormula+'+';
			}	
		}	
	}
	
	if(strSubtractedCodesList.length >0)
	{
		for(m=0;m<strSubtractedCodesList.length;m++)
		{
			strSubCodesList.push(strSubtractedCodesList[m]);
		}	
	}	
	
	if(strRemovedSubCodesList.length>0)
	{
		for(q=0;q<strRemovedSubCodesList.length;q++)
		{
			strSubCodesList.splice(strSubCodesList.indexOf(strRemovedSubCodesList[q]),1);
		}
	}	
	
	if(strSubCodesList.length >0)
	{
		for(k=0;k<strSubCodesList.length;k++)
		{
			strFormula=strFormula+'-'+strSubCodesList[k];
	
		}	
	}		
	$('#formula').val($('#typeCode').val()+'='+strFormula);
	strFormula = '';
}

function designIntradayFormula()
{
	var strAddCodesList = [], strSubCodesList=[];
	var strFormula='';
	if( $('#selectedIntraPositiveList').has('option').length > 0 )
	{
		$('#selectedIntraPositiveList').each(function(){ 
			if(null!=$(this).val())
			{
				strAddCodesList.push($(this).val());
			}
		});
	}
	if( $('#selectedIntraNegativeList').has('option').length > 0 )
	{
		$('#selectedIntraNegativeList').each(function(){ 
			if(null!=$(this).val())
			{
				strSubCodesList.push($(this).val());
			}	
		});	
	}
	
	if(strAddedCodesListForIntra.length >0)
	{
		for(l=0;l<strAddedCodesListForIntra.length;l++)
		{
			strAddCodesList.push(strAddedCodesListForIntra[l]);
		}	
	}
	if(strRemovedAddCodesListForIntra.length>0)
	{
		for(p=0;p<strRemovedAddCodesListForIntra.length;p++)
		{
			strAddCodesList.splice(strAddCodesList.indexOf(strRemovedAddCodesListForIntra[p]),1);
		}
	}
	
	if(strAddCodesList.length>0)
	{
		for(j=0;j<strAddCodesList.length;j++)
		{
			if(''==strFormula)
			{
				strFormula=strAddCodesList[j];	
			}
			else
			{
				strFormula=strFormula+strAddCodesList[j];
			}
			if(j!=strAddCodesList.length-1)
			{
				strFormula=strFormula+'+';
			}	
		}	
	}
	
	if(strSubtractedCodesListForIntra.length >0)
	{
		for(m=0;m<strSubtractedCodesListForIntra.length;m++)
		{
			strSubCodesList.push(strSubtractedCodesListForIntra[m]);
		}	
	}	
	
	if(strRemovedSubCodesListForIntra.length>0)
	{
		for(q=0;q<strRemovedSubCodesListForIntra.length;q++)
		{
			strSubCodesList.splice(strSubCodesList.indexOf(strRemovedSubCodesListForIntra[q]),1);
		}
	}	
	
	if(strSubCodesList.length >0)
	{
		for(k=0;k<strSubCodesList.length;k++)
		{
			strFormula=strFormula+'-'+strSubCodesList[k];
	
		}	
	}		
	$('#intradayFormula').val($('#typeCode').val()+'='+strFormula);
	strFormula = '';
}

function selectTab(tabId)
{ 
	if('addPrevTab'==tabId)
	{
		 $('#addPrevTab').addClass("on");
		 $('#balanceType').val('H');
		 $('#rbPrevDaySection').show();
		 $('#rbIntraDaySection').hide();
		 $('#rbPrevDaySection').show();
		 $('#formula').show();
		 $('#divPrevSelectedList').show();
		 $('#intradayFormula').hide();
		 $('#divPrevArrows').show();
		 $('#divIntraArrows').hide();		 
		 $('#divIntraSelectedList').hide();
		 
		 var radio = $('input:radio[name=sourceFrom]');
		 radio.filter('[value=P]').prop('checked', true);
		 populateTypeCodeByType('P');
		 
	}else
	{
		 $('#addPrevTab').removeClass("on");
	}
	if('subPrevTab'==tabId)
	{
		$('#subPrevTab').addClass("on");
		$('#balanceType').val('C');
		$('#rbPrevDaySection').hide();
		$('#rbIntraDaySection').show();
		$('#rbIntraDaySection').addClass('inline');		 		
		$('#rbIntraDaySection').removeAttr('style');
		$('#formula').hide();
		$('#divPrevSelectedList').hide();
		$('#divPrevArrows').hide();
		$('#divIntraArrows').show();	
		$('#intradayFormula').show();
		$('#divIntraSelectedList').show();
		
		var radio = $('input:radio[name=sourceFrom]');
		radio.filter('[value=P]').prop('checked', true);
		populateTypeCodeByType('P');
	}
	else
	{
		$('#subPrevTab').removeClass("on");
	}
}