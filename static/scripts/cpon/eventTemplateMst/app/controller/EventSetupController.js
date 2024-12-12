Ext.define('GCP.controller.EventSetupController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.EventSetupView', 'GCP.view.EventSetupFilterView',
			'GCP.view.EventSetupGridView', 'GCP.view.EventGroupActionBarView',
			'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'alertSetupView',
				selector : 'eventSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'eventSetupView eventSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'eventSetupFilterView',
				selector : 'eventSetupView eventSetupFilterView'
			}, {
				ref : 'specificFilterPanel',
				selector : 'eventSetupView eventSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'moduleFilterPanel',
				selector : 'eventSetupView eventSetupFilterView panel[itemId="moduleFilter"]'
			}, {
				ref : 'alertSetupGridView',
				selector : 'eventSetupView eventSetupGridView'
			}, {
				ref : 'alertSetupDtlView',
				selector : 'eventSetupView eventSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'moduleTypeToolBar',
				selector : 'eventSetupView eventSetupFilterView toolbar[itemId="moduleTypeToolBar"]'
			}, {
				ref : 'gridHeader',
				selector : 'eventSetupView eventSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'alertSetupGrid',
				selector : 'eventSetupView eventSetupGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'eventSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'eventSetupGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'eventSetupGridView smartgrid'
			}, {
				ref : "eventFilter",
				selector : 'eventSetupView eventSetupFilterView textfield[itemId="profileNameFltId"]'
			}, {
				ref : "teplateNameFilter",
				selector : 'eventSetupView eventSetupFilterView textfield[itemId="templateNameFltId"]'
			}, {
				ref : "financialComboFilter",
				selector : 'eventSetupView eventSetupFilterView combobox[itemId="sellerFltId"]'
			}, {
				ref : "moduleComboFilter",
				selector : 'eventSetupView eventSetupFilterView combobox[itemId="moduleFltId"]'
			}, {
				ref : "statusFilter",
				selector : 'eventSetupView eventSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'eventSetupView eventSetupGridView eventGroupActionBarView'
			}, {
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'screenTitleLabel',
				selector : 'eventSetupView eventSetupTitleView label[itemId="pageTitle"]'
			}, {
				ref : 'subscriptionTypeToolBar',
				selector : 'eventSetupView eventSetupFilterView toolbar[itemId="subscriptionTypeToolBar"]'
			},{
				ref : 'withHeaderCheckboxRef',
				selector : 'eventSetupView eventSetupTitleView menuitem[itemId="withHeaderId"]'
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
			'eventSetupView eventSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAlert"]' : {
				click : function() {
					me.handleAlertEntryAction(true);
				}
			},
			'eventSetupView eventSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBrandingPkg"]' : {
				click : function() {
					me.handleClientEntryAction(false);
				}
			},
			'eventSetupView eventSetupTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'eventSetupView eventSetupFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					// me.displayModules();
				},

				/*
				 * handleModuleType : function(btn) { me.handleModuleType(btn); },
				 */
				/*
				 * handleStatusType : function(btn) { me.handleStatusType(btn); },
				 */
				handleSubscriptionType : function(btn) {
					me.handleSubscriptionType(btn);
				}
			},
			'eventSetupView eventSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},

			handleModuleType : function(btn) {
				me.handleModuleType(btn);
			},
			'eventSetupView eventSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {

					me.handleGridHeader();

				}
			},
			'eventSetupView eventSetupFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
				}
			},
			'eventSetupView eventSetupFilterView combobox[itemId=moduleFltId]' : {
				change : function(btn, opts) {
					me.resetEventFilter();
					me.changeFilterParams();
				}
			},
			'eventSetupView eventSetupFilterView combobox[itemId=profileNameFltId]' : {
				change : function(btn, opts) {
					me.changeFilterParams();
				}
			},
			'eventSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					// me.showBrandingPkgList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'eventSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'eventSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setFilterRetainedValues();
				}
			},
			'eventSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'eventSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},

			'eventSetupGridView smartgrid' : {
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
			'eventSetupGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
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
		strUrl = 'services/getEventTemplateMstList/getEventTemplateMstDynamicReport.' + strExtension;
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
		var eventSetupFilterView = me.getEventSetupFilterView();
		var moduleFltId = eventSetupFilterView
				.down('combobox[itemId=moduleFltId]');
		var profileNameFltId = eventSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		var templateNameFltId = eventSetupFilterView
				.down('AutoCompleter[itemId=templateNameFltId]');

		if (!Ext.isEmpty(moduleFltId)) {
			moduleFltId.setValue('All');
		}

		if (!Ext.isEmpty(moduleFltId)) {
			profileNameFltId.setValue('');
		}

		if (!Ext.isEmpty(moduleFltId)) {
			templateNameFltId.setValue('');
		}
	},
	resetEventFilter : function() {
		var me = this;
		var eventSetupFilterView = me.getEventSetupFilterView();
		var moduleFltId = eventSetupFilterView
				.down('combobox[itemId=moduleFltId]');
		var profileNameFltId = eventSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
		var templateNameFltId = eventSetupFilterView
				.down('AutoCompleter[itemId=templateNameFltId]');

		if (!Ext.isEmpty(moduleFltId)) {
			profileNameFltId.setValue('');
		}

		if (!Ext.isEmpty(moduleFltId)) {
			templateNameFltId.setValue('');
		}
	},
	changeFilterParams : function() {
		var me = this;
		var eventSetupFilterView = me.getEventSetupFilterView();
		var sellerCombo = eventSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var profileNameFltAuto = eventSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');

		var templateNameFltIdAuto = eventSetupFilterView
				.down('AutoCompleter[itemId=templateNameFltId]');

		var moduleFltId = eventSetupFilterView.down('combobox[itemId=moduleFltId]');

		if (!Ext.isEmpty(profileNameFltAuto))
		{
			profileNameFltAuto.cfgExtraParams = new Array();
			if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue()))
			{
				profileNameFltAuto.cfgExtraParams.push({
					key : '$filterCode1',
					value : moduleFltId.getValue()
				});
			}
		}

		if (!Ext.isEmpty(templateNameFltIdAuto))
		{
			templateNameFltIdAuto.cfgExtraParams = new Array();
			
			if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue()))
			{
				templateNameFltIdAuto.cfgExtraParams.push({
					key : '$filterCode1',
					value : moduleFltId.getValue()
				});
			}
			if (!Ext.isEmpty(profileNameFltAuto) && !Ext.isEmpty(profileNameFltAuto.getValue()))
			{
				templateNameFltIdAuto.setValue('');
				templateNameFltIdAuto.cfgExtraParams.push({
					key : '$filterCode2',
					value : profileNameFltAuto.getValue()
				});
			}
			
		}

		if (!Ext.isEmpty(sellerCombo)) {
			if (!Ext.isEmpty(profileNameFltAuto)) {
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerCode',
							value : sellerCombo.getValue()
						});

				if (!Ext.isEmpty(templateNameFltIdAuto)) {
					templateNameFltIdAuto.cfgExtraParams.push({
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

				if (!Ext.isEmpty(templateNameFltIdAuto)) {
					templateNameFltIdAuto.cfgExtraParams.push({
								key : '$sellerCode',
								value : strSellerId
							});
				}
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
		me.getTeplateNameFilter().setValue(filterMsgTemplate);
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
						url : 'services/eventModules.json'
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
			hidden : multipleSellersAvailable ? false :true, 
			itemId : 'comboParentPanel',
			// columnWidth : 0.30,
			items : [{
				xtype : 'label',
				text : getLabel('financialInstitution', 'Financial Institution'),
				cls : 'frmLabel'
			}, {
				xtype : 'combo',
				// columnWidth : 0.20,
				width : 165,
				displayField : 'DESCR',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'sellerId',
				itemId : 'sellerFltId',
				valueField : 'CODE',
				name : 'sellerCombo',
				editable : false,
				value : strSellerId,				
				store : objStore,
				listeners : {
					'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
					        }
					  } 
			}]
		});
		if (!Ext.isEmpty(modulePanel)) {
			modulePanel.removeAll();
		}
		modulePanel.add({
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					// columnWidth : 0.60,
					items : [{
								xtype : 'label',
								text : getLabel('module', 'Module'),
								cls : 'frmLabel'
							}, {
								xtype : 'combo',
								//columnWidth : 0.50,
								width : 150,
								displayField : 'name',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'moduleId',
								itemId : 'moduleFltId',
								valueField : 'value',
								name : 'moduleCombo',
								editable : false,
								value : me.moduleTypeVal,
								store : moduleStore
							}]
				});

	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel;
		if(ACCESSNEW){			
			createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel)) {
				createNewPanel.removeAll();
			}
			createNewPanel.add({
				xtype : 'button',
				border : 0,
				text : getLabel('alertMessageTemp',
						'Alert Message Template'),
				glyph : 'xf055@fontawesome',
				cls : 'xn-btn ux-button-s cursor_pointer',
				parent : this,
				padding : '12 0 12 0',
				itemId : 'btnCreateAlert'
			});
		}
},
	/*
	 * displayModules : function() { var me = this; var objModulePanel =
	 * me.getModuleTypeToolBar(); Ext.Ajax .request({ url :
	 * 'services/getModuleList.json?', method : "POST", async : false, success :
	 * function(response) { if (!Ext.isEmpty(response.responseText)) { var data =
	 * Ext .decode(response.responseText); if(data.length>0){ var modules =
	 * data.d.manageAlerts; for ( var i = 0; i < 3; i++) { if
	 * (!Ext.isEmpty(modules[i])) { objModulePanel .add({ text :
	 * modules[i].moduleName, code : modules[i].moduleCode, btnDesc :
	 * modules[i].moduleName, btnId : modules[i].moduleCode, parent : this, cls :
	 * 'f13', handler : function( btn, opts) { me .handleModuleType(btn); } }); } }
	 * if (modules.length > 3) { objModulePanel .add({ text : getLabel( 'more',
	 * 'more>>'), code : 'lnkmore', btnDesc : getLabel( 'more', 'more>>'), btnId :
	 * 'lnkmore', parent : this, cls : 'f13', handler : function( btn, opts) {
	 * me .handleModuleType(btn); } }); } } } }, failure : function(response) { //
	 * console.log('Error // Occured-addAllAccountSet'); } }); },
	 */
	/*
	 * handleModuleType : function(btn) {
	 * 
	 * var me = this; var moduleTypeToolBarRef = me.getModuleTypeToolBar();
	 * 
	 * if (!Ext.isEmpty(moduleTypeToolBarRef)) {
	 * moduleTypeToolBarRef.items.each(function(item) {
	 * item.removeCls('xn-custom-heighlight'); }); }
	 * btn.addCls('xn-custom-heighlight'); me.moduleTypeVal = btn.code;
	 * me.moduleTypeDesc = btn.btnDesc; me.setDataForFilter(); me.applyFilter(); },
	 * handleSubscriptionType : function(btn) { var me = this; var
	 * subscriptionTypeToolBarRef = me .getSubscriptionTypeToolBar();
	 * 
	 * if (!Ext.isEmpty(subscriptionTypeToolBarRef)) {
	 * subscriptionTypeToolBarRef.items .each(function(item) {
	 * 
	 * item.removeCls('xn-custom-heighlight'); }); }
	 * btn.addCls('xn-custom-heighlight'); me.subscriptionTypeVal = btn.code;
	 * me.setDataForFilter(); me.applyFilter(); },
	 */
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
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5')) and makerId ne '"+objUser+"' )";
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
		var messageValue = null;
		var module = null, type = null;

		/*
		 * if (!Ext.isEmpty(me.moduleTypeVal) && "all" != me.moduleTypeVal) {
		 * module = me.moduleTypeVal; } if (!Ext.isEmpty(module)) {
		 * jsonArray.push({ paramName : 'eventmodule', paramValue1 : module,
		 * operatorValue : 'eq', dataType : 'S' }); }
		 */
		/*
		 * if (!Ext.isEmpty(me.subscriptionTypeVal) && "all" !=
		 * me.subscriptionTypeVal) { type = me.subscriptionTypeVal; } if
		 * (!Ext.isEmpty(type)) { jsonArray.push({ paramName :
		 * 'subscriptiontype', paramValue1 : type, operatorValue : 'eq',
		 * dataType : 'S' }); }
		 */
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
		if (!Ext.isEmpty(me.getTeplateNameFilter())
				&& !Ext.isEmpty(me.getTeplateNameFilter().getValue())) {
			messageValue = me.getTeplateNameFilter().getValue();
		}
		if (messageValue != null) {
			jsonArray.push({
						paramName : me.getTeplateNameFilter().name,
						paramValue1 : encodeURIComponent(messageValue.replace(new RegExp("'", 'g'), "\''")),
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
		pgSize = 10;
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
				me.showHistory(record.get('eventTemplateDesc'), record
								.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewEventTemplateMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editEventTemplateMst.form', record, rowIndex);
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
			hideable : false,
			width : 80,
			locked : true,
			sortable : false,
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
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					},{
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					},{
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					},{
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					},{
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Suspend'),
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
		var strUrl = Ext.String.format('cpon/eventTemplateMst/{0}.srvc', strAction);
			strUrl = strUrl + '?' + csrfTokenName + '=' + csrfTokenValue;
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
							recordDesc : records[index].data.eventTemplateDesc
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
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
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"eventTemplateDesc" : 200,
			"eventModule" : 80,
			"eventGroup" : 80,
			"eventDesc" : 170,
			"deliveryMedium" : 200,
			"requestStateDesc" : 90
		};

		arrColsPref = [{
					"colId" : "eventTemplateDesc",
					"colDesc" : getLabel('alertMessageTempName','Alert Message Template Name')
				}, {
					"colId" : "eventModuleDesc",
					"colDesc" : getLabel('module','Module')
				}, {
					"colId" : "eventGroup",
					"colDesc" : getLabel('group','Group')
				}, {
					"colId" : "eventDesc",
					"colDesc" : getLabel('event','Event')
				}, {
					"colId" : "deliveryMedium",
					"colDesc" : getLabel('delMedium','Delivery Medium')
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('status','Status')
				}];

		storeModel = {
			fields : ['eventTemplateName', 'eventModule', 'eventGroup',
					'eventDesc', 'deliveryMedium', 'beneName', 'primaryKey',
					'history', 'identifier', 'requestStateDesc',
					'parentRecordKey', 'version', 'recordKeyNo',
					'masterRecordkeyNo', '__metadata', 'eventTemplateDesc',
					'eventModuleDesc'],
			proxyUrl : 'cpon/eventTemplateMst.json',
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
		var strUrl = 'addEventTemplateMst.form';
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
		var selectedSeller = null, module = null, messageTempleteValue = null, eventValue = null;
		var arrJsn = {};
		var avmSvmFilterView = me.getSpecificFilterPanel();
		var sellerCombo = me.getFinancialComboFilter();
		var moduleFilterView = me.getModuleFilterPanel();
		var moduleFltId = moduleFilterView.down('combobox[itemId=moduleFltId]');
		if (!Ext.isEmpty(moduleFltId) && !Ext.isEmpty(moduleFltId.getValue())) {
			module = moduleFltId.getValue();
		}
		if (!Ext.isEmpty(me.getTeplateNameFilter())
				&& !Ext.isEmpty(me.getTeplateNameFilter().getValue())) {
			messageTempleteValue = me.getTeplateNameFilter().getValue();
		}
		if (sellerCombo) {
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(me.getEventFilter())
				&& !Ext.isEmpty(me.getEventFilter().getValue())) {
			eventValue = me.getEventFilter().getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['module'] = module;
		arrJsn['moduleDesc'] = moduleFltId.getRawValue();
		arrJsn['messageTemplete'] = messageTempleteValue;
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
					target : 'eventSetupFilterView-1020_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var institute = '';
							var event = '';
							var alertMessage = '';
							var moduleType = '';

							var approvalWorkflowFilterView = me
									.getSpecificFilterPanel();
							// var eventId =
							// approvalWorkflowFilterView.down('textfield[itemId="profileNameFltId"]');
							var eventId = me.getEventFilter()
							var meassageId = approvalWorkflowFilterView
									.down('textfield[itemId="templateNameFltId"]');

							if (!Ext.isEmpty(me.getFinancialComboFilter())
									&& !Ext.isEmpty(me
											.getFinancialComboFilter()
											.getValue())) {
								var combo = me.getFinancialComboFilter();
								institute = combo.getRawValue()
							} else {
								institute = getLabel('all', 'ALL');
							}
							if (!Ext.isEmpty(me.getModuleFilterPanel())
									&& !Ext.isEmpty(me.getModuleComboFilter()
											.getValue())) {
								var combo = me.getModuleComboFilter();
								moduleType = combo.getRawValue()
							} else {
								moduleType = getLabel('all', 'All');
							}
							if (!Ext.isEmpty(eventId)
									&& !Ext.isEmpty(eventId.getValue())) {
								event = eventId.getValue();
							} else {
								event = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(meassageId)
									&& !Ext.isEmpty(meassageId.getValue())) {
								alertMessage = meassageId.getValue();
							} else {
								alertMessage = getLabel('none', 'None');
							}
							
							var sellerCombo = me.getEventSetupFilterView()
							.down('combobox[itemId=sellerFltId]');
							
							if(sellerCombo.store.getCount() > 1) {

							tip.update(getLabel("financialInstitution",
									"Financial Instiution")
									+ ' : '
									+ institute
									+ '<br/>'
									+ getLabel('module', 'Module')
									+ ' : '
									+ moduleType
									+ '<br/>'
									+ getLabel('alertMessageTempName',
											'Alert Message Template')
									+ ' : '
									+ alertMessage
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
								+ getLabel('alertMessageTempName',
										'Alert Message Template')
								+ ' : '
								+ alertMessage
								+ '<br/>'
								+ getLabel('event', 'Event')
								+ ' : '
								+ event);
								
							}

						}
					}
				});
	}

});
