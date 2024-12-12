Ext.define('GCP.view.SecurityProfilePopup',	{
					extend : 'Ext.window.Window',
					xtype : 'securityProfilePopup',
					requires : ['Ext.data.Store'],
					width : 400,
					autoHeight : true,
					modal : true,
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
									width : 180,
									readOnly : true
								});
						var securityProfileCombo = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'securityProfileCombo',
									store : objStore,
									fieldLabel : getLabel('securityconfiguration',
											'Security Profile'),
									labelAlign : 'top',
									itemId : 'securityProfileCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									value : me.selectedProfileId,
									emptyText : getLabel('select', 'Select'),
									width : 180,
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
										text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
										glyph : 'xf056@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
										handler : function() {
											me.close();
										}
									},
									{
										xtype : 'button',
										text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('submit', 'Submit'),
										itemId : 'btnSubmitRulePriority',
										glyph : 'xf058@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
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
						strData['entityType'] = me.record.raw.entityType;
						strData['entityCode'] = me.record.raw.entityCode;
						return strData; 
					}
				});