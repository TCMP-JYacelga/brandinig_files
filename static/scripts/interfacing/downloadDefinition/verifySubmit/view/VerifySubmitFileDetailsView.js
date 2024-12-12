Ext.define('GCP.view.VerifySubmitFileDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'verifySubmitFileDetailsView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label'],
	width : '100%',
	componentCls : 'ux_panel-background',
	padding : '12 0 0 0',
	data : null,
	cls : 'xn-ribbon ',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'verifySubmitFileDetailsBarView',
			cls : 'xn-ribbon ux_header-pad ux_panel-transparent-background',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'container',
						itemId : 'showHideFileDetailsView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3 0',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('fileDetails','File Details'),
						cls : 'x-custom-header-font',
						margin : '0 0 0 20'
					}]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function(jsonData) {
		var me=this;
		var infoArray = this.createSummaryInfoList(jsonData);
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					cls : 'ux_largepaddinglr ux_largepaddingtb ux_border-top ux_panel-transparent-background',
					layout : 'vbox',
					itemId : 'infoSummaryLowerPanel2',
					items : infoArray
				});
		me.add(summaryLowerPanel);
	},
	createSummaryInfoList : function(jsonData) {
		var infoArray = new Array();
		infoArray.push({
			xtype : 'panel',
			layout : 'hbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:250,
						cls : 'ux_font-size14-normal',
						text   : 'Band Name',
						style: 'font-weight:bold;text-decoration:underline'
					},{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:280,
						cls : 'ux_font-size14-normal',
						text   : 'Total Fields',
						style: 'font-weight:bold;text-decoration:underline'
					},{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:250,
						cls : 'ux_font-size14-normal',
						text   : 'Record Length',
						style: 'font-weight:bold;text-decoration:underline'
					}]
		});
		for (var i = 0; i < jsonData.length; i++) 
		{
			var bean = jsonData[i];
				infoArray.push({
					xtype : 'panel',
					layout : 'hbox',
					cls : 'ux_line-height24',
					items : [{
								xtype : 'label',
								overflowX : 'hidden',
								overflowY : 'hidden',
								width:250,
								cls : 'ux_font-size14-normal',
								text   : bean.bandName
							},
							{
								xtype : 'label',
								overflowX : 'hidden',
								overflowY : 'hidden',
								width:280,
								cls : 'ux_font-size14-normal',
								text   : bean.fieldCount
							},
							{
								xtype : 'label',
								overflowX : 'hidden',
								overflowY : 'hidden',
								width:250,
								cls : 'ux_font-size14-normal',
								text   : bean.recordLength
							}]
	
				});
			}
		/*if(formatId === 'FixedWidth' || formatId === 'Delimited' || formatId === 'XML')
		{
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				margin : '20 0 10 0',
				items : [{
					xtype : 'button',
					itemId : 'viewBtn',
					name : 'view',
					margin : '0 0 5 0',
					text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'viewFile', 'View Format File' )
						+ '</span>',
					cls : 'xn-account-filter-btnmenu'
					}]
			});
		}*/
		return infoArray;
	}

});