Ext.define( 'GCP.view.AgentSetupDesignatedPersonEntryDetailGridView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agentSetupDesignatedPersonEntryDetailGridViewType',
	requires :
	[
		'Ext.ux.gcp.SmartGrid','Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox'
	],
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
{
	xtype : 'panel',
	collapsible : true,
	width : '100%',
	cls : 'xn-ribbon',				
	title : getLabel( 'lblDesignatedPersonSummary', 'Designated Person(s) Summary' ),
	itemId : 'designatedPersonDtlViewItemId',	
	items :
	[
		{
			xtype : 'container',
			cls : 'ux_panel-transparent-background ux_border-top',
			layout : 'hbox',
			items :
			[
			
				{
					xtype : 'label',
					text : '',
					flex : 1
				}
			]

		}
	]
}
		 ];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
