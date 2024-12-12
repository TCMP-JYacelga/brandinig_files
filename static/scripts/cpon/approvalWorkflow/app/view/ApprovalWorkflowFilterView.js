Ext.define('GCP.view.ApprovalWorkflowFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'approvalWorkflowFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() 
	{
		var me = this;
		pmtSummaryView = this;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		var defaultMatrixUrl = null;
		var multipleSellersAvailable = false;
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',											
								method : 'POST',
								async : false,
								success : function(response) {							
							if (response && response.responseText)
										me.populateClientMenu(Ext
												.decode(response.responseText));
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}
							});
				});
				
			me.on('afterrender', function(panel) {
					var clientBtn = me.down('button[itemId="clientBtn"]');
					// Set Default Text When Page Loads
					clientBtn
							.setText(getLabel('allCompanies', 'All Companies'));
				});
	
		if (userType == 0) {
			defaultMatrixUrl = 'services/approvalMatrixWorkflowSeek/adminDefaultMatrixList';
		}
		else{
			defaultMatrixUrl = 'services/approvalMatrixWorkflowSeek/clientDefaultMatrixList';
		}
		
		var defaultMatrixContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			padding : '10px',
			items : [{
						xtype : 'label',
						text : getLabel('defaultMatrix', 'Default Matrix'),
						cls : 'ux_font-size14  ux_largemargin-left	'
					}, {
						xtype : 'AutoCompleter',
						cls : 'ux_paddingb ux_normalmargin-top ux_largemargin-left ',
						fieldCls : 'xn-form-text xn-suggestion-box',
						name : 'defaultMatrix',
						itemId : 'defaultMatrixFltId',
						cfgUrl : defaultMatrixUrl,
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						cfgSeekId : 'approvalAdminClientList',
						cfgKeyNode : 'name',
						cfgRootNode : 'filterList',
						cfgDataNode1 : 'value',
						cfgProxyMethodType : 'POST',
						cfgExtraParams : [
						   {
								key : '$clientId',
								value : strClientId
							}]
					}]
		});
		
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
				
		var statusContainer = Ext.create('Ext.container.Container',{
				xtype : 'container',
				columnWidth : 0.25,
				padding : '10px',
				items : [{
					xtype : 'label',
					text : getLabel('status', 'Status'),
					cls : 'ux_normalpadding-bottom ux_font-size14 ux_largepadding-left'
				}, {
					xtype : 'combo',
					cls : 'ux_normalmargin-top ux_largepadding-left ux_largemargin-left',
					displayField : 'value',
					width : 165,
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'requestState',
					itemId : 'statusFltId',
					valueField : 'name',										
					name : 'requestState',
					editable : false,
					value : 'ALL',
					store : statusStore
				}]
			});
	
		
		filterContainerArr.push(defaultMatrixContainer);
		filterContainerArr.push(statusContainer);
		
		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr
				}];
		this.callParent(arguments);
				
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
						pmtSummaryView.fireEvent('handleClientChange', btn.code,
								btn.btnDesc, '');
					}
				});

		Ext.each(clientArray, function(client) {
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									pmtSummaryView.fireEvent('handleClientChange',
											btn.code, btn.btnDesc, '');											
								}
							});
				});		
		if (null != clientArray && clientArray.length <= 1) {
		
			filterClientMenuContainer.hide();
		}
	},	
					
	tools : [{
		xtype : 'container',
		itemId : 'filterClientMenuContainer',
		cls : 'authMatrixFilterCss',
		padding : '0 0 0 5',
		left:150,
		hidden : !isClientUser(),
		items : [{
			xtype : 'label',
			margin : '3 0 0 0',
			html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
		},{
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
		}				
		]
		},
		{
		xtype : 'container',
		itemId : 'filterClientAutoCmplterCnt',
		cls : 'authMatrixFilterCss',
		padding : '0 0 0 5',
		layout : {
			type : 'hbox'
		},
		hidden : isClientUser(),
		items : [{
			xtype : 'label',
			margin : '3 0 0 0',
			html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
		}, {
			
						xtype : 'AutoCompleter',	
						margin : '0 0 0 5',						
						fieldCls : 'xn-form-text xn-suggestion-box',
						name : 'clientCode',
						itemId : 'clientCodesFltId',
						cfgUrl : 'services/userseek/userclients.json',
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						cfgSeekId : 'approvalAdminClientList',					
						cfgKeyNode : 'CODE',
						cfgRootNode : 'd.preferences',						
						cfgDataNode1 : 'DESCR',
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
						pmtSummaryView.fireEvent('handleClientChange', '', '', '');
					}
				},
				'render' : function(combo) {
				}
			}
		
	}
		]
	}
	]						
			
	
   });