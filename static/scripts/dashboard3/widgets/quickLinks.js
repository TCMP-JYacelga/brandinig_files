let itemPerPage = 4;
var successMessageToaster = '<div id="message_form_toaster" class="toast" style="position: absolute; right: 0;" role="status" aria-live="polite" aria-atomic="true" data-delay="10000">'+
                         '<button type="button" class="mr-3 close" data-dismiss="toast" aria-label="Close">'+
                          '<span aria-hidden="true">&times;</span>'+
                          '</button>'+
                          '<div id="message_form_toaster_body" class="toast-body">'+
                          '<div class="row">'+
                          '<div class="col-2">'+
                          '<i class="material-icons align-middle">check_circle_outline</i>'+
                          '</div>'+
                          '<div class="col-10">'+
                          '<strong>Success!</strong>'+
                          '<div id="success_message" style="color: #4A4A4A;"></div>'+
                          '</div>'+
                          '</div>';

widgetMetaData.quickLink = function(widgetId, widgetType)
{
	let metadata = {

			  'title': getDashLabel('quickLink.title'),
			  'desc': getDashLabel('quickLink.desc'),
			  'type': 'card',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 1,
			  'subType': '',  
			  'icon':'<span class="material-icons"> account_balance </span>',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'actions' : {
                  'viewOptions' : {
                	  'fields': [
                	             { 
                	               'id': 'actionbtn_viewOption_small',
                	               'label': getDashLabel('quickLink.viewOption.small'),
                	                'value': '12',
                	                'imageName': imagePath + '/Small.svg',
                	                'callbacks' : {
                                        'click' : function(selectedCount){
                                            updateMaxItemCount(selectedCount);
                                            widgetMap[widgetId].api.refresh();
                                            $('#actionbtn_viewOption_small i').removeClass('d-none');
                                            $('#actionbtn_viewOption_medium i').addClass('d-none');
                                            $('#actionbtn_viewOption_large i').addClass('d-none');
                                         }
                                     }
                	            	 
                	             },
                	             {
                	               'id': 'actionbtn_viewOption_medium',
                  	               'label': getDashLabel('quickLink.viewOption.medium'),
                  	                'value': '6',
                  	                'imageName': imagePath + '/Medium.svg',
                  	                'callbacks' : {
                                          'click' : function(selectedCount){
                                              updateMaxItemCount(selectedCount);
                                              widgetMap[widgetId].api.refresh();
                                              $('#actionbtn_viewOption_small i').addClass('d-none');
                                              $('#actionbtn_viewOption_medium i').removeClass('d-none');
                                              $('#actionbtn_viewOption_large i').addClass('d-none');
                                           }
                                       } 
                	             },
                	             {
                  	               'id': 'actionbtn_viewOption_large',
                	               'label': getDashLabel('quickLink.viewOption.large'),
                	                'value': '4',
                	                'imageName': imagePath + '/Large.svg',
                	                'callbacks' : {
                                        'click' : function(selectedCount){
                                            updateMaxItemCount(selectedCount);
                                            widgetMap[widgetId].api.refresh();
                                            $('#actionbtn_viewOption_small i').addClass('d-none');
                                            $('#actionbtn_viewOption_medium i').addClass('d-none');
                                            $('#actionbtn_viewOption_large i').removeClass('d-none');
                                         }
                                     } 
                  	             }
                	             ],
                	  'callbacks' : {}
                      
				  },
				  'custom' : {
					  'title' : getDashLabel('quickLink.quickLinkSetting'),
					  'callbacks' : {
						  'click' : function(metaData){
							  $('#quicklink_setting').modal('show');
						  }
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
							  $('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');				  
							  getQuickLinkData(paintQuickLinkData, paintQuickLinkSettings, addData, metaData);
						  }
					  }
				  }
			  }
	}
	return metadata;
}

function getQuickLinkData(callback1, callback2, callback3, metadata){
	 $.ajax({
			type : 'POST',
			data :  [],
			url : rootUrl+'/services/getQuickLinkData',
			success : function(res) {
                                if(callback1 !== '')
				callback1(res, callback3, metadata);
				callback2(res);
			},
			error : function() {
				$('#'+metadata.target).html(getDashLabel('err.noData'));
			}
	 });
	
}

