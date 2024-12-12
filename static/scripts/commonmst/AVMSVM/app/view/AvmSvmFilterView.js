Ext.define('GCP.view.AvmSvmFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'avmSvmFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_extralargemargin-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		pmtSummaryView =this;
		var matrixNameUrl = null;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		var multipleSellersAvailable = false;

		var matrixTypeContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			items : [{
				xtype : 'label',
				text : getLabel('matrixType', 'Matrix Type'),
				cls : 'ux_font-size14  ux_normalpadding-bottom'
			}, {
				xtype : 'toolbar',
				padding : '6 0 0 0',
				cls : 'xn-toolbar-small',
				itemId : 'matrixTypeToolBar',
				filterParamName : 'matrixType',
				width : '100%',
				parent : this,
				border : false,
				componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
				items : [{
							text : getLabel('all', 'All'),
							code : 'all',
							btnDesc : getLabel('all', 'All'),
							btnId : 'allPaymentType',
							parent : this,
							cls : 'ux_font-size14 xn-custom-heighlight',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleMatrixType', btn);
							}
						}, {
							text : getLabel('authorization', 'Approval'),
							code : '0',
							btnDesc : getLabel('authorization', 'Approval'),
							btnId : 'authorizationMatrixType',
							parent : this,
							cls : 'ux_font-size14',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleMatrixType', btn);
							}
						}, {
							text : getLabel('signatory', 'Signatory'),
							code : '1',
							btnDesc : getLabel('signatory', 'Signatory'),
							btnId : 'signatoryMatrixType',
							parent : this,
							cls : 'ux_font-size14',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleMatrixType', btn);
							}
						}],
				listeners : {
					render : function(toolbar, opts) {
						// this.parent.handlePaymentTypeLoading(toolbar);
					}
				}
			}]
		});
		
		if (userType == 0) {
			matrixNameUrl = 'services/authMatrixSeek/adminMatrixNameList.json';
		}
		else{
			matrixNameUrl = 'services/authMatrixSeek/clientMatrixNameList.json';
		}
		
		var matrixNameContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			items : [{
				xtype : 'label',
				text : getLabel('matrixName', 'Matrix Name'),
				cls : 'ux_font-size14  ux_normalpadding-bottom'
			}, {
				xtype : 'AutoCompleter',
				padding : '1 0 0 0',
				cls : 'ux_normalmargin-top ux_largepadding-left',
				fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
				name : 'matrixName',
				itemId : 'matrixNameFltId',
				cfgUrl : matrixNameUrl,
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : 'matrixNameList',
				cfgKeyNode : 'name',
				cfgRootNode : 'filterList',
				cfgDataNode1 : 'name',
				cfgProxyMethodType : 'POST'
			}]
		});

		filterContainerArr.push(matrixTypeContainer);
		filterContainerArr.push(matrixNameContainer);

		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr,
					cls : 'ux_border-top ux_largepadding'
				}];
		this.callParent(arguments);
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : 'POST',
				async : false,
				success : function(response) {
					if (response && response.responseText)
					{
						var data = Ext.decode(response.responseText);
						me.populateClientMenu(data);
					}
				},
				failure : function(response) {
					// console.log('Error Occured');
				}
			});
		});
		me.on('afterrender', function(panel) {
			var clientBtn = me.down('button[itemId="clientBtn"]');
		// Set Default Text When Page Loads
			clientBtn.setText(getLabel('allCompanies', 'All companies'));
			});	
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {
					//if(client.CODE === prefClientCode)	
					//	prefClientDesc = client.DESCR;
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	tools :
	[
		{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden : userType == 0 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '3 0 0 0',
				html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
			}, {
				xtype : 'button',
				border : 0,
				itemId : 'clientBtn',
				text : getLabel('allCompanies', 'All Companies'),
				cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
				menuAlign : 'b',
				menu : {
					xtype : 'menu',
					maxHeight : 180,
					width : 50,
					cls : 'ext-dropdown-menu xn-menu-noicon',
					itemId : 'clientMenu',
					items : []
				}
			}]
		},
		{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden :  userType == 1 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				margin : '3 0 0 0',
				html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodesFltId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'avmSvmAdminClientList',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
					listeners : {
				'select' : function(combo, record) {
					strClient = combo.getValue();
					strClientDesc = combo.getRawValue();
					
					pmtSummaryView.fireEvent('handleClientChange', strClient,
							strClientDesc);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {	
					if (Ext.isEmpty(newValue)) {					
						pmtSummaryView.fireEvent('handleClientChange', '', '');
					}
				},
				'render' : function(combo) {
				}
			}
			}]
		}
	]

});