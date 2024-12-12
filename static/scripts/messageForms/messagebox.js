selectedCheckBox = new Array();
var first = true;

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/manageAlertsClientList.json?seller="+$('#sellerCode').val()+"&client="+$('#clientDesc').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data;
										response($.map(rec, function(item) {
													return {														
														label : item.CLIENTDESC,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.CLIENTID))
							{
								$('#clientId').val(data.CLIENTID);
								$('#clientDesc').val(data.CLIENTDESC);
								getModulesList();
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
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

function getModulesList()
{
	var strModuleArr=new Array('01','02','03','13');
	$.ajax({
		url : "services/getModulesList.json?client="+$('#clientId').val(),
		type: "POST",
		dataType : "json",
		success : function(data)
		{
			for (var i=0;i<strModuleArr.length;i++)
			{
					if(null!=data[strModuleArr[i]])
					{
						$('#module_'+strModuleArr[i]).show();
						$('#lbl_module_'+strModuleArr[i]).show();
						$('#lbl_module_'+strModuleArr[i]).text(data[strModuleArr[i]]);
					}
			}
		}
	});	
}

function refresh()
{
    var frm = document.getElementById("frmMain");	
	document.getElementById("selectedRecordIndex").value = 1;	    
	frm.action = "messageboxcenter.form";	
	frm.target ="";
	frm.method = "POST";    
    frm.submit();	
}

function goToPage(strUrl, frmId) {
	var frm = document.createElement( 'FORM' );
	frm.name = 'txnFrmMain';
	frm.id = 'txnFrmMain';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	document.body.appendChild( frm );
	frm.submit();
	document.body.removeChild( frm );
}

function getMsgPopup() {
	$('#confirmMsgPopup').dialog({
		autoOpen : true,
		height : 200,
		width : 350,
		modal : true,
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	});
	$('#confirmMsgPopup').dialog('open');
}
var notRendered = true;
function doChooseFormMessage(sellerObj,clientDescObj,clientIdObj)
{
	document.getElementById( "messageInboxChooseForm" ).style.visibility = "visible";
	document.getElementById( "selectedSeller" ).value = sellerObj;
	document.getElementById( "selectedClient" ).value = clientIdObj;
	document.getElementById( "selectedClientDesc" ).value = clientDescObj;
	var dlg = $( '#messageInboxChooseForm' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		maxHeight: 550,
		minHeight: 156,
		modal : true,
		resizable : false,
		width : 735,
		draggable: false,
		overflow:"auto",

		open: function() {
			$( '#chooseForm' ).show();
			$("#messageInboxChooseForm #tab_1").removeClass("ft-status-bar-li-done").addClass("ft-status-bar-li-active");
			$('#messageInboxChooseForm #tab_2').removeClass();
			$('#messageInboxChooseForm #tab_3').removeClass();
			$('#messageInboxChooseForm #tab_4').removeClass();
			paintChooseMessagePopup();
			$( '#composeForm' ).hide();
			dlg.dialog('option','position','center'); 
		}
	} ).dialog("widget").find(".ui-dialog-titlebar").hide();
	dlg.dialog( 'open' );
	autoFocusOnFirstElement(null, "messageInboxChooseForm", true);
	$(document).on("ajaxStop", function (e) {
      $( '#messageInboxChooseForm' ).dialog('option','position','center');
});
}
function paintChooseMessagePopup() {
	var strUrl = "services/getMessageGroupsList.json";
    $.ajax({
        url: strUrl,
		type: 'POST',
		async : false,
		data:{$client:clientCode},
        success: function(data) {
            populatePaymentMethodLeftPanel(data);		
        }
    });
}
function populatePaymentMethodLeftPanel(response) {
	
	if (!jQuery.isEmptyObject(response)){
		var data=response;
		data.sort(function(a, b){
					    if(a.filterValue < b.filterValue) return -1;
					    if(a.filterValue > b.filterValue) return 1;
					    return 0;
			});
	//	hideErrorPanel('#paymentMethodError');
	    var length = data.length;
	    var list = $("#chooseMsgLeftPanel");
	    var anchor;
	    var caret;
	    list.empty();
	    var tabDiv = document.createElement("div");
		tabDiv.setAttribute('class', 'ui-vertical-tab ui-tabs ui-widget ui-widget-content ui-corner-all');
	    tabDiv.setAttribute('id', 'msgLeftPanelTab');
	    var ul = document.createElement('ul');
	    ul.setAttribute('class', 'ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
	    tabDiv.appendChild(ul);
	    list.append(tabDiv);
	    for (var i = 0; i < data.length; i++) {
	        var anchorData = data[i];
	        var description = anchorData.filterValue;
	        var code = anchorData.filterCode;
	        var tabId = 'child-' + description;
	        var li = document.createElement("li");
	        anchor = document.createElement("a");
	        anchor.innerHTML = anchor.innerHTML + description;
	        
	        anchor.setAttribute("onClick", "tabAnchorClick(this,'"+code+"')");
	        li.setAttribute("id", code+"vtab");
	        anchor.code = code;
	        
	        li.appendChild(anchor);
	        ul.appendChild(li);
	        if (i == 0)
	            anchor.click();
	    }
	
	    $("#msgLeftPanelTab").tabs();
	}else{
		if(jQuery.isEmptyObject(data.d.beneCategories) && !isEmpty($('#clientDescAutoCompleter').val())){
			clearPaymentProducts();
			var errorMsg=getLabel('noClientDataError','No Data Available for the moment.');
			paintError('#paymentMethodError','#paymentMethodErrorMsg',errorMsg);
		}
	}   
}
function tabAnchorClick(selectedAnchor,code) {
    var allChilds = selectedAnchor.parentElement.parentElement.childNodes;
    for (var i = 0; i < allChilds.length; i++) {
    	allChilds[i].className = '';
    	
        var css = '<style id="pseudo">li::after{display: none !important;}</style>';
        allChilds[i].insertAdjacentHTML( 'beforeEnd', css );
        var child = document.getElementById("pseudo");
		if(child){
		child.parentNode.removeChild(child);  
    	}
    }
    $('#'+selectedAnchor.parentElement.id).addClass('ui-vertical-tabs-selected');
    populateMethodCenterArea(code);
}
function populateMethodCenterArea(selectdFormGroup) {
    var data = fetchMessageFormList(selectdFormGroup);
    var centreDiv = $(".single-payment-template-defined-center" );
    centreDiv.empty();
    if(data &&data.d&&!jQuery.isEmptyObject(data.d.messageFormMst)){
        var dataArray = data.d.messageFormMst;
		dataArray.sort(function(a, b){
					    if(a.formName < b.formName) return -1;
					    if(a.formName > b.formName) return 1;
					    return 0;
		});
        var rowDiv;
        var childCountPerRow = 0;
        var firstRowCheck = true;
        var firstDataValueSelected = false;
        for (var i = 0; i < dataArray.length; i++) {
            if (childCountPerRow % 3 == 0 && firstRowCheck) {
                rowDiv = document.createElement("div");
                rowDiv.setAttribute('class', 'row');
                centreDiv.append(rowDiv);
                firstRowCheck = false;
            }
			var ctrl = $('<input/>').attr({
				type: 'radio',
				name: selectdFormGroup,
				formRecordKey: dataArray[i].recordKeyNo,
				tabindex:1,
				onClick: "messageFormChildRadioClick($(this))"
			});
			var colDiv = $('<div>').attr({'class': 'col-sm-4', 'style': 'margin-bottom: 6px;'}).appendTo(rowDiv);
			//if(dataArray[i].formName.length>=15){
	        	$('<label>').attr({'title':dataArray[i].formName, 'class': 'radio-inline'}).append(ctrl).append(dataArray[i].formName).appendTo(colDiv);
	        /*}	
		     else{
	        	$('<label>').attr({'class': 'radio-inline'}).append(ctrl).append(dataArray[i].formName).appendTo(colDiv); 
		     }*/
			childCountPerRow++;
			firstRowCheck = true;
			if (!firstDataValueSelected) {
				ctrl.attr('checked', true);
				firstDataValueSelected = true;
				messageFormChildRadioClick(ctrl);
			}
        }
    }
}
function messageFormChildRadioClick(selectedRadio) {
    document.getElementById('formRecordKey').value=selectedRadio.attr('formRecordKey')
}
function fetchMessageFormList(selectdFormGroup){
	var strUrl = 'getMessageFormList.srvc';
	var strData={};
	strData[csrfTokenName]=csrfTokenValue;
	strData['$formGroup']=selectdFormGroup;
	strData['$client']=clientCode;
	strData['$seller']=sessionSellerCode;
	var responseData = null;
    $.ajax({
        url: strUrl,
		type:'POST',
		async:false,
		data:strData,
        success: function(data) {
            responseData = data;
        }
    });
    return responseData;
}
function doSubmitMessage()
{
	$( '#messageInboxCompose' ).dialog( 'close' );
}

function submitResponseMessage(requestfor,refNo,response)	 
{	
	var strData = {};
	strData["strRefNo"] = $('#'+refNo).val();
	strData["strResponse"] = $('#'+response).val();
	strData[csrfTokenName] = csrfTokenValue ;	
	$.ajax({
	        type: 'POST',	
	        data:strData,
			async:false,
	        url: requestfor,	       
	        success: function(data)
	        {	         	 
	        	$( '#messageReplyCompose' ).dialog( 'close' );
	        	//if(messageBoxGrid)
	        	//messageBoxGrid.refreshData();
	        }
	    });
	strData = "";
	//submitForPageRefresh();
}
function submitForPageRefresh()
{
	var form = null;
	var strUrl = 'messageInboxCenter.srvc' ;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'GET';
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
}
function createFormField (element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function viewResponseMessage(record,screen_type)
{
	var strData = {};
	//strData['trackingNo'] = record.get('trackingNo');
	//strData['recordKeyNo'] = record.get('recordKeyNo');
	strData['viewState'] = record.get('identifier');
	strData[csrfTokenName] = csrfTokenValue ;	
	
	$.ajax(
		{
			type : 'POST',
			data : strData,
			url : "viewMessageBody.popupx?"+ csrfTokenName + "=" + csrfTokenValue,
			dataType : 'html',
			success : function( data )
			{
				var $response = $(data);
				$( '#viewMessageBody'  ).html(data);
				$( '#viewMessageBody'  ).last().find('hr:last').remove();
				$( '#viewMessageBody'  ).last().addClass('ft-padding-bottom');
				$( '#viewMessageBody' ).addClass("ux_panel-transparent-background ux_font-size14-normal");
				$( '#viewMessageBody'  ).css({"overflow":"auto"});
				$( '#viewMessageBody'  ).css({"max-height":"575px","minHeight":"156"});
				if(screen_type == "Inbox")
				{
					//messageBoxGrid.refreshData();
				}
				var dlg = $('#viewMessage');
				dlg.dialog( {
					bgiframe : true,
					autoOpen : false,
					/*height : "auto",*/
					modal : true,
					resizable : false,
					draggable: false,
					maxHeight : 575,
					minHeight : 156,
					title : getLabel('viewMsg',"View Message"),
					width : 600,
					cls : 'ui-dialog ui-dialog-titlebar-close',
					dialogClass : 'highZIndex',
					/*buttons : {						
						"Report" : function() {
		                    getMessageBoxReport(record.data.recordKeyNo,screen_type);	
						},
						"Close" : function() {
							
					      $(this).dialog('close');	
                           						
						}
					},*/
					open : function()
					{
						//dlg.css('overflow-y','hidden');
					$('.ui-dialog-buttonpane').find('.ui-button-text').addClass('ft-button ft-button-primary');					
					}
				} ).height("auto");
				dlg.dialog( 'open' );
				
				$('#cancelViewMessage').bind('click',function(){
				      dlg.dialog('close');	
					  dlg.dialog('destroy');
				});
				 dlg.on('dialogclose', function(event) {
					dlg.dialog('destroy');
				 });				
				$('#reportViewMessage').bind('click',function(){
	                   getMessageBoxReport(record.get('identifier'),screen_type);	
				});
				
				//$('#viewMessageBody').focus();
				$('#viewMessageBody label').css('display','inline');
			},
			error : function( request, status, error )
			{
				//alert("Error");
			}
		} );
}
function doReplyMessage(record,singleActionFlag)
{
	var strData = {};
	var strLabel = getLabel('sendMsg',"Reply Message");
	if(null==singleActionFlag)
	{
		strLabel = getLabel('sendMsg',"Reply Message");
	}
	else if('Y'==singleActionFlag)
	{
		strLabel = getLabel('resolveMsg',"Resolve Message");
	}
	else if('N'==singleActionFlag)
	{
		strLabel = getLabel('replyResolveMsg',"Reply & Resolve Message");
	}
	//strData['trackingNo'] = record.get('trackingNo');
	//strData['recordKeyNo'] = record.get('recordKeyNo');
	strData['viewState'] = record.get('identifier');
	strData[csrfTokenName] = csrfTokenValue ;	
	document.getElementById( "replyMessageBody" ).style.visibility = "visible";
	$.ajax(
		{
			type : 'POST',
			data : strData,
			url : "viewMessageBody.popupx?"+ csrfTokenName + "=" + csrfTokenValue,
			dataType : 'html',
			success : function( data )
			{
				var $response = $(data);
				$( '#viewReplyMessageBody' ).html(data);
				$('#deparmentDiv').hide();
				document.getElementById("formMessageBody").value = data;
				document.getElementById("replyText").value = '';
				var dlg = $( '#replyMessageBody' );
				$( '#replyMessageBody' ).addClass("ux_panel-transparent-background ux_font-size14-normal");
				dlg.dialog( {
					autoOpen : false,
					minHeight: (screen.width) > 1024 ? 156 : 0 ,
					maxHeight: 550,
					modal : true,
					dialogClass: 'ft-dialog',
					resizable : false,
					draggable: false,
					width : 740,
					title : strLabel,
					open : function()
					{
						 $('#replyMessageBody').dialog('option', 'position', 'center');
						 $( '#viewReplyMessageBody label').css('display','inline');
					}
				} );
				dlg.dialog( 'open' );
			},
			error : function( request, status, error )
			{
				//alert("Error");
			}
		} );

	$('#cancelReplyMessage').on('click', function(){
		$('#replyMessageBody').dialog('close');
	});
	$('#sendReply').unbind('click');
	$('#sendReply').on('click', function(){
		$('#replyMessageBody').dialog('close');
		if(_IsEmulationMode == true)
		{
			Ext.MessageBox.show(
					{
						title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
						msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
						buttons : Ext.MessageBox.OK,
						cls : 'ux_popup',
						icon : Ext.MessageBox.ERROR
					} );
		}
		else
		{
			sendReplyMessage(record,singleActionFlag);
		}
	});
}

function doReplyAndResolveMessage(record,singleActionFlag)
{
	doReplyMessage(record,singleActionFlag);
}

function doReAssignMessage(record)
{
	var strData = {};
	strData['viewState'] = record.get('identifier');
	strData[csrfTokenName] = csrfTokenValue ;	
	document.getElementById( "replyMessageBody" ).style.visibility = "visible";
	$.ajax(
		{
			type : 'POST',
			data : strData,
			url : "viewMessageBody.popupx?"+ csrfTokenName + "=" + csrfTokenValue,
			dataType : 'html',
			success : function( data )
			{
				var $response = $(data);
				$( '#viewReplyMessageBody' ).html(data);
				document.getElementById("formMessageBody").value = data;
				document.getElementById("replyText").value = '';
				var strToUserVal = document.getElementById("toUser").value;
				$('#deparmentDiv').show();
				var objDeptList = document.getElementById("department");
				objDeptList.innerHTML = "";
				var option = document.createElement("option");
				option.text = 'Select';
				option.value = '';
				objDeptList.add(option);
				for(i=0;i<arrDestinationList.length;i++)
				{
					var option = document.createElement("option");
					var objDept = arrDestinationList[i];
					option.text = objDept["destinationName"];
					option.value = objDept["destinationId"];
					objDeptList.add(option);
				}
				$("#department option:contains("+strToUserVal+")").remove();
				var dlg = $( '#replyMessageBody' );
				$( '#replyMessageBody' ).addClass("ux_panel-transparent-background ux_font-size14-normal");
				dlg.dialog( {
					bgiframe : true,
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : true,
					width : 740,
					title : getLabel('reassignMsg',"Re-assign Message"),
					open : function()
					{
						$('#sendReply').on('click', function(){
							
							if(_IsEmulationMode == true)
							{
								Ext.MessageBox.show(
										{
											title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
											msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										} );
							}
							else
							{
								if(isEmpty($("#department").val())){
									paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please select The Department to Re-Assign.');
								}else if(isEmpty($("#replyText").val())){
									paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage','Please Enter the message.');
								}else{
									$("#advancedFilterErrorDiv").addClass('ui-helper-hidden');
									$('#replyMessageBody').dialog('close');
									sendReplyMessage(record,"R");
								}
							}
						});					
					}
				} );
				dlg.dialog( 'open' );
			},
			error : function( request, status, error )
			{
				//alert("Error");
			}
		} );
}

function sendReplyMessage(record,msgTypeFlag)
{
	var strData = {};
	var strUrl = null;
	if ('0' == record.get('formIsReply') && "R" != msgTypeFlag) {
		strUrl = "resolve.srvc?"+ csrfTokenName + "=" + csrfTokenValue;
	} else if (null != msgTypeFlag && "R" != msgTypeFlag) {
		strUrl = "replyAndResolve.srvc?"+ csrfTokenName + "=" + csrfTokenValue;
	} else if (null != msgTypeFlag && "R" === msgTypeFlag) {
		strUrl = "doReassignMessage.srvc?"+ csrfTokenName + "=" + csrfTokenValue;
	} else {
		strUrl = "sendReplyToMessage.srvc?"+ csrfTokenName + "=" + csrfTokenValue;
	}
	//strData['trackingNo'] = record.get('trackingNo');
	//strData['recordKeyNo'] = record.get('recordKeyNo');
	strData['viewState'] = record.get('identifier');
	strData['replyText'] = document.getElementById("replyText").value ;
	strData['department'] = document.getElementById("department").value ;
	strData['messageBody'] = document.getElementById("formMessageBody").value ;	
	strData[csrfTokenName] = csrfTokenValue ;	
	$.ajax(
		{
			type : 'POST',
			data : strData,
			url : strUrl,
			dataType : 'html',
			success : function( data )
			{
				objMainGrid.refreshData();
			},
			error : function( request, status, error )
			{
				//alert("Error");
			}
		} );
}
function closeResponseMessage(refNo)	 
{	
	var strData = {};
	strData["selectedReferenceCode"] = $('#'+refNo).val();
	strData[csrfTokenName] = csrfTokenValue ;	
	$.ajax({
	        type: 'POST',	
	        data:strData,
			async:false,
	        url: 'getDynamiMessageFormMessageJson.srvc',	       
	        success: function(data)
	        {	 
	        	$( '#messageReplyCompose' ).dialog( 'close' );
	        	//messageBoxGrid.refreshData();
	        }
	    });
	strData = "";
}
function showComposeMessageForm(strUrl,formRecordKey,sellerCode,clientCode,clientDesc,isInvokedFromRightMenu)
{
	if(formRecordKey == null || formRecordKey == '')
	{
		showErrorMessage();
	}
	else
	{
		if (isInvokedFromRightMenu) {
			document.getElementById('formRecordKey').value = formRecordKey;
			if ($('#selectedClient').length > 0) {
				document.getElementById('selectedClient').value = clientCode;
			}
			var referenceDiv = null;
			if ($('#messageInboxChooseForm').length > 0) {
				referenceDiv = $('#messageInboxChooseForm');
			} else {
				referenceDiv = $(document.createElement('div'));
				$(referenceDiv).attr("id", "messageInboxChooseForm");
			}
			var dlg = referenceDiv;
			dlg.dialog({
						bgiframe : true,
						autoOpen : false,
						maxHeight : 550,
						minHeight : 156,
						modal : true,
						dialogClass: 'ux-dialog',
						resizable : false,
						width : 735,
						draggable : false,
						overflow:"auto",

						open : function() {

							if ($('#composeForm').length < 1) {
								var composeFormDiv = $(document
										.createElement('div'));
								$(composeFormDiv).attr("id", "composeForm");
								//$('#messageInboxChooseForm')
								//		.append(composeFormDiv);
										 $(composeFormDiv).appendTo('#messageInboxChooseForm');
								 
							}					
							$('#chooseForm').hide();
							$('#composeForm').show();
							dlg.dialog('option','position','center'); 
						}
					}).dialog("widget").find(".ui-dialog-titlebar").hide();
			dlg.dialog('open');
		}
		var strData = {};
		strData['formRecordKey'] = formRecordKey;
		strData['selectedSeller'] = sellerCode;
		strData['selectedClient'] = clientCode;
		strData['selectedClientDesc'] = clientDesc;
		strData['sellerCode'] = sellerCode;
		strData[csrfTokenName] = csrfTokenValue ;	
		$.ajax(
			{
				type : 'POST',
				data : strData,
				url : strUrl,
				//contentType : "application/json",
				dataType : 'html',
				success : function( data )
				{
					if(data != null)
						data = $.trim(data);
					
					var $response = $( data );
					$('#chooseForm').hide();
					$( '#composeForm' ).html(
						$response.filter( '#messageInboxComposeMessage' ) );
					$('#messageInboxChooseForm #tab_1').removeClass('ft-status-bar-li-active').addClass('ft-status-bar-li-done');
					$("#messageInboxChooseForm #tab_2").addClass('ft-status-bar-li-active');
					$( '#composeForm' ).show();	
					//$("#composeMessageFormBtn #verifyMessageBtn1").attr("class","block");
					//$("#composeMessageFormBtn #submitMessageBtn1").attr("class","hidden");
					//$("#composeMessageFormBtn2 #verifyMessageBtn2").attr("class","block");
					$("#composeMessageFormBtn2 #submitMessageBtn2").attr("class","block ux-dialog-footer");
					 $(".selector").autocomplete({delay : 3000});
				     $("#clientDesc").ClientAutoComplete();
				     //toggleShowCompanyInfo();
				     if(!isEmpty($( "input[fieldtype='9']" ))){
				  	  $( "input[fieldtype='9']" ).toArray().forEach(function(value,index,array) {
				  	  	var maxLength =isEmpty($("#"+value.id).attr('maxlength')) ? 16 : ($("#"+value.id).attr('maxlength') );
				  	  	$("#"+value.id).autoNumeric("init",
				  			{
				  				aSep: strGroupSeparator,
				  				aDec: strDecimalSeparator,
				  				mDec: strAmountMinFraction
				  			});
						}
				  	  );
				     }
				     
				     if(!isEmpty($( "select[fieldtype='8']" ))){
				    	 $( "select[fieldtype='8']" ).toArray().forEach(function(value,index,array) {
				    	       $("#"+value.id).niceSelect();
				    	       $("#"+value.id).niceSelect('update');
				    	       $("#"+value.id+'-niceSelect').bind('blur', function () { markRequired(this);});
				    	       $("#"+value.id+'-niceSelect').bind('focus', function () { removeMarkRequired(this);});
				    	 });
				     }				     
				     $( "#messageBody" ).val('');
				     $('#messageInboxChooseForm').dialog("open");
					$('#messageInboxChooseForm').dialog('option','position','center'); 
					autoFocusOnFirstElement(null,'messageInboxChooseForm',true);
					$(".numberField").OnlyNumbers();
					
				},
				error : function( request, status, error )
				{
					//alert("Error");
				}
			} );
	}
	
}
function showErrorMessage()
{
	var dlg = $( '#messageBoxError' );
	dlg.dialog( {
		autoOpen : false,
		height : "auto",
		modal : true,
		width : 300,
		title : getLabel('msgBoxError', "Message"),		
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	} );
	dlg.dialog( 'open' );
}
function closeComposeMessagePopup()
{
	$( '#messageInboxChooseForm' ).dialog( 'destroy' );
	$( '#messageInboxChooseForm' ).dialog( 'close' );
}
function verifyMessage()
{
	var errorFlag = false ;
	var fieldRequired ;
	var checkBoxFieldRequired ;
	var value ;
	var fieldId ;
	var datavalid=new Array();
	var checkboxId ;
	var radioButtonId ;
	var radibbuttonArray=new Array();
	var radibbuttonReqArray=new Array();
	var checkBoxArray=new Array();
	var checkBoxReqArray=new Array();
	var checkedCount=0;
	var fldMinlength, fildMaxlength;
	$("#composeMessageFormBtn2  #submitMessageBtn2 #nextId").prop("disabled", true);
	$("#composeForm").find('input[type=text],input[type=hidden],textarea,select,[type=file]').each(function()
	 {
		fieldId = $(this).attr("fieldId");
		fieldRequired=$(this).attr("tag");
		value = $(this).val();
	  	value=!isEmpty(value) ? trim(value) : value;
	  	fldMinlength = $(this).attr("minlength");
	  	fildMaxlength = $(this).attr("maxlength");
		if($(this).attr("type")=="text" || $(this).prop("tagName").toUpperCase() === "TEXTAREA" )
		 {
		  	if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]=getLabel('pleaseEnterValid','Please Enter valid ')+fieldId;
		  	}
		  	if(!isEmpty(value) && !isEmpty($(this).attr("minlength")) && value.length < fldMinlength){
		  		datavalid[datavalid.length]=getLabel("minLengthFor","Minimum length for ")+fieldId+" " + getLabel("is","is ")+" "+fldMinlength+".";
		  	}
		  	if(!isEmpty(value) && !isEmpty($(this).attr("maxlength")) && value.length > fildMaxlength){
		  		datavalid[datavalid.length]=getLabel("maxLengthFor","Maximum length for ")+fieldId +" "+ getLabel("is","is ")+" "+fildMaxlength+".";
		  	}
		 }
		else if($(this).attr("type")=="file")
		{
		
			if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]=getLabel("pleaseSelectValid ","Please Select valid")+" "+fieldId;
		  	}		
			id = document.getElementById(fieldId);
			if(undefined!=$(id)[0].files[0])
			{
				var size = $(id)[0].files[0].size;			
				if(size <1)
				{
						datavalid[datavalid.length]=getLabel('fileSizeZeroError','File Size Should Not Be Zero');
				}
				else if(size>5000000)
				{
						datavalid[datavalid.length]=getLabel('fileSizeMaxError','Max 5 MB file is Allowed');
				}				
			}
		}		 
		else if($(this).attr("type")=="select")
		{
			if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]=getLabel("pleaseSelectValid ","Please Select valid")+" "+fieldId;
		  	}
		}
	 });
	$("#composeForm").find('input[type=checkbox]').each(function()
	{			
			if(isEmpty(checkboxId))
			{				
				checkBoxArray[checkBoxArray.length] = $(this).attr("fieldId");
				checkBoxReqArray[checkBoxReqArray.length] = $(this).attr("tag");						
			}			
			if(!isEmpty(checkboxId) && checkboxId!=$(this).attr("fieldId"))
			{				
				checkBoxArray[checkBoxArray.length] = $(this).attr("fieldId");
				checkBoxReqArray[checkBoxReqArray.length] = $(this).attr("tag");
			}			
			checkboxId = $(this).attr("fieldId");			
	 });
	$("#composeForm").find('input[type=radio]').each(function()
		{							
			if(isEmpty(radioButtonId))
			{
				radibbuttonArray[radibbuttonArray.length] = $(this).attr("fieldId");
				radibbuttonReqArray[radibbuttonReqArray.length] = $(this).attr("tag");				
			}			
			if(!isEmpty(radioButtonId) && radioButtonId!=$(this).attr("fieldId"))
			{
				radibbuttonArray[radibbuttonArray.length] = $(this).attr("fieldId");
				radibbuttonReqArray[radibbuttonReqArray.length] = $(this).attr("tag");
			}						
			radioButtonId = $(this).attr("fieldId");			
	});	
	for(var i=0;i < radibbuttonArray.length;i++)
	{			
		var chks = document.getElementsByName(radibbuttonArray[i]);	
		if(!isEmpty(radibbuttonReqArray[i]))
		{
			checkedCount=0;
			for(var j=0;j < chks.length;j++)
			{
				value = chks[j].checked ?1:0;
				checkedCount = checkedCount+value;
			}
			if(checkedCount==0)
			{
				datavalid[datavalid.length]=getLabel("pleaseSelectValid ","Please Select valid")+" "+radibbuttonArray[i];				
			}
		}
	}
	for(var i=0;i < checkBoxArray.length;i++)
	{	
		if(!isEmpty(checkBoxReqArray[i]))
		{
			var chks = document.getElementsByName(checkBoxArray[i]);
			checkedCount=0;
			for(var j=0;j < chks.length;j++)
			{
				value = chks[j].checked ?1:0;
				checkedCount = checkedCount+value;
			}
			if(checkedCount==0)
			{
				datavalid[datavalid.length]=getLabel("pleaseSelectOneValid","Please Select One valid")+" "+checkBoxArray[i];				
			}
		}
	}	
	if(datavalid.length == 0)
	{
		submitMessage();
		autoFocusOnFirstElement(null, 'messageInboxChooseForm', true);
	}
	else
	{
		 var errDiv = $(document.createElement('div'));	 
		 var setErrDivTitle=getLabel("errors" , "Errors");
		 var ErrdivId=showErrorDialog(errDiv,setErrDivTitle,"Errorform");
		 var r = 0;
		 for (r=0;r<datavalid.length;r++)
		 { 
			  $("#"+ErrdivId).append(trim(datavalid[r]));	
			  $("#"+ErrdivId).append(document.createElement('br'));	
      	 }
		 $("#btnErrorOk").focus();
		 $("#composeMessageFormBtn2  #submitMessageBtn2 #nextId").prop("disabled", false);
	}
	//autoFocusOnFirstElement(null, 'messageInboxChooseForm', true);
}
function backToCompose(){
		$('#composeForm').hide();$('#chooseForm').show();
		$('#messageInboxChooseForm  #tab_1').addClass('ft-status-bar-li-active');
		$('#messageInboxChooseForm #tab_2').removeClass('ft-status-bar-li-active');
		$('#messageInboxChooseForm').dialog("open");
		$('#messageInboxChooseForm').dialog('option','position','center'); 
		autoFocusOnFirstElement(null, "messageInboxChooseForm", true);
		//$("#messageInboxComposeMessage ").find('input').removeAttr("disabled","disabled");
		//$("#messageInboxComposeMessage ").find('textarea').removeAttr("disabled","disabled");
		//$("#messageInboxComposeMessage ").find('select').removeAttr("disabled","disabled");
		//$("#composeMessageFormBtn  #verifyMessageBtn1").attr("class","block");
		//$("#composeMessageFormBtn  #submitMessageBtn1").attr("class","hidden");
		//$("#composeMessageFormBtn2  #verifyMessageBtn2").attr("class","block");
		//$("#composeMessageFormBtn2  #submitMessageBtn2").attr("class","hidden");			
} 
function showErrorDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,
	        show: "blind",
	        width: 400,
            height: 'auto',
            minHeight : 200,
            modal: true,
            buttons :
            {
				"Ok" :
				{
					text : 'Ok',
					id : 'btnErrorOk',
					click : function()
					{
						$(this).dialog('destroy').remove();
						autoFocusOnFirstElement(null, 'messageInboxChooseForm', true);
					}
				}
			},
            close: function(event, ui) 
            {
				$(this).dialog('destroy').remove();
				autoFocusOnFirstElement(null, 'messageInboxChooseForm', true);
            }
	    }
	);
	$(newDiv).css('overflow-y','auto');
	
	return  $(newDiv).attr("id");
}
function submitMessage()
{
 var JsonData=new Array();
 var value ;
 var fieldId, strName = null ;
 var fieldRecordKey ;
 var strFileId = null;
 var checkboxfieldCodes = new Array();
 var TrackingNo = null ;
 var formRecordKey = document.getElementById('formRecordKey').value;
 var clientId = document.getElementById( "selectedClient" ).value ;
 var strValue = null;
 
 var arrItems =$("#messageInboxChooseForm").find('input[type=text],textarea,select,[type=file]');
 for (i = 0; i < arrItems.length; i++) {
  fieldId = arrItems[i].getAttribute("fieldId");
  if (fieldId == null) {
   fieldId = arrItems[i].getAttribute("id");
  }
  fieldRecordKey = arrItems[i].getAttribute("fieldRecordKey");
  value = arrItems[i].value;
  if(arrItems[i].getAttribute("type")=="file")
  {	  
	  if(value!=null && ''!=value)
	  {
		//value = $('#ftp_folder').val()+value.replace(/C:\\fakepath\\/i, '');
		value = value.replace(/C:\\fakepath\\/i, '');
		strFileId = fieldId;
	  }
  }    
  JsonData.push(createJsonData(fieldRecordKey, fieldId, value));
 }
 
// $("#messageInboxChooseForm").find('input[type=text],input[type=hidden],textarea,select').each(function()
//  {
//  
// });
/* $("#messageInboxChooseForm input[type=checkbox]").each(function() {
		fieldId = $(this).attr("id");
		strName = $(this).attr("name");
		fieldRecordKey = $(this).attr("fieldRecordKey");
		if ($(this).is(":checked"))
			checkboxfieldCodes.push($(this).val());
		strValue = checkboxfieldCodes.join(', ');
	}); */
 $("#messageInboxChooseForm input[type=radio]").each(function()
 {
   fieldId = $(this).attr("fieldId");
   if(fieldId == null)
   {
    fieldId = $(this).attr("id");
   }
   fieldRecordKey = $(this).attr("fieldRecordKey");
   if (typeof(fieldId) != "undefined" && typeof(fieldRecordKey) != "undefined")
	  {	  
		 	if ($(this).is(":checked"))
		 	{	
		 		value=$(this).val();
		 		JsonData.push(createJsonData(fieldRecordKey,fieldId,value));
		 	}	
	  }	
   });
 if(strValue != null)
 {
  JsonData.push(createJsonData(fieldRecordKey,strName,strValue));
 }
 var strData = {};
 var formData = new FormData();

// HTML file input, chosen by user
if(null!=strFileId)
{
	id = document.getElementById(strFileId);
	 formData.append("userfile", $(id)[0].files[0]);
}

 $('<input>').attr({
     type: 'hidden',
     id: 'dynamicdata',
     name: 'dynamicdata'
 }).appendTo('frmMain');
 formData.append("dynamicdata",JSON.stringify( JsonData ));
 formData.append("formRecordKey",formRecordKey);
 formData.append("clientId",clientId);
 formData.append(csrfTokenName,csrfTokenValue) ;
 blockUI(); 
 $.ajax({
				type : 'POST',
				data : formData,				
				url : "submitComposeMessage.popup",
				processData: false,
				contentType: false,				
				success : function(data) {
					TrackingNo = data.TrackingNo;
				//	debugger;
					/*if (null != TrackingNo) {
						var setErrDivTitle = "Your Request has been Submitted";
						var setTrackingNo = "Tracking Number :";

						$("#bankInfoDiv").empty();
						$('<p>' + setErrDivTitle + '</p>')
								.appendTo('#bankInfoDiv');
						$("#bankInfoDiv").append(document.createElement('br'));
						$('<p>' + setTrackingNo + '<font color="red">'
								+ TrackingNo + '</font></p>')
								.appendTo('#bankInfoDiv');
						$('#bankInfoDiv').css("vertical-align", "top");
						// $('#bankInfoDiv').css("color","#0078AE");
						$('#bankInfoDiv').css("font-size", "1.2em");
						$('#bankInfoDiv').css("font-weight", "bold");
						$('#bankInfoDiv').css("width", "300");
						$('#bankInfoDiv').css("text-align", "center");
					}*/

					/*
					 * $('#messageInboxChooseForm
					 * #tab_3').find('a').removeClass('active');
					 * $("#messageInboxChooseForm
					 * #tab_4").find('a').addClass('active');
					 */
					// $('#messageInboxChooseForm
					// #tab_3').removeClass('ft-status-bar-li-active').addClass("ft-status-bar-li-done");
					// $("#messageInboxChooseForm
					// #tab_4").addClass('ft-status-bar-li-active');
					// $("#composeMessageFormBtn
					// #exitBtn1").attr("class","block");
					// $("#composeMessageFormBtn
					// #submitMessageBtn1").attr("class","hidden");
					// $("#composeMessageFormBtn2
					// #exitBtn2").attr("class","block");
					// $("#composeMessageFormBtn2
					// #submitMessageBtn2").attr("class","hidden");
					exitComposeMessagePopup(TrackingNo);
				},
				error : function(request, status, error) {
					if(request != null){
						if(request.responseText !=null)
						{
							$('#procedureError').removeClass('ui-helper-hidden');
							var obj = jQuery.parseJSON( request.responseText );
							var textMsg = obj.globalerrors[0];
							$('#procedureErrorMsg').text(textMsg);
								//alert(error);
						}
					}
				}   
     });
 unblockUI();
 strData = "";
}
function createJsonData(Field_Record_Key,Field_Name,Field_value)
{
	return {Field_Record_Key:Field_Record_Key,Field_Name:Field_Name,Field_value:Field_value} ;
}
function exitComposeMessagePopup(TrackingNo)
{
	//document.getElementById( "messageInboxChooseForm" ).style.visibility = "hidden";
	$( '#messageInboxChooseForm' ).dialog( 'close' );
	if(null != TrackingNo){
		Ext.Msg.show({  
		   title:getLabel("recentactionresult","Recent Action Result"),
		   msg: getLabel("messengsentmsg","Your request has been submitted. Tracking Number: ") +TrackingNo,                                     
           width: 355,
		   height:200,
		   modal:true,  
		   buttons:Ext.MessageBox.OK,
		   buttonText: {
	            ok: getLabel('btnOk', 'OK')
				}  
		});
	}
	/*var form = null;
	var strUrl = 'messageInboxCenter.srvc' ;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'GET';
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',"composeMessage", "Y"));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',"trackingNo", TrackingNo));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();*/
}
jQuery.fn.ClientAutoComplete = function() {

    return this.each(function() {
                    $(this).autocomplete({
                                    source : function(request, response) {
                                                    $.ajax({
                                                            url : "services/userseek/adminMsgCentrClientSeek.json?$top=20",
                                                            dataType : "json",
                                                            data : {
                                                                            $autofilter : request.term,
                                                                            $sellerCode : $('#sellerId').val()
                                                            },
                                                            success : function(data) {
                                                                            var rec = data.d.preferences;
                                                                            response($.map(rec, function(item) {
                                                                                        return {
                                                                                                        label : item.DESCR,
																										value : item.DESCR,
																										code  : item.CODE
																										
                                                                                        }
                                                                        }));
                                                            }
                                            });
                                    },
                                    minLength : 1,
                                    select : function(event, ui) {
                                                    log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
                                                                                    + ui.item.lbl : "Nothing selected, input was "
                                                                                    + this.value);
                                                                                    var val = ui.item.code;
                                                                    $('#clientId').val(val);
                                                                  // $('#selectedSellerCode').val($('#paramSellerCode').val());
                                    },
                                    open : function() {
                                                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                                    },
                                    close : function() {
                                                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                    }
                    });/*.data("autocomplete")._renderItem = function(ul, item) {
									
                                    var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
                                                                    + item.label
                                                                    + '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
                                                                    + '</ul></ol></a>';                                                                       
                                    return $("<li></li>").data("item.autocomplete", item)
                                                                    .append(inner_html).appendTo(ul);
                    };*/
    });
};
function populateClient(obj)
{
	$(".selector").autocomplete({delay : 3000});
    $("#clientDesc").ClientAutoComplete();
}

