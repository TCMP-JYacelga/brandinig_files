Ext.define('GCP.controller.BankReportsController',{
	extend : 'Ext.app.Controller',
	requires : [],
	views : [ 'GCP.view.BankReportsGridView'],
	refs : [
			{
				ref : 'bankReportGrid',
				selector : 'bankReportsGridView grid[itemId="bankReportGrid"]'
			},{
				ref : 'groupActionBar',
				selector : 'bankReportsGridView toolbar[itemId=gridActionBar]'
			},{
				ref : 'assignBtn',
				selector : 'clientPayServiceView toolbar[itemId="gridActionBar"] button[itemId="assign"]'
			},{
				ref : 'deLinkBtn',
				selector : 'clientPayServiceView toolbar[itemId="gridActionBar"] button[itemId="unassign"]'
			},
			{
				ref : 'matchCriteria',
				selector : 'bankReportsGridView radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'bankReportsGridView textfield[itemId="searchTxnTextField"]'
			}
			],
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
						performRowAction : me.handleRowAction,
						gridRowSelectionChange : function(grid, record, recordIndex, records, jsonData) {
						  me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData); 
						}
					 
					},
			'bankReportsGridView toolbar[itemId=gridActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
				},
			'bankReportsGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
				me.searchBankReportsGrid();
									}
				},
			'bankReportsGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
				me.searchBankReportsGrid();
				}
				}
					
				});
	},
	searchBankReportsGrid : function() {
			var me = this;
			var searchValue = me.getSearchTxnTextInput().value;
			var anyMatch = me.getMatchCriteria().getValue();
			if ('anyMatch' === anyMatch.searchOnPageOption) {
				anyMatch = false;
			} else {
				anyMatch = true;
			}
	
			var grid = this.getBankReportGrid();
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
	handleLoadGridData : function(grid, url, pgSize, newPgNo,
			oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&categoryId='+ userCategory;
		Ext.Ajax.request({
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
		});
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
			}
		}
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		strUrl = Ext.String.format('userCategory/bankReports/{0}',
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
							identifier : records[index].data.identifier
							//userMessage : parentkey
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
		var grid = me.getPaymentGrid();
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			enableActionEnabled = false;
			disableActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.activeFlag == "N") {
							enableActionEnabled = true;
						} else if (item.data.activeFlag == "Y") {
							disableActionEnabled = true;
						}
					});
		}

		var enableBtn = me.getAssignBtn();
		var disableBtn = me.getDelinkBtn();

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