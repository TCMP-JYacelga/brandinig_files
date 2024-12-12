Ext.define('GCP.view.EndClientDocumentGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.EndClientDocumentFilterView','Ext.panel.Panel'],
	xtype : 'endClientDocumentGridView',
	width : '100%',
	componentCls : 'x-portlet',
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : false,
			cls : 't7-grid',
			autoHeight : true,
			itemId : 'endClientDocumentListPanel',
			items : [
				
					Ext.create('Ext.panel.Panel', {
						cls: 'filter-view xn-ribbon',
						width: '100%',
						title : getLabel('docUpload','Document Upload'),
						items: [{
							xtype : 'endClientDocumentFilterView',
							width : '100%',
							collapsible : false
							}]
					})					
				,{
					xtype : 'panel',
					width : '100%',
					cls : 'gradiant_back ft-round-border',
					margin: '12 0 0 0',
					items: [{
						xtype: 'toolbar',
						cls: 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
						items: [{
							xtype : 'button',
							cls : 'action-button',
							itemId : 'btnDelete',
							disabled: true,
							margin : '0 0 5 12', 
							text : getLabel('deleteAction','Delete')
					}]},{
						xtype: 'panel',
						itemId: 'endClientDocumentListDtlView',
						bodyCls: 'single-border'
					}]
					
				}			
				]
		}];
		this.callParent(arguments);
	}

});