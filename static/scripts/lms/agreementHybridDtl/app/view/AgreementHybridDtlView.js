/**
 * @class GCP.view.AgreementHybridDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementHybridDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agreementHybridDtlViewType',
	requires :
	[
		'GCP.view.AgreementHybridDtlGridView'
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
				xtype : 'agreementHybridDtlGridViewType',
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
