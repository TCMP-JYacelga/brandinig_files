Ext.define('GCP.controller.BankReportsController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	//views : [ 'GCP.view.BankReportsGridView'],
	refs : [
			{
				ref : 'bankReportGrid',
				selector : 'bankReportsGridView grid[itemId="bankReportGrid"]'
			},{
				ref : 'groupActionBar',
				selector : 'bankReportsGridView toolbar[itemId=gridActionBar]'
			},{
				ref : 'assignBtn',
				selector : 'bankReportsGridView toolbar[itemId="gridActionBar"] button[itemId="assign"]'
			},{
				ref : 'deLinkBtn',
				selector : 'bankReportsGridView toolbar[itemId="gridActionBar"] button[itemId="unassign"]'
			}],
	init : function() {
		var me = this;
		me.control({
					'bankReportsGridView grid[itemId="bankReportGrid"]' : {
						render : function(grid) {
							me.handleLoadGridData(grid,
									grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						//performRowAction : me.handleRowAction,
						gridRowSelectionChange : function(grid, record, recordIndex, records, jsonData) {
						  me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData); 
						}
					 
					},
			'bankReportsGridView toolbar[itemId=gridActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
					
				});
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo,
			oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&categoryId='+ userCategory;
		if(null!=mode)
		{
			strUrl =strUrl + '&mode='+ mode;
		}
		/*Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			success : function(response) {
				
			},
			failure : function() {
				me.setLoading(false);
				Ext.MessageBox.show({
							title : getLabel('errorPopUpTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});*/
		grid.setLoading(true); 
		grid.loadGridData(strUrl, me.updateSelection, null,	false);
	},
	updateSelection : function(grid, responseData, args) {
		var me = this;
		var selectedArray = responseData.d.accounts;

		if (!Ext.isEmpty(grid)) {
			var store = grid.getStore();
			var records = store.data;
			if (!Ext.isEmpty(records)) {
				var items = records.items;
				var selectedRecords = new Array();
				if (!Ext.isEmpty(items)) {
					for ( var i = 0; i < items.length; i++) {
						var item = items[i];
						if (item.data.recordKeyNo) {
							selectedRecords.push(item);
						}
					}
				}
				if (selectedRecords.length > 0)
					grid.getSelectionModel().select(selectedRecords);
				if(mode === "VIEW"){
					grid.getSelectionModel().setLocked(true);					
				}	
			}
		}
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		strUrl = Ext.String.format('services/userCategory/bankReports/{0}',
				strAction);
				
		this.preHandleGroupActions(strUrl, '',record);
		
	},
	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = this.getBankReportGrid();
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
							userMessage : parentViewState
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			grid.setLoading(true); 
				
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
							if (response.responseText != '[]') {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										parentViewState = data.parentIdentifier;
										document.getElementById('viewState').value = parentViewState;
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
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							
							//me.enableValidActionsForGrid();
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
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var grid = me.getBankReportGrid();
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			enableActionEnabled = false;
			disableActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (!item.data.assigned) {
							enableActionEnabled = true;
						} else if (item.data.assigned) {
							disableActionEnabled = true;
						}
					});
		}
		
		
		var enableBtn = me.getAssignBtn();
		var disableBtn = me.getDeLinkBtn();
		
		
		if (!disableActionEnabled && !enableActionEnabled) {
			disableBtn.setDisabled(!blnEnabled);
			enableBtn.setDisabled(!blnEnabled);
		} 
		else if (disableActionEnabled && enableActionEnabled) {
			enableBtn.setDisabled(!blnEnabled);
			disableBtn.setDisabled(!blnEnabled);
		}
		else if (enableActionEnabled) {
			enableBtn.setDisabled(blnEnabled);
		} 
		else if (disableActionEnabled) {
			disableBtn.setDisabled(blnEnabled);
		}
		
		
		
	}


});