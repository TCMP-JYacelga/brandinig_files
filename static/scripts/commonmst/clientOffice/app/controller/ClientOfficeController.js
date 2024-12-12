Ext.define('GCP.controller.ClientOfficeController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ClientOfficeView','GCP.view.ClientOfficeFilterView','GCP.view.ClientOfficeGridView','GCP.view.ClientOfficeActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientOfficeView',
				selector : 'clientOfficeView'
			},{
				ref : 'createNewToolBar',
				selector : 'clientOfficeView clientOfficeGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'bankBranchFilterView',
				selector : 'clientOfficeView clientOfficeFilterView'
			},{
				ref : 'gridHeader',
				selector : 'clientOfficeView clientOfficeGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'bankGridView',
				selector : 'clientOfficeView clientOfficeGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'bankGrtidDtlView',
				selector : 'clientOfficeView clientOfficeGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'grid',
				selector : 'clientOfficeGridView smartgrid'
			}, {
				ref : 'groupActionBar',
				selector : 'clientOfficeView clientOfficeGridView clientOfficeActionBarView'
			},{
				ref : 'specificFilterPanel',
				selector : 'clientOfficeView clientOfficeFilterView panel container[itemId="specificFilter"]'
			},
			{
				ref : "clientFilter",
				selector : 'clientOfficeView clientOfficeFilterView textfield[itemId="clientFilter"]'
			},{
				ref : "clientOfficeFilter",
				selector : 'clientOfficeView clientOfficeFilterView textfield[itemId="clientOfficeFilter"]'
			},{
				ref : "sellerCombo",
				selector : 'clientOfficeView clientOfficeFilterView combobox[itemId="sellerCombo"]'
			},
			{
				ref : "statusFilter",
				selector : 'clientOfficeView clientOfficeFilterView combobox[itemId="statusFilter"]'
			},
			{
				ref : "clearingLocationFilter",
				selector : 'clientOfficeView clientOfficeFilterView textfield[itemId="clearingLocationFilter"]'
			},
			{
				ref : 'grid',
				selector : 'clientOfficeGridView smartgrid'
			}
			],
	config : {
			clearingLocationSelected : false,
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
			'clientOfficeView clientOfficeGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClientOffice"]' : {
				click : function() {
					//me.handleAlertEntryAction(true);
	                 me.handleClientOfficeEntryAction(true);
				}
			},
			
			
			'clientOfficeView clientOfficeFilterView' : {
			    render : function() {
			
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},			
			
			'clientOfficeView clientOfficeGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			
			
			'clientOfficeGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			
			'clientOfficeGridView smartgrid' : {
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
			'clientOfficeGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'clientOfficeView clientOfficeFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'clientName',
			itemId : 'clientFilter',
			cfgUrl : 'cpon/clientOfficeMst/clientNameSeek.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$clientName',
			cfgRecordCount : -1,
			cfgSeekId : 'clientOfficeSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.filter',
			cfgDataNode1 : 'CLIENT_NAME'
			//cfgKeyNode:'CLIENT_ID'
		});
		
		var officeTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'clientOfficeName',
					itemId : 'clientOfficeFilter',
					cfgUrl : 'cpon/clientOfficeMst/clientOfficeSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					matchFieldWidth:true,
					//cfgSeekId : 'branchNameSeek',
					enableQueryParam:false,
					//cfgRootNode : 'd.filter',
					cfgDataNode1 : 'OFFICE_NAME'
				});
		
		var clearingLocationTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'clearingLocation',
			itemId : 'clearingLocationFilter',
			cfgUrl : 'services/userseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			cfgSeekId : 'clientPickupLocSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCRIPTION',
			cfgKeyNode:'CODE',
			listeners:{
				'select' : function(combo, record) {
					me.clearingLocationSelected = true;
				},
				'change' : function(combo, record) {
					me.clearingLocationSelected = false;
				}
			}
		});
		
		 var comboStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'cpon/sellersList.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json'
				},
				noCache: false
			}
		});	
		
		
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						},
						noCache: false
					}
				});
		
		var clearingLocationStore = Ext.create('Ext.data.Store', {
			fields : ["CLEARING_LOC_CODE", "LOC_DESCRIPTION"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'cpon/clientOfficeMst/clearingLocationList.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json'
				},
				noCache: false
			},
			listeners : {
                scope : me,
                load  : me.onLoadClearingLocStore
            }
		});
		
	var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
			displayField : 'value',
			fieldCls : 'xn-form-field inline_block',
			triggerBaseCls : 'xn-form-trigger',
			filterParamName : 'sellerCode',
			itemId : 'sellerCombo',
			valueField : 'name',
			name : 'sellerCode',
			editable : false,
			store : comboStore,
			width : 165,
			listeners : {
				'render' : function(combo, record) {
					combo.setValue(strSellerId);	
					combo.store.load();
				},
				'select' : function(combo, record) {
					strSellerId=combo.getValue();
					setAdminSeller(strSellerId);
					me.setSellerToBankAutoCompleterUrl();
				}
			}
		});	
				
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
		filterPanel.doLayout();

			filterPanel.add({
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
//					           hidden : true,
					           itemId : 'sellerFilter',
					           items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelSeller',
										text : getLabel('seller', 'Financial Institution')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, sellerComboField]
		    		},{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('grid.column.company',
											'Company Name'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, clientTextfield]
					}, {
								xtype : 'container',
								columnWidth : 0.3,
								padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('clearingLoacation', 'Pickup Location'),
									cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
								}, clearingLocationTextfield]

				},{
					   xtype : 'container',
					   columnWidth : 0.3,
					   padding : '5px',
				 flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel('clientOfficeName', 'Office Name'),
							cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
						}, officeTextField]
			   },{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
//							columnWidth : 0.4,
							itemId: 'statusFilterPanel',
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										width : 165,
										itemId : 'statusFilter',
										filterParamName : 'bankRequestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : getLabel('all',
												'ALL')
	
									}]

					},{
							   xtype : 'container',
							  
							   padding : '5px',
//						columnWidth : 0.1,
						itemId: 'buttonFilter',
						items : [{
									xtype : 'panel',
									layout : 'hbox',									
									padding : '20 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color'
											}]
								}]
					});
						
			sellerComboField.store.on('load',function(store){
//				if(store.getCount()===1)
//				{
//					filterPanel.down('container[itemId="sellerFilter"]').hide();
//				}					
//				else
//				{	
//					filterPanel.down('container[itemId="sellerFilter"]').show();
//				}
				});
	},

	onLoadClearingLocStore : function (str) {
        str.insert(0, {
			CLEARING_LOC_CODE: 'Select',
			LOC_DESCRIPTION: 'Select'
	    });
    },
	
