function createFilterGridUserActivity() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				minHeight : 'auto',
				overFlowY:'auto',
				margin : '0 0 12 0',
				width:'auto',
				forceFit:true,
				popup : true,
				cls : 't7-grid',
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						 var IconLinkClicked = (e.target.tagName == 'A');	
	         		     if(IconLinkClicked){
					        var clickedId = e.target.id;
							if(clickedId=='advFilterEdit'){
								$(document).trigger("editFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterView'){
								$(document).trigger("viewFilterEvent",[view, rowIndex]);
							}else if(clickedId=='advFilterDelete'){
								$(document).trigger("deleteFilterEvent",[view, rowIndex]);
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 40,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					align : 'center',
					text : getLabel('actions','Actions'),
					sortable:false,
					width:80,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
				}, {
					text : getLabel('filterName','Filter Name'),
					dataIndex : 'filterName',
					width:280,
					sortable:false,
					menuDisabled : true
				}, {
					xtype : 'actioncolumn',
					align : 'center',
					width:65,
					header : getLabel('lbl.userAct.advFilter.order', 'Order'),
					sortable:false,
					menuDisabled : true,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpEvent',
									[grid, rowIndex, 1]);
						}
					}]
				}],
				renderTo : 'filterList'
			});
	grid.on('resize', function() {
				grid.doLayout();
			});

	return grid;
}

function filterGridStore(){
	var myStore = new Ext.data.ArrayStore({
		autoLoad : true,
		fields : ['filterName'],
		proxy : {
			type : 'ajax',
			url : 'services/userfilterslist/userActivityFilter.srvc',
			headers: objHdrCsrfParams,
			reader : {
				type : 'json',
				root : 'd.filters'
			}
		},
		listeners : {
			load : function(store, records, success, opts) {
				store.each(function(record) {
							record.set('filterName', record.raw);
						});
			}
		}
	})
return myStore;
}
