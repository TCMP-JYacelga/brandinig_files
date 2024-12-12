/** 
 * @class GCP.view.summary.SummaryInformationView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.SummaryInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'summaryInformationView',
	requires : ['Ext.panel.Panel', 'Ext.Img', 'Ext.button.Button',
			'GCP.view.summary.SummaryInformationTypeCodePopUpView'],
	width : '100%',
	componentCls : 'xn-ribbon-body ux_panel-transparent-background ux_extralargemargin-top gradiant_back',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var strUrl = 'services/userseek/btrpaymentcurrency.json?$top=-1';
		var upperPanel = me.createSummaryUpperPanelView();
		me.items = [{
			xtype : 'panel',
			itemId : 'accSummInfoHeaderBarStdView',
			bodyCls : 'xn-ribbon ux_panel-transparent-background largepadding_tb ux_largepaddinglr ux_font-size16-normal ux_line-height24 ',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'label',
						itemId : 'summInfoShowHideStdView',
						cls : 'cursor_pointer middleAlign icon_expand_summ ux_no-left',
						margin : '0 3',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											me.toggleView(c);
										}, c);
							},
							afterrender : function(c){
									me.setPrefView(c);		
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('summinformation',
								'Summary Information'),
						cls : 'x-custom-header-font'
					}, {
						xtype : 'label',
						text : '( ',
						cls : 'x-custom-header-font'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'currencyBtn',
						margin : '1 -4 0 -4',
						cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
						menu : Ext.create('Ext.menu.Menu', {
									maxHeight : 180,
									width : 50,
									cls : 'ext-dropdown-menu xn-menu-noicon',
									itemId : 'currencyMenu',
									items : []
								})
					}, {
						xtype : 'label',
						text : ' )',
						style : {
							left : '216px'
						},
						cls : 'x-custom-header-font'
					}]
		}, upperPanel];
		me.on('render', function(panel) {
			var enableEqvCcyflag = false; 
			if (typeof objClientParameters != 'undefined') 
			{
				if (!Ext.isEmpty(objClientParameters))
				{
					 enableEqvCcyflag=objClientParameters.enableEqvCcy; 
				}
				if(enableEqvCcyflag)
				{
					Ext.Ajax.request({
						url : strUrl,
						method : "GET",
						async : false,
						success : function(response) {
							if (response && response.responseText)
								me.populateCurrencyMenu(Ext
										.decode(response.responseText));
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});							
				}
				else
				{
					var ccyMenu = me.down('menu[itemId="currencyMenu"]');
					var ccyBtn = me.down('button[itemId="currencyBtn"]');
					ccyMenu.hide();
					if (ccyBtn)
						ccyBtn.removeCls('ux-custom-more-btn');
				}	
			}
		});
		me.on('afterrender', function(panel) {
					var ccyBtn = me.down('button[itemId="currencyBtn"]');
					if (ccyBtn)
						ccyBtn.setText(me.parent.equiCcy+'&nbsp;');
				});
		me.callParent(arguments);
	},
	createSummaryUpperPanelView : function() {
		var me = this;
		var summaryUpperPanel = Ext.create('Ext.panel.Panel', {
					padding : '2 0 0 10',
					hidden : infoRibbonCollapsed,
					cls : 'ux_border-top',
					itemId : 'infoSummaryReflectFilterLiq',
					items : [{
								xtype : 'label',
								text : getLabel('reflectsFilter',
										'(Reflects Filter)'),
								cls : 'smallfont grey ux_font-size14',
								flex : 0.6,
								padding : '0 0 0 0'
							}]
				});
		return summaryUpperPanel;
	},
	updateSummaryInfoView : function(jsonData, equiCcy) {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanelLiq"]');
		if (panel) {
			panel.removeAll(true);
			me.createTypeCodesList(panel, jsonData, equiCcy);
		} else {
			panel = Ext.create('Ext.panel.Panel', {
						cls : 'xn-pad-10',
						hidden : infoRibbonCollapsed,
						layout : 'hbox',
						autoDestroy : true,
						itemId : 'infoSummaryLowerPanelLiq'
					});
			me.createTypeCodesList(panel, jsonData, equiCcy);
			me.add(panel);
		}
		me.createSummaryTypeCodeSelectionPopUp(jsonData);
	},
	createTypeCodesList : function(summaryLowerPanel, jsonData, equiCcy) {
		var me = this;
		var flagPrefAdded = false;
		var strCcy = equiCcy, panel = null;
		for (var i = 0; i < jsonData.length; i++) {

			if (jsonData[i].preference) {
				if (jsonData[i].dataType === 'count')
					strCcy = '';
				else
					strCcy = equiCcy;
				panel = Ext.create('Ext.panel.Panel', {
							layout : 'vbox',
							//margin : '0 20 0 0',
							width: '21%',
							items : [{
								xtype : 'label',
								cls : 'ux_font-size14',
								overflowX : 'hidden',
								overflowY : 'hidden',
								width : '100%',
								text : jsonData[i].typeCodeDescription,
								padding : '0 0 5 0',
								tip : jsonData[i].typeCodeDescription,
								listeners : {
									render : function(c) {
										if (c.tip && c.tip.length >= 18)
											Ext.create('Ext.tip.ToolTip', {
														target : c.getEl(),
														html : c.tip
													});
									}
								}
							}, {
								xtype : 'label',
								cls : 'ux_font-size14-normal',
								text : strCcy + ' '
										+ jsonData[i].typeCodeAmount,
								padding : '0 0 5 0'
							}]
						});
				flagPrefAdded = true;
				summaryLowerPanel.add(panel);
			}
		}
		if (!flagPrefAdded && jsonData.length != 0) {
			for (var index = 0; index < 5; index++) {
				if (!Ext.isEmpty(jsonData[index])) {
					jsonData[index].preference = true;
					if (jsonData[index].dataType === 'count')
						strCcy = '';
					else
						strCcy = equiCcy;
					panel = Ext.create('Ext.panel.Panel', {
								layout : 'vbox',
								//margin : '0 20 0 0',
								width: '16.66%',
								items : [{
									xtype : 'label',
									overflowX : 'hidden',
									overflowY : 'hidden',
									width : '100%',
									cls : 'ux_font-size14',
									text : jsonData[index].typeCodeDescription,
									inputAttrTpl : Ext.String
											.format(
													" title='{0}' ",
													jsonData[index].typeCodeDescription),
									padding : '0 0 5 0',
									tip : jsonData[index].typeCodeDescription,
									listeners : {
									render : function(c) {
										if (c.tip && c.tip.length >= 18)
											Ext.create('Ext.tip.ToolTip', {
														target : c.getEl(),
														html : c.tip
													});
									}
								}
								}, {
									xtype : 'label',
									cls : 'ux_font-size14-normal',
									text : strCcy + ' '
											+ jsonData[index].typeCodeAmount,
									padding : '0 0 5 0'
								}]
							});
					summaryLowerPanel.add(panel);
				}
			}
		}
		var morebutton = Ext.create('Ext.button.Button', {
			border : 0,
			text : getLabel('moreText', 'more'),
			itemId : 'typeCodePopUp',
			cls : 'cursor_pointer xn-account-filter-btnmenu xn-small-button w7 button_underline ux_color',
			margin : '17 0 0 0',
			padding : '0 0 5 0',
			handler : function(btn) {
				if (me.typeCodePopUp)
					me.typeCodePopUp.show();
			}
		});
		summaryLowerPanel.add(morebutton);
	},
	populateCurrencyMenu : function(data) {
		var me = this;
		var ccyMenu = me.down('menu[itemId="currencyMenu"]');
		var ccyBtn = me.down('button[itemId="currencyBtn"]');
		var ccyArray = data.d.preferences || [];
		Ext.each(ccyArray, function(currency) {
					ccyMenu.add({
								text : currency.CODE,
								code : currency.CODE,
								btnDesc : currency.CODE,
								ccySymbol : currency.SYMBOL,
								cls : 'xn-account-filter-btnmenu',
								margin : '0 0 0 15',
								handler : function(btn, opts) {
									ccyBtn.setText(btn.code);
									me.parent.equiCcy = btn.code;
									me.parent.equiCcySymbol = btn.ccySymbol;
									me.fireEvent('equivalentCcyChange', btn.code, btn.ccySymbol);
								}
							});
				});
	},
	createSummaryTypeCodeSelectionPopUp : function(summaryData) {
		var me = this;
		var selectorField = null, store = null, arrSelectedValues = null;
		if (!me.typeCodePopUp) {
			me.typeCodePopUp = Ext.create(
					'GCP.view.summary.SummaryInformationTypeCodePopUpView', {
						itemId : 'typeCodeSelectionPopUp',
						parent : me,
						typecodeStoreData : summaryData
					});
		} else {
			selectorField = me.typeCodePopUp
					.down('itemselector[itemId="typeCodeSelector"]');
			store = selectorField ? selectorField.store : null;
			if (store) {
				arrSelectedValues = [];
				store.loadRawData(summaryData);
				store.each(function(record) {
							if (record.get('preference')) {
								arrSelectedValues.push(record.get('typeCode'));
							}
						});
				selectorField.setValue(arrSelectedValues);
			}
		}
	},

	toggleView : function(img) {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanelLiq"]');
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
	},
	setPrefView : function(img) {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanelLiq"]');
		var filterPanel = me
				.down('panel[itemId="infoSummaryReflectFilterLiq"]');

		if (infoRibbonCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
		}
	}

});