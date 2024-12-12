function createFilterGrid() {
	var store = filterGridStore();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 430,
				overFlowY:'auto',
				width:708,
				forceFit:true,
				popup : true,
				cls : 't7-grid ft-padding-bottom',
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
					sortable:false,
					menuDisabled : true
				}, {
					xtype : 'actioncolumn',
					align : 'center',
					flex:1,
					header : getLabel('order', 'Order'),
					sortable:false,
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

function showFilterSeqAsPerPref(originalFilterOrder,filterGridStore) {
	var records = [];
	Ext.Ajax.request({
		url : 'services/userpreferences/sisummary/advanceFilterOrderList.json',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var responseData = Ext.decode(response.responseText);
				
				if (responseData && responseData.preference) {
					var filtersObj = JSON.parse(responseData.preference);
					var filterNames = filtersObj.filters;
					if(Ext.isEmpty(filterNames)&&originalFilterOrder.length>0){
						filterNames=originalFilterOrder;
						for(var i=0;i<filterNames.length;i++){
							records.push({
								'filterName' : filterNames[i]
							});
						}
						filterGridStore.loadData(records);
					}
					else if (!Ext.isEmpty(filterNames)) {
						for (var i = 0; i < filterNames.length; i++) {
							var recPosition = $.inArray(filterNames[i], originalFilterOrder);
							if (recPosition > -1) {
								records.push({
									'filterName' : filterNames[i]
									});
								originalFilterOrder.splice(recPosition,1);		
							}
							
						}
						for (var i = 0; i < originalFilterOrder.length; i++) {
							records.push({
										'filterName' : originalFilterOrder[i]
									});
						}	
						filterGridStore.loadData(records);
					}
				}
			}
		},
		failure : function(response) {
			// console.log('Error Occured');
		}
	});
}

function filterGridStore() {
	var myNewStore = Ext.create('Ext.data.Store', {
							fields : ['filterName'],
							data:[]
						});
	Ext.Ajax.request({
				url : 'services/userfilterslist/siGroupViewFilter.json',
				async : false,
				method : "GET",
				success : function(response) {
					if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);
						if (responseData && responseData.d.filters) {
							var arrRecords = responseData.d.filters;
							showFilterSeqAsPerPref(arrRecords,myNewStore);
						}
					}
				}
			});
	return myNewStore;
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
