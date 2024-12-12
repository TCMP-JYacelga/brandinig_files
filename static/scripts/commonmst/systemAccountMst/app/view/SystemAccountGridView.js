Ext.define('GCP.view.SystemAccountGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel','GCP.view.SystemAccountGroupActionView'],
	xtype : 'systemAccountGridView',
	width : '100%',
	cls : 'xn-ribbon ux_panel-transparent-background',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create( 'GCP.view.SystemAccountGroupActionView',
		{
			itemId : 'groupActionBarItemId',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				collapsible : true,
				autoHeight : true,
				width : '100%',
				cls : 'xn-ribbon ux_panel-transparent-background',
				bodyCls : 'x-portlet ux_no-padding',
				title : getLabel( 'lbl.accounts', 'Accounts' ),
				itemId : 'systemAccountDetailView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14',
								padding : '5 0 0 10'
							}, actionBar,
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
		this.callParent( arguments );
	}
});