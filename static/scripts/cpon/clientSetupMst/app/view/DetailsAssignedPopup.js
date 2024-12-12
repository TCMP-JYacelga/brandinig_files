Ext.define('GCP.view.DetailsAssignedPopup', {
	extend : 'Ext.window.Window',
	xtype : 'detailAssignmentListPopupView',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	minWidth : 650,
	width : 650,
	//maxWidth : 735,
	autoHeight : true,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	cls : 'non-xn-popup',
	config : {
		itemId : null,
		seekUrl : null,
		filterVal : null,
		filterVal2 : null,
		columnName : null,
		columnName2 : null,
		packageName : null
	},
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		var colModel = me.getColumns();
		
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			cls : 't7-grid',
			scroll : 'vertical',
			height: 'auto',
			minHeight : 40,
			maxHeight : 400,
			pageSize : 5,
			itemId : 'packageProductPopup',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			columnModel : colModel,
			filterVal : me.filterVal,
			filterVal2 : me.filterVal2,
			storeModel : {

				fields : [ 'productName' ,'productCode','activeFlag'],

				proxyUrl : '' + me.seekUrl + '.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			}
		});

		me.items = [ clientListView ];
		
		me.bbar = ['->',{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					handler : function() {
						me.close();
					}
					}];
					
		this.callParent(arguments);
	},
	getColumns : function() {
		arrColsPref = [{
					"colId" : "productName",
					"colDesc" : getLabel('productName','Product Name')
				}];
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.width = 200;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY"){
			arrCols.push(me.createViewAssignedActionColumn());
		}else{
			arrCols.push(me.createAssignedActionColumn());
		}
		return arrCols;
	},
	createAssignedActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'activeFlag',
			align: 'center',
			colHeader : getLabel('assigned', 'Assigned'),
			width : 70,
			items : [{
				itemId : 'isAssigned',
				fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					if (record.data.activeFlag === "N" ) {
						tableView.saveScrollState();
						record.set("activeFlag", "Y");
						record.set("isNewAssigned", true);
						record.set("isActionTaken", "Y");
						tableView.restoreScrollState();
					}
					else if(record.data.activeFlag === "Y" && record.data.isNewAssigned == true)
					{
						tableView.saveScrollState();
						record.set("activeFlag", "N");
						record.set("isNewAssigned", false);
						record.set("isActionTaken", "Y");
						tableView.restoreScrollState();
					}
					tableView.saveState();
				},
				fnIconRenderer : function(value, metaData, record,
						rowIndex, colIndex, store, view) {
					view.restoreScrollState();
					if (!record.get('isEmpty')) {
						if (record.data.activeFlag === 'Y') 
						{
							var iconClsClass = 'icon-checkbox-checked'; 
							return iconClsClass;
						} 
						else {
							var iconClsClass = 'icon-checkbox-unchecked';
							return iconClsClass;
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	createViewAssignedActionColumn : function() {
		var me = this;
		var iconClsClass ;
		var objActionCol = {
			colType : 'action',
			colId : 'isAssigned',
			align: 'center',
			colHeader : getLabel('assigned', 'Assigned'),
			width : 70,
			items : [{
				itemId : 'isAssigned',
				fnIconRenderer : function(value, metaData, record,
						rowIndex, colIndex, store, view) {
					view.restoreScrollState();
					if (!record.get('isEmpty')) {
							if (record.data.activeFlag === 'Y') {
							iconClsClass = 'icon-checkbox-checked-grey'; 
							return iconClsClass;
						} else {
							iconClsClass = 'icon-checkbox-unchecked-grey';
							return iconClsClass;
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(grid.filterVal)) {
			strUrl = strUrl + '&$filter=' + grid.filterVal;
		}
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	},
	savePackageProduct : function() {
		var me = this;
		var strAddUrl = null;
		if(srvcCode=='02')
		{
			strAddUrl = 'cpon/clientPayment/updatePackageAssignment';
		}
		var arrayJson = new Array();
		var grid = me.down('grid[itemId=packageProductPopup]');
		var records = grid.store.data;
		for (var index = 0; index < records.length; index++) {
			
			var isActionTaken = records.items[index].data.isActionTaken ;
			if(isActionTaken == "Y")
			{
				arrayJson.push({
					serialNo : grid.getStore().indexOf(records[index]) + 1,
					userMessage : parentkey ,
					filterValue1 : records.items[index].data.productCode,
					filterValue2 : records.items[index].data.activeFlag ,
					filterValue3 : me.filterVal 
				});
			}
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});

		Ext.Ajax.request({
					url : strAddUrl,
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						var errorMessage = '';
						if (response.responseText != '[]') {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
								        });
								}
							}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
						}
						me.close();
						payServiceGrid.refreshData();
						
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	}
});
