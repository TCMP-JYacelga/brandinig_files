/**
 * @class GCP.view.InputParameterView
 * @extends Ext.panel.Panel
 * @author Archana
 */
Ext.define( 'GCP.view.InputParameterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'inputParameterView',
	requires :
	[
		'GCP.view.InputParameterGridView'
	],
	//width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'button',
						itemId : 'addInputParamBtn',
						name : 'inputParam',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">'
							+ getLabel( 'addInputParam', 'Add Field' ) + '</span>',
						cls : 'xn-account-filter-btnmenu'
					}
				]
			},
			{
				xtype : 'inputParameterGridView',
				//width : '100%',
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
