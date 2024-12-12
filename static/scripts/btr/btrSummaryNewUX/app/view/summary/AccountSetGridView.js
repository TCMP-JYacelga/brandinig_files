/**
 * @class GCP.view.summary.AccountSetGridView
 * @extends Ext.grid.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSetGridView', {
			extend : 'Ext.grid.Panel',
			requires : ['Ext.grid.column.Action'],
			xtype : 'accountSetGridView',
			selType : 'rowmodel',
			autoHeight : true,
			//height : 440,
			maxHeight: 375,
			minHeight: 35,
			overflowY: 'auto',
			overflowX: 'hidden',
			width : 'auto',//'100%',
			cls : 'xn-grid-cell-inner t7-grid',
			
			listeners: {
		cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
		var linkClicked = (e.target.tagName == 'SPAN');
						if (linkClicked) {
							var filterCode = record.data.filterName;
							var className = e.target.className;
							if (!Ext.isEmpty(className)	&& className.indexOf('filterSearchLink') !== -1) {
								this.fireEvent('filterSearchEvent',filterCode);
							}
						}
		var IconLinkClicked = (e.target.tagName == 'A');	
			if(IconLinkClicked){
			        var clickedId = e.target.id;
					if(clickedId=='advFilterDelete'){
						$(document).trigger("deleteFilterEvent",[view, rowIndex]);
					}else if(clickedId=='advFilterView'){
						$(document).trigger("viewAccountSet",[view, rowIndex]);
					}
				}
           /*if(IconLinkClicked){
		        var className = e.target.className;
				var parent = this;
				if(className=='linkbox seeklink'){
				   this.parent.fireEvent('viewAccountSet',view.getStore().getAt(rowIndex));
				}else if(className=='fa fa-times'){
				     this.parent.fireEvent('deleteAccountSet',view,rowIndex);
				}else{
				 
				}
			}*/	
           var upDownIconLinkClicked = (e.target.tagName == 'I');	
			    if(upDownIconLinkClicked){
				var className = e.target.className;
				var parent = this;
				 if(className=='fa fa-caret-up'){
					this.doHandleAccountSetOrder(view, rowIndex,-1);
					this.parent.fireEvent('accountSetOrderChange',view,rowIndex,-1,'up');
				}else if(className=='fa fa-caret-down'){
					this.doHandleAccountSetOrder(view, rowIndex,1);
					this.parent.fireEvent('accountSetOrderChange',view,rowIndex,1,'down');
				}else{
				}
			}
			
		},
		viewready : function( view, eOpts ){
			$('#advancedFilterPopup').dialog('option', 'position', 'center');
		}
	},
			
			initComponent : function() {
				var me = this;
				me.columns = [{
							xtype : 'actioncolumn',
							width : 70,
							flex : 2,
							parent : this,
							align : 'center',
							sortable : false,
							header : getLabel('actions', 'Actions'),
							renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" style="padding-right:3px; padding-left:5px " title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 		}
							/*items : [{
								iconCls : 'linkbox seeklink',
								tooltip : getLabel('view', 'View'),
								handler : function(grid, rowIndex, colIndex) {
									$(document).trigger("viewAccountSet",[grid.getStore().getAt(rowIndex)]);
								}
							}]*/
						},
						{
							header : getLabel('accSetName', 'Account Set Name'),
							dataIndex : 'accountSetName',
							width : 300,
							flex : 6
						}, {
							xtype : 'actioncolumn',
							width : 60,
							flex : 2,
							header : getLabel('order', 'Order'),
							align : 'center',
							parent : this,
							sortable : false,
							menuText : getLabel('order', 'Order'),
							items : [{
								iconCls : 'grid-row-up-icon',
								tooltip : getLabel('up', 'Up'),
								handler : function(grid, rowIndex, colIndex) {
									me.doHandleAccountSetOrder(grid, rowIndex, -1);
									$(document).trigger('accountSetOrderChange',
											[grid, rowIndex, -1,'up']);
								}
							}, {
								iconCls : 'grid-row-down-icon',
								tooltip : getLabel('down', 'Down'),
								handler : function(grid, rowIndex, colIndex) {
									me.doHandleAccountSetOrder(grid, rowIndex, 1);
									$(document).trigger('accountSetOrderChange',
											[grid, rowIndex, 1],'down');
								}
							}]
						}

				];
				me.store = Ext.create('Ext.data.Store', {
							fields : ['accountSetName', 'accounts'],
							data : me.accountSetStoreData
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
			},
			doHandleAccountSetOrder : function(grid, rowIndex, direction) {
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
			}			
		});