function toggleShowCompanyInfo(){
showToolTip();
	$('#instumentCompanyInfoLink').unbind('click');
	$("#instumentCompanyInfoLink").bind('click',function(event) {
			console.log(event);
			$('#instumentCompanyInfoDiv').dialog('destroy');
			$('#instumentCompanyInfoDiv').dialog({
		autoOpen : false,
		height : 'auto',
		minWidth : 200,
		width : 300,
		minHeight : 30,
		modal : false,
		resizable : false,
		position : {
			my : "right top",
			at : "right bottom",
			of : $('#instumentCompanyInfoLink')
		},
		bgiframe : true,
		dialogClass : "noclose"
	});
	$('#instumentCompanyInfoDiv').dialog('open');
		
		event.stopPropagation();
		return false;
	});
	$("#messageInboxComposeMessage, #messageInboxChooseForm").live("click", function() {
			$("#instumentCompanyInfoDiv").dialog("close");
	});
}

function showToolTip() {
	$("#instumentCompanyInfoLink").unbind('mouseover');
	$("#instumentCompanyInfoLink").unbind('mouseout');
	$("#instumentCompanyInfoLink").bind('mouseover', function(e) {
				//console.log(e.pageY);
				$('<span>').html($('#instumentCompanyInfoDiv').html()).attr('class','custom-tooltip').css({
								right:'20px'
						}).appendTo($("#instumentCompanyInfoSpan"));
			});

	$("#instumentCompanyInfoLink").bind('mouseout', function(e) {
				$("#instumentCompanyInfoSpan").find('.custom-tooltip').remove();
			});
}

