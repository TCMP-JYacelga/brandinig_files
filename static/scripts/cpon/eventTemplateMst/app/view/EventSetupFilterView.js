Ext.define('GCP.view.EventSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'eventSetupFilterView',
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
				/*
				 * var moduleTypeContainer =
				 * Ext.create('Ext.container.Container', { columnWidth : 0.30,
				 * padding : '3px 16px 10px 10px', items : [{ xtype : 'label',
				 * text : getLabel('module', 'Module'), padding : '4 0 0 6' }, {
				 * xtype : 'toolbar', padding : '6 0 0 8', cls :
				 * 'xn-toolbar-small', itemId : 'moduleTypeToolBar',
				 * filterParamName : 'module', width : '100%', parent : this,
				 * border : false, componentCls : 'xn-btn-default-toolbar-small
				 * xn-custom-more-toolbar', items : [{ text : getLabel('all',
				 * 'All'), code : 'all', btnDesc : getLabel('all', 'All'), btnId :
				 * 'allPaymentType', parent : this, cls : 'f13
				 * xn-custom-heighlight', handler : function(btn, opts) {
				 * this.parent.fireEvent( 'handleModuleType', btn); } }],
				 * listeners : { render : function(toolbar, opts) { //
				 * this.parent.handlePaymentTypeLoading(toolbar); } } }] });
				 */
				// filterContainerArr.push(moduleTypeContainer);
				var eventTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
							fieldCls : 'xn-form-text w13 xn-suggestion-box',
							name : 'eventname',
							itemId : 'profileNameFltId',
							cfgUrl : 'cpon/eventsetupseek/{0}.json',
							cfgProxyMethodType : 'POST',
							matchFieldWidth : true,
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'alertmessageEventSeek',
							cfgRootNode : 'd.filter',
							cfgDataNode1 : 'name'
						});
				var templateTextfield = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							fieldCls : 'xn-form-text w13 xn-suggestion-box',
							name : 'eventtemplatename',
							itemId : 'templateNameFltId',
							cfgUrl : 'cpon/eventsetupseek/{0}.json',
							cfgProxyMethodType : 'POST',
							matchFieldWidth : true,
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'alertmessageTemplateNameSeek',
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
								columnWidth : 0.20,
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
							},{
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.25,
								items : [{
											xtype : 'label',
											text : getLabel('event', 'Event'),
											cls : 'frmLabel'
										}, eventTextfield]
							}, {
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.30,
								items : [{
									xtype : 'label',
									text : getLabel('alertMessageTemp',
											'Alert Message Template'),
									cls : 'f13 frmLabel'
								}, templateTextfield]
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
								columnWidth : 0.12,
								items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 0 5',
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