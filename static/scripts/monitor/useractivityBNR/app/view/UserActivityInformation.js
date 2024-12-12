Ext.define( 'GCP.view.UserActivityInformation',
{
	extend : 'Ext.panel.Panel',
	xtype : 'userActivityInformation',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button'
	],
	width : '100%',
	margin : '5 0 0 0',
	data : null,
	componentCls : 'xn-ribbon ux_panel-transparent-background ',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function()
	{
		var me = this;
		this.items = 
		[
			{
				xtype : 'panel',
				itemId : 'userActivityInfoGridView',
				bodyCls : 'xn-ribbon-header ux_header-pad',
				width : '100%',
				cls : 'ux_border-bottom',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_expand_summ',
						margin : '3',
						listeners :
						{
							render : function(c)
							{
								c.getEl().on( 'click', function()
								{
									this.fireEvent( 'click', c );
								}, c );
							},
					afterrender : function(c){
						me.setPrefView(c);		
						}
						}
					},
					{
						xtype : 'label',
						text : getLabel( 'summinformation', 'Summary Information'),
						cls : 'x-custom-header-font',						
						padding : '4 0 0 0'
					}
				]
			}
		];
		this.callParent( arguments );
	},
	setPrefView : function(img) {
		var me = this;
		var infoPanel = me.down('panel[itemId="infoSummaryLowerPanel"]');
		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			if(!Ext.isEmpty(infoPanel))	
				infoPanel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			if(!Ext.isEmpty(infoPanel))
				infoPanel.show();
		}
	},
	createSummaryLowerPanelView : function( jsonData )
	{
		var me = this;
		var infoArray = this.createSummaryInfoList( jsonData );
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			padding : '5 0 0 9',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel',
			items : infoArray
		} );
		me.add( summaryLowerPanel );
	},

	createSummaryInfoList : function(jsonData) 
	{
		var infoArray = new Array();
		for (var i = 0; i < jsonData.length; i++) 
		{
			infoArray.push({
						xtype : 'panel',
						layout : 'vbox',
						flex : 0.8,
						margin : '0 20 0 0',
						items : [{
									xtype : 'label',
									overflowX : 'hidden',
									overflowY : 'hidden',
									width:100,
									height : 15,
									text : getLabel('lbltotalusers', 'Total Users' ),
									cls : 'ux_font-size14',
									padding : '0 0 5 0'
								}, {
									xtype : 'label',
									text : jsonData[i].totalUsers,
									cls : 'ux_font-size14-normal',
									padding : '5 0 0 0'								
								}]

					});
			
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				flex : 0.8,
				margin : '0 20 0 0',
				items : [{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							width:100,
							height : 15,
							text : getLabel('lblusersonline', 'Users Online' ),
							cls : 'ux_font-size14',
							padding : '0 0 5 0'
						}, {
							xtype : 'label',
							text : (jsonData[i].usersOnline != '' ? jsonData[i].usersOnline : '0'),
							cls : 'ux_font-size14-normal',
							padding : '5 0 0 0'								
						}]

			});
			
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				flex : 1,
				margin : '0 20 0 0',
				items : [{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							width:100,
							height : 15,
							text : getLabel('lblusersdisabled', 'Users Disabled' ),
							cls : 'ux_font-size14',
							padding : '0 0 5 0'
						}, {
							xtype : 'label',
							text : (jsonData[i].usersDisabled != '' ? jsonData[i].usersDisabled : '0'),
							cls : 'ux_font-size14-normal',
							padding : '5 0 0 0'								
						}]

			});
			
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				flex : 0.8
				});
		}
		return infoArray;
	}
} );
