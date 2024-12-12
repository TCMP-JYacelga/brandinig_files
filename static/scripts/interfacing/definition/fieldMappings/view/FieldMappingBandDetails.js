Ext.define( 'GCP.view.FieldMappingBandDetails',
{
	extend : 'Ext.panel.Panel',
	xtype : 'fieldMappingBandDetails',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button'
	],
	width : '100%',
	data : null,
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',					
				defaults : {
					style : {
						padding : '0 0 0 0'
					}
				}
			}
		];
		this.callParent( arguments );
	},

	createBandListPanelView : function(jsonData)
	{
		var me = this;
		var infoArray = this.createBandListPanelList(jsonData);
		var lowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'fieldBandListPanel',
			cls : 'ux_largepadding',
			items : infoArray
		} );
		me.add(lowerPanel);
	},

	createBandListPanelList : function(jsonData) 
	{
		var me = this;
		var infoArray = new Array();
		
		infoArray.push(
		{
			xtype : 'label',
			text : getLabel('lbl.selectBand', 'Select Band : '),
			cls : 'x-component ux_font-size14-normal black'
		});
		
		for (var i = 0; i < jsonData.length; i++) 
		{
			infoArray.push({
						xtype : 'button',
						itemId : jsonData[i].bandName,
						name: jsonData[i].bandName,
						text : '<span class="button_underline ux_font-size14-normal bottomAlign"><u>' + jsonData[i].bandName + '</u></span>',
						cls : i==0 ? 'xn-custom-heighlight xn-account-filter-btnmenu': 'xn-account-filter-btnmenu',
						handler : function() 
						{
							me.fireEvent('openBandDetailGrid', this);						
						}
					});
			
		}
		return infoArray;
	}
} );
