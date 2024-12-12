var amountOpLabel = getLabel('amount', 'Amount')+' ('+getLabel('equalTo','Equal To')+")";
var filterLabel = getDateDropDownLabesl(defaultFilterVal);
posting_date_opt = filterLabel;
value_date_opt = filterLabel;
$('label[for="PostingDateLabel"]').text( );
$('label[for="ValueDateLabel"]').text( );
var valueDateOpLabel = getLabel('valueDate', 'Value Date') + ' ('+ filterLabel +")";
function showAdvanceFilterPopup() {
	$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
	$('#nickNameTextField').removeClass('requiredField');
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight : (screen.width) > 1024 ? 156 : 0,
		width : 830,//440,
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : 'ft-tab-bar',
		position: {
            my: "center",
            at: "center",
            of: window
        },
		/*buttons : [{
			id : 'advFilterSave',
			text : 'Save',
			click : function() {
				var txtField = $("input[type='text'][id='nickNameTextField']").val();
				var btnLbl = $("#advFilterSave span").text();
				if(btnLbl=== 'Save')
					$(document).trigger("doHandleSaveClick",[txtField,'ADD']);
				else 
					$(document).trigger("doHandleSaveClick",[txtField,'Update']);			
			}
		 }, {
			id : 'advFilterCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		open : function() {
			$('#lblAccSetName').removeClass('required');
			$('#advancedFilterPopup').dialog('option', 'position', 'center');
			$('#faclilityFilter').empty();
				$("#tabs").tabs({
					select : function(event, tab) {
						if (tab.index == 0) {
							if (!$('#advancedFilterErrorDiv')
									.hasClass('ui-helper-hidden')) {
								$('#advancedFilterErrorDiv')
										.addClass('ui-helper-hidden');
							}
							$('#advFilterSave').hide();
							$('#advFilterCancel').hide();
							$('#advFilterClear').hide();
							$('#advFilterSearch').hide();
							$('#accFilterClose').show();
							var btnLabel=getLabel('lblSaveAndSearch', 'Save & Search');
							 $("#advFilterSave button").text( btnLabel);
							 $('#advancedFilterPopup').dialog('option', 'position', 'center');
						} else {
							$('#advFilterSave').show();
							$('#advFilterCancel').show();
							$('#advFilterClear').show();
							$('#advFilterSearch').show();
							$('#accFilterClose').hide();
							Ext.Ajax.request({
								url : 'services/balancesummary/'+summaryType+'/btruseraccounts.json?$calledFrom='+summaryType,
								method : 'GET',
								success : function(response) {
									var data = Ext.decode(response.responseText);
									var btruseraccounts = data.d.btruseraccount;
									if (!Ext.isEmpty(btruseraccounts))
										accountEntryGrid.getView().getStore().loadRawData(btruseraccounts);
									$('#advancedFilterPopup').dialog('option', 'position', 'center');
								},
								failure : function(response) {
									// console.log("Ajax Get account sets call failed");
								}

							});
							
							Ext.Ajax.request({
								url : 'services/userpreferences/'+strSummaryPageName+'/accountsets.json',
								method : 'GET',
								success : function(response) {
									var data = Ext.decode(response.responseText);
									var responseData = Ext.decode(data.preference);
									$('#msSavedFilter').empty();
									$('#msSavedFilter').append($('<option>', { 
										value: '',
										text : getLabel('select', 'Select'),
										selected : false
										}));
									if(responseData.length > 0){
										$.each(responseData,function(index,item){
											$('#msSavedFilter').append($('<option>', { 
												value: responseData[index].accountSetName,
												
                                                text : responseData[index].accountSetName + '(' + responseData[index].accounts.length + ')',
												selected : responseData[index].accountSetName === selectedFilter ? true : false
												}));
										});
									 }
									$('#msSavedFilter').multiselect('refresh');
								},
								failure : function(response) {
									// console.log("Ajax Get account sets call failed");
								}

							});
						}
					},
					show : function(e, ui) {
						if('undefined'!=filterGrid && !isEmpty(filterGrid))
							filterGrid.getView().refresh();
						if('undefined'!=accountEntryGrid && !isEmpty(accountEntryGrid)){
							accountEntryGrid.getView().refresh();		
						}
						$('#advancedFilterPopup').dialog('option', 'position', 'center');
					}
				});
				$("#tabs").barTabs();

				setStatusDropDownItems("#faclilityFilter");
			       $('#faclilityFilter').niceSelect();
			       $('#faclilityFilter').niceSelect('update');
			       $( "#currencyAutoComp" ).attr('value', '');
				   $( "#bankAutoComp" ).attr('value', '');
				   
				filterGrid = createFilterGrid();
				changeAdvancedFilterTab(1);
				assignSelectedValues();
				advancedFilterFieldsDataAdded = true;
		}
	});
	$('#advancedFilterPopup').dialog("open");
}
function assignSelectedValues(){
	$(document).trigger("showSelectedFilterPopup",[selectedFilter]);
}
function createFilterGrid() {
	$('#filterList').empty();
	$(document).trigger('loadAccountSetGrid');
}
function changeAdvancedFilterTab(index) {
	if (index == 0) {
		$('#advFilterSave').hide();
		$('#advFilterCancel').hide();
		$('#advFilterClear').hide();
		$('#advFilterSearch').hide();
		$('#accFilterClose').show();
	} else {
		$('#advFilterSave').show();
		$('#advFilterCancel').show();
		$('#advFilterClear').show();
		$('#advFilterSearch').show();
		$('#accFilterClose').hide();
	}
	$('#tabs').tabs("option", "selected", index);
}
function loadGrid()
{
	//$('#entrySetGridList').empty();
	//$('#errorPanelList').empty();
	$("#nickNameTextField").removeAttr("disabled", "disabled"); 
	$("#nickNameTextField").attr('value', '');
	$(document).trigger('loadAccountSetEntryGrid');
}
function setStatusDropDownItems(elementId) {
	var statusArray = new Array();
	var storeData = null;			
	Ext.Ajax.request({
						url : 'services/userseek/btrfacilitylist.json',
						method : 'POST',
						async : false,
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var arrayData = data.d.preferences;
							if (!Ext.isEmpty(data)) {
								storeData = arrayData;
							}
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}

					});
	var objStore = Ext.create('Ext.data.Store', {
						fields : ['CODE', 'DESCR'],
						data : storeData,
						reader : {
							type : 'json',
							root : 'preferences'
						}
					});
	var opt = $('<option />', {
						value : 'all',
						text  : getLabel('all','All')
					});
			opt.appendTo(elementId);
	for (var i = 0; i < storeData.length; i++) {
					var opt = $('<option />', {
										value : storeData[i].CODE,
										text  : getLabel(storeData[i].CODE,storeData[i].DESCR)
									});
							opt.appendTo(elementId);
				};
	
}
function filterFacility(obj)
{
	var objValue = obj.value;
	$(document).trigger("filterGridData",[objValue]);
}
function showTypeCodeSetPopup() {
	$('#typeCodeSetPopup').dialog({
		autoOpen : false,
		minWidth : 720,
		maxWidth : 735,
		minHeight : 0,
		maxHeight : 550,
		resizable : false,
		draggable : false,
		modal : true,
		dialogClass : 'ft-dialog',
		position: {
            my: "center",
            at: "center",
            of: window
        },
		open : function() {
			$('#typeCodeSetPopup').dialog('option', 'position', 'center');
			$('#typeCodeSetList').empty();
			$("#typeCodeTextField").removeAttr("disabled", "disabled"); 
			$("#typeCodeTextField").attr('value', '');
			if(Ext.isEmpty(filterEntryGrid)) {
				loadTypeCodeEntrySetGrid();
				if(Ext.isEmpty(selectedFilter)
					|| selectedFilter == 'all'
					|| selectedFilter == 'All'){
					filterEntryGrid.setLoading(true);
					populateTypeCodesInGrid(filterEntryGrid);
				}
			} else if(!Ext.isEmpty(filterEntryGrid)
				&& !Ext.isEmpty(selectedFilter)
				&& (selectedFilter == 'all' || selectedFilter == 'All')){
				filterEntryGrid.setLoading(true);
				populateTypeCodesInGrid(filterEntryGrid);
			} else if(!Ext.isEmpty(filterEntryGrid)
					&& Ext.isEmpty(selectedFilter)){
				filterEntryGrid.setLoading(true);
				populateTypeCodesInGrid(filterEntryGrid);
			}
			
			Ext.Ajax.request({
				url : 'services/userpreferences/'+strActivityPageName+'/transactionCategories.json',
				method : 'GET',
				success : function(response) {
					var data = null;
					if(!Ext.isEmpty(response)
							&& !Ext.isEmpty(response.responseText))
						data = Ext.decode(response.responseText);
						if(!Ext.isEmpty(data)
							&& !Ext.isEmpty(data.preference)){
							var responseData = Ext.decode(data.preference);
							$('#msSavedFilterTypeCode').empty();
							$('#msSavedFilterTypeCode').append($('<option>', {
								value: '',
								text : getLabel('select', 'Select'),
								selected : false
								}));
							if(responseData.length > 0){
								$.each(responseData,function(index){
									if(!Ext.isEmpty(responseData[index])
										&& !Ext.isEmpty(responseData[index].txnCategory)){
										$('#msSavedFilterTypeCode').append($('<option>', {
											value: responseData[index].typeCodes,
											text : responseData[index].txnCategory,
											selected : responseData[index].txnCategory === selectedFilter ? true : false
										}));
									}
								});
							}
							$('#msSavedFilterTypeCode').multiselect('refresh');
							if(selectedFilter){
								$(document).trigger("handleSavedTypeCodeFilterClick",[0]);
							}
						}
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}
				});
				advancedFilterFieldsDataAdded = true;
		}
	});
	$("#typeCodeSetErrorDiv").addClass("ui-helper-hidden");
    $("#typeCodeSetErrorMessage").text('');
	$('#typeCodeSetPopup').dialog("open");
}

function populateTypeCodesInGrid(filterEntryGrid){
	Ext.Ajax.request({
		url : 'services/userseek/typecodelist',
		method : 'POST',
		params : {
			$top : -1
		},
		success : function(response) {
			filterEntryGrid.setLoading(false);
			var data = Ext.decode(response.responseText);
			var arrTypeCodes = manageTypeCodeJsonObj(data.d.preferences);
			if (!Ext.isEmpty(arrTypeCodes)) {
				filterEntryGrid.getView().getStore().loadRawData(arrTypeCodes);
			}
			$('#typeCodeSetPopup').dialog('option', 'position', 'center');
		},
		failure : function(response) {
			// console.log("Ajax Get account sets call failed");
			filterEntryGrid.setLoading(false);
		}
	});
}
function manageTypeCodeJsonObj(jsonObject) {
	var jsonObj ='';
	if(jsonObject  instanceof Object ==false)
		jsonObj =JSON.parse(jsonObject);
	if(jsonObject  instanceof Array)
		jsonObj =jsonObject;
	for (var i = 0; i < jsonObj.length; i++) {
		jsonObj[i].DESCR =  getLabel(jsonObj[i].CODE,jsonObj[i].DESCR);
	}
	if(jsonObject  instanceof Object ==false)
		jsonObj = JSON.stringify(jsonObj)
	return jsonObj;
}
//function assignSelectedTypeCodeValues(){
//	$(document).trigger("showSelectedTypeCodeFilterPopup",[selectedFilter]);
//}
//function createTypeCodeSetGrid() {
//	$('#typeCodeSetList').empty();
//	$(document).trigger('loadTypeCodeSetGrid');
//}
//function changeTypeCodeSetTab(index) {
//	if (index == 0) {
//		$('#btnTypeSave').hide();
//		$('#btnTypeCancel').hide();
//		$('#btnTypeClose').show();
//	} else {
//		$('#btnTypeSave').show();
//		$('#btnTypeCancel').show();
//		$('#btnTypeClose').hide();
//	}
//	$('#typeCodetabs').tabs("option", "selected", index);
//	
//}
function loadTypeCodeEntrySetGrid()
{
	//$('#typeCodeSetEntryList').empty();
	//$('#typeCodeErrorPanelList').empty();
	$("#typeCodeTextField").removeAttr("disabled", "disabled"); 
	$("#typeCodeTextField").attr('value', '');
	$(document).trigger('loadTypeCodeSetEntryGrid');
}
function resetTypeCodeEntrySetGrid() {
	//if($('#typeCodetabs-2').hasClass('ui-tabs-hide')) {
		loadTypeCodeEntrySetGrid();
		filterEntryGrid.getView().select([], false);
	//}
}
function showActivityAdvanceFilterPopup(filterCode) {
	$('#activityAdvFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:450,
		width : 850,
		margin : '45px',
		tapPanelWidth : 650,
		modal : true,
		resizable: false,
		draggable: false,
		position    : "center",
		dialogClass : 'adv-filter-tabPanel-height ft-dialog',
		/*buttons : [{
			id : 'advFltrSearch',
			text : getLabel('search','Search'),
			click : function() {
				hideErrorPanel('#advancedFltrErrorDiv');
				$(document).trigger("searchActionClicked");
				$(this).dialog("close");
			}
		},{
			id : 'advFltrSaveAndSearch',
			text : getLabel('savensearch','Save And Search'),
			click : function() {
				hideErrorPanel('#advancedFltrErrorDiv');
				$(document).trigger("saveAndSearchActionClicked");
			}
		 }, {
			id : 'advFltrClear',
			text : getLabel('clear','Clear'),
			click : function() {
				hideErrorPanel('#advancedFltrErrorDiv');
				resetAllFields();
			}
		 },{
			id : 'advFltrCancel',
			text : getLabel('canel','Cancel'),
			click : function() {
				$(this).dialog("close");
			}
		}],*/
		open : function() {
//			$('#advFilterList').empty();
			$('#amountDropDown').empty();
			$('#postingDateDropDown').empty();
			//$('#valueDateDropDown').empty();
			$('#typeCodeSet').empty();
			
				setAmountDropDown("amountDropDown");
				setProcessingDateDropDownMenu("postingDateDropDown");
				//setValueDateDropDownMenu("valueDateDropDown");
				$("#typeCodeSet").niceSelect();
				$("#typeCodeSet").append($('<option />', {
					value : "",
					text : "All"
					}));
				setTypeCodeSetValues("typeCodeSet");
				$("#typeCodeSet").niceSelect('update');
				
				/*if(summaryType === 'previousday' && !Ext.isEmpty(defaultFilterVal) && filterObj){
					$('#postingDate').setDateRangePickerValue([filterObj.fieldValue1, filterObj.fieldValue2]);
					$('#valueDate').setDateRangePickerValue([filterObj.fieldValue1, filterObj.fieldValue2]);
					var filterLabel = getDateDropDownLabesl(defaultFilterVal);
					posting_date_opt = filterLabel;
					value_date_opt = filterLabel;
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate', 'Posting Date') +  filterLabel );
					$('label[for="ValueDateLabel"]').text(getLabel('valueDate', 'Value Date') +  filterLabel );


				}*/
				advancedFilterFieldsDataAdded = true;
				setSavedFilterComboItems("#msSavedFilterActivity");
				$('#msSavedFilterActivity').val(selectedFilter);
				setDataForPopup(selectedFilter);
				$("#msSavedFilterActivity").multiselect("refresh");
				
		}
	});
	$('#activityAdvFilterPopup').dialog("open");

}

