/**
 * @class GCP.view.AgreementFlexibleDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementFlexibleDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agreementFlexibleDtlViewType',
	requires :
	[
		'GCP.view.AgreementFlexibleDtlGridView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 300,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			
			{
				xtype : 'agreementFlexibleDtlGridViewType',
				width : '100%',
				margin : '3 0 10 0',
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
