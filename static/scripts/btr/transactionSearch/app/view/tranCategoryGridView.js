/**
 * @class GCP.view.tranCategoryGridView
 * @extends Ext.grid.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.tranCategoryGridView', {
			extend : 'Ext.grid.Panel',
			requires : ['Ext.grid.column.Action'],
			xtype : 'tranCategoryGridView',
			selType : 'rowmodel',
			padding : '10 0 0 0',
			autoHeight : true,
			minHeight : 400,
			width : '100%',
			cls : 'xn-grid-cell-inner',
			listeners : {
				cellclick : function(view, td, cellIndex, record, tr, rowIndex, e,
						eOpts) {
				var IconLinkClicked = (e.target.tagName == 'A');	
		           if(IconLinkClicked){
				        var className = e.target.className;
						if(className=='grid-row-action-icon icon-view'){
						   this.fireEvent('viewTransactionCategory',view,rowIndex);
						}else if(className=='fa fa-times'){
						     this.fireEvent('deleteTransactionCategory',view,rowIndex);
						}
					}	
		           var upDownIconLinkClicked = (e.target.tagName == 'I');	
					    if(upDownIconLinkClicked){
						var className = e.target.className;
						 if(className=='fa fa-caret-up'){
						   this.fireEvent('transactionCategoryOrderChange',view,rowIndex,-1,'up');
						}else if(className=='fa fa-caret-down'){
						   this.fireEvent('transactionCategoryOrderChange',view,rowIndex,1,'down');
						}else{
						}
					}
				}
			},
			initComponent : function() {
				var me = this;
				me.columns = [{
							xtype : 'rownumberer',
							text : '#',
							align : 'center',
							hideable : false,
							sortable : false,
							tdCls : 'xn-grid-cell-padding ',
							width : 30

						}, {
							xtype : 'actioncolumn',
							width : 40,
							parent : this,
							align : 'center',
							sortable : false,
							/*items : [{
								iconCls : 'grid-row-delete-icon',
								tooltip : getLabel('delete', 'Delete'),
								handler : function(grid, rowIndex, colIndex) {
									me.parent.fireEvent(
											'deleteTransactionCategory', grid,
											rowIndex);
								}
								
							}]*/
							renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="fa fa-times" href="#" title="Delete"></a>';
							  }

						}, {
							header : getLabel('typecodesetname',
									'Type Code Set Name'),
							dataIndex : 'txnCategory',
							width : 270
						}, {
							xtype : 'actioncolumn',
							width : 40,
							parent : this,
							align : 'center',
							sortable : false,
							/*items : [{
								iconCls : 'linkbox seeklink',
								tooltip : getLabel('view', 'View'),
								handler : function(grid, rowIndex, colIndex) {
									me.parent
											.fireEvent(
													'viewTransactionCategory',
													grid.getStore()
															.getAt(rowIndex));
								}
							}]*/
							renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="grid-row-action-icon icon-view" href="#" title="View"></a>';
							  }

						}, {
							xtype : 'actioncolumn',
							width : 55,
							header : getLabel('order', 'Order'),
							align : 'center',
							parent : this,
							sortable : false,
							/*items : [{
								iconCls : 'grid-row-up-icon',
								tooltip : getLabel('up', 'Up'),
								handler : function(grid, rowIndex, colIndex) {
									me.doHandleTransactionCategoryOrder(grid,
											rowIndex, -1);
									me.parent.fireEvent(
											'transactionCategoryOrderChange',
											grid, rowIndex, -1, 'up');
								}
							}, {
								iconCls : 'grid-row-down-icon',
								tooltip : getLabel('down', 'Down'),
								handler : function(grid, rowIndex, colIndex) {
									me.doHandleTransactionCategoryOrder(grid,
											rowIndex, 1);
									me.parent.fireEvent(
											'transactionCategoryOrderChange',
											grid, rowIndex, 1, 'down');
								}
							}]*/
							renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a  href="#" title="Down"><i class="fa fa-caret-down"></i></a>'+' '+'<a href="#" Title="Up"><i class="fa fa-caret-up"/></i></a>';
							  }
						}

				];
				me.store = Ext.create('Ext.data.Store', {
							fields : ['txnCategory', 'typeCodes'],
							data : me.transactionCategoryStoreData
						});

				me.callParent(arguments);
			},
			loadRawData : function(data, append) {
				var me = this;
				var objStore = me.store;
				result = objStore.proxy.reader.read(data), records = result.records;
				if (result.success) {
					objStore.currentPage = objStore.currentPage === 0
							? 1
							: objStore.currentPage;
					objStore.totalCount = result.total;
					objStore.loadRecords(records, append
									? objStore.addRecordsOptions
									: undefined);
					objStore.fireEvent('load', objStore, records, true);
				}
			}
			/*doHandleTransactionCategoryOrder : function(grid, rowIndex,
					direction) {
				var record = grid.getStore().getAt(rowIndex);
				if (!record) {
					return;
				}
				var index = grid.getStore().indexOf(record);
				if (direction < 0) {
					index--;
					if (index < 0) {
						return;
					}
				} else {
					index++;
					if (index >= grid.getStore().getCount()) {
						return;
					}
				}
				grid.getStore().remove(record);
				grid.getStore().insert(index, record);
			}*/
		});