function setDataForPopup(filter){
		$(document).trigger('handleActivitySavedFilterClick');
}
function changeAdvancedFltrTab(index) {
	if (index == 0) {
		$('#advFltrSearch').hide();
		$('#advFltrSaveAndSearch').hide();
		$('#advFltrCancel').hide();
	} else {
		$('#advFltrSearch').show();
		$('#advFltrSaveAndSearch').show();
		$('#advFltrCancel').show();
	}
	$('#advFltrtabs').tabs("option", "selected", index);
}
function setAmountDropDown(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'AmountContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "AmountLabel",
							text: amountOpLabel
						},{
							xtype : 'button',
							border : 0,
							itemId : 'amountTypeBtn',
							cls : 'ui-caret-dropdown',
							listeners : {
								render: function(c) {
				    	   			var tip = Ext.create('Ext.tip.ToolTip', {
				    	   							xtype : 'tooltip',
								            	    target: c.getEl(),
								            	    listeners:{
								            	    	beforeshow:function(tip){
								            	    		if(amountOpLabel === null)
									            	    		tip.update('Equal To');
									            	    	else
									            	    		tip.update(amountOpLabel);
										            	   }
								            	    }
				        			});
				       	},
								click:function(event){
										var menus=getAmountDropDownItems("amountField",this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
										//event.removeCls('ui-caret-dropdown'),
										event.addCls('action-down-hover');
								}
							}
						}
					]	
		});
		return dropDownContainer;
}

	

