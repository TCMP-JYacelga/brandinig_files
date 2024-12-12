/**
 * @class GCP.view.activity.popup.NotesPopUpView
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.popup.NotesPopUpView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.Panel', 'Ext.form.field.Text', 'Ext.form.Label'],
	xtype : 'notesPopUpView',
	title : getLabel('notes', 'Notes'),
	width : 380,
	autoHeight : true,
	closeAction : 'hide',
	modal : true,
	layout : {
		type : 'vbox'
	},
	recordId : null,
	currentAccountNumber : null,
	record : null,
	initComponent : function() {
		var me = this;
		var parentView = Ext.create('Ext.form.Panel', {
					width : 355,
					itemId : 'tabelPanel',
					autoHeight : true,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'textfield',
								fieldLabel : getLabel('account', 'Account'),
								labelPad : 37,
								itemId : 'accountId',
								labelSeparator : "",
								fieldCls : 'xn-readonly',
								readOnly : true,
								padding : '10 0 0 30'
							}, {
								xtype : 'textfield',
								fieldLabel : getLabel('date', 'Date'),
								labelPad : 37,
								itemId : 'date',
								labelSeparator : "",
								fieldCls : 'xn-readonly',
								readOnly : true,
								padding : '0 0 0 30'
							}, {
								xtype : 'textfield',
								fieldLabel : getLabel('amount', 'Amount'),
								labelPad : 37,
								itemId : 'amount',
								labelSeparator : "",
								fieldCls : 'xn-readonly xn-field-amount',
								readOnly : true,
								padding : '0 0 0 30'
							}, {
								xtype : 'textfield',
								fieldLabel : getLabel('type', 'Type'),
								labelPad : 37,
								itemId : 'type',
								labelSeparator : "",
								fieldCls : 'xn-readonly',
								readOnly : true,
								padding : '0 0 0 30'
							}, {
								xtype : 'label',
								html : '<hr/>',
								padding : '0 0 4 30',
								width : 330,
								colspan : 2
							}]

				});
		var childView = Ext.create('Ext.form.Panel', {
			width : 355,
			itemId : 'dynamicTablePanel',
			autoHeight : true,
			layout : {
				type : 'vbox'
			},
			items : [],
			buttons : [{
						text : getLabel('cancel', 'Cancel'),
						handler : function() {
							me.close();
						}
					}, {
						text : getLabel('save', 'Save'),
						formBind : true,
						disabled : true,
						handler : function() {
							var notesJsonData = me.getNotesJsonData();
							if (!Ext.isEmpty(notesJsonData))
								me.saveNotesJsonData(notesJsonData);
							/*
							 * var form = this.up('form').getForm(); if
							 * (form.isValid()) { form.submit({ success:
							 * function(form, action) { console.log("form is
							 * valid"); Ext.Msg.alert('Success',
							 * action.result.msg); me.saveNotesData(); },
							 * failure: function(form, action) {
							 * console.log("form is not valid");
							 * Ext.Msg.alert('Failed', action.result.msg); } }); }
							 */
						}
					}]
				/*
				 * bbar : [ '->', { xtype : 'button', text :
				 * getLabel('cancel','Cancel'), cls : 'xn-button', handler :
				 * function() { me.txnNotesPopup.close(); } }, { xtype :
				 * 'button', text : getLabel('save','Save'), cls : 'xn-button',
				 * handler : function() { me.saveNotesData(); } } ]
				 */
			});
		me.items = [parentView];
		me.on('beforeshow', function() {
					me.showNotes();
				});
		me.callParent(arguments);
	},
	clearFields : function() {
		var me = this;
		var panel = me.down('panel[itemId="dynamicTablePanel"]');
		if (!Ext.isEmpty(panel))
			panel.removeAll(true);
	},
	getNotesJsonData : function() {
		var me = this;
		var panel = me.down('panel[itemId="dynamicTablePanel"]');
		var identifier = me.recordId;
		var itemsCount = panel.items.length;
		var itemsList = panel.items;
		var enrichValueKey = "enrich_value_";
		var enrichMandatoryKey = "enrich_mandatory_";
		var field, strValue, blnAllowBlank = false;

		if (!Ext.isEmpty(identifier) && itemsCount != 0) {
			var notesJsonData = "{\"identifier\":" + "\"" + identifier + "\",";
			notesJsonData += "\"notes\":" + "[";
			for (var index = 0; index < itemsCount; index++) {
				field = itemsList.get(index);
				strValue = field.getValue();
				blnAllowBlank = field.allowBlank;
				if (!Ext.isEmpty(strValue)) {
					var currentData = "{\"" + (enrichValueKey + index) + "\":";
					currentData += "\"" + strValue + "\",";
					currentData += "\"" + (enrichMandatoryKey + index) + "\":";
					if (blnAllowBlank) {
						currentData += "\"" + "N" + "\"";
					} else {
						currentData += "\"" + "Y" + "\"";
					}
					currentData += "}";
				} else {
					var currentData = "{\"" + (enrichValueKey + index) + "\":";
					currentData += "\"" + "\",";
					currentData += "\"" + (enrichMandatoryKey + index) + "\":";

					if (blnAllowBlank) {
						currentData += "\"" + "N" + "\"";
					} else {
						currentData += "\"" + "Y" + "\"";
					}
					currentData += "}";
				}
				notesJsonData += currentData;
				if (index != (itemsCount - 1))
					notesJsonData += ",";
			}
			notesJsonData += "]}";
			return notesJsonData;
		} else {
			// console.log("Error Occured : notes json Data is empty");
			return "";
		}
	},
	saveNotesJsonData : function(jsonData) {
		var me = this;
		Ext.Ajax.request({
					url : 'services/btrActivities/'+summaryType+'/savenotes.srvc?' +csrfTokenName + '=' + csrfTokenValue,
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						var reponseData = Ext.decode(response.responseText);
						me.close();
						// console.log("notes post success");
						// TODO check for reponse if failure then show
						// msg
						// accordingly
					},
					failure : function(response) {
						// console.log("Error Occured - while posting
						// data for
						// activity notes");
					}

				});
	},
	showNotes : function() {
		var me = this;
		var jsonId = "{\"identifier\":\"" + me.recordId + "\"}";
		Ext.Ajax.request({
					url : 'services/btrActivities/'+summaryType+'/notes.srvc?'+csrfTokenName + '=' + csrfTokenValue,
					method : 'POST',
					jsonData : Ext.decode(jsonId),
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						me.clearFields();
						me.setNotesPopupDynamicFields(data);
						me.setNotesPopupStaticFields(me.record);
					},
					failure : function(response) {
						// console.log("Error Occured - while fetching
						// account
						// activity notes");
					}

				});
	},
	setNotesPopupStaticFields : function(record) {
		var me = this;
		var strDate = record.get('postingDate') || '';
		var creditUnit = record.get('creditUnit');
		var debitUnit = record.get('debitUnit');
		var txnType = "";
		var field = null, strValue = '';;

		field = me.down('textfield[itemId="date"]');
		if (!Ext.isEmpty(strDate) && !Ext.isEmpty(fieldDate))
			fieldDate.setValue(strDate);

		strValue = me.currentAccountNumber || '';
		field = me.down('textfield[itemId="accountId"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(strValue);
		}

		strValue = me.getTxnAmount(creditUnit, debitUnit);
		field = me.down('textfield[itemId="amount"]');
		if (!Ext.isEmpty(strValue) && !Ext.isEmpty(field)) {
			if (strValue.indexOf("-") == 0) {
				strValue = strValue.substring(1);
				field.setValue("$" + (strValue));
				field.inputEl.addCls('red');
				txnType = "Debit";
			} else {
				field.setValue("$" + strValue);
				if (field.inputEl.hasCls('red'))
					field.inputEl.removeCls('red');
				txnType = "Credit";
			}
		} else if (field) {
			field.setValue('');
		}
		field = me.down('textfield[itemId="type"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(txnType);
		}
	},
	setNotesPopupDynamicFields : function(jsonData) {
		var me = this;
		var dynamicTablePanel = me.down('panel[itemId="dynamicTablePanel"]');
		var attachmentFlag = false;
		var enrichmentLabel = null, enrichmentValue = null, enrichmentMandatory = null, enrichAttachmentFlag = null;
		if (!Ext.isEmpty(dynamicTablePanel)) {
			var dynamicTablePanelItems = dynamicTablePanel.items;
			if (dynamicTablePanelItems.length == 0) {
				var notesData = jsonData.d.notes;
				for (var index = 0; index < notesData.length; index++) {
					enrichmentLabel = notesData[index].enrichmentLabel;
					enrichmentValue = notesData[index].enrichmentValue;
					enrichmentMandatory = notesData[index].enrichmentMandatory;
					enrichAttachmentFlag = notesData[index].enrichAttachmentFlag;
					if (!Ext.isEmpty(enrichmentLabel)
							&& !Ext.isEmpty(enrichmentMandatory)) {
						me.addTextField(enrichmentLabel, enrichmentMandatory,
								dynamicTablePanel, enrichmentValue);
					}
					if (!Ext.isEmpty(enrichAttachmentFlag)) {
						if (enrichAttachmentFlag === 'Y') {
							if (!attachmentFlag)
								attachmentFlag = true;
						}
					}
				}
			}
		}
		if (attachmentFlag)
			me.addAttachmentField(dynamicTablePanel);
	},
	addTextField : function(enrichmentLabel, enrichmentMandatory,
			dynamicTablePanel, enrichmentValue) {
		var itemCount = dynamicTablePanel.items.length;
		var strValue = enrichmentValue || '';
		var blnAllowBlank = enrichmentMandatory === 'Y' ? false : true;
		var strLabelCls = !blnAllowBlank ? 'required' : '';
		dynamicTablePanel.insert((itemCount + 1), {
					xtype : 'textfield',
					name : enrichmentLabel,
					fieldLabel : enrichmentLabel,
					labelPad : 37,
					labelSeparator : "",
					allowBlank : blnAllowBlank,
					value : strValue,
					labelCls : strLabelCls,
					padding : '0 0 0 30'
				});
	},
	addAttachmentField : function(dynamicTablePanel) {
		var me = this;
		var itemCount = dynamicTablePanel.items.length;
		if (!Ext.isEmpty(dynamicTablePanel))
			dynamicTablePanel.insert((itemCount + 1), {
						xtype : 'filefield',
						name : 'uploadFile',
						itemId : 'fileAttachment',
						fieldLabel : getLabel('attachment', 'Attachment'),
						buttonText : getLabel('chooseFile', 'Choose File'),
						labelPad : 37,
						width : 280,
						labelSeparator : "",
						allowBlank : true,
						margin : '0 0 0 30'
					});

	},
	getTxnAmount : function(creditUnit, debitUnit) {
		if (!Ext.isEmpty(creditUnit) && creditUnit != 0) {
			return creditUnit;
		} else if (!Ext.isEmpty(debitUnit) && debitUnit != 0) {
			return debitUnit;
		} else if ((Ext.isEmpty(debitUnit) || debitUnit === 0)
				&& (Ext.isEmpty(creditUnit) || creditUnit === 0)) {
			// console.log("Error Occured.. amount empty");
			return 0
		}
	}
});
