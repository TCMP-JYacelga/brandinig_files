function createFilterGrid() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				/*height : 300,
				width : 400,
				autoScroll : true,*/
				maxHeight : 425,
    			margin : '0 0 12 0',
    			width : 'auto',
    			scroll : 'vertical',
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
					width : 50,
					align :'center',
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
					    return rowIndex+1;
				 }
				},{
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('actions', 'Actions'),
					sortable : false,
					menuDisabled : true,
					renderer: function(value, metaData, record, rowIndex, colIndex, store){ 
						    return '<a id="advFilterView" class="grid-row-action-icon  icon-view" href="#" title='+getLabel('view', 'View')+'></a>'
						          +'<a id="advFilterEdit" class="grid-row-action-icon icon-edit" href="#" title='+getLabel('edit', 'Edit')+'></a>'
						          +'<a id="advFilterDelete" class="grid-row-action-icon  icon-delete" href="#" title='+getLabel('delete', 'Delete')+'></a>';
					 }
					/*items : [{
						iconCls : 'grid-row-action-icon  icon-view',
						tooltip : getLabel('view', 'View'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger("viewFilterEvent",
									[grid, rowIndex]);
						}
					}, {
						iconCls : 'grid-row-action-icon   icon-edit',
						tooltip : getLabel('edit', 'Edit'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger("editFilterEvent",
									[grid, rowIndex]);
						}
					}]*/
				}, {
					text : getLabel('filterName', 'Filter Name'),
					dataIndex : 'filterName',
					flex : 1,
					sortable : false,
					menuDisabled : true
				}, {
					xtype : 'actioncolumn',
					align : 'center',
					header : getLabel('order', 'Order'),
					sortable : false,
					menuDisabled : true,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							$(document).trigger('orderUpGridEvent',
									[grid, rowIndex, -1]);
						}
					}, {
						iconCls : 'grid-row-down-icon',
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
	var strUrl;
	if(screenType == 'ACH')
		strUrl = 'services/userpreferences/passThruFileACH/advanceFilterOrderList.json';
	else
		strUrl = 'services/userpreferences/passThruPositivePay/advanceFilterOrderList.json';	
	
	Ext.Ajax.request({
		url : strUrl,
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var responseData = Ext.decode(response.responseText);
				if (responseData && responseData.preference) {
					var filtersObj = JSON.parse(responseData.preference);
					var filterNames = filtersObj.filters;

					if (!Ext.isEmpty(filterNames) && filterNames[0] != null )  {
					
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
					
					else {
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
	var strUrl;
	if(screenType == 'ACH')
		strUrl = 'userfilterslist/passThruFileACH.srvc?';
	else
		strUrl = 'userfilterslist/passThruPositivePay.srvc?';
	
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
