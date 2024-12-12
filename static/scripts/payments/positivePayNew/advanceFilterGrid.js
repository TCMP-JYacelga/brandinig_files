function createFilterGrid() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY:'auto',
				width:708,
				forceFit:true,
				popup : true,
				margin: '0 0 12 0',
				cls : 't7-grid',
				listeners : {
					cellclick : function ( grid, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
						if (e.target.tagName === 'A') {
							if ( e.target.className === 'grid-row-action-icon icon-view cursor_pointer' ) {
								$(document).trigger("viewFilterEvent", [grid, rowIndex]);
							} else if ( e.target.className === 'grid-row-action-icon icon-edit cursor_pointer' ) {
								$(document).trigger("editFilterEvent", [grid, rowIndex]);
							} else if ( e.target.className === 'grid-row-action-icon icon-delete cursor_pointer' ) {
								$(document).trigger("deleteFilterEvent", [grid, rowIndex]);
							} else {
								
							}
						}
					}
				},
				columns : [{
					text: '#',
					width : 50,
					align : 'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					header : getLabel('actions', 'Actions'),
					align : 'center',
					sortable:false,
					flex:1,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
				}, {
					text : getLabel('filterName', 'Filter Name'),
					dataIndex : 'filterName',
					flex : 3,
					sortable : false,
					menuDisabled : true
				}, {
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('order', 'Order'),
					sortable : false,
					flex:1,
					menuDisabled : true,
//					renderer : function ( value ) {
//						var returnString = '';						
//						for ( i = 0 ; i < this.items.length ; i++ ) {
//							returnString = returnString + '<a class="' + this.items[i].iconClass + '"></a>';
//						}						
//				        return returnString;
//					},
					items : [{
						iconCls : 'grid-row-up-icon cursor_pointer',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon cursor_pointer',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
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

function showFilterSeqAsPerPref(actualStore) {
	var myStore = null;
	var records = [];
	
	Ext.Ajax.request({
		url : 'services/userpreferences/positivepay/advanceFilterOrderList.json',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var responseData = Ext.decode(response.responseText);
				if (responseData && responseData.preference) {
					var filtersObj = JSON.parse(responseData.preference);
					var filterNames = filtersObj.filters;

					if (!Ext.isEmpty(filterNames)) {
					
						for (var i = 0; i < filterNames.length; i++) {
							var recPosition = $.inArray(filterNames[i], actualStore);
							if (recPosition > -1) {
								records.push({
											'filterName' : filterNames[i]
										});
								actualStore.splice(recPosition,1);		
							}
							
						}
						for (var i = 0; i < actualStore.length; i++) {
							records.push({
										'filterName' : actualStore[i]
									});
						}
						myStore = Ext.create('Ext.data.Store', {
									fields : ['filterName'],
									data : records,
									autoLoad : true
								});
					}
				}
			} else {
				for (var i = 0; i < actualStore.length; i++) {
					records.push({
								'filterName' : actualStore[i]
							});
				}
				myStore = Ext.create('Ext.data.Store', {
							fields : ['filterName'],
							data : records,
							autoLoad : true
						});

			}
		},
		failure : function(response) {
			// console.log('Error Occured');
		}
	});
	return myStore;
}

function filterGridStore() {
	var myNewStore = null;
	var strUrl = 'userfilterslist/positivepayFilter.srvc?';
	
	Ext.Ajax.request({
				url : strUrl,
				async : false,
				method : "GET",
				success : function(response) {
					if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);
						if (responseData && responseData.d.filters) {
							var arrRecords = responseData.d.filters;
							myNewStore = showFilterSeqAsPerPref(arrRecords);
						}
					}
				}
			});
	return myNewStore;
}
