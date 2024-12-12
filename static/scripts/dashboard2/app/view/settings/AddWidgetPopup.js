Ext.define('Cashweb.view.settings.AddWidgetPopup', {
	extend : 'Ext.window.Window',
	xtype : 'addWidgetPopup',
	requires : ['Ext.grid.Panel', 'Cashweb.store.WidgetStore',
			'Cashweb.store.AvailableWidgetStore'],
	width : 735,
	maxHeight : 550,
	modal : true,
	layout : 'vbox',
	//cls : 'ux_window-position',
	cls : 'xn-popup',
	draggable : false,
	resizable : false,
	// autoScroll : true,
	title : getLabel('lbl.widget.add','Add Widgets'),
	buttonAlign : 'right',
	isBannerAdded : false,
	isBanner1Added : false,
	isBanner2Added : false,
	/*style : {
		'top' : '48px !important'
	},*/
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function() {
		var me = this;
		me.on('show', function() {
					me.down('panel[itemId="msgDisplayPanel"]').hide();
					me.down('panel[itemId="msgDisplayPanel"]').removeAll();
					me.fireAjaxRequest();
				});
		var widgetHeaderPanel = Ext.create('Ext.panel.Panel', {
			layout : 'vbox',
			cls : 'widget-popup-header',
			padding : '0 0 15 5',
			width : '100%',
			items : [{
						xtype : 'panel',
						itemId : 'msgDisplayPanel',
						layout : 'vbox',
						margin : '0 0 10 0',
						style : {
							padding : '0px !important'	
						},
						cls : 'ux_panel-background',
						maxHeight : 48,
						hidden : true,
						overflowY : 'auto',
						width : '100%',
						defaults : {
							xtype : 'label',
							cls : 'wgt-confirm-text',
							width : '100%'
						}
					}, {
						xtype : 'panel',
						itemId : 'widgetHeaderPanel',
						layout : {
							type:'hbox',
							pack:'end'
						},
						width : '100%',
						items : [ {
									xtype : 'AutoCompleter',
									fieldLabel : '',
									//columnWidth: 0.35,
									emptyText : getLabel(
											'autoCompleterEmptyText',
											'Search available widgets'),
									fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
									itemId : 'widgetSearchBox',
									cls : 'autoCmplete-field',
									labelSeparator : '',
									//width : 165,
									//margin : (screen.width) > 1024 ? '0 0 0 368' : '0 0 0 372',
									cfgUrl : 'services/getClientWidgets.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'widgets',
									cfgRootNode : 'clientwidgets',
									cfgDataNode1 : 'widgetDesc',
									cfgKeyNode : 'widgetCode',
									cfgStoreFields : ['widgetType',
											'widgetDesc', 'widgetCode'],
									cfgProxyMethodType : 'POST',
									cfgExtraParams : [{
												key : '$isBannerAdded',
												value : (me.isBannerAdded)
														? "Y"
														: "N"
											}],
									listeners : {
										change : function(combo, newValue,
												oldValue) {
											if (null === newValue) {
												me.fireAjaxRequest();
											}
										},
										select : function(combo, record, index) {
											var wgtList = [];
											wgtList.push(record[0].raw);
											me.loadWidgetList(wgtList);
										}
									}
								}]
					}]
		});

		var widgetListView = Ext.create('Ext.panel.Panel', {
			itemId : 'widgetCategoryPanel',
			layout : 'hbox',
			width : '100%',
			padding: '15 0 0 0',
			items : [{
						xtype : 'panel',
						itemId : 'widgetListPanel',
						cls : 'panel-seperator',
						width : '25%',
						layout : 'vbox',
						items : [{}]
					}, {
						xtype : 'panel',
						width : '75%',
						maxHeight : 396,
						minHeight: 124,
						overflowY : 'auto',
						itemId : 'widgetSelectionPanel',
						layout : {
							type : 'vbox'
						},
						defaults : {
							xtype : 'panel',
							margin : '0 0 0 5',
							padding : '0 0 0 5',
							buttonAlign : 'right',
							layout : 'anchor',
							cls : 'ux_panel-background ux_no-padding widget-seperator',
							height : 124,
							width : 500,
							dockedItems : [{
							        xtype: 'container',
							        dock: 'right',
							        padding : '40 0 0 0',
							        layout:{
										        type:'vbox',
										        align:'center'
										    }, 
							        items :[{
												xtype : 'button',
												text : getLabel('ADDDASHBOARD','Add to Dashboard'),
												cls : 'ft-button-primary',
												handler : function(grid, rowIndex, colIndex) {
													var msgTimeout, thisPanel = this;
													var myMask = new Ext.LoadMask(me, {
																msg : getLabel('ADDINGMSG','Adding Widget...')
															});
													if(_IsEmulationMode == true)
													{
														Ext.MessageBox.show(
																{
																	title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
																	msg : getLabel( 'emulationError', 'You are in emulation mode cannot perform save or update.' ),
																	buttons : Ext.MessageBox.OK,
																	cls : 'ux_popup',
																	icon : Ext.MessageBox.ERROR
																} );
													}
													else
													{
													myMask.show();
				
													setTimeout(function() {
														myMask.hide();
														var wgtPanel = me.down('panel[itemId="widgetSelectionPanel"]');
														Ext.destroy(myMask);
														var messagePanel = me
																.down('panel[itemId="msgDisplayPanel"]');

														if(!Ext.isEmpty(thisPanel.up('panel')) ){
															var addedRecord = thisPanel.up('panel').record;
															var widgetCode = addedRecord.widgetCode;
															var confMessageText = label_map[widgetCode
																	.toLowerCase()]
																	+" "+ getLabel('SUCCESSMSG','widget added to dashboard succesfully');
															messagePanel.insert(0, {
																		text : confMessageText
																	});
														}
														messagePanel.doLayout();	
														if (messagePanel.isHidden())
															messagePanel.show();
														messagePanel.scrollBy(0, -39, true);
														if(messagePanel.items.items.length == 1)
															wgtPanel.setHeight(wgtPanel.getHeight()-58);
													}, 1000);
													me.fireEvent("addWidget",
															this.up('panel').record);
				
													if (this.up('panel').record.widgetType === 'BANNER') {
														me.isBannerAdded = true;
														me.down('AutoCompleter[itemId="widgetSearchBox"]').cfgExtraParams = [
																{
																	key : '$isBannerAdded',
																	value : (me.isBannerAdded)
																			? "Y"
																			: "N"
																}], me.fireAjaxRequest();
													}

													if (this.up('panel').record.widgetCode === 'HALFBANNER1') {
														me.isBanner1Added = true;
														 me.fireAjaxRequest();
													}	
													if (this.up('panel').record.widgetCode === 'HALFBANNER2') {
														me.isBanner2Added = true;	
														me.fireAjaxRequest();
													}	
												}
												}
											}]
							 }]		
						},
						items : [{}]

					}]
		});
		me.items = [widgetHeaderPanel, widgetListView];
		me.callParent(arguments);
	},
	fireAjaxRequest : function() {
		var me = this;
		var strUrl = 'services/getClientWidgets.json';
		Ext.Ajax.request({
					url : strUrl,
					method : "POST",
					success : function(response) {
						var data = Ext.decode(response.responseText);
						me.loadWidgetList(data.clientwidgets);
					},
					failure : function(response) {
						// console.log('Error Occured');
					}
				});
	},
	loadWidgetList : function(data) {
		var me = this;
		var categoryPanel = me.down('panel[itemId=widgetListPanel]');
		var widgetSelectionPanel = me
				.down('panel[itemId=widgetSelectionPanel]');
		if (!Ext.isEmpty(categoryPanel)) {
			if (categoryPanel.items.length > 0) {
				categoryPanel.removeAll();
			}
		}
		if (!Ext.isEmpty(widgetSelectionPanel)) {
			if (widgetSelectionPanel.items.length > 0) {
				widgetSelectionPanel.removeAll();
			}
		}
		if (!Ext.isEmpty(data)) {
			var wgtList = data;
			arrItem = new Array();
			var checkedFlg = false;
			var disableFlg = false;
			var selectedPaymentType = null;
			var charLimitReached = 'N';
			var truncatedCheckboxLabel = '';
			var tooltipLabel = '';
			var checkboxLabel = '';
			var strCls = '';
			var checkboxArray = [];
			var categoryArray = []
			var widgetListArray = [];
			var slectedCls = 'selected-cb-background ux_margin2';
			var deSelectedCls = 'ux_margin2 ux_unselected';
			for (var i = 0; i < wgtList.length; i++) {
				if (categoryArray.indexOf(wgtList[i].widgetCategory) === -1) {
					categoryArray.push(wgtList[i].widgetCategory);
					checkboxLabel =getLabel(wgtList[i].widgetCode+"_CAT",wgtList[i].widgetCategory);
					if (!Ext.isEmpty(checkboxLabel)) {
						if (checkboxLabel.length > 21) {
							truncatedCheckboxLabel = Ext.util.Format.ellipsis(
									checkboxLabel, 21);
							charLimitReached = 'Y';
							tooltipLabel = checkboxLabel;
						} else {
							truncatedCheckboxLabel = checkboxLabel;
							charLimitReached = 'N';
						}
					}
					if (i === 0 && data.length > 1) {
						checkboxArray.push({
									code : 'All',
									boxLabel : getLabel("ALLWIDGETCAT","ALL"),
									checked : true,
									cls : slectedCls,
									readOnly : true,
									width : 165,
									handler : function(btn, opts) {
										click : me.deselectWidgetTypeCheckbox(
												this, this.checked, this.code,
												wgtList);
									},
									listeners : {
										render : function(c) {
										}
									}
								});
					}
					checkboxArray.push({
								code : wgtList[i].widgetCategory,
								boxLabel : truncatedCheckboxLabel,
								checked : false,
								cls : (i === 0 && data.length === 1)
										? slectedCls
										: deSelectedCls,
								readOnly : false,
								width : 165,
								handler : function(btn, opts) {
									click : me.deselectWidgetTypeCheckbox(this,
											this.checked, this.code, wgtList);
								},
								listeners : {
									render : function(c) {
									}
								}
							});
				}
			}
			for (var i = 0; i < wgtList.length; i++) {
				var truncatedCheckboxLabel = '';
				if ((wgtList[i].widgetType === 'BANNER' && this.isBannerAdded)||
						(wgtList[i].widgetCode=== 'HALFBANNER1' && this.isBanner1Added)||
							(wgtList[i].widgetCode=== 'HALFBANNER2' && this.isBanner2Added))
					continue;
				if (!Ext.isEmpty(wgtList[i].widgetInfo)) {
					var checkboxLabel = wgtList[i].widgetCategory;
					if (checkboxLabel.length > 2) {
						truncatedCheckboxLabel = Ext.util.Format.ellipsis(
								getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo), 160);
						tooltipLabel = getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo);
					} else {
						truncatedCheckboxLabel = getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo);
					}
				}
				widgetListArray.push({
					record : wgtList[i],
					items : [{
								xtype : 'label',
								//margin : '5 0 5 5',
								width : '100%',
								cls : 'ux_font-size16',
								text : getLabel(wgtList[i].widgetCode,wgtList[i].widgetDesc)
							}, {
								xtype : 'panel',
								readOnly : true,
								width : '100%',
								layout : 'hbox',
								items : [{
											xtype : 'image',
											height : 70,
											width : '20%',
											margin : '5 0 0 5',
											src : wgtList[i].widgetThumb
										}, {
											xtype : 'textarea',
											readOnly : true,
											width : '75%',
											fieldCls : 'ux_panel-background ux_no-border ux_font-size14-normal',
											value : truncatedCheckboxLabel
										}]
							}]
				});
			}
			widgetSelectionPanel.add(widgetListArray);
			categoryPanel.add([{
						xtype : 'checkboxgroup',
						columns : 1,
						width : '100%',
						items : checkboxArray
					}]);

		}
		if(wgtList.length > 1){
			widgetSelectionPanel.setHeight(520);
		}
		else
		{
			widgetSelectionPanel.setHeight(150);
		}
	},
	deselectWidgetTypeCheckbox : function(cb, checked, code, wgtList) {
		var me = this;
		if (checked) {
			var widgetListArray = [];
			var widgetSelectionPanel = me
					.down('panel[itemId=widgetSelectionPanel]');
			if (!Ext.isEmpty(widgetSelectionPanel)) {
				if (widgetSelectionPanel.items.length > 0) {
					widgetSelectionPanel.removeAll();
				}
			}
			cb.removeCls('ux_unselected');
			cb.addCls('selected-cb-background');
			cb.addCls('.ux_unselected');
			cb.setReadOnly(true);
			var group = cb.findParentByType('checkboxgroup');
			if (group) {
				group.items.each(function(it) {
							if (it.getName() != cb.getName()) {
								it.setValue(0);
								it.removeCls('selected-cb-background');
								it.addCls('ux_unselected');
								it.setReadOnly(false);
							}
						});
			}
			for (var i = 0; i < wgtList.length; i++) {
				if ((wgtList[i].widgetType === 'BANNER' && this.isBannerAdded)||
						(wgtList[i].widgetCode === 'HALFBANNER1' && this.isBanner1Added)||
							(wgtList[i].widgetCode === 'HALFBANNER2' && this.isBanner2Added))
					continue;
				if (code === 'All' || wgtList[i].widgetCategory === code) {
					var truncatedCheckboxLabel = '';
					var checkboxLabel = wgtList[i].widgetCategory;
					if (!Ext.isEmpty(wgtList[i].widgetInfo)) {
						if (checkboxLabel.length > 2) {
							truncatedCheckboxLabel = Ext.util.Format.ellipsis(
									getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo), 160);
							tooltipLabel = getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo);
						} else {
							truncatedCheckboxLabel = getLabel(wgtList[i].widgetCode+"_INFO",wgtList[i].widgetInfo);
						}
					}
					widgetListArray.push({
						record : wgtList[i],
						items : [{
									xtype : 'label',
									width : '100%',
									//margin : '5 0 5 5',
									cls : 'ux_font-size16',
									text : getLabel(wgtList[i].widgetCode,wgtList[i].widgetDesc)
								}, {
									xtype : 'panel',
									readOnly : true,
									width : '100%',
									layout : 'hbox',
									items : [{
												xtype : 'image',
												height : 70,
												width : '20%',
												margin : '5 0 0 5',
												src : wgtList[i].widgetThumb
											}, {
												xtype : 'textarea',
												readOnly : true,
												width : '75%',
												fieldCls : 'ux_panel-background ux_no-border ux_font-size14-normal',
												value : truncatedCheckboxLabel
											}]
								}]
					});
				}
			}
			widgetSelectionPanel.add(widgetListArray);
		}
	}
});
