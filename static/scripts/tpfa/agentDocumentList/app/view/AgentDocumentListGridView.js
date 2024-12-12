Ext.define('GCP.view.AgentDocumentListGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.AgentDocumentListActionBarView','GCP.view.AgentDocumentListFilterView','Ext.panel.Panel'],
	xtype : 'agentDocumentListGridView',
	width : '100%',
	componentCls : 'ux_panel-background  x-portlet',
	initComponent : function() {
		var me = this;
		var documentListActionBar = Ext.create('GCP.view.AgentDocumentListActionBarView', {
					itemId : 'documentListActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});	
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			title : getLabel('uploadSupportingDocument', 'Upload Supporting Document '),
			cls : 'xn-ribbon ux_panel-transparent-background ux_border-bottom',
			autoHeight : true,
			itemId : 'agentDocumentListDtlView',
			items : [
				{
					xtype : 'agentDocumentListFilterView',
					width : '100%',
					margin : '0 0 12 0'										
				},				
				{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
									cls : 'action_label ux_font-size14',
									padding : '5 0 0 10'
								}, documentListActionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});