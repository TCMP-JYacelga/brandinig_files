var selectedr = new Array();
var removedr = new Array();
Ext.define('CPON.view.AccountBasedAccReportPopup', {
	extend : 'Ext.window.Window',
	xtype : 'accountBasedAccReportPopup',
	modal : true,
	closeAction : 'destroy',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	minHeight : 156,
	maxHeight : 550,
	width : 480,
	maxWidth : 735,
	resizable : false,
	draggable : false,
	cls : 'non-xn-popup',
	config : {
		bankReportCode : null,
		showCheckBoxColumn : true
	},
	listeners : {
 'afterrender':function() {
		 if(this.header.body.dom.firstElementChild.clientWidth != this.header.body.dom.firstElementChild.firstElementChild.clientWidth)
		 {
		 	this.header.body.dom.firstElementChild.firstElementChild.className="";
		 	var toolbar = this.down('button[itemId="btnSubmitAcc"]').up("toolbar").getEl().dom;
		 	toolbar.firstElementChild.firstElementChild.className = "";
		 }
	 }
 	},
	initComponent : function() {
		var me = this;
		this.title = getLabel('accounts', 'Accounts');
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			hideRowNumbererColumn : true,
			cls : 't7-grid',
			scroll : 'vertical',
			minHeight : 40,
			checkBoxColumnWidth : _GridCheckBoxWidth,
			maxHeight : 400,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : me.showCheckBoxColumn,
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			columnModel : [ {
				colHeader : getLabel('accountno', 'Account'),
				colId : 'accountNmbr',
				width : 130
			}, {
				colHeader : getLabel('accountName', 'Account Name'),
				colId : 'accountName',
				width : 210
			} ],
			storeModel : {

				fields : [ 'accountNmbr', 'accountName','recordKeyNo' ,'isAssigned'],

				proxyUrl : 'cpon/clientServiceSetup/bankReportAccounts.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handlePagingData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handlePagingData,
				select : me.addSelected,
				deselect : me.removeDeselected,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			}
		});

		me.items = [ {
			xtype : 'panel',
			layout : 'hbox',
			cls : 'ft-padding-bottom',
			height : (screen.width) > 1024 ? 30 : 26,
			items : [

			{
				xtype : 'panel',
				layout : 'hbox',
				cls : 'ux_extralargemargin-right',
				flex: 1,
				items : [ {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					text : getLabel('reportName', 'Report Name') + " : "
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal ux_text-elipsis',
					text : '',
					itemId : 'aReportName',
					width : 140,
					autoEl: {
					tag: 'label',
					'title': ''
					},
					margin : '0 0 0 2',
					style : {
					'font-weight' : 'normal !important'
					}
				} ]

			}, {

				xtype : 'panel',
				layout : 'hbox',
				cls : 'ux_extralargemargin-left',
				flex: 1,
				items : [ {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					text : getLabel('lbl.type', 'Type') + " : "
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					text : getLabel('bankRptReportAccount', 'Account'),
					margin : '0 0 0 2',
					style : {
					'font-weight' : 'normal !important'
					}
				} ]

			} ]
		}, clientListView ];

		me.bbar = ['->', {
			xtype : 'button',
			text : getLabel('btnDone','Done'),//getLabel('ok', 'OK'),
			itemId : 'btnSubmitAcc',
			//glyph : 'xf058@fontawesome',
			//cls : 'ux_button-background-color footer-buttons-inner submit-xbtn-left',
			handler : function() {
				var selection = me.down('grid').getSelectedRecords();
				var grid = me.down('grid');
				var records = grid.getSelectedRecords();
				
				var records = selectedr;
				var remRecords = '';
				
				for(var i = 0;i < removedr.length;i++)
				{
					remRecords = remRecords + removedr[i]+",";
				}
				this.fireEvent("assignAccBankRep",selection, records, me.bankReportCode, remRecords);
				selectedr=[];
				removedr=[];
				
			}
		} ];

		this.callParent(arguments);
		selectedr=[];
				removedr=[];
	},
	addSelected : function(row, record, index, eopts) {
		var allreadyPresent = false;
		for ( var i = 0; i < selectedr.length; i++) {
			if (selectedr[i].data.accountNmbr === record.data.accountNmbr) {
				allreadyPresent = true;
				break;
			}
		}
		if (!allreadyPresent) {
			selectedr.push(record);
			record.raw.isAssigned = true;
			allreadyPresent = false;
		}
		
		
		var index = -1;
		for ( var i = 0; i < removedr.length; i++) {
			if (removedr[i] === record.data.accountNmbr) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			removedr.splice(index, 1);
		}
	},

	removeDeselected : function(row, record, index, eopts) {
		if(record.data.isAssigned == true)
		{
			removedr.push(record.data.accountNmbr);
		}
		var index = -1;
		for ( var i = 0; i < selectedr.length; i++) {
			if (selectedr[i].data.accountNmbr === record.data.accountNmbr) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			selectedr.splice(index, 1);
		}
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var isAssigned = 'false';
		if(!me.up('accountBasedAccReportPopup').showCheckBoxColumn)
			isAssigned = 'true';
		
		strUrl = strUrl + '&id='+ encodeURIComponent(parentkey)+ '&$select=' + me.up('accountBasedAccReportPopup').bankReportCode + '&$isAssigned=' + isAssigned ;
		grid.loadGridData(strUrl, me.up('accountBasedAccReportPopup').updateSelection, null, false);
	},
	handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var isAssigned = 'false';
		if(!me.showCheckBoxColumn)
			isAssigned = 'true';
		
		strUrl = strUrl + '&id='+ encodeURIComponent(parentkey)+ '&$select=' + me.bankReportCode + '&$isAssigned=' + isAssigned ;
		grid.loadGridData(strUrl, me.updateSelection, null, false);
	},
	updateSelection : function(grid, responseData, args) {
		var me = this;
		
		if (!Ext.isEmpty(grid)) {
		
			var store = grid.getStore();
			var records = store.data;
			if (!Ext.isEmpty(records)) {
				var items = records.items;
				if (!Ext.isEmpty(items)) {
					var selectedRecords = new Array();
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						
						var isInSelectedr = false;
							
								/*var assignedList = responseData.d.selectedValues;
								for (var j = 0; j < assignedList.length; j++) {
									if (assignedList[j].featureId === item.data.featureId) {
										isInSelectedr = true;
										break;
									}
								} */
								
								for (var j = 0; j < selectedr.length; j++) {
									if (selectedr[j].data.accountNmbr == item.data.accountNmbr) {
										isInSelectedr = true;
										break;
									}
								}
								if (item.data.isAssigned === true) {
									isInSelectedr = true;
								}
								if (isInSelectedr) {
									selectedRecords.push(item);
								}
					}
					grid.getSelectionModel().setLocked(false);
					if (selectedRecords.length > 0)
						grid.getSelectionModel().select(selectedRecords);
						
				}
			}
		}
		if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
			grid.getSelectionModel().setLocked(true);
		}
	}
});
