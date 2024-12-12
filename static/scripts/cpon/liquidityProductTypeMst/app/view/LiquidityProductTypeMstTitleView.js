Ext.define('GCP.view.LiquidityProductTypeMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'liquidityProductTypeMstTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls: 'ux_panel-background ux_largepaddingtb',
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
					text : !Ext.isEmpty(modelSelectedMst)
							&& "N" === modelSelectedMst
							? getLabel('lmsPoolingGridsummary',
									'Pooling Product Types Summary')
							: getLabel('lmsSweepingGridSummary',
									'Sweeping Product Types Summary'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});