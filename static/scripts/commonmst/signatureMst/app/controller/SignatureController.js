Ext.define('GCP.controller.SignatureController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.ComboBox','Ext.util.Point'],
	views : ['GCP.view.SignatureSetupView','GCP.view.SignatureSetupFilterView','GCP.view.SignatureSetupGridView','GCP.view.SignatureGroupActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [ {
				ref : 'createNewToolBar',
				selector : 'signatureSetupView signatureSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'signatureSetupView signatureSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'signatureSetupDtlView',
				selector : 'signatureSetupView signatureSetupGridView panel[itemId="signatureSetupDtlView"]'
			},{
				ref : 'sellerFilterPanel',
				selector : 'signatureSetupView signatureSetupFilterView container panel[itemId="sellerFilter"]'
			},{
				ref : 'sellerCombo',
				selector : 'signatureSetupView signatureSetupFilterView panel[itemId="sellerFilter"] combo[itemId="sellerCombo"]'
			}, {
				ref : 'signatureSetupFilterView',
				selector : 'signatureSetupView signatureSetupFilterView'
			},{
				ref : 'gridHeader',
				selector : 'signatureSetupView signatureSetupGridView panel[itemId="signatureSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'signatureSetupGrid',
				selector : 'signatureSetupView signatureSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'signatureSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'signatureSetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'signatureSetupGridView smartgrid'
			}, {
				ref : 'signatureSetupGrid',
				selector : 'signatureSetupView signatureSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'entityCodeFilterAuto',
				selector : 'signatureSetupView signatureSetupFilterView AutoCompleter[itemId=entityCodeFltId]'
			},{
				ref : 'entityTypeFilterAuto',
				selector : 'signatureSetupView signatureSetupFilterView combo[itemId=entityTypeFltId]'
			},
			{
				ref : 'sigAccNmbrFilterAuto',
				selector : 'signatureSetupView signatureSetupFilterView AutoCompleter[itemId=sigAccNmbrFltId]'
			},{
				ref : 'signatoryCodeFltIdAuto',
				selector : 'signatureSetupView signatureSetupFilterView AutoCompleter[itemId=signatoryCodeFltId]'
			},{
				ref : 'statusCombo',
				selector : 'signatureSetupView signatureSetupFilterView combo[itemId=sigStatusFltId]'
			}, {
				ref : 'groupActionBar',
				selector : 'signatureSetupView signatureSetupGridView signatureGroupActionBarView'
			},
			{
				ref : 'screenTitleLabel',
				selector : 'signatureSetupView signatureSetupTitleView label[itemId="pageTitle"]'
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
			'signatureSetupView signatureSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateSign"]' : {
				click : function() {
	                 me.handleSignatureEntryAction(true);
				}
			},
			'signatureSetupView signatureSetupFilterView' : {
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
				
		     
			'signatureSetupView signatureSetupGridView panel[itemId="signatureSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			
			'signatureSetupView signatureSetupFilterView combo[itemId=entityTypeFltId]' : 
						{
							change : function( combo, record, index )
							{
								var entityCode = me.getEntityCodeFilterAuto();
								
							entityCode.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record
									
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							var sigAccNmbr = me.getSigAccNmbrFilterAuto();
							sigAccNmbr.cfgExtraParams =
							[
								{
									key : '$filtercode5',
									value : record
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							}
						},
		
				'signatureSetupView signatureSetupFilterView AutoCompleter[itemId=entityCodeFltId]' : 
						{
							change : function( combo, record, index )
							{
								var sigAccNmbr = me.getSigAccNmbrFilterAuto();
							sigAccNmbr.cfgExtraParams =
							[
								{
									key : '$filtercode2',
									value : record
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
								
							];
							var signtryCode = me.getSignatoryCodeFltIdAuto();
							signtryCode.cfgExtraParams =
							[
								{
									key : '$filtercode2',
									value : record
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							}
						},
	
			'signatureSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			
			
			'signatureSetupGridView smartgrid' : {
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
			'signatureSetupGridView toolbar[itemId=SignatureGroupActionBarView_Dtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'signatureSetupView signatureSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		});
	},
	changeFilterParams : function() {
		var me = this;
		var signatureSetupFilterView = me.getSignatureSetupFilterView();
		var profileNameFltAuto = signatureSetupFilterView
				.down('combo[itemId=entityTypeFltId]');
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
		if (!Ext.isEmpty(me.getEntityCodeFilterAuto())) {
			me.getEntityCodeFilterAuto().setValue('');
		}if (!Ext.isEmpty(me.getCategoryFilterAuto())) {
			me.getCategoryFilterAuto().setValue('');
		}if (!Ext.isEmpty(me.getStatusCombo())) {
			me.getStatusCombo().setValue('ALL');
		}
	},	
	
	handleSpecificFilter : function() {
		var me = this;
		var storeData;

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
					triggerBaseCls : 'xn-form-trigger ux_width17',
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
							var entityCode = me.getEntityCodeFilterAuto();
							entityCode.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							var sigaccno1 = me.getSigAccNmbrFilterAuto();
							sigaccno1.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							var signtryCode1 = me.getSignatoryCodeFltIdAuto();
							signtryCode1.cfgExtraParams =
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
							var profNameFilterf = me.getEntityCodeFilterAuto();
							profNameFilterf.cfgExtraParams =
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
		var createNewPanel;
		if(ACCESSNEW === true){
			createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}
			createNewPanel.add(
				{
					xtype : 'button',
					border : 0,
					text : getLabel('signature', 'Signature'),
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s ',
					parent : this,
					//	padding : '4 0 2 0',
					itemId : 'btnCreateSign'
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
		var isPending = true;
		me.getSearchTextInput().setValue('');
		var  entityTypeVal = null,accountNumber = null, entityCodeVal =null, accountNumberVal = null, signatoryCodeVal = null, jsonArray = [];
		var sellerParam = null,entityCode =null,entityType = null ;
		var statusVal=null,signatoryCode = null;
		var signatureSetupFilterView = me.getSignatureSetupFilterView();
		var entityTypeFltAuto = signatureSetupFilterView
				.down('combobox[itemId=entityTypeFltId]');
		var entityCodeFltAuto = signatureSetupFilterView
				.down('combobox[itemId=entityCodeFltId]');		
		var sigAccNmbrFltAuto = signatureSetupFilterView
				.down('combobox[itemId=sigAccNmbrFltId]');
		var signatoryCodeFltAuto = signatureSetupFilterView
				.down('combobox[itemId=signatoryCodeFltId]');			
		var statusFltId = signatureSetupFilterView
				.down('combobox[itemId=sigStatusFltId]');
		var sellerCombo = me.getSellerCombo();
		
		if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
			sellerParam = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(entityTypeFltAuto) && (getLabel('all', 'All').toLowerCase()) != ((entityTypeFltAuto.getValue())).toLowerCase()
                && !Ext.isEmpty(entityTypeFltAuto.getValue())) {
			entityType = entityTypeFltAuto.getValue(), entityTypeVal = entityType
					.trim();
		}
		if (!Ext.isEmpty(entityCodeFltAuto)
				&& !Ext.isEmpty(entityCodeFltAuto.getValue())) {
			entityCode = entityCodeFltAuto.getValue(), entityCodeVal = entityCode
					.trim();
		}
		if (!Ext.isEmpty(sigAccNmbrFltAuto)
				&& !Ext.isEmpty(sigAccNmbrFltAuto.getValue())) {
			accountNumber = sigAccNmbrFltAuto.getValue(), accountNumberVal = accountNumber
					.trim();
		}
		if (!Ext.isEmpty(signatoryCodeFltAuto)
				&& !Ext.isEmpty(signatoryCodeFltAuto.getValue())) {
			signatoryCode = signatoryCodeFltAuto.getValue(), signatoryCodeVal = signatoryCode
					.trim();
		}
		if (!Ext.isEmpty(statusFltId) && (getLabel('all', 'All').toLowerCase()) != ((statusFltId.getValue())).toLowerCase()
				&& !Ext.isEmpty(statusFltId.getValue())) {
			statusVal = statusFltId.getValue();
		}

		if (!Ext.isEmpty(entityTypeVal)) {
			jsonArray.push({
						paramName : 'entityType',
						paramValue1 : encodeURIComponent(entityTypeVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
			if (!Ext.isEmpty(entityCodeVal)) {
			jsonArray.push({
						paramName : 'entityCode',
						paramValue1 : encodeURIComponent(entityCodeVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
        if (!Ext.isEmpty(accountNumberVal)) {
			jsonArray.push({
						paramName : 'accountNumber',
						paramValue1 : encodeURIComponent(accountNumberVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		 if (!Ext.isEmpty(signatoryCodeVal)) {
			jsonArray.push({
						paramName : 'signatoryCode',
						paramValue1 : encodeURIComponent(signatoryCodeVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(statusVal) && statusVal!="ALL") {
			if (statusVal == 13)
			{
				statusVal  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
				jsonArray.push({
							paramName : 'maker',
							paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'ne',
							dataType : 'S'
						});
			}
			if(isPending)
			{
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) // 12: New Submitted , 14: Modified Submitted
				{
					statusVal = (statusVal == 12)? 0:1;
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
		var signatureSetupGrid = me.getSignatureSetupGrid();
		var objConfigMap = me.getSignatureGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(signatureSetupGrid))
			signatureSetupGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var signatureGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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

		var signatureSetupDtlView = me.getSignatureSetupDtlView();
		signatureSetupDtlView.add(signatureGrid);
		signatureSetupDtlView.doLayout();
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
				me.showHistory(record.get('signatoryName'),record.get('identifier'));
		} else if (actionName === 'btnEdit') {
			var strUrl = 'editSignatureMst.srvc';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			 strUrl = 'viewSignatureMst.srvc';
			me.submitForm(strUrl, record, rowIndex);
		}
	},
  submitForm : function(strUrl, record, rowIndex) {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(masterName, id) {
		Ext.create('GCP.view.HistoryPopup', {
					masterName : masterName,
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
		
		var reqState = record.raw.requestState;

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			 submitFlag = record.raw.isSubmitted;
			retValue = retValue
					&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			 validFlag = record.raw.validFlag;
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
				cfgCol.hidden = objCol.colHidden;
				cfgCol.hidden = objCol.colHidden;
				cfgCol.sortable =  objCol.sort;
				
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
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
			locked : true,
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
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,
			locked : true,
			items : [{
						text : getLabel('sigMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('sigMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('sigMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('sigMstsigMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('sigMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('sigMstActionDisable', 'Disable'),
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
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		 strUrl = Ext.String.format('services/signatureMst/{0}.srvc?',
				strAction);
		
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
			fieldLbl = getLabel('sigRejectRemarkPopUpTitle',
					'Please enter reject remark');
			titleMsg = getLabel('sigRejectRemarkPopUpFldLbl', 'Reject Remark');
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
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
		if(colId === 'col_effectiveFrom' || colId === 'col_effectiveTo')
		{
				var arrDateString = value.split(" ");
				strRetValue = arrDateString[0];
		}
		else if(colId === 'col_defaultSign1')
		{
			if(record.data.defaultSign1 === 'Y')
			{
				strRetValue = getLabel('default1', 'Default 1');	
			}
			else if(record.data.defaultSign2 === 'Y')
			{
				strRetValue = getLabel('default2', 'Default 2');	
			}
			else if(record.data.defaultSign3 === 'Y')
			{
				strRetValue = getLabel('default3', 'Default 3');	
			}
		}
		else if(colId === 'col_whtSign')
		{
			if(record.data.whtSign === 'Y')
			{
				strRetValue = getLabel('YES', 'Yes');	
			}
			else
			{
				strRetValue = getLabel('NO', 'No');	
			}
		}
		else
		{
			strRetValue = value;
		}

		return strRetValue;
	},

	getSignatureGridConfiguration : function() {
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {};

			arrColsPref = [{
							"colId" : "entityType",
							"colDesc" : getLabel('entityType','Entity Type'),
							"sort" :true,
							"colHidden" : false
						},{
							"colId" : "entityCodeDesc",
							"colDesc" : getLabel('entityCodeDesc','Entity'),
							"sort" :true,
							"colHidden" : false
						},{
							"colId" : "accountNumber",
							"colDesc" : getLabel('accountNumber','Client A/C'),
							"sort" :true,
							"colHidden" : false
						}, {
							"colId" : "signatoryCodeDesc",
							"colDesc" : getLabel('signatoryCode','Signatory Code'),
							"sort" :true,
							"colHidden" : false
						},{
							"colId" : "signatoryName",
							"colDesc" : getLabel('signatoryName','Signatory Name'),
							"sort" :true,
							"colHidden" : false
						}, {
							"colId" : "defaultSign1",
							"colDesc" : getLabel('defaultSign1','Default Signatory'),
							"sort" :false,
							"colHidden" : false
						}, {
							"colId" : "whtSign",
							"colDesc" : getLabel('whtSign','Default WHT Signatory'),
							"sort" :true,
							"colHidden" : true
						}, {
							"colId" : "effectiveFrom",
							"colDesc" : getLabel('effectiveFrom','Effective From'),
							"sort" :true,
							"colHidden" : true
						}, {
							"colId" : "effectiveTo",
							"colDesc" : getLabel('effectiveTo','Effective To'),
							"sort" :true,
							"colHidden" : true
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('requestStateDesc','Status'),
							"sort" :false,
							"colHidden" : false
						}];

				storeModel = {
					fields : ['entityType','signatoryCode','signatoryCodeDesc', 'entityCodeDesc', 'accountNumber',
					          'signatoryName', '__metadata', 'requestStateDesc', 'effectiveFrom', 'effectiveTo',
					          'defaultSign1', 'defaultSign2', 'defaultSign3','whtSign', 'viewState','identifier'],
					proxyUrl : 'services/getSignatureMstList.json',
					rootNode : 'd.recordList',
					totalRowsNode : 'd.__count'
				};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	
	handleSignatureEntryAction : function(entryType) {
		var me = this;
		var form;
		var sellerCombo = me.getSellerCombo();
	    var strUrl = "addSignatureMst.srvc";
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
        var signatureSetupFilterView = me.getSignatureSetupFilterView();
		
		var entityTypeFltId = signatureSetupFilterView
				.down('combobox[itemId=entityTypeFltId]');
		
				
		if (!Ext.isEmpty(entityTypeFltId)
				&& !Ext.isEmpty(entityTypeFltId.getValue())) {
			profileNameVal = entityTypeFltId.getValue();
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
		 Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
						         var sellerParam = '';
							var entityType ='';
							var accountNumber = '';
						    var signatoryCode ='';
							var statusVal ='';

					var signatureSetupFilterView = me.getSignatureSetupFilterView();
										var entityTypeFltAuto = signatureSetupFilterView
							.down('combobox[itemId=entityTypeFltId]');
					var entityCodeFltAuto = signatureSetupFilterView
							.down('combobox[itemId=entityCodeFltId]');		
					var sigAccNmbrFltAuto = signatureSetupFilterView
							.down('combobox[itemId=sigAccNmbrFltId]');
					var signatoryCodeFltAuto = signatureSetupFilterView
							.down('combobox[itemId=signatoryCodeFltId]');			
					var statusFltId = signatureSetupFilterView
							.down('combobox[itemId=sigStatusFltId]');
					var sellerCombo = me.getSellerCombo();
					
					if (!Ext.isEmpty(sellerCombo) && !Ext.isEmpty(sellerCombo.getValue())) {
						sellerParam = sellerCombo.getRawValue();
					}
					if (!Ext.isEmpty(entityTypeFltAuto)
							&& !Ext.isEmpty(entityTypeFltAuto.getValue())) {
						entityType = entityTypeFltAuto.getValue(), 
						entityType = entityType.trim();
					}
					else
					{
						entityType = getLabel('none','None');	
					}
					if (!Ext.isEmpty(entityCodeFltAuto)
							&& !Ext.isEmpty(entityCodeFltAuto.getValue())) {
						entityCode = entityCodeFltAuto.getRawValue(), 
						entityCode = entityCode.trim();
					}
					else
					{
						entityCode = getLabel('none','None');		
					}
					if (!Ext.isEmpty(sigAccNmbrFltAuto)
							&& !Ext.isEmpty(sigAccNmbrFltAuto.getValue())) {
						accountNumber = sigAccNmbrFltAuto.getValue(), 
						accountNumber = accountNumber.trim();
					}
					else
					{
						accountNumber = getLabel('none','None');		
					}
					if (!Ext.isEmpty(signatoryCodeFltAuto)
							&& !Ext.isEmpty(signatoryCodeFltAuto.getValue())) {
						signatoryCode = signatoryCodeFltAuto.getRawValue(), 
						signatoryCode = signatoryCode.trim();
					}
					else
					{
						signatoryCode = getLabel('none','None');		
					}
					if (!Ext.isEmpty(statusFltId) 
							&& !Ext.isEmpty(statusFltId.getValue())) {
						statusVal = statusFltId.getRawValue();
					}
                 tip.update(getLabel('lblfinancialinstitution',
							'Financial Insitution')
							+ ' : '
							+ sellerParam
							+ '<br/>'
							+ getLabel('entityType','Entity Type')
							+ ' : '
							+ entityType
							+ '<br/>'
							+ getLabel('entityCode','Entity')
							+ ' : '
							+ entityCode
							+ '<br/>'
							+ getLabel('accountNumber','Account Number')
							+ ' : '
							+ accountNumber
							+ '<br/>'
							+ getLabel('signatoryCode','Signatory Code')
							+ ' : '
							+ signatoryCode
							+ '<br/>'
							+ getLabel('status', 'Status') 
							+ ' : '
							+ statusVal);
						}
					}
				});
	}
});