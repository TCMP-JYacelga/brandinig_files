/**
 * @class GCP.view.AgreementSweepDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementSweepDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepDtlViewType',
	requires :
	[
		'GCP.view.AgreementSweepDtlGridView'
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
				xtype : 'agreementSweepDtlGridViewType',
				width : '100%',
			//	margin : '3 0 10 0',
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
