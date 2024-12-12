Ext.define('GCP.view.AgreementSweepQueryResultTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepQueryResultTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					//text : getLabel('screen.title.executionQueryResult','Sweep Query Result'),
					text : getLabel('movementSummary', 'Movement Summary'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 15
				} /*{
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					height : 14,
					margin : '2 2 0 0'
				}, {
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 0 0 2',
					cls : 'cursor_pointer xn-account-filter-btnmenu ',
					border : 0,
					text : getLabel('report', 'Report')
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					padding : '0 4 0 0'
				}, {
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf',
					flex : 0,
					padding : '20 12 0 0'
				}, {
					xtype : 'button',
					border : 0,
					padding : '0 3',
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu w3',
					menu : Ext.create('Ext.menu.Menu', {

					})
				}*/

		];
		this.callParent(arguments);
	}

});