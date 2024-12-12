Ext.define('GCP.view.AlertSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'alertSetupFilterView',
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
	initComponent : function() {
		var me = this;

		var filterContainerArr = new Array();

		var subscriptionTypeContainer = Ext.create('Ext.container.Container', {
			// columnWidth : 0.40,
			padding : '3px 16px 10px 10px',
			items : [{
						xtype : 'label',
						cls : 'frmLabel',
						text : getLabel('lblType', 'Type')
					}, {
						xtype : 'toolbar',
						cls : 'xn-toolbar-small',
						itemId : 'subscriptionTypeToolBar',
						filterParamName : 'subscriptionType',
						width : 160,
						parent : this,
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
							text : getLabel('all', 'All'),
							code : 'all',
							btnDesc : getLabel('all', 'All'),
							btnId : 'allPaymentType',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleSubscriptionType',
										btn);
							}
						}, {
							text : getLabel('standard', 'Standard'),
							code : 'S',
							btnDesc : getLabel('standard', 'Standard'),
							btnId : 'allActiveType',
							parent : this,
							cls : 'f13',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleSubscriptionType',
										btn);
							}
						}, {
							text : getLabel('custom', 'Custom'),
							code : 'T',
							btnDesc : getLabel('custom', 'Custom'),
							btnId : 'allInactiveType',
							parent : this,
							cls : 'f13',
							handler : function(btn, opts) {
								this.parent.fireEvent('handleSubscriptionType',
										btn);
							}
						}],
						listeners : {
							render : function(toolbar, opts) {
								// this.parent.handlePaymentTypeLoading(toolbar);
							}
						}
					}]
		});

		filterContainerArr.push(subscriptionTypeContainer);
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : '95%',
					name : 'eventname',
					itemId : 'profileNameFltId',
					cfgUrl : 'cpon/alertsetupseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'alertSubscriptionEventSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		this.items = [{
			xtype : 'panel',
			cls : 'ux_largepadding',
			layout : 'column',
			width : '100%',
			items : [{
						xtype : 'panel',
						layout : 'column',
						columnWidth : 0.22,
						itemId : 'specificFilter',
						items : []
					}, {
						xtype : 'panel',
						layout : 'column',
						columnWidth : 0.22,
						itemId : 'moduleFilter',
						items : []
					}, {
						xtype : 'container',
						// width : '100%',
						columnWidth : 0.22,
						layout : 'column',
						items : filterContainerArr
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.22,
						items : [{
									xtype : 'label',
									text : getLabel('event', 'Event'),
									cls : 'frmLabel'
								}, clientTextfield]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('status', 'Status'),
									cls : 'frmLabel'
								}, {
									xtype : 'combo',
									width : 150,
									displayField : 'value',
									valueField : 'name',
									value : getLabel('all','ALL'),
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'statusFilter',
									itemId : 'statusFilter',
									name : 'statusCombo',
									editable : false,
									store : me.getStatusStore()
								}]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						padding : '0 0 0 10',
						columnWidth : 0.12,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-background-color ux_button-padding'
											}]
								}]
					}]
		}];
		this.callParent(arguments);
	},
	handleSellerChange : function(selectedSeller) {
		var me = this;
		var form;
		var strUrl = 'clientServiceChangeSeller.form';
		var errorMsg = null;
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedSellerCode', selectedSeller));

			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			
			arrStatusFilterLst.push({
				name : 'ALL',
				value : getLabel('all','ALL')
			});					
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['name','value'],
						data : arrStatusFilterLst,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	}
});