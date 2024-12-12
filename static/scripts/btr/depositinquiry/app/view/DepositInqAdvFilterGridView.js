Ext.define('GCP.view.DepositInqAdvFilterGridView', {
	extend:'Ext.grid.Panel',
	xtype : 'depositInqAdvFilterGridView',
	//minHeight:100,
	width : 464,
	//height : 250,
	autoScroll : true,
	overflowY :'hidden',
	//overflowX :'hidden',
	callerParent : null,
	cls:'xn-grid-cell-inner',
	
	initComponent:function(){
		  var me=this;
		  var strUrl = '';
		  if(me.callerParent == 'depInqStdView')
		  {
			strUrl = 'services/userfilterslist/depositInqFilter.json';
		  }
		  
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
				width : 30
			  
		  },{ 
        	xtype:'actioncolumn',
        	width:40,
        	align : 'center',
        	parent:this,
        	  items:[{
        		  iconCls:'grid-row-delete-icon',
        		  tooltip:'Delete',
        		  handler:function(grid,rowIndex,colIndex){

					  if(me.callerParent == 'depInqStdView'){
							this.parent.fireEvent('deleteFilterEvent',grid,rowIndex);
						}						
        		  }
        	  }]
        	
          },{ 
		            	  header:getLabel('filterName', 'Filter Name'),
		            	  dataIndex:'filterName',
		            	  width:250
		            },
		              { 
		            	  xtype:'actioncolumn',
						  width:60,
		            	 parent:this,
		            	  items:[{
		                      iconCls: 'linkbox seeklink',
		                      tooltip: getLabel('view', 'View'),
		                      handler: function(grid, rowIndex, colIndex) {
		            			 
									if(me.callerParent == 'depInqStdView'){
										me.fireEvent('viewFilterEvent',grid,rowIndex);
									}									
		                      }
		            	  },
						  {
		                      iconCls: 'grid-row-action-icon icon-edit',
		                      tooltip: getLabel('edit', 'Edit'),
		                      handler: function(grid, rowIndex, colIndex) {
									if(me.callerParent == 'depInqStdView'){
										me.fireEvent('editFilterEvent',grid,rowIndex);
									}
								}
		            	  }]
		            	  
		            	},

		              {
		                  xtype:'actioncolumn',
		                  width:70,
		                  header:getLabel('order', 'Order'),
		                  parent:this,
		                  items: [{
		                      iconCls: 'grid-row-up-icon',
		                      tooltip: getLabel('up', 'Up'),
		                      handler: function(grid, rowIndex, colIndex) {	
									if(me.callerParent == 'depInqStdView'){
										me.fireEvent('orderUpEvent',grid,rowIndex,-1);
									}									
		                      }
		                  },{
		                      iconCls: 'grid-row-down-icon',
		                      tooltip: getLabel('down', 'Down'),
		                      handler: function(grid, rowIndex, colIndex) {
		            				  
									if(me.callerParent == 'depInqStdView'){
										me.fireEvent('orderUpEvent',grid,rowIndex,1);
									}								
		                      }
		                  }]
		              }];
					  
		  Ext.Ajax.request({
					//url : 'services/userfilterslist/paymentStdViewFilter.json',
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
	}
	/*createStore : function()
	{
		var me = this;
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
		
		me.loadstoreData(myStore);
	},
	loadstoreData : function(myStore)
	{
		var me = this;
		Ext.Ajax.request({
					url : 'static/scripts/payments/paymentSummary/data/filterlst.json',
					method : 'GET',
					success : function(response) {
						var decodedJson = Ext.decode(response.responseText);
						me.store = myStore;
						me.store.loadRawData(decodedJson);
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
	}*/
	
	
	
});