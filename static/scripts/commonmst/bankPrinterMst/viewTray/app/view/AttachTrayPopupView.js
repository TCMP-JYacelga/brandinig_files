Ext.define('GCP.view.AttachTrayPopupView', {
	extend: 'Ext.window.Window',
	xtype: 'attachTrayPopup',
	viewOnlyMode: false,
	autoHeight: true,
	modal: true,
	draggable: false,
	autoWidth: true,
	resizable: false,
	cls: 'non-xn-popup',
	title: getLabel('attachTrayList','Attach Tray List'),
	listeners: {
		resize: function(){
			this.center();
		}
	},
	config:{

	},
	initComponent: function() {
		var me = this;
		var psrData = [
			{
		        'key' : 'I',
		        'value' : getLabel('psrTypeI','Instrument')
		    },{
		        'key' : 'A',
		        'value' : getLabel('psrTypeA','Advice')
		    }];
		if(whtReq == 'Y')
		{
			psrData.push({
			        'key' : 'W',
			        'value' : getLabel('psrTypeW','WHT')
			});
		}
		var psrStore = Ext.create( 'Ext.data.Store',
				{
					fields : ['key', 'value'],
					data : psrData
				});
		me.items = [{
			// row 0 (error messages panel)
			xtype: 'container', 
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				flex: 1,
				html: me.getPopupField('errorPanel')
			}]
		}, {
			// row 1
			xtype: 'container', 
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					layout: 'hbox',
					items: 
					[{
						xtype: 'label',
						width: 100,
						cls: me.viewOnlyMode? 'frmLabel' : 'frmLabel required-lbl-right',
						text: getLabel('viewTrayNo', 'View Tray No'),
					}, {
						xtype: 'textfield',
						width: 140,
						size : 15,
						maxLength: 4,
						enforceMaxLength :true,
						itemId: 'viewTrayNo',
						disabled: me.viewOnlyMode,
						cls: 'xn-form-field',
						fieldCls: me.viewOnlyMode ? 'w9_2 disabled':'w9_2'
					}, {
						xtype: 'label',
						width: 100,
						cls: me.viewOnlyMode? 'frmLabel' : 'frmLabel required-lbl-right',
						text: getLabel('actualTrayNo', 'Actual Tray No'),
					}, {
						xtype: 'textfield',
						width: 140,
						size : 15,
						maxLength: 4,
						enforceMaxLength :true,
						itemId: 'actualTrayNo',
						disabled: me.viewOnlyMode,
						cls: 'xn-form-field',
						fieldCls: me.viewOnlyMode ? 'w9_2 disabled':'w9_2'
					}]
				}]
			}]
		}, {
			// row 2
			xtype: 'container', 
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					layout: 'hbox',
					items: 
					[{
						xtype: 'label',
						width: 100,
						cls: me.viewOnlyMode? 'frmLabel' : 'frmLabel required-lbl-right',
						text: getLabel('psrType', 'PSR Type'),
					}, {
						xtype: 'combobox',
						width: 130,
						itemId: 'psrType',
						cls:'xn-form-field',
						store : psrStore,
						displayField : 'value',
						valueField : 'key',
						editable : false,
						defaultValue: 'I',
						disabled: me.viewOnlyMode,
						cls: 'xn-form-field',
						fieldCls: me.viewOnlyMode?'.w8 disabled':'.w8',
					    listeners: {
					        afterrender: function() {
					          this.setValue(this.defaultValue);    
					        }
					    }
					},
					{
						xtype: 'textfield',
						itemId: 'hiddenRecordKeyNo',
						hidden: true
					}]
				}]
			}]
		}];

		me.bbar = [{
			xtype: 'button',
			text: getLabel('cancel', 'Cancel'),
			itemId: 'btnCancelPartnerAttachment',
			handler: function() {
				me.close();
			}
		}]
		
		if(me.viewOnlyMode === false) {
			me.bbar.push('->');
			me.bbar.push({
				xtype: 'button',
				text: getLabel('submit', 'Submit'),
				itemId: 'btnSubmitPartnerAttachment',
				handler: function() {
					me.fireEvent('submitAttachTray', me);
				}
			});
		}
		me.callParent(arguments);
	},
	getPopupFieldValidationDetails: function() {
		var me = this;
		var objPopupFieldValues = {};
		
		var viewTrayNoField = me.down('textfield[itemId="viewTrayNo"]');
		var actualTrayNoField = me.down('textfield[itemId="actualTrayNo"]');
		var psrTypeDropDown = me.down('combo[itemId="psrType"]');
		var recordKeyNoField = me.down('textfield[itemId="hiddenRecordKeyNo"]');
		
		objPopupFieldValues['viewTrayNo'] = viewTrayNoField.getValue();
		objPopupFieldValues['actualTrayNo'] = actualTrayNoField.getValue();
		objPopupFieldValues['psrType'] = psrTypeDropDown.getValue();
		objPopupFieldValues['mediaId'] = mediaId;
		objPopupFieldValues['recordKeyNo'] = recordKeyNoField.getValue();
		
		var objValidationDetails = me.validatePopupFieldValues(objPopupFieldValues);
		if(!objValidationDetails.isValid) {
			me.paintValidationErrors(objValidationDetails)
		}
		return objValidationDetails;
	},

	paintValidationErrors: function(objValidationDetails) {
		var me = this;
		var errorPanel =  $('#attachParnerBankErrorPanelDiv');
		errorPanel.find('p').remove();
		$.each(objValidationDetails.errorMessages, function(index, item) {
			var errorMessage = $('<p>').text(item);
			errorPanel.append(errorMessage);
		});
		$('#attachParnerBankErrorPanelDiv').show();
		me.doLayout();
	},	
	validatePopupFieldValues: function(objPopupFieldValues) {
		var objValidationDetails = {};
		var blnIsValid = true;
		var errorMessages = [];
		if(Ext.isEmpty(objPopupFieldValues['viewTrayNo'])) {
			blnIsValid = false;
			errorMessages.push(Ext.String.format('{0} is Required.', 'View Tray No'));
		}
		if(Ext.isEmpty(objPopupFieldValues['actualTrayNo'])) {
			blnIsValid = false;
			errorMessages.push(Ext.String.format('{0} is Required.', 'Actual Tray No'));
		}
		if(Ext.isEmpty(objPopupFieldValues['psrType'])) {
			errorMessages.push(Ext.String.format('{0} is Required.', 'PSR Type'));
			blnIsValid = false;
		}
		objValidationDetails.isValid = blnIsValid;
		objValidationDetails.errorMessages = errorMessages;
		objValidationDetails.popupFieldValues = objPopupFieldValues;
		return objValidationDetails;
	},
	getPopupField: function(fieldName) {
		var me = this;
		var strPopupField = '';
		if(fieldName === 'errorPanel') {
			var errorPanelDiv = $('<div id="attachParnerBankErrorPanelDiv">').addClass('ft-error-message').css('display', 'none');
			var errorPanelHeader = $('<span>ERROR:</span>').addClass('ft-bold-font');
			errorPanelDiv.append(errorPanelHeader);
			strPopupField = $(errorPanelDiv).get(0).outerHTML;
		} 
		return strPopupField;
	},
	setPopupFieldValidationDetails: function(popupFieldValues, viewChangesDetails) {
		var me = this;
		var viewTrayNoField = me.down('textfield[itemId="viewTrayNo"]');
		var actualTrayNoField = me.down('textfield[itemId="actualTrayNo"]');
		var psrTypeDropDown = me.down('combo[itemId="psrType"]');
		var recordKeyNoField = me.down('textfield[itemId="hiddenRecordKeyNo"]');
		
		viewTrayNoField.setValue(popupFieldValues.viewTrayNo);
		actualTrayNoField.setValue(popupFieldValues.actualTrayNo);
		psrTypeDropDown.setValue(popupFieldValues.psrType);
		recordKeyNoField.setValue(popupFieldValues.recordKeyNo);
		
		if(pagemode === 'MODIFIEDVIEW' && !Ext.isEmpty(viewChangesDetails)) {
			$.each(viewChangesDetails, function(prop, value) {
				if(prop === 'viewTrayNo') { viewTrayNoField.addClass(value); }
				if(prop === 'actualTrayNo') { actualTrayNoField.addCls(value); }
				if(prop === 'psrType') { psrTypeDropDown.addClass(value); }				
			});
		}
	}
});