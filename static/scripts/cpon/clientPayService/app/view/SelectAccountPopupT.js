var selectedr = new Array();
Ext.define('GCP.view.SelectAccountPopupT', {
			extend : 'Ext.window.Window',
			xtype : 'selectAccountPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 420,
			autoHeight : true,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			autoScroll : true,
			title : getLabel('cashPositionExport','CASH POSITION EXPORT'),
			config : {
				fnCallback : null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
							
				accountfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/clientServiceSetup/accountList.json' ,
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'acctName',
					cfgRecordCount : -1,
					cfgRootNode : 'd.accounts',
					cfgDataNode1 : 'acctName'
				});
				

				accountList = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							minHeight : 150,
							pageSize : 5,
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['acctNmbr','acctName','bankDesc','accountId','cashPositionAssigned'],
								proxyUrl : 'cpon/clientServiceSetup/accountList.json',
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
								console.log("Check this > ")
							}

						});

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [accountfield]
				},accountList];
				
				accountfield.cfgExtraParams = [ {
					key : 'id',
					value : encodeURIComponent(parentkey)
				} ];
				
				me.buttons = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
				},
							{
							xtype : 'button',
							text : getLabel('submit', 'Submit'),
							itemId : 'btnSubmitAccount',
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf058@fontawesome',
							handler : function() {
								me.saveItems();
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "acctNmbr",
							"colDesc" :  getLabel('accNo','Account')
						},{
							"colId" : "acctName",
							"colDesc" :  getLabel('accName','Account Name')
						},{
							"colId" : "bankDesc",
							"colDesc" :  getLabel('bankName','Bank Name')
						}];
				objWidthMap = {
					"acctNmbr" : 120,
					"acctName" : 120,
					"bankDesc" : 120
				};
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
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
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},
			
			saveItems : function() {
				var me = this;
				var records = me.down('grid').getSelectionModel().getSelection();
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records);
					
					if(cashPositionId == null)
						saveCashPostionExport('saveCashPositionMst.form', 'frmMain');
					else
						saveCashPostionExport('updateCashPositionMst.form', 'frmMain');
					
					me.close();
				}
			},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				
				if (!Ext.isEmpty(accountfield.getValue()))
				{
					strUrl = strUrl + ' and acctName lk \''+ accountfield.getValue() +'\'';
				}
				strUrl = strUrl + '&cashPositionId='+ cashPositionId;
				strUrl = strUrl + '&frequencyRefTime='+ frequencyRefTime ;
				
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},
			
			updateSelection : function(grid, responseData, args) {
				var me = this;
			
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								
								var isAssigned = item.data.cashPositionAssigned;
								
								if('Y' == isAssigned){
									
									selectedRecords.push(item);
								}	
								else if('Y' === setAllSelected){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
				/*if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
					grid.getSelectionModel().setLocked(true);
				}*/
			}
		
			
		});
