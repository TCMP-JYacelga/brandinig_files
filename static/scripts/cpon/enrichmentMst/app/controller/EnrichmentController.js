Ext.define('GCP.controller.EnrichmentController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.ComboBox'],
	views : ['GCP.view.EnrichmentSetupView','GCP.view.EnrichmentSetupFilterView','GCP.view.EnrichmentSetupGridView','GCP.view.EnrichmentGroupActionBarView','GCP.view.HistoryPopup','Ext.util.Point'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [ {
				ref : 'createNewToolBar',
				selector : 'enrichmentSetupView enrichmentSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'enrichmentSetupView enrichmentSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'alertSetupDtlView',
				selector : 'enrichmentSetupView enrichmentSetupGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'sellerFilterPanel',
				selector : 'enrichmentSetupView enrichmentSetupFilterView container panel[itemId="sellerFilter"]'
			},{
				ref : 'sellerCombo',
				selector : 'enrichmentSetupView enrichmentSetupFilterView panel[itemId="sellerFilter"] combo[itemId="sellerCombo"]'
			}, {
				ref : 'drawerSetupFilterView',
				selector : 'enrichmentSetupView enrichmentSetupFilterView'
			},{
				ref : 'gridHeader',
				selector : 'enrichmentSetupView enrichmentSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'enrichmentSetupGrid',
				selector : 'enrichmentetupView enrichmentetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'enrichmentSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'enrichmentetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'enrichmentSetupGridView smartgrid'
			}, {
				ref : 'alertSetupGrid',
				selector : 'enrichmentSetupView enrichmentSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'clientInlineBtn',
				selector : 'enrichmentSetupView enrichmentetupFilterView button[itemId="clientBtn"]'
			},{
				ref : 'clientNamesFilterAuto',
				selector : 'enrichmentSetupView enrichmentSetupFilterView AutoCompleter[itemId=clientAutoCompleter]'
			}, {
				ref : 'profileNameFilterAuto',
				selector : 'enrichmentSetupView enrichmentSetupFilterView AutoCompleter[itemId=profileNameFltId]'
			}, {
				ref : 'tansactionFilterCombo',
				selector : 'enrichmentSetupView enrichmentSetupFilterView combo[itemId=profileTxnTypeFltId]'
			}, {
				ref : 'satusCombo',
				selector : 'enrichmentSetupView enrichmentSetupFilterView combo[itemId=profileStatusFltId]'
			}, {
				ref : 'groupActionBar',
				selector : 'enrichmentSetupView enrichmentSetupGridView enrichmentGroupActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'enrichmentSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},
			{
				ref : 'screenTitleLabel',
				selector : 'enrichmentSetupView enrichmentSetupTitleView label[itemId="pageTitle"]'
			},{
				ref : 'subscriptionTypeToolBar',
			   selector : 'enrichmentSetupView enrichmentSetupFilterView toolbar[itemId="subscriptionTypeToolBar"]'
			}],
	config : {
	
						filterData : [],
						sellerOfSelectedClient : '',
						clientCode : '',
						clientDesc : ''						
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		me.control({
			'enrichmentSetupView enrichmentSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAlert"]' : {
				click : function() {
	                 me.handleEnrichmentEntryAction(true);
				}
			},
			'enrichmentSetupView enrichmentSetupFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.setDataForFilter();
					me.applyFilter();
				},
		      	handleSubscriptionType : function(btn) {
				     me.handleSubscriptionType(btn);
				}
			},
				
		     
			'enrichmentSetupView enrichmentSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
		
			/*'enrichmentSetupView enrichmentSetupFilterView container AutoCompleter[itemId="profileNameFltId"]' : {
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			},			
           'enrichmentSetupView enrichmentSetupFilterView container AutoCompleter[itemId="catNameFltId"]' : {
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			},	
           'enrichmentSetupView enrichmentSetupFilterView container combobox[itemId="profileTxnTypeFltId"]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
         'enrichmentSetupView enrichmentSetupFilterView container combobox[itemId="profileStatusFltId"]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},	
           'enrichmentSetupView enrichmentSetupFilterView combobox[itemId=sellerCombo]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.setDataForFilter();
					me.applyFilter();
				}
			},	*/		
			'enrichmentSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			
			
			'enrichmentSetupGridView smartgrid' : {
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
			'enrichmentSetupGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'enrichmentSetupView enrichmentSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		});
	},
	changeFilterParams : function() {
		var me = this;
		var drawerSetupFilterView = me.getDrawerSetupFilterView();
		var profileNameFltAuto = drawerSetupFilterView
				.down('AutoCompleter[itemId=profileNameFltId]');
			if (!Ext.isEmpty(profileNameFltAuto)) {
				profileNameFltAuto.cfgExtraParams = new Array();
			}
			if (!Ext.isEmpty(profileNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				profileNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			
	},	
	
	resetAllFilters : function() {
		var me = this;
		if(isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				//me.getClientInlineBtn().setText(getLabel('allCompanies', 'All Companies'));
			}
		else	
			if (!Ext.isEmpty(me.getClientNamesFilterAuto())) {
				me.getClientNamesFilterAuto().setValue('');
			}
		if (!Ext.isEmpty(me.getProfileNameFilterAuto())) {
			me.getProfileNameFilterAuto().setValue('');
		}if (!Ext.isEmpty(me.getCategoryFilterAuto())) {
			me.getCategoryFilterAuto().setValue('');
		}if (!Ext.isEmpty(me.getTansactionFilterCombo())) {
			me.getTansactionFilterCombo().setValue('ALL');
		}if (!Ext.isEmpty(me.getSatusCombo())) {
			me.getSatusCombo().setValue('ALL');
		}
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
		var sellerStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		if (sellerStore.getCount() > 1) {
			multipleSellersAvailable = true;
		}
		
	  var sellerPanel = me.getSellerFilterPanel();
	 if (!Ext.isEmpty(sellerPanel)) {
			sellerPanel.removeAll();
		}
		sellerPanel.add({
					xtype : 'label',
					text : getLabel('financialInstitution',
							'Financial Institution'),
					cls :'frmLabel'
				}, {
					xtype : 'combo',
					width : 200,
					displayField : 'DESCR',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerId',
					itemId : 'sellerCombo',
					valueField : 'CODE',
					name : 'sellerCombo',
					editable : false,
					value : strSellerId,
					store : sellerStore,
					listeners : {
						'render' : function(combo, record) {
							combo.store.load();
							var profNameFilter = me.getProfileNameFilterAuto();
							profNameFilter.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
						},
						'select' : function(combo, record) {
							var newValue = combo.getValue();
							setAdminSeller(newValue);
							var profNameFilter = me.getProfileNameFilterAuto();
							profNameFilter.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : newValue
								}
							];
						}
					}
				});
			sellerPanel.show();
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel;
		if(ACCESSNEW){
			createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}
			createNewPanel.add(
				{
					xtype : 'button',
					border : 0,
					text : getLabel('enrichment', 'Enrichment'),
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s ',
					parent : this,
					//	padding : '4 0 2 0',
					itemId : 'btnCreateAlert'
				}
			);
		}
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
		var sellerVal = null, receiverNameVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var sellerVal = null;
		var sellerParam = null;
		var catVal=null,tansactionVal=null,statusVal=null;
		var isPending = true;
		var drawerSetupFilterView = me.getDrawerSetupFilterView();
		var profileNameFltAuto = drawerSetupFilterView
				.down('combobox[itemId=profileNameFltId]');
		var tansactionFltId = drawerSetupFilterView
				.down('combobox[itemId=profileTxnTypeFltId]');
		var statusFltId = drawerSetupFilterView
				.down('combobox[itemId=profileStatusFltId]');
		var sellerCombo = me.getSellerCombo();
		
		if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
			sellerParam = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(profileNameFltAuto)
				&& !Ext.isEmpty(profileNameFltAuto.getValue())) {
			receiverName = profileNameFltAuto.getValue(), receiverNameVal = receiverName
					.trim();
		}
		if (!Ext.isEmpty(tansactionFltId)
				&& !Ext.isEmpty(tansactionFltId.getValue())) {
			tansactionVal = tansactionFltId.getValue();
		}
		if (!Ext.isEmpty(statusFltId) && (getLabel('all', 'All').toLowerCase()) != ((statusFltId.getValue())).toLowerCase()
				&& !Ext.isEmpty(statusFltId.getValue())) {
			statusVal = statusFltId.getValue();
		}

		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : 'profileName',
						paramValue1 : encodeURIComponent(receiverNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
        if (!Ext.isEmpty(catVal)) {
			jsonArray.push({
						paramName : 'categoryCode',
						paramValue1 : encodeURIComponent(catVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(tansactionVal) && tansactionVal !="ALL") {
			jsonArray.push({
						paramName : 'txnType',
						paramValue1 : encodeURIComponent(tansactionVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(statusVal) && statusVal!="ALL") {
	    if (statusVal == 13 )//Pending My Approval
			{
				me.statusKeyFilter  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : me.statusKeyFilter,
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
			if (isPending)
			{
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12:New  Submitted //14:Modified Submitted
				{
					statusVal = (statusVal == 12) ? 0:1;
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
								jsonArray.push({
								paramName : 'requestState',
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
				
		}
		}
		
		if (!Ext.isEmpty(sellerParam)) {
			sellerParam = sellerParam.toUpperCase();
		}

		jsonArray.push({
			paramName : sellerCombo.filterParamName,
			paramValue1 : encodeURIComponent(sellerParam.replace(new RegExp("'", 'g'), "\''")),
			operatorValue : 'eq',
			dataType : 'S'
		});
		
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
		var objConfigMap = me.getEnrichmentGridConfiguration();
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
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
				//	padding : '5 0 0 0',
					cls:'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
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
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('profileName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = Ext.String.format('{0}EditProfileMst.form',
					"enrichment");
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = Ext.String.format('{0}ViewProfileMst.form',
					"enrichment");
			me.submitForm(strUrl, record, rowIndex);
		} /*else if (actionName === 'btnProductView') {
			var strUrl = Ext.String.format('viewPaymentPackageProduct.form',
					me.selectedPrfMst);
			me.submitForm(strUrl, record, rowIndex);
		}*/ else {

		}
	},
  submitForm : function(strUrl, record, rowIndex) {
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
		/*if (strUrl == 'viewPaymentPackageProduct.form') {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'hdrViewState', viewState));
		}*/
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(profileName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					profileName : profileName,
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
			var submitFlag = record.raw.isSubmitted;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
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
			width : 85,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
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
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
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
						text : getLabel('prfMstActionDisable', 'Disable'),
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
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
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
			strUrl = Ext.String.format('cpon/{0}ProfileMst/{1}',
					'enrichment', strAction);
		
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);

		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
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
                            if (Ext.isEmpty(text)) {
                                 Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectEmptyErrorMsg',
                                    'Reject Remarks cannot be blank'));
                             }else{
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
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.profileName
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
							if(!Ext.isEmpty(response.responseText))
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

	getEnrichmentGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"clientDesc" : 150,
			"drawerName" : 150,	
			"requestStateDesc" : 90		};

			arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('enrichmentName','Enrichment Name'),
								"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('totalEnrichments','Total Enrichments #'),
							"colType" : "number",
							"sort" :false
								
						}, {
							"colId" : "txnTypeDesc",
							"colDesc" : getLabel('transactionType','Transaction Type'),
								"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}];

				storeModel = {
					fields : ['history', 'profileName', 'txnType',
							'txnTypeDesc', 'dtlCount', 'requestStateDesc',
							'identifier', '__metadata', 'profileId'],
					proxyUrl : 'cpon/enrichmentProfileMst.json',
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
	
	handleEnrichmentEntryAction : function(entryType) {
		var me = this;
		var form;
		var sellerCombo = me.getSellerCombo();
	    strUrl = "addEnrichmentProfileMst.form";
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
        
		if (sellerCombo) {
				var selectedSeller = sellerCombo.getValue();
			}
	    form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
					selectedSeller));
					
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var profileNameVal = null,catVal=null;
		var arrJsn = {};
		var drawerSetupFilterView = me.getDrawerSetupFilterView();
		
		var profileNameFltId = drawerSetupFilterView
				.down('combobox[itemId=profileNameFltId]');
		
				
		if (!Ext.isEmpty(profileNameFltId)
				&& !Ext.isEmpty(profileNameFltId.getValue())) {
			profileNameVal = profileNameFltId.getValue();
		}
		
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;
 
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
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var drawerSetupFilterView = me.getDrawerSetupFilterView();
							var status = drawerSetupFilterView.down('combobox[itemId=profileStatusFltId]');
							var FI = me.getSellerCombo().getRawValue();
							var transactionType = drawerSetupFilterView.down('combobox[itemId=profileTxnTypeFltId]');
							var drawerNameFltId = drawerSetupFilterView
									.down('combobox[itemId=profileNameFltId]');
							
							if (!Ext.isEmpty(drawerNameFltId)
									&& !Ext.isEmpty(drawerNameFltId.getValue())) {
								profileName =drawerNameFltId.getValue();
							}else
								profileName = getLabel('none','None');		

                            if (!Ext.isEmpty(status)
									&& !Ext.isEmpty(status.getValue())) {
								status = status.getRawValue();
							}else
								status = getLabel('all','ALL');	
                            
                              if (!Ext.isEmpty(transactionType)
									&& !Ext.isEmpty(transactionType.getValue())) {
								transactionType = transactionType.getRawValue();
							}else
								transactionType = getLabel('none','None');							
							
							tip.update(
							        getLabel('financialinstitution', 'Financial Institution') + ' : ' 
							        + FI + '<br/>'
							        + getLabel('profileName', 'Profile') + ' : '
									+ profileName+ '<br/>'
									+ getLabel('transactionType', 'Transaction Type') + ' : '
									+ transactionType+'</br>'
									+ getLabel('status', 'Status')+':'
									+ status);
							
						}
					}
				});
	}

});
