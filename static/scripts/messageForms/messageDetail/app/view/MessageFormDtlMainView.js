/**
 * @class GCP.view.MessageFormMstMainView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.MessageFormDtlMainView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'messageFormDtlMainViewType',
	requires :
	[
		'GCP.view.MessageFormDtlGridView'
	],
	config :
	{
		globalGridRef : null
	},
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'messageFormDtlGridViewType',
				//width : '100%',
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