function toggleCheckboxImage(elem) {
	var image = elem.getElementsByTagName("IMG")[0];
	var elementId = elem.getAttribute("id").replace("chk_", "");
	if (undefined != image)
		if (image.src.indexOf("icon_checked.gif") == -1) {
			image.src = "static/images/icons/icon_checked.gif";
			document.getElementById(elementId).value = "Y";
		} else {
			image.src = "static/images/icons/icon_unchecked.gif";
			document.getElementById(elementId).value = "N";
		}
}

jQuery.fn.SetCheckboxValues = function() {
	$(this)
			.each(
					function(index) {
						var imageList = $(this).find('IMG');
						var elementId = $(this).attr("id").replace(
								"chk_", "");
						if (null != document.getElementById(elementId)) {
							if ("N" === document
									.getElementById(elementId).value && undefined!=imageList) {
								if('N' == $("#chkParent_"+elementId).val())
								{
									imageList[0].src = "static/images/icons/icon_unchecked_grey.gif";
									$("#"+elementId).val("N");
									$(this).removeAttr('onclick');
									$(this).prop('tabIndex', -1);
								}
								else
								{
									imageList[0].src = "static/images/icons/icon_unchecked.gif";
								}	
							} else {
									imageList[0].src = "static/images/icons/icon_checked.gif";
							}
						}
					});
};