function paintQuickLinkData(res, addData, metaData) {
	let quickActionListArray = [];
	let favReports= [];
	$(res.root.favReports).each(function(index, favReport){
		favReports.push(favReport.reportCode);
	});
	$(res.root.selectedActionList).each(function(index, actionData){
		quickActionListArray.push({
		  'category' : 'actionList',
		  'title' : actionData.actionLinkName,
		  'url'   : 'gotoActionView(\''+actionData.actionLinkUrl+'\')',
                  'categoryIcon': '/QuickLink_ActionList.svg'
	    });
	});
	
	$(res.root.preferredReports).each(function(index, reportData){
	 if(favReports.indexOf(reportData.reportCode) > -1) {
		quickActionListArray.push({
		  'category' : 'report',
		  'title' : reportData.reportName,
		  'url'   : 'reportView(\''+reportData.reportCode+'\',\''+reportData.reportName+'\',\''+reportData.clientId+'\',\''+reportData.clientId+'\')',
                  'categoryIcon': '/QuickLink_Reports.svg'
	    });
	 }
	});	
	$(res.root.favMsgForm).each(function(index, msgData){
			if(msgData.recordKeyNo != null && msgData.recordKeyNo != '')
			{
				quickActionListArray.push({
					  'category' : 'messageForm',
					  'title' : msgData.formName,
					  'url'   : 'showComposeMessageForm(\'doComposeRightMenuMsg.srvc\',\''+msgData.recordKeyNo+'\',\''+ _strSeller+'\',\''+ strClient+'\',\''+ strClientDesc+'\', true)',
                      'categoryIcon': '/QuickLink_Messages.svg'
					  
			    });										
			}
	});
	
 	$(res.root.preferredQucikPay).each(function(index, quickPay){
				quickActionListArray.push({
					  'category' : 'quickPay',
					  'title' : quickPay.mypDescription,
					  'url'   : 'gotoQuickPayLink(\''+quickPay.mypProduct+'\', \''+quickPay.mypUseFor+'\', \''+index+'\',  \''+quickPay.quickPayViewState+'\', \''+quickPay.mypPayLayout+'\')',
                   	  'categoryIcon' : '/QuickLink_Payments.svg'
					  
			    });										
	});
 	$(res.root.preferredQuickPayTemplate).each(function(index, quickPay){ 
 		  var cloneUrl;
 		  if(quickPay.payMode== 'Q') cloneUrl='singlePaymentTemplateEntry.form';
 		  else  cloneUrl ='multiPaymentTemplateEntry.form';
 					quickActionListArray.push({
 						  'category' : 'quickPayTemplates',
 						  'title' : quickPay.referenceNo,
 						  'url'   : 'cloneRecordTemplates(\''+cloneUrl+ '\', \''+index+'\', \''+quickPay.viewState+'\', \''+quickPay.recordKeyNo+'\', \''+quickPay.mypPayLayout+'\', \''+quickPay.mypUseFor+'\', \''+quickPay.phdproduct+'\')',
 	                      'categoryIcon':'/QuickLink_Templates.svg'
 						  
 				    });										
 	});	
	if(usrDashboardPref && usrDashboardPref.widgets
	   && usrDashboardPref.widgets[metaData.widgetType]
	   && usrDashboardPref.widgets[metaData.widgetType].maxItemCount)
	{
		itemPerPage = usrDashboardPref.widgets[metaData.widgetType].maxItemCount;
	}
	
   let rowData = {};				   
   rowData.dataArray = [];
   
   let itemSlider = '<div id="quickLinkSlider" class="carousel slide" data-ride="carousel" data-interval="false">';
   let itemSliderindicators  = '<ol class="carousel-indicators">';
   
   let itemSliderInner = '<div class="carousel-inner">';   
   
   let itemSliderItem = '';
   let item = '';
   let itemCount = 0;
   let pageCount = 0;
   let itemClass = (itemPerPage == 12) ? 'quickLink-small' : 'quickLink-large';
   let initialsClass = (itemPerPage == 12) ? 'quicklink-initials-small' : 'quicklink-initials';
   let itemSeprationClass = (itemPerPage == 12)? 'col-md-3':'col-md-' + 12/(itemPerPage - (itemPerPage/2));
   $(quickActionListArray).each(function(index, data){
		if(itemCount == 0 || itemCount == itemPerPage)
		   {
			   let activeClass = (itemCount == 0) ? 'active' : '';
			   itemSliderItem += (itemCount == itemPerPage) ? '</div></div></div>' : '';
			   itemSliderItem += '<div class="carousel-item '+activeClass+'">';
			   itemSliderItem += '<div class="quickLink-section"><div class="row">'
			   itemCount = 0;
			   
			   if(pageCount == 0)
			   {
				  itemSliderindicators += '<li data-target="#quickLinkSlider" data-slide-to="'+pageCount+'" class="active"></li>';
			   }
			   else
			   {
				  itemSliderindicators += '<li data-target="#quickLinkSlider" data-slide-to="'+pageCount+'" class=""></li>';						   
			   }
			   pageCount++;
		   }	
           var initials = getCharacters(data.title);				   
		   itemSliderItem += '<div onclick="'+data.url+'" class="'+itemSeprationClass+' quickLink-item '+itemClass+'">';
		   itemSliderItem += '<div class="icon"><img src="' + imagePath + data.categoryIcon +'"><span class='+ initialsClass +'>'+initials +'</span></div>';
		   itemSliderItem += '<div class="label text-truncate">'+data.title+'</div>';
		   itemSliderItem += '</div>';		   
		   itemCount++;   
   });
   itemSliderItem += '</div></div></div>';
   itemSliderindicators += '</ol>';
   itemSliderInner += itemSliderItem + '</div>';
   itemSlider += itemSliderindicators + itemSliderInner + '</div>';
   
   rowData.dataArray.push(itemSlider);
				   
   addData(rowData, metaData);
   commonStringFormatting();
	
}

function updateMaxItemCount(selectedCount) {
	if(usrDashboardPref && !usrDashboardPref.widgets)
	{
		usrDashboardPref.widgets = {};
	}
	
	usrDashboardPref.widgets.quickLink = {
		'maxItemCount' : selectedCount
	}
    updateDashboardPref();
}

function getCharacters(word) {
  var chars='';
  if(word!= null) {
  var words = word.split(' ');
  if(words.length == 1)
   chars=words[0].charAt(0)+words[0].charAt(1);
  else
   chars = words[0].charAt(0) + words[1].charAt(0);
  }
  return chars;
}

function paintQuickLinkSettings(res) {
   // rendering Quicklinks settings pop up
	if(res && res.root)
	{
		if(res.root.selectedActionList) $('#quickActionListBadge').text(res.root.selectedActionList.length);
		if(res.root.preferredQucikPay && res.root.preferredQuickPayTemplate) $('#quickPayListBadge').text(Number(res.root.preferredQucikPay.length)+ Number(res.root.preferredQuickPayTemplate.length));
        if(res.root.preferredQucikPay && !res.root.preferredQuickPayTemplate) $('#quickPayListBadge').text(res.root.preferredQucikPay.length);
		if(!res.root.preferredQucikPay && res.root.preferredQuickPayTemplate) $('#quickPayListBadge').text(res.root.preferredQuickPayTemplate.length);								
		if(res.root.favMsgForm) $('#quickMsgFormListBadge').text(res.root.favMsgForm.length);

	    if(res.root.preferredReports) {
	        let favReports = [];
	        let preferredReports = [];
	        $(res.root.favReports).each(function(index, favReport){
	           favReports.push(favReport.reportCode);
	        });
	        $(res.root.preferredReports).each(function(index, reportData){
	         if(favReports.indexOf(reportData.reportCode) > -1) {
	             preferredReports.push(reportData.reportName);
	          }
	        });	
	         $('#quickReportListBadge').text(preferredReports.length);
	    }								
     }
   paintReports(res.root.favReports, res.root.preferredReports);
   paintQuickActionList(res.root.actionList, res.root.selectedActionList);
   paintQuickPayList(res.root.preferredQucikPay, res.root.preferredQuickPayTemplate);
   paintQuickMsgFormList(res.root.favMsgForm);
}

