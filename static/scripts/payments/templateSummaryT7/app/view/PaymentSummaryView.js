/**
 * @class GCP.view.PaymentSummaryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'Ext.ux.gcp.AutoCompleter'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},

	createGroupView : function() {
		var me = this;
		var groupView = null, blnShowAdvancedFilter = true;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '';
		var objLocalGroupCode = null;

		if (objTemplateSummaryPref) {
			var objJsonData = Ext.decode(objTemplateSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');
		}
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
									&& objLocalData.d.preferences.tempPref 
									&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
            objLocalGroupCode = objLocalData && objLocalData.d.preferences
                    && objLocalData.d.preferences.tempPref 
                    && objLocalData.d.preferences.tempPref.groupTypeCode ? objLocalData.d.preferences.tempPref.groupTypeCode : null;									
		}
		
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			//cfgGroupByUrl : 'services/grouptype/templateSummaryT7/PT.json?$filterscreen=tempGroupViewFilter&$filterGridId=GRD_PAY_TEMPSUM',
			cfgGroupByUrl : 'services/grouptype/templateSummaryT7/PT.json?$filterGridId=GRD_PAY_TEMPSUM&$columnModel=true',
			cfgSummaryLabel : getLabel('templates', 'Templates'),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgGroupCode : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			// padding : '12 0 0 0',
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : false,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'container',
					itemId : 'clientContainer1',
					layout : 'vbox',
					// If count is one then hide
					hidden : (isClientUser() && me.getClientStore().getCount() <= 2)
							? true
							: false,
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								text : getLabel('lblcompany', 'Company Name'),
								flex : 1,
								padding : '0 0 0 0'
							}, {
								xtype : 'combo',
								valueField : 'CODE',
								displayField : 'DESCR',
								queryMode : 'local',
								// If Admin the Hide
								hidden : !isClientUser(),
								editable : false,
								triggerAction : 'all',
								width : '26%',
								itemId : 'quickFilterClientCombo',
								padding : '0 30 0 0',
								emptyText : getLabel('selectCompany',
										'Select Company Name'),
								store : me.getClientStore(),
								listeners : {
									/*boxready : function(combo, width, height,
											eOpts) {
										combo.setValue(combo.getStore()
												.getAt(0));
									}*/
								}
							}, {
								xtype : 'AutoCompleter',
								width : '23%',
								matchFieldWidth : true,
								name : 'clientCombo',
								itemId : 'quickFilterClientAutoComp',
								// If not Admin then Hide
								hidden : isClientUser(),
								cfgUrl : "services/userseek/userclients.json",
								padding : '-4 0 0 0',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'userclients',
								cfgKeyNode : 'CODE',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCR',
								emptyText : getLabel('searchByCompany',
										'Enter Keyword or %'),
								enableQueryParam : false,
								cfgProxyMethodType : 'POST'
							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					items : [{
						xtype : 'container',
						itemId : 'savedFiltersContainer',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						hidden : isHidden('AdvanceFilter'),
						items : [{
									xtype : 'label',
									itemId : 'savedFiltersLabel',
									text : getLabel('savedFilter',
											'Saved Filters')
								}, {
									xtype : 'combo',
									valueField : 'filterName',
									displayField : 'filterName',
									queryMode : 'local',
									editable : false,
									width : '100%',
									triggerAction : 'all',
									itemId : 'savedFiltersCombo',
									hidden : isHidden('AdvanceFilter'),
									mode : 'local',
									padding : '-4 0 0 0',
									emptyText : getLabel('selectfilter',
											'Select Filter'),
									store : me.savedFilterStore(),
									listeners : {
										'select' : function(combo, record) {
											me
													.fireEvent(
															"handleSavedFilterItemClick",
															combo.getValue(),
															combo.getRawValue());
										}
									}
								}]
					}, {
						xtype : 'container',
						itemId : 'statusContainer',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [{
									xtype : 'label',
									text : getLabel('lblStatus', 'Status')
								}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : '100%',
									padding : '-4 0 0 0',
									queryMode : 'local',
									itemId : 'statusCombo',
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
											$('#entryDataPicker').attr(
													'disabled', 'disabled');
										},
										'blur' : function(combo, record) {
											me
													.fireEvent(
															"handleStatusChangeInQuickFilter",
															combo);
										},
										'beforerender':function(){
										var storeCount=this.store.getCount();
										if(storeCount!=0)
										this.noData=true;
										}
									}
								})]
					}, {
						xtype : 'container',
						itemId : 'entryDateContainer',
						layout : 'vbox',
						width : '50%',
						padding : '0 30 0 0',
						items : [{
							xtype : 'panel',
							itemId : 'entryDatePanel',
							height : 23,
							flex : 1,
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'entryDateLabel',
										text : getLabel('startDate', 'Start Date')
									}, {
										xtype : 'button',
										border : 0,
										filterParamName : 'EntryDate',
										itemId : 'entryDatePicker',
										cls : 'ui-caret-dropdown',
										listeners : {
											click : function(event) {
												var menus = me.getEntryDateDropDownMenu()
												var xy = event.getXY();
												menus.showAt(xy[0], xy[1] + 16);
												event.menu = menus;
											}
										}
									}]
						}, {
							xtype : 'container',
							itemId : 'entryDateToContainer',
							layout : 'hbox',
							width : '50%',
							items : [{
								xtype : 'component',
								width : '85%',
								itemId : 'templateEntryDataPicker',
								filterParamName : 'EntryDate',
								html : '<input type="text"  id="templateDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
							}, {
								xtype : 'component',
								cls : 'icon-calendar',
								margin : '1 0 0 0',
								html : '<span class=""><i class="fa fa-calendar"></i></span>'
							}]
						}]
					}]
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return me.getActionColumns();
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : true,
				// showSummaryRow : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showEmptyRow : false,
				showPager : true,
				showPagerRefreshLink : false,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : false,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields : ['history', 'client', 'clientReference',
							'productType', 'productTypeDesc', 'entryDate',
							'module', 'txnDate', 'amount', 'actionStatus',
							'identifier', '__metadata', 'pirMode', 'count',
							'isActionTaken', 'currency', 'isConfidential',
							'isClone', 'uploadRef', 'paymentMethod', 'channel',
							'bankProduct', 'file', 'authNmbr', 'paymentType',
							'phdnumber', 'valueDate', 'maker', 'creditAmount',
							'debitAmount', 'recieverName', 'receiverCcy',
							'templateName', 'hostMessage', 'sendingAccount',
							'authLevel', 'txnType', 'version', 'paymentCcy',
							'recieverAccount', 'templateType',
							'enteredInstruments', 'companyId', 'referenceNo',
							'templateDescription', 'cutoffTime',
							'sendingAccountDescription',
							'templateMaxUsage', 'templateStartDate',
							'templateNoOfExec', 'productCategory',
							'templateEndDate', 'productCategoryDesc','anyIdType','anyIdTypeDesc','anyIdValue','receiverCode','receiverShortCode','beneBankDescription','beneBranchDescription','defaultAccount' ],
					proxyUrl : 'services/templatesbatch.json',
					rootNode : 'd.batch',
					totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example
				 * The example for groupActionModel as below : 
				 * 	[{
				 *	  //@requires Used while creating the action url.
				 *		actionName : 'submit',
				 *	  //@optional Used to display the icon.
				 *		itemCls : 'icon-button icon-submit',
				 *	  //@optional Defaults to true. If true , then the action will considered
				 *	            in enable/disable on row selection.
				 *		isGroupAction : false,
				 *	  //@optional Text to display
				 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				groupActionModel : me
						.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : (arrGenericColumnModel || TEMPLATE_GENERIC_COLUMN_MODEL || []),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				fnColumnRenderer : me.columnRenderer,
				/**
				 * @cfg{Function} fnSummaryRenderer Used as default column
				 *                summary renderer for all columns if
				 *                fnSummaryRenderer is not passed to the grids
				 *                column model
				 */
				// fnSummaryRenderer : function(value, summaryData, dataIndex,
				// rowIndex, colIndex, store, view, colId) {
				// },
				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * 
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) { 
				 * 	return true;
				 *}
				 * 
				 * @param {Ext.data.Store}
				 *            store The grid data store
				 * @param {Ext.data.Model}
				 *            record The record for current row
				 * @param {JSON}
				 *            jsonData The response json data
				 * @param {String}
				 *            iconName The name of the icon
				 * @param {Number}
				 *            maskPosition The position of the icon action in
				 *            bit mask
				 * @return{Boolean} Returns true/false
				 */
				fnRowIconVisibilityHandler : me.isRowIconVisible

			}
		});
		return groupView;
	},
	getEntryDateDropDownMenu : function() {
		    var intFilterDays = !Ext.isEmpty(filterDays)
		   ? parseInt(filterDays,10)
		    : '';
		   
			var arrMenuItem = [{
										text : getLabel('latest', 'Latest'),
										btnId : 'latest',
					btnValue : '12' 
										}
									];
		   

		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('today', 'Today'),
										btnId : 'btnToday',
										btnValue : '1'
										
									});	
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('yesterday',
												'Yesterday'),
										btnId : 'btnYesterday',
										btnValue : '2'
										
									});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
										btnId : 'btnThisweek',
										btnValue : '3'
										
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
										text : getLabel('lastweektodate',
												'Last Week To Date'),
										btnId : 'btnLastweek',
										btnValue : '4'
									});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thismonth',
												'This Month'),
										btnId : 'btnThismonth',
										btnValue : '5'
									});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastMonthToDate',
												'Last Month To Date'),
										btnId : 'btnLastmonth',
										btnValue : '6'
									});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
										text : getLabel('lastmonthonly',
												'Last Month Only'),
										btnId : 'btnLastmonthonly',
										btnValue : '14'
									});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisquarter',
												'This Quarter'),
										btnId : 'btnLastMonthToDate',
										btnValue : '8'
									});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('lastQuarterToDate',
												'Last Quarter To Date'),
										btnId : 'btnQuarterToDate',
										btnValue : '9'
									});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
										text : getLabel('thisyear', 'This Year'),
										btnId : 'btnLastQuarterToDate',
										btnValue : '10'
										});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
										text : getLabel('lastyeartodate',
												'Last Year To Date'),
										btnId : 'btnYearToDate',
										btnValue : '11'
										});
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			cls : 'ext-dropdown-menu',
			itemId : 'entryDateMenu',
			items :arrMenuItem
		})
		return dropdownMenu;
	},
	getPaymentTypeStore : function() {
		var dataPaymentTypes = null;
		var objPaymentTypesStore = null;
		Ext.Ajax.request({
					url : 'services/instrumentType.json',
					async : false,
					method : "POST",
					success : function(response) {
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (data && data.d) {
								dataPaymentTypes = data.d.instrumentType;
								objPaymentTypesStore = Ext.create(
										'Ext.data.Store', {
											fields : ['instTypeDescription',
													'instTypeCode'],
											data : dataPaymentTypes,
											reader : {
												type : 'json',
												root : 'd.instrumentType'
											},
											autoLoad : true,
											listeners : {
												load : function() {
													/*
													 * this.insert(0, {
													 * instTypeDescription :
													 * 'All', instTypeCode :
													 * 'all' });
													 */
												}
											}
										});
								objPaymentTypesStore.load();
							}
						}
					},
					failure : function(response) {
						// console.log('Error Occured');
					}
				});
		return objPaymentTypesStore;
	},
	getClientStore : function() {
		var clientData = null;
		var objClientStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode=' + strSeller,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE', 'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel(
																'allCompanies',
																'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/tempGroupViewFilter.json',
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
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		if (itmId == "btnQuickPay") {
			var paymentType = record.data.paymentType;
			if (!Ext.isEmpty(paymentType) && paymentType == "QUICKPAY")
				return true;
			else
				return false;
		} else {
			var maskSize = 21;
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
					&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
				buttonMask = jsonData.d.__metadata.__buttonMask;
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
			return retValue;
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		var multipleCcy = "<a title='"+ getLabel("iconBatchFcy", "Multiple Currencies")+ "' class='iconlink grdlnk-notify-icon icon-gln-fcy'></a>";
		if (colId === 'col_amount' || colId === 'col_creditAmount' || colId === 'col_debitAmount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('currency'))) {
					if(value === "--CONFIDENTIAL--")
					{
						strRetValue = value;
	        			meta['tdAttr'] = 'title="' + (strRetValue) + '"';						
					}
					else
					{
					strRetValue = multipleCcy + ' ' + setDigitAmtGroupFormat(value);
        			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
					}

				} else {
					if(value === "--CONFIDENTIAL--")
					{
						strRetValue = value;
						meta['tdAttr'] = 'title="' + (strRetValue) + '"';
					}
					else
					{
					strRetValue = record.get('currency') + ' ' + setDigitAmtGroupFormat(value);
					meta['tdAttr'] = 'title="' + (strRetValue) + '"';
				}
			}
			}
		} else if (colId === 'col_productType') {
			strRetValue = value;
			if (record.get('isConfidential') == "N") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchConfidential', 'Confidential')
						+ '" class="grid-row-action-icon icon-confidential xn-icon-16x16 smallmargin_lr"></a> ';
			}
			if (!Ext.isEmpty(record.get('isClone'))
					&& (!Ext.isEmpty(record.get('uploadRef')))
					&& record.get('isClone') != "Y") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchFileUpload', 'Import')
						+ '" class="grid-row-attach-icon xn-icon-16x16 smallmargin_lr"></a>';
			}
		}/*
		 * This code is commented for the JIRA FTMNTBANK-1705 else if (colId
		 * === 'col_enteredInstruments') { if (!record.get('isEmpty')) { if
		 * (!Ext.isEmpty(record.get('enteredInstruments')) &&
		 * !Ext.isEmpty(record.get('count')) &&
		 * (record.get('enteredInstruments') != record .get('count'))) { var
		 * strEnteredInstruments = record .get('enteredInstruments'); var
		 * strCount = record.get('count'); strRetValue =
		 * strEnteredInstruments + ' of ' + strCount; } else { strRetValue =
		 * value; } } }
		 */else if (colId === 'col_defaultAccount') {
				if(value === "Y")
					strRetValue = getLabel('yes', 'Yes');
				else if(value === "N")
					strRetValue = getLabel('no', 'No');
				
				meta['tdAttr'] = 'title="' + (strRetValue) + '"';
			}
		 else {
			strRetValue = value;
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		}
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Disable', 'Discard',
				'Submit', 'Authorize', 'Reject', 'Enable']);
		var objActions = {
			'Submit' : {
				/**
				 * @requires Used while creating the action url.
				 */
				actionName : 'submit',
				/**
				 * @optional Used to display the icon.
				 */
				// itemCls : 'icon-button icon-submit',
				/**
				 * @optional Defaults to true. If true , then the action will
				 *           considered in enable/disable on row selection.
				 */
				isGroupAction : true,
				/**
				 * @optional Text to display
				 */
				itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				/**
				 * @requires The position of the action in mask.
				 */
				maskPosition : 5
				/**
				 * @optional The position of the action in mask.
				 */
				// fnClickHandler : handleRejectAction
			},
			'Verify' : {
				actionName : 'verify',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('instrumentsActionVerify', 'Verify'),
				maskPosition : 13
			},
			'Authorize' : {
				actionName : 'auth',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('instrumentsActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Send' : {
				actionName : 'send',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('instrumentsActionSend', 'Send'),
				maskPosition : 8
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('instrumentsActionReturnToMaker', 'Reject'),
				maskPosition : 7

			},
			'Hold' : {
				actionName : 'hold',
				// itemCls : 'icon-button icon-hold',
				itemText : getLabel('instrumentsActionHold', 'Hold'),
				maskPosition : 10
			},
			'Release' : {
				actionName : 'release',
				// itemCls : 'icon-button icon-release',
				itemText : getLabel('instrumentsActionRelease', 'Release'),
				maskPosition : 11
			},
			'Stop' : {
				actionName : 'stop',
				// itemCls : 'icon-button icon-stop',
				itemText : getLabel('instrumentsActionStop', 'Stop'),
				maskPosition : 12
				// actionUrl : 'services/paymentsbatch/stop'
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				maskPosition : 9
			},
			'Disable' : {
				actionName : 'disable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('instrumentsActionDisable', 'Suspend'),
				maskPosition : 20
			},
			'Enable' : {
				actionName : 'enable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('instrumentsActionEnable', 'Enable'),
				maskPosition : 19
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]]);
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return (arrCols || []);
	},

	getActionColumns : function() {
		var me = this;
		var colGroupAction = me.createGroupActionColumn();
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			maskPosition : 16
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 15
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnCloneTemplate',
			itemCls : 'grid-row-action-icon icon-template',
			itemLabel : getLabel('cloneTemplateToolTip', 'Copy To Template'),
			maskPosition : 18
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : cloneToTemplate
			}];
		if(!Ext.isEmpty(allowHistory) && (allowHistory === 'Y')){
			var objAction =  {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 14
					}
			arrRowActions.splice(3, 0,objAction);
		}
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		return [colGroupAction];
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : colItems,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Submit' :
						itemsArray.push({
							text : getLabel('instrumentsActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 5
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
						break;
					case 'Discard' :
						itemsArray.push({
							text : getLabel('instrumentsActionDiscard',
									'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 9
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Verify' :
						itemsArray.push({
							text : getLabel('instrumentsActionVerify', 'Verify'),
							actionName : 'verify',
							itemId : 'verify',
							maskPosition : 13
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
						break;
					case 'Authorize' :
						itemsArray.push({
							text : getLabel('instrumentsActionApprove',
									'Approve'),
							actionName : 'auth',
							itemId : 'auth',
							maskPosition : 6
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Send' :
						itemsArray.push({
							text : getLabel('instrumentsActionSend', 'Send'),
							actionName : 'send',
							itemId : 'send',
							maskPosition : 8
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Reject' :
						itemsArray.push({
							text : getLabel('instrumentsActionReturnToMaker',
									'Reject'),
							actionName : 'reject',
							itemId : 'reject',
							maskPosition : 7
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Hold' :
						itemsArray.push({
							text : getLabel('instrumentsActionHold', 'Hold'),
							actionName : 'hold',
							itemId : 'hold',
							maskPosition : 10
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Release' :
						itemsArray.push({
							text : getLabel('instrumentsActionRelease',
									'Release'),
							actionName : 'release',
							itemId : 'release',
							maskPosition : 11
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Stop' :
						itemsArray.push({
							text : getLabel('instrumentsActionStop', 'Stop'),
							actionName : 'stop',
							itemId : 'stop',
							maskPosition : 12
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
					case 'Enable' :
						itemsArray.push({
							text : getLabel('instrumentsActionEnable', 'Enable'),
							actionName : 'enable',
							itemId : 'enable',
							maskPosition : 19
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
						break;
					case 'Disable' :
						itemsArray.push({
							text : getLabel('instrumentsActionDisable',
									'Suspend'),
							actionName : 'disable',
							itemId : 'disable',
							maskPosition : 20
								/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
							});
						break;
				}

			}
		}
		return itemsArray;
	},
	getStatusStore : function() {
		var objPayStatusStore = null;
		if (!Ext.isEmpty(arrPaymentStatus)) {
			objPayStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'desc'],
						data : arrPaymentStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPayStatusStore.load();
		}
		return objPayStatusStore;
	}

});