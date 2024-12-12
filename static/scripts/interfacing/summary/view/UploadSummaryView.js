Ext.define('GCP.view.UploadSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'uploadSummaryView',
	requires : ['GCP.view.UploadSummaryGridView','GCP.view.UploadSummaryFilterView','GCP.view.UploadSummaryInfoView',
	            'GCP.view.UploadSummaryTitleView','Ext.tab.Panel','Ext.tab.Tab'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'uploadSummaryTitleView',
					width : '100%',
					margin : '0 0 1 0'
					},{
						xtype : 'panel',
						layout :
						{
							type : 'hbox'
						},
						items :[{
								xtype : 'label',
								margin : '7 0 3 0',
								text : getLabel( 'createNew', 'Create : ' )
							},{
								xtype : 'button',
								itemId : 'uploadDefId',
								name : 'alert',
								margin : '7 0 5 0',
								text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'uploadDefinition', 'Import Definition' )
									+ '</span>',
								cls : 'xn-account-filter-btnmenu'

							}]
					},{
						xtype : 'uploadSummaryFilterView',
						width : '100%',
						margin : '0 0 10 0',
						title : getLabel('filterBy', 'Filter By: ')+'<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
	
					},{
						xtype : 'uploadSummaryInfoView',
						margin : '5 0 5 0'
					},{
						xtype : 'uploadSummaryGridView',
						width : '100%',
						margin : '3 0 10 0',
						parent : me
				 }];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});