function getAmountDropDownItems(filterType,buttonIns){
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},	
		items : [{
					text : getLabel('lessThan','Less Than'),
					btnId : 'btnLt',
					btnValue : 'lt',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('greaterThan','Greater Than'),
					btnId : 'btnGt',
					btnValue : 'gt',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}, {
					text : getLabel('eqTo','Equal To'),
					btnId : 'btnEqTo',
					btnValue : 'eq',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}/*, {
					text : getLabel('amtRange','Amount Range'),
					btnId : 'btnAmtRange',
					btnValue : 'range',
					handler : function(btn, opts) {
						$(document).trigger("amountTypeChange",[filterType,btn,opts]);
					}
				}*/]
	});
	return dropdownMenu;
}
function setProcessingDateDropDownMenu(renderToElementId){
	if( summaryType == 'intraday')
		var postingDateOpLabel = getLabel('postingDate', 'Posting Date')
	else	
		var postingDateOpLabel = getLabel('postingDate', 'Posting Date') + ' ('+ filterLabel +")";
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'PostingDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "PostingDateLabel",
							text: postingDateOpLabel,
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
							    	   							xtype : 'tooltip',
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if( summaryType == 'intraday')
																		{	
																			tip.update(getLabel('postingDate', 'Posting Date'));
																		}	
																		else
																		{
												            	    		if(posting_date_opt === null)
													            	    		tip.update(getLabel('postingDate', 'Posting Date'));
													            	    	else
													            	    		tip.update(getLabel('postingDate', 'Posting Date')+
													            	    				' (' + posting_date_opt + ')');
																		}

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							itemId : 'postingDateBtn',
							cls : 'ui-caret-dropdown',
							hidden : summaryType === 'intraday' ? true : false,
							listeners : {
								click:function(event){
										if(summaryType !== 'intraday'){
											var menus=getDateDropDownItems("postingDate",this);
											var xy=event.getXY();
											menus.showAt(xy[0],xy[1]+16);
											event.menu=menus;
										
										}
								}
							}
						}
					]	
		});
		return dropDownContainer;
}
function setValueDateDropDownMenu(renderToElementId){
	var dropDownContainer=Ext.create('Ext.Container', {
			itemId : 'ValueDateContainer',
			renderTo:renderToElementId,
			items : [{
							xtype : 'label',
							forId : "ValueDateLabel",
							text:valueDateOpLabel,
							listeners: {
							       render: function(c) {
							    	   			var tip = Ext.create('Ext.tip.ToolTip', {
							    	   							xtype : 'tooltip',
											            	    target: c.getEl(),
											            	    listeners:{
											            	    	beforeshow:function(tip){
											            	    		if(value_date_opt === null)
												            	    		tip.update(getLabel('valueDate', 'Value Date'));
												            	    	else
												            	    		tip.update(getLabel('valueDate', 'Value Date')+
												            	    				'(' + value_date_opt + ')');

											            	    	}
											            	    }
							        			});
							       	}	
							}
						},{
							xtype : 'button',
							border : 0,
							itemId : 'valueDateBtn',
							cls : 'ui-caret-dropdown',
							listeners : {
								click:function(event){
										var menus=getDateDropDownItems("valueDate",this);
										var xy=event.getXY();
										menus.showAt(xy[0],xy[1]+16);
										event.menu=menus;
										event.removeCls('ui-caret-dropdown'),
										event.addCls('action-down-hover');
								}
							}
						}
					]	
		});
		return dropDownContainer;
}
function getDateDropDownItems(filterType,buttonIns){
	var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		
		var arrMenuItem = [];
    	if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('today', 'Today');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('yesterday', 'Yesterday');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('thisweek', 'This Week');
						updateToolTip(filterType,posting_date_opt);
					}
				} );
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Yesterday'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('lastweektodate', 'Last Week To Yesterday');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('thismonth', 'This Month');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
					text : getLabel('lastMonthToDate', 'Last Month To Yesterday'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt =  getLabel('lastMonthToDate', 'Last Month To Yesterday');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push( {
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthOnly',
					btnValue : '17',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('lastmonthonly', 'Last Month Only');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('thisquarter', 'This Quarter');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('lastQuarterToDate',
							'Last Quarter To Yesterday'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('lastQuarterToDate','Last Quarter To Yesterday');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('thisyear', 'This Year');
						updateToolTip(filterType,posting_date_opt);
					}
				} );
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
					text : getLabel('lastyeartodate', 'Last Year To Yesterday'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						posting_date_opt = getLabel('lastyeartodate', 'Last Year To Yesterday');
						updateToolTip(filterType,posting_date_opt);
					}
				});
		
	var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},	
		items : summaryType === 'previousday' ? getDateDropDown(filterType,buttonIns) :  arrMenuItem
	});
	return dropdownMenu;
}
function setTypeCodeSetValues(elementId){
	Ext.Ajax.request({
			url : 'services/userpreferences/'+strActivityPageName+'/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					addDataInMultiSelect(elementId,pref);
					filterTypeCodeSetDataCount=pref.length;	
				}
			}
		});
}
function addDataInMultiSelect(elementId,data)
{
	var elementId = "#"+elementId;
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].typeCodes,
			text: data[index].txnCategory,
			selected : data[index].txnCategory === selectedFilter ? true : false
		});
		opt.appendTo( elementId);		
	}
}
var arrSortByFields = [{
		"colId" : "postingDate",
		"colDesc" : getLabel('postingdate', 'Posting Date')

	}, { "colId" : "amount_credit",
		"colDesc" : getLabel('amount_credit', 'Credit Amount')
	}, {
		"colId" : "amount_debit",
		"colDesc" : getLabel('amount_debit', 'Debit Amount')
	}, {
		"colId" : "typeCode",
		"colDesc" :getLabel('typeCode', 'Type Code')
	}];
