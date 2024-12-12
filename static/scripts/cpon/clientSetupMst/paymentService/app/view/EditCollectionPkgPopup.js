var strRulUrl = null;
Ext.define('CPON.view.EditCollectionPkgPopup',
		  {
					extend : 'Ext.window.Window',
					xtype : 'editCollectionPkgPopup',
					requires : [ 'Ext.data.Store',
							'Ext.ux.gcp.AutoCompleter'],
					width : 400,
					autoHeight : true,
					modal : true,
					padding : '10 5 5 10',
					draggable : true,
					listeners : {
						afterrender : function() {
							this.setInitialValues(),
							this.setTitle((this.mode=='VIEW' ? getLabel('lblViewCollPopup','View Receivable Package') : getLabel('lblEditCollPopup',
							'Edit Receivable Package')));
						}
					},					
					config : {
						productValue : null,
						ruleValue : null,
						mode : null,
						identifier : null
					},
					autoScroll : true,
					layout : 'vbox',
					title :  getLabel('lblEditCollPopup','Edit Receivable Package'),
					initComponent : function() {
						var me = this;
						var strCollWorkflowLstUrl = null,strCollectionEnrichmentUrl = null;
						strCollWorkflowLstUrl = 'cpon/clientCollection/collectionWorkflowList.json?id=';
						strCollectionEnrichmentUrl = 'cpon/clientCollection/collectionEnrichmentList.json?id=';
						var storeData = null;
						Ext.Ajax.request({
							url : strCollWorkflowLstUrl+ encodeURIComponent(parentkey),
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								var wfData = data.d.filter;
								if (!Ext.isEmpty(data)) {
									storeData = wfData;
									pkgWorkflowList = wfData;
								}
							},
							failure : function(response) {
								// console.log("Ajax Get data Call Failed");
							}
						});
						var productStore = Ext.create('Ext.data.Store',
						{
							fields : [ 'name', 'value' ],
							data : storeData,
								reader : {
									type : 'json',
									root : 'd.filter'
								}
						});

						var enrichmentStore = Ext.create('Ext.data.Store',
						{
							fields : [ 'name', 'value' ],
							proxy : {
								type : 'ajax',
								url : strCollectionEnrichmentUrl
										+ encodeURIComponent(parentkey),
								actionMethods : {
									create : "POST",
									read : "POST",
									update : "POST",
									destroy : "POST"
								},
								reader : {
									type : 'json',
									root : 'd.filter'
								}
							},
							autoLoad : true
						});
						
						var defaultProductComboBoxView = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'defaultProductCombo',
									store : productStore,
									fieldLabel : getLabel('lblcollPkgWorkflow',
											'Workflow Profile'),
									labelAlign : 'top',
									labelCls : 'frmLabel',
									id : 'defaultProductCombo',
									itemId : 'defaultProductCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									queryMode : 'local',
									displayField : 'name',
									valueField : 'value',
									padding : '5 5 5 5',
									editable : false,
									height: 71
								});
						var packageEnrichmentView = Ext.create(
						'Ext.form.ComboBox', {
							xtype : 'packageEnrichmentCombo',
							store : enrichmentStore,
							fieldLabel : getLabel('lblcollPkgEnrichment',
									'Package Transaction Enrichment'),
							labelAlign : 'top',
							labelCls : 'frmLabel',
							itemId : 'defaultEnrichmentCombo',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							queryMode : 'local',
							displayField : 'name',
							valueField : 'value',
							padding : '5 5 5 5',
							editable : false
						});
						me.items = [{
									xtype : 'textfield',
									itemId : 'txtCollMethodNm',
									labelCls : 'frmLabel',
									 readOnly: true,
									fieldLabel : getLabel('lblcollPkgName',
											'Package Name'),
									labelAlign : 'top',
									width : '40%',
									padding : '5 5 5 5'
								},
								{
									xtype : 'label',
									itemId : 'ccyCodeLbl',
									labelCls : 'frmLabel',
									 readOnly: true,
									labelAlign : 'top',
									padding : '5 5 5 5'
								},
								{
									xtype : 'container',
									layout : 'hbox',
									items: [
										{
											xtype : 'label',
											itemId : 'lblUseForValue',						
											labelAlign : 'right',	
											padding : '0 0 0 5'
										}
									]
								},
								{
									xtype : 'panel',
									layout : 'hbox',
									padding : '5 5 0 5',
									items : [
										{
											xtype : 'label',
											itemId : 'lblUseFor',											
											labelAlign : 'left',
											cls : 'frmLabel',
											text : getLabel('lblCollUseFor',
											'Use for : ')
										}
									]									
								},
								{
									xtype : 'panel',
									width : '100%',
									items : [
										{
											xtype : 'checkboxgroup',
											width : '100%',
											layout : 'column',
											items : [{
												boxLabel : '<span class="label-font-normal" id="colMandateVerification">Mandate Verification</span>',
												columnWidth : 0.4,
												id:'mandateVerification',
												itemId : 'mandateVerification'
											},{
												boxLabel : '<span class="label-font-normal" id="colPayerMandatory">Payer Mandatory</span>',
												columnWidth : 0.4,
												id:'payerMandatory'
											},{
												boxLabel : '<span class="label-font-normal" id="colRegisteredPayerOnly">Registered Payer Only</span>',
												columnWidth : 0.4,
												id:'registeredPayerOnly'
											},{
												boxLabel : '<span class="label-font-normal" id="colpdc">PDC</span>',
												columnWidth : 0.4,
												id:'pdc',
												listeners : {
													change : function() {
														me.pdcChange();
													}
												}
											},{
												boxLabel : '<span class="label-font-normal" id="colPdcDiscounting">PDC Discounting</span>',
												columnWidth : 0.4,
												id:'pdcDiscounting'
											}]
										}
									]
								},
								/*{
									xtype : 'panel',
									layout : 'hbox',
									padding : '5 5 5 5',
									items : [
										{
											xtype : 'checkboxfield',
											itemId : 'assignAccFlag',								
											labelCls : 'frmLabel',
											labelWidth : '13',
											fieldLabel: getLabel('lblCollAssignAcc','Assign all Accounts:'),
											labelAlign : 'left',																		
											listeners : {										
											}
										}									
									]								
								},*/
								{
									xtype : 'container',
									layout : 'hbox',
									items:[defaultProductComboBoxView,packageEnrichmentView]
								}
								//defaultProductComboBoxView
								];
						if ('VIEW' === me.mode) {
							me.buttons = [ {
								xtype : 'button',
								text : getLabel('cancel', 'Cancel'),
								cls : 'xn-button',
								handler : function() {
									me.close();
								}
							} ];
						} else {
							me.buttons = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										cls : 'xn-button',
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : getLabel('save', 'Save'),
										itemId : 'saveCollPkg',
										cls : 'xn-button',
										handler : function() {
											this.fireEvent(
													"updateCollectionPkg",
													me.identifier);
										}
									} ];

						}
						me.callParent(arguments);
					},
					setInitialValues : function() {
						var me = this;
					/*	var assignAccFlagCheck = me
						.down('checkboxfield[itemId=assignAccFlag]');
						if ('VIEW' === me.mode) {
							assignAccFlagCheck.setDisabled(true);							
						}*/
					},
					
					pdcChange : function(){
						var pdc = Ext.getCmp('pdc');
						var pdcDiscounting = Ext.getCmp('pdcDiscounting');
						if(pdc) {
							if(pdc.value== true && productPdcDiscountFlag == "Y")
							{
								pdcDiscounting.setDisabled(false);
							}
							else
							{
								pdcDiscounting.setDisabled(true);
								if(productPdcDiscountFlag == "Y")
								{
									pdcDiscounting.setValue(pdc.value);
									pdcDiscounting.checked = pdc.value;
								}
							}
						}
					}
				});