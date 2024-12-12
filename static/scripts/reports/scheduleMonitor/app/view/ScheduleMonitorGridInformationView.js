Ext.define('GCP.view.ScheduleMonitorGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'scheduleMonitorGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	//collapsible : true,
	collapseFirst : true,
	//cls : 'xn-panel ux_header-no-title-border',
	cls : 'xn-ribbon ux_panel-transparent-background ux_border-bottom',
	//collapsed : true,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		this.items = [

		{
			xtype : 'panel',
			itemId : 'scheduleMonitorSummInfoHeaderBarGridView',			
			cls : 'ux_border-bottom',
			width : '100%',
			padding : '10 0 8 10',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3 0 0 0',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											me.toggleView(c);
										}, c);
							}
						}
					}, 
					{
						xtype : 'label',
						itemId : 'gridInfoDateLabel',
						text : getLabel('summinformation','Summary Information'),
						cls : 'x-custom-header-font'
					}]
		},
		{

			xtype : 'panel',
			cls : 'ux_largepadding',
			itemId : 'schSummaryLowerPanel',
			layout : 'hbox',
			items :
			[
				{
					xtype : 'panel',
					flex : 0.8,
					layout :
					{
						type : 'vbox'
					},
					items :
					[
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							text : getLabel( '', 'Most Viewed' ),
							cls : 'f13 ux_font-size14',
							padding : '0 20 6 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							overflowX : 'hidden',
							overflowY : 'hidden',
							itemId : 'mostViewedReportItemId',
							margin : '0 20 0 0',
							text : ''
						}
						
						
					]
				},
				
				{
					xtype : 'panel',
					flex : 0.8,
					layout :
					{
						type : 'vbox'
					},
					items :
					[
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							text : getLabel( '', 'Least Viewed' ),
							cls : 'f13 ux_font-size14',
							margin : '0 0 6 0'
						}
						,
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							cls : 'ux_font-size14-normal',
							itemId : 'leastViewedReportItemId',
							text : ''
						}
					]
				}
				
				
			]
		}
];
		this.callParent(arguments);
	},
	toggleView : function(img) {
		var me = this;
		var panel = me.down('panel[itemId="schSummaryLowerPanel"]');
		var filterPanel = me
				.down('panel[itemId="infoSummaryReflectFilterLiq"]');

		if (img.hasCls("icon_collapse_summ")) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			if (!Ext.isEmpty(panel))
				panel.hide();

			if (!Ext.isEmpty(filterPanel))
				filterPanel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			if (!Ext.isEmpty(panel))
				panel.show();
			if (!Ext.isEmpty(filterPanel))
				filterPanel.show();
		}
	}
});