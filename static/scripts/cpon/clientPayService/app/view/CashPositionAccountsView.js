Ext.define('GCP.view.CashPositionAccountsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountList',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = "";
				
				if('Y' === allSelectedFlagE)
					strUrl = 'cpon/clientServiceSetup/accountList.json';
				else
					strUrl = 'cpon/clientServiceSetup/cashPosnDetailAccountList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '0 0 3 0',
							minHeight : 0,
							columnModel : colModel,
							handleRowIconClick : function(tableView, rowIndex, columnIndex,
									btn, event, record) {
								me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
										event, record);
							},
							storeModel : {
								fields : ['identifier','acctName','acctNmbr', 'bankDesc', 'ccyCode','accountId'],
								proxyUrl : strUrl,
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
				this.items = [adminListView];
				this.callParent(arguments);
			},
			
			 createActionColumn : function() {
					var me = this;
					var objActionCol = null;
			
						objActionCol = {
							colType : 'action',
							colId : 'action',
							width : 40,
							align : 'right',
							locked : true,
							items : [{
										itemId : 'btnDiscard',
										itemCls : 'button-icon icon-button-reject middleAlign',
										toolTip : getLabel('discardToolTip', 'Discard Record')
									}]
							};
					
					return objActionCol;
				},
			
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
					record) {
				var me = this;
				var actionName = btn.itemId;
				
				 if (actionName === 'btnDiscard') {
					this.preHandleGroupActions("cpon/clientServiceSetup/discardCashPosAccount.json", parentkey, record);
				}
			},
			
			preHandleGroupActions : function(strUrl, parentkey,record) {
				var me = this;
				var grid = adminListView;
					var accountid =  record.data.accountId;
					var jsonData = { 
								identifier : parentkey,
								cashPositionId : cashPositionId,
								frequencyRefTime : 'E',
								accountId :accountid
							};
					
					Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : jsonData,
								success : function(response) {
										saveCashPostionExport('updateCashPositionMst.form', 'frmMain');
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
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
					"colId" : "acctNmbr",
					"colDesc" : "Account"
				}, {
					"colId" : "acctName",
					"colDesc" : "Account Name"
				},{
					"colId" : "bankDesc",
					"colDesc" : "Bank"
				}, {
					"colId" : "ccyCode",
					"colDesc" : "CCY"
				}];
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

				cfgCol.width = 150;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
				
			}
			
			arrCols.push(me.createActionColumn());
		}
		
		return arrCols;
	},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = "";
			strRetValue = value;
		return strRetValue;
	},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				
				if('N' === allSelectedFlagE)
				{
					strUrl = strUrl + '&cashPositionId='+ cashPositionId;
				    strUrl = strUrl + '&frequencyRefTime='+ slotvalue[0] ;
				}
				grid.loadGridData(strUrl, null, null, false);
			}
		});
