/* Advance Filter Popup handling:start */
function showAdvanceFilterPopup() {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight:(screen.width) > 1024 ? 156 : 0,
		width : 845,
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : 'ft-dialog',
		/*
		 * buttons :[{ id: 'advFilterSearch', text:
		 * getLabel("btnSearch","Search"), click: function(){
		 * hideErrorPanel('#advancedFilterErrorDiv');
		 * $(document).trigger("searchActionClicked"); $(this).dialog("close"); }
		 * },{ id: 'advFilterSaveAndSearch', text:
		 * getLabel('btnSaveAndSearch','Save And Search'), click: function(){
		 * hideErrorPanel('#advancedFilterErrorDiv');
		 * $(document).trigger("saveAndSearchActionClicked"); } },{ id:
		 * 'advFilterClear', text: getLabel('btnClear','Clear'), click:
		 * function(){ hideErrorPanel('#advancedFilterErrorDiv');
		 * $(document).trigger("resetAllFieldsEvent"); } },{ id:
		 * 'advFilterCancel', text: getLabel('btnCancel','Cancel'), click:
		 * function(){ $(this).dialog("close"); } }],
		 */
		open : function() {
			hideErrorPanel('#advancedFilterErrorDiv');
			removeMarkRequired('#filterCode');
			$('#advancedFilterPopup').dialog('option', 'position', 'center');
			$('#paymentDueDateAdv').datepick({
				monthsToShow : 1,
				changeMonth : false,
				changeYear : false,
				rangeSeparator : '  to  ',
				onClose : function(dates) {
					if (!Ext.isEmpty(dates)) {
						$(document).trigger("datePickPopupSelectedDate",
								["paymentDueDateAdv", dates]);
					}
				}
			}).attr('readOnly', true);
			setDataToInvoiceNumber("#invoiceNumber");
			setObligationId("#obligationIdAct");
			//setStatusDropDownItems("#statusAdv");
			// filterGrid=createFilterGrid();
		}
	});
	$('#advancedFilterPopup').dialog("open");
	setTimeout(function() { autoFocusOnFirstElement(null, 'advancedFilterPopup', true); }, 50);
}

function paintError(errorDiv, errorMsgDiv, errorMsg) {
	if (!$(errorDiv).is(':visible')) {
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
function hideErrorPanel(errorDivId) {
	if ($(errorDivId).is(':visible')) {
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function setDataToInvoiceNumber(elementId) {
	$(elementId).autocomplete({
				minLength : 1,
				source : function(request, response) {
					var strUrl = 'services/userseek/invoiceNumberSeek.json';
					$.ajax({
								url : strUrl,
								type : 'POST',
								data : {
									$autofilter : request.term
								},
								success : function(data) {
									if (!isEmpty(data) && !(isEmpty(data.d))) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														value : item.CODE,
														label : item.CODE
													}
												}));
									}
								}
							});
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label
				+ '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
}

function setObligationId(elementId) {
	var strUrl;
	if (GranularPermissionFlag == 'Y')
		strUrl = 'services/userseek/obligationIdActIDGranularSeek.json';
	else
		strUrl = 'services/userseek/obligationIdActSeek.json';
	$(elementId).autocomplete({
				minLength : 1,
				source : function(request, response) {
					$.ajax({
								url : strUrl,
								type : 'POST',
								data : {
									$autofilter : request.term
								},
								success : function(data) {
									if (!isEmpty(data) && !(isEmpty(data.d))) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														value : item.CODE,
														label : item.DESCRIPTION
													}
												}));
									}
								}
							});
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label
				+ '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
}
function setStatusDropDownItems(elementId) {
	var el = $(elementId).multiselect();
	el.attr('multiple',true);
	var statusArray = arrLoanInvoiceStatus;
	for (var index = 0; index < statusArray.length; index++) {
		var opt = $('<option />', {
					value : statusArray[index].key,
					text : statusArray[index].value
				});
		//opt.attr('selected','selected');		
		opt.appendTo(elementId);
	}
	el.multiselect('refresh');
	filterStatusCount=statusArray.length;
}

