Ext.define('GCP.view.ScheduleAdvanceConfigPopup',	{
					extend : 'Ext.window.Window',
					xtype : 'scheduleAdvanceConfigPopup',
					requires : ['Ext.data.Store'],
					width : 400,
					autoHeight : true,
					modal : true,
					draggable : true,
					// closeAction : 'hide',
					config : {
						storeData : null,
						selectedScheduleProfileId : null, 
						txtName : null,
						record : null
					},
					autoScroll : true,
					layout : 'vbox',
					title : getLabel('advanceconfiguration',
							'Advance Configuration'),
					initComponent : function() {
						var me = this;
						var objStore = Ext.create('Ext.data.Store', {
								fields : ['filterValue','filterCode'],
								data : me.storeData
							});
						var reportTextField = Ext.create(
								'Ext.form.field.Display', {
									xtype : 'nameTextField',
									fieldLabel : getLabel('name',
											'Name'),
									labelAlign : 'top',
									labelCls : 'frmLabel',
									itemId : 'nameTextField',
									value : me.txtName,
									padding : '5 5 5 5',
									width : 180,
									readOnly : true
								});
						var scheduleProfileCombo = Ext.create(
								'Ext.form.ComboBox', {
									xtype : 'scheduleProfileCombo',
									store : objStore,
									disabled :modeVal == 'VERIFY' || me.record.raw.allowSchedule == 'No'? true:false,
									fieldLabel : getLabel('scheduleProfile',
											'Schedule Profile Name'),
									labelAlign : 'top',
									itemId : 'scheduleProfileCombo',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									value : me.selectedScheduleProfileId,
									emptyText : getLabel('select', 'Select'),
									width : 180,
									padding : '5 5 5 5',
									labelCls : 'frmLabel',
									editable : false,
									displayField : 'filterValue',
									valueField : 'filterCode',
									hidden : scheduleProfileApplicable == 'N'
								});
						
						me.items = [
								reportTextField,
								{
									xtype : 'container',
									padding : '5 5 5 5',
									layout : 'hbox',
									flex : 1,
									items : 
									[
										{
											xtype : 'checkbox',
											itemId : 'ondemandCheckBox',
											readOnly :modeVal == 'VERIFY'?true:false,
											flex : 0.5,
											cls : 'f13 ux_font-size14 ux_padding0060',
											padding : '15 0 0 0',
											labelSeparator : '',
											checked : me.record.raw.allowOndemand == "Yes" ? true : false,
											boxLabel : getLabel('ondemandCheckBox', 'Allow On Demand'),
											labelAlign : 'right',
											name : 'ondemandCheckBox'
										}, {
											xtype : 'checkbox',
											itemId : 'scheduleCheckBox',
											readOnly :modeVal == 'VERIFY'?true:false,
											flex : 1.5,
											cls : 'f13 ux_font-size14 ux_padding0060',
											padding : '15 0 0 0',
											labelSeparator : '',
											checked : me.record.raw.allowSchedule == "Yes" ? true : false,
											boxLabel : getLabel('scheduleCheckBox', 'Allow Scheduling'),
											labelAlign : 'right',
											name : 'scheduleCheckBox',
											handler : function() {
												me.fireEvent("allowSchCheckboxChange");
											}
										}
									]
								},
								scheduleProfileCombo
								];
						me.buttons = [
									{
										xtype : 'button',
										text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('ok', 'OK'),
										itemId : 'btnSaveConfigDetails',
										hidden :modeVal == 'VERIFY'?true:false,
										glyph : 'xf058@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
										handler : function() {
											me.fireEvent("saveAdvanceConfigDetails");
										}
									},
									{
										xtype : 'button',
										text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
										glyph : 'xf056@fontawesome',
										cls : 'ux_button-background-color ux_button-padding',
										handler : function() {
											me.close();
										}
									}];						
						me.callParent(arguments);
					},
					getJsonofScheduleProfile : function() {
						var me = this;
						var schProfId =  me.down('combo').getValue();
						var allowOndemandFlag = me.down('checkbox[itemId="ondemandCheckBox"]').checked;
						var allowScheduleFlag = me.down('checkbox[itemId="scheduleCheckBox"]').checked;
						var strData = {};
						strData['viewState'] = me.record.raw.identifier;
						strData['scheduleProfileId'] = schProfId;
						strData['scheduleProfileDesc'] = me.down('combo').getDisplayValue();
						strData['allowOndemand'] = allowOndemandFlag == true ? "Y" : "N";
						strData['allowSchedule'] = allowScheduleFlag == true ? "Y" : "N";
						strData['profileId'] = me.record.raw.profileId;
						strData['parentRecordKey'] = excryptedParentId;
						return strData; 
					}
				});