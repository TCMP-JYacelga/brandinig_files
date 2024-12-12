Ext.define('GCP.view.HeaderOrderPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'headerOrderPopUp',
	requires : ['GCP.view.HeaderOrderGridView','Ext.button.Button'],
	modal : true,
	closeAction:'destroy',
	height : 320,
	storeData:null,
	caller : null,
	flagSetFrom : null,
	overflow : 'auto',
	width : 480,
	layout : 'fit',
	listeners:{
         'close':function(window){
        	 var callerParent=this.caller;
        	 if (callerParent === 'GridFilterView') {
        	 this.fireEvent('accSummGridAccSetPopupCloseEvent');
        	 } else if (callerParent === 'TxnFilterView') {
        		 this.fireEvent('accSummTxnAccSetPopupCloseEvent');
        	 }
			else {
					this.fireEvent('accSummLiqAccSetPopupCloseEvent');
				}
          }

 		},
	initComponent : function() {
		var me = this;
		var headerOrderPopUpGridView = null;

		var gridStore = me.getAccountSetStore();
		
		headerOrderPopUpGridView= Ext.create('Ext.panel.Panel', {
			width : 400,
			height : 300,
			tabStatus:null,
			itemId : 'headerOrderPanel',
			items : [{
		            		xtype:'headerOrderGridView',
		            		style : 'overflow:auto',
		            		store: gridStore,
		            		parent:this
		            }],
			bbar : ['->',{
						xtype : 'button',
						text : getLabel('cancel', 'Cancel'),
						cls : 'xn-button',
						handler : function()
						{
							me.close();
						}
					},{
						xtype : 'button',
						text : getLabel('save', 'Save'),
						clickedFrom : null,
						cls : 'xn-button',
						itemId : 'savebtn',
						margin : '6 0 0 0',
						parent:this
					}]
		});

		this.items = [headerOrderPopUpGridView];

		this.callParent(arguments);
	},
	 getAccountSetStore : function() {
					var me = this;
		          		var objStore = Ext.create('Ext.data.Store', {
		          			fields : ['profileId','typeCode','grid','header','type','identifier','beanName','sign','assignmentStatus','typeDescription','typecodeLevel','gridOrder','headerOrder','headerDefaultWidth','typeCodeLevelDescription','parentRecordKey','version','recordKeyNo','gridDefaultWidth'],
		          			data : me.storeData
		          		});
		          		return objStore;
		          	}

});
