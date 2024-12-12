Ext.define('GCP.view.RecSummaryAdvFilterGridView', {
	extend:'Ext.grid.Panel',
	xtype : 'recSummaryAdvFilterGridView',
	width : 690,
	height : 540,
	autoScroll : true,
	overflowY :'hidden',
	callerParent : null,
	cls:'xn-grid-cell-inner',
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
		}
	},
	initComponent:function(){
		  var me=this;
		  var strUrl = 'services/userfilterslist/templateGroupViewFilter.json';
		  var myStore = Ext.create('Ext.data.Store', {
			fields : ['filterName'],
			pageSize : 20,
			proxy : {
				type : 'ajax',
				reader : {
					type : 'json'
				}
			},
			loadRawData : function(data, append) {
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
			autoLoad : false
		});
		 me.store=myStore;
					  me.columns=[{
						    xtype: 'rownumberer',
						    text : '#',
							align : 'center',
							hideable : false,
							sortable : false,
							tdCls : 'xn-grid-cell-padding ',
							width : 50
						  
					  },
					   { 
		            	  xtype:'actioncolumn',
						  width:100,
						  align : 'center',
						  tdCls : 'xn-grid-cell-padding',
		            	  parent:this,
		            	  items:[{
		                      iconCls: 'linkbox seeklink',
		                      tooltip: getLabel('view', 'View'),
		                      handler: function(grid, rowIndex, colIndex) {
		            			 
									if(me.callerParent == 'pmtGridView')
									{	
										me.fireEvent('viewGridFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtstdView'){
										me.fireEvent('viewFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtTxnView'){
										me.fireEvent('viewTxnFilterEvent',grid,rowIndex);
									}
		                      }
		            	  },
						  {
		                      iconCls: 'grid-row-action-icon  xn-adv-filter-grid-action-icon icon-edit',
		                      tooltip: getLabel('edit', 'Edit'),
		                      handler: function(grid, rowIndex, colIndex) {
									if(me.callerParent == 'pmtGridView')
									{	
										me.fireEvent('editGridFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtstdView'){
										me.fireEvent('editFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtTxnView'){
										me.fireEvent('editTxnFilterEvent',grid,rowIndex);
									}
								}
		            	  }]
		            	  
		            	},
		              { 
		            	  header:getLabel('filterName', 'Filter Name'),
		            	  dataIndex:'filterName',
		            	  width:345,
		            	   renderer: function(value){
								        return value + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="searchLink" class="small-linkblue filterSearchLink cursor_pointer ux_font-size14-normal">'
													 + getLabel('searchUsingFilter', 'Search Using Filter')
													 + '</span>'
								    }
		            },
		            { 
		            	xtype:'actioncolumn',
		            	width:90,
		            	align : 'center',
		            	header:getLabel('deleteFilter', 'Delete Filter'),
		            	parent:this,
		            	  items:[{
		            		  iconCls:'grid-row-delete-icon',
		            		  tooltip:'Delete',
		            		  handler:function(grid,rowIndex,colIndex){

								  if(me.callerParent == 'pmtGridView')
									{	
										this.parent.fireEvent('deleteGridFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtstdView'){
										this.parent.fireEvent('deleteFilterEvent',grid,rowIndex);
									}
									else if(me.callerParent == 'pmtTxnView'){
										this.parent.fireEvent('deleteTxnFilterEvent',grid,rowIndex);
									}
		            		  }
		            	  }]
		            	
		              },{
		                  xtype:'actioncolumn',
		                  width:65,
		                  align : 'center',
		                  header:getLabel('order', 'Order'),
		                  parent:this,
		                  items: [{
		                      iconCls: 'grid-row-up-icon',
		                      tooltip: getLabel('up', 'Up'),
		                      handler: function(grid, rowIndex, colIndex) {	
									if(me.callerParent == 'pmtGridView')
									{	
										me.fireEvent('orderUpGridEvent',grid,rowIndex,-1);
									}
									else if(me.callerParent == 'pmtstdView'){
										me.fireEvent('orderUpEvent',grid,rowIndex,-1);
									}
									else if(me.callerParent == 'pmtTxnView'){
										me.fireEvent('orderUpTxnEvent',grid,rowIndex,-1);
									}
		                      }
		                  },{
		                      iconCls: 'grid-row-down-icon',
		                      tooltip: getLabel('down', 'Down'),
		                      handler: function(grid, rowIndex, colIndex) {
		            				  
									if(me.callerParent == 'pmtGridView')
									{	
										me.fireEvent('orderUpGridEvent',grid,rowIndex,1);
									}
									else if(me.callerParent == 'pmtstdView'){
										me.fireEvent('orderUpEvent',grid,rowIndex,1);
									}
									else if(me.callerParent == 'pmtTxnView'){
										me.fireEvent('orderUpTxnEvent',grid,rowIndex,1);
									}
		                      }
		                  }]
		              }];
					  
		  Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var decodedJson = Ext.decode(response.responseText);
						var arrJson = new Array();
						
						if(!Ext.isEmpty(decodedJson.d.filters))
						{
						for(i=0;i<decodedJson.d.filters.length;i++)
						{
							arrJson.push({"filterName":decodedJson.d.filters[i]});
						}
						}
						me.store.loadRawData(arrJson);
						me.setLoading(false);
					},
					failure : function() {
						me.setLoading(false);
						Ext.MessageBox.show({
									title : getLabel('errorPopUpTitle', 'Error'),
									msg : getLabel('errorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
		  
		this.callParent(arguments);
	},
	loadRawData : function(data, append) {
		var me=this;
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
	
});