function setSortByMenuItems(elementId,columnsArray){
	var defaultOpt = $('<option />', {
		value : "None",
		text : getLabel("none", "None")
		});	
	defaultOpt.appendTo(elementId);
	for (var index = 0; index < columnsArray.length; index++) {
		 var opt=$('<option />', {
		value : columnsArray[index].colId,
		text : columnsArray[index].colDesc
		});	
		opt.appendTo(elementId);
	}	
}

function sortBy1ComboSelected(columnId){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
		var selectedColumnId=$('#msSortBy1').val();
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#msSortBy2 option').remove();
		setSortByMenuItems("#msSortBy2",filteredRecords);
		$('#msSortBy2').attr('disabled',false);
	}else{	
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy2').val('None');
		$('#msSortBy3').attr('disabled',true);
		$('#msSortBy3').val('None');
	}
	$('#msSortBy2').niceSelect();
	$('#msSortBy2').niceSelect('update');
	$('#msSortBy3').niceSelect();
	$('#msSortBy3').niceSelect('update');
}

function sortBy2ComboSelected(columnId){
	var filteredRecords = [];
	var sortByColumns=arrSortByFields;
	var selectedColumnIdFromSort1Combo=$('#msSortBy1').val();
	if(!Ext.isEmpty(columnId) && columnId != undefined)
		var selectedColumnId=columnId;
	else
		var selectedColumnId=$('#msSortBy2').val();
	if(selectedColumnId!='None'){
		for (var index = 0; index < sortByColumns.length; index++) {
			if(selectedColumnId!==sortByColumns[index].colId&&selectedColumnIdFromSort1Combo!==sortByColumns[index].colId){
				filteredRecords.push({
					colId:sortByColumns[index].colId,
					colDesc:sortByColumns[index].colDesc
				});
			}
		}
		$('#msSortBy3 option').remove();
		setSortByMenuItems("#msSortBy3",filteredRecords);	
		$('#msSortBy3').attr('disabled',false);
	}else{	
		$('#msSortBy3').attr('disabled',true);
		$('#msSortBy3').val('None');
	}
	$('#msSortBy3').niceSelect();
	$('#msSortBy3').niceSelect('update');
}

