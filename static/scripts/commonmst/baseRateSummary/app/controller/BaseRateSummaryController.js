Ext
		.define(
				'GCP.controller.BaseRateSummaryController',
				{
					extend : 'Ext.app.Controller',

					requires : [ 'Ext.Ajax' ],

					views : [ 'GCP.view.BaseRateSummaryView',
							'GCP.view.BaseRateSummaryGridView',
							'GCP.view.BaseRateHistoryPopup' ],

					refs : [
							{
								ref : 'baseRateSummaryFilterViewRef',
								selector : 'baseRateSummaryView baseRateSummaryFilterView'
							},
							{
								ref : 'baseRateCurrency',
								selector : 'baseRateSummaryView baseRateSummaryFilterView AutoCompleter[itemId=baseRateCurrency]'
							},
							{
								ref : 'baseRateType',
								selector : 'baseRateSummaryView baseRateSummaryFilterView AutoCompleter[itemId=baseRateType]'
							},
							{
								ref : "statusFilter",
								selector : 'baseRateSummaryView baseRateSummaryFilterView combobox[itemId="statusFilter"]'
							},
							{
								ref : "btnFilter",
								selector : 'baseRateSummaryView baseRateSummaryFilterView button[itemId="btnFilter"]'
							},
							{
								ref : 'baseRateSummaryGridView',
								selector : 'baseRateSummaryView baseRateSummaryGridView'
							},
							{
								ref : 'createNewToolBar',
								selector : 'baseRateSummaryView baseRateSummaryGridView toolbar[itemId="btnCreateNewToolBar"]'
							},
							{
								ref : 'groupActionBar',
								selector : 'baseRateSummaryView baseRateSummaryGridView baseRateSummaryActionBarView'
							},
							{
								ref : 'baseRateDtlView',
								selector : 'baseRateSummaryView baseRateSummaryGridView panel[itemId="baseRateDetailView"]'
							},
							{
								ref : 'gridHeader',
								selector : 'baseRateSummaryView baseRateSummaryGridView panel[itemId="baseRateDetailView"] container[itemId="gridHeader"]'
							},
							{
								ref : 'baseRateGrid',
								selector : 'baseRateSummaryView baseRateSummaryGridView grid[itemId="gridViewMstId"]'
							},
							{
								ref : 'grid',
								selector : 'baseRateSummaryView baseRateSummaryGridView smartgrid'
							}

					],

					config : {
						filterData : []
					},

					init : function() {
						var me = this;
						me
								.control({
									'baseRateSummaryView baseRateSummaryGridView button[itemId="btnCreateBaseRatesMst"]' : {
										addNewBaseRateTypeEvent : function() {
											me
													.handleBaseRatesMstEntryAction(true);
										}
									},
									'baseRateSummaryView baseRateSummaryFilterView' : {
										render : function() {
											me.setInfoTooltip();
										},
										filterStatusType : function( btn, opts )
										{
										//me.toggleSavePrefrenceAction( true );
										me.handleStatusTypeFilter( btn );
										}
									},
									'baseRateSummaryView baseRateSummaryFilterView AutoCompleter[itemId="baseRateCurrency"]' :
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
									'baseRateSummaryView baseRateSummaryFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
										}
									},
									'baseRateSummaryView baseRateSummaryGridView' : {
										render : function(panel) {
											me.handleSmartGridConfig();
										}
									},
									'baseRateSummaryView baseRateSummaryGridView panel[itemId="baseRateDetailView"]' : {
										render : function() {
										}
									},
									'baseRateSummaryView baseRateSummaryGridView smartgrid' : {
										render : function(grid) {
											me.handleLoadGridData(grid,
													grid.store.dataUrl,
													grid.pageSize, 1, 1, null);
										},
										gridPageChange : me.handleLoadGridData,
										gridSortChange : me.handleLoadGridData,
										gridRowSelectionChange : function(grid,
												record, recordIndex, records,
												jsonData) {
											me.enableValidActionsForGrid(grid,
													record, recordIndex,
													records, jsonData);
										}
									},
									'baseRateSummaryView baseRateSummaryGridView toolbar[itemId=groupActionBarView]' : {
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
					
					handleBaseRatesMstEntryAction : function(entryType) {
						var me = this;
						var form;
						var strUrl = 'showBaseRatesMst.srvc';
						var errorMsg = null;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));

						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},

					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},

					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext.create('Ext.tip.ToolTip', {
							target : 'imgFilterInfo',
							listeners : {
								// Change content dynamically depending
								// on which element triggered the show.
								beforeshow : function(tip) {
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

									tip.update(getLabel("currency", "Currency")
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

					setDataForFilter : function() {
						var me = this;
						var currency = null, rateType = null, statusVal = null, jsonArray = [];
						var isPending = true;

						var baseRateCurrencyRef = me.getBaseRateCurrency();
						if (!Ext.isEmpty(baseRateCurrencyRef)
								&& !Ext.isEmpty(baseRateCurrencyRef.getValue())) {
							currency = baseRateCurrencyRef.getValue();
						}
						if (!Ext.isEmpty(currency)) {
							jsonArray.push({
								paramName : 'baseRateCurrency',
								paramValue1 : encodeURIComponent(currency.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
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
								operatorValue : 'lk',
								dataType : 'S'
							});
						}
						
						statusVal = me.getStatusFilter().getValue();

						if (!Ext.isEmpty(statusVal) &&  'ALL' != statusVal.toUpperCase()) {
							 if(statusVal  == '13NY')
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
								 if(statusVal  == '0NY' || statusVal  == '1YY' || statusVal  == '11YY' ){	
										if(statusVal  == '0NY' || statusVal  == '1YY')	
										{
											 statusVal = statusVal == '0NY' ? '0NY':'1YY';
											jsonArray.push(
											{
												paramName : 'statusFilter',
												paramValue1 : statusVal,
												operatorValue : 'eq',
												dataType : 'S'
											} );
										}	
										else
										{
											jsonArray.push(
													   {
															paramName : 'statusFilter',
															paramValue1 : new Array('0NY','1YY','11YY')	,
															operatorValue : 'in',
															dataType : 'S'
													   } );
										}			   
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
							var strDataUrl = grid.store.dataUrl;
							var store = grid.store;
							var strUrl = grid.generateUrl(strDataUrl,
									grid.pageSize, 1, 1, store.sorters);
							strUrl = strUrl + me.getFilterUrl();
							me.enableDisableGroupActions( '000000000');
							grid.setLoading(true);
							grid.loadGridData(strUrl,
									me.handleAfterGridDataLoad, null);
						}
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


					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this;
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						var grid = me.getGrid();
                        if( !Ext.isEmpty( grid ) )
                        {
                                        var strDataUrl = grid.store.dataUrl;
                                        var store = grid.store;
                                        var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, newPgNo, oldPgNo, store.sorters );
                                        strUrl = strUrl + me.getFilterUrl();
                                        me.enableDisableGroupActions( '000000000');
                                        grid.setLoading( true );
                                        grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
                        }

					},

					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData) {		
						var me = this;
						var buttonMask = '0000000000';
						var maskArray = new Array(), actionMask = '', objData = null;
						;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
						}
						var isSameUser = true;
						var isDisabled = false;
						var isSubmit = false;
						var isEnabled = false;
						maskArray.push(buttonMask);
						for (var index = 0; index < selectedRecords.length; index++) {
							objData = selectedRecords[index];
							maskArray
									.push(objData.get('__metadata').__rightsMap);
							if (objData.raw.makerId === USER) {
								isSameUser = false;
							}
							if (objData.raw.validFlag != 'Y') {
								isEnabled = true;
							}

							if (objData.raw.validFlag == 'Y') {
								isDisabled = true;
							}

							if (objData.raw.isSubmitted == 'Y'
										&& objData.raw.requestState != 8
										&& objData.raw.requestState != 4
										&& objData.raw.requestState != 5) {
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
													}											
													  else if 
													  (item.maskPosition === 6 &&
													  blnEnabled) {
													  blnEnabled =  blnEnabled  && !isSubmit;
													  }
													 
													item
															.setDisabled(!blnEnabled);
												}
											});
						}
					},

					handleGroupActions : function(btn, record) {
						var me = this;
						var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName
								: btn.itemId;
						var strUrl = Ext.String.format('baseRatesMst/{0}.srvc',
								strAction);
						if (strAction === 'reject') {
							this.showRejectVerifyPopUp(strAction, strUrl,
									record);

						} else {
							this.preHandleGroupActions(strUrl, '', record);
						}

					},

					showRejectVerifyPopUp : function(strAction, strActionUrl,
							record) {
						var me = this;
						var titleMsg = '', fieldLbl = '';
						if (strAction === 'reject') {
							fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
									'Please Enter Reject Remark');
							titleMsg = getLabel('prfRejectRemarkPopUpFldLbl',
									'Reject Remark');
						}
						var msgbox = Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							multiline : true,
							cls:'t7-popup',
							width: 355,
							height : 270,
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
						msgbox.textArea.enforceMaxLength = true;
						msgbox.textArea.inputEl.set({
							maxLength : 255
						});
					},

					preHandleGroupActions : function(strUrl, remark, record) {
						var me = this;
						var grid = this.getGrid();
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var records = grid.getSelectedRecords();
							records = (!Ext.isEmpty(records) && Ext
									.isEmpty(record)) ? records : [ record ];
							for (var index = 0; index < records.length; index++) {
								arrayJson
										.push({
											serialNo : grid.getStore().indexOf(
													records[index]) + 1,
											identifier : records[index].data.identifier,
											userMessage : remark,
											recordDesc : records[index].data.baseRateType
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
											// TODO : Action Result handling to
											// be done here
											me.enableDisableGroupActions(
													'0000000000', true);
											// grid.refreshData();
											me.applyFilter();
											var errorMessage = '';
											if(response.responseText != '[]')
										       {
											        var jsonData = Ext.decode(response.responseText);
											        if(!Ext.isEmpty(jsonData))
											        {
											        	for(var i =0 ; i<jsonData.length;i++ )
											        	{
											        		var arrError = jsonData[i].errors;
											        		if(!Ext.isEmpty(arrError))
											        		{
											        			for(var j =0 ; j< arrError.length; j++)
													        	{
												        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
													        	}
											        		}
											        		
											        	}
												        if('' != errorMessage && null != errorMessage)
												        {
												         //Ext.Msg.alert("Error",errorMessage);
												        	Ext.MessageBox.show({
																title : getLabel('errorTitle','Error'),
																msg : errorMessage,
																buttons : Ext.MessageBox.OK,
																cls : 'ux_popup',
																icon : Ext.MessageBox.ERROR
															});
												        } 
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

					handleSmartGridConfig : function() {
						var me = this;
						var baseRateGrid = me.getBaseRateGrid();
						var objConfigMap = me.getBaseRateGridConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(baseRateGrid))
							baseRateGrid.destroy(true);

						arrCols = me.getColumns(objConfigMap.arrColsPref,
								objConfigMap.objWidthMap);
						me.handleSmartGridLoading(arrCols,
								objConfigMap.storeModel);

					},

					getBaseRateGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						objWidthMap = {
								"baseRateCurrency" : '15%',
								"baseRateType" : '20%',
								"baseRateDescription" : '45%',
								"requestStateDesc" : '19.7%'								
						};

						arrColsPref = [ {
							"colId" : "baseRateCurrency",
							"colDesc" : getLabel('currency','Currency'),
							"align" : "center"
						}, {
							"colId" : "baseRateType",
							"colDesc" : getLabel('baseRateCode','Base Rate Code')
						}, {
							"colId" : "baseRateDescription",
							"colDesc" :getLabel('prfMstDescription','Description')
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status')					
						} ];

						storeModel = {
							fields : [ 'baseRateCurrency', 'baseRateType',
									'baseRateDescription', 'requestStateDesc',
									'identifier', 'history', '__metadata',
									'viewState' ],
							proxyUrl : 'baseRatesMst.srvc',
							rootNode : 'd.baseRate',
							totalRowsNode : 'd.__count'
						};

						objConfigMap = {
							"objWidthMap" : objWidthMap,
							"arrColsPref" : arrColsPref,
							"storeModel" : storeModel
						};
						return objConfigMap;
					},

					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						arrCols.push( me.createGroupActionColumn() );
						arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for (var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								cfgCol.hidden = objCol.colHidden;
								cfgCol.align = objCol.align;
								
								if(objCol.colId == 'requestStateDesc')
								{
									cfgCol.locked = false;
									cfgCol.lockable = false;
									cfgCol.sortable = false;
									cfgCol.hideable = false;
									cfgCol.resizable = false;
									cfgCol.draggable = false;
									cfgCol.hidden = false;
								}
								
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 150;
								
								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},
					createGroupActionColumn : function()	{
						var me = this;
						var objActionCol = {
								colType : 'actioncontent',
								colId : 'groupaction',
								width : 130,
								locked : true,
								lockable : false,
								sortable : false,
								hideable : false,
								resizable : false,
								draggable : false,
								items: [{
											text : getLabel('prfMstActionSubmit', 'Submit'),
											itemId : 'submit',
											actionName : 'submit',
											maskPosition : 1
										},{
											text : getLabel('prfMstActionApprove', 'Approve'),
											itemId : 'accept',
											actionName : 'accept',
											maskPosition : 2
										},{
											text : getLabel('prfMstActionReject', 'Reject'),
											itemId : 'reject',
											actionName : 'reject',
											maskPosition : 3
										},{
											text : getLabel('prfMstActionDiscard', 'Discard'),
											itemId : 'discard',
											actionName : 'discard',
											maskPosition : 6
										},{
											text : getLabel('prfMstActionEnable', 'Enable'),
											itemId : 'enable',
											actionName : 'enable',
											maskPosition : 4
										}, {
											text : getLabel('prfMstActionDisable',	'Suspend'),
											itemId : 'disable',
											actionName : 'disable',
											maskPosition : 5
										}]
							};
							return objActionCol;
							
						},

					createActionColumn : function() {
						var me = this;
						var objActionCol = {
							colType : 'actioncontent',
							colId : 'actioncontent',
							visibleRowActionCount : 1,
							width : 45,
							locked : true,
							lockable : false,
							sortable : false,
							hideable : false,
							resizable : false,
							draggable : false,
							menuDisabled: true,
							items : 
								[
									{
										itemId : 'btnView',
										itemCls : 'grid-row-action-icon icon-view',
										toolTip : getLabel('viewToolTip', 'View Record'),
										itemLabel : getLabel('viewToolTip', 'View Record'),
										maskPosition : 7
									},
									{
										itemId : 'btnEdit',
										itemCls : 'grid-row-action-icon icon-edit',
										toolTip : getLabel('editToolTip', 'Edit'),
										itemLabel : getLabel('editToolTip', 'Edit'),
										maskPosition : 8										
									},
									{
										itemId : 'btnHistory',
										itemCls : 'grid-row-action-icon icon-history',
										toolTip : getLabel('historyToolTip', 'View History'),
										itemLabel : getLabel('historyToolTip', 'View History'),
										maskPosition : 9
									},
									{
										itemId : 'btnSpecialEdit',
										itemCls : 'grid-row-action-icon icon-clone',
										toolTip : getLabel('specialEditToolTip','Special Edit'),
										maskPosition : 10
									}
								]
						};
						return objActionCol;
					},

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";
						if (record.get('isEmpty')) {
							if (rowIndex === 0 && colIndex === 0) {
								meta.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
								return getLabel('gridNoDataMsg',
										'No records found!');
							}
						} else
							return value;

					},

					handleSmartGridLoading : function(arrCols, storeModel) {
						var me = this;
						var baseRateGrid = Ext
								.create(
										'Ext.ux.gcp.SmartGrid',
										{
											id : 'gridViewMstId',
											itemId : 'gridViewMstId',
											hideRowNumbererColumn : true,
											pageSize : _GridSizeMaster,
											stateful : false,
											showEmptyRow : false,
											padding : '0 10 10 10',
											rowList : _AvailableGridSize,
											minHeight : 0,
											width : '100%',
											columnModel : arrCols,
											storeModel : storeModel,
											isRowIconVisible : me.isRowIconVisible,
											handleRowMoreMenuClick : me.handleRowMoreMenuClick,

											handleRowIconClick : function(
													tableView, rowIndex,
													columnIndex, btn, event,
													record) {
												me.handleRowIconClick(
														tableView, rowIndex,
														columnIndex, btn,
														event, record);
											},

											handleMoreMenuItemClick : function(
													grid, rowIndex, cellIndex,
													menu, event, record) {
												var dataParams = menu.dataParams;
												me.handleRowIconClick(
														dataParams.view,
														dataParams.rowIndex,
														dataParams.columnIndex,
														menu, null,
														dataParams.record);
											}							
													
										});

						var baseRateDtlView = me
								.getBaseRateDtlView();
						baseRateDtlView.add(baseRateGrid);
						baseRateDtlView.doLayout();
					},

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'submit' || actionName === 'accept'
								|| actionName === 'enable'
								|| actionName === 'disable'
								|| actionName === 'reject'
								|| actionName === 'discard')
							me.handleGroupActions(btn, record);
						else if (actionName === 'btnHistory') {
							var recHistory = record.get('history');
							if (!Ext.isEmpty(recHistory)
									&& !Ext.isEmpty(recHistory.__deferred.uri)) {
								me.showHistory(record.get('baseRateDescription'),
										record.get('history').__deferred.uri,
										record.get('identifier'));
							}
						} else if (actionName === 'btnView') {
							me.submitExtForm('viewBaseRatesMst.srvc',
									record, rowIndex);
						} else if (actionName === 'btnEdit') {
							me.submitExtForm('editBaseRatesMst.srvc',
									record, rowIndex);
						}/* else if (actionName === 'btnSpecialEdit') {
							me.showSpecialEditWindow(record, rowIndex);
						}*/
					},
					submitExtForm : function(strUrl, record, rowIndex) {
						var me = this;
						var viewState = record.data.viewState;
						var updateIndex = rowIndex;
						var form, inputField;

						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'txtRecordIndex', rowIndex));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'viewState', viewState));

						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
					},

					showHistory : function(product, url, id) {
						Ext.create('GCP.view.BaseRateHistoryPopup', {
							productName : product,
							historyUrl : url,
							identifier : id
						}).show();
					},
					
					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						var maskSize = 10;
						var maskArray = new Array();
						var actionMask = '';
						var rightsMap = record.data.__metadata.__rightsMap;
						var buttonMask = '';
						var retValue = true;
						var bitPosition = '';
						if (!Ext.isEmpty(maskPosition)) {
							bitPosition = parseInt(maskPosition,10) - 1;
							maskSize = maskSize;
						}
						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask))
							buttonMask = jsonData.d.__buttonMask;
						maskArray.push(buttonMask);
						maskArray.push(rightsMap);
						actionMask = doAndOperation(maskArray, maskSize);
						var isSameUser = true;
						if (record.raw.makerId === USER) {
							isSameUser = false;
						}
						var reqState = record.raw.requestState;
						var submitFlag = record.raw.isSubmitted;
						var validFlag = record.raw.validFlag;

						if (Ext.isEmpty(bitPosition))
							return retValue;
						retValue = isActionEnabled(actionMask, bitPosition);
						if ((maskPosition === 2 && retValue)) {
							retValue = retValue && isSameUser;
						} else if (maskPosition === 3 && retValue) {
							retValue = retValue && isSameUser;
						}
						/*
						 * else if( maskPosition === 8 && retValue) // 0 means
						 * not done any special edit. Can allow normal edit. {
						 * if( specialEditStatus == 0 ) // Allow Edit { retValue =
						 * true; } else // Dont Allow Edit { retValue = false; } }
						 * else if( maskPosition == 10 ) // Allow Special Edit
						 * when Authorized and Special Edit not done. { if(
						 * reqState == 3 && validFlag == 'Y' && submitFlag ==
						 * 'N' && specialEditStatus == 0 ) { retValue = true; } }
						 * else if (maskPosition === 2 && retValue) { var
						 * reqState = record.raw.requestState; var submitFlag =
						 * record.raw.isSubmitted; var validFlag =
						 * record.raw.validFlag; var isDisabled = (reqState ===
						 * 3 && validFlag == 'N'); var isSubmitModified =
						 * (reqState === 1 && submitFlag == 'Y'); retValue =
						 * retValue && (!isDisabled) && (!isSubmitModified); }
						 * else if (maskPosition === 10 && retValue) { var
						 * reqState = record.raw.requestState; var submitFlag =
						 * record.raw.isSubmitted; var submitResult = (reqState
						 * === 0 && submitFlag == 'Y'); retValue = retValue &&
						 * (!submitResult); }else if (maskPosition === 8 &&
						 * retValue) { var validFlag = record.raw.validFlag; var
						 * reqState = record.raw.requestState; retValue =
						 * retValue && (reqState == 3 && validFlag == 'N'); }
						 * else if (maskPosition === 9 && retValue) { var
						 * validFlag = record.raw.validFlag; var reqState =
						 * record.raw.requestState; retValue = retValue &&
						 * (reqState == 3 && validFlag == 'Y'); }
						 */
						return retValue;
					},
					
					handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						var me = this;
						var menu = btn.menu;
						var arrMenuItems = null;
						var blnRetValue = true;
						var store = tableView.store;
						var jsonData = store.proxy.reader.jsonData;

						btn.menu.dataParams =
						{
							'record' : record,
							'rowIndex' : rowIndex,
							'columnIndex' : columnIndex,
							'view' : tableView
						};
						if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
							arrMenuItems = menu.items.items;
						if( !Ext.isEmpty( arrMenuItems ) )
						{
							for( var a = 0 ; a < arrMenuItems.length ; a++ )
							{
								blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
									arrMenuItems[ a ].maskPosition );
								arrMenuItems[ a ].setVisible( blnRetValue );
							}
						}
						menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
					},

					baseRateCurrencyChanged : function( combo )
					{
						var me = this;
						var comboValue =  '';
						if(!Ext.isEmpty(combo) && !Ext.isEmpty(combo.getValue())){
							comboValue = combo.getValue();
						}
						
						var objFilterPanel = me.getBaseRateSummaryFilterViewRef();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="baseRateType"]' );
						objAutocompleter.cfgUrl = 'services/userseek/baseRatesMstRateTypeSeek.json';
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