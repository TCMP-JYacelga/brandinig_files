Ext.define( 'GCP.view.MigrationSummaryTitleView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'migrationSummaryTitleView',
	requires :
	[
		'Ext.form.Label', 'Ext.Img', 'Ext.button.Button'
	],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults :
	{
		style :
		{
			padding : '0 0 0 4px'
		}
	},
	layout :
	{
		type : 'hbox'
	},
	initComponent : function()
	{
		this.items =
		[
			{
				xtype : 'label',
				text : getLabel( 'MigrationSummary', 'Migration Summary Page' ),
				cls : 'page-heading'
			},
			{
				xtype : 'label',
				flex : 19
			}

		];
		this.callParent( arguments );
	}

} );
