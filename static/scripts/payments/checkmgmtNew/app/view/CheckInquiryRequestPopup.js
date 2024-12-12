Ext.define('GCP.view.CheckInquiryRequestPopup', {
	extend : 'Ext.window.Window',
	xtype : 'checkInquiryRequestPopup',
	requires : ['GCP.view.CheckInquiryRequestEntry'],
	width : 500,
	height : 360,
	draggable : true,
	modal : true,		
	initComponent : function() {
		var me = this;
		var chkInqRequestCreate = null;
		this.title = getLabel('lblcreatechkinquiry', 'New Check Inquiry');
		chkInqRequestCreate = Ext.create('Ext.panel.Panel', {
			items : [{
						xtype : 'checkInquiryRequestEntry'						
					}]											
		});	
		me.items = [chkInqRequestCreate];		
		this.callParent(arguments);
	}
});