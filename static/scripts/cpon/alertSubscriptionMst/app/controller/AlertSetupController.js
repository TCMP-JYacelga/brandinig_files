Ext.define('GCP.controller.AlertSetupController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.AlertSetupView', 'GCP.view.AlertSetupFilterView',
			'GCP.view.AlertSetupGridView', 'GCP.view.AlertGroupActionBarView',
			'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'alertSetupView',
				selector : 'alertSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'alertSetupView alertSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'alertSetupView alertSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'moduleFilterPanel',
				selector : 'alertSetupView alertSetupFilterView panel[itemId="moduleFilter"]'
			}, {
				ref : 'alertSetupGridView',
				selector : 'alertSetupView alertSetupGridView'
			}, {
				ref : 'alertSetupFilterView',
				selector : 'alertSetupView alertSetupFilterView'
			}, {
				ref : 'alertSetupDtlView',
				selector : 'alertSetupView alertSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'alertSetupView alertSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'alertSetupGrid',
				selector : 'alertSetupView alertSetupGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'alertSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'alertSetupGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'alertSetupGridView smartgrid'
			}, {
				ref : "eventFilter",
				selector : 'alertSetupView alertSetupFilterView textfield[itemId="profileNameFltId"]'
			}, {
				ref : "financialComboFilter",
				selector : 'alertSetupView alertSetupFilterView combobox[itemId="sellerFltId"]'
			}, {
				ref : "moduleFilterCombo",
				selector : 'alertSetupView alertSetupFilterView combobox[itemId="moduleFltId"]'
			}, {
				ref : "statusFilter",
				selector : 'alertSetupView alertSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'alertSetupView alertSetupGridView alertGroupActionBarView'
			}, {
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'screenTitleLabel',
				selector : 'alertSetupView alertSetupTitleView label[itemId="pageTitle"]'
			}, {
				ref : 'subscriptionTypeToolBar',
				selector : 'alertSetupView alertSetupFilterView toolbar[itemId="subscriptionTypeToolBar"]'
			}, {
				ref : 'eventName',
				selector : 'alertSetupView alertSetupFilterView AutoCompleter[itemId="profileNameFltId"]'
			}, {
				ref : 'withHeaderCheckboxRef',
				selector : 'alertSetupView alertSetupTitleView menuitem[itemId="withHeaderId"]'
			}],
	config : {
		moduleTypeVal : 'All',
		moduleTypeDesc : 'all',
		// statusTypeVal : 'all',
		subscriptionTypeVal : 'all',
		filterData : []
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;

		me.control({
			'alertSetupView alertSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAlert"]' : {
				click : function() {
					me.handleAlertEntryAction(true);
				}
			},
			'alertSetupView alertSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBrandingPkg"]' : {
				click : function() {
					me.handleClientEntryAction(false);
				}
			},
			'alertSetupView alertSetupTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'alertSetupView alertSetupFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				},
				handleSubscriptionType : function(btn) {
					me.handleSubscriptionType(btn);
				}
			},
			'alertSetupView alertSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},

			handleModuleType : function(btn) {
				me.handleModuleType(btn);
			},
			'alertSetupView alertSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {

					me.handleGridHeader();

				}
			},
			'alertSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					// me.showBrandingPkgList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'alertSetupView alertSetupFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
				}
			},
			'alertSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'alertSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setFilterRetainedValues();
				}
			},
			'alertSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'alertSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'alertSetupGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'alertSetupGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var viscols;
		var col = null;
		var visColsStr = "";
		var colMap = new Object();
		var colArray = new Array();
		
		var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};

		strExtension = arrExtension[actionName];
		strUrl = 'services/getAlertSubcriptionMstList/getAlertSubcriptionMstDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		
		var strQuickFilterUrl = me.getFilterUrl();
		strUrl += strQuickFilterUrl;
		var grid = me.getGrid();
		viscols = grid.getAllVisibleColumns();
		for( var j = 0 ; j < viscols.length ; j++ )
		{
			col = viscols[ j ];
			if( col.dataIndex && arrSortColumn[ col.dataIndex ] )
			{
				if( colMap[ arrSortColumn[ col.dataIndex ] ] )
				{
					// ; do nothing
				}
				else
				{
					colMap[ arrSortColumn[ col.dataIndex ] ] = 1;
					colArray.push( arrSortColumn[ col.dataIndex ] );

				}
			}

		}
		if( colMap != null )
		{

			visColsStr = visColsStr + colArray.toString();
			strSelect = '&$select=[' + colArray.toString() + ']';
		}

		strUrl = strUrl + strSelect;
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
		
	},
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getEventName())) {
			me.getEventName().setValue('');
		}
		me.subscriptionTypeVal = 'all';
		var alertSetupFilterView = me.getAlertSetupFilterView();
		var moduleFltId = alertSetupFilterView
				.down('combobox[itemId=moduleFltId]');

		if (!Ext.isEmpty(moduleFltId)) {
			moduleFltId.setValue('All');
		}
	},
	changeFilterParams : function() {
		var me = this;
		var alertSetupFilterView = me.getAlertSetupFilterView();
		var sellerCombo = alertSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var profileNameFltAuto = alertSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');

		if (!Ext.isEmpty(profileNameFltAuto)) {
			profileNameFltAuto.cfgExtraParams = new Array();
		}

		if (!Ext.isEmpty(sellerCombo)) {
			if (!Ext.isEmpty(profileNameFltAuto)) {
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerCode',
							value : sellerCombo.getValue()
						});
			}
		} else {
			if (!Ext.isEmpty(profileNameFltAuto)) {
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerCode',
							value : strSellerId
						});
			}
		}
	},
	setFilterRetainedValues : function() {
		var me = this;
		var filterView = me.getSpecificFilterPanel();
		// Set Seller Id Filter Value
	//	var sellerFltId = filterView.down('combobox[itemId=sellerFltId]');
	//	sellerFltId.setValue(strSellerId);

		// set Event Name Filter Value
		me.getEventFilter().setValue(filterEventName);

		// Set Module Name Filter Value
		var moduleFilterView = me.getModuleFilterPanel();
		var moduleFltId = moduleFilterView.down('combobox[itemId=moduleFltId]');
		moduleFltId.store.loadRawData([{
					"value" : filterModule,
					"name" : filterModuleDesc
				}]

		);
		moduleFltId.suspendEvents();
		moduleFltId.setValue(filterModule);
		moduleFltId.resumeEvents();

		// Set Matrix Type Filter Value
		var alertTypeToolBar = me.getSubscriptionTypeToolBar();
		alertTypeToolBar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');

					if (item.code == filterAlertType) {
						item.addCls('xn-custom-heighlight');
						me.subscriptionTypeVal = item.code;
					}

				});
		me.changeFilterParams();
	},
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
		var multipleSellersAvailable = false;
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
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
		objStore.load();
		if (objStore.getCount() > 1) {
			multipleSellersAvailable = true;
		}
		var moduleStore = Ext.create('Ext.data.Store', {
					fields : ['value', 'name'],
					proxy : {
						type : 'ajax',
						url : 'services/alertEventModules.json'
					},
					autoLoad : false
				});
		var filterPanel = me.getSpecificFilterPanel();
		var modulePanel = me.getModuleFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
		filterPanel.add({
			xtype : 'panel',
			cls : 'xn-filter-toolbar',
			layout : 'vbox',
			itemId : 'comboParentPanel',
			hidden : multipleSellersAvailable ? false :true,
			// columnWidth : 0.60,
			items : [{
				xtype : 'label',
				text : getLabel('financialInstitution', 'Financial Institution'),
				cls : 'frmLabel'
			}, {
				xtype : 'combo',
				// columnWidth : 0.50,
				displayField : 'DESCR',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'sellerId',
				itemId : 'sellerFltId',
				valueField : 'CODE',
				name : 'sellerCombo',
				width : 170,
				editable : false,
				value : strSellerId,
				store : objStore,
				listeners : {
					'render' : function(combo, record) {
						combo.store.load();
					},
					'select' : function(combo, strNewValue, strOldValue) {
						setAdminSeller(combo.getValue());
						me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
				        }
				}
			}]
		});
		filterPanel.show();
		if (!Ext.isEmpty(modulePanel)) {
			modulePanel.removeAll();
		}

		modulePanel.add({
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					 columnWidth : 1.0,
					items : [{
								xtype : 'label',
								text : getLabel('module', 'Module'),
								cls : 'frmLabel'
							}, {
								xtype : 'combo',
								width: '80%',
								displayField : 'name',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'moduleId',
								itemId : 'moduleFltId',
								valueField : 'value',
								name : 'sellerCombo',
								editable : false,
								// value : me.moduleTypeVal,
								store : moduleStore
							}]
				});

	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel;
		if(ACCESSNEW){
			createNewPanel	= me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel)) {
				createNewPanel.removeAll();
			}
			createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('alertSubscription',
								'Alert Subscription'),
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s cursor_pointer',
						parent : this,
						padding : '12 0 12 0',
						itemId : 'btnCreateAlert'
					});
		}
	},
	handleSubscriptionType : function(btn) {
		var me = this;
		var subscriptionTypeToolBarRef = me.getSubscriptionTypeToolBar();

		if (!Ext.isEmpty(subscriptionTypeToolBarRef)) {
			subscriptionTypeToolBarRef.items.each(function(item) {

						item.removeCls('xn-custom-heighlight');
					});
		}
		btn.addCls('xn-custom-heighlight');
		me.subscriptionTypeVal = btn.code;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},

	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
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
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				case 'statusFilterOp' :
					var objValue = filterData[index].paramValue1;
					var objUser = filterData[index].makerUser;
					var objArray = objValue.split(',');
					for (var i = 0; i < objArray.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
							if(objArray[i] == 12){
								strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
							}
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq "+objArray[i]+")";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
							if(i == (objArray.length -1))
							strTemp = strTemp + ')';
					}
				break;
				default :
					// Default opertator is eq
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
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

	setDataForFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');

		var eventValue = null, statusVal = null, clientVal = null, jsonArray = [];
		var sellerVal = null;
		var module = null, type = null;
		if (!Ext.isEmpty(me.subscriptionTypeVal)
				&& "all" != me.subscriptionTypeVal) {
			type = me.subscriptionTypeVal;
		}
		if (!Ext.isEmpty(type)) {
			jsonArray.push({
						paramName : 'subscriptiontype',
						paramValue1 : encodeURIComponent(type.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		var approvalWorkflowFilterView = me.getSpecificFilterPanel();
		var sellerFltId = approvalWorkflowFilterView
				.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}
		if (!Ext.isEmpty(sellerVal)) {
			sellerVal = sellerVal.toUpperCase();
		}
		jsonArray.push({
			paramName : sellerFltId.filterParamName,
			paramValue1 : encodeURIComponent(sellerVal.replace(new RegExp("'", 'g'), "\''")),
			operatorValue : 'eq',
			dataType : 'S'
		});
		if (!Ext.isEmpty(me.getEventFilter())
				&& !Ext.isEmpty(me.getEventFilter().getValue())) {
			eventValue = me.getEventFilter().getValue();
		}
		if (eventValue != null) {
			jsonArray.push({
						paramName : me.getEventFilter().name,
						paramValue1 : encodeURIComponent(eventValue.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		var moduleFilterView = me.getModuleFilterPanel();
		var moduleFltId = moduleFilterView.down('combobox[itemId=moduleFltId]');
		if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue())) {
			module = moduleFltId.getValue();
		}
		if (!Ext.isEmpty(module) && "All" != module) {
			jsonArray.push({
						paramName : moduleFltId.filterParamName,
						paramValue1 : encodeURIComponent(module.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())) {
			statusVal = me.getStatusFilter().getValue();
		}
	if (!Ext.isEmpty(statusVal) && "ALL" != statusVal) {
			jsonArray.push({
						paramName : me.getStatusFilter().filterParamName,
						paramValue1 : encodeURIComponent(statusVal.replace(new RegExp("'", 'g'), "\''")),
						makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'statusFilterOp',
						dataType : 'S'
					});
	}
	
		me.filterData = jsonArray;

	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartGridConfig : function() {
		var me = this;
		var alertGrid = me.getAlertSetupGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(alertGrid))
			alertGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = _GridSizeMaster;
		scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : 10,
					stateful : false,
					showEmptyRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					// isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					},

					handleMoreMenuItemClick : function(grid, rowIndex,
							cellIndex, menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,
								dataParams.rowIndex, dataParams.columnIndex,
								menu, null, dataParams.record);
					}
				});

		var clntSetupDtlView = me.getAlertSetupDtlView();
		clntSetupDtlView.add(scmProductGrid);
		clntSetupDtlView.doLayout();
	},

	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('description'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewAlertSubcriptionMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editAlertSubcriptionMst.form', record, rowIndex);
		}
	},
	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},

	showHistory : function(product, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					clientName : product,
					historyUrl : url,
					identifier : id
				}).show();
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,			
			locked : true,
			resizable : false,
			lockable : false,
			sortable : false,
			hideable : false,
			draggable : false,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						toolTip : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;

	},

	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,			
			locked : true,
			resizable : false,
			lockable : false,
			sortable : false,
			hideable : false,
			draggable : false,
			items : [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable', 'Suspend'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);

							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/alertSubcriptionMst/{0}',
				strAction);
		strUrl = strUrl + '.srvc?';
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);

		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
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
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.description
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
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
												title : getLabel('instrumentErrorPopUpTitle','Error'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
								        } 
							        }
						       }
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId = 'subcriptionType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('subcriptionType')) && 'S' == value) {
					strRetValue = getLabel('standard', 'Standard');
				} else if (!Ext.isEmpty(record.get('subcriptionType'))
						&& 'T' == value) {
					strRetValue = getLabel('custom', 'Custom');
				} else {
					strRetValue = value;
				}
			}

		}
		if (colId = 'col_startDate') {
			var strdate = (record.data.startDate).split(" ");
			record.data.startDate = strdate[0];
		}

		return strRetValue;
	},

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"description" : 140,
			"subcriptionType" : 100,
			"eventDesc" : 150,
			"subcriptionCategory" : 130,
			"recipientDesc" : 135,
			"startDate" : 130,
			"requestStateDesc" : 100
		};

		arrColsPref = [{
					"colId" : "description",
					"colDesc" :  getLabel('subscriptionName', 'Subscription Name'),
					"sort" : true

				}, {
					"colId" : "subcriptionType",
					"colDesc" :  getLabel('alertType', 'Alert Type'),
					"sort" : true
				}, {
					"colId" : "eventDesc",
					"colDesc" :  getLabel('event', 'Event'),
					"sort" : true
				}, {
					"colId" : "subcriptionCategory",
					"colDesc" :  getLabel('recipientCat', 'Recipient Category'),
					"sort" : true
				}, {
					"colId" : "recipientDesc",
					"colDesc" :  getLabel('recipient', 'Recipient'),
					"sort" : true
				}, {
					"colId" : "startDate",
					"colDesc" :  getLabel('effFrmDate', 'Effective From Date'),
					"sort" : true
				}, {
					"colId" : "requestStateDesc",
					"colDesc" :  getLabel('status', 'Status'),
					"sort" : false
				}];

		storeModel = {

			fields : ['subscriptionName', 'description', 'subcriptionType',
					'eventName', 'recipientName', 'startDate',
					'subcriptionCategory', 'beanName', 'beneName',
					'primaryKey', 'history', 'identifier', 'requestStateDesc',
					'parentRecordKey', 'version', 'recipientDesc', 'eventDesc',
					'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
			proxyUrl : 'cpon/alertSubcriptionMst.json',
			rootNode : 'd.profile',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
	searchOnPage : function() {
		var me = this;
		var searchValue = me.getSearchTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	handleAlertEntryAction : function(entryType) {
		var me = this;
		var form;
		var sellerCombo = me.getFinancialComboFilter();
		if (sellerCombo) {
			var selectedSeller = sellerCombo.getValue();
		}
		var strUrl = 'addAlertSubcriptionMst.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				selectedSeller));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var matrixTypeVal = null, matrixNameVal = null, module = null, type = null, eventValue = null;
		var arrJsn = {};
		var avmSvmFilterView = me.getSpecificFilterPanel();
		var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');
		var moduleFilterView = me.getModuleFilterPanel();
		var moduleFltId = moduleFilterView.down('combobox[itemId=moduleFltId]');
		if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue())) {
			module = moduleFltId.getValue();
		}
		if (!Ext.isEmpty(me.subscriptionTypeVal)
				&& "all" != me.subscriptionTypeVal) {
			type = me.subscriptionTypeVal;
		}
		var selectedSeller = sellerCombo.getValue();
		if (!Ext.isEmpty(me.getEventFilter())
				&& !Ext.isEmpty(me.getEventFilter().getValue())) {
			eventValue = me.getEventFilter().getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['module'] = module;
		arrJsn['moduleDesc'] = moduleFltId.getRawValue();
		arrJsn['alertType'] = type;
		arrJsn['eventName'] = eventValue;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
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
					target : 'alertSetupFilterView-1020_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var event = '';
							var institute = '';
							var moduleType = '';
							var subType = '';
							var approvalWorkflowFilterView = me
									.getSpecificFilterPanel();
							// var eventId =
							// approvalWorkflowFilterView.down('textfield[itemId="profileNameFltId"]');
							var eventId = me.getEventFilter()
							if (!Ext.isEmpty(me.getFinancialComboFilter())
									&& !Ext.isEmpty(me
											.getFinancialComboFilter()
											.getValue())) {
								var combo = me.getFinancialComboFilter();
								institute = combo.getRawValue()
							} else {
								institute = getLabel('none', 'None');
							}

							if (!Ext.isEmpty(me.getModuleFilterPanel())
									&& !Ext.isEmpty(me.getModuleFilterCombo()
											.getValue())) {
								var combo = me.getModuleFilterCombo();
								moduleType = combo.getRawValue()
							} else {
								moduleType = getLabel('all', 'All');
							}

							if (!Ext.isEmpty(eventId) && eventId.getValue()) {
								event = eventId.getValue();
							} else {
								event = getLabel('none', 'None');
							}

							if (me.subscriptionTypeVal == 'S') {
								subType = getLabel('standard', 'Standard');
							} else if (me.subscriptionTypeVal == 'T') {
								subType = getLabel('custom', 'Custom');
							} else {
								subType = getLabel('all', 'All');
							}
							
							var sellerCombo = me.getAlertSetupFilterView()
							.down('combobox[itemId=sellerFltId]');
							
							if(sellerCombo.store.getCount() > 1) {
							
							tip.update(getLabel("financialinstiute",
									"Financial Instiution")
									+ ' : '
									+ institute
									+ '<br/>'
									+ getLabel('module', 'Module')
									+ ' : '
									+ moduleType
									+ '<br/>'
									+ getLabel('lblType', 'Type')
									+ ' : '
									+ subType
									+ '<br/>'
									+ getLabel('event', 'Event')
									+ ' : '
									+ event);
							}
							else {
								tip.update(getLabel('module', 'Module')
								+ ' : '
								+ moduleType
								+ '<br/>'
								+ getLabel('lblType', 'Type')
								+ ' : '
								+ subType
								+ '<br/>'
								+ getLabel('event', 'Event')
								+ ' : '
								+ event);
							}
						}
					}
				});
	},
	getDescription : function(code) {
		var maplabels = {
				'CU':'CU-Customer User',
				'CE':'CE-Customer External',
				'BU':'BU-Bank User',
				'BE':'BE-Bank External' }
		return maplabels[code];
	}

});
