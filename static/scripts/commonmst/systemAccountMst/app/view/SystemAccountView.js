Ext.define('GCP.view.SystemAccountView', {
	extend : 'Ext.container.Container',
	xtype : 'systemAccountView',
	requires : [],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'systemAccountTitleView',
					width : '100%'
				},{
					xtype : 'systemAccountFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'panel',
					margin : '12 0 12 0',
					layout :
					{
						type : 'hbox'
					},
					items :
					[
					 {
							xtype : 'toolbar',
							cls : 'ux_panel-background',					
							flex : 1,
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'createNewItemId',							
								cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
								parent : this,
								glyph : 'xf055@fontawesome',
								text :getLabel( 'refresh', 'Refresh' )
							}]
					 }
					]
				},
					{
					xtype : 'systemAccountGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});