Ext
		.define(
				'GCP.controller.BaseInterestRatesController',
				{
					extend : 'Ext.app.Controller',

					requires : [ 'Ext.Ajax' ],

					views : [ 'GCP.view.BaseInterestRatesView' ],

					refs : [
							{
								ref : "baseInterestRatesFilterViewRef",
								selector : 'baseInterestRatesView baseInterestRatesFilterView'
							},
							{
								ref : "effectiveDate",
								selector : 'baseInterestRatesView baseInterestRatesFilterView datefield[itemId="effectiveDate"]'
							},
							{
								ref : 'baseRateCurrency',
								selector : 'baseInterestRatesView baseInterestRatesFilterView AutoCompleter[itemId=baseRateCurrency]'
							},
							{
								ref : 'baseRateType',
								selector : 'baseInterestRatesView baseInterestRatesFilterView AutoCompleter[itemId=baseRateType]'
							},
							{
								ref : "statusFilter",
								selector : 'baseInterestRatesView baseInterestRatesFilterView combobox[itemId="statusFilter"]'
							},							
							{
								ref : "btnFilter",
								selector : 'baseInterestRatesView baseInterestRatesFilterView button[itemId="btnFilter"]'
							},
							{
								ref : 'grid',
								selector : 'baseInterestRatesView baseInterestRatesGridView'
							},
							{
								ref : 'groupActionBar',
								selector : 'baseInterestRatesView baseInterestRatesActionView'
							},
							{
								ref : 'paginationBar',
								selector : 'baseInterestRatesView baseInterestRatesGridView pagingtoolbar[itemId=paggingtlbr]'
							}],

					config : {
						effDateFilterVal : '',
						filterData : []
					},

					init : function() {
						var me = this;
						me
								.control(
									{
									'baseInterestRatesView baseInterestRatesFilterView' : {
										render : function() {
											me.setInfoTooltip();
										},
										filterStatusType : function( btn, opts )
										{										
										me.handleStatusTypeFilter( btn );
										}
											
									},
									'baseInterestRatesView baseInterestRatesFilterView AutoCompleter[itemId="baseRateCurrency"]' :
									{
										select : function( combo, record, index )
										{
											me.baseRateCurrencyChanged(combo);
										},
										change : function( combo, record, index )
										{
											me.baseRateCurrencyChanged(combo);
										}
									},
									'baseInterestRatesView baseInterestRatesFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.loadFilterData();
										}
									},
									'baseInterestRatesView baseInterestRatesGridView' : {
										render : function(panel) {
											var bar = me.getPaginationBar();
											var combo = new Ext.form.ComboBox({
											  itemId : 'perpage',
											  store: new Ext.data.ArrayStore({
											    fields: ['id'],
											    data  : [
											      ['10'], 
											      ['25'],
											      ['50'],
											      ['100'],
											      ['200'],
											      ['500']
											    ]
											  }),
											  mode : 'local',
											  value: '10',
											  width     : 50,
											  matchFieldWidth: false,
											  listWidth     : 10,
											  triggerAction : 'all',
											  displayField  : 'id',
											  valueField    : 'id',
											  editable      : false,
											  forceSelection: true,
											  fieldCls : 'xn-form-field',
											  triggerBaseCls : 'xn-form-trigger',
											  listConfig: {
											     listeners: {
											       beforeshow: function(picker) {
											         picker.minWidth = picker.up('combobox').getSize().width;
											       }
											     }
											   }
											});
											var tbtext = Ext.toolbar.TextItem({
												text : getLabel('rowperpage','Rows Per Page')
											});
											bar.insert(10,tbtext);
											bar.insert(11,combo);
											me.loadFilterData();
										}
										
									},
									'baseInterestRatesView baseInterestRatesGridView pagingtoolbar[itemId=paggingtlbr]' : {
										beforechange : function(pagingToolBar, page, eOpts) {
											var grid = me.getGrid();
											if (!Ext.isEmpty(grid)) {
												var pageSize = grid.store.pageSize;
												var newPgNo = page;
												grid.store.getProxy().url = me.genGridUrl(pageSize,
														newPgNo);
												grid.store.loadPage(newPgNo);
											}
											return false;
										}
									},
									'baseInterestRatesView baseInterestRatesGridView combobox[itemId=perpage]' : {
										change : function(combo, newValue, oldValue) {
											var grid = me.getGrid();
											if (!Ext.isEmpty(grid)) {
												var pageSize = newValue;
												grid.store.pageSize = newValue;
												grid.store.getProxy().url = me.genGridUrl(pageSize,
														1);
												grid.store.loadPage(1);
											}
											return false;
										}
									},
									'baseInterestRatesView baseInterestRatesGridView checkcolumn[itemId=isSelected]' : {
										checkchange : function(checkColumn,
												rowIndex, checked, eOpts) {
											me.enableValidActionsForGrid(
													checkColumn, rowIndex,
													checked, eOpts);
										},
										headerclick : function( ct, column, e, t, eOpts ){

										}
									},
									'baseInterestRatesView toolbar[itemId=groupActionBarView]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									}
								});
					},
					
					handleStatusTypeFilter : function( btn )
					{
						var me = this;
						me.statusType = btn.value;
					},
					
					filterChangeEffectiveDate : function(oldValue, newValue) {
						effectiveDate = Ext.util.Format.date(me
								.getEffectiveDate().getValue(), extJsDateFormat);
					},

					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext.create('Ext.tip.ToolTip', {
							target : 'imgFilterInfo',
							listeners : {
								// Change content dynamically
								// depending
								// on which element triggered
								// the show.
								beforeshow : function(tip) {
									effectiveDate = Ext.util.Format.date(me
											.getEffectiveDate().getValue(),
											extJsDateFormat);
									
									var currency = '';
									var rateType = '';
									var status = '';

									var baseRateCurrencyRef = me
											.getBaseRateCurrency();
									if (!Ext.isEmpty(baseRateCurrencyRef)
											&& !Ext.isEmpty(baseRateCurrencyRef
													.getValue())) {
										currency = baseRateCurrencyRef
												.getValue();
									} else {
										currency = getLabel('none', 'None');
									}

									var baseRateTypeRef = me.getBaseRateType();
									if (!Ext.isEmpty(baseRateTypeRef)
											&& !Ext.isEmpty(baseRateTypeRef
													.getValue())) {
										rateType = baseRateTypeRef.getValue();
									} else {
										rateType = getLabel('none', 'None');
									}

									if (!Ext.isEmpty(me.getStatusFilter())
											&& !Ext.isEmpty(me
													.getStatusFilter()
													.getValue())) {
										var combo = me.getStatusFilter();
										status = combo.getRawValue()
									} else {
										status = getLabel('all', 'All');
									}
									
									tip.update(getLabel("effectiveDate",
											"Effective Date")
											+ ' : ' + effectiveDate
											+ '<br/>'
											+ getLabel("currency", "Currency")
											+ ' : '
											+ currency
											+ '<br/>'
											+ getLabel("baseRateCode",
													"Base Rate Code") + ' : '
											+ rateType + '<br/>'
											+ getLabel('status', 'Status')
											+ ' : ' + status);
								}
							}
						});
					},

					loadFilterData : function() {
						var me = this;
						me.setDataForFilter();
						me.applyFilter();
					},

					setDataForFilter : function() {
						var me = this;
						var currency = null, rateType = null, statusVal = null, jsonArray = [];
                        var isPending = true;
						effectiveDate = Ext.util.Format.date(me
								.getEffectiveDate().getValue(), extJsDateFormat);

						var baseRateCurrencyRef = me.getBaseRateCurrency();
						if (!Ext.isEmpty(baseRateCurrencyRef)
								&& !Ext.isEmpty(baseRateCurrencyRef.getValue())) {
							currency = baseRateCurrencyRef.getValue();
						}
						if (!Ext.isEmpty(currency)) {
							jsonArray.push({
								paramName : 'baseRateCurrency',
								paramValue1 : encodeURIComponent(currency.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							});
						}

						var baseRateTypeRef = me.getBaseRateType();
						if (!Ext.isEmpty(baseRateTypeRef)
								&& !Ext.isEmpty(baseRateTypeRef.getValue())) {
							rateType = baseRateTypeRef.getValue();
						}
						if (!Ext.isEmpty(rateType)) {
							jsonArray.push({
								paramName : 'baseRateType',
								paramValue1 : encodeURIComponent(rateType.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							});
						}

						statusVal = me.getStatusFilter().getValue();
						if (!Ext.isEmpty(statusVal) && 'ALL' != statusVal.toUpperCase()) {
					 	  if(statusVal == '13NY')
							{
							 statusVal  = new Array('5YY','4NY','0NY','1YY');
				             isPending = false;
				             jsonArray.push({
					 			paramName : 'statusFilter',
								paramValue1 : statusVal,
								operatorValue : 'in',
								dataType : 'S'
												} );
				              jsonArray.push({
								paramName : 'user',
								paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'ne',
								dataType : 'S'
												});
								
							}
							
						if(isPending)
                        {							
							if(statusVal == '0NY' || statusVal == '1YY' ){
								statusVal = (statusVal  == '0NY')?'0NY':'1YY';
								jsonArray.push(
										{
											paramName : 'statusFilter',
											paramValue1 : statusVal,
											operatorValue : 'eq',
											dataType : 'S'
										} );
							}
							else if (statusVal == 'XXX'){
								jsonArray.push(
										{
											paramName : 'RecKeyFilter',
											paramValue1 : statusVal,
											operatorValue : 'eq',
											dataType : 'S'
										} );
							}
							else {
							jsonArray.push(
									{
										paramName : 'statusFilter',
										paramValue1 : statusVal,
										operatorValue : 'eq',
										dataType : 'S'
									} );
							}	
					     }							
						}

						me.filterData = jsonArray;
					},

					applyFilter : function() {
						var me = this;
						var grid = me.getGrid();
						if (!Ext.isEmpty(grid)) {
							grid.store.clearData(); 
							grid.view.refresh();
							me.enableDisableGroupActions( '000000000');
							//grid.setLoading(true);
							grid.dockedItems.map.paggingtlbr.moveFirst();
						}
					},

					genGridUrl : function(pageSize, newPgNo) {
						var me = this;
						var strUrl = 'baseInterestRates.srvc?';
						strUrl += '$inlinecount=allpages';
						if (!Ext.isEmpty(pageSize))
							strUrl += '&$top=' + pageSize;
						else
							strUrl += '&$top=10';
						if (!Ext.isEmpty(newPgNo))
							strUrl += '&$skip=' + newPgNo;
						else
							strUrl += '&$skip=1';							
						strUrl += '&$effectiveDate=' + Ext.util.Format.date(Ext.Date.parse(effectiveDate,extJsDateFormat),
																			 'Y-m-d');
						strUrl += me.getFilterUrl();
						return strUrl;
					},

					getFilterUrl : function() {
						var me = this;
						var strQuickFilterUrl = '';
						strQuickFilterUrl = me
								.generateUrlWithFilterParams(this);
						strQuickFilterUrl += '&' + csrfTokenName + '='
								+ csrfTokenValue;
						return strQuickFilterUrl;
					},

					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '&$filter=';
						var strTemp = '';
						var strFilterParam = '';
						for (var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\''
										+ ' and ' + '\''
										+ filterData[index].paramValue2 + '\'';
								break;
							case 'in':
								var arrId = filterData[index].paramValue1;
								if (0 != arrId.length) {
									strTemp = strTemp + '(';
									for (var count = 0; count < arrId.length; count++) {
										strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ' + '\'' + arrId[count]
												+ '\'';
										if (count != arrId.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;
							default:
								// Default opertator is eq
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\'';
								break;
							}
							isFilterApplied = true;
						}
						if (isFilterApplied)
							strFilter = strFilter + strTemp;
						else
							strFilter = '';
						return strFilter;
					},


					
					handleGroupActions : function(btn, record) {
						var me = this;
						var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName
								: btn.itemId;
						var strUrl = Ext.String.format(
								'baseInterestRates/{0}.srvc', strAction);
						strUrl = strUrl + "?" + csrfTokenName + "=" + csrfTokenValue;
						if (strAction === 'reject') {
							this.showRejectVerifyPopUp(strAction, strUrl,
									record);
						} else if (strAction === 'btnHistory') {
								var recHistory = record.get('history');
								if (!Ext.isEmpty(recHistory)
										&& !Ext.isEmpty(recHistory.__deferred.uri)) {
									this.showHistory(record.get('baseRate'),
											record.get('history').__deferred.uri,
											record.get('identifier'));
								}
						}else{
							if (strAction === 'submit' || strAction === 'save') {
								// check mandatory parameters
								var hasErrors = this.checkMandatoryParams();
								if (hasErrors) {
									showErrorDiv();
									return;
								} else {
									// clear error messages
									clearAndHideErrorDiv();
								}
							}
							this.preHandleGroupActions(strUrl, '', record);
						}
					},

					showHistory : function(product, url, id) {
						Ext.create('GCP.view.BaseInterestRatesPopup', {
							productName : product,
							historyUrl : url,
							identifier : id
						}).show();
					},
					
					showRejectVerifyPopUp : function(strAction, strActionUrl,
							record) {
						var me = this;
						var titleMsg = '', fieldLbl = '';
						if (strAction === 'reject') {
							titleMsg = getLabel('prfRejectRemarkPopUpTitle',
									'Please Enter Reject Remark');
							fieldLbl = getLabel('prfRejectRemarkPopUpFldLbl',
									'Reject Remark');
						}
						Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							multiline : 4,
							style : {
								height : 400
							},
							bodyPadding : 0,
							fn : function(btn, text) {
								if(text.length >255) {
									Ext.Msg.alert(getLabel('errorTitle','Error'), getLabel('rejectRestrictionError','Reject remark should be less than 255 characters'));
									return false;
								}
								if (btn == 'ok') {
									if(Ext.isEmpty(text))
									{
										Ext.Msg.alert(getLabel('errorTitle','Error'), getLabel('Error','Reject Remarks cannot be blank'));
									}
									else
									{
										me.preHandleGroupActions(strActionUrl, text, record);
									}
								}
							}
						});
					},

					checkMandatoryParams : function() {
						var hasErrors = false;
						var me = this;
						var grid = this.getGrid();
						if (!Ext.isEmpty(grid)) {
							var allRecords = me.getGrid().store.data.items;
							// clear error messages
							createErrorDiv();
							for (var index = 0; index < allRecords.length; index++) {
								if (allRecords[index].data.isSelected) {

									if (allRecords[index].data.baseInterestRate == null
											|| allRecords[index].data.baseInterestRate == '') {
										addErrorToDiv('Base Rate is required for Currency '
												+ allRecords[index].data.baseRateCurrency
												+ ' and Base Rate Code '
												+ allRecords[index].data.baseRateType
												+ ' at row number ' + (index +1)
												+'.');
										hasErrors = true;
									}

								}
							}
						}

						return hasErrors;
					},

					preHandleGroupActions : function(strUrl, remark, record) {
						var me = this;
						var grid = this.getGrid();
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var allRecords = me.getGrid().store.data.items;
							for (var index = 0; index < allRecords.length; index++) {
								if (allRecords[index].data.isSelected == false) {
									continue;
								}

								arrayJson
										.push({
											serialNo : grid.getStore().indexOf(
													allRecords[index]) + 1,
											identifier : allRecords[index].raw.identifier,
											userMessage : remark,
											baseRateRecordKey : allRecords[index].data.baseRateMstRecordKey,
											baseInterestRate : allRecords[index].data.baseInterestRate,
											effectiveDate : Ext.util.Format
													.date(me.getEffectiveDate()
															.getValue(),
															'Y-m-d')
										});
							}

							if (arrayJson)
								arrayJson = arrayJson
										.sort(function(valA, valB) {
											return valA.serialNo
													- valB.serialNo
										});

							Ext.Ajax
									.request({
										url : strUrl,
										method : 'POST',
										jsonData : Ext.encode(arrayJson),
										success : function(response) {
											me.enableDisableGroupActions(
													'0000000000', true);
											me.applyFilter();
											var errorMessage = '';
											if (response.responseText != '[]') {
												var jsonData = Ext
														.decode(response.responseText);
												Ext
														.each(
																jsonData[0].errors,
																function(error,
																		index) {
																	errorMessage = errorMessage
																			+ error.code
																			+ ' : '
																			+ error.errorMessage
																			+ "<br/>";
																});
												if ('' != errorMessage
														&& null != errorMessage) {
													Ext.Msg.alert(getLabel('errorTitle','Error'),
															errorMessage);
												}
											}
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox
													.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
						}
					},

					enableValidActionsForGrid : function(checkColumn, rowIndex,
							checked, eOpts) {
						var me = this;
						var maskArray = new Array(), buttonMask = '0000000000', actionMask = '', editMask = '1000000000';

						var jsonData = me.getGrid().store.proxy.reader.jsonData;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
						}

						var isSameUser = true;
						var isDisabled = true;
						var isSubmit = false;
						var isEnabled = false;

						maskArray.push(buttonMask);

						var allRecords = me.getGrid().store.data.items;
						var objData = me.getGrid().store.data.items[rowIndex].raw;

						if (effectiveDate != dtApplicationDate){
							return;
						}
						for (var index = 0; index < allRecords.length; index++) {
							
							if (allRecords[index].data.isSelected == false) {
								continue;
							}
							// edit action use update & save action
							if (allRecords[index].data.isModified == 'Y'
									|| Ext.isEmpty(allRecords[index].raw.baseRateMstRecordKey)) {
								maskArray.push(editMask);
								continue;
							}
							objData = allRecords[index].raw;

							maskArray.push(objData.__metadata.__rightsMap);

							if (objData.makerId === USER) {
								isSameUser = false;
							}
							if (objData.validFlag != 'Y') {
								isEnabled = true;
							}

							if (objData.validFlag == 'Y') {
								isDisabled = true;
							}

							if (objData.isSubmitted == 'Y'
									&& objData.requestState == 0) {
								isSubmit = true;
							}
						}
						if (isEnabled && isDisabled) {
							isEnabled = false;
							isDisabled = false;
						}

						actionMask = doAndOperation(maskArray, 10);
						me.enableDisableGroupActions(actionMask, isSameUser,
								isEnabled, isDisabled, isSubmit);
					},

					enableDisableGroupActions : function(actionMask,
							isSameUser, isEnabled, isDisabled, isSubmit) {
						var actionBar = this.getGroupActionBar();
						var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
						if (!Ext.isEmpty(actionBar)
								&& !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext
									.each(
											arrItems,
											function(item) {
												strBitMapKey = parseInt(item.maskPosition,10) - 1;
												if (strBitMapKey
														|| strBitMapKey == 0) {
													blnEnabled = isActionEnabled(
															actionMask,
															strBitMapKey);

													if ((item.maskPosition === 2 && blnEnabled)) {
														blnEnabled = blnEnabled
																&& isSameUser;
													} else if (item.maskPosition === 3
															&& blnEnabled) {
														blnEnabled = blnEnabled
																&& isSameUser;
													} else if (item.maskPosition === 6
															&& blnEnabled) {
														blnEnabled = blnEnabled && !isSubmit ;
													}
													
													item
															.setDisabled(!blnEnabled);
												}
											});
						}
					},
	
					baseRateCurrencyChanged : function( combo )
					{
						var me = this;
						var comboValue =  '';
						if(!Ext.isEmpty(combo) && !Ext.isEmpty(combo.getValue())){
							comboValue = combo.getValue();
						}
						
						var objFilterPanel = me.getBaseInterestRatesFilterViewRef();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="baseRateType"]' );
						objAutocompleter.cfgUrl = 'services/userseek/baseInterestRateBaseRateTypeSeek.json';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : comboValue
							}
						];
					}
					
				});