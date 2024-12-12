Ext.define('GCP.view.ClientSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'clientSetupView',
	requires : ['Ext.container.Container','GCP.view.ClientSetupFilterView', 'Ext.ux.gcp.GroupView'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		this.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		/*if (objReceiverMstPref) {
			var objJsonData = Ext.decode(objReceiverMstPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}*/
		
		if (objReceiverMstPref) {
			var objJsonData = Ext.decode(objReceiverMstPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (USER_CATEGORY_GENERIC_COLUMN_MODEL || '[]');
		}
		if(objReceiverMstLocalPref){
			var objLocalData = Ext.decode(objReceiverMstLocalPref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			itemId : 'roleGroupView',
			// cfgGroupByUrl :'static/scripts/commonmst/userCategory/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/userCategory/groupBy.json?$filterscreen=groupViewFilter&$filterGridId=GRD_PAY_RECPAR',
			cfgSummaryLabel : getLabel('receiverList', 'Receiver List'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			// cfgSubGroupCode : objGeneralSetting.subGroupCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cls:'t7-grid',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'clientSetupFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
                return [me.createFavoriteColumn(),me.createGroupActionColumn()]
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				enableQueryParam:false,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel:{
					fields :  ['requestStateDesc','paymentTypeDesc', 'bankIdType','bankId','clientDesc','receiverCode',
						'drawerDesc', 'drawerLocalName', 'beneAcctNmbr','defaultAccountFlag','receiverType','beneAccountCcy',
						'identifier', 'history', 'isSubmitted','anyIdType','anyIdValue',
                        '__metadata','isFavorite','channelCode','additionalInfo7','additionalInfo1','response_ref_nmbr','response_datetime'],
					proxyUrl : 'services/receiversList.json',
					rootNode : 'd.userAdminList',
					totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example
				 * The example for groupActionModel as below : 
				 * 	[{
				 *	  //@requires Used while creating the action url.
				 *		actionName : 'submit',
				 *	  //@optional Used to display the icon.
				 *		itemCls : 'icon-button icon-submit',
				 *	  //@optional Defaults to true. If true , then the action will considered
				 *	            in enable/disable on row selection.
				 *		isGroupAction : false,
				 *	  //@optional Text to display
				 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me
						.getColumnModel(USER_CATEGORY_GENERIC_COLUMN_MODEL),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				fnColumnRenderer : me.columnRenderer,
				/**
				 * @cfg{Function} fnSummaryRenderer Used as default column
				 *                summary renderer for all columns if
				 *                fnSummaryRenderer is not passed to the grids
				 *                column model
				 */
				// fnSummaryRenderer : function(value, summaryData, dataIndex,
				// rowIndex, colIndex, store, view, colId) {
				// },
				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * 
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) { 
				 * 	return true;
				 *}
				 * 
				 * @param {Ext.data.Store}
				 *            store The grid data store
				 * @param {Ext.data.Model}
				 *            record The record for current row
				 * @param {JSON}
				 *            jsonData The response json data
				 * @param {String}
				 *            iconName The name of the icon
				 * @param {Number}
				 *            maskPosition The position of the icon action in
				 *            bit mask
				 * @return{Boolean} Returns true/false
				 */
				fnRowIconVisibilityHandler : me.isRowIconVisible

			}
		});
		return groupView
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 
				'Discard', 'Accept','Reject', 'Enable', 'Disable']);
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('userMstActionSubmit', 'Submit'),
				maskPosition : 5
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('userMstActionReject', 'Reject'),
				maskPosition : 7

			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('userMstActionDiscard', 'Discard'),
				maskPosition : 10
			},
			'Accept' : {
				actionName : 'accept',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('userMstActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Enable' : {
				actionName : 'enable',
				// itemCls : 'icon-button icon-revarsal',
				itemText : getLabel('userMstActionEnable', 'Enable'),
				maskPosition : 8
			},
			'Disable' : {
				actionName : 'disable',
				// itemCls : 'icon-button icon-revarsal',
				itemText : getLabel('userMstActionDisable', 'Suspend'),
				maskPosition : 9
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = "";
			var YES = getLabel('yes', 'Yes');
			var NO = getLabel('no', 'No')
		if (colId === 'col_clientType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = getLabel('corporation', 'Corporation');
				} else {
					strRetValue = getLabel('subsidiary', 'Subsidiary');
				}
			}
		} else if (colId === 'col_variance') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('brandingPkgName'))) {
					strRetValue = Math.floor((Math.random() * 100) + 1);
				}
			}
		} else if (colId === 'col_corporationName') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = record.get('clientName');
				} else {
					strRetValue = value;
				}
			}
		} else if (colId === 'col_bankPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_clientPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_copyBy') {
			strRetValue = '<a class="underlined" onclick="showClientPopup(\''
					+ record.get('brandingPkgName') + '\')">' + value + '</a>';
		} else if (colId === 'col_defaultAccountFlag') {
			strRetValue = (value == 'Y')? YES: NO; 
		} else if (colId === 'col_receiverType') {
			strRetValue = (value == 'N') ? YES: NO; 
		}
		else {
			strRetValue = value;
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit','Discard','Approve','Reject','Enable','Disable'];
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit'),
			itemLabel : getLabel('editToolTip', 'Edit'),
			maskPosition : 2
			},{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 3
			},{
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			toolTip : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
			}];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Submit' :
						itemsArray.push({
							text : getLabel('userMstActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 5
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
						});
						break;
					case 'Discard' :
						itemsArray.push({
							text : getLabel('userMstActionDiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 10
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Approve' :
						itemsArray.push({
							text : getLabel('userMstActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 6
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
						});
						break;
					case 'Reject' :
						itemsArray.push({
							text : getLabel('userMstActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 7
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Enable' :
						itemsArray.push({
							text : getLabel('userMstActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 8
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Disable' :
						itemsArray.push({
							text : getLabel('userMstActionDisable', 'Suspend'),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 9
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;						
				}

			}
		}
		return itemsArray;
	},
	 createFavoriteColumn : function() {
        var me = this;
        var objActionCol =
        {
            colType : 'action',
            colId : 'favorite',
            align : 'left', 
            colHeader: getLabel('favourite', 'Favourite'),
            width : 90,
            locked : true,
            sortable : false,
            fnColumnRenderer : function(a,b,c) {
               if (b.record.data.isFavorite === 'Y') {
                    return "<a class='linkbox icon-misc-favorite'><i class='fa fa-star'></i></a>";
                } else {
                    return "<a class='linkbox icon-misc-nonfavorite'><i class='fa fa-star'></i></a>";
                }
            },
            items :
            [
                {
                    itemId : 'btnfavorite',
                    itemCls : 'linkbox misc-icon icon-misc-nonfavorite',
                    fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
                    {
                        if(_IsEmulationMode == true)
                        {
                            Ext.MessageBox.show(
                                    {
                                        title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
                                        msg : getLabel( 'emulationError', 'You are in emulation mode and cannot perform save or update.' ),
                                        buttons : Ext.MessageBox.OK,
                                        cls : 'ux_popup',
                                        icon : Ext.MessageBox.ERROR
                                    } );
                        }
                        else
                        {
                            if( record.data.isFavorite === 'Y' )
                            {
                                record.set( "isFavorite", "N" );
                                var drawerCode = record.raw.drawerCode;
                                me.deleteFavoriteReceiver(drawerCode, record.raw.clientId)
                            }
                            else
                            {
                                record.set( "isFavorite", "Y" );
                                var drawerCode = record.raw.drawerCode;
                                me.addFavoriteReceiver(drawerCode, record.raw.clientId);
                            }
                        }
                    },
                    fnIconRenderer : function( value, metaData, record, rowIndex, colIndex, store, view )
                    {
                        if( !record.get( 'isEmpty' ) )
                        {
                            if( record.data.isFavorite === 'Y' )
                            {
                                var iconClsClass = 'linkbox misc-icon icon-misc-favorite';
                                return iconClsClass;
                            }
                            else
                            {
                                var iconClsClass = 'linkbox misc-icon icon-misc-nonfavorite';
                                return iconClsClass;
                            }
                        }
                    }
                }
            ]
        };
        return objActionCol;
    },
	addFavoriteReceiver : function( drawerCode, clientId )
    {
        var me = this;

        Ext.Ajax.request(
        {
            url : 'services/addFavoriteReceiever.json?drawerCode=' + drawerCode + '&clientId=' + clientId,
            method : 'POST',
            success : function( response )
            {
                var data = Ext.decode(response.responseText);
                var isSuccess;
                var title, strMsg, imgIcon;
                if (data.status)
                    isSuccess = data.status;
                if (isSuccess && isSuccess === 'failed')
               {
                title = getLabel('SaveFilterPopupTitle',
                                'Message');
                        strMsg = data.d.preferences.error.errorMessage;
                        imgIcon = Ext.MessageBox.ERROR;
                        Ext.MessageBox.show({
                                    title : title,
                                    msg : strMsg,
                                    width : 200,
                                    buttons : Ext.MessageBox.OK,
                                    buttonText: {
                                        ok: getLabel('btnOk', 'OK')
                                        },
                                    cls : 't7-popup',
                                    icon : imgIcon
                                });
                }
                else {
                    Ext.MessageBox.show({
                        title : title,
                        msg : getLabel('prefSavedMsg',
                                'Preferences Saved Successfully'),
                        buttons : Ext.MessageBox.OK,
                        buttonText: {
                            ok: getLabel('btnOk', 'OK')
                            },
                        cls : 't7-popup',
                        icon : Ext.MessageBox.INFO
						 
                    });
            }
            },
            failure : function()
            {
                var errMsg = "";
                Ext.MessageBox.show({
                            title : getLabel(
                                    'instrumentErrorPopUpTitle',
                                    'Error'),
                            msg : getLabel(
                                    'instrumentErrorPopUpMsg',
                                    'Error while fetching data..!'),
                            buttons : Ext.MessageBox.OK,
                            buttonText: {
                                ok: getLabel('btnOk', 'OK')
                                },
                            cls : 't7-popup',
                            icon : Ext.MessageBox.ERROR
                        });
            }
        } );
    },
    deleteFavoriteReceiver : function( drawerCode, clientId )
    {
        Ext.Ajax.request(
        {
            url : 'services/deleteFavoriteReceiver.json?drawerCode=' + drawerCode + '&clientId=' + clientId,
            method : 'POST',
           // jsonData : newReportset,
            success : function( response )
            {
                var data = Ext.decode(response.responseText);
                var isSuccess;
                var title, strMsg, imgIcon;
                if (data.status)
                    isSuccess = data.status;
                if (isSuccess && isSuccess === 'failed') {
                    title = getLabel('SaveFilterPopupTitle',
                                    'Message');
                            strMsg = data.d.preferences.error.errorMessage;
                            imgIcon = Ext.MessageBox.ERROR;
                            Ext.MessageBox.show({
                                        title : title,
                                        msg : strMsg,
                                        width : 200,
                                        buttons : Ext.MessageBox.OK,
                                        buttonText: {
                                            ok: getLabel('btnOk', 'OK')
                                            },
                                        cls : 't7-popup',
                                        icon : imgIcon
                                    });

                } 
                else
                {
                    Ext.MessageBox.show({
                        title : title,
                        msg : getLabel('prefSavedMsg',
                                'Preferences Saved Successfully'),
                        buttons : Ext.MessageBox.OK,
                        buttonText: {
                            ok: getLabel('btnOk', 'OK')
                            },
                        cls : 't7-popup',
                        icon : Ext.MessageBox.INFO
                    });
               }
            },
            failure : function()
            {
            var errMsg = "";
            Ext.MessageBox.show({
                        title : getLabel(
                                'instrumentErrorPopUpTitle',
                                'Error'),
                        msg : getLabel(
                                'instrumentErrorPopUpMsg',
                                'Error while fetching data..!'),
                        buttons : Ext.MessageBox.OK,
                        buttonText: {
                            ok: getLabel('btnOk', 'OK')
                            },
                        cls : 't7-popup',
                        icon : Ext.MessageBox.ERROR
                    });
            }

        } );
    }
});