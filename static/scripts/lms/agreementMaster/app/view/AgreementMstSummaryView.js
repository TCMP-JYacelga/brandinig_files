Ext
		.define(
				'GCP.view.AgreementMstSummaryView',
				{
					extend : 'Ext.container.Container',
					xtype : 'agreementMstSummaryView',
					requires : [ 'Ext.container.Container', 'Ext.ux.gcp.GroupView', 'GCP.view.AgreementMstFilterView' ],
					initComponent : function() {
						var me = this;
						var groupView = me.createGroupView();
						me.items = [ groupView ];
						me.callParent(arguments);
					},
					createGroupView : function() {
						var me = this, blnShowAdvancedFilter = true, groupView = null;
						var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
						var objLocalPageSize = '',objLocalSubGroupCode = null;
						if (objAgreementMstPref) {
							var objJsonData = Ext.decode(objAgreementMstPref);
							objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
							objGridSetting = objJsonData.d.preferences.GridSetting || {};
							arrColumnSetting = objJsonData && objJsonData.d.preferences && objJsonData.d.preferences.ColumnSetting
									&& objJsonData.d.preferences.ColumnSetting.gridCols ? objJsonData.d.preferences.ColumnSetting.gridCols
									: (AGREEMENT_MST_COLUMNS || '[]');
						}
						if(objSaveLocalStoragePref){
							var objLocalData = Ext.decode(objSaveLocalStoragePref);
							objLocalPageSize = objLocalData && objLocalData.d.preferences
												&& objLocalData.d.preferences.tempPref 
												&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
							objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
												&& objLocalData.d.preferences.tempPref 
												&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
						}

						blnShowAdvancedFilter =  (entityType === '0')? true : !isHidden('AdvanceFilter');
						groupView = Ext
								.create(
										'Ext.ux.gcp.GroupView',
										{
											cfgGroupByUrl : 'services/grouptype/agreementMst/groupBy.json?$filterGridId=GRD_SWEEPSETUP',
											cfgParentCt : me,
											cls : 't7-grid',
											cfgShowFilter : true,
											cfgShowRefreshLink : false,
											cfgSmartGridSetting : false,
											cfgAutoGroupingDisabled : true,
											cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
											cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
											cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
											cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt
													: 'G',
											cfgPrefferedColumnModel : arrColumnSetting,
											cfgFilterModel : {
												cfgContentPanelItems : [ {
													xtype : 'agreementMstFilterView'
												} ],
												cfgContentPanelLayout : {
													type : 'vbox',
													align : 'stretch'
												}
											},
											getActionColumns : function() {
												return [ me.createGroupActionColumn() ]
											},
											cfgGridModel : {
												pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
												rowList : _AvailableGridSize,
												stateful : false,
												showSorterToolbar : _charEnableMultiSort,
												heightOption : objGridSetting.defaultGridSize,
												columnHeaderFilterCfg : {},
												showEmptyRow : false,
												showPager : true,
												minHeight : 100,
												/* heightOption : objGridSetting.defaultGridSize, */
												checkBoxColumnWidth : 39,
												hideRowNumbererColumn : true,
												enableColumnHeaderFilter : true,
												enableColumnAutoWidth : _blnGridAutoColumnWidth,
												showPagerRefreshLink : false,
												storeModel : {
													fields : [ 'agreementCode', 'agreementName', 'clientDescription',
															'structureTypeDesc', 'structureType', 'startDate', 'endDate',
															'requestStateDesc', 'clientCode', 'identifier', '__metadata',
															'viewState', 'history', 'makerId', 'requestState', 'validFlag',
															'isSubmitted', 'approvalCount' ],
													proxyUrl : 'getAgreementMstList.srvc',
													// proxyUrl : 'services/getAgreementMstList.srvc',
													rootNode : 'd.agreementList',
													totalRowsNode : 'd.__count'
												},
												groupActionModel : me.getGroupActionModel(),
												defaultColumnModel : me.getColumnModel(AGREEMENT_MST_COLUMNS),
												fnRowIconVisibilityHandler : me.isRowIconVisible,
												fnColumnRenderer : me.columnRenderer

											}
										});
						return groupView;
					},
					columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
						var strRetValue = value;

						return strRetValue;
					},
					getGroupActionModel : function(arrAvaliableActions) {
						var retArray = [];
						var arrActions = (arrAvaliableActions || [ 'Submit', 'Discard', 'Accept', 'Reject' ]);
						if(entityType == 0)
                        {
                            arrActions.push('Enable');
                            arrActions.push('Disable');
                            //arrActions.push('Verify');
                        }
                        else if(entityType == 1)
                        {
                            arrActions.push('Send');
                        }
						var objActions = {
							'Submit' : {
								actionName : 'submit',
								isGroupAction : true,
								itemText : getLabel('userMstActionSubmit', 'Submit'),
								maskPosition : 1
							},
							'Discard' : {
								actionName : 'discard',
								itemText : getLabel('userMstActionDiscard', 'Discard'),
								maskPosition : 6
							},
							'Accept' : {
								actionName : 'accept',
								itemText : getLabel('userMstActionApprove', 'Approve'),
								maskPosition : 2
							},
							'Reject' : {
								actionName : 'reject',
								itemText : getLabel('userMstActionReject', 'Reject'),
								maskPosition : 3

							},
							'Enable' : {
								actionName : 'enable',
								itemText : getLabel('userMstActionEnable', 'Enable'),
								maskPosition : 4
							},
							'Disable' : {
								actionName : 'disable',
								itemText : getLabel('userMstActionDisable', 'Suspend'),
								maskPosition : 5
							},
                            'Verify' :
                            {
                                actionName : 'verify',
                                itemText : getLabel('prfMstActionVerify', 'Verify'),
                                maskPosition : 10
                            },
                            'Send' :
                            {
                                actionName : 'send',
                                itemText : getLabel('prfMstActionSend', 'Send'),
                                maskPosition : 11
                            }
						};

						for (var i = 0; i < arrActions.length; i++) {
							if (!Ext.isEmpty(objActions[arrActions[i]])) retArray.push(objActions[arrActions[i]])
						}
						return retArray;
					},

					isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
						var maskSize = 11;
						var maskArray = new Array();
						var actionMask = '';
						var rightsMap = record.data.__metadata.__rightsMap;
						var buttonMask = '';
						var retValue = true;
						var bitPosition = '';
						if (itmId == "btnTreeView"
								&& (record.data.structureTypeDesc == "Sweep" || record.data.structureTypeDesc == "Hybrid" || record.data.structureTypeDesc == "Flexible")) {
							return true;
						}
						else
							if (itmId == "btnTreeView"
									&& (record.data.structureTypeDesc != "Sweep" || record.data.structureTypeDesc != "Hybrid" || record.data.structureTypeDesc != "Flexible")) {
								return false
							}

						if (!Ext.isEmpty(maskPosition)) {
							bitPosition = parseInt(maskPosition,10) - 1;
						}
						if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) buttonMask = jsonData.d.__buttonMask;
						maskArray.push(buttonMask);
						maskArray.push(rightsMap);
						actionMask = doAndOperation(maskArray, maskSize);
						var isSameUser = true;
						if (record.raw.makerId === USER) {
							isSameUser = false;
						}

						if (Ext.isEmpty(bitPosition)) return retValue;
						retValue = isActionEnabled(actionMask, bitPosition);
						if ((maskPosition === 2 && retValue)) {
							retValue = retValue && isSameUser;
						}
						else
							if (maskPosition === 3 && retValue) {
								retValue = retValue && isSameUser;
							}
							else
								if (maskPosition === 8 && retValue) {
									retValue = true;
								}

						return retValue;
					},
					getColumnModel : function(arrCols) {
						return arrCols;
					},
					createGroupActionColumn : function() {
						var me = this;
						var colItems = [];
						var availableActions = [ 'Submit', 'Discard', 'Approve', 'Reject'];
						if(entityType == 0)
                        {
                            availableActions.push('Enable');
                            availableActions.push('Disable');
                            availableActions.push('Verify');
                        }
                        else if(entityType == 1)
                        {
                            availableActions.push('Send');
                        }
						var arrRowActions = [ {
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel('editToolTip', 'Modify Record'),
							itemLabel : getLabel('editToolTip', 'Modify Record'),
							maskPosition : 8
						}, {
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record'),
							itemLabel : getLabel('viewToolTip', 'View Record'),
							maskPosition : 7
						}, {
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel('historyToolTip', 'View History'),
							toolTip : getLabel('historyToolTip', 'View History'),
							maskPosition : 9
						// fnVisibilityHandler : isIconVisible
						// fnClickHandler : showHistory
						}, {
							itemId : 'btnTreeView',
							itemCls : 'grid-row-action-icon icon-tree',
							toolTip : getLabel('treeViewToolTip', 'Tree View'),
							itemLabel : getLabel('treeViewToolTip', 'Tree View')
						} ];
						colItems = me.getGroupActionColItems(availableActions);
						var objActionCol = {
							colId : 'actioncontent',
							colHeader : getLabel('actions', 'Actions'),
							colType : 'actioncontent',
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
									case 'Submit':
										itemsArray.push({
											text : getLabel('userMstActionSubmit', 'Submit'),
											actionName : 'submit',
											itemId : 'submit',
											maskPosition : 1

										});
										break;
									case 'Discard':
										itemsArray.push({
											text : getLabel('userMstActionDiscard', 'Discard'),
											actionName : 'discard',
											itemId : 'discard',
											maskPosition : 6

										});
										break;
									case 'Approve':
										itemsArray.push({
											text : getLabel('userMstActionApprove', 'Approve'),
											itemId : 'accept',
											actionName : 'accept',
											maskPosition : 2

										});
										break;
									case 'Reject':
										itemsArray.push({
											text : getLabel('userMstActionReject', 'Reject'),
											itemId : 'reject',
											actionName : 'reject',
											maskPosition : 3

										});
										break;
									case 'Enable':
										itemsArray.push({
											text : getLabel('userMstActionEnable', 'Enable'),
											itemId : 'enable',
											actionName : 'enable',
											maskPosition : 4

										});
										break;
									case 'Disable':
										itemsArray.push({
											text : getLabel('userMstActionDisable', 'Suspend'),
											itemId : 'disable',
											actionName : 'disable',
											maskPosition : 5

										});
										break;
									case 'Verify' :
                                        itemsArray.push({
                                            text : getLabel('prfMstActionVerify', 'Verify'),
                                            itemId : 'verify',
                                            actionName : 'verify',
                                            maskPosition : 10
                                            });
                                        break;      
                                    case 'Send' :
                                        itemsArray.push({
                                            text : getLabel('prfMstActionSend', 'Send'),
                                            itemId : 'send',
                                            actionName : 'send',
                                            maskPosition : 11
                                            });
                                        break;
								}

							}
						}
						return itemsArray;
					}
				});