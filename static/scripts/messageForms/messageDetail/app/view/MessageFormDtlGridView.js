Ext.define( 'GCP.view.MessageFormDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'messageFormDtlGridViewType',
	componentCls : 'gradiant_back',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		this.items = [
		              {
				xtype : 'panel',
				collapsible : true,
				collapsed :expandGrid == 'N' ? true : false,
				width : '100%',
				cls : 'xn-ribbon ux_border-bottom',
				title : getLabel( 'lbl.messageForm.FormFields', 'Form Fields' ),
				itemId : 'gridViewDetailPanelItemId'
			}];
		this.callParent( arguments );
	}
} );
