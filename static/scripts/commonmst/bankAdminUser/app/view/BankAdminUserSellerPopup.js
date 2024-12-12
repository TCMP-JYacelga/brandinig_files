var isDeselcted = false;
Ext.define('BANKUSER.view.BankAdminUserSellerPopup', {
	extend : 'Ext.window.Window',
	requires : ['Ext.ux.gcp.SmartGrid'],
	xtype : 'userSellerPopup',
	modal : true,
	width : 480,
	//maxHeight : 500,
	autoScroll : true,
	autoHeight : true,
	title : '',
	keyNode : '',
	closeAction : 'hide',
	config : {
		layout : 'fit',
		viewState : '',
		loggedInSeller : '',
		isAllAssigned : 'N'
		
	},
	initComponent : function() {
		var me = this;
		me.buttons = [{
					text : locMessages.OK,
					cls : 'ux_button-background-color ux_button-padding',
					itemId : 'gridOkBtn',
					handler : function(btn) {
						me.handlePopupClose(btn);
					}
				}];

		me.on('render', me.handleSmartGridLoading);

		me.callParent(arguments);
	},
	handleSmartGridLoading : function() {
		var me = this;
		var sellerLstGrid = me.down('smartgrid');
		var arrConfig = new Array();
		var showCheckBoxColumn = true;
		arrConfig = me.getConfigData();
		if (!Ext.isEmpty(sellerLstGrid)) {
			me.handleLoadGridData(sellerLstGrid, sellerLstGrid.store.dataUrl,
					sellerLstGrid.pageSize, 1, 1, null);
		} else {
			if (pageMode == 'VIEW' || pageMode == 'VERIFY') {
				showCheckBoxColumn = false;
			}
			me.createSmartGrid(arrConfig, showCheckBoxColumn);
		}
	},
	getConfigData : function() {
		var me = this;
		var colModel = null;
		var storeModel = null;
		var itemId = null;
		
		colModel = [{
				colId : 'templateReference',
				colDesc : 'Seller',
				colHeader : 'Seller',
				width : 200,
				fnColumnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId ){
					var retVal = value;
					if (pageMode == 'VIEW' && btnOldView == 'TRUE') {
						if (record.raw.changeState == 3) {
							retVal = '<span class="newFieldGridValue">' + value + '</span>';
						} 
						else if (record.raw.changeState == 1) {
							retVal = '<span class="modifiedFieldValue">' + value + '</span>';
						}
						else if (record.raw.changeState == 2) {
							retVal = '<span class="deletedFieldValue">' + value + '</span>';
						}
					}
					return retVal;
				}
			}, {
				colId : 'assignmentStatus',
				colDesc : 'Status',
				colHeader : 'Status',
				width : 170
			}];
			storeModel = {
					fields : [ 'entitlementName', 'templateReference', 'isAssigned', 'assignmentStatus','updated' ],
			proxyUrl : 'userSellerLinkageList.srvc',
			rootNode : 'd.details',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"colModel" : colModel,
			"storeModel" : storeModel,
			"itemId" : itemId
		};
		return objConfigMap;
	},
	createSmartGrid : function(arrConfig, showCheckBoxColumn) {
		var me = this;
		var pgSize = null;
		var popupSmartGrid = null;
		pgSize = _GridSizeMaster;
		popupSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					pageSize : pgSize,
					stateful : false,
					padding : '5 0 0 0',
					rowList : _AvailableGridSize,
					itemId : arrConfig.itemId,
					minHeight : 140,
					maxHeight : 500,
					showPager : false,
					columnModel : arrConfig.colModel,
					storeModel : arrConfig.storeModel,
					showEmptyRow : false,
					showCheckBoxColumn : showCheckBoxColumn,
					showHeaderCheckbox : false,
					mode : pageMode,
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					listeners : {
						select : function(row, record, index, eopts) {
							isDeselcted = false;
							me.addSelected(row, record, index, eopts, me);
						},
						deselect : function(row, record, index, eopts) {
							isDeselcted = true;
							me.removeDeselected(row, record, index, eopts, me);
						},
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : function(grid, url, pgSize, newPgNo,
								oldPgNo, sorter) {
							me.handleLoadGridData(grid, url, pgSize, newPgNo,
									oldPgNo, sorter);
						},
						afterrender:function(objGrid){
						}
					}
				});

		me.items.add(popupSmartGrid);
		me.doLayout();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&' + '$viewState=' + me.viewState;
		strUrl = strUrl + '&' + '$userSellerCode=' + me.loggedInSeller;
		strUrl = strUrl + '&' + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, me.handleGridAfterDataLoad, null, false,
						this);
	},
	handleGridAfterDataLoad : function(grid)
	{
		var me = this;
		me.handleUserSellerAfterGridDataLoad(grid);
	},
	handleUserSellerAfterGridDataLoad : function(grid)
	{
		var me = this;
		var storedValues = null;
		var store = grid.getStore();
		var records = store.data;
		grid.enableCheckboxColumn(false);
		if(grid.mode != 'VIEW' && grid.mode != 'VERIFY')
		{
			storedValues = document.getElementById('selectedSellerList').value;
			if (!Ext.isEmpty(records))
			{
				var items = records.items;
				var assignedRecords = new Array();
	
				if (!Ext.isEmpty(items)) {
					for (var i = 0; i < items.length; i++) {
						var record = items[i];
						var tempSeller = false;
						if (!Ext.isEmpty(storedValues)) {
							var tempSellerList = storedValues.split(',');
							if (tempSellerList.indexOf(record.get('entitlementName')) > -1) {
								tempSeller = true;
							}
						}
						if (tempSeller) {
							assignedRecords.push(record);
						}
					}
				}
				if (assignedRecords.length > 0) {
					grid.setSelectedRecords(assignedRecords,false,true);
				} else {
					if (null != storedValues) {
						for (var i = 0; i < items.length; i++) {
							var item = items[i];
							var tempUserSeller = new Array();
							tempUserSeller = storedValues.split(",");
							if (tempUserSeller.indexOf(item.get('entitlementName')) > -1)
							{
								assignedRecords.push(item);
							}
						}
						if (assignedRecords.length > 0) {
							grid.setSelectedRecords(assignedRecords,false,true);
						}
					}
				}
			}
		}
		if (grid.mode == 'VIEW' || grid.mode == 'VERIFY')
		{
			grid.enableCheckboxColumn(true);
			
		}
	},
	addSelected : function(row, record, index, eopts) {
		var me = this;
		var grid = me.down('smartgrid');
		var keyNode = 'entitlementName';
		var alreadyPresent = me.checkIfRecordExist(grid.selectedRecordList,
				keyNode, record.data[keyNode]);
		/* Add to Grid Selection List */
		if (!alreadyPresent && (record.data['isAssigned'] == false)) {
			grid.selectedRecordList.push(record);
			alreadyPresent = false;
		}
		/* Remove From De Selected List */
		me.removeElementIfExist(grid.deSelectedRecordList, keyNode,
				record.data[keyNode]);
	},
	removeDeselected : function(row, record, index, eopts) {
		var me = this;
		var grid = me.down('smartgrid');
		var keyNode = 'entitlementName';
		/* Remove Ellement From Grid Selection List */
		var index = -1;
		me.removeElementIfExist(grid.selectedRecordList, keyNode,
				record.data[keyNode]);

		var alreadyPresent = me.checkIfRecordExist(grid.deSelectedRecordList,
				keyNode, record.data[keyNode]);
		/* Add to Grid Selection List */
		if (!alreadyPresent && (record.data['isAssigned'] == true)) {
			grid.deSelectedRecordList.push(record);
			alreadyPresent = false;
		}
	},
	removeElementIfExist : function(arrayList, keyNode, keyNodeValue) {
		var index = -1;
		if (!Ext.isEmpty(arrayList)) {
			for (var i = 0; i < arrayList.length; i++) {
				var rowRecord = arrayList[i];
				if (rowRecord.data[keyNode] === keyNodeValue) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				arrayList.splice(index, 1);
			}
		}
	},
	checkIfRecordExist : function(arrayList, keyNode, keyNodeValue) {
		var isRecordPresent = false;
		if (!Ext.isEmpty(arrayList)) {
			for (var i = 0; i < arrayList.length; i++) {
				var rowRecord = arrayList[i];
				if (rowRecord.data[keyNode] === keyNodeValue) {
					isRecordPresent = true;
					break;
				}
			}
		}
		return isRecordPresent;
	},
	addUserSellerSelectedRecords : function(records) {
		var me = this;
		var selectedItems = "";
		for (var index = 0; index < records.length; index++) {
			var value = records[index].get('entitlementName');
			selectedItems = selectedItems + value;
			if (index < records.length - 1) {
				selectedItems = selectedItems + ',';
			}
		}
		var selectedRecordList = selectedItems ; 
		document.getElementById('selectedSellerList').value = selectedRecordList;
	},
	handlePopupClose : function(btn) {
		var me = this;
		me.handleUserSellerPopupClose(btn);
	},
	handleUserSellerPopupClose : function(btn) {
		var me = this;
		if( !Ext.isEmpty(me.down('smartgrid')) && pageMode != 'VIEW' && pageMode != 'VERIFY')
		{
			var gridRecords = me.down('smartgrid').getSelectedRecords();
			if (!Ext.isEmpty(gridRecords))
			{
				me.addUserSellerSelectedRecords(gridRecords);
				$('#a_selectFIPermissions').removeClass('ui-state-disabled');
				$('#a_selectFIPermissions').attr('href', "javascript:saveUser('Y')");
			}
			else
			{
				document.getElementById('selectedSellerList').value = null;
				$('#a_selectFIPermissions').addClass('ui-state-disabled');
				$('#a_selectFIPermissions').unbind('click');
				$('#a_selectFIPermissions').removeAttr('href');
			}
		}
		me.close();
	}
});