Ext.define('GCP.view.SecurityProfilePopup',	{
					extend : 'Ext.window.Window',
					xtype : 'securityProfilePopup',
					requires : ['Ext.data.Store'],
					width : 400,
					autoHeight : true,
					modal : true,
					cls:'t7-popup',
					draggable : true,
					// closeAction : 'hide',
					config : {
						sellerCode : null,
						clientCode : null,
						strUrl : null,
						storeData : null,
						selectedProfileId : null, 
						reportCode : null,
						reportName : null,
						record : null
					},
					autoScroll : true,
					layout : 'vbox',
					title : getLabel('securityconfiguration',
							'Security Profile'),
					initComponent : function() {
						var me = this;
						var objStore = Ext.create('Ext.data.Store', {
								fields : ['filterValue','filterCode'],
								data : me.storeData
							});
						var reportTextField = Ext.create(
								'Ext.form.field.Text', {
									xtype : 'reportTextField',
									fieldLabel : getLabel('reportName',
											'Report Name'),
									labelAlign : 'top',
									labelCls : 'frmLabel',
									itemId : 'reportTextField',
									value : me.reportName,
									padding : '5 5 5 5',
									width : 165,
									readOnly : true
								});
						var securityProfileCombo = Ext.create(
								'Ext.form.ComboBox', {
									store : objStore,
									fieldLabel : getLabel('securityconfiguration',
											'Security Profile'),
									labelAlign : 'top',
									itemId : 'securityProfileCombo',
									triggerBaseCls : 'xn-form-trigger',
									value : me.selectedProfileId,
									emptyText : getLabel('select', 'Select'),
									width : 180,
									cls:"t7-combo",
									padding : '5 5 5 5',
									labelCls : 'frmLabel',
									editable : false,
									displayField : 'filterValue',
									valueField : 'filterCode'
								});
						me.items = [
								reportTextField,
								securityProfileCombo];
						me.buttons = [
									{
										xtype : 'button',
										text : getLabel('cancel', 'Cancel'),
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : getLabel('submit', 'Submit'),
										itemId : 'btnSubmitRulePriority',
										handler : function() {
											//me.attachSecurityProfileToReport();
											me.fireEvent("attachSecurityProfileToReport");
										}
									} ];						
						me.callParent(arguments);
					},
					getJsonofSecurityProfile : function() {
						var me = this;
						var secProfId =  me.down('combo').getValue();
						var strData = {};
						strData['reportCode'] = me.record.raw.reportCode;
						strData['securityProfileId'] = secProfId;
						strData['reportType'] = me.record.raw.reportType;
						return strData; 
					}
				});