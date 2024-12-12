Ext.define('GCP.controller.TrayController', {
	extend: 'Ext.app.Controller',
	requires: [],
	refs: [{
		ref: 'attachTrayPopup',
		selector: 'attachTrayPopup[itemId="attachTrayPopup"]'
	},{
		ref: 'trayDetailsGrid',
		selector: 'trayPanelView smartgrid[itemId="trayDetailsGrid"]'
	},
	{
		ref: 'trayPanelView',
		selector: 'trayPanelView[itemId="trayPanelInst"]'
	}],
	init: function() {
		var me = this;
		me.control({
			'trayPanelView toolbar[itemId="btnAttachTrayToolBar"] button[itemId="btnAttachTray"]': {
				click: function() {
					me.showAttachTrayPopup(false);
				}
			},
			'trayPanelView smartgrid[itemId="trayDetailsGrid"]': {
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
			}
			,
			'attachTrayPopup[itemId="attachTrayPopup"]': {
				submitAttachTray: function(popup) {
					var popupFieldValidationDetails = popup.getPopupFieldValidationDetails();
					var popupFieldValues = popupFieldValidationDetails.popupFieldValues;
					if(popupFieldValidationDetails.isValid) {
						me.submitAttachTray(popupFieldValues);
					}
				}
			},
			'trayPanelView toolbar[itemId="dtlsActionBar"] [actionName="discard"]': {
				click: function() {
					me.handleGroupActions('discard');
				}
			}
		});
	},
	showAttachTrayPopup: function(viewOnlyMode, record) {
		var attachTrayPopup = Ext.create('GCP.view.AttachTrayPopupView', {
			itemId: 'attachTrayPopup',
			viewOnlyMode: viewOnlyMode,
			selectedRecord: record || null
		});
		attachTrayPopup.show();
		return attachTrayPopup;
	},
	submitAttachTray: function(popupFieldValues) {
		var me = this;
		var requestData = popupFieldValues;
		requestData.parentRecordKey = parentRecordKey;
		$.ajax({
			url: 'services/bankPrinterMstDetail/saveDetails.json',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(requestData),
			success: function(response) {
				if(response && response.success) {
					var attachPackagePopup = me.getAttachTrayPopup();
					var partnerDetailsGrid = me.getTrayDetailsGrid();
					if(response.success === 'Y') {
						attachPackagePopup.close();
						partnerDetailsGrid.refreshData();
						document.getElementById( "dirtyBitSet" ).value = 'true';
					    $(".submit_button").removeClass("disabled");
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
	handleLoadGridData: function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(!Ext.isEmpty(mediaId)) {
			strUrl = strUrl + '&$mediaId=' + mediaId + '&$parentRecordKey=' + parentRecordKey;
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
		var trayPanelView = me.getTrayPanelView();
		var discardActionButton = trayPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
		discardActionButton.setDisabled(disableDiscardAction);
	},
	
	handleGroupActions: function(strAction) {
		var me = this;
		var grid = me.getTrayDetailsGrid();
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
				url: 'services/bankPrinterMstDetail/discardDetails',
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
							var trayDetailsGrid = me.getTrayDetailsGrid();
							var trayPanelView = me.getTrayPanelView();
							var discardActionButton = trayPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
							discardActionButton.setDisabled(true);
							trayDetailsGrid.refreshData();
						}
					}
				},
				error: function(response) {
				}
			});
		}
	},
	handleGridRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
		var me = this;
		var actionName = btn.itemId;
		var viewOnlyMode = (actionName === 'btnView') ? true : false;
		var attachTrayPopup = me.showAttachTrayPopup(viewOnlyMode,record);
		
		var popupFieldValues = {
			viewTrayNo: record.get('viewTrayNo'),
			actualTrayNo: record.get('actualTrayNo'),
			psrType: record.get('psrType'),
			mediaId: mediaId,
			recordKeyNo: record.get('recordKeyNo'),
			requestState: record.get('requestState')
		};
		
		if(pagemode === 'MODIFIEDVIEW') {
			var oldNewValueList = gridview.getStore().proxy.reader.rawData.d.oldNewValueList;
			var oldNewValueData = {};
			var viewChangesDetails = {oldDeletedValues: {}, oldValues: {}};
			Ext.each(oldNewValueList, function(item) {
				if(item.recordDetails.recordKeyNo === record.get('recordKeyNo')) {
					oldNewValueData = item;
				}
			});
			if(!Ext.isEmpty(oldNewValueData.newList)) {
				for(key in oldNewValueData.newList) {
					viewChangesDetails[key] = 'newFieldValue';
				}
			}
			if(!Ext.isEmpty(oldNewValueData.modifiedList)) {
				for(key in oldNewValueData.modifiedList) {
					viewChangesDetails[key] = 'modifiedFieldValue';					
				}
			}
			if(!Ext.isEmpty(oldNewValueData.deletedList)) {
				for(key in oldNewValueData.deletedList) {
					viewChangesDetails[key] = 'deletedFieldValue';
					viewChangesDetails.oldDeletedValues[key] = oldNewValueData.deletedList[key];
				}
			}
		}
		attachTrayPopup.setPopupFieldValidationDetails(popupFieldValues, viewChangesDetails);
	}
});