var selectedr = new Array();
var removedr = new Array();
Ext.define('CPON.view.AccAssignmentPopupView', {
			extend : 'Ext.window.Window',
			xtype : 'accAssignmentPopupView',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 470,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
			autoHeight : true,
			//closeAction : 'hide',
			modal : true,
			draggable : false,
			resizable : false,
			autoScroll : true,
			title : getLabel('accountName','Account Name'),
			config : {
				itemId : null,
				packageId : null,
				id : null
			},
			listeners : {
				'resize' : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				strAvlblAccUrl = null;
				var parent =this.up('pkgAssignmentPopupView');
				var pkgId ;
				if(parent)
					pkgId = parent.packageId;
				else
					pkgId = me.packageId;
				if('02' == srvcCode)
				{
					strAvlblAccUrl = 'cpon/clientServiceSetup/availableAccounts.json';
				}
				if('05' == srvcCode)
				{
					strAvlblAccUrl = 'cpon/clientServiceSetup/availableCollAccounts.json';
				}
				
				clearLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'clearLink',
					hidden : true,
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
					html: '<a>Clear</a>',
					listeners: {
						'click': function() {
							var filterContainer = me.down('[itemId="packageFilter"]');
							filterContainer.setValue("");
							var selected = me.down('component[itemId="clearLink"]');
							selected.hide();
						},
						element: 'el',
						delegate: 'a'
					}
				});
				
				accountFilter = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					itemId : 'packageFilter',
					cfgUrl : strAvlblAccUrl,
					cfgQueryParamName : 'accountNmbr',
					cfgRecordCount : -1,
					//cfgSeekId : 'payAccountSeek',
					cfgRootNode : 'd.accounts',
					cfgDataNode1 : 'accountNmbr',
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [
									   {
											key : 'id',
											value : encodeURIComponent(parentkey)
										},
									   {
											key : '$select',
											value : pkgId   
									   }
									   ],
					fitToParent : true,
					emptyText : getLabel('accNoSearch','Search by Account'),
					listeners : {
								'select':function(){ 
									me.searchPackages();
									var selected = me.down('component[itemId="clearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = me.down('[itemId="packageFilter"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = me.down('component[itemId="clearLink"]');
										selected.hide();
									  me.searchPackages();
									  }
								 }
							 }
				});
				

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							minHeight : 40,
							maxHeight : 350,
							pageSize : 5,
							checkBoxColumnWidth : _GridCheckBoxWidth,
							cls : 'ux_extralargepadding-top t7-grid',
							columnModel : colModel,
							hideRowNumbererColumn : true,
							rowList : [ 5, 10, 15, 20, 25, 30 ],
							storeModel : {
								fields : ['accountName','identifier','accountNmbr','isAssigned','accountId', 'accountCcyCode'],
								proxyUrl : strAvlblAccUrl,
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								select : me.addSelected,
								deselect : me.removeDeselected,
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

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [accountFilter, clearLink
						/*{
							xtype : 'button',
							itemId : 'btnSearchPackage',
							text : getLabel('search', 'Search'),
							cls : 'xn-button ux_button-background-color ux_button-padding ux_cancel-button',
							handler : function() {
								me.searchPackages();
							}
						}*/
					]
				},adminListView];
				
				me.bbar = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							//glyph : 'xf056@fontawesome',
							//cls : 'xn-button ux_button-background-color ux_button-padding ux_cancel-button',
							handler : function() {
								me.close();
							}
				}, '->',
							{
							xtype : 'button',
							text : getLabel('submit', 'Submit'),
							itemId : 'btnSubmitPackage',
							//cls : 'xn-button ux_button-background-color ux_button-padding ux_cancel-button',
							//glyph : 'xf058@fontawesome',
							handler : function() {
								var records = selectedr;
								var remRecords = '';
								
								for(var i = 0;i < removedr.length;i++)
								{
									remRecords = remRecords + removedr[i]+",";
								}
								this.fireEvent("assignAccounts",selectedr,me.id,remRecords);
								selectedr = [];
								removedr = [];
							}
						}];
				me.callParent(arguments);
			},
			addSelected : function(row, record, index, eopts) {
				var allreadyPresent = false;
				for ( var i = 0; i < selectedr.length; i++) {
					if (selectedr[i].data.accountId === record.data.accountId) {
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
					if (removedr[i] === record.data.accountId) {
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
					removedr.push(record.data.accountId);
				}
				var index = -1;
				for ( var i = 0; i < selectedr.length; i++) {
					if (selectedr[i].data.accountId === record.data.accountId) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					selectedr.splice(index, 1);
				}
			},
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "accountNmbr",
							"colDesc" :  getLabel('accountNumber','Account')
						},{
							"colId" : "accountName",
							"colDesc" :  getLabel('accountName','Account Name')
						},{
							"colId" : "accountCcyCode",
							"colDesc" :  getLabel('ccy', 'Currency')
						}];
				objWidthMap = {
					"accountNmbr" : 180,
					"accountName" : 165,
					"accountCcyCode" : 110
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
						//cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},

			
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = grid.up('accAssignmentPopupView');
				grid.packageId = me.packageId;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$select='+me.packageId;
				if('02' == srvcCode)
				{
					strUrl = strUrl + '&$filter=acctUsagePay eq \'Y\'';
				}
				if('05' == srvcCode)
				{
					strUrl = strUrl + '&$filter=acctUsageColl eq \'Y\'';
				}
				
				if (!Ext.isEmpty(accountFilter.getValue()))
				{
					strUrl = strUrl + ' and acctNmbr lk \''+ accountFilter.getValue() +'\'';
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
				var selectAll = args.selectAllCheckBox;
				if (!Ext.isEmpty(grid)) {
				
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						if (!Ext.isEmpty(items)) {
							var selectedRecords = new Array();
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								if (item.data.isAssigned === true) {
									selectedRecords.push(item)
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