function cancelQuickLinkSettings() {
	$('.quickLink-modal-body').find('.loading-indicator').remove();
	getQuickLinkData('', paintQuickLinkSettings,'' ,'' );
}


function gotoActionView(strUrl) {
	let form = $('<form></form>');
    form.attr("method", "POST");
    form.attr("action", strUrl);
	
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", csrfTokenName);
	field1.attr("value", csrfTokenValue);

	//form.append(field1);
	
    $(document.body).append(form);
    form.submit();
};

function gotoReportView(strUrl) {
	let form = $('<form></form>');
    form.attr("method", "POST");
    form.attr("action", strUrl);
	
	var field1 = $('<input></input>');
	field1.attr("type", "hidden");
	field1.attr("name", csrfTokenName);
	field1.attr("value", csrfTokenValue);

	form.append(field1);
	
    $(document.body).append(form);
    form.submit();
};

function gotoQuickPayLink(mypProduct, mypbnkproduct, cntr, quickPayViewState,
		layout) {
			
	if (mypbnkproduct.charAt(0) == "B") {
		strUrl = "multiPaymentEntry.form";
		document.getElementById("qpisBatch").value = '1';
	} else if (mypbnkproduct.charAt(0) == "Q" || mypbnkproduct.charAt(0) == "M") {
		document.getElementById("qpisBatch").value = '2';
		strUrl = "singlePaymentEntry.form";
	}

    document.getElementById("qpmyProduct").value = mypProduct;
	document.getElementById("txtLayout").value = layout;
	document.getElementById("txtCode").value = mypProduct;
	document.getElementById("qppirMode").value = "LP";
	if (cntr != undefined)
		document.getElementById("qptxtCurrent").value = cntr;
	
    $("#txtMyProduct").val(mypProduct);	
			
	let form = $('#quickpaylistform');
    form.attr("method", "POST");
    form.attr("action", strUrl);
	
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", 'qlinkTemp');
	field.attr("value", 'true');

	form.append(field);
	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", 'qpviewState');
	field2.attr("value", quickPayViewState);

	form.append(field2);
	
	var field3 = $('<input></input>');
	field3.attr("type", "hidden");
	field3.attr("name", csrfTokenName);
	field3.attr("value", csrfTokenValue);

	form.append(field3);
	
	
    //$(document.body).append(form);
    form.submit();		
}

function reportView(reportCode, reportName, clientId, reportType,
		callerIdRepParam) {
			
	let form = $('<form></form>');
    form.attr("method", "POST");
    form.attr("action", 'showGenerateReportParam.srvc');
	
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", 'reportFileName');
	field.attr("value", reportName);

	form.append(field);
	
	var field = $('<input></input>');
	field.attr("type", "hidden");
	field.attr("name", 'reportCode');
	field.attr("value", reportCode);

	form.append(field);
	
	var field2 = $('<input></input>');
	field2.attr("type", "hidden");
	field2.attr("name", 'clientCode');
	field2.attr("value", clientId);

	form.append(field2);
	
	var field3 = $('<input></input>');
	field3.attr("type", "hidden");
	field3.attr("name", 'srcType');
	field3.attr("value", reportType);

	form.append(field3);
	
	var field4 = $('<input></input>');
	field4.attr("type", "hidden");
	field4.attr("name", csrfTokenName);
	field4.attr("value", csrfTokenValue);

	form.append(field4);
	
	
    $(document.body).append(form);
    form.submit();
}

function saveAllQuickLinks() {
	    $('.quickLink-modal-body').append('<div class="loading-indicator"></div>');
	    let strActionData = {};
		let actionListJSON = getActionListData();
		let reportsJson = getReportsData();
		let quickPaymentJSON = {};
		if(payEditRights == 'true')
			quickPaymentJSON = getQuickPaymentData();
		let messageFormsJSON = {};
		if(msgEditRights == 'true')
			messageFormsJSON = getMessageFormData();
		let quickReceivableJSON = {};
		if(colEditRights == 'true')
			quickReceivableJSON = getQuickReceivableData();

		strActionData[csrfTokenName] = csrfTokenValue;
		strActionData["actionListData"] = actionListJSON;
		strActionData["selectedReports"] = reportsJson;
		strActionData["quickPaymentData"] = quickPaymentJSON["selectedLinks"];
		strActionData["quickTemplateData"] = quickPaymentJSON["selectedLinksForTemplates"];
		strActionData["messageFormData"] = messageFormsJSON["selectedItems"];
		strActionData["quickReceivableData"] = quickReceivableJSON["selectedLinks"];
		strActionData["newDashboardWidgetData"] = JSON.stringify(usrDashboardPref);
		var quickLinkId;
		
		
		$.ajax({
			type : 'POST',
			async : false,
			data : strActionData,
			url : rootUrl+'/saveQuickLinkPref.rest?'+csrfTokenName+'='+csrfTokenValue,
			success : function(data) {
				$('.quickLink-modal-body').find('.loading-indicator').remove();
				$('#quicklink_setting').modal('hide');
				for (let property in widgetMap){
			          if(widgetMap[property].widgetType === 'quickLink')
			        	  quickLinkId = property;
				}
				widgetMap[quickLinkId].api.refresh();
			},
			error : function() {
				result = "error";
			}
		});	
}

function getActionListData() {
	var strActionData = {};
	var checkedCheckboxCount = 0;
	var arrItems = [];
	$("#quickActionListSection input:checkbox:checked").each(function() {
				arrItems[checkedCheckboxCount++] = $(this).val();
			});
	var myJSONText = JSON.stringify(arrItems);
	return myJSONText;
}

function getReportsData() {
	var checkedCheckboxCount = 0;
	var arrItems = [];
	$("#quickReportListSection input:checkbox:checked").each(function() {
				arrItems[checkedCheckboxCount++] = $(this).val();
			});
	var myJSONText = JSON.stringify(arrItems);
	return myJSONText;
	
}

