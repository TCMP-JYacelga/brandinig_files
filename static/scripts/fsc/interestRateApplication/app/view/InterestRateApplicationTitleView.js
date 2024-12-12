/**
 * @class ProcessFinanceRequestTitleView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.InterestRateApplicationTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interestRateApplicationTitleView',
	requires : ['Ext.button.Button', 'Ext.toolbar.Toolbar', 'Ext.menu.Menu'],
	width : '100%',
	cls : 'ux_no-border ux_largepaddingtb ux_panel-background',
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
					text : getLabel('interestRateAppl', 'Interest Rate Application'),
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					flex : 1,
					cls: 'ux_panel-background',
					items : ['->', {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								cls : 'ux_hide-image'
							}, {
								cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
								flex : 0
							}]
				}

		];

		this.callParent(arguments);
	}

});