function getAdvancedFilterValueJson(FilterCodeVal) {
	var objJson = {};
	var jsonArray = [];
	var invoiceNumber = $('#invoiceNumber').val();
	if (!isEmpty(invoiceNumber) && invoiceNumber != '%'
			&& invoiceNumber != 'All') {
		jsonArray.push({
					field : 'InvoiceNumber',
					operator : 'lk',
					value1 : encodeURIComponent(invoiceNumber.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}

	var ObligationIdAct = $('#obligationIdAct').val();
	if (!Ext.isEmpty(ObligationIdAct) && ObligationIdAct != '%'
			&& ObligationIdAct != 'All') {
		jsonArray.push({
					field : 'ObligationIdAct',
					operator : 'eq',
					value1 : encodeURIComponent(ObligationIdAct.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}

	if(!jQuery.isEmptyObject(selectedPaymentDueDate)){
		jsonArray.push({
					field : 'InvoiceDueDate',
					fieldLabel : getLabel('paymentDue', 'Payment Due Date'),
					operator : selectedPaymentDueDate.operator,
					value1 : Ext.util.Format.date(selectedPaymentDueDate.fromDate, 'Y-m-d'),
					value2 : (!Ext.isEmpty( selectedPaymentDueDate.toDate))? Ext.util.Format.date(selectedPaymentDueDate.toDate, 'Y-m-d'): '',
					dataType : 1,
					displayType : 6,
					dropdownLabel : selectedPaymentDueDate.dateLabel
				});
	}

	// Status
	var statusFilter = $("#statusAdv").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdv :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
	
	
			if (!Ext.isEmpty(tempStatusValue) && tempStatusValue != 'All') {
		jsonArray.push({
					field : 'Status',
							operator : 'in',
					value2 : '',
					fieldLabel : getLabel('lblstatus', 'Status'),
					displayValue1 : statusValueDesc,
							value1 : tempStatusValue,
					dataType : 0,
							displayType : 11
				});
		jsonArray.push({
					field : 'makerId',
					operator : 'ne',
					value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0
				});
	}
    }
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	return objJson;

}
function getAdvancedFilterQueryJson() {
	var objJson = {};
	var jsonArray = [];
	var invoiceNumber = $('#invoiceNumber').val();
	if (!isEmpty(invoiceNumber) && invoiceNumber != '%'
			&& invoiceNumber != 'All') {
		jsonArray.push({
					field : 'InvoiceNumber',
					fieldLabel : getLabel('invoiceNumber', 'Invoice No.'),
					operator : 'lk',
					value1 : encodeURIComponent(invoiceNumber.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}

	var ObligationIdAct = $('#obligationIdAct').val();
	if (!Ext.isEmpty(ObligationIdAct) && ObligationIdAct != '%'
			&& ObligationIdAct != 'All') {
		jsonArray.push({
					field : 'ObligationIdAct',
                    fieldLabel : getLabel('lblobligorID','Obligor ID'),
					operator : 'eq',
					value1 : encodeURIComponent(ObligationIdAct.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}

	
	if(!jQuery.isEmptyObject(selectedPaymentDueDate)){
		jsonArray.push({
					field : 'InvoiceDueDate',
					fieldLabel : getLabel('paymentDue', 'Payment Due Date'),
					operator : selectedPaymentDueDate.operator,
					paramIsMandatory : true,
					value1 : Ext.util.Format.date(selectedPaymentDueDate.fromDate, 'Y-m-d'),
					value2 : (!Ext.isEmpty( selectedPaymentDueDate.toDate))? Ext.util.Format.date(selectedPaymentDueDate.toDate, 'Y-m-d'): '',
					dataType : 1,
					displayType : 6,
					dropdownLabel : selectedPaymentDueDate.dateLabel
				});
	}

	// Status
	var statusFilter = $("#statusAdv").getMultiSelectValue();
	var statusValueDesc = [];
	$('#statusAdv :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});
	
	var statusValueString=statusFilter.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			 tempStatusValue=statusValueArray.join(',');
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
	
		if (!Ext.isEmpty(tempStatusValue) && tempStatusValue != 'All') {
				if (tempStatusValue == '0.A') {
				jsonArray.push({
							field : 'Status',
								operator : 'in',
								value1 : tempStatusValue,
							value2 : '',
								dataType : '0',
								displayType : 11,
							fieldLabel : getLabel('lblstatus', 'Status'),
							displayValue1 : statusValueDesc
						});

				jsonArray.push({
							field : 'makerId',
							operator : 'ne',
							value1 : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 0
						});
			} else {
				jsonArray.push({
							field : 'Status',
							operator : 'in',
							value1 : tempStatusValue,
							value2 : '',
							dataType : 'S',
							displayType : 5,
							fieldLabel : getLabel('lblstatus', 'Status'),
							displayValue1 : statusValueDesc
						});
			}
		}
    }
	objJson = jsonArray;
	return objJson;

}

function showFilterSeqAsPerPref(originalFilterOrder, filterGridStore) {
	var records = [];
	Ext.Ajax.request({
				url : 'userpreferences/invoiceGridFilter/gridViewAdvanceFilter.srvc?',
				headers: objHdrCsrfParams,
				async : false,
				method : "GET",
				success : function(response) {
					if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);

						if (responseData && responseData.preference) {
							var filtersObj = JSON
									.parse(responseData.preference);
							var filterNames = filtersObj.filters;
							if (Ext.isEmpty(filterNames)
									&& originalFilterOrder.length > 0) {
								filterNames = originalFilterOrder;
								for (var i = 0; i < filterNames.length; i++) {
									records.push({
												'filterName' : filterNames[i]
											});
								}
								filterGridStore.loadData(records);
							} else if (!Ext.isEmpty(filterNames)) {
								for (var i = 0; i < filterNames.length; i++) {
									var recPosition = $.inArray(filterNames[i],
											originalFilterOrder);
									if (recPosition > -1) {
										records.push({
													'filterName' : filterNames[i]
												});
										originalFilterOrder.splice(recPosition,
												1);
									}

								}
								for (var i = 0; i < originalFilterOrder.length; i++) {
									records.push({
												'filterName' : originalFilterOrder[i]
											});
								}
								filterGridStore.loadData(records);
							}
						}
					} else {
						for (var i = 0; i < originalFilterOrder.length; i++) {
							records.push({
										'filterName' : originalFilterOrder[i]
									});
						}
						filterGridStore.loadData(records);

					}
				},
				failure : function(response) {
					// console.log('Error Occured');
				}
			});
}

/* Advance Filter Grid:End */
/* Advance Filter Popup handling:end */

/* Loan Invoice View Info Popup handling :Start */
function showloanInvoiceInfoPopup(record) {
	$('#loanInvoiceViewInfoPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 860,
		modal : true,
		resizable: false,
		draggable: false,
		dialogClass: 'ux-dialog ft-dialog',
       open:function(){
    	   addDataToLoanInvoiceInfoPopUp(record);
       }
	});
	$('#loanInvoiceViewInfoPopup').dialog("open");
	$('#invoiceViewInfoBody').css('padding','0px 12px 12px 12px');
	$('#advFilterCancel').focus();
}
function closeloanInvoiceViewPopup() {
	$('#loanInvoiceViewInfoPopup').dialog("close");
}
function addDataToLoanInvoiceInfoPopUp(record) {

	if (record) {
		/*
		 * $('#viewLoanAccount').val(record.get('accountNumber'));
		 * $('#viewLoanAccountName').val(record.get( 'accountNumber' ));
		 * $('#viewInvoiceNumber').val(record.get( 'invoiceNumber' ));
		 * $('#viewDueDate').val(record.get( 'dueDate' ));
		 * $('#viewRouting').val(record.get( 'routingNumber' ));
		 * $('#viewCurrentAmountDue').val(record.get( 'amountDue' ));
		 * $('#viewPastAmountDue').val(record.get( 'amtPastDue' ));
		 * $('#viewTotalAmountDue').val(record.get( 'paidAmount' ));
		 * $('#identifier1').val(record.get( 'identifier' ));
		 */

		$('#viewLoanAccount').text(record.get('accountNumber'));
		$('#viewLoanAccountName').text(record.get('accountName'));
		$('#viewInvoiceNumber').text(record.get('invoiceNumber'));

		var time, makerStamp, dueDate;
		makerStamp = new Date(record.get('dueDate'));
		time = makerStamp.toLocaleTimeString();
		makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);
		//dueDate = makerStamp + ' ' + time;
		dueDate = makerStamp;

		$('#viewDueDate').text(dueDate);
		$('#viewRouting').text(record.get('routingNumber'));
		$('#viewCurrentAmountDue').text(record.get('amountDueDesc'));
		$('#viewPastAmountDue').text(record.get('amtPastDueDesc'));
		$('#viewTotalAmountDue').text(record.get('paidAmount'));
		$('#identifier1').text(record.get('identifier'));
		$('#viewObligationId').text(record.get('clientDesc'));
		$('#viewStatus').text(record.get('loanStatus'));
		
		$('#viewLoanAccount').prop('title', record.get('accountNumber'));
		$('#viewLoanAccountName').prop('title', record.get('accountName'));
		$('#viewInvoiceNumber').prop('title', record.get('invoiceNumber'));
		$('#viewDueDate').prop('title', dueDate);
		$('#viewRouting').prop('title', record.get('routingNumber'));
		$('#viewCurrentAmountDue').prop('title', record.get('amountDue'));
		$('#viewPastAmountDue').prop('title', record.get('amtPastDue'));
		$('#viewTotalAmountDue').prop('title', record.get('paidAmount'));
		$('#identifier1').prop('title', record.get('identifier'));
		$('#viewObligationId').prop('title', record.get('clientDesc'));
		$('#viewStatus').prop('title', record.get('loanStatus'));
		
	}

}
function showInvoiceReport() {
	var identifier1 = $('#identifier1').text();
	var reportType = 'loanInvoiceDetailReport';
	var strUrl = 'services/loanInvoice/getDynamicReport.pdf';
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN', '$reportType',
			reportType));
	form.appendChild(createFormField('INPUT', 'HIDDEN', '$identifier',
			identifier1));
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
function populateAdvancedFilterFieldValue() {
	setRequestDateDropDownMenu('paymentDateDropDown');
	setStatusDropDownItems("#statusAdv");
	setSavedFilterComboItems('#msSavedFilter');
}
function setSavedFilterComboItems(element) {
	$.ajax({
				url : 'services/userfilterslist/invoiceGridFilter.srvc',
				success : function(responseText) {
					if (responseText && responseText.d
							&& responseText.d.filters) {
						var responseData = responseText.d.filters;
						if (responseData.length > 0) {
							$.each(responseData, function(index, item) {
										$(element).append($('<option>', {
													value : responseData[index],
													text : responseData[index],
													selected : false
												}));
									});
						}
					}
					$(element).multiselect('refresh');
				}
			});
}
function setRequestDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'RequestDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "entryDateLabel",
							text:getLabel('lblPayDueDate', 'Payment Due Date'),
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(entry_date_opt === null)
												            	    		tip.update('Payment Due Date');
												            	    	else
												            	    		tip.update('Payment Due Date' + entry_date_opt);

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							id : 'requestDateButton',
							tabIndex :"1",
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus = createDateFilterMenu("entryDate", this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
								}
							}
						}
					]
		});
		return dropDownContainer;
}