function getQuickPaymentData() {
	var strData = {};
	var quickPayListSection_product = [];
	var quickPayListSection_template = [];
	
	$("#quickPayListSection_product input:checkbox:checked").each(function() {
		quickPayListSection_product.push($(this).val());
	});
	
	strData['selectedLinks'] = JSON.stringify(quickPayListSection_product);
	
	$("#quickPayListSection_template input:checkbox:checked").each(function() {
		quickPayListSection_template.push($(this).val());
	});
	
	strData['selectedLinksForTemplates'] = JSON.stringify(quickPayListSection_template);

	return strData;
}

function getMessageFormData() {
	var strMessageFormData = {};
	
	var quickMsgFormListSection = [];
	
	$("#quickMsgFormListSection input:checkbox:checked").each(function() {
		quickMsgFormListSection.push($(this).val());
	});
	
	strMessageFormData['selectedItems'] = JSON.stringify(quickMsgFormListSection);
	
	
	return strMessageFormData;
}

function getQuickReceivableData() {
	var strData = {};

	var quickReceivableListSection = [];
	
	$("#quickReceivableListSection input:checkbox:checked").each(function() {
		quickReceivableListSection.push($(this).val());
	});
	
	strData['selectedLinks'] = JSON.stringify(quickReceivableListSection);
	
	return strData;
}

function paintReports(reports, selectedReports){
	$('#quickReportListSection #reports').empty();	
	var selectedReportsList = [];
	$(selectedReports).each(function(index, data) {
		selectedReportsList.push(data.reportCode);	
	});
	$(reports).each(function(index, data) {
		let isChecked = (selectedReportsList.indexOf(data.reportCode) > -1) ? 'checked="true"' : '';
		let reportsListItem = '<div class="col-md-4"><div class="custom-control custom-checkbox">';
		reportsListItem += '<input class="custom-control-input"' + isChecked + 'type="checkbox" value="'+ data.reportCode +'" id="'+data.reportCode+'">';
		reportsListItem += '<label class="custom-control-label" for="'+data.reportCode+'">';
		reportsListItem += data.reportName;
		reportsListItem += '</label>';
		reportsListItem += '</div></div>';
		$('#quickReportListSection #reports').append(reportsListItem);
	});
}

function cloneRecordTemplates(strUrl, cntr, quickPayTemplatesViewState,
		strRecordKeyNo, layout, mypUseFor,myProduct) {

	document.getElementById("txtLayout").value = layout;
	document.getElementById("txtIdentifier").value = quickPayTemplatesViewState;
	document.getElementById("txtMyProduct").value = myProduct;
	if (cntr != undefined)
		document.getElementById("qptxtIndex").value = cntr;
	if ('B' == mypUseFor)
		strUrl = 'multiPaymentTemplateEntry.form';
	else if ('Q' == mypUseFor)
		strUrl = 'singlePaymentTemplateEntry.form';

	let form = $('#quickpaylistform');

	var entryType = document.createElement("input");
	entryType.setAttribute("type", "hidden");
	entryType.setAttribute("id", "txtEntryType");
	entryType.setAttribute("name", "txtEntryType");
	entryType.setAttribute("value", "PAYMENT");

	var txtIdentifier = document.createElement("input");
	txtIdentifier.setAttribute("type", "hidden");
	txtIdentifier.setAttribute("id", "txtIdentifier");
	txtIdentifier.setAttribute("name", "txtIdentifier");
	txtIdentifier.setAttribute("value", quickPayTemplatesViewState);
	
	var csrfToken = $('<input></input>');
	csrfToken.attr("type", "hidden");
	csrfToken.attr("name", csrfTokenName);
	csrfToken.attr("value", csrfTokenValue);
	
	form.append(txtIdentifier);
	form.append(entryType);
	form.append(csrfToken);

	form.attr("method", "POST");
    form.attr("action", strUrl);
	form.attr("target", "");
	form.submit();
}

function showComposeMessageForm(strUrl,formRecordKey,sellerCode,clientCode,clientDesc,isInvokedFromRightMenu) {
	if(formRecordKey == null || formRecordKey == '')
	{
		showErrorMessage();
	}
	else
	{ 
        document.getElementById("formRecordKey").value=formRecordKey;
		if (isInvokedFromRightMenu) {
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
					success : function( data )
					{
					  $('#screenType_other').empty();
					   $('#screenType_0').empty();
					   $('#screenType_other').addClass('d-none');
						//open the modal
					  $('#form_message').text(data.messageFormMstBean.formName);
					  $('#to').text(data.messageFormMstBean.formDestinationDesc);
					  $('#messageInboxComposeMessage').modal('show');
					  $('#send_date').text(data.SELLER_TIME);
					  if(data.messageFormMstBean.screenType === 0)
					  {
						   messageFormType0(data.messageFormMstBean);
						  $('#screenType_0').removeClass('d-none');
					  }
					  else if(data.messageFormMstBean.screenType === 2)
						  $('#screenType_2').removeClass('d-none');
					  else
					  {
						  $(data.messageFormDtlBean).each(function(index, message_dtl){
							  createDynamicElement(message_dtl);
						});
						$('#screenType_other').removeClass('d-none');
					  }
					  createBankInformation(data);
					  if($( "input[fieldtype='9']")!= undefined){
					  	  $( "input[fieldtype='9']" ).toArray().forEach(function(value,index,array) {
					  	  	var maxLength =($("#"+value.id).attr('maxlength')) ? ($("#"+value.id).attr('maxlength') ):16;
					  	  	$("#"+value.id).autoNumeric("init",
					  			{
					  				aSep : _strGroupSeparator ? _strGroupSeparator : ',', 
									aDec : _strDecimalSeparator ? _strDecimalSeparator : '.', 
									mDec : _strAmountMinFraction ? _strAmountMinFraction : '2', 
									vMin : 0,
									wEmpty : 'zero'				  			
						       });
							});
					     }
					  if($( "input[data-provide='datepicker']")!= undefined){
				      $("#messageInboxComposeMessage").find("input[data-provide='datepicker']").each(function()
	                      {
	                         id= $(this).attr("id"); 
	                         $('#'+id).datepicker({dateFormat: 'dd/mm/yy'});
	                      });
					    }
					}
				});
			
		}
		
	}
	
}