jQuery.fn.SetHelpText = function() {
	return this.each(function() {
		if ($(this).val() == $(this).attr('title') || '' == $(this).val()) {
			$(this).val($(this).attr('title'));
			$(this).removeClass('black');
			;
			$(this).addClass('grey');
		}
	}),

	$(this).focusout(function(e) {
		if ($(this).val() == $(this).attr('title') || '' == $(this).val()) {
			$(this).val($(this).attr('title'));
			$(this).removeClass('black');
			$(this).addClass('grey');
		}
	})

};

jQuery.fn.RemoveHelpText = function() {
	return this.each(function() {
		$(this).focus(function(e) {
			if ($(this).val() == $(this).attr('title')) {
				$(this).val('');
				$(this).removeClass('grey');
				$(this).addClass('black');
			}
		})

	})
};

function submitAlertForm(strUrl, frmId) {
		blockUI();
		var frm = document.getElementById(frmId);
		var eventVal = $("#eventName").val();
		if(eventVal != null && eventVal.indexOf(",")!=-1)
		{
			$("#eventName").val(eventVal.substring(0,eventVal.indexOf(",")));
		}
		$( ":input" ).removeAttr("disabled");
		
		// jquery autoNumeric formatting
		var blnAutoNumeric = isAutoNumericApplied("amountbox");
		if (blnAutoNumeric) 
			 $(".amountbox").val( $(".amountbox").autoNumeric('get'));
		
		// jquery autoNumeric formatting
		
		for(var key in mapSelectedValues)
		{
			var elementID = "alertDetailBeans"+key+"dataValue";
			$("#"+elementID).val(mapSelectedValues[key]);
		}
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

function callGroupService(strUrl, element) {
	var elementID = $(element).attr("id");
	var elementValue1 = $("#"+elementID).val();
	selectedModuleCode = elementValue1;
	var strUrl =  "services/" + strUrl + "?moduleCode="
						+ elementValue1
						+"&seller="+$('#sellerCode').val()
						+"&client="+$('#clientId').val();
	blockUI();
	
	$
			.ajax({
				url :strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
				success : function(data) {
					var blankOption = document.createElement("option");
					blankOption.text = "Select";
					blankOption.value = "";
					var select = document.getElementById("group");
					var x;
					$("#group").removeAttr("disabled");
					select.length = 1;
					if(null!=data && data.length!=0){
						$("#group").empty();
						select.add(blankOption);
						for (x in data) {
							var option = document.createElement("option");
							option.text = data[x];
							option.value = x;
							select.add(option);
						}
						makeNiceSelect('group', true);
					}else{
						var groupSelect = document.getElementById("group");
						$("#group").empty();
						groupSelect.add(blankOption);
						makeNiceSelect('group', true);
					}
					var eventNameSelect = document.getElementById("eventName");
					$("#eventName").empty();
					eventNameSelect.add(blankOption);
					makeNiceSelect('eventName', true);
					
					var parentSubscriptionNameSelect = document.getElementById("parentSubscriptionName");
					$("#parentSubscriptionName").empty();
					parentSubscriptionNameSelect.add(blankOption);
					makeNiceSelect('parentSubscriptionName', true);
					
					unblockUI();
				}
			});
}

function callEventService(strUrl, elementID1, elementID2) {
	var elementValue2 = $("#"+elementID2).val();
	var strUrl =  "services/" + strUrl + "?" + elementID1 + "="
						+ selectedModuleCode +"&" + elementID2 + "=" + elementValue2
						+"&seller="+$('#sellerCode').val()
						+"&client="+$('#clientId').val();
	blockUI();					
	$
			.ajax({
				url :strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
				success : function(data) {
					var blankOption = document.createElement("option");
					blankOption.text = "Select";
					blankOption.value = "";
					var select = document.getElementById("eventName");
					var x;
					$("#eventName").removeAttr("disabled");
					select.length = 1;
					if(null!=data && data.length!=0){
						$("#eventName").empty();
						select.add(blankOption);
						for (x in data) {
							var option = document.createElement("option");
							option.text = data[x];
							option.value = x;
							select.add(option);
						}
						makeNiceSelect('eventName', true);
					}else{
						var eventNameSelect = document.getElementById("eventName");
						$("#eventName").empty();
						eventNameSelect.add(blankOption);
						makeNiceSelect('eventName', true);
					}
					
					var parentSubscriptionNameSelect = document.getElementById("parentSubscriptionName");
					$("#parentSubscriptionName").empty();
					parentSubscriptionNameSelect.add(blankOption);
					makeNiceSelect('parentSubscriptionName', true);
					
					unblockUI();
				}
			});
}

function callSubscriptionNameService(strUrl, elementID1, elementID2, elementID3) {
	var elementValue2 = $("#"+elementID2).val();
	var elementValue3 = $("#"+elementID3).val();
	var strUrl =  "services/" + strUrl + "?" + elementID1 + "="
						+ selectedModuleCode+"&" + elementID2 + "=" + elementValue2
						+"&" + elementID3 + "=" + elementValue3
						+"&seller="+$('#sellerCode').val()
						+"&client="+$('#clientId').val();
	blockUI();
			$.ajax({
				url :strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
				success : function(data) {
					
					var select = document.getElementById("parentSubscriptionName");
					var x;
					$("#parentSubscriptionName").removeAttr("disabled");
					select.length = 1;
					if(null!=data && data.length!=0){
						for (x in data) {
							var option = document.createElement("option");
							option.text = data[x];
							option.value = x;
							select.add(option);
						}
						makeNiceSelect('parentSubscriptionName', true);
					}
					unblockUI();
				}
			});
}

function hideToAmount(index)
{
	var elementID = "alertDetailBeans"+index+"dataOperator";
	var toAmountElement = "alertDetailBeans"+index+"toAmount";
	var fromAmountElement = "alertDetailBeans"+index+"fromlabel .from-label";
	if("BETWEEN" !=$("#"+elementID+" option:selected").text())
	{
		$("#"+toAmountElement).addClass("hidden");
		$("#"+toAmountElement).parent().find(".frmLabel").addClass("hidden");
		$("#"+fromAmountElement).addClass("hidden");
	}
	else
	{
		$("#"+toAmountElement).removeClass("hidden");
		$("#"+toAmountElement).parent().find(".frmLabel").removeClass("hidden");
		$("#"+fromAmountElement).removeClass("hidden");
		
	}
}

function hideToDate(index)
{
	var elementID = "alertDetailBeans"+index+"dataOperator";
	var toDateElement = "alertDetailBeans"+index+"toDate";
	var fromDateElement = "alertDetailBeans"+index+"fromlabel .from-label";
	if("BETWEEN" !=$("#"+elementID+" option:selected").text())
	{
		$("#"+toDateElement).addClass("hidden");
		$("#"+toDateElement+"_icon").addClass("hidden");
		$("#"+toDateElement).parent().parent().find(".frmLabel").addClass("hidden");
		$("#"+fromDateElement).addClass("hidden");
	}
	else
	{
		$("#"+toDateElement).removeClass("hidden");
		$("#"+toDateElement+"_icon").removeClass("hidden");
		$("#"+toDateElement).parent().parent().find(".frmLabel").removeClass("hidden");
		$("#"+fromDateElement).removeClass("hidden");
	}
}
function paintCustomAlertActions(userMode)
{
	var elt = null, eltCancel = null, eltSave = null, eltUpdate = null;
	$('#custAlertActionButtonListLT,#custAlertActionButtonListRT, #custAlertActionButtonListLB, #custAlertActionButtonListRB')
			.empty();
	var strBtnLTLB = '#custAlertActionButtonListLT,#custAlertActionButtonListLB';
	var strBtnRTRB = '#custAlertActionButtonListRT,#custAlertActionButtonListRB';
	
	if(userMode ==='EDIT') {
		eltUpdate = createButton('btnUpdate', 'P', 'Update');
		eltUpdate.click(function() {
					submitAlertForm('updateCustomAlertMst.srvc','frmMain');
				});
		eltUpdate.bind('keydown',function() {
			autoFocusOnMsgBoxEnabledElement(event,'frmMain');
				});		
		eltUpdate.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	} else {
		eltSave = createButton('btnSave', 'P', 'Save');
		eltSave.click(function() {
					submitAlertForm('saveCustomAlertMst.srvc','frmMain');
				});
		eltSave.bind('keydown',function() {
			autoFocusOnMsgBoxEnabledElement(event,'frmMain');
		});		
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	eltCancel = createButton('btnCancel', 'S', 'Cancel');
	eltCancel.click(function() {
				 submitAlertForm('manageAlertCenter.srvc','frmMain');
			});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
}
function paintCustomAlertViewActions()
{
	var elt = null, eltCancel = null;
	$('#custAlertViewActionButtonListLT,#custAlertViewActionButtonListRT, #custAlertViewActionButtonListLB, #custAlertViewActionButtonListRB')
			.empty();
	var strBtnLTLB = '#custAlertViewActionButtonListLT,#custAlertViewActionButtonListLB';
	var strBtnRTRB = '#custAlertViewActionButtonListRT,#custAlertViewActionButtonListRB';
	if(pagemode == 'VIEW'){
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
					 submitForm('manageAlertCenter.srvc','frmMain');
				});
		eltCancel.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}else{
		eltCancel = createButton('btnCancel', 'S', 'Cancel');
		eltCancel.click(function() {
					 submitForm('manageAlertCenter.srvc','frmMain');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
	}
	
}
/*function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: (charIsPrimary === 'T'
				? 'ft-button ft-button-light'
				: 'ft-button-secondary');
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : 'ft-button' + strCls,
				'id' : 'button_' + btnKey,
				'value' : btnVal
			});
	return elt;
}*/
function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: 'ft-button-secondary';
	var elt = null;
	
	if(btnKey == 'btnSave'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-margin-l ft-button ' + strCls ,
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});		
	}
	else if(btnKey == 'btnCancel' && pagemode == 'VIEW'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-button-light',
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});		
	}
	else if(btnKey == 'btnCancel'){
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ft-button-light',
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});		
	}
	else{
		elt = $('<input>').attr({
			'type' : 'button',
			'tabindex' : 1,
			'class' : 'ft-button ' + strCls,
			'id' : 'button_' + btnKey,
			'value' : btnVal
		});
	}
		
	return elt;
}
function getMultiSeekHelp(elementId, inputId, strUrl, seekId, callerId, seekUrl, maxColumns, fptrCallback)
{
	var selectedValue = $("#detailBeans"+inputId+"dataKeyDisplayColumnName").val();
	var strValue='';
	var count = 0;
	var strAttr;
	var frm = document.forms["frmMain"];
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var parentElementArray = elementId.split("|");
	
	if(inputId != "")
	{
		var inputIdArray = inputId.split("|");	
		var json;
		var index;
		for (i=0; i < inputIdArray.length; i++)
		{
			json = inputIdArray[i].split(":");
			/*
			 * Element exist in the form
			 * e.g. product:bankProduct, here bankProduct exist as an element in
			 * the html form.
			 */
			if (document.getElementById( json[1]))
			{
				for(j=0; j < json.length; j++)
				{
					if (document.getElementById(json[j]) == null)
					{
						if (strValue == null)
							strValue = '"' + json[j] + '"' + ':' ;
						else	
							strValue = strValue + '"' + json[j] + '"' + ':' ;
					}	
					else
					{
						strValue = strValue + '"' + document.getElementById( json[j] ).value + '",'  ;
					}
				}
			}
			/*
			 * Element does not exist in the form so actual value is passed from model.
			 * e.g. product:${model.bankProduct}.
			 */
			else
			{
				strValue = strValue + '"' + json[0] + '":"' + json[1] + '",';
			}
		}
	}
	index = strValue.lastIndexOf(',');
	strValue = strValue.substring(0, index);
	myJSON='{'+ strValue +'}';
	
	document.getElementById("parentElementId").value = elementId;
	//document.getElementById("code").value = document.getElementById(parentElementArray[0]).value;
	document.getElementById("formName").value = seekId;
	document.getElementById("callerId").value = callerId;
	document.getElementById("seekInputs").value = myJSON;
	document.getElementById("seekUrl").value = seekUrl;
	if (document.getElementById("callback"))
		document.getElementById("callback").value = fptrCallback;
	if(document.getElementById("maxColumns"))
		document.getElementById("maxColumns").value = maxColumns;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";

	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getMessageBoxReport(recViewState,Screentype){
	var form = document.createElement('FORM');
	var strUrl = "services/getMessageBoxReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'viewState', recViewState));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'Screentype', Screentype));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function onFileSelect(element) {
   var fileName=element.value;
   fileName=fileName.replace(/.*[\/\\]/, '');
   element.title=fileName;
}


function validateLength(field){
	field.value = field.value.replace(/["$%&*;<>\^{}~=@#_`]/g,"");
	var fieldVal = field.value;
	var minLength = field.minLength;
	var maxLength =  $("#"+field.id).attr('fieldtype') == 9 ?  (field.maxLength - 3) :  field.maxLength;
	
if(fieldVal.length< minLength || fieldVal.length > maxLength){ 
	var errorMsg = 'Value for the field '+field.name+' should be between '+ minLength+" and "+ maxLength + " characters";
	paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',errorMsg);
}else{
			$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
		}
}
function paintError(errorDiv,errorMsgDiv,errorMsg){
		if(!isEmpty(errorMsg) && !$(errorDiv).is(':visible') ){
			$(errorDiv).removeClass('ui-helper-hidden');
		}
		element = $('<li class="error-msg-color">').text(errorMsg);
		$(errorMsgDiv).text(errorMsg);
		//element.appendTo(errorDiv);
}
function downloadFile(strFileName) {
	var frm = document.getElementById('frmMain');
	frm.target = "downloadWin";
	frm.method = "POST";
	frm.action = "services/downloadMessageformAttachment.srvc";
	$('input[name=messagefileName]').remove();
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
				'messagefileName', strFileName));
	frm.submit();
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('.'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}

function autoFocusOnMsgBoxEnabledElement(event, divId)
{
	if( typeof( event ) !== 'undefined' && event !== null )
	{
		var keyPressed = event.charCode || event.keyCode || event.which || 0;
		if(!event.shiftKey && keyPressed == 9)
		{
			event.preventDefault();
			var elm = $("#"+divId).find('[tabindex=1]:visible:not([readonly])');
			
			if(undefined != elm && elm.length >0 && undefined != elm[0])
			{
				if("DIV" === elm[0].localName || "div" === elm[0].localName )
				{
					elm[0].focus();
				}
				else
				{
					elm = $("#"+divId).find('[tabindex=1]:visible:not([disabled])')
					if(undefined != elm && elm.length > 0 && undefined != elm[0])
						elm[0].focus();
				}
			}
		}
	}
}

$(document).ready(function(){
	$("#chk_emailFlag, #chk_onScreenFlag, #chk_sMSFlag").keydown(function(e) {
		  if(e.keyCode == 32) {
			e.preventDefault();
		  }
		}); 
});