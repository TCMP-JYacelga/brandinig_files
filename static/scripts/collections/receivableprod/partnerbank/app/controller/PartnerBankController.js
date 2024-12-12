/**
 * @class GCP.controller.PartnerBankController
 * @extends Ext.app.Controller
 * @author Gaurav Kabra
 */
Ext.define('GCP.controller.PartnerBankController', {
	extend: 'Ext.app.Controller',
	requires: [],
	refs: [{
		ref: 'attachPartnerButton',
		selector: 'partnerBankPanelView toolbar[itemId="btnAttachPartnerToolBar"] button[itemId="btnAttachPartner"]'
	}, {
		ref: 'partnerAutocompleter',
		selector: 'AutoCompleter[itemId="partnerAutocompleter"]'
	}, {
		ref: 'attachPackagePopup',
		selector: 'attachPackagePopup[itemId="attachPartnerPopup"]'
	}, {
		ref: 'partnerDetailsGrid',
		selector: 'partnerBankPanelView smartgrid[itemId="partnerDetailsGrid"]'
	}, {
		ref: 'partnerBankPanelView',
		selector: 'partnerBankPanelView[itemId="partnerBankPanelInst"]'
	}],
	init: function() {
		var me = this;
		$(document).on('handleViewChanges',function() {
				me.refreshGrid();
		});
		me.control({
			'partnerBankPanelView toolbar[itemId="btnAttachPartnerToolBar"] button[itemId="btnAttachPartner"]': {
				click: function() {
					me.showAttachPartnerPopup(false);
				}
			},
			'partnerBankPanelView smartgrid[itemId="partnerDetailsGrid"]': {
				render: function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1, 1, null);
					if(pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') {
						grid.getSelectionModel().setLocked(true);
					}
				},
				gridPageChange: me.handleLoadGridData,
				gridSortChange: me.handleLoadGridData,
				gridRowSelectionChange: me.gridRowSelectionChange,
				handleGridRowIconClick: me.handleGridRowIconClick
			},
			'attachPackagePopup[itemId="attachPartnerPopup"]': {
				submitAttachPartnerBank: function(popup) {
					var popupFieldValidationDetails = popup.getPopupFieldValidationDetails();
					var popupFieldValues = popupFieldValidationDetails.popupFieldValues;
					if(popupFieldValidationDetails.isValid) {
						me.submitAttachPartnerBank(popupFieldValues);
					}
				},
				boxready : function(){
					$("#cboDefaultArrangement").attr('multiple', 'multiple').multiselect({
						multiple:true,
						classes: 'popup_multiselect',
						beforeopen: function() {
							var zindex = $('button.popup_multiselect').closest('.x-window.non-xn-popup').css('z-index');
							$('.popup_multiselect.ui-multiselect-menu').css('z-index', ++zindex);
						}
					});
					$("#cboDefaultArrangement").multiselect("uncheckAll");
					$('#cboDefaultArrangement').multiselect().on('change',function(){
						me.getAttachPackagePopup().loadDefArrangementDropDown($('#cboDefArrangement'));
					});
					$('#cboDefArrangement').on('change',function(){
						var cboText = $('#cboDefArrangement :selected').text();
						me.getAttachPackagePopup().updateLineField(cboText);
					})
				}
			},
			'AutoCompleter[itemId="partnerAutocompleter"]' : {
				select: function(combo) {
					me.enableDisabledLiqPayFlag(combo);
					me.populatePartnerDetails(combo.getValue());
				},
				change: function(combo) {
					if(Ext.isEmpty(combo.getValue())) {
						me.populatePartnerDetails('');
					}
				}
			},
			'partnerBankPanelView toolbar[itemId="dtlsActionBar"] [actionName="discard"]': {
				click: function() {
					me.handleGroupActions('discard');
				}
			}
		});
	},
    enableDisabledLiqPayFlag: function(combo){
        Ext.each(combo.getStore().data.items, function(item) {
            $('input[name="optLiqPaymentFlag"]').attr("disabled",false);
            if(item.data.CODE === combo.getValue() && 'S' === item.data.BANK_TYPE_FLAG) 
            {
            	if($("input[type='radio'][name='optLiqPaymentFlag']").val() == 'Y')
                {
				    $("input[type=radio][name=optLiqPaymentFlag]").prop('checked', true);
                }
			    $('input[name="optLiqPaymentFlag"]').attr("disabled",true);
            }
        });
    },
	handleLoadGridData: function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var productCode = $('#paymentOptionsDIV').find('#productCode').val();
		if(!Ext.isEmpty(productCode)) {
			strUrl = strUrl + '&$productCode=' + productCode + '&$parentRecordKey=' + parentRecordKey;
		}
		grid.loadGridData(strUrl, function() {}, null, false);
	},
	
	gridRowSelectionChange: function(grid, record, recordIndex, arrSelectedRecords, jsonData, strAction) {
		var me = this;
		var disableDiscardAction = true;
		if(arrSelectedRecords.length > 0) disableDiscardAction = false;
		Ext.each(arrSelectedRecords, function(selectedRecord) {
			var requestState = selectedRecord.get('requestState');
			if(requestState.toString() === '1') disableDiscardAction = true;
		});
		var partnerBankPanelView = me.getPartnerBankPanelView();
		var discardActionButton = partnerBankPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
		discardActionButton.setDisabled(disableDiscardAction);
	},
	
	handleGroupActions: function(strAction) {
		var me = this;
		var grid = me.getPartnerDetailsGrid();
		var gridSelectedRecords = grid.getSelectedRecords();
		
		if(strAction === 'discard') {
			var requestData = [];
			var parentIdentifier = $('input[type="hidden"][name="viewState"]').val();
			$.each(gridSelectedRecords, function(index, record) {
				requestData.push({
					serialNo: grid.getStore().indexOf(record) + 1,
					identifier: record.get('identifier'),
					userMessage: parentIdentifier
				});
			});
			
			if(requestData.length) {
				requestData = requestData.sort(function(valA, valB) {
					return valA.serialNo - valB.serialNo
				});
			}
			
			$.ajax({
				url: 'services/receivableProducMstDetail/discardDatails',
				type: "POST",
				dataType: "json",
				contentType: 'application/json',
				data: JSON.stringify(requestData),
				success: function(arrResponse) {
					var isSuccess = false;
					if(arrResponse.length) {
						isSuccess = true;
						$.each(arrResponse, function(index, response) {
							if(response.success !== 'Y') {
								isSuccess = false;
							}
						});
						if(isSuccess) {
							var partnerDetailsGrid = me.getPartnerDetailsGrid();
							var partnerBankPanelView = me.getPartnerBankPanelView();
							var discardActionButton = partnerBankPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
							discardActionButton.setDisabled(true);
							partnerDetailsGrid.refreshData();
						}
					}
				},
				error: function(response) {
				}
			});
		}
	},
	
	populatePartnerDetails: function(partnerBank) {
		var me = this;
		var currency = $('#multiCcyCode').val();
		
		if(Ext.isEmpty(partnerBank)) {
			var cboLine = $('#lineDiv').find('#cboLine');
			me.getAttachPackagePopup().loadComboOptions(cboLine, []);
		} else {
			$.ajax({
				url: 'services/productMst/patnerBankDetailsSeek.json',
				type: "POST",
				dataType: "json",
				data: { partnerBank: partnerBank, currency: currency },
				success: function(response) {
					var lineCode = '';
					var lineDescription = '';
					if(response && response.line_code) {
						lineCode = response.line_code;
					}
					if(response && response.line_description) {
						lineDescription = response.line_description;
					}
					var cboLine = $('#lineDiv').find('#cboLine');
					var cboLineOptions = [];
					if(!Ext.isEmpty(lineCode)) {
						cboLineOptions.push({code: lineCode, desc: lineDescription});
					}
					me.getAttachPackagePopup().loadComboOptions(cboLine, cboLineOptions);
				},
				error: function(response) {
				}
			});
		}
	},
	
	submitAttachPartnerBank: function(popupFieldValues) {
		var me = this;
		var requestData = popupFieldValues;
		requestData.parentRecordKey = parentRecordKey;
		$.ajax({
			url: 'services/receivableProducMstDetail/saveDatails.json',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(requestData),
			success: function(response) {
				if(response && response.success) {
					var attachPackagePopup = me.getAttachPackagePopup();
					var partnerDetailsGrid = me.getPartnerDetailsGrid();
					if(response.success === 'Y') {
						attachPackagePopup.close();
						partnerDetailsGrid.refreshData();
					} else if(response.success === 'N') {
						var errorMessages = []
						$.each(response.errors, function(index, error) {
							if(error.code != 'VAL-0001') {
								errorMessages.push(error.errorMessage);
							}
						});
						if(errorMessages.length) {
							attachPackagePopup.paintValidationErrors({errorMessages: errorMessages});
						}
					}
					
				}
			},
			error: function(response) {
				
			}
		});
	},
	
	showAttachPartnerPopup: function(viewOnlyMode, record) {
		var attachPartnerPopup = Ext.create('GCP.view.AttachPartnerPopupView', {
			itemId: 'attachPartnerPopup',
			viewOnlyMode: viewOnlyMode,
			selectedRecord: record || null
		});
		attachPartnerPopup.show();
		return attachPartnerPopup;
	},
	
	handleGridRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
		var me = this;
		var actionName = btn.itemId;
		var viewOnlyMode = (actionName === 'btnView') ? true : false;
		var attachPartnerPopup = me.showAttachPartnerPopup(viewOnlyMode,record);
		
		var popupFieldValues = {
			partnerBank: record.get('partnerBank'),
			partnerBankDesc: record.get('patnerBankDesc'),
			line: record.get('line'),
			lineDesc: record.get('lineDesc'),
			arrangment: record.get('arrangment'),
			paymentDays: record.get('paymentDays'),
			holidayAction: record.get('holidayAction'),
			scheduleFormat: record.get('scheduleFormat'),
			scheduleSplitFlag: record.get('scheduleSplitFlag'),
			nostroAccounting: record.get('nostroAccounting'),
			liqPaymentFlag: record.get('liqPaymentFlag'),
			recordKeyNo: record.get('recordKeyNo'),
			requestState: record.get('requestState'),
			profileId: record.get('profileId'),
			defArrangementProfileId : record.get('defArrangementProfileId')
		};
		
		if(pagemode === 'MODIFIEDVIEW' && blnViewOld==='TRUE') {
			var stdoldNewValueList = gridview.getStore().proxy.reader.rawData.d.stdoldNewValueList;
			var oldNewValueData = {};
			var viewChangesDetails = {oldDeletedValues: {}, oldValues: {}};
			Ext.each(stdoldNewValueList, function(item) {
				if(item.recordDetails.recordKeyNo === record.get('recordKeyNo')) {
					oldNewValueData = item;
				}
			});
			if(!Ext.isEmpty(oldNewValueData.newList)) {
				for(key in oldNewValueData.newList) {
					viewChangesDetails[key] = 'newFieldGridValue';
				}
			}
			if(!Ext.isEmpty(oldNewValueData.modifiedList)) {
				for(key in oldNewValueData.modifiedList) {
					if(key !== 'holidayAction' && key !== 'paymentDays' && key !== 'scheduleSplitFlag' && key !== 'liqPaymentFlag')
					{
						viewChangesDetails[key] = 'modifiedFieldValue';
					}
					if(key === 'profileId') {
						viewChangesDetails.oldValues[key] = oldNewValueData.oldValuesList[key];
					}
				}
			}
			if(!Ext.isEmpty(oldNewValueData.oldValuesList)) {
				for(key in oldNewValueData.oldValuesList) {
					if(key === 'holidayAction' || key === 'paymentDays' || key === 'scheduleSplitFlag' || key === 'liqPaymentFlag'){
						viewChangesDetails[key] = 'deletedFieldValue';
						viewChangesDetails.oldDeletedValues[key] = oldNewValueData.oldValuesList[key];
					}
				}
			}
			if(!Ext.isEmpty(oldNewValueData.deletedList)) {
				for(key in oldNewValueData.deletedList) {
					viewChangesDetails[key] = 'deletedFieldValue';
					viewChangesDetails.oldDeletedValues[key] = oldNewValueData.deletedList[key];
				}
			}
		}
		attachPartnerPopup.setPopupFieldValidationDetails(popupFieldValues, viewChangesDetails);
	},
	
	refreshGrid: function()
	{
		var me = this;
		var partnerDetailsGrid = me.getPartnerDetailsGrid();
		partnerDetailsGrid.refreshData();
	}

});