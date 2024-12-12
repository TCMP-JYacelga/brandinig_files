Ext.define('GCP.view.eventLog.EventLogAdvFilterGridView', {
	extend:'Ext.grid.Panel',
	xtype : 'eventLogAdvFilterGridView',
	width : 550,
	height : 540,
	autoScroll : true,
	overflowY :'hidden',
	callerParent : null,
	cls:'xn-grid-cell-inner',
	
	initComponent:function(){
	
		this.callParent(arguments);
	}
});