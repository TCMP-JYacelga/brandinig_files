Ext.define('GCP.view.CopyByAccountPopupView', {
	extend : 'Ext.window.Window',
	modal:true,
	xtype:'copyByClientPopupView',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.data.Store'],
	title : getLabel('copiedby', 'Copied By'),
	height :300,
	width : 400,
	layout : {
		type:'vbox',
		align:'stretch'
			},
	
	initComponent:function(){
		var me = this;
		
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			xtype:'clientListView',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding:'5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 150,
			columnModel : [  {
				colHeader: getLabel('clientname', 'Company Name'),
                colId: 'name',
                width: 330
			}],
			
			storeModel : {
				
				 fields: ['name'],
	      
				proxyUrl: 'cpon/copybyseek/copybyClientSeek.json',
				rootNode: 'd.filter',
				totalRowsNode : 'd.count'
			}
		});
		
		
		
		me.items=[
		            	clientListView
		            ];
		            
		me.buttons = [{
					xtype : 'button',
					text : getLabel('cancel', 'Cancel'),
					cls : 'xn-button',
					handler : function() {
						me.close();
					}
					}];
		
		this.callParent(arguments);
	}
	
});
