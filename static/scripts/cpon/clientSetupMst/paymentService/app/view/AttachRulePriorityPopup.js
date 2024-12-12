var strRulUrl = null;
Ext
		.define(
				'CPON.view.AttachRulePriorityPopup',
				{
					extend : 'Ext.window.Window',
					xtype : 'attachRulePriorityPopup',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store',
							'Ext.ux.gcp.AutoCompleter' ],
					width : 650,//730,
					autoHeight : true,
					maxHeight: 550,
					minHeight:156,
					modal : true,
					cls : 'non-xn-popup',
					draggable : false,
					resizable: false,
					// closeAction : 'hide',
					config : {
						productValue : null,
						ruleValue : null,
						/*oldProductValue : null,
						oldRuleValue : null,
						oldPriority: null,
						oldArrangment: null,*/
						mode : null,
						identifier : null
					},
					autoScroll : true,
					//layout : 'vbox',
					layout : 'column',
					title : getLabel('addEditRulePriority',
							'Add / Edit Rule Priority'),
					initComponent : function() {
						var me = this;
						var strProdPriorityLstUrl = null;
						var strProdPriorityRuleCodeLstUrl = null;						
						if('02' == srvcCode)
						{
							strProdPriorityLstUrl = 'cpon/clientPayment/priorityProductList.json';
							strProdPriorityRuleCodeLstUrl = 'cpon/clientPayment/priorityRuleCodeList.json';
							strRulUrl = 'cpon/clientServiceSetup/getAllPaymentRules.json';	
						}
						if('05' == srvcCode)
						{
							strProdPriorityLstUrl = 'cpon/clientCollection/priorityProductList.json';
							strProdPriorityRuleCodeLstUrl = 'cpon/clientCollection/priorityRuleCodeList.json';
							strRulUrl = 'cpon/clientServiceSetup/getAllCollectionRules.json';
						}						
						var productStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : strProdPriorityLstUrl,
												actionMethods : {
													create : "POST",
													read : "POST",
													update : "POST",
													destroy : "POST"
												},
												extraParams:{id:encodeURIComponent(parentkey)},
												reader : {
													type : 'json',
													root : 'd.filter'
												},
												noCache:false
											},
											autoLoad : true
										});
						
						productStore.addListener('load', function(me) {
							me.insert(0, {name: getLabel('select','Select'), value: ''});
						});

						var ruleStore = Ext
								.create(
										'Ext.data.Store',
										{
											fields : [ 'name', 'value' ],
											proxy : {
												type : 'ajax',
												url : strProdPriorityRuleCodeLstUrl,
												actionMethods : {
													create : "POST",
													read : "POST",
													update : "POST",
													destroy : "POST"
												},
												extraParams:{id:encodeURIComponent(parentkey)},
												reader : {
													type : 'json',
													root : 'd.filter'
												},
												noCache:false
											},
											autoLoad : true
										});
						
						ruleStore.addListener('load', function(me) {
							me.insert(0, {name: getLabel('select','Select'), value: ''});
						});

						var defaultProductComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultProductCombo',
									columnWidth : 0.333333,
									store : productStore,
									fieldLabel : getLabel('priority.product',
											'Product'),
									labelSeparator : "",
									labelAlign : 'top',
									itemId : 'defaultProductCombo',
									cls: ' ux_extralargemargin-bottom ft-extraLargeMarginR',
									fieldCls : 'xn-form-field',
									labelCls : 'font_bold ux_font-size14-normal required',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									//margin : '0 16 0 0',
									editable : false,
									listeners : {
										scope : this,
										/*'select' : this.getArrangementCode,*/
										render: function(combo) {
											if(Ext.isEmpty(combo.getValue())) {
												combo.setValue('');
											}
										}
									}
								});
						
						var defaultRuleComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultRuleCombo',
									columnWidth : 0.333333,
									store : ruleStore,
									fieldLabel : getLabel('priority.rule',
											'Rule'),
									labelSeparator : "",
									labelAlign : 'top',
									itemId : 'defaultRuleCombo',
									cls: 'ux_extralargemargin-bottom ft-extraLargeMarginR',
									fieldCls : 'xn-form-field',
									labelCls : 'font_bold ux_font-size14-normal required',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									//margin : '0 8 0 8',
									editable : false,
									listeners : {
										scope : this,
										/*'select' : this.getArrangementCode,*/
										render: function(combo) {
											if(Ext.isEmpty(combo.getValue())) {
												combo.setValue('');
											}
										}
									}
								});
						/*if ('ADD' === me.mode || 'VIEW' === me.mode) {

							defaultArrangementComboBoxView = Ext.create(
									'Ext.form.ComboBox', {
										xtype : 'defaultArrangementCombo',
										columnWidth : 0.333333,
										// store : arrangementStore,
										fieldLabel : getLabel(
												'priority.arrangement',
												'Arrangement'),
										labelSeparator : "",
										labelAlign : 'top',
										itemId : 'defaultArrangementCombo',
										cls: ' ux_extralargemargin-bottom',
										fieldCls : 'xn-form-field',
										width : '100%',
										labelCls : 'font_bold ux_w135 ux_font-size14-normal',
										triggerBaseCls : 'xn-form-trigger',
										queryMode : 'local',
										displayField : 'name',
										valueField : 'profileId',
										//margin : '0 0 0 16',
										editable : false,
										disabled : true
									});
						} else {

							if (me.ruleValue != null && me.productValue != null) {*/
								var arrangementStore = Ext
										.create(
												'Ext.data.Store',
												{
													fields : [ 'name', 'value', 'profileId' ],
													proxy : {
														type : 'ajax',
														url : strRulUrl,
														extraParams : {
															id : encodeURIComponent(parentkey),
															$filter:'product_code eq \''
																+ me.productValue
																+ '\' and rule_code eq \''
																+ me.ruleValue
																+ '\''
														},
														actionMethods : {
															create : "POST",
															read : "POST",
															update : "POST",
															destroy : "POST"
														},
														reader : {
															type : 'json',
															root : 'd.filter'
														},
														noCache:false
													},
													autoLoad : true
												});
							/*}*/
							defaultArrangementComboBoxView = Ext.create(
									'Ext.form.ComboBox', {
										xtype : 'defaultArrangementCombo',
										columnWidth : 0.333333,
										store : arrangementStore,
										fieldLabel : getLabel(
												'priority.arrangement',
												'Arrangement'),
										labelSeparator : "",
										labelAlign : 'top',
										itemId : 'defaultArrangementCombo',
										cls: ' ux_extralargemargin-bottom',
										fieldCls : 'xn-form-field ',
										width : '100%',
										labelCls : 'font_bold ux_w135 ux_font-size14-normal',
										triggerBaseCls : 'xn-form-trigger',
										queryMode : 'local',
										displayField : 'name',
										valueField : 'profileId',
										//padding : '5 5 5 5',
										margin : '0 0 0 16',
										editable : false,
										listeners : {
											scope : this,
											render: function() {
												arrangementStore.load();
											}
										}
									});
							
							arrangementStore.addListener('load', function(store) {
								store.insert(0, {name: getLabel('select','Select'), value: '', profileId: ''});
								if(defaultArrangementComboBoxView && Ext.isEmpty(defaultArrangementComboBoxView.getValue())) {
									defaultArrangementComboBoxView.setValue('');
								}
							});
							
						/*}*/
						me.items = [
								defaultProductComboBoxView,
								defaultRuleComboBoxView,
								defaultArrangementComboBoxView,
								{
									xtype : 'numberfield',
									columnWidth : (screen.width) > 1024 ? 0.295 : 0.305,
									itemId : 'txtPriority',
									labelAlign : 'top',
									fieldLabel : getLabel('priority',
											'Priority'),
									labelSeparator : "",
									editable : 'VIEW' === me.mode ? false : true,
									disabled : 'VIEW' === me.mode ? true : false,
									//margin : '0 16 0 0',
									cls: ' ux_extralargemargin-bottom',
									labelCls : 'font_bold ux_font-size14-normal required',
									fieldCls:'',
									//triggerBaseCls : 'xn-form-trigger ux_font-size14-normal',
									//padding : '5 5 5 5'
									minValue:0,
									maxValue:999,
									maxLength:3,
									anchor: '100%',
									hideTrigger : true,
									keyNavEnabled: false,
							        mouseWheelEnabled: false,
									enableKeyEvents:true,
									listeners : {
											keypress :  function(event) {
												var prevKey = -1, prevControl = '';
												var keynum;
												if (window.event) { // IE
													keynum = event.keyCode;
												}
												if (event.which) { // Netscape/Firefox/Opera
													keynum = event.which;
												}
												if((keynum == 86 ) && event.ctrlKey)
												{
													$(this).on('input', function(eventObj) {
														$(eventObj.target).val($(eventObj.target).val().replace(/[^0-9]/g, ''));
													});
													return true ;
												}
												if ((event.shiftKey )&&( keynum == 35 ||  keynum == 36 ||keynum == 37 || keynum == 39 || keynum == 9)) {
													return true;
												}
												else if(event.shiftKey){
													return false;
												}
												return ((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46
														|| (keynum >= 35 && keynum <= 40)
														|| (keynum >= 48 && keynum <= 57)
														|| (keynum >= 96 && keynum <= 105) || (keynum == 65
														&& prevKey == 17 && prevControl == event.currentTarget.id)));
								            },
								            change: function(field, value) {
								                value = parseInt(value, 10);
								                if (value == NaN || value < 1 || value > 999) {
													value = '';
												}
								                field.setValue(value);
								            }
									}
								} ];
						if ('VIEW' === me.mode) {
							me.bbar = [ '->',{
								xtype : 'button',
								text : " " + getLabel('cancel', 'Cancel') + " ",
								handler : function() {
									me.close();
								}
							} ];
						} else {
							me.bbar = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										handler : function() {
											me.close();
										}
									},'->',
									{
										xtype : 'button',
										text : getLabel('submit', 'Submit'),
										itemId : 'btnSubmitRulePriority',
										handler : function() {
											this.fireEvent(
													"submitRulePriorities",
													me.identifier);
										}
									} ];

						}
						me.callParent(arguments);
					},

					getArrangementCode : function(combo, records, eOpts) {
						var me = this;
						if (combo.itemId === "defaultRuleCombo")
							me.ruleValue = combo.getValue();
						if (combo.itemId === "defaultProductCombo")
							me.productValue = combo.getValue();
						if (me.ruleValue != null && me.productValue != null) {
							var arrangementStore = Ext
									.create(
											'Ext.data.Store',
											{
												fields : [ 'name', 'value', 'profileId' ],
												proxy : {
													type : 'ajax',
													url : strRulUrl,
													extraParams : {
														id : encodeURIComponent(parentkey)/*,
														$filter:'product_code eq \''
															+ me.productValue
															+ '\' and rule_code eq \''
															+ me.ruleValue
															+ '\''*/
													},
													actionMethods : {
														create : "POST",
														read : "POST",
														update : "POST",
														destroy : "POST"
													},
													reader : {
														type : 'json',
														root : 'd.filter'
													},
													noCache:false
												},
												autoLoad : false
											});
							
							arrangementStore.addListener('load', function(me) {
								me.insert(0, {name: getLabel('select','Select'), value: ''});
							});

							if(me.mode !== 'VIEW') defaultArrangementComboBoxView.enable();
							
							if(Ext.isEmpty(me.productValue) || Ext.isEmpty(me.ruleValue)) {
								defaultArrangementComboBoxView.getStore().loadData([], false);
								defaultArrangementComboBoxView.setValue('');
								defaultArrangementComboBoxView.setRawValue('');
								/*defaultArrangementComboBoxView.getStore().load();*/
							} else {
								defaultArrangementComboBoxView.bindStore(arrangementStore);
								defaultArrangementComboBoxView.store.load(function() {
									if(Ext.isEmpty(defaultArrangementComboBoxView.getValue())) defaultArrangementComboBoxView.setValue('');
								});
							}
						}

					}

				});