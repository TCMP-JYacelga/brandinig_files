Ext.define('GCP.view.UserTokenAssignmentView', {
	extend : 'Ext.container.Container',
	xtype : 'userTokenAssignmentView',
	requires : ['Ext.container.Container', 'GCP.view.UserTokenAssignmentTitleView',
			'GCP.view.UserTokenAssignmentFilterView', 'GCP.view.UserTokenAssignmentGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'userTokenAssignmentTitleView',
					width : '100%'
				},{
					xtype : 'userTokenAssignmentFilterView',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'userTokenAssignmentGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createTokenImportToolBar : function() {
		var me = this;
		var toolBar = Ext.create('Ext.toolbar.Toolbar', {
					itemId : 'tokenImportActionToolBar',
					padding : '0 0 12 0',
					cls : 'ux_toolbar ux-toolbar-background',
					items : [ {
						xtype : 'button',
						border : 0,
						text : getLabel('importtoken','Import Tokens'),
						cls : 'xn-btn ux-button-s',
						glyph : 'xf055@fontawesome',
						parent : this,
						padding : '4 0 2 0',
						itemId : 'btnImportToken'
					}]
				});
		return toolBar;
	}	
});