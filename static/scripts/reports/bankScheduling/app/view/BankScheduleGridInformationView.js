Ext.define('GCP.view.BankScheduleGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	margin : '5 0 0 0',
	componentCls : 'xn-ribbon-body',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [

		{
			xtype : 'panel',
			itemId : 'bankScheduleSummInfoHeaderBarGridView',			
			bodyCls : 'xn-ribbon-header',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);											
										}, c);
							}
						}
					}, 
					{
						xtype : 'label',
						itemId : 'gridInfoDateLabel',
						text : getLabel('summinformation','Summary Information'),
						cls : 'x-custom-header-font',
						padding : '4 0 0 2'
					}]
		},
		{

			xtype : 'panel',
			padding : '5 0 0 9',
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
							height : 15,
							text : getLabel( '', 'Most Viewed' ),
							padding : '0 20 10 0'
						},
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							height : 15,
							itemId : 'mostViewedReportItemId',
							padding : '0 20 10 0',
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
							height : 15,
							text : getLabel( '', 'Least Viewed' ),
							padding : '0 0 10 0'
						}
						,
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							height : 15,
							itemId : 'leastViewedReportItemId',
							padding : '0 0 10 0',
							text : ''
						}
					]
				}
				
				
			]
		}
];
		this.callParent(arguments);
	}
});