function getAdvancedFilterQueryJson() {
	var objJson = null;
	var jsonArray = [];
	
	// Debit Flag
	var debitCreditCheckedVal = '';
	var debitCreditCheckedValDesc = '';
	var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
	var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
	
	if(debitChecked === true && creditChecked === true)
	{
		debitCreditCheckedVal = 'D,C';
		debitCreditCheckedValDesc = getLabel('debit', 'Debit')+" , "+getLabel('credit', 'Credit');
	}
	else if(debitChecked === true)
	{
		debitCreditCheckedVal = 'D';
		debitCreditCheckedValDesc = getLabel('debit', 'Debit');
	}
	else if(creditChecked === true)
	{
		debitCreditCheckedVal = 'C';
		debitCreditCheckedValDesc = getLabel('credit', 'Credit');
	}
	
	// Posted Txns Flag
	var postedExpectedTxnsCheckedVal = '';
	var postedExpectedTxnsCheckedValDesc = '';
	var postedTxnsChecked = $("input[type='checkbox'][id='postedTxnsCheckBox']").is(':checked');
	var expectedTxnsChecked = $("input[type='checkbox'][id='expectedTxnsCheckBox']").is(':checked');
	
	if(postedTxnsChecked === true && expectedTxnsChecked === true)
	{
		postedExpectedTxnsCheckedVal='P,E';
		postedExpectedTxnsCheckedValDesc = getLabel('postedtxn', 'Posted Transactions')+' , '
		+getLabel('expectedtxn', 'Expected Transactions');
	}else if(postedTxnsChecked === true){
		postedExpectedTxnsCheckedVal='P';
		postedExpectedTxnsCheckedValDesc = getLabel('postedtxn', 'Posted Transactions');
	}else if(expectedTxnsChecked === true){
		postedExpectedTxnsCheckedVal='E';
		postedExpectedTxnsCheckedValDesc = getLabel('expectedtxn', 'Expected Transactions');
	}
	 
	 if (!Ext.isEmpty(debitCreditCheckedVal)) {
			jsonArray.push({
						field : 'debitCreditFlag',
						operator : 'in',
						//value1 : encodeURIComponent(debitCreditCheckedVal.replace(new RegExp("'", 'g'), "\''")),
						value1 : debitCreditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel('debitCreditFlag', 'Debit Credit Flag'),
						displayValue1 : debitCreditCheckedValDesc
					});
		}
	 
	 if (!Ext.isEmpty(postedExpectedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'postedExpectedFlag',
						operator : 'in',
						//value1 : encodeURIComponent(postedExpectedTxnsCheckedVal.replace(new RegExp("'", 'g'), "\''")),
						value1 : postedExpectedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6,
						paramFieldLable : getLabel('postedExpectedFlag', 'Posted Expected Flag'),
						displayValue1 : postedExpectedTxnsCheckedValDesc
					});
		}
	 //PostingDate
//		if(!jQuery.isEmptyObject(selectedPostingDate)){
			//$('#activityDataPicker').val(Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'));
