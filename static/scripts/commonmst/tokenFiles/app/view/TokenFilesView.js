Ext.define('GCP.view.TokenFilesView', {
	extend : 'Ext.container.Container',
	xtype : 'tokenFilesView',
	requires : ['Ext.container.Container', 'GCP.view.TokenFilesTitleView',
			'GCP.view.TokenFilesFilterView', 'GCP.view.TokenFilesGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		var tokenImportToolBar = me.createTokenImportToolBar();
		me.items = [{
					xtype : 'tokenFilesTitleView',
					width : '100%'
				},tokenImportToolBar,{
					xtype : 'tokenFilesFilterView',
					width : '100%',
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'tokenFilesGridView',
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
						text : getLabel('importTokenFile','Import Token File'),
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