setSellerToBankAutoCompleterUrl : function() {
		var me = this;
		var clientNameAutoCompleter = me.getClientFilter();
		clientNameAutoCompleter.reset();
		clientNameAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : strSellerId
				}];
	},


handleGridHeader : function() {
		var me = this;	
		var gridHeaderPanel = me.getGridHeader();
		if(ACCESSNEW){
			var createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}
			createNewPanel.add(
				{
								xtype : 'button',
								border : 0,
								text : getLabel('clientOfficeCreateMessage', 'Client Office'),
								cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
							    glyph:'xf055@fontawesome',
								parent : this,
							//	padding : '4 0 2 0',
								itemId : 'btnCreateClientOffice'
							}
			);
		}	
	},
 
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
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
		
		var sellerVal = null, clientNameVal = null, clientOfficeNameVal = null, statusVal=null, clearingLocCode=null,
						clearingLocDesc = null, jsonArray = [];
		var isPending = true;
		var bankSetupFilterView = me.getBankBranchFilterView();
		if(!Ext.isEmpty(bankSetupFilterView)){
			var clientNameFilterId=me.getClientFilter();
			var clientOfficeFilterId=me.getClientOfficeFilter();
			
			var sllerComboFilterId=me.getSellerCombo();
			
			if(!Ext.isEmpty(clientNameFilterId)){
				clientNameVal=clientNameFilterId.getValue();
			}
			if(!Ext.isEmpty(clientOfficeFilterId)){
				clientOfficeNameVal=clientOfficeFilterId.getValue();
			}
			var clearingLocationFilter=me.getClearingLocationFilter();
			if(!Ext.isEmpty(clearingLocationFilter)){
				if(me.clearingLocationSelected == true){
					clearingLocCode=clearingLocationFilter.getValue();
				}else {
					clearingLocDesc=clearingLocationFilter.getValue();
				}
			}
			if (!Ext.isEmpty(clearingLocCode)) {
				jsonArray.push({
					paramName: 'clearingLocation',
					paramValue1: encodeURIComponent(clearingLocCode.replace(new RegExp("'", 'g'), "\''")),
					operatorValue: 'eq',
					dataType: 'S'
				});
			}
			
			if(!Ext.isEmpty(sllerComboFilterId)){
				sellerVal=sllerComboFilterId.getValue();
				if(Ext.isEmpty(sellerVal)){
					sellerVal=strSellerId;
				}
			}
			
			if (!Ext.isEmpty(clientNameVal)) {
			jsonArray.push({
						paramName : 'clientNameOffice',
						paramValue1 : clientNameVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(clientOfficeNameVal)) {
			jsonArray.push({
						paramName : 'officeName',
						paramValue1 : clientOfficeNameVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(clearingLocDesc)) {
				jsonArray.push({
					paramName: 'clearingLocationDesc',
					paramValue1: encodeURIComponent(clearingLocDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
					operatorValue: 'lk',
					dataType: 'S'
				});
		}
		
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : 'sellerCode',
						paramValue1 : sellerVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}	


	}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase()) {
						
			statusVal = me.getStatusFilter().getValue();
			
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
								paramName : 'user',
								paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'ne',
								dataType : 'S'
					});
				
			}
			if (isPending)
			{	
			  if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12: New Submitted,13:Modified Submitted
				{
					statusVal = (statusVal == 12)?0:1;
					jsonArray.push({
								paramName : 'officeIsSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
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
							paramName : 'officeIsSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
					jsonArray.push({
								paramName : me.getStatusFilter().filterParamName,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
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
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartGridConfig : function() {
		var me = this;
		var bankGrid = me.getBankGridView();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(bankGrid))
			bankGrid.destroy(true);

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
					cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
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

		var clntSetupDtlView = me.getBankGrtidDtlView();
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
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('officeName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewClientOfficeMst.srvc', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editClientOfficeMst.srvc', record, rowIndex);
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
			
	showHistory : function(product ,url, id) {
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
		}else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
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
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = true;
					cfgCol.resizable = false;
					cfgCol.draggable = false;
					cfgCol.hidden = false;
				}
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
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit Record'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip',
								'View History'),
						toolTip : getLabel('historyToolTip','View History'),		
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
			width : 120,
			locked : true,
			items: [{
						text : getLabel('actionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('actionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('actionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('actionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('actionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('actionDisable',	'Disable'),
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
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/clientOfficeMst/{0}',
				strAction);
		strUrl = strUrl + '.srvc?';
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
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
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error', 'Reject Remark field can not be blank'));
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
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc: records[index].data.draweeBranchDescription,
							recordDesc :records[index].data.officeName
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
			if(colId=='col_returnOfficeType'){
				if(value=="B"){
					strRetValue=getLabel("branchOfficeAddress","Branch Office Address");
				}
				if(value=="H"){
					strRetValue=getLabel("headOffice","Head Office");
				}
				if(value=="O"){
					strRetValue=getLabel("otherBranchOfficeAddress","Other Branch Office Address");
				}
				
			}
			else if(colId=='col_displayPrintInstFlag'){
                if(value=="Y"){
                    strRetValue=getLabel('yes','Yes');
                }
                else if(value=="N"){
                    strRetValue = getLabel('no','No');
                }
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
			"officeclientName" : 150,
			"officeName" : 150,	
			"clearingLocCode" : 160,
			"returnOfficeAddress" : 150
			};

		arrColsPref = [{	
							"colId" : "officeclientName",
							"colDesc" : getLabel("grid.column.company","Company Name")
							
						}, {
							"colId" : "officeName",
							"colDesc" :getLabel("clientOfficeName","Office Name") 
							
						},
						{
							"colId" : "locationDecription",
							"colDesc" : getLabel("clearingLoacation","Pickup Location")	
						},{
							"colId" : "returnOfficeType",
							"colDesc" : getLabel("returnAddress","Return Address")	
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel("status","Status")
						},{
                            "colId" : "displayPrintInstFlag",
                            "colDesc" : getLabel("defaultDispatch","Default Dispatch")
                        }
						];

		storeModel = {
					fields : ['officeName','officeclientName','country', 'clearingLocCode','clearingLocCode','returnOfficeType','returnOfficeAddress',
							 'beanName', 'primaryKey','history','identifier','makerId','sellerId','state','validFlag','city','locationDecription',
							'requestStateDesc', 'parentRecordKey', 'version','isSubmitted','displayPrintInstFlag',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : 'cpon/clientOfficeMst.json',
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
	handleClientOfficeEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addClientOfficeMst.srvc';
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
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var drawerNameVal = null;
		var arrJsn = {};
		var bankBranchFilterView = me.getBankBranchFilterView();
		/*var drawerNameFltId = bankBranchFilterView
				.down('combobox[itemId=drawerNameFltId]');
		if (!Ext.isEmpty(drawerNameFltId)
				&& !Ext.isEmpty(drawerNameFltId.getValue())) {
			drawerNameVal = drawerNameFltId.getValue();
		}*/
		arrJsn['sellerId'] =  strSellerId;
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
							
							var clientName='';
							var officeName = '';
							var status = '';
							var clearingLocation = '' ;
							 
							var branchSetupFilterView = me.getBankBranchFilterView();
							
	                        var clientNameFilter=me.getClientFilter()
							
							var clientOfficeFilter=me.getClientOfficeFilter();
							
							var clearingLocationFilter=me.getClearingLocationFilter();
							
							if (!Ext.isEmpty(clientNameFilter)
									&& !Ext.isEmpty(clientNameFilter.getValue())) {
								clientName =clientNameFilter.getRawValue();
							}else
								clientName = getLabel('none','None');							
							
							if (!Ext.isEmpty(clientOfficeFilter)
									&& !Ext.isEmpty(clientOfficeFilter.getValue())) {
								officeName =clientOfficeFilter.getRawValue();
							}else
								officeName = getLabel('none','None');
                             
							if( !Ext.isEmpty( me.getStatusFilter() )
									&& !Ext.isEmpty( me.getStatusFilter().getValue() ) )
								{
									var combo = me.getStatusFilter();
									status = combo.getRawValue()
								}
								else
								{
									status = getLabel( 'all', 'ALL' );
								}						 
							if( !Ext.isEmpty(clearingLocationFilter)
									&& !Ext.isEmpty(clearingLocationFilter.getValue() ) ){
								clearingLocation = clearingLocationFilter.getRawValue()		
							}else
								clearingLocation = getLabel( 'all', 'ALL' );
							
							tip.update(getLabel('grid.column.company', 'Company Name') + ' : '
									+ clientName+ '<br/>'
									+ getLabel('clientOfficeName', 'Office Name') + ' : '
									+ officeName+'<br/>'
									+ getLabel( 'clearingLocation', 'Pickup Location' ) + ' : ' + clearingLocation
									+ '<br/>'
									+getLabel( 'status', 'Status' ) + ' : ' + status);									
							
						}
					}
				});
	}
});