//			jsonArray.push({
//						field : 'postingDate',
//						operator : selectedPostingDate.operator,
//						value1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'),
//						value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.util.Format.date(selectedPostingDate.toDate, 'Y-m-d'): '',
//						dataType : 1,
//						displayType : 5,
//						paramFieldLable : getLabel('expectedDate', 'Posting Date'),
//						displayValue1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d')
//					});
//			}
	
	// Value Date	
	if(!jQuery.isEmptyObject(selectedValueDate)){
			jsonArray.push({
						field : 'valueDate',
						operator : selectedValueDate.operator,
						value1 : Ext.util.Format.date(selectedValueDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedValueDate.toDate))? Ext.util.Format.date(selectedValueDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						paramFieldLable : getLabel('valueDate', 'Value Date'),
						displayValue1 : Ext.util.Format.date(selectedValueDate.fromDate, 'd/m/Y'),
						dateIndex : selectedValueDate.dateIndex,
						dateLabel : selectedValueDate.dateLabel
					});
	}
	
	// Type Code
	var typeCode = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCode)) {
		jsonArray.push({
						field : 'typeCodeText',
						operator : 'eq',
						value1 : encodeURIComponent(typeCode.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('typeCode', 'Type Code'),
						displayValue1 : typeCode,
						displayType : 5
					});
	}

	// Type Code Set
	var typeCodeSet = $("#typeCodeSet option:selected").text();
	 var typeCode= $("select[id='typeCodeSet']").getMultiSelectValueString();
	if (!Ext.isEmpty(typeCodeSet)   && 'All' != typeCodeSet) {
			 jsonArray.push({
				 field : 'typeCode',
				 operator : 'eq',
				 value1 : encodeURIComponent(typeCode.replace(new RegExp("'", 'g'), "\''")),
				 value2 : typeCodeSet,
				 dataType : 0,
				 displayType : 6,
				 paramFieldLable : getLabel('typecodeset', 'Type Code Set'),
				 displayValue1 : typeCodeSet
			  });
	}
	// Bank Reference
	var bankReference = $("input[type='text'][id='bankReference']").val();
		if (!Ext.isEmpty(bankReference)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : encodeURIComponent(bankReference.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('bankReference', 'Bank Reference'),
						displayValue1 : bankReference
					});
		}
		
	// Customer Reference
	var customerReference = $("input[type='text'][id='customerReference']").val();
		if (!Ext.isEmpty(customerReference)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : encodeURIComponent(customerReference.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('customerReference', 'Customer Reference'),
						displayValue1 : customerReference
					});
		}
	// Notes
	var notes = $("input[type='text'][id='notes']").val();
		if (!Ext.isEmpty(notes)) {
		jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : encodeURIComponent(notes.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						paramFieldLable : getLabel('noteText', 'Note'),
						displayValue1 : notes
					});
	}
	
	// Amount
	var amount = $("input[type='text'][id='amountField']").val().split(',').join('').trim();
	if (!Ext.isEmpty(amount)) {
		jsonArray.push({
			field : 'amount',
			operator : selectedAmountType.operator ? selectedAmountType.operator : 'eq',
			value1 : amount,
			value2 : '',
			dataType : 2,
			displayType : 3,
			paramFieldLable : getLabel('amount', 'Amount'),
			displayValue1 : amount
		});
	}
	
	// Has Image Flag
	var hasImageCheckedVal = '';
	var hasImageDesc ='';
		var hasImageChecked = $("input[type='checkbox'][id='hasImageCheckBox']").is(':checked');
	if (hasImageChecked === true){
		hasImageCheckedVal = 'Y';
		hasImageDesc ='True';
	}
		else
	{
		hasImageCheckedVal = 'N';
		hasImageDesc ='False';
	}
	if (!Ext.isEmpty(hasImageCheckedVal) && hasImageCheckedVal == 'Y') {
			jsonArray.push({
						field : 'hasImageFlag',
						operator : 'eq',
						value1 : hasImageCheckedVal,
						value2 : '',
						dataType : 0,
					displayType : 12,
						paramFieldLable : getLabel('hasImage', 'Has Image'),
					displayValue1 : hasImageDesc
					});
		}

		// has Attachment Flag
		var hasAttachmentCheckedVal = '';
	var hasAttachmentDesc ='';
		var hasAttachmentChecked = $("input[type='checkbox'][id='hasAttachmentCheckBox']").is(':checked');
	if (hasAttachmentChecked){
		hasAttachmentCheckedVal = 'Y';
		hasAttachmentDesc ='True';
	}
	else{
		hasAttachmentCheckedVal = 'N';
	}
	if (!Ext.isEmpty(hasAttachmentCheckedVal) && hasAttachmentCheckedVal == 'Y') {
			jsonArray.push({
						field : 'hasAttachmentFlag',
						operator : 'eq',
						value1 : hasAttachmentCheckedVal,
						value2 : '',
						dataType : 0,
					displayType : 12,
						paramFieldLable : getLabel('hasAttachment', 'Has Attachment'),
					displayValue1 : hasAttachmentDesc
					});
	}
	objJson = jsonArray;
	return objJson;
}
function getSortByAscendingDescendingText(elementId){
	var labelText=$(elementId).text().trim();
	if(labelText==getLabel("ascending", "Ascending")){
		return 'asc';
	}else if(labelText==getLabel("descending","Descending")){
		return 'desc';
	}
}
function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];
	
		// Amount
		var amount = $("input[type='text'][id='amountField']").val().split(',').join('').trim();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
				field : 'amount',
				operator : selectedAmountType.operator ? selectedAmountType.operator : 'eq',
				value1 : amount,
				value2 : '',
				dataType : 2,
				displayType : 3
			});
		}	
		
		var typeCodeVal = $("input[type='text'][id='typeCode']").val();
		if (!Ext.isEmpty(typeCodeVal)) {
			jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : encodeURIComponent(typeCodeVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
				dataType : 0,
				paramFieldLable : getLabel('typeCode', 'Type Code'),
				displayType : 5,
				displayValue1 : typeCodeVal
					});
		}
		var bankRefVal = $("input[type='text'][id='bankReference']").val();
		if (!Ext.isEmpty(bankRefVal)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : encodeURIComponent(bankRefVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0
					});
		}
		var clientRefVal = $("input[type='text'][id='customerReference']").val();
		if (!Ext.isEmpty(clientRefVal)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : encodeURIComponent(clientRefVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0
					});
		}
		var notesVal = $("input[type='text'][id='notes']").val();
		if (!Ext.isEmpty(notesVal)) {
			jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : encodeURIComponent(notesVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0
					});
		}
		// PostingDate
		if(!jQuery.isEmptyObject(selectedPostingDate)){
			jsonArray.push({
						field : 'postingDate',
						operator : selectedPostingDate.operator,
						value1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.util.Format.date(selectedPostingDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						dropdownLabel : selectedPostingDate.dateLabel
					});
			}
		// ValueDate
		if(!jQuery.isEmptyObject(selectedValueDate)){
			jsonArray.push({
						field : 'selectedValueDate',
						operator : selectedValueDate.operator,
						value1 : Ext.util.Format.date(selectedValueDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedValueDate.toDate))? Ext.util.Format.date(selectedValueDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 5,
						dropdownLabel : selectedValueDate.dateLabel
					});
		}
		// type Code Set
		var typeCodeSetName = $("#typeCodeSet option:selected").text();
		var typeCodeSet = $("select[id='typeCodeSet']").getMultiSelectValueString();
		if (!Ext.isEmpty(typeCodeSet)) {
			 jsonArray.push({
				 field : 'typeCode',
				 operator : 'eq',
				 value1 : encodeURIComponent(typeCodeSet.replace(new RegExp("'", 'g'), "\''")),
				 value2 : typeCodeSetName,
				 dataType : 0,
				 displayType : 6
			  });
		}
		// sortBySortOption
		var sortByCombo = $("select[id='msSortBy1']").val();
		var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
		if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
			jsonArray.push({
						field : 'SortBy',
						operator : 'st',
						value1 : sortByCombo,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		
		// First Then Sort By
		var firstThenSortByCombo = $("select[id='msSortBy2']").val();
		var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
		if (!Ext.isEmpty(firstThenSortByCombo)
				&& firstThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'FirstThenSortBy',
						operator : 'st',
						value1 : firstThenSortByCombo,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		// Second Then Sort By
		var secondThenSortByCombo = $("select[id='msSortBy3']").val();
		var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
		if (!Ext.isEmpty(secondThenSortByCombo)
				&& secondThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'SecondThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		// Debit Flag
		var debitCheckedVal = '';
		var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
				
		if(debitChecked === true)
			debitCheckedVal = 'Y';
		else 
			debitCheckedVal = 'N';
		if (!Ext.isEmpty(debitCheckedVal)) {
			jsonArray.push({
						field : 'debitFlag',
						operator : 'eq',
						value1 : debitCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Credit Flag
		var creditCheckedVal = '';
		var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
		if (creditChecked === true)
			creditCheckedVal = 'Y';
		else
			creditCheckedVal = 'N';
		if (!Ext.isEmpty(creditCheckedVal)) {
			jsonArray.push({
						field : 'creditFlag',
						operator : 'eq',
						value1 : creditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Posted Txns Flag
		var postedTxnsCheckedVal = '';
		var postedTxnsChecked = $("input[type='checkbox'][id='postedTxnsCheckBox']").is(':checked');
		if (postedTxnsChecked === true)
			postedTxnsCheckedVal = 'Y';
		else
			postedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(postedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'postedTxnsFlag',
						operator : 'eq',
						value1 : postedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Expected Txns Flag
		var expectedTxnsCheckedVal = '';
		var expectedTxnsChecked = $("input[type='checkbox'][id='expectedTxnsCheckBox']").is(':checked');	
		if (expectedTxnsChecked === true)
			expectedTxnsCheckedVal = 'Y';
		else
			expectedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(expectedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'expectedTxnsFlag',
						operator : 'eq',
						value1 : expectedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Has Image Flag
		var hasImageCheckedVal = '';
		var hasImageChecked = $("input[type='checkbox'][id='hasImageCheckBox']").is(':checked');
		if (hasImageChecked === true)
			hasImageCheckedVal = 'Y';
		else
			hasImageCheckedVal = 'N';
		if (!Ext.isEmpty(hasImageCheckedVal)) {
			jsonArray.push({
						field : 'hasImageFlag',
						operator : 'eq',
						value1 : hasImageCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// has Attachment Flag
		var hasAttachmentCheckedVal = '';
		var hasAttachmentChecked = $("input[type='checkbox'][id='hasAttachmentCheckBox']").is(':checked');
		if (hasAttachmentChecked)
			hasAttachmentCheckedVal = 'Y';
		else
			hasAttachmentCheckedVal = 'N';
		if (!Ext.isEmpty(hasAttachmentCheckedVal)) {
			jsonArray.push({
						field : 'hasAttachmentFlag',
						operator : 'eq',
						value1 : hasAttachmentCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;

		return objJson;
}
function getAdvancedFilterSortByJson(){
	var objJson = null;
	var jsonArray = [];

	// Sort By
	var sortByCombo = $("select[id='msSortBy1']").val();
	var sortByOption = getSortByAscendingDescendingText('#sortBy1AscDescLabel');
	if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
		jsonArray.push({
					field : 'SortBy',
					operator : 'st',
					value1 : sortByCombo,
					value2 : sortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// First Then Sort By
	var firstThenSortByCombo = $("select[id='msSortBy2']").val();
	var firstThenSortByOption = getSortByAscendingDescendingText('#sortBy2AscDescLabel');
	if (!Ext.isEmpty(firstThenSortByCombo)
			&& firstThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'FirstThenSortBy',
					operator : 'st',
					value1 : firstThenSortByCombo,
					value2 : firstThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}

	// Second Then Sort By
	var secondThenSortByCombo = $("select[id='msSortBy3']").val();
	var secondThenSortByOption =getSortByAscendingDescendingText('#sortBy3AscDescLabel'); 
	if (!Ext.isEmpty(secondThenSortByCombo)
			&& secondThenSortByCombo !== "None") {
		jsonArray.push({
					field : 'SecondThenSortBy',
					operator : 'st',
					value1 : secondThenSortByCombo,
					value2 : secondThenSortByOption,
					dataType : 0,
					displayType : 6
				});
	}
	
	objJson = jsonArray;
	return objJson;
}
function createActivityFilterGrid() {
	var store = activityFilterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY:'auto',
				width:708,
				forceFit:true,
				popup : true,
				margin: '0 0 12 0',
				cls : 't7-grid',
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						 var IconLinkClicked = (e.target.tagName == 'A');	
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='advFilterEdit'){
								$(document).trigger("editActivityFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterView'){
								$(document).trigger("viewActivityFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterDelete'){
								$(document).trigger("deleteActivityFilterEvent",[view, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 50,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					header : getLabel('actions', 'Actions'),
					align : 'center',
					sortable:false,
					flex:1,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>' 
						          + '<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
				}, {
					text : 'Filter Name',
					dataIndex : 'filterName',
					flex : 3,
					sortable:false,
					menuDisabled : true
				}, /*{
					xtype : 'actioncolumn',
					align : 'center',
					flex:1,
					header : getLabel('deleteFilter', 'Delete Filter'),
					sortable:false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
						         		
					}
				},*/ {
					xtype : 'actioncolumn',
					align : 'center',
					flex:1,
					header : getLabel('order', 'Order'),
					sortable:false,
					menuDisabled : true,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, 1]);
						}
					}]
				}],
				renderTo : 'advFilterList'
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}
function activityFilterGridStore(){
	var myStore = new Ext.data.ArrayStore({
		autoLoad : true,
		fields : ['filterName'],
		proxy : {
			type : 'ajax',
			url : 'services/userfilterslist/'+strActivityPageName+'.json',
			reader : {
				type : 'json',
				root : 'd.filters'
			}
		},
		listeners : {
			load : function(store, records, success, opts) {
				store.each(function(record) {
							record.set('filterName', record.raw);
						});
			}
		}
	})
	return myStore;
}

	function getDateDropDown(filterType,buttonIns){
		var me = this;
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
		var arrMenuItem = [];
			arrMenuItem.push({
						text : getLabel('selectedRecordDate', 'Selected Record Date'),
						btnId : 'latest',
						btnValue : '16',
						handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option= getLabel('selectedRecordDate', 'Selected Record Date');
								updateToolTip(filterType,date_option);
						}
					});
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('yesterday', 'Yesterday'),
							btnId : 'btnYesterday',
							btnValue : '2',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
									var date_option = getLabel('yesterday', 'Yesterday');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisweek', 'This Week'),
							btnId : 'btnThisweek',
							btnValue : '3',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
									var date_option = getLabel('thisweek', 'This Week');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastweektodate', 'Last Week To Yesterday'),
							btnId : 'btnLastweek',
							btnValue : '4',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('lastweektodate', 'Last Week To Yesterday');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thismonth', 'This Month'),
							btnId : 'btnThismonth',
							btnValue : '5',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('thismonth', 'This Month');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastMonthToDate', 'Last Month To Yesterday'),
							btnId : 'btnLastmonth',
							btnValue : '6',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('lastMonthToDate', 'Last Month To Yesterday');
								updateToolTip(filterType,date_option);
							}
						});
			if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastmonthonly', 'Last Month Only'),
							btnId : 'btnLastmonth',
							btnValue : '17',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('lastmonthonly', 'Last Month Only');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisquarter', 'This Quarter'),
							btnId : 'btnLastMonthToDate',
							btnValue : '8',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
							  var date_option = getLabel('thisquarter', 'This Quarter');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastQuarterToDate','Last Quarter To Yesterday'),
							btnId : 'btnQuarterToDate',
							btnValue : '9',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('lastQuarterToDate','Last Quarter To Yesterday');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('thisyear', 'This Year'),
							btnId : 'btnLastQuarterToDate',
							btnValue : '10',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('thisyear', 'This Year');
								updateToolTip(filterType,date_option);
							}
						});
			if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
							text : getLabel('lastyeartodate', 'Last Year To Yesterday'),
							btnId : 'btnYearToDate',
							btnValue : '11',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = getLabel('lastyeartodate', 'Last Year To Yesterday');
								updateToolTip(filterType,date_option);
							}
						});
			if(!Ext.isEmpty(xDaysVal))
				arrMenuItem.push({
							text : Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal),
							btnId : 'btnLastQuarterToDate',
							btnValue : '14',
							handler : function(btn, opts) {
								$(document).trigger("filterDateChange",[filterType,btn,opts]);
								var date_option = Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal);
								updateToolTip(filterType,date_option);
							}
						});
		return arrMenuItem;
	}
function getDateDropDownLabesl(filterVal){
		switch(filterVal) {
			case '16' :
				return getLabel('selectedRecordDate', 'Selected Record Date');
			case '1':
				return getLabel('today', 'Today');
			case '2' :
				return getLabel('yesterday', 'Yesterday');
			case '3' :
				return getLabel('thisweek', 'This Week');
			case '4' :
				return getLabel('lastweektodate', 'Last Week To Yesterday');
			case '5' :
				return getLabel('thismonth', 'This Month');
			case '6' :
				return getLabel('lastMonthToDate', 'Last Month To Yesterday');
			case '8' :
				return getLabel('thisquarter', 'This Quarter');
			case '9' :
				return getLabel('lastQuarterToDate','Last Quarter To Yesterday');
			case '14' :
				return Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal);
			case '17' :
				return getLabel('lastMonthOnly', 'Last Month Only');
			default :
				return getLabel('daterange', 'Date Range');
		}
	}
	

$(function() {
	if(summaryType !== 'intraday'){
		$('#postingDate').datepick({
			monthsToShow: 1,
			minDate : dtHistoryDate,
			changeMonth : true,
			changeYear : true,
			dateFormat : strjQueryDatePickerDateFormat,
			maxDate : dtSellerDate,
			rangeSeparator : '  to  ',	
			onClose: function(dates) {
				if(!Ext.isEmpty(dates)){
					$(document).trigger("datePickPopupSelectedDate",["postingDate",dates]);
				}
			}
		}).attr('readOnly',true);
	}
	
	$('#valueDate').datepick({
		monthsToShow: 1, 
		changeMonth : true,
		changeYear : true,
		rangeSeparator : '  to  ',	
		onClose: function(dates) {
			if(!Ext.isEmpty(dates)){
				$(document).trigger("datePickPopupSelectedDate",["valueDate",dates]);
			}
		}
	}).attr('readOnly',true);
});

function setSavedFilterComboItems(element)
{
	$.ajax({
		url : 'services/userfilterslist/'+strActivityPageName+'.json',
		success : function(responseText) 
		{
			if(responseText && responseText.d && responseText.d.filters)
			{
				 var responseData=responseText.d.filters;
				 $(element).empty();
				 $(element).append($('<option>', { 
								value: '',
								text : getLabel('select', 'Select'),
								selected : false
								}));
				 if(responseData.length > 0)
				 {
					$.each(responseData,function(index,item)
					{
						$(element).append($('<option>', { 
							value: responseData[index],
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

function toggleMoreLessText(me)
{
	$(".moreCriteria").toggleClass("hidden");
	$("#moreLessCriteriaCaret").toggleClass("fa-caret-up fa-caret-down");
	var textContainer = $(me).children("#moreLessCriteriaText");
	var labelText = textContainer.text().trim();
	if(labelText === getLabel("lesscriterial", "Less Criteria")) 
	{
		textContainer.text(getLabel("morecriterial","More Criteria"));
		$('#tabs-2').removeClass('ft-content-pane-scroll');
	}
	else if(labelText === getLabel("morecriterial","More Criteria")) 
	{
		textContainer.text(getLabel("lesscriterial","Less Criteria"));
		$('#tabs-2').addClass('ft-content-pane-scroll');
	}
}

