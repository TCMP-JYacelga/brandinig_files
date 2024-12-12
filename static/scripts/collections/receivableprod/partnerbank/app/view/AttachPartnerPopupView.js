/**
 * @class PartnerBankPanelView
 * @extends Ext.window.Window
 * @author Gaurav Kabra
 */
Ext.define('GCP.view.AttachPartnerPopupView', {
	extend: 'Ext.window.Window',
	xtype: 'attachPackagePopup',
	viewOnlyMode: false,
	requires: ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.AutoCompleter'],
	autoHeight: true,
	modal: true,
	draggable: false,
	width: 650,
	resizable: false,
	cls: 'non-xn-popup',
	title: getLabel('attachPartnerBank','Attach Partner Bank'),
	listeners: {
		resize: function(){
			this.center();
		}
	},
	config:{
		selectedArrangements:[]
	},
	initComponent: function() {
		var me = this;
		
		var partnerBankAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls: 'xn-form-text xn-suggestion-box',
			itemId: 'partnerAutocompleter',
			hideLabel: true,
			disabled: me.viewOnlyMode,
			emptyText: getLabel('searchPartnerBank','Search Partner Bank'),
			cfgUrl: 'services/productMst/partnerBankSeek.json',
			width: 160,
			cfgRecordCount: -1,
			cfgDataNode1: 'DESCRIPTION',
			cfgDataNode2: 'BANK_TYPE_FLAG',
			cfgKeyNode: 'CODE',
			enableQueryParam: false,
			cfgProxyMethodType: 'POST',
			fitToParent: true,
			listeners: {
				render: function(autocompleter) {
					Ext.create('Ext.tip.ToolTip', {
						target: autocompleter.getEl(),
						listeners: {
							beforeshow: function(tip) {
								if(Ext.isEmpty(partnerBankAutocompleter.getRawValue())) {
									return false;
								} else {
									tip.update(partnerBankAutocompleter.getRawValue());
								}
							}
						}
					});
				}
			}
		});
		
		var scheduleFormatAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls: 'xn-form-text xn-suggestion-box',
			itemId: 'scheduleFormatAutocompleter',
			hideLabel: true,
			disabled: me.viewOnlyMode,
			emptyText: getLabel('searchscheduleFormat','Search Schedule Format'),
			cfgUrl: 'services/productMst/sheduleFormatSeek.json',
			cfgRecordCount: -1,
			cfgDataNode1: 'DESCRIPTION',
			cfgKeyNode: 'CODE',
			enableQueryParam: false,
			cfgProxyMethodType: 'POST',
			fitToParent: true,
			listeners: {
				render: function(autocompleter) {
					Ext.create('Ext.tip.ToolTip', {
						target: autocompleter.getEl(),
						listeners: {
							beforeshow: function(tip) {
								if(Ext.isEmpty(scheduleFormatAutocompleter.getRawValue())) {
									return false;
								} else {
									tip.update(scheduleFormatAutocompleter.getRawValue());
								}
							}
						}
					});
				}
			}
		});
		
		me.items = [{
			xtype: 'container', // row 0 (error messages panel)
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				flex: 1,
				html: me.getPopupField('errorPanel')
			}]
		}, {
			xtype: 'container', // row 1
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					items: [{
						xtype: 'label',
						padding: '4 0 0 0',
						cls: 'required-lbl-right',
						text: getLabel('partnerBank', 'Partner Bank'),
						width: 92
					}, partnerBankAutocompleter]
				}, {
					xtype: 'container',
					layout: 'hbox',
					flex: 0.5,
					items: [{
						xtype: 'label',
						id:'lblLineField',
						padding: '4 0 0 0',
						cls: 'required-lbl-right',
						text: getLabel('line', 'Line'),
						width: 40
					}, {
						xtype: 'container',
						width: 180,
						html: me.getPopupField('line')
					}, {
						xtype: 'textfield',
						itemId: 'hiddenRecordKeyNo',
						hidden: true
					}]
				}]
			}]
		}, {
			xtype: 'container', // row 2
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					layout: 'hbox',
					flex: 0.5,
					items: [{
						xtype: 'label',
						padding: '4 0 0 0',
						cls: 'required-lbl-right',
						text: getLabel('defaultArrangement', 'Arrangement'),
						width: 92
					}, {
						xtype: 'container',
						width: 180,
						html: me.getPopupField('defaultArrangement')
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					flex: 0.5,
					items: [{
						xtype: 'label',
						padding: '4 0 0 0',
						cls: 'required-lbl-right',
						text: getLabel('defArrangement', 'Default Arrangement')
					}, {
						xtype: 'container',
						width: 160,
						html: me.getPopupField('defPartnerArrangement')
					}]
				}]
			}]
		}, {
			xtype: 'container', // row 3
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					items: [{
						xtype: 'label',
						text: getLabel('paymentDays', 'Payment Days'),
						width: 100
					}, {
						xtype: 'container',
						width: 160,
						html: me.getPopupField('paymentDays')
					}]
				}, {
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					items: [{
						xtype: 'label',
						text: getLabel('holidayAction', 'Holiday Action'),
						width: 100
					}, {
						xtype: 'container',
						html: me.getPopupField('holidayAction')
					}]
				}]
			}]
		
		}, {
			xtype: 'container', // row 4
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					items: [{
						xtype: 'label',
						padding: '4 0 0 0',
						text: getLabel('scheduleFormat', 'Schedule Format'),
						width: 100
					}, scheduleFormatAutocompleter]
				}, {
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					items: [{
						xtype: 'label',
						text: getLabel('scheduleSplitFlag', 'Schedule Split Flag'),
						width: 120
					}, {
						xtype: 'container',
						html: me.getPopupField('scheduleSplitFlag')
					}]
				}]
			}]
		}, {
			xtype: 'container', // row 5
			cls: 'ft-padding-bottom',
			items: [{
				xtype: 'container',
				layout: 'hbox',
				cls: 'ft-padding-bottom',
				items: [{
					xtype: 'container',
					flex: 0.8,
					layout: 'hbox',
					hidden : true,
					items: [{
						xtype: 'label',
						padding: '4 0 0 0',
						text: getLabel('nostroAccounting', 'Nostro Accounting'),
						width: 110
					}, {
						xtype: 'container',
						width: 150,
						html: me.getPopupField('nostroAccounting')
					}]
				} ,{
					xtype: 'container',
					flex: 0.5,
					layout: 'hbox',
					hidden : false,
					items: [{
						xtype: 'label',
						text: getLabel('liqPaymentFlag', 'Liqn. Payment Flag'),
						width: 120
					}, {
						xtype: 'container',
						html: me.getPopupField('liqPaymentFlag')
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
					me.fireEvent('submitAttachPartnerBank', me);
				}
			});
		}
		
		me.callParent(arguments);
	},
	
	getPopupFieldValidationDetails: function() {
		var me = this;
		var objPopupFieldValues = {};
		var productCodeField = $('#paymentOptionsDIV').find('#productCode');
		var partnerBankAutoField = me.down('AutoCompleter[itemId="partnerAutocompleter"]');
		var lineField = $('#lineDiv').find('#cboLine');
		var defaultArrangementField = $('#defaultArrangementDiv').find('#cboDefaultArrangement');
		var optPaymentDaysField = $('#payDaysDiv').find("input[name='optPayDays']:checked");
		var optHolidayField = $('#holidayactionDiv').find('input[name="optHoliday"]:checked');
		var scheduleFormatAutoField = me.down('AutoCompleter[itemId="scheduleFormatAutocompleter"]');
		var schedulesplitflagField = $('#schedulesplitflagDiv').find('input[name="optScheduleSplitFlag"]:checked');
		var nostroAccountingField = $('#nostroAccountingDiv').find('#cboNostroAccounting');
		var liqpaymentflagField = $('#liqpaymentflagDiv').find('input[name="optLiqPaymentFlag"]:checked');
		var recordKeyNoField = me.down('textfield[itemId="hiddenRecordKeyNo"]');
		var defArrangementDropDown = $('#defArrangementDiv').find('#cboDefArrangement');
		var arrangementList = [];
		var arrangementCodes = [];
        var profileIds = [];
        var lineDetails = {line: '', lineDesc: ''};
		$(defaultArrangementField).find('option:selected').each(function() {
			var selectedOption = $(this);
			arrangementCodes.push(selectedOption.data('arrangementcode'));
			profileIds.push(selectedOption.val());
			var arrangementListItem = selectedOption.val() + ':' + selectedOption.data('arrangementcode');
			arrangementList.push(arrangementListItem);
		});
		lineDetails.line = lineField.val();
		lineDetails.lineDesc = (Ext.isEmpty(lineField.val())) ? '' : lineField.find('option:selected').text();
		objPopupFieldValues['productCode'] = productCodeField.val();
		objPopupFieldValues['partnerBank'] = partnerBankAutoField.getValue();
		objPopupFieldValues['patnerBankDesc'] = partnerBankAutoField.getRawValue();
		objPopupFieldValues['arrangment'] = arrangementCodes.join('|');
		objPopupFieldValues['profileId'] = profileIds.join(',');
		objPopupFieldValues['line'] = lineDetails.line;
		objPopupFieldValues['lineDesc'] = lineDetails.lineDesc;
		objPopupFieldValues['paymentDays'] = optPaymentDaysField.val();
		objPopupFieldValues['holidayAction'] = optHolidayField.val();
		objPopupFieldValues['scheduleFormat'] = scheduleFormatAutoField.getValue();
		objPopupFieldValues['scheduleSplitFlag'] = schedulesplitflagField.val();
		objPopupFieldValues['nostroAccounting'] = 'C';
		objPopupFieldValues['liqPaymentFlag'] = liqpaymentflagField.val();
		objPopupFieldValues['recordKeyNo'] = recordKeyNoField.getValue();
		objPopupFieldValues['listArrangement'] = arrangementList.join('|');
		objPopupFieldValues['defArrangementProfileId'] = defArrangementDropDown.val();
		objPopupFieldValues['defArrangementCode'] = defArrangementDropDown.find('option:selected').data('arrangementcode');
		var objValidationDetails = me.validatePopupFieldValues(objPopupFieldValues)
		
		if(!objValidationDetails.isValid) {
			me.paintValidationErrors(objValidationDetails)
		}
		
		return objValidationDetails;
	},
	
	setPopupFieldValidationDetails: function(popupFieldValues, viewChangesDetails) {
		var me = this;
		var partnerBankAutoField = me.down('AutoCompleter[itemId="partnerAutocompleter"]');
		var lineField = $('#lineDiv').find('#cboLine');
		var defaultArrangementField = $('#defaultArrangementDiv').find('#cboDefaultArrangement');
		var defArrangementDropDown = $('#defArrangementDiv').find('#cboDefArrangement');
		var optPaymentDaysField = $('#payDaysDiv').find("input[name='optPayDays']");
		var optHolidayField = $('#holidayactionDiv').find('input[name="optHoliday"]');
		var scheduleFormatAutoField = me.down('AutoCompleter[itemId="scheduleFormatAutocompleter"]');
		var schedulesplitflagField = $('#schedulesplitflagDiv').find('input[name="optScheduleSplitFlag"]');
		var nostroAccountingField = $('#nostroAccountingDiv').find('#cboNostroAccounting');
		var liqpaymentflagField = $('#liqpaymentflagDiv').find('input[name="optLiqPaymentFlag"]');
		var recordKeyNoField = me.down('textfield[itemId="hiddenRecordKeyNo"]');
		
		optPaymentDaysField = optPaymentDaysField.filter('input[value="' + popupFieldValues.paymentDays + '"]');
		optHolidayField = optHolidayField.filter('input[value="' + popupFieldValues.holidayAction + '"]');
		schedulesplitflagField = schedulesplitflagField.filter('input[value="' + popupFieldValues.scheduleSplitFlag + '"]');
		liqpaymentflagField = liqpaymentflagField.filter('input[value="' + popupFieldValues.liqPaymentFlag + '"]');
		
		partnerBankAutoField.getStore().load();
		partnerBankAutoField.setValue(popupFieldValues.partnerBank);
		if(!me.viewOnlyMode){
			me.enableDisabledLiqPayFlag(popupFieldValues.partnerBank);
		}
		if(Ext.isEmpty(popupFieldValues.line)) {
			partnerBankAutoField.fireEvent('select', partnerBankAutoField);
		} else {
			if(me.viewOnlyMode){
				lineField.val(popupFieldValues.lineDesc);
			}else{
				me.loadComboOptions(lineField, [{code: popupFieldValues.line, desc: popupFieldValues.lineDesc}]);
				lineField.val(popupFieldValues.line);
			}
		}
		var dataarray = popupFieldValues.profileId.split(",");
		var i = 0;
		var size = dataarray.length;
		for(i; i < size; i++)
		{
			$('#cboDefaultArrangement').multiselect("widget").find(":checkbox[value='"+dataarray[i]+"']").attr("checked","checked");
			$('#cboDefaultArrangement option[value="'+ dataarray[i]+'"]').attr("selected", "selected");
		}
		$('#cboDefaultArrangement').multiselect("refresh");
		if(me.viewOnlyMode){
			var defPartnerArrangementDesc = '';
			$.each(defaultArrangements, function(index,item){
				if(item.code === me.selectedRecord.get('defArrangementProfileId')){
					defPartnerArrangementDesc = item.desc;
				}
			});
			defArrangementDropDown.val(defPartnerArrangementDesc).attr('title',defPartnerArrangementDesc);
		}else{
			me.loadDefArrangementDropDown(defArrangementDropDown);
			defArrangementDropDown.val(popupFieldValues.defArrangementProfileId);
			defArrangementDropDown.attr('title',defArrangementDropDown.find('option:selected').text());
		}
		var defPartnerArrangementDesc = '';
		$.each(defaultArrangements, function(index,item){
			if(item.code === me.selectedRecord.get('defArrangementProfileId')){
				defPartnerArrangementDesc = item.desc;
			}
		});		
		me.updateLineField(defPartnerArrangementDesc);
		optPaymentDaysField.prop('checked', true);
		optHolidayField.prop('checked', true);
		scheduleFormatAutoField.getStore().load();
		scheduleFormatAutoField.setValue(popupFieldValues.scheduleFormat);
		schedulesplitflagField.prop('checked', true);
		if(me.viewOnlyMode){
			$.each(nastroAccounting,function(i,item){
				if(popupFieldValues.nostroAccounting === item.code){
					nostroAccountingField.val(item.desc);
					nostroAccountingField.prop('title',item.desc);
				}
				});
		}else{
			nostroAccountingField.val(popupFieldValues.nostroAccounting);
		}
		liqpaymentflagField.prop('checked', true);
		recordKeyNoField.setValue(popupFieldValues.recordKeyNo);
		var requestState = popupFieldValues.requestState;
		if(requestState.toString() !== '0') {
			partnerBankAutoField.setDisabled(true);
		}
		if(pagemode === 'MODIFIEDVIEW' && blnViewOld==='TRUE' && !Ext.isEmpty(viewChangesDetails)) {
			$.each(viewChangesDetails, function(prop, value) {
				if(prop === 'defArrangementProfileId') { defArrangementDropDown.addClass(value); }
				if(prop === 'partnerBank') { partnerBankAutoField.addCls(value); }
				if(prop === 'line') { lineField.addClass(value); }
				if(prop === 'arrangment') { defaultArrangementField.addClass(value); }
				if(prop === 'paymentDays') 
				{ 
					if(value != 'newFieldGridValue')
					{
						if(value === 'deletedFieldValue')
						{
							var paymentField = $('#payDaysDiv').find('input[name="optPayDays"]');
							paymentField = paymentField.filter('input[value="' + viewChangesDetails.oldDeletedValues.paymentDays + '"]')
							$('#paymentDays' + paymentField.val()).addClass(value);
						}
						else
							$('#paymentDays' + optPaymentDaysField.val()).addClass(value); 
					}
				}
				if(prop === 'holidayAction') 
				{
					if(value != 'newFieldGridValue')
					{
						if(value === 'deletedFieldValue')
						{
							var holidayField = $('#holidayactionDiv').find('input[name="optHoliday"]');
							holidayField = holidayField.filter('input[value="' + viewChangesDetails.oldDeletedValues.holidayAction + '"]')
							$('#holidayAction' + holidayField.val()).addClass(value);
						}
						else
							$('#holidayAction' + optHolidayField.val()).addClass(value); 
					}
				}
				if(prop === 'scheduleFormat') { scheduleFormatAutoField.addCls(value); }
				if(prop === 'scheduleSplitFlag') 
				{
					if(value != 'newFieldGridValue')
					{
						if(value === 'deletedFieldValue')
						{
							var schedulesField = $('#schedulesplitflagDiv').find('input[name="optScheduleSplitFlag"]');
							schedulesField = schedulesField.filter('input[value="' + viewChangesDetails.oldDeletedValues.scheduleSplitFlag + '"]')
							$('#scheduleSplitFlag' + schedulesField.val()).addClass(value);
						}
						else
							$('#scheduleSplitFlag' + schedulesplitflagField.val()).addClass(value); 
					}
				}
				
				if(prop === 'nostroAccounting') { nostroAccountingField.addClass(value); }
				if(prop === 'liqPaymentFlag') 
				{
					if(value != 'newFieldGridValue')
					{
						if(value === 'deletedFieldValue')
						{
							var schedulesField = $('#liqpaymentflagDiv').find('input[name="optLiqPaymentFlag"]');
							schedulesField = schedulesField.filter('input[value="' + viewChangesDetails.oldDeletedValues.liqPaymentFlag + '"]')
							$('#liqPaymentFlag' + schedulesField.val()).addClass(value);
						}
						else
							$('#liqPaymentFlag' + liqpaymentflagField.val()).addClass(value); 
					}
				}
				if(prop === 'profileId') {
					var arrNewValues = popupFieldValues.profileId.split(',');
					var objProfileIdViewChangeClasses = {};
					var strOldProfiles = viewChangesDetails.oldValues[prop] || '';
					var arrOldValues = strOldProfiles.split(',');
					var multiselectMenu = $('.ui-multiselect-menu.popup_multiselect');
					
					$.each(arrNewValues, function(index, item) {
						objProfileIdViewChangeClasses[item] = 'newFieldGridValue'; 
					});
					$.each(arrOldValues, function(index, item) {
						if(objProfileIdViewChangeClasses.hasOwnProperty(item)) {
							objProfileIdViewChangeClasses[item] = '';
						} else {
							objProfileIdViewChangeClasses[item] = 'deletedFieldValue'
						}
					});
					
					$.each(objProfileIdViewChangeClasses, function(profileIdValue, clsName) {
						var multiselectMenuItem = multiselectMenu.find('input[value="' + profileIdValue + '"]').closest('label');
						multiselectMenuItem.addClass(clsName);
					});
				}
				
				if(value === 'deletedFieldValue') {
					var fieldValue = viewChangesDetails.oldDeletedValues[prop];
					if(prop === 'partnerBank') { partnerBankAutoField.setValue(fieldValue); }
					if(prop === 'line') { lineDescField.setValue(fieldValue); }
					if(prop === 'arrangment') { defaultArrangementField.val(fieldValue); }
					if(prop === 'scheduleFormat') { scheduleFormatAutoField.setValue(fieldValue); }
					if(prop === 'nostroAccounting') { nostroAccountingField.val(fieldValue); }
				}
				
			});
		}
		
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
		
		if(Ext.isEmpty(objPopupFieldValues['partnerBank'])) {
			blnIsValid = false;
			errorMessages.push(Ext.String.format('{0} is Required.', 'Partner Bank'));
		}
		if(Ext.isEmpty(objPopupFieldValues['line']) && objPopupFieldValues['defArrangementCode'][0] == "D") {
			blnIsValid = false;
			errorMessages.push(Ext.String.format('{0} is Required.', 'Line'));
		}
		if(Ext.isEmpty(objPopupFieldValues['listArrangement'])) {
			errorMessages.push(Ext.String.format('{0} is Required.', 'Arrangement'));
			blnIsValid = false;
		}
		if(Ext.isEmpty(objPopupFieldValues['defArrangementCode']) || Ext.isEmpty(objPopupFieldValues['defArrangementProfileId'])) {
			errorMessages.push(Ext.String.format('{0} is Required.', 'Default Arrangement'));
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
		} else if(fieldName === 'line') {
			if(me.viewOnlyMode){
				var cboLine = $('<input id="cboLine" disabled="disabled" title="'+me.selectedRecord.get('lineDesc')+'">').val(me.selectedRecord.get('lineDesc')).css('width', '100%');
				var lineDiv = $('<div id="lineDiv">');
				lineDiv.append(cboLine);
				strPopupField = $(lineDiv).get(0).outerHTML;
			}else{
				var cboLine = $('<select id="cboLine" class="rounded">').prop('disabled', me.viewOnlyMode).css('width', '100%');
				var lineDiv = $('<div id="lineDiv">');
				me.loadComboOptions(cboLine);
				lineDiv.append(cboLine);
				strPopupField = $(lineDiv).get(0).outerHTML;
			}
		} else if(fieldName === 'defaultArrangement') {
			var cboDefaultArrangement = $('<select id="cboDefaultArrangement"  class="rounded">').css('width', '100%');
			var defaultArrangementDiv = $('<div id="defaultArrangementDiv">');
			$.each(defaultArrangements, function(index, item) {
				$('<option>').val(item.code).attr('data-arrangementcode', item.arrangementcode).text(item.desc).appendTo(cboDefaultArrangement).prop('disabled', me.viewOnlyMode);
			});
			defaultArrangementDiv.append(cboDefaultArrangement);
			strPopupField = $(defaultArrangementDiv).get(0).outerHTML;
		} else if(fieldName === 'paymentDays') {
			var optPayDaysW = $('<input>').attr('type', 'radio').attr('name', "optPayDays").attr('value', 'W').attr('checked', 'checked').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblPayDaysW = $('<label>').attr('id', 'paymentDaysW').text('Working').addClass('label-font-normal').css('margin-right', '5px');
			var optPayDaysE = $('<input>').attr('type', 'radio').attr('name', "optPayDays").attr('value', 'E').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblPayDaysE = $('<label>').attr('id', 'paymentDaysE').text('Elapsed').addClass('label-font-normal').css('margin-right', '5px');
			var payDaysDiv = $('<div id="payDaysDiv">');
			payDaysDiv.append(optPayDaysW).append(lblPayDaysW).append(optPayDaysE).append(lblPayDaysE);
			strPopupField = $(payDaysDiv).get(0).outerHTML;
		} else if(fieldName === 'holidayAction') {
			var optHolidayC = $('<input>').attr('type', 'radio').attr('name', "optHoliday").attr('value', 'C').attr('checked', 'checked').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblHolidayC = $('<label>').attr('id', 'holidayActionC').text('Clearing').addClass('label-font-normal').css('margin-right', '5px');
			var optHolidayP = $('<input>').attr('type', 'radio').attr('name', "optHoliday").attr('value', 'P').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblHolidayP = $('<label>').attr('id', 'holidayActionP').text('Payment').addClass('label-font-normal').css('margin-right', '5px');
			var holidayDiv = $('<div id="holidayactionDiv">');
			holidayDiv.append(optHolidayC).append(lblHolidayC).append(optHolidayP).append(lblHolidayP);
			strPopupField = $(holidayDiv).get(0).outerHTML;
		} else if(fieldName === 'scheduleSplitFlag') {
			var optScheduleSplitFlagY = $('<input>').attr('type', 'radio').attr('name', "optScheduleSplitFlag").attr('value', 'Y').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblScheduleSplitFlagY = $('<label>').attr('id', 'scheduleSplitFlagY').text('Yes').addClass('label-font-normal').css('margin-right', '5px');
			var optScheduleSplitFlagN = $('<input>').attr('type', 'radio').attr('name', "optScheduleSplitFlag").attr('value', 'N').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin').attr('checked', 'checked');
			var lblScheduleSplitFlagN = $('<label>').attr('id', 'scheduleSplitFlagN').text('No').addClass('label-font-normal').css('margin-right', '5px');
			var scheduleSplitFlagDiv = $('<div id="schedulesplitflagDiv">');
			scheduleSplitFlagDiv.append(optScheduleSplitFlagY).append(lblScheduleSplitFlagY).append(optScheduleSplitFlagN).append(lblScheduleSplitFlagN);
			strPopupField = $(scheduleSplitFlagDiv).get(0).outerHTML;
		} else if(fieldName === 'nostroAccounting') {
			if(me.viewOnlyMode){
				var cboNostroAccounting = $('<input id="cboNostroAccounting" disabled="disabled" title="'+me.selectedRecord.get('nostroAccounting')+'">').css('width', '100%');
				var nostroAccountingDiv = $('<div id="nostroAccountingDiv">');
				nostroAccountingDiv.append(cboNostroAccounting);
				strPopupField = $(nostroAccountingDiv).get(0).outerHTML;
			}else{
				var cboNostroAccounting = $('<select id="cboNostroAccounting"  class="rounded">').prop('disabled', me.viewOnlyMode).css('width', '100%');
				var nostroAccountingDiv = $('<div id="nostroAccountingDiv">');
				$('<option>').val('').text('Select').appendTo(cboNostroAccounting);
				$.each(nastroAccounting, function(index, item) {
					$('<option>').val(item.code).text(item.desc).appendTo(cboNostroAccounting);
				});
				nostroAccountingDiv.append(cboNostroAccounting);
				strPopupField = $(nostroAccountingDiv).get(0).outerHTML;
			}
		} else if(fieldName === 'liqPaymentFlag') {
			var optLiqPaymentFlagY = $('<input>').attr('type', 'radio').attr('name', "optLiqPaymentFlag").attr('value', 'Y').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin');
			var lblLiqPaymentFlagY = $('<label>').attr('id', 'liqPaymentFlagY').text('Yes').addClass('label-font-normal').css('margin-right', '5px');
			var optLiqPaymentFlagN = $('<input>').attr('type', 'radio').attr('name', "optLiqPaymentFlag").attr('value', 'N').prop('disabled', me.viewOnlyMode).addClass('radioSmall ux_no-margin').attr('checked', 'checked');
			var lblLiqPaymentFlagN = $('<label>').attr('id', 'liqPaymentFlagN').text('No').addClass('label-font-normal').css('margin-right', '5px');
			var liqPaymentFlagDiv = $('<div id="liqpaymentflagDiv">');
			liqPaymentFlagDiv.append(optLiqPaymentFlagY).append(lblLiqPaymentFlagY).append(optLiqPaymentFlagN).append(lblLiqPaymentFlagN);
			strPopupField = $(liqPaymentFlagDiv).get(0).outerHTML;
		} else if(fieldName === 'defPartnerArrangement') {
			if(me.viewOnlyMode){
				var value = '';
				$.each(defaultArrangements, function(index,item){
					if(item.code === me.selectedRecord.get('defArrangementProfileId')){
						value = item.desc;
					}
				});
				var cboDefArrangement = $('<input id="cboDefArrangement" disabled="disabled" title="'+value+'">').val(value).css('width', '100%');
				var defArrangementDiv = $('<div id="defArrangementDiv">');
				defArrangementDiv.append(cboDefArrangement);
				strPopupField = $(defArrangementDiv).get(0).outerHTML;
			}else{
				var cboDefArrangement = $('<select id="cboDefArrangement"  class="rounded">').css('width', '100%');
				var defArrangementDiv = $('<div id="defArrangementDiv">');
				me.loadDefArrangementDropDown(cboDefArrangement);
				defArrangementDiv.append(cboDefArrangement);
				strPopupField = $(defArrangementDiv).get(0).outerHTML;
			}
		}
		return strPopupField;
	},
	
	loadComboOptions: function(cboElement, cboOptions) {
		cboOptions = cboOptions || [];
		cboElement.empty();
		$.each([{code: '', desc: 'Select'}].concat(cboOptions), function(index, cboOption) {
			$('<option title="'+cboOption.desc+'">').val(cboOption.code).text(cboOption.desc).appendTo(cboElement);
		});
		cboElement.val('');
		return cboElement;
	},
	
	loadDefArrangementDropDown: function(cboDefArrangement){
		var me = this;
		var preValue = cboDefArrangement.val();
		cboDefArrangement.empty();
		var defaultArrangementField = $('#defaultArrangementDiv').find('#cboDefaultArrangement');
		me.selectedArrangements = [];
		$(defaultArrangementField).find('option:selected').each(function() {
			var selectedOption = $(this);
			me.selectedArrangements.push({
				code: selectedOption.val(),
				desc : selectedOption.text(),
				arrangementcode: selectedOption.data('arrangementcode')});
		});
		$.each([{code: '', desc: 'Select',arrangementcode: ''}].concat(me.selectedArrangements), function(index, item) {
			$('<option>').val(item.code).attr('data-arrangementcode', item.arrangementcode).text(item.desc).appendTo(cboDefArrangement).prop('disabled', me.viewOnlyMode);
		});
		cboDefArrangement.val(preValue);
	},
	updateLineField: function(value){
            if (value != '') {
				var arrangeVal = value.split('-')[1];
				var arrange = '';
				if(arrangeVal != '' && arrangeVal != undefined)
					arrange = arrangeVal.trim();
                var arrangement = arrange.split('+') || arrange.split('-');
                if (arrangement[0] == "D") {
                   $('#lblLineField').addClass('required-lbl-right');
                }
                else{
                   $('#lblLineField').removeClass('required-lbl-right');
                }
            }
            else {
                $('#lblLineField').removeClass('required-lbl-right');
            }		
	},
	enableDisabledLiqPayFlag: function(partnerBank) {
		if(!Ext.isEmpty(partnerBank)) {
			$.ajax({
				url: 'services/productMst/fetchPatnerBankFlag.json',
				type: "POST",
				dataType: "json",
				data: { partnerBank: partnerBank},
				success: function(response) {
					$('input[name="optLiqPaymentFlag"]').attr("disabled",false);
					if('S' === response.BANK_TYPE_FLAG)
					{
						if($("input[type='radio'][name='optLiqPaymentFlag']").val() == 'Y')
						{
							$("input[type=radio][name=optLiqPaymentFlag]").prop('checked', true);
						}
						$('input[name="optLiqPaymentFlag"]').attr("disabled",true);
					}
				},
				error: function(response) {
				}
			});
		}
	}
});