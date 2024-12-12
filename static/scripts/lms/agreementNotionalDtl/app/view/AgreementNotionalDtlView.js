/**
 * @class GCP.view.AgreementNotionalDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementNotionalDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agreementNotionalDtlViewType',
	requires :
	[
	 	'GCP.view.AgreementNotionalDtlGridView'
	],
	width : '100%',
	cls: 'ux_panel-background',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'agreementNotionalDtlGridViewType',
				width : '100%',
				margin : '12 0 0 0',
				parent : me
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