function createDynamicElement(message_dtl)
{
	var inputEle;
	if(message_dtl.fieldName !== '*')
	  {
	   var label = document.createElement('label');
	   label.className = message_dtl.fieldRequired + ' label-form-input';
	   label.innerText = message_dtl.fieldName;
	   $('#screenType_other').append(label);
	  }
	 let maindiv = document.createElement('div');
	 let div = document.createElement('div');
	 div.className="form-group messageForms-input";
	 div.style="float:left;width: 90%;";
	 div.appendChild(label);
	 
	 let disclaimerdiv = document.createElement('div');
	     disclaimerdiv.style="float:left;width: 10%;";
	 let disclaimer = document.createElement('i');
	 disclaimer.className = 'material-icons align-middle';
	 disclaimer.setAttribute('style', 'font-size:16px');
	 disclaimer.innerText = 'info';
	 var id = message_dtl.fieldName.replace(' ', '_')+ '_' + getNextUniqueId();
	switch(message_dtl.fieldType)
	{
	case 1: inputEle = document.createElement('input');
	          inputEle.setAttribute('type','text');
	          inputEle.setAttribute('id', id);
	          inputEle.setAttribute('name',message_dtl.fieldName);
	          inputEle.setAttribute('fieldId',message_dtl.fieldName);
	          inputEle.setAttribute('class','form-control col-sm-12');
	          inputEle.setAttribute('maxlength',message_dtl.fieldMaxLength);
	          inputEle.setAttribute('value','');
	          inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') + ' ' + message_dtl.fieldName);
	          inputEle.setAttribute('tag', message_dtl.fieldRequired);
	          inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
	          inputEle.setAttribute('minlength',message_dtl.fieldMinLength);
	          inputEle.setAttribute('onblur', 'validateLength(this);');
			  inputEle.setAttribute('style', 'width:100%;display:inline-block');
			  div.appendChild(inputEle);
			   if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			   maindiv.appendChild(div);
			   maindiv.appendChild(disclaimerdiv);
	          $('#screenType_other').append(maindiv);
	          break;
	          
	case 2:inputEle = document.createElement('textarea');
		    inputEle.setAttribute('rows','2');
		    inputEle.setAttribute('cols','50');
		    inputEle.setAttribute('id', id);
		    inputEle.setAttribute('name',message_dtl.fieldName);
		    inputEle.setAttribute('fieldId',message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
		    inputEle.setAttribute('maxlength',message_dtl.fieldMaxLength);
		    inputEle.setAttribute('value','');
		    inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') + ' ' +  message_dtl.fieldName);
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
		    inputEle.setAttribute('minlength',message_dtl.fieldMinLength);
		    inputEle.setAttribute('onblur', 'validateLength(this);');
			inputEle.setAttribute('style', 'width:100%;display:inline-block');
		    div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
		    break;
		    
	case 3:inputEle = document.createElement('input');
		    inputEle.setAttribute('type','text');
		    inputEle.setAttribute('id', 'txt' + id);
		    inputEle.setAttribute('name','txt' + message_dtl.fieldSequence);
		    inputEle.setAttribute('fieldId',message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
		    inputEle.setAttribute('maxlength',message_dtl.fieldMaxLength);
		    inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') + ' ' +  message_dtl.fieldName);
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
		    inputEle.setAttribute('minlength',message_dtl.fieldMinLength);
		    inputEle.setAttribute('data-provide', 'datepicker');
		    inputEle.setAttribute('style', 'width:100%;display:inline-block');
		    div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
               
	        $('#txt'+id).click(function(){
                 $('#txt'+id).datepicker({dateFormat: 'dd/mm/yy'});
                  });
            break;
            
	case 4:inputEle = document.createElement('input');
		    inputEle.setAttribute('type','text');
		    inputEle.setAttribute('id', id);
		    inputEle.setAttribute('name',message_dtl.fieldName);
		    inputEle.setAttribute('fieldId', message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
		    inputEle.setAttribute('maxlength',message_dtl.fieldMaxLength);
			inputEle.setAttribute('minlength',message_dtl.fieldMinLength);
		    inputEle.setAttribute('value','');
		    inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') +' ' +  message_dtl.fieldName);
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
			inputEle.setAttribute('style', 'width:100%;display:inline-block');
		    div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			 
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
            break;
            
	case 5:inputEle = document.createElement('input');
		    inputEle.setAttribute('type','text');
		    inputEle.setAttribute('id', id);
		    inputEle.setAttribute('name',message_dtl.fieldName);
		    inputEle.setAttribute('fieldId',message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
		    inputEle.setAttribute('maxlength',message_dtl.fieldMaxLength);
			inputEle.setAttribute('minlength', message_dtl.fieldMinLength);
		    inputEle.setAttribute('value','');
		    inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') + ' ' +  message_dtl.fieldName);
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
		    inputEle.setAttribute('onkeypress','return event.charCode >= 48 && event.charCode <= 57');
		    inputEle.setAttribute('onblur', 'validateLength(this);');
			inputEle.setAttribute('style', 'width:100%;display:inline-block');
		    div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			 
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
		    break;
		    
	case 6: let radioList = message_dtl.fieldValueList.split(',');
	          $(radioList).each(function(index, radioValue){
		      var radioDiv = document.createElement('div');
                          radioDiv.setAttribute('class','radio');
                	  var label = document.createElement('label');
        	          label.setAttribute('class','radio-inline');
        	          var inputElement = document.createElement('input');
        	          inputElement.setAttribute('type', 'radio');
        	          inputElement.setAttribute('id', id);
        	          inputElement.setAttribute('name', message_dtl.fieldName);
        	          inputElement.setAttribute('fieldRecordKey', message_dtl.recordKeyNo);
        	          inputElement.setAttribute('fieldId', message_dtl.fieldName);
        	          inputElement.setAttribute('tag', message_dtl.fieldRequired);
        	          inputElement.setAttribute('value', radioValue);
        			  inputElement.setAttribute('title', getDashLabel('quickLink.messageForms.pleaseSelect') + ' ' +  message_dtl.fieldName);
        	          label.appendChild(inputElement);
        	          label.append(radioValue);
                          radioDiv.append(label);
        	          div.appendChild(radioDiv);
        			  if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
        			   {
        				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
        				   disclaimerdiv.appendChild(disclaimer);
        			   }
                   });
	          maindiv.appendChild(div);
              maindiv.appendChild(disclaimerdiv);
             $('#screenType_other').append(maindiv);
                   break;
	case 7:let chkList = message_dtl.fieldValueList.split(',');
                  	$(chkList).each(function(index, checkBoxValue){
	        	var checkBoxDiv = document.createElement('div');
                          checkBoxDiv .setAttribute('class','checkbox');
                     let label = document.createElement('label');
		          label.setAttribute('class','checkbox-inline');
		          let inputElement = document.createElement('input');
		          inputElement.setAttribute('type', 'checkbox');
		          inputElement.setAttribute('id', id);
		          inputElement.setAttribute('name', message_dtl.fieldName);
		          inputElement.setAttribute('fieldRecordKey', message_dtl.recordKeyNo);
		          inputElement.setAttribute('fieldId', message_dtl.fieldName);
		          inputElement.setAttribute('tag', message_dtl.fieldRequired);
		          inputElement.setAttribute('value', checkBoxValue);
				  inputElement.setAttribute('title', getDashLabel('quickLink.messageForms.pleaseSelect') +' ' +  message_dtl.fieldName);
		          label.appendChild(inputElement);
                  label.append(checkBoxValue);
                  checkBoxDiv.append(label);

				  div.appendChild(checkBoxDiv);
				  if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
				   {
					   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
					   disclaimerdiv.appendChild(disclaimer);
				   }
                     });
                  	 maindiv.appendChild(div);
                     maindiv.appendChild(disclaimerdiv);
                    $('#screenType_other').append(maindiv);
                  break;
	case 8:let selectList = message_dtl.fieldValueList.split(',');
	         let selectEle = document.createElement('select');
	         selectEle.setAttribute('id', id);
	         selectEle.setAttribute('name', message_dtl.fieldName);
	         selectEle.setAttribute('fieldRecordKey', message_dtl.recordKeyNo);
	         selectEle.setAttribute('fieldId', message_dtl.fieldName);
	         selectEle.setAttribute('class','form-control col-sm-12');
			 selectEle.setAttribute('tag', message_dtl.fieldRequired);
			 selectEle.setAttribute('style', 'width:100%;display:inline-block');
	         let option = document.createElement('option');
		     $(selectList).each(function(index, selectValue){
		   	 let option = document.createElement('option');
		   	     option.setAttribute('value', selectValue);
		   	     option.append(selectValue);
		   	     selectEle.appendChild(option);
		    });
	     		div.appendChild(selectEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
		    break;
	case 9:inputEle = document.createElement('input');
		    inputEle.setAttribute('type','text');
		    inputEle.setAttribute('id', id);
		    inputEle.setAttribute('name',message_dtl.fieldName);
		    inputEle.setAttribute('fieldId', message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
			inputEle.setAttribute('minlength',message_dtl.fieldMinLength);
		    inputEle.setAttribute('maxlength',(message_dtl.fieldMaxLength!='')?(message_dtl.fieldMaxLength+5) : '18' );
		    inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') +' ' +  message_dtl.fieldName);
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
			inputEle.setAttribute('value', '0.0000');
			inputEle.setAttribute('fieldType', message_dtl.fieldType);
		    inputEle.setAttribute('onblur', 'validateLength(this);');
			inputEle.setAttribute('style', 'width:100%;display:inline-block');
			div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			 
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
		    break;
		    
	case 10:inputEle = document.createElement('input');
		    inputEle.setAttribute('type','file');
		    inputEle.setAttribute('id', id);
		    inputEle.setAttribute('name',message_dtl.fieldName);
		    inputEle.setAttribute('fieldId',message_dtl.fieldName);
		    inputEle.setAttribute('class','form-control col-sm-12');
		    inputEle.setAttribute('tag', message_dtl.fieldRequired);
		    inputEle.setAttribute('fieldRecordKey',message_dtl.recordKeyNo);
			inputEle.setAttribute('title',getDashLabel('quickLink.messageForms.pleaseEnter') + ' ' +  message_dtl.fieldName);
			inputEle.setAttribute('style', 'width:100%;display:inline-block');
		    div.appendChild(inputEle);
			if(message_dtl.fieldDisclaimerText != '' && message_dtl.fieldDisclaimerText != undefined)
			   {
				   disclaimer.setAttribute('title', message_dtl.fieldDisclaimerText);
				   disclaimerdiv.appendChild(disclaimer);
			   }
			
			 maindiv.appendChild(div);
             maindiv.appendChild(disclaimerdiv);
            $('#screenType_other').append(maindiv);
		    break;
	}
}

function messageFormType0(messageFormMstBean)
{
	let div1= document.createElement('div');
	div1.className = "form-group messageForms-input";
	
	let label1 = document.createElement('label');
	label1.className = "required label-form-input";
	label1.setAttribute('for', 'subjectLbl');
	label1.innerText = getDashLabel('quickLink.message.subject');
	
	let inputSubject = document.createElement('input');
	inputSubject.className = "form-control";
	inputSubject.setAttribute('type', 'text');
	inputSubject.setAttribute('id', 'messageSubject');
	inputSubject.setAttribute('tag', 'Y');
	inputSubject.setAttribute('fieldId', 'Subject');
	inputSubject.setAttribute('maxlength', '50');
	inputSubject.setAttribute('value', '');
	inputSubject.setAttribute('fieldRecordKey', messageFormMstBean.recordKeyNo);
	
	div1.appendChild(label1);
	div1.appendChild(inputSubject);
	
	let div2= document.createElement('div');
	div2.className = "form-group messageForms-input";
	
	let label2 = document.createElement('label');
	label2.className = "required label-form-input";
	label2.setAttribute('for', 'messageBodyLbl');
	label2.innerText = getDashLabel('quickLink.message.messageBody');
	
	let textArea = document.createElement('textarea');
	textArea.className = "form-control";
	textArea.setAttribute('id', 'messageBody');
	textArea.setAttribute('tag', 'Y');
	textArea.setAttribute('style', 'overflow: auto; resize: none;');
	textArea.setAttribute('fieldId', 'Message Body');
	textArea.setAttribute('maxlength', '2000');
	textArea.setAttribute('rows', '10');
	textArea.setAttribute('cols', '140');
	textArea.setAttribute('fieldRecordKey', messageFormMstBean.recordKeyNo);
	
	div2.appendChild(label2);
	div2.appendChild(textArea);
	
	$('#screenType_0').append(div1);
	$('#screenType_0').append(div2);
}

function createBankInformation(data){
    var messageFormMstBean = data.messageFormMstBean;
	let label, div, iframe, bankDiv;
        bankDiv = document.createElement('div');
        bankDiv.className = 'messageForms-input';
        bankDiv.style = 'padding:15px 15px;';
	$('#bankInformationDiv').empty();
	if(messageFormMstBean.screenType == 1)
		{
		 label = document.createElement('label');
		 label.className = 'label-messageForms';
		 label.innerText = getDashLabel('messageForms.bankInformation');
		 bankDiv.appendChild(label);
		 if(messageFormMstBean.bankInfoType == 3)
			 {
				  if(data.isStatic == 'Y')
				  {
					  iframe = document.createElement('iframe');
					  iframe.setAttribute('width','100%');
					  iframe.setAttribute('height','380px');
					  iframe.setAttribute('src', data.custompage);
					  bankDiv.appendChild(iframe);
                      $('#bankInformationDiv').append(bankDiv);
				  }
				  if(data.isStatic == 'N')
				  {
					  $('#bankInformationDiv').load("../../${data.custompage}");
				  }
			 }
		 else
			 {
			 div = document.createElement('div');
			 div.setAttribute('id', 'bankInfoDiv');
			 div.setAttribute('class', 'content-messageForms');
			 div.innerText = (messageFormMstBean.bankInfoText)?messageFormMstBean.bankInfoText:'';
             bankDiv.appendChild(div);
			 $('#bankInformationDiv').append(bankDiv);
			 }
		 
		}
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
	 var strValue = null;
	 var formRecordKey = document.getElementById('formRecordKey').value;
	 var arrItems =$("#messageInboxComposeMessage").find('input[type=text],textarea,select,[type=file]');
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
	 $("#messageInboxComposeMessage input[type=checkbox]").each(function() {
			fieldId = $(this).attr("id");
			strName = $(this).attr("name");
			fieldRecordKey = $(this).attr("fieldRecordKey");
			if ($(this).is(":checked"))
				checkboxfieldCodes.push($(this).val());
			strValue = checkboxfieldCodes.join(', ');
		});
	 $("#messageInboxComposeMessage input[type=radio]").each(function()
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
	 formData.append("clientId", strClient);
	 formData.append(csrfTokenName,csrfTokenValue) ;
	 $.ajax({
					type : 'POST',
					data : formData,				
					url : "submitComposeMessage.popup",
					processData: false,
					contentType: false,				
					success : function(data) {
						TrackingNo = data.TrackingNo;
						exitComposeMessagePopup(TrackingNo);
					},
					error : function(request, status, error) {

					}   
	     });
	 strData = "";
}

function createJsonData(Field_Record_Key,Field_Name,Field_value)
{
	return {Field_Record_Key:Field_Record_Key,Field_Name:Field_Name,Field_value:Field_value} ;
}

function exitComposeMessagePopup(TrackingNo)
{ 
	$('#message_form_toaster').remove();
	$('.dash-body').append(successMessageToaster);
	$('#messageInboxComposeMessage').modal('hide')
	let data = getDashLabel('messageForms.sentmsg') + TrackingNo;
	$('#message_form_toaster_body #success_message').append(data);
	 $('#message_form_toaster').toast('show');
}
function validateLength(field){
	field.value = field.value.replace(/["$%&*;<>\^{}~=@#_`]/g,"");
	var fieldVal = field.value;
	var minLength = field.minLength;
	var maxLength =  $("#"+field.id).attr('fieldtype') == 9 ?  (field.maxLength - 3) :  field.maxLength;
	
	if(fieldVal.length< minLength || fieldVal.length > maxLength){ 
		var errorMsg = getDashLabel('quickLink.info.field.valuesAllowed');
		let error = {'id':field.id, 'error':errorMsg.replace('{0}', field.name).replace('{1}', minLength).replace('{2}', maxLength)};
		paintErrorMessage(error);
	}else{
	       $('#'+field.id).parent().find('.error-div').remove();
               $('#'+field.id).parent().removeClass('error-background');
               $('#'+field.id).removeClass('error-border');

	}
}

function paintErrorMessage(errorMsg){
      $('#'+errorMsg.id).parent().find('.error-div').remove();
      let errorDiv = document.createElement('div');
      if(_strUserLocale=="ar_BH")
	    {
	   		 errorDiv.setAttribute('class', 'error-div-rtl');
	    }
	    else
	    {
	    	errorDiv.setAttribute('class', 'error-div');
	    }
      errorDiv.innerHTML= errorMsg.error.trim();
      $('#'+errorMsg.id).parent().append(errorDiv);
        $('#'+errorMsg.id).addClass('error-border');
      $('#'+errorMsg.id).parent().addClass('error-background');               
}

function verifyMessage()
{
	var errorFlag = false ;
	var fieldRequired ;
	var checkBoxFieldRequired ;
	var value ;
	var fieldId, id ;
	var datavalid=new Array();
	var checkboxId ;
	var radioButtonId ;
	var radibbuttonArray=[];
	var radibbuttonReqArray=new Array();
	var checkBoxArray=new Array();
	var checkBoxReqArray=new Array();
	var checkedCount=0;
	var fldMinlength, fildMaxlength;
	$('#messageInboxComposeMessage div.error-background').each(function() {
        $(this).removeClass('error-background');
      });
	$("#messageInboxComposeMessage").find('input[type=text],input[type=hidden],textarea,select,[type=file]').each(function()
	 {
		fieldId = $(this).attr("fieldId");
        id= $(this).attr("id");
		fieldRequired=$(this).attr("tag");
		value = $(this).val();
	  	value=(value!='') ? value.trim() : value;
	  	fldMinlength = $(this).attr("minlength");
	  	fldMaxlength = $(this).attr("maxlength");
		if($(this).attr("type")=="text" || $(this).prop("tagName").toUpperCase() === "TEXTAREA" )
		 {
		  	if (fieldRequired.trim()!="" && value.trim()=="")
		  	{
		  		datavalid.push({'id':id, 'error':getDashLabel('pleaseEnterValid')+ ' ' +fieldId});
		  	}
		  	if(value != '' && fieldRequired.trim()!="")
		  	{
		  	  if($(this).attr("minlength") !='' && value.length < fldMinlength){
	                let errorMsg = getDashLabel('quickLink.error.minLengthAllowed');
	                datavalid.push({'id':id, 'error':errorMsg.replace('{0}', fieldId).replace('{1}', fldMinlength)});
	            }
	            if($(this).attr("maxlength")!='' && value.length > fildMaxlength){
	                let errorMsg = getDashLabel('quickLink.error.maxLengthAllowed');
	                datavalid.push({'id':id, 'error':errorMsg.replace('{0}', fieldId).replace('{1}', fldMaxlength)});
	            }
		  	}
		 }
		else if($(this).attr("type")=="file")
		{
		
			if (fieldRequired.trim()!="" && value.trim()=="")
		  	{
		  		datavalid.push({'id':id, 'error':getDashLabel("quickLink.error.selectValidFeild")+" "+fieldId});
		  	}		
			if(undefined!=$('#'+id)[0].files[0])
			{
				var size = $('#'+id)[0].files[0].size;			
				if(size <1)
				{
						datavalid.push({'id':id, 'error':getDashLabel('quickLink.error.fileSizeZero')});
				}
				else if(size>5000000)
				{
						datavalid.push({'id':id, 'error':getDashLabel('quickLink.error.fileSizeMax')});
				}				
			}
		}	
		else if($(this).attr("type")=="select")
		{
			if (fieldRequired.trim()!="" && value.trim()=="")
		  	{
		  		datavalid.push({'id':id, 'error':getDashLabel("quickLink.error.selectValidFeild")+" "+fieldId});
		  	}
		}
	 });
	$("#messageInboxComposeMessage").find('input[type=checkbox]').each(function()
	{			
			if(checkboxId == 'undefined')
			{				
				checkBoxArray[checkBoxArray.length] = $(this).attr("fieldId");
				checkBoxReqArray[checkBoxReqArray.length] = $(this).attr("tag");						
			}			
			if(checkboxId!='undefined' && checkboxId!=$(this).attr("id"))
			{				
				checkBoxArray[checkBoxArray.length] = $(this).attr("fieldId");
				checkBoxReqArray[checkBoxReqArray.length] = $(this).attr("tag");
			}			
			checkboxId = $(this).attr("id");			
	 });
	$("#messageInboxComposeMessage").find('input[type=radio]').each(function()
		{							
			if(radioButtonId == 'undefined')
			{
				radibbuttonArray[radibbuttonArray.length] = $(this).attr("fieldId");
				radibbuttonReqArray[radibbuttonReqArray.length] = $(this).attr("tag");				
			}			
			if(radioButtonId!='undefined' && radioButtonId!=$(this).attr("id"))
			{
				radibbuttonArray[radibbuttonArray.length] = $(this).attr("fieldId");
				radibbuttonReqArray[radibbuttonReqArray.length] = $(this).attr("tag");
			}						
			radioButtonId = $(this).attr("id");			
	});	
	for(var i=0;i < radibbuttonArray.length;i++)
	{			
		var chks = document.getElementsByName(radibbuttonArray[i]);	
		if(radibbuttonReqArray[i]!='')
		{
			checkedCount=0;
			for(var j=0;j < chks.length;j++)
			{
				value = chks[j].checked ?1:0;
				checkedCount = checkedCount+value;
			}
			if(checkedCount==0)
			{
				datavalid.push({'id':radioButtonId, 'type':'radio', 'error':getDashLabel("quickLink.error.selectValidFeild")+" "+radibbuttonArray[i]});				
			}
		}
	}
	for(var i=0;i < checkBoxArray.length;i++)
	{	
		if(checkBoxReqArray[i]!='')
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
				datavalid.push({'id':checkboxId, 'type':'checkBox', 'error':getDashLabel("quickLink.error.selectOneValidFeild")+" "+checkBoxArray[i]});				
			}
		}
	}	
	if(datavalid.length == 0)
	{
        $('#messageInboxComposeMessage .error-div').remove();
		submitMessage();
	}
	else
	{
		 $('#messageInboxComposeMessage .error-div').remove();
         var r = 0;
		 for (r=0;r<datavalid.length;r++)
		 { 
          let errorDiv = document.createElement('div');
          errorDiv.setAttribute('class', 'error-div');
          errorDiv.innerHTML= datavalid[r].error.trim();
          if(datavalid[r].type== 'radio' || datavalid[r].type== 'checkBox') {
            $('#messageInboxComposeMessage #'+datavalid[r].id).parent().parent().parent().append(errorDiv);
            $('#messageInboxComposeMessage #'+datavalid[r].id).parent().parent().parent().addClass('error-background');
          } else {
	        $('#messageInboxComposeMessage #'+datavalid[r].id).parent().append(errorDiv);
	        $('#messageInboxComposeMessage #'+datavalid[r].id).parent().addClass('error-background'); }
	        $('#messageInboxComposeMessage #'+datavalid[r].id).addClass('error-border');          	
      	 }
 	}
}