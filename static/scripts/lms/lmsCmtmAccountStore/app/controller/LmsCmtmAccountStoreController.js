Ext
	.define(
		'GCP.controller.LmsCmtmAccountStoreController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.LmsCmtmAccountStoreGridView', 'GCP.view.LmsCmtmAccountStoreEditAddrView'
			],
			views :
			[
				'GCP.view.LmsCmtmAccountStoreView'
			],

			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'lmsCmtmAccountStoreViewRef',
					selector : 'lmsCmtmAccountStoreViewType'
				},
				{
					ref : 'lmsCmtmAccountStoreGridViewRef',
					selector : 'lmsCmtmAccountStoreViewType lmsCmtmAccountStoreGridViewType'
				},
				{
					ref : 'lmsCmtmAccountStoreDtlViewRef',
					selector : 'lmsCmtmAccountStoreViewType lmsCmtmAccountStoreGridViewType panel[itemId="lmsCmtmAccountStoreDtlViewItemId"]'
				},
				{
					ref : 'lmsCmtmAccountStoreGridRef',
					selector : 'lmsCmtmAccountStoreViewType lmsCmtmAccountStoreGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'lmsCmtmAccountStoreViewType lmsCmtmAccountStoreGridViewType lmsCmtmAccountStoreGroupActionViewType'
				},
				{
					ref : 'lmsCmtmAccountStoreFilterViewRef',
					selector : 'lmsCmtmAccountStoreViewType lmsCmtmAccountStoreFilterViewType'
				}
			],

			config :
			{
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				clientFilterVal : 'all',
				clientFilterCodeVal : 'all',
				agreementCodeFilterVal : 'all',
				agreementRecKeyFilterVal : 'all',
				filterData : [],
				filterApplied : 'ALL',
				//recordIdetifier : null,
				recordViewState : null
			},

			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;

				me.editAddressPopup = Ext.create( 'GCP.view.LmsCmtmAccountStoreEditAddrView',
				{
					parent : 'lmsCmtmAccountStoreViewType',
					itemId : 'lmsCmtmAccountStoreEditAddrViewPopupItemId'
				} );

				me
					.control(
					{
						'lmsCmtmAccountStoreViewType' :
						{
							render : function( panel )
							{
							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},

						'lmsCmtmAccountStoreGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},

						'lmsCmtmAccountStoreFilterViewType' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
							},
							expand : function( panel )
							{
								//me.toggleSavePrefrenceAction( true );
							},
							collapse : function( panel )
							{
								//me.toggleSavePrefrenceAction( true );
							},
							filterStructureType : function( combo, record, index )
							{
							//	me.toggleSavePrefrenceAction( true );
								me.handleStructureTypeFilter( record );
							},
							filterStructureSubtype : function( btn, opts )
							{
								//me.toggleSavePrefrenceAction( true );
								me.handleStructureSubTypeFilter( btn );
							},
							filterStatusType : function( btn, opts )
							{
							//	me.toggleSavePrefrenceAction( true );
								me.handleStatusTypeFilter( btn );
							}
						},

						'lmsCmtmAccountStoreGridViewType smartgrid' :
						{
							render : function( grid )
							{
								me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
								me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
							},
							statechange : function( grid )
							{
								//me.toggleSavePrefrenceAction( true );
							},
							pagechange : function( pager, current, oldPageNum )
							{
								//me.toggleSavePrefrenceAction( true );
							}
						},

						'lmsCmtmAccountStoreGridViewType toolbar[itemId=groupActionBarItemId]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},

						'lmsCmtmAccountStoreFilterViewType combobox[itemId="entitledSellerIdItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getLmsCmtmAccountStoreFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeItemId"]' );
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : record[ 0 ].data.sellerCode
									}
								];
								me.sellerFilterVal = record[ 0 ].data.sellerCode;
							}
						},

						'lmsCmtmAccountStoreFilterViewType AutoCompleter[itemId="clientCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getLmsCmtmAccountStoreFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgSeekId = "cmtmAgreementCodeSeek";
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : record[ 0 ].data.CODE
									}
								];
								me.clientFilterVal = record[ 0 ].data.DESCRIPTION;
								me.clientFilterCodeVal = record[ 0 ].data.CODE;
							},
							change : function( combo, record, index )
							{
								//TODO
								if(combo.value == ''|| combo.value == null) {
									me.clientFilterCodeVal = 'all';
									me.agreementCodeFilterVal = 'all';
									me.agreementRecKeyFilterVal = 'all';
									
									var objFilterPanel = me.getLmsCmtmAccountStoreFilterViewRef();
									var objAutocompleter = objFilterPanel
										.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
									objAutocompleter.setValue( '' );
									objAutocompleter.cfgSeekId = "cmtmAgreementCodeSeek";
									objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : ''
										}
									];
								}
							}
						},

						'lmsCmtmAccountStoreFilterViewType AutoCompleter[itemId="agreementCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								me.agreementCodeFilterVal = record[ 0 ].data.CODE;
								me.agreementRecKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
							},
							change : function( combo, record, index )
							{
								//TODO
								if(combo.value == ''|| combo.value == null) {
									me.agreementCodeFilterVal = 'all';
									me.agreementRecKeyFilterVal = 'all';
								}
							}
						},

						'lmsCmtmAccountStoreFilterViewType button[itemId="btnFilter"]' :
						{
							click : function( btn, opts )
							{
								me.callHandleLoadGridData();
							}
						},

						'lmsCmtmAccountStoreEditAddrViewType[itemId="lmsCmtmAccountStoreEditAddrViewPopupItemId"]' :
						{
							saveClientAddress : function( btn, opts )
							{
								me.saveAddressDetails();
							}
						}

					} );
			},

			setDataForFilter : function()
			{
				var me = this;
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},

			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];

				if(me.sellerFilterVal != 'all')
				{
					jsonArray.push(
						{
							paramName : 'sellerCode',
							paramValue1 : me.sellerFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						} );
				}
				if( me.clientFilterCodeVal != 'all' )
				{
					jsonArray.push(
						{
							paramName : 'clientCode',
							paramValue1 : me.clientFilterCodeVal,
							operatorValue : 'eq',
							dataType : 'S'
						} );
				}
				if( me.agreementRecKeyFilterVal != 'all' )
				{
					jsonArray.push(
						{
							paramName : 'agreementRecKey',
							paramValue1 : me.agreementRecKeyFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						} );
				}

				return jsonArray;
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var lmsCmtmAccountStoreGrid = me.getLmsCmtmAccountStoreGridRef();
				var objConfigMap = me.getLmsCmtmAccountStoreNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( lmsCmtmAccountStoreGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
					else if( objConfigMap.arrColsPref )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
						pgSize = 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var alertSummaryGrid = null;
				lmsCmtmAccountStoreGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					maxHeight : 550,
					width : '100%',
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,									
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,					

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex,menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,dataParams.rowIndex,dataParams.columnIndex,menu, null,dataParams.record);
					}					
				} );

				var lmsCmtmAccountStoreDtlView = me.getLmsCmtmAccountStoreDtlViewRef();
				lmsCmtmAccountStoreDtlView.add( lmsCmtmAccountStoreGrid );
				lmsCmtmAccountStoreDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'submit' )
				{
					me.handleGroupActions( btn, record );
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ), record.get('agreementCode'));
					}
				}
				else if( actionName === 'btnView' )
				{
					me.showEditAddressPopup( record, 'VIEW' );
				}
				else if( actionName === 'btnEdit' )
				{
					me.showEditAddressPopup( record, 'EDIT' );
				}
			},

			submitForm : function( strUrl, record, rowIndex )
			{
				var form;
				var viewState = record.get( 'viewState' );

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				form.submit();
			},

			showHistory : function( url, id ,agCode)
			{
				Ext.create( 'GCP.view.LmsCmtmAccountStoreHistoryView',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id,
					agreementCode : agCode
				} ).show();
			},

			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},

			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},

			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckbox().checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					downloadPdf : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
				};
				var currentPage = 1;
				var strExtension = '';
				var strUrl = '';
				var strSelect = '';
				var activeCard = '';
				var viscols;
				var col = null;
				var visColsStr = "";
				var colMap = new Object();
				var colArray = new Array();

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/getLmsCmtmAccountStoreList/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getLmsCmtmAccountStoreGridRef();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrReportSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrReportSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrReportSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrReportSortColumn[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},

			getLmsCmtmAccountStoreNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"agreementCode" : '10%',
					"accountNmbr" : '10%',
					"accountName" : '9%',
					"accountBranch" : '9%',
					"clientDesc" : '9%',
					"companyRegId" : '9%',
					"companySeqNumber" : '6%',
					"companyAddress" : '10%',
					"accountType" : '9%',
					"accountStatusDesc" : '9%',
					"requestStateDesc" : '9.5%'
				};

				arrColsPref =
				[
					{
						"colId" : "agreementCode",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.agreement', 'Agreement Code' )
					},
					{
						"colId" : "accountNmbr",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.accountNmbr', 'Account Number' )
					},
					{
						"colId" : "accountName",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.accountName', 'Account Name' )
					},
					{
						"colId" : "accountBranch",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.accountBranch', 'Account Branch' )
					},
					{
						"colId" : "clientDesc",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.clientDesc', 'Client Name' )
					},
					{
						"colId" : "companyRegId",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.companyRegId', 'Comp Reg Id' )
					},
					{
						"colId" : "companySeqNumber",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.companyNumber', 'Company Number' )
					},
					{
						"colId" : "companyAddress",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.companyAddress', 'Statement Address' )
					},
					{
						"colId" : "accountType",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.accountType', 'Account Type' )
					},
					{
						"colId" : "accountStatusDesc",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.accountStatus', 'Account Status' )
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel( 'lbl.lmsCmtmAccountStore.changedStatus', 'Changed Status' )
					}
				];

				storeModel =
				{
					fields :
					[
						'agreementCode', 'accountNmbr', 'accountName', 'agreementName', 'accountBranch', 'clientDesc', 'companyRegId',
						'companyAddress', 'accountType', 'accountStatus', 'accountStatusDesc', 'requestStateDesc', 'zipCode',
						'history', 'identifier', 'viewState', '__metadata' ,'companySeqNumber'
					],
					proxyUrl : 'getLmsCmtmAccountStoreList.srvc',
					rootNode : 'd.lmsCmtmAccountStoreList',
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},

			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getLmsCmtmAccountStoreGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.enableDisableGroupActions( '000000000');
				grid.setLoading(true);
				grid.loadGridData( strUrl, null );
			},

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';

				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}
					return strUrl;
				}
			},

			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';

				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},

			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isDiscard = true;
				var isSameUser = true;
				var isSubmit = false;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
					else {
						isDiscard = false;
					}
					if (objData.raw.isSubmitted == 'Y' ) {
						isSubmit = true;
					}
				}
				actionMask = doAndOperation( maskArray, 7 );
				me.enableDisableGroupActions( actionMask, isSameUser , isSubmit , isDiscard);
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'getLmsCmtmAccountStoreList/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record );
				}
			},

			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{						
						if(text.length >255) {
						Ext.Msg.alert('Error', 'Reject remark should be less than 255 characters');
						return false;
					}
					if( btn == 'ok' )
					{
						if(Ext.isEmpty(text))
						{
							Ext.Msg.alert("Error", "Reject Remark field can not be blank");
						}
						else
						{
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},

			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getLmsCmtmAccountStoreGridRef();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];
					for( var index = 0 ; index < records.length ; index++ )
					{
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );

					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							var jsonRes = Ext.JSON.decode( response.responseText );
							var errors = '';
							for( var i in jsonRes.d.instrumentActions )
							{
								if( jsonRes.d.instrumentActions[ i ].errors )
								{
									for( var j in jsonRes.d.instrumentActions[ i ].errors )
									{
										errors += jsonRes.d.instrumentActions[ i ].errors[ j ].errorMessage + "<br\>";
									}
								}
							}
							if( errors != '' )
							{
								Ext.MessageBox.show(
								{
									title : getLabel( 'filterPopupTitle', 'Error' ),
									msg : errors,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							me.enableDisableGroupActions( '0000000', true );
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}
			},

			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 7;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition,10 ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );
				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );
				if( ( maskPosition === 1 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 2 && retValue )
				{
					retValue = retValue && isSameUser;
				}

				return retValue;
			},

			isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
			{
				var me = this;
				if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
					return false;
				var arrMenuItems = null;
				var isMenuVisible = false;
				var blnRetValue = true;
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;

				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},

			enableDisableGroupActions : function( actionMask, isSameUser , isSubmit,isDiscard)
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 1 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 2 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isDiscard && !isSubmit;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},

			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push( me.createGroupActionColumn() );
				arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						
						if(objCol.colId == 'requestStateDesc')
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							cfgCol.resizable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},

			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if (record.get('isEmpty')) {
					if (rowIndex === 0 && colIndex === 0) {
						meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('gridNoDataMsg',
								'No records found !!!');											
					}
				} else
					return value;
			},

			createGroupActionColumn : function()
			{

				var me = this;
				var objActionCol =
				{
						colType : 'actioncontent',
						colId : 'groupaction',
						width : 130,
						locked : true,
						lockable : false,
						sortable : false,
						hideable : false,
						resizable : false,
						draggable : false,
					items :
					[
						{
							text : getLabel('prfMstActionSubmit',
							'Submit'),
							itemId : 'submit',
							actionName : 'submit',
							maskPosition : 4
						},
						{
							text : getLabel('prfMstActionApprove',
							'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 1
						},
						{
								text : getLabel('prfMstActionReject',
								'Reject'),
								itemId : 'reject',
								actionName : 'reject',
								maskPosition : 2
							},							
							{
								text : getLabel('prfMstActionDiscard',
								'Discard'),
								itemId : 'discard',
								actionName : 'discard',
								maskPosition : 3
							}
						]					
				};
				return objActionCol;			
			
			},

			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					visibleRowActionCount : 1,
					width : 45,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel('viewToolTip','View Record'),
							maskPosition : 7
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel('editToolTip','Edit Record'),
							maskPosition : 5
						},
						{
						itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							itemLabel : getLabel('historyToolTip','View History'),
							maskPosition : 6
						}
					],

					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							

						]
					}
				};
				return objActionCol;
			},
			handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var menu = btn.menu;
				var arrMenuItems = null;
				var blnRetValue = true;
				var store = tableView.store;
				var jsonData = store.proxy.reader.jsonData;

				btn.menu.dataParams =
				{
					'record' : record,
					'rowIndex' : rowIndex,
					'columnIndex' : columnIndex,
					'view' : tableView
				};
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;
				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
							arrMenuItems[ a ].maskPosition );
						arrMenuItems[ a ].setVisible( blnRetValue );
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var sellerFilter = me.sellerFilterVal;
							var clientFilter = me.clientFilterVal == 'all' || Ext.isEmpty(me.clientFilterVal) ? getLabel('none','None') : me.clientFilterVal;
							var agreementFilter = me.agreementCodeFilterVal == 'all' || Ext.isEmpty(me.agreementCodeFilterVal) ? getLabel('none','None') : me.agreementCodeFilterVal;
							if(multipleSellersAvailable)
							{
								tip.update( getLabel( 'lbl.lmsCmtmAccountStore.seller', 'Financial Institution' ) + ' : '
								+ sellerFilter + '<br/>' + getLabel( 'grid.column.company', 'Company Name' )
								+ ':' + clientFilter + '<br/>'
								+ getLabel( 'lbl.lmsCmtmAccountStore.agreementCode', 'Agreement Code' ) + ':'
								+ agreementFilter );
							}
							else
							{
								tip.update( getLabel( 'grid.column.company', 'Company Name' )
								+ ':' + clientFilter + '<br/>'
								+ getLabel( 'lbl.lmsCmtmAccountStore.agreementCode', 'Agreement Code' ) + ':'
								+ agreementFilter );
							}
						}
					}
				} );
			},

			showEditAddressPopup : function( record, userAction )
			{
				var me = this;
				var accountNmbr;
				var clientAddress;
				var postalCode;
				var btnSave;

				if( !Ext.isEmpty( me.editAddressPopup ) )
				{
					me.editAddressPopup.destroy();
				}
				me.editAddressPopup = Ext.create( 'GCP.view.LmsCmtmAccountStoreEditAddrView',
				{
					parent : 'lmsCmtmAccountStoreViewType',
					itemId : 'lmsCmtmAccountStoreEditAddrViewPopupItemId'
				} );
				me.recordViewState = record.get( 'viewState' );

				accountNmbr = me.editAddressPopup.down( 'textfield[itemId="cmtmAccountNmbrItemId"]' );
				accountNmbr.setValue( record.get( 'accountNmbr' ) );
				accountNmbr.readOnly = true;

				clientAddress = me.editAddressPopup.down( 'textfield[itemId="addressItemId"]' );
				clientAddress.setValue( record.get( 'companyAddress' ) );

				postalCode = me.editAddressPopup.down( 'textfield[itemId="postalCodeItemId"]' );
				postalCode.setValue( record.get( 'zipCode' ) );
				
				btnSave = me.editAddressPopup.down( 'button[itemId="btnSaveItemId"]' );

				if( userAction == 'VIEW' )
				{
					me.editAddressPopup.title = getLabel( 'lbl.lmsCmtmAccountStore.addressPopupTitleView', 'View Account Address' );
					clientAddress.readOnly = true;
					postalCode.readOnly = true;
					btnSave.setDisabled( true );
				}

				me.editAddressPopup.show();
			},
			saveAddressDetails : function()
			{
				var me = this;
				var strUrl = 'cmtmUpdateCompanyAddress.srvc';
				var companyAddress = me.editAddressPopup.down( 'textfield[itemId="addressItemId"]' ).getValue();
				var zipCode = me.editAddressPopup.down( 'textfield[itemId="postalCodeItemId"]' ).getValue();
				
				if(Ext.isEmpty(companyAddress) && companyAddress.length > 255) {
					Ext.Msg.alert('Error', 'Statement Address should be less than 255 characters');
					return false;
				}
				
				if(Ext.isEmpty(zipCode) && zipCode.length > 10) {
					Ext.Msg.alert('Error', 'Postal Code should be less than 10 characters');
					return false;
				}
				
				Ext.Ajax.request(
					{
						url : 'cmtmUpdateCompanyAddress.srvc' + "?" + '$companyAddress=' + companyAddress +
						'&$zipCode=' + zipCode + '&$viewState=' +  me.recordViewState + '&' + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						//async : false,
						success : function( response )
						{
							me.editAddressPopup.destroy();
							lmsCmtmAccountStoreGrid.refreshData();
						},
						failure : function( response )
						{
							 console.log("Ajax Get data Call Failed");
						}

					} );
			}
		} );