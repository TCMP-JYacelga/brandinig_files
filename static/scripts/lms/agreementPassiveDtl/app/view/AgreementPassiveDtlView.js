/**
 * @class GCP.view.AgreementPassiveDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.AgreementPassiveDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agreementPassiveDtlViewType',
	requires :
	[
		'GCP.view.AgreementPassiveDtlGridView'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 300,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			
			{
				xtype : 'agreementPassiveDtlGridViewType',
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
