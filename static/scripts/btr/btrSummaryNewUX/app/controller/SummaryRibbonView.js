/** 
 * @class GCP.view.common.SummaryRibbonView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.common.SummaryRibbonView', {
	extend : 'Ext.panel.Panel',
	xtype : 'summaryRibbonView',
	requires : ['Ext.panel.Panel', 'Ext.Img', 'Ext.button.Button',
			'GCP.view.common.SummaryRibbonTypeCodePopUpView'],
	width : '100%',
	componentCls : 'xn-ribbon-body ux_panel-transparent-background ux_extralargemargin-top',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	accounMenuLabel : null,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/balancesummary/btruseraccounts.json';
		var upperPanel = me.createSummaryUpperPanelView();
		me.items = [{
			xtype : 'panel',
			itemId : 'accSummInfoHeaderBarStdView',
			bodyCls : 'xn-ribbon ux_panel-transparent-background largepadding_tb ux_largepaddinglr ux_font-size16-normal ux_line-height24',
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
						itemId : 'accountBtn',
						margin : '1 -4 0 -4',
						cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
						menu : Ext.create('Ext.menu.Menu', {
									maxHeight : 180,
									cls : 'ext-dropdown-menu xn-menu-noicon',
									itemId : 'accountMenu',
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
					Ext.Ajax.request({
								url : strUrl,
								method : "GET",
								async : false,
								success : function(response) {
									if (response && response.responseText)
										me.populateAccountsMenu(Ext
												.decode(response.responseText));
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
		me.on('afterrender', function(panel) {
					var accBtn = me.down('button[itemId="accountBtn"]');
					if (accBtn)
						accBtn.setText(me.accounMenuLabel);
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
				if (jsonData[i].dataType === 'count' || jsonData[i].dataType === 'DATE')
					strCcy = '';
				else
					strCcy = equiCcy;
				panel = Ext.create('Ext.panel.Panel', {
							layout : 'vbox',
							margin : '0 20 0 0',
							items : [{
								xtype : 'label',
								cls : 'ux_font-size14',
								overflowX : 'hidden',
								overflowY : 'hidden',
								width : 120,
								text : Ext.util.Format.ellipsis(
										jsonData[i].typeCodeDescription, 18),
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
										+ jsonData[i].typeCodeAmount || '0.00',
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
					if (jsonData[index].dataType === 'count' || jsonData[index].dataType === 'DATE')
						strCcy = '';
					else
						strCcy = equiCcy;
					panel = Ext.create('Ext.panel.Panel', {
								layout : 'vbox',
								margin : '0 20 0 0',
								items : [{
									xtype : 'label',
									overflowX : 'hidden',
									overflowY : 'hidden',
									width : 120,
									cls : 'ux_font-size14',
									text : Ext.util.Format
											.ellipsis(
													jsonData[index].typeCodeDescription,
													18),
									inputAttrTpl : Ext.String
											.format(
													" title='{0}' ",
													jsonData[index].typeCodeDescription),
									padding : '0 0 5 0'
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
	populateAccountsMenu : function(data) {
		var me = this;
		var accMenu = me.down('menu[itemId="accountMenu"]');
		var accBtn = me.down('button[itemId="accountBtn"]');
		var accArray = data.d.btruseraccount || [];
		var strLabel = null;
		Ext.each(accArray, function(item) {
					strLabel = "" + item.accountNumber + " , "
							+ item.accountName;
					if (me.parent.accountFilter === item.accountId) {
						me.accounMenuLabel = strLabel;
					}
					accMenu.add({
								text : strLabel,
								codeVal : item.accountId,
								accNumber : item.accountNumber,
								accName : item.accountName,
								accCurrency : item.accountCcy,
								accCurrencySymbol : item.accountCcySymbol,
								accountCalDate : item.accountCalDate,
								cls : 'xn-account-filter-btnmenu',
								margin : '0 0 0 15',
								handler : function(btn, opts) {
									accBtn.setText("" + btn.accNumber + " , "
											+ btn.accName);
									me.parent.accountFilter = btn.codeVal;
									me.fireEvent('accountChange', btn);
								}
							});
				});
	},
	createSummaryTypeCodeSelectionPopUp : function(summaryData) {
		var me = this;
		var selectorField = null, store = null, arrSelectedValues = null;
		if (!me.typeCodePopUp) {
			me.typeCodePopUp = Ext.create(
					'GCP.view.common.SummaryRibbonTypeCodePopUpView', {
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