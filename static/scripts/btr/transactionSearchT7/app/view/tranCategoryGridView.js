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
			//padding : '10 0 0 0',
			autoHeight : true,
			maxHeight: 390,
			minHeight : 35,//400,
			width : 'auto',//'100%',
			scroll : 'vertical',
			/*overflowY: 'auto',
			overflowX: 'hidden',*/
			cls : 't7-grid',
			listeners : {
				cellclick : function(view, td, cellIndex, record, tr, rowIndex, e,
						eOpts) {
				var IconLinkClicked = (e.target.tagName == 'A');	
		           if(IconLinkClicked){
		           		var clickedId = e.target.id;
				        var className = e.target.className;
				        if(clickedId=='advFilterDelete'){
						$(document).trigger("deleteTransactionCategory",[view, rowIndex]);
						}else if(clickedId=='advFilterView'){
							$(document).trigger("viewTransactionCategory",[view, rowIndex]);
						}
						/*if(className=='grid-row-action-icon  icon-view'){
						  // this.fireEvent('viewTransactionCategory',view,rowIndex);						
						  $(document).trigger('viewTransactionCategory',[view,record]);
						}else if(className=='grid-row-action-icon  icon-delete'){
						     $(document).trigger('deleteTransactionCategory',[view,rowIndex]);
						}*/
					}	
		           var upDownIconLinkClicked = (e.target.tagName == 'I');	
					    if(upDownIconLinkClicked){
						var className = e.target.className;
						 if(className=='fa fa-caret-up'){
						   $(document).trigger('transactionCategoryOrderChange',[view,rowIndex,-1],'up');
						}else if(className=='fa fa-caret-down'){
						   $(document).trigger('transactionCategoryOrderChange',[view,rowIndex,1],'down');
						}else{
						}
					}
				}
			},
			initComponent : function() {
				var me = this;
				me.columns = [ 
						{
							xtype : 'actioncolumn',
							header : getLabel('actions', 'Actions'),
							width : 70,
							flex : 2,
							parent : this,
							sortable : false,
							align : 'center',
							tdCls : 'xn-grid-cell-padding',
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
						         return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" style="padding-right:3px; padding-left:5px" title="View"></a>' 
						         +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
							  }

						},
						{
							header : getLabel('typecodesetname',
									'Type Code Set Name'),
							dataIndex : 'txnCategory',
							width : 320,
							flex : 6
						}, 
						/*{
							xtype : 'actioncolumn',
							width : 40,
							parent : this,
							align : 'center',
							sortable : false,*/
							/*items : [{
								iconCls : 'grid-row-delete-icon',
								tooltip : getLabel('delete', 'Delete'),
								handler : function(grid, rowIndex, colIndex) {
									me.parent.fireEvent(
											'deleteTransactionCategory', grid,
											rowIndex);
								}
								
							}]*/
							/*renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						         return '<a class="grid-row-action-icon  icon-delete" href="#" title="Delete"></a>';
							  }

						},*/
						 {
							xtype : 'actioncolumn',
							width : 60,
							flex : 2,
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