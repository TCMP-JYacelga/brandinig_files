Ext.define('GCP.controller.InterestRateApplicationController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.SmartGrid'],
	views : ['GCP.view.InterestRateApplicationView','GCP.view.InterestRateApplicationGridView','GCP.view.InterestRateApplicationFilterView', 'GCP.view.InterestRateApplicationActionBarView', 'Ext.util.Point'],
	refs : [{
		ref : 'interestRateApplicationView',
		selector : 'interestRateApplicationView'
	}, {
		ref : 'interestRateApplicationGridView',
		selector : 'interestRateApplicationView interestRateApplicationGridView'
	}, {
		ref : 'interestRateApplicationDtlView',
		selector : 'interestRateApplicationView interestRateApplicationGridView panel[itemId="filtersDtlView"]'
	},{
		ref : 'interestRateApplicationGrid',
		selector : 'interestRateApplicationView interestRateApplicationGridView grid[itemId="gridViewMstId"]'
	},{
		ref : 'gridHeader',
		selector : 'interestRateApplicationView interestRateApplicationGridView panel[itemId="filtersDtlView"] container[itemId="gridHeader"]'
	},{
		ref : 'interestRateApplicationFilterView',
		selector : 'interestRateApplicationView interestRateApplicationFilterView'
	},{
		ref : 'actionBar',
		selector : 'interestRateApplicationView interestRateApplicationGridView interestRateApplicationActionBarView'
	},{
		ref : 'createNewToolBar',
		selector : 'interestRateApplicationView interestRateApplicationGridView toolbar[itemId="btnCreateNewToolBar"]'
	},
	],
	
	config :{
		filterData : [],
		statusFilter : ''
	},
	
	init : function() {
		var me = this;
		me.control({
			'interestRateApplicationGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'interestRateApplicationGridView smartgrid' : {
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
			'interestRateApplicationView interestRateApplicationGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreate"]' : {
				click : function() {
					me.handleEntryAction(true);
				}
			},
			'interestRateApplicationView interestRateApplicationGridView panel[itemId="filtersDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
			
			'interestRateApplicationView interestRateApplicationFilterView' : {
				render : function( panel, opts )
				{
					me.setInfoTooltip();
				}
			},
			'interestRateApplicationView combobox[itemId=sellerFltId]': {
				'select' : function( combo, record, index )
				{
					var objFilterPanel = me.getInterestRateApplicationFilterView();
					var objAutocompleterClient = objFilterPanel.down('AutoCompleter[itemId="anchorClient"]');
					objAutocompleterClient.cfgUrl = 'services/userseek/anchorClientSeek.json';
					objAutocompleterClient.cfgSeekId = 'anchorClientSeek';
					objAutocompleterClient.setValue( '' );
					objAutocompleterClient.cfgExtraParams =
					[
						{
							key : '$filtercode2',
							value : record[ 0 ].data.CODE
						}
					];
				}
			},
			'interestRateApplicationView AutoCompleter[itemId="financeRequestedBy"]' :
			{
				select : function( combo, record, index )
				{
					var objFilterPanel = me.getInterestRateApplicationFilterView();
					var objAutocompleterClient = objFilterPanel.down('AutoCompleter[itemId="fileName"]');
					objAutocompleterClient.cfgUrl = 'services/userseek/fscFileNameSeek.json';
					objAutocompleterClient.cfgSeekId = 'fscFileNameSeek';
					objAutocompleterClient.setValue( '' );
					strClient = record[ 0 ].data.CODE;
					objAutocompleterClient.cfgExtraParams =
					[
						{
							key : '$filtercode1',
							value : record[ 0 ].data.CODE
						}
					];
				},
				change : function( combo, newValue, record, index )
				{
					var objAutocompleter = me.getInterestRateApplicationFilterView().down( 'AutoCompleter[itemId="fileName"]' );
					objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : '%'
							}
						];
				}
			},
			'interestRateApplicationView interestRateApplicationFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
				
			'interestRateApplicationView interestRateApplicationGridView toolbar[itemId=interestRateActionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getInterestRateApplicationGrid();
		grid.refreshData();
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.applyFilter();
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	handleSmartGridConfig : function() {
		var me = this;
		var interestRateApplicationGrid = me.getInterestRateApplicationGrid();
		var objConfigMap = me.getInterestRateApplicationGridConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(interestRateApplicationGrid))
			interestRateApplicationGrid.destroy(true);

		 arrCols = me.getColumns(objConfigMap.arrColsPref,
		 objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	getInterestRateApplicationGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"fileName" : 150,
			"clientDesc" : 150,
			"totalRequestedAmount" : 100,
			"totalTxnCount" : 100,
			"requestStateDesc" : 120
		};

			arrColsPref = [{
					"colId" : "fileName",
					"colDesc" : getLabel('fileName','File Name/Document Reference'),
					"sort":true
				},{
					"colId" : "clientDesc",
					"colDesc" : getLabel('finRequestedBy','Finance Requested By'),
					"sort":true
				},{
					"colId" : "totalRequestedAmount",
					"colDesc" :  getLabel('totalReqAmt','Total Request Amount'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "totalTxnCount",
					"colDesc" : getLabel('totalTxnCount','Total Transaction Count'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('requestStateDesc','Status'),
					"sort":false
				}];

		storeModel = {
			fields : ['fileName', 'enteredByClient', 'totalRequestedAmount','totalTxnCount','requestStateDesc','statusFlag','__metadata','identifier','makerId','checkerId','clientDesc'],
			proxyUrl : 'interestRateApplicationGridList.srvc',
			rootNode : 'd.interesrRateApplication',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		bankProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			showEmptyRow : false,
			//enableColumnAutoWidth : true,
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
		var interestRateApplicationDtlView = me.getInterestRateApplicationDtlView();
		interestRateApplicationDtlView.add(bankProductGrid);
		interestRateApplicationDtlView.doLayout();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		
		var buttonMask = '000000';
		me.enableDisableGroupActions(buttonMask,'N');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() +'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.draggable = true;
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
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(me.filterData);
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function( urlFilterData )
	{
		var me = this;
		var filterData = urlFilterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for( var index = 0 ; index < filterData.length ; index++ )
		{
			if( isFilterApplied )
				strTemp = strTemp + ' and ';
			switch( filterData[ index ].operatorValue )
			{
				case 'bt' :
						if (filterData[index].dataType === 'D') {

							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' '
									+ 'date\'' + filterData[index].paramValue1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].paramValue2 + '\'';
						} 
						else 
						{
							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' ' + '\''
									+ filterData[index].paramValue1 + '\''
									+ ' and ' + '\''
									+ filterData[index].paramValue2 + '\'';
						}
						break;
				case 'eq':
				case 'lk':
						isFilterApplied = true;
						if (filterData[index].dataType === 'D') {
								strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
								}
						else
						{
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
						}
					break;
				default :
						// Default opertator is eq
						if (filterData[index].dataType === 'D') {

							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' '
									+ 'date\'' + filterData[index].paramValue1
									+ '\'';
						} else {

							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' ' + '\''
									+ filterData[index].paramValue1 + '\'';
						}
						break;
			}
			isFilterApplied = true;
		}
		if( isFilterApplied )
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'discard' || actionName === 'accept' || actionName === 'reject' )
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnView') {
			me.submitForm('viewInterestRate.srvc', record, rowIndex);
		}
		else if (actionName === 'btnEdit') {
			me.submitForm('editInterestRate.srvc', record, rowIndex);
		}
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
		return retValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
			sortable: false,
			lockable: false,
			draggable : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip :  getLabel('editToolTip','Edit Record'),
						maskPosition : 2
					},{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip :  getLabel('viewToolTip','View Record'),
						maskPosition : 3
					}]
		};
		return objActionCol;

	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '000000';
		var maskArray = new Array(), actionMask = '', objData = null;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 7);
		me.enableDisableGroupActions(actionMask, isSameUser);
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 150,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text : getLabel('discard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 6
					},{
						text : getLabel('authorize', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 4
					},{
						text : getLabel('reject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 5
					}]
		};
		return objActionCol;
	},
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled(!blnEnabled);
						}
					});
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
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	getFilterQueryJson : function() {
		var me = this;
		var productVal = null, statusVal = null, counterPartyVal = null, finReqVal = null, jsonArray = [], clientCodeVal = null, sellerCodeVal = null;

		var interestRateApplicationFilterView = me.getInterestRateApplicationFilterView();
		var clientFltId = interestRateApplicationFilterView.down('combobox[itemId=financeRequestedBy]');
		var fileNameFltId = interestRateApplicationFilterView.down('combobox[itemId=fileName]');
		var statusFltId = interestRateApplicationFilterView.down('combobox[itemId=statusCombo]');
		var seller = interestRateApplicationFilterView.down('combobox[itemId=sellerFltId]');

		if (!Ext.isEmpty(clientFltId)
				&& !Ext.isEmpty(clientFltId.getValue())) {
			clientCodeVal = clientFltId.getValue().toUpperCase();
			if(!Ext.isEmpty(clientFltId.value))
			{
				jsonArray.push({
					paramName : 'enteredByClient',
					operatorValue : 'eq',
					paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			else
			{
				jsonArray.push({
					paramName : 'enteredClientDesc',
					operatorValue : 'lk',
					paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			
		}
		if (!Ext.isEmpty(fileNameFltId)
				&& !Ext.isEmpty(fileNameFltId.getValue())) {
			fileNameVal = fileNameFltId.getValue().toUpperCase();
			jsonArray.push({
						paramName : 'fileName',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(fileNameVal.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
			jsonArray.push({
				paramName : 'statusFlag',
				paramValue1 : statusVal,
				operatorValue : 'eq',
				dataType : 'S'
			});
		}
		if (!Ext.isEmpty(seller)
				&& !Ext.isEmpty(seller.getValue())) {
			sellerCodeVal = seller.getValue().toUpperCase();
			jsonArray.push({
				paramName : 'sellerCode',
				operatorValue : 'eq',
				paramValue1 : sellerCodeVal,
				dataType : 'S'
			});
		}

		return jsonArray;
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
		? btn.actionName
		: btn.itemId;
		var strUrl = Ext.String.format('services/interestRateApplList/{0}.srvc', strAction);
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
			fieldLbl = getLabel('bankRejectRemarkPopUpTitle', 'Please Enter Reject Remark');
			titleMsg = getLabel('bankRejectRemarkPopUpFldLbl', 'Reject Remark');
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
						Ext.Msg.alert(getLabel( 'errorTitle', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
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
		var gridView = me.getInterestRateApplicationGrid();
		if (!Ext.isEmpty(gridView)) {
			var arrayJson = new Array();
			var records = gridView.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
			? records
			: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : gridView.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark
							});
				}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			gridView.setLoading(true);
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				timeout : 60000,
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					gridView.setLoading(false);
					gridView.refreshData();
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
						        	Ext.MessageBox.show({
										title : getLabel('errorTitle','Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										buttonText: {
								            ok: getLabel('btnOk', 'OK')
											},
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        } 
					        }
				       }
				},
				failure : function() {
				gridView.setLoading(false);
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('errorTitle', 'Error'),
								msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									},
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
   	setInfoTooltip : function()
		{
			var me = this;
			var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
						{
							beforeshow : function( tip )
								{
									var fileName='';
									var finRequestedBy = '';
									var status = '';			
									var interestRateApplicationFilterView = me.getInterestRateApplicationFilterView();
									var seller = interestRateApplicationFilterView.down('combobox[itemId=sellerFltId]');
									var clientFltId = interestRateApplicationFilterView.down('combobox[itemId=financeRequestedBy]');
									var fileNameFltId = interestRateApplicationFilterView.down('combobox[itemId=fileName]');
									var statusFltId = interestRateApplicationFilterView.down('combobox[itemId=statusCombo]');

									if (!Ext.isEmpty(interestRateApplicationFilterView.down('combobox[itemId=sellerFltId]')) 
										&& interestRateApplicationFilterView.down('combobox[itemId=sellerFltId]') != null) {
										seller=interestRateApplicationFilterView.down('combobox[itemId=sellerFltId]').getRawValue();
									}
									else {
										seller = seller;
									}
									if (!Ext.isEmpty(clientFltId)
										&& !Ext.isEmpty(clientFltId.getValue())) {
										finRequestedBy =clientFltId.getRawValue();
									}else
										finRequestedBy = getLabel('none','None');
									if (!Ext.isEmpty(fileNameFltId)
										&& !Ext.isEmpty(fileNameFltId.getValue())) {
										fileName =fileNameFltId.getRawValue();
									}else
										fileName = getLabel('none','None');			
									if (!Ext.isEmpty(statusFltId)
										&& !Ext.isEmpty(statusFltId.getValue())) {
										status =statusFltId.getRawValue();
									}else
										status = getLabel('all','ALL');															
							
									tip.update( getLabel( 'financialInsttitution', 'Financial Institution' ) + ':' + seller + '<br/>' 
                                         + getLabel('finRequestedBy','Finance Requested By') + ' : '
									+ finRequestedBy+ '<br/>'
									+ getLabel('fileName','File Name/Document Reference') + ':'
									+ fileName + '<br/>'
									+ getLabel('requestStateDesc','Status') + ':'
									+ status
								 );
                            }
						}
					})
				},	
	handleEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addInterestRateApplication.srvc';
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
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel;
		createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(gridHeaderPanel))
		{
			gridHeaderPanel.removeAll();
		}
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}		
		createNewPanel.add({
			xtype : 'button',
			border : 0,
			text : getLabel('applyInterestRate', 'Apply Interest Rate'),
			cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
			glyph:'xf055@fontawesome',
			parent : this,
			itemId : 'btnCreate'
		});
	}
	
});
