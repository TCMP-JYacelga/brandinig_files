/**
 * @class GCP.view.PassThruFileACHView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.PassThruFileACHView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'passThruFileACHViewType',
	requires :
	[
		'GCP.view.PassThruGroupView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;		
		me.items =
		[
			{
				xtype : 'passThruGroupView',
				width : 'auto',
				margin : '0 0 12 0'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
