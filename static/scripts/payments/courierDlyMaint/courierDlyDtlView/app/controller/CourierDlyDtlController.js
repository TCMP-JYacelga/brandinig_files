Ext.define('GCP.controller.CourierDlyDtlController', {
	extend: 'Ext.app.Controller',
	requires: ['Ext.util.Point','Ext.panel.Panel'],
	refs: [{
		ref: 'courierDlyDtlGrid',
		selector: 'courierDlyDtlView smartgrid[itemId="courierDlyDtlGrid"]'
	},
	{
		ref: 'groupView',
		selector: 'courierDlyDtlView[itemId="courierDlyDtlInst"]'
	}],
	init: function() {
		var me = this;
		me.control({
			'courierDlyDtlView smartgrid[itemId="courierDlyDtlGrid"]': {
				render: function(grid) {
			       if("" != productCode && "" != printBranchCode && "" != clientId){
		               me.applyAdvancedFilter();
                       me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1, 1, null);
                    }
					if(pageMode==='VIEW' || pageMode==='MODIFIEDVIEW') {
						grid.getSelectionModel().setLocked(true);
					}
				},
				gridPageChange: me.handleLoadGridData,
				gridSortChange: me.handleLoadGridData,
				gridRowSelectionChange: me.gridRowSelectionChange,
				handleGridRowIconClick: me.handleGridRowIconClick
			}
		});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
        });
        populateAdvancedFilterFieldValue();
	},
	setDataForFilter : function(filterData) {
        var me = this;
        var arrQuickJson = {};
        me.advFilterData = {};
        //me.filterData = {};
        var objJson = (!Ext.isEmpty(filterData)
                ? filterData.filterBy
                : getAdvancedFilterQueryJson());
        me.advFilterData = objJson;   
        var filterCode = $("input[type='text'][id='savedFilterAs']").val();
        if (!Ext.isEmpty(filterCode))
            me.advFilterCodeApplied = filterCode;
    },
    searchActionClicked : function(me) {
        var me = this, objGroupView = null;
        me.savedFilterVal = '';
        me.filterCodeValue = '';
        me.doSearchOnly();
    },
    doSearchOnly : function() {
        var me = this;
        me.applyAdvancedFilter();
    },
	handleLoadGridData: function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
	    var me= this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        var filterUrl = me.generateFilterUrl();
        strUrl += "&$filter=" + filterUrl + "&$viewState=" + document.getElementById("viewState").value;
        listOfIdentifiers = [];
		grid.loadGridData(strUrl, function() {}, null, false);
	},
	generateFilterUrl : function() {
        var me = this;
        var strQuickFilterUrl = '', strUrl = '';
        strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
        if (!Ext.isEmpty(strQuickFilterUrl)) {
            strUrl += '&$filter=' + strQuickFilterUrl;
        }
        return strUrl;
    },
    
    generateUrlWithQuickFilterParams : function() {
        var me = this;
        var filterData = me.advFilterData.filterBy;
        var isFilterApplied = false;
        var strFilter = '';
        var strTemp = '';
        var strFilterParam = '';
        for (var index = 0; index < filterData.length; index++) {
            if (isFilterApplied)
                strTemp = strTemp + ' and ';
            switch (filterData[index].operatorValue) {
                case 'bt' :
                    if (filterData[index].dataType === 'D') {
                        strTemp = strTemp + filterData[index].paramName + ' '
                                + filterData[index].operatorValue + ' '
                                + 'date\'' + filterData[index].paramValue1
                                + '\'' + ' and ' + 'date\''
                                + filterData[index].paramValue2 + '\'';
                    } else {
                        strTemp = strTemp + filterData[index].paramName + ' '
                                + filterData[index].operatorValue + ' ' + '\''
                                + filterData[index].paramValue1 + '\''
                                + ' and ' + '\''
                                + filterData[index].paramValue2 + '\'';
                    }
                    break;
                case 'in' :
                    var reg = new RegExp(/[\(\)]/g);
                    var objValue = filterData[index].paramValue1;
                    // objValue = objValue.replace(reg, '');
                    var objArray = objValue.split(',');
                    if (objArray.length > 0) {
                        if (objArray[0] != 'All') {
                            if (isFilterApplied) {
                                if (filterData[index].detailFilter
                                        && filterData[index].detailFilter === 'Y') {
                                    strDetailUrl = strDetailUrl + ' and ';
                                } else {
                                    // strTemp = strTemp + ' and ';
                                    strTemp = strTemp;
                                }
                            } else {
                                isFilterApplied = true;
                            }

                            if (filterData[index].detailFilter
                                    && filterData[index].detailFilter === 'Y') {
                                strDetailUrl = strDetailUrl + '(';
                            } else {
                                strTemp = strTemp + '(';
                            }
                            for (var i = 0; i < objArray.length; i++) {
                                if (filterData[index].detailFilter
                                        && filterData[index].detailFilter === 'Y') {
                                    strDetailUrl = strDetailUrl
                                            + filterData[index].paramName
                                            + ' eq ';
                                    strDetailUrl = strDetailUrl + '\''
                                            + objArray[i] + '\'';
                                    if (i != objArray.length - 1)
                                        strDetailUrl = strDetailUrl + ' or ';
                                } else {
                                    strTemp = strTemp
                                            + filterData[index].paramName
                                            + ' eq ';
                                    strTemp = strTemp + '\'' + objArray[i]
                                            + '\'';
                                    if (i != objArray.length - 1)
                                        strTemp = strTemp + ' or ';

                                }
                            }
                            if (filterData[index].detailFilter
                                    && filterData[index].detailFilter === 'Y') {
                                strDetailUrl = strDetailUrl + ')';
                            } else {
                                strTemp = strTemp + ')';
                            }
                        }
                    }
                    break;
                default :
                    // Default opertator is eq
                    if (filterData[index].dataType === 'D') {
                        strTemp = strTemp + filterData[index].paramName + ' '
                                + filterData[index].operatorValue + ' '
                                + 'date\'' + filterData[index].paramValue1
                                + '\'';
                    } else {
                        strTemp = strTemp + filterData[index].paramName + ' '
                                + filterData[index].operatorValue + ' ' + '\''
                                + filterData[index].paramValue1 + '\'';
                    }
                    break;
            }
            isFilterApplied = true;
        }
        if (isFilterApplied)
            strFilter = strFilter + strTemp;
        else
            strFilter = '';
        return strFilter;
    },
	gridRowSelectionChange: function(grid, record, recordIndex, arrSelectedRecords, jsonData, strAction) {
		var me = this;
		var disableDiscardAction = true;
		if(arrSelectedRecords.length > 0) disableDiscardAction = false;
		Ext.each(arrSelectedRecords, function(selectedRecord) {
			var requestState = selectedRecord.get('requestState');
			if(requestState.toString() === '1') disableDiscardAction = true;
		      if(!Ext.Array.contains(listOfIdentifiers,record.data.identifier)){
                  Ext.Array.push(listOfIdentifiers,record.data.identifier);
              }
		});
		if('deselect' === strAction && listOfIdentifiers.length> 0){
		     Ext.Array.remove(listOfIdentifiers,record.data.identifier);
		}
	},
	applyAdvancedFilter : function(filterData) {
        var me = this, 
        objGroupView = me.getGroupView();
        me.filterApplied = 'A';
        me.setDataForFilter(filterData);
        me.refreshData();    
    },
    refreshData : function() {
        var me = this;
        var objGroupView = me.getCourierDlyDtlGrid();
        var grid = objGroupView.getGridState();
        if (grid) {
            if (!Ext.isEmpty(me.advSortByData)) {
                appliedSortByJson = me.getSortByJsonForSmartGrid();
                grid.removeAppliedSort();
                grid.applySort(appliedSortByJson);
            }
        }
        objGroupView.refreshData();
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
		
		if(pageMode === 'MODIFIEDVIEW') {
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