function checkInfinity (intFilterDays)
{
	if(Ext.isEmpty(intFilterDays))
		{ 
			return true;
		}		
}

function createDateFilterMenu(filterType,buttonIns) {
	var me = this;
	var menu = null;
	var arrMenuItem = [];

	var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
	if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Today)");
					}
				});
	}
	if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Yesterday)");
					}
				});
	if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
				});
	if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					parent : this,
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				});
	if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
	{
		arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					parent : this,
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Month)");
					}
				});
	}
	if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Month To Date)");
					}
				});
	if (lastMonthOnlyFilter===true || me.checkInfinity(intFilterDays))
	{
				arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Month Only)");
						}
					});	
	}
	if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Quarter)");
					}
				});
	if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Quarter To Date)");
					}
				});
	if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					parent : this,
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Year)");
					}
				});
	if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
		arrMenuItem.push({
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					parent : this,
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Year To Date)");
					}
				});
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem,
		listeners : {
				hide:function(event) {
					this.addCls('ui-caret-dropdown');
					this.removeCls('action-down-hover');
				}
			}
	});
	return dropdownMenu;
}
function updateToolTip(filterType,date_option){
	if(filterType === 'entryDate')
		entry_date_opt = date_option;
}
/* Loan Invoice View Info Popup handling :End */