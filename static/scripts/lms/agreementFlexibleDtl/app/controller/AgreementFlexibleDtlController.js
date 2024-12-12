Ext
	.define(
		'GCP.controller.AgreementFlexibleDtlController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.AgreementFlexibleDtlGridView','GCP.view.AgreementFlexibleDtlAttachAccountPopup'
			],
			views :
			[
				'GCP.view.AgreementFlexibleDtlView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'agreementFlexibleDtlViewRef',
					selector : 'agreementFlexibleDtlViewType'
				},
				{
					ref : 'agreementFlexibleDtlGridViewRef',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlGridViewType'
				},
				{
					ref : 'agreementDtlViewRef',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlGridViewType panel[itemId="agreementDtlViewItemId"]'
				},
				{
					ref : 'agreementFlexibleDtlGridRef',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlGridViewType agreementFlexibleDtlGroupActionViewType'
				},
				{
					ref : 'agreementFlexibleDtlFilterViewRef',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'strStructureTypeValueLabel',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType label[itemId="strStructureTypeValue"]'
				},
				{
					ref : 'strStructureSubtypeValueLabel',
					selector : 'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType label[itemId="strStructureSubtypeValue"]'
				},
				{
					ref : 'structureSubtypeRef',
					selector : 'agreementFlexibleDtlFilterViewType combobox[itemId="structureSubtypeId"]'
				},				
				{
					ref : 'attachAccountAutoCompleter',
					selector : 'attachAccountPopup AutoCompleter[itemId="attachAccountAutoCompleter"]'
				},				
				{
					ref : 'accountDescriptionRef',
					selector : 'attachAccountPopup textfield[itemId="accountDescription"]'
				},				
				{
					ref : 'priorityRef',
					selector : 'attachAccountPopup textfield[itemId="priority"]'
				},				
				{
					ref : 'accountIdRef',
					selector : 'attachAccountPopup hidden[itemId="accountId"]'
				},				
				{
					ref : 'accountCcyRef',
					selector : 'attachAccountPopup hidden[itemId="accountCcy"]'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				sellerFilterVal : 'all',
				clientFilterVal : 'all',
				structureType : 'all',
				structureSubType : 'all',
				statusType : 'all',
				filterData : [],
				filterApplied : 'ALL',
				urlGridPref : 'userpreferences/agreementMst/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/agreementMst/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/agreementMst.json',
				attachAccountPopup : null
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
				combinationList = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
					]
				} );
				
				var btnClearPref = me.getBtnClearPreferences();
				if( btnClearPref )
				{
					btnClearPref.setEnabled( false );
				}

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				me.attachAccountPopup = Ext.create( 'GCP.view.AgreementFlexibleDtlAttachAccountPopup',
				{
					parent : 'agreementFlexibleDtlViewType',
					itemId : 'attachAccountPopupId'
				} );
				me.control(
				{
					'agreementFlexibleDtlViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},
					'agreementFlexibleDtlViewType button[itemId="createNewItemId"]' :
					{
						addNewAgreementEvent : function()
						{
							showAddNewAgreement();
						}			
					
					},
					'agreementFlexibleDtlGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'agreementFlexibleDtlGridViewType smartgrid' :
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
					'agreementFlexibleDtlViewType agreementFlexibleDtlGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						},
						attachAccount : function( btn, opts )
						{							
							me.attachAccounts( btn );							
						}
					},					
					'attachAccountPopup[itemId=attachAccountPopupId]' :
					{
						saveAction : function( btn, opts )
						{
							me.submitUpdateAgreement();
						},
						updateAction : function( btn, opts )
						{
							me.updateAccountDetails();
						}
					},
					'attachAccountPopup AutoCompleter[itemId="attachAccountAutoCompleter"]' :
					{
						select : function( combo, record, index )
						{
							var objPopUp = me.getAttachAccountPopup();
							var objTextAccountDesc = objPopUp.down( 'textfield[itemId="accountDescription"]' );
							var objTextAccountNumber = objPopUp.down( 'AutoCompleter[itemId="attachAccountAutoCompleter"]' );
							var objHiddenAccountId = objPopUp.down( 'hidden[itemId="accountId"]' );
							var objHiddenAccountCcy= objPopUp.down( 'hidden[itemId="accountCcy"]' );
							objTextAccountNumber.setValue(record[0].data.CODE);
							objTextAccountDesc.setValue( record[ 0 ].data.DESCRIPTION );
							objHiddenAccountId.setValue(record[ 0 ].data.ACCTID);
							objHiddenAccountCcy.setValue(record[ 0 ].data.CCYCODE);
							
						}
					},
					'agreementFlexibleDtlFilterViewType AutoCompleter[itemId="entitledSellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getAgreementFlexibleDtlFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/sweepClientIdSeek.json';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								}
							];
							me.handleSellerFilter( record[ 0 ].data.CODE );
						}
					},
					'agreementFlexibleDtlFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleClientFilter( record[ 0 ].data.CODE );
						}
					},
					'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleClearPreferences();
						}
					},					
					'agreementFlexibleDtlViewType agreementFlexibleDtlFilterViewType button[itemId="btnFilter"]' : {
						click : function(btn, opts) {
							me.callHandleLoadGridData();
						}
					}
				} );
				$(document).on('saveAction', function(event) {
					me.submitUpdateAgreement();
				});
				$(document).on('updateAction', function(event) {
					me.submitUpdateAgreement();
				});
			},
			attachAccounts : function ( btn ) {
			
				var me = this;
				if( !Ext.isEmpty( me.attachAccountPopup ) )
				{
					me.attachAccountPopup.destroy();
				}
				me.attachAccountPopup = Ext.create( 'GCP.view.AgreementFlexibleDtlAttachAccountPopup',
				{
					parent : 'agreementFlexibleDtlViewType',
					itemId : 'attachAccountPopupId',
					mode   : 'ADD',
					cls : 'settings-popup xn-popup'
				} );				
				
				me.attachAccountPopup.down( 'button[itemId="btnSave"]' ).show();
				me.attachAccountPopup.down( 'button[itemId="btnUpdate"]' ).hide();
				me.attachAccountPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
				//me.enableDisableAccountFieldList();
				me.attachAccountPopup.show();
			
			},			
			showAttachAccountPopup : function (docmode, record) {
				
				var me = this;
				if( !Ext.isEmpty( me.attachAccountPopup ) )
				{
					me.attachAccountPopup.destroy();
				}
				attachAccountPopup = Ext.create( 'GCP.view.AgreementFlexibleDtlAttachAccountPopup',
				{
					parent : 'agreementFlexibleDtlViewType',
					itemId : 'attachAccountPopupId',
					mode : docmode,
					identifier : record.data.identifier,
					userMessage : null,
					fromAccId	: record.data.fromAccId,
					fromAccNmbr : record.data.fromAccNmbr,
					fromAccDesc : record.data.fromAccDesc,
					fromAccCcy	: record.data.fromAccCcy,
					priority : record.data.priority
				} );
				
				 if('EDIT'===docmode)
					{
					 attachAccountPopup.down( 'AutoCompleter[itemId="attachAccountAutoCompleter"]' ).setValue(record.data.fromAccNmbr);
					 attachAccountPopup.down( 'textfield[itemId="accountDescription"]' ).setValue(record.data.fromAccDesc);					
					 attachAccountPopup.down( 'hidden[itemId="accountId"]' ).setValue(record.data.fromAccId);
					 attachAccountPopup.down( 'hidden[itemId="accountCcy"]' ).setValue(record.data.fromAccCcy);
					 attachAccountPopup.down( 'textfield[itemId="priority"]' ).setValue(record.data.priority);
					 attachAccountPopup.down( 'button[itemId="btnSave"]' ).hide();
					 attachAccountPopup.down( 'button[itemId="btnUpdate"]' ).show();
					 attachAccountPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
					}
				 if('VIEW' ===docmode)
				 {
					 attachAccountPopup.down( 'AutoCompleter[itemId="attachAccountAutoCompleter"]' ).setValue(record.data.fromAccNmbr);
					 attachAccountPopup.down( 'AutoCompleter[itemId="attachAccountAutoCompleter"]' ).setDisabled(true);
					 attachAccountPopup.down( 'textfield[itemId="accountDescription"]' ).setValue(record.data.fromAccDesc);
					 attachAccountPopup.down( 'textfield[itemId="accountDescription"]' ).setDisabled(true);
					 attachAccountPopup.down( 'hidden[itemId="accountId"]' ).setValue(record.data.fromAccId);
					 attachAccountPopup.down( 'hidden[itemId="accountCcy"]' ).setValue(record.data.fromAccCcy);
					 attachAccountPopup.down( 'button[itemId="btnSave"]' ).hide();
					 attachAccountPopup.down( 'button[itemId="btnUpdate"]' ).hide();
					 attachAccountPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
					 
				 }
				 
				 (attachAccountPopup).show();
				
				
			},
			submitUpdateAgreement : function(identifier) {
				var me = this;
				var arrayJson = new Array();
				var grid = me.getAgreementFlexibleDtlGridRef();
				arrayJson.push({
								serialNo : 0,
								identifier : identifier,
								userMessage : null,
								fromAccId	: acctCode,								
								fromAccNmbr : acctId,
								fromAccDesc : acctDesc,
								fromAccCcy  : ccyCode
							});
				
				if(!errorFlag)
				Ext.Ajax.request({
							url : 'attachAccountToFlexible.srvc?id='+ encodeURIComponent(document.getElementById("viewState").value) +'&'+csrfTokenName+'='+csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							async : false,
							success : function(response) {
								// TODO : Action Result handling to be done
								// here
								var jsonRes = Ext.JSON.decode(response.responseText);
								var errors = '';
								for (var i in jsonRes) {
									if (jsonRes[i].errors) {
										for (var j in jsonRes[i].errors) {
											errors += jsonRes[i].errors[j].code + '-' +jsonRes[i].errors[j].errorMessage + "<br\>";
										}
									}
								}
								if (errors != '') {
									errMsg = errors;
									errorFlag = true;
								}
								else
									errorFlag = false;
								if(!Ext.isEmpty(grid)){
									if(!errorFlag)
									{
									if(jsonRes[0] !== undefined)
									document.getElementById("viewState").value = jsonRes[0].updatedStatus;
								}								
								}
								grid.refreshData();
							},
							failure : function() {
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel('instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});

			},
			checkMandatoryFields : function( mandatoryFieldsArray, errorLabelObj )
			{
				var me = this;
				var fieldValue = null;
				var isMandatoryError = false;
				for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
				{
					if( !mandatoryFieldsArray[ i ].isDisabled() )
					{
						fieldValue = mandatoryFieldsArray[ i ].getValue();
						if( fieldValue == null || fieldValue.trim() == '' )
						{
							isMandatoryError = true;
							me.showMandatoryError( errorLabelObj );
							break;
						}
					}
				}
				return isMandatoryError;
			},
			showMandatoryError : function( errorLabelObj )
			{
				//errorLabelObj.setText( getLabel( 'lblMandatoryCheckMsg', 'Please Enter All Mandatory Fields' ) );
				//errorLabelObj.show();
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel('lblMandatoryCheckMsg',
													'Please Enter All Mandatory Fields!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
			},
			showValidationError : function( errorLabelObj )
			{
				//errorLabelObj.setText( getLabel( 'lblValidateCheckMsg', 'Please Enter Valid Data' ) );
				//errorLabelObj.show();
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel('lblValidateCheckMsg',
													'Please Enter Valid Data'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
			},
			addDetail : function (urlPost)
			{
				var frm = document.forms[ "frmMain" ];
				frm.action = urlPost;
				frm.method = "POST";
				frm.submit();
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;				
				var jsonArray = [];
				if( me.sellerFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : me.sellerFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.clientFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.structureType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'structureType',
						paramValue1 : me.structureType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.structureSubType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'structureSubType',
						paramValue1 : me.structureSubType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				if( me.statusType != 'all' )
				{
					
					jsonArray.push(
					{
						paramName : 'statusFilter',
						paramValue1 : me.statusType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
					
				return jsonArray;
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var agreementMstGrid = me.getAgreementFlexibleDtlGridRef();
				var objConfigMap = me.getAgreementFlexibleDtlNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( agreementMstGrid ) )
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
				var pgSize = null;
				pgSize = 10;
				agreementMstGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					enableColumnHeaderMenu : false,
					showSummaryRow : false,
					padding : '5 0 0 0',
					checkBoxColumnWidth : 40,
					showCheckBoxColumn  : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 40,
					maxHeight : 400,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleRowMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					},
					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex,menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,dataParams.rowIndex,dataParams.columnIndex,menu, null,dataParams.record);
					}
				} );

				var agreementDtlView = me.getAgreementDtlViewRef();
				agreementDtlView.add( agreementMstGrid );
				agreementDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if(actionName === 'btnDelete') {					

					var me = this;
					
					var strAction = 'discard';
					var strUrl = Ext.String.format( 'agreementFlexibleDtl/{0}.srvc?', strAction );
					strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
					var grid = this.getAgreementFlexibleDtlGridRef();
					if( !Ext.isEmpty( grid ) )
					{
						var arrayJson = new Array();
						var record = grid.getRecord(rowIndex+1);						
						var cmdViewState =  document.getElementById("viewState").value;
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( record ) + 1,
								identifier : record.data.identifier,
								userMessage : cmdViewState
							} );
						
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
								// TODO : Action Result handling to be done
								// here
								//me.enableDisableGroupActions( '0000000000', true );
								var jsonData = Ext.decode(response.responseText);								
								document.getElementById("viewState").value = jsonData[0].updatedStatus;								
								grid.refreshData();
								
							},
							failure : function()
							{
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

				
					//me.submitForm( 'deleteAgreementDtlFlexible.srvc', record, rowIndex );
				}
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'enable' || actionName === 'disable' || actionName === 'submit' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					popUpMode = 'V';
					showPopup('FlexibleDetailsPopupView',record);
				}			
				else if( actionName === 'btnEdit' )
				{
					popUpMode = 'E';
					showPopup('FlexibleDetailsPopup',record);
				}				
				else if( actionName === 'btnTreeView' )
				{
					showAgreementNotionalTree( 'viewAgreementMstTree.srvc', record, rowIndex );
				}
			},
			submitForm : function( strUrl, record, rowIndex )
			{
				var me= this;
				var form;
				var viewState = record.get( 'viewState' );

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'cmdViewState', $('#viewState').val() ) );
				form.action = strUrl;
				form.submit();
			},
			showHistory : function( url, id )
			{
				Ext.create( 'GCP.view.AgreementMstHistoryView',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id
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
				var viscols;
				var col = null;
				var visColsStr = "";
				var colMap = new Object();
				var colArray = new Array();

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/agreementMst/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getAgreementNotionalGridRef();
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
			getAgreementFlexibleDtlNewConfiguration : function()
			{
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
						"fromAccNmbr" : 250,
						"fromAccDesc" : 250,
						"fromAccCcy" : 250,
						"priority" : 250					
				};
				arrColsPref = [{
					"colId" : "fromAccNmbr",
					"colDesc" : getLabel( 'fromAccNmbr', 'Account' )
				},
				{
					"colId" : "fromAccDesc",
					"colDesc" : getLabel( 'fromAccDesc', 'Account Name' )
				},				
				{
					"colId" : "fromAccCcy",
					"colDesc" : getLabel( 'fromAccCcy', 'Account Currency' )
				},
				{
					"colId" : "priority",
					"colDesc" : getLabel( 'priority', 'Priority' )
				}];

				storeModel = {
						fields :
							[
								'fromAccNmbr', 'fromAccDesc', 'priority', 'fromAccCcy','fromAccId',
								 'identifier', '__metadata','viewState'
							],
					proxyUrl : 'getAgreementFlexibleDtlList.srvc',
					rootNode : 'd.agreementSweepDtlList',
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
			handleSellerFilter : function( selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
			},
			handleClientFilter : function( selectedValue )
			{
				var me = this;				
				me.clientFilterVal = selectedValue;
			},
			handleStructureTypeFilter : function( record )
			{
				var me = this;
			    me.structureType = record[0].data.key;
			},			
			handleStatusTypeFilter : function( btn )
			{
				var me = this;
				me.statusType = btn.value;
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getAgreementFlexibleDtlGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );				
				strUrl = strUrl + '&id=' + encodeURIComponent( viewState )+ '&' + csrfTokenName + "=" + csrfTokenValue;				
				grid.loadGridData( strUrl, null );
			},
			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false';

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
				var buttonMask = '0000000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},
			handleGroupActions : function( btn, record )
			{
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'agreementFlexibleDtl/{0}.srvc?', strAction );
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
					titleMsg = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					fieldLbl = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style :
					{
						height : 400
					},
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
			},

			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getAgreementFlexibleDtlGridRef();
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
							// TODO : Action Result handling to be done
							// here
							me.enableDisableGroupActions( '0000000000', true );
							grid.refreshData();
						},
						failure : function()
						{
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
				var retValue = true;
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
			enableDisableGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
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
				//arrCols.push( me.createGroupActionColumn() );
				if(docmode === 'ADD' || docmode === 'EDIT')
				arrCols.push( me.createActionColumn() );
				else
				arrCols.push( me.createViewActionColumn() );	
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						cfgCol.sortable = false;

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						/*if( objCol.colId === 'invoiceNumber' )
						{
							cfgCol.width = 190;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getAgreementNotionalGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if( null != strSubTotal && strSubTotal != ' ' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}
						if( objCol.colId === 'paidAmount' )
						{
							cfgCol.align = 'right';
							cfgCol.width = 100;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var grid = me.getAgreementNotionalGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != ' ' )
											strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
						}*/
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
				strRetValue = value;
				if (!Ext.isEmpty(viewMode) && viewMode === 'MODIFIEDVIEW'
					&& !Ext.isEmpty(record) && !Ext.isEmpty(record.raw)
					&& !Ext.isEmpty(record.raw.profileFieldType)) {
				if (record.raw.profileFieldType === "NEW")
					strRetValue = '<span class="newFieldValue">' + strRetValue
							+ '</span>';
				else if (record.raw.profileFieldType === "MODIFIED")
					strRetValue = '<span class="modifiedFieldValue">' + strRetValue
							+ '</span>';
				else if (record.raw.profileFieldType === "DELETED")
					strRetValue = '<span class="deletedFieldValue">' + strRetValue
							+ '</span>';
			}
				return strRetValue;
			},
			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'groupaction',
					width : 100,
					sortable : false,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'submit',
							itemCls : 'grid-row-text-icon icon-submit-text',
							toolTip : getLabel( 'submit', 'Submit' ),
							maskPosition : 1
						},
						{
							itemId : 'accept',
							itemCls : 'grid-row-text-icon icon-auth-text',
							toolTip : getLabel( 'approve', 'Approve' ),
							maskPosition : 2
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
							{
								itemId : 'reject',
								itemLabel : getLabel( 'reject', 'Reject' ),
								maskPosition : 3
							},
							{
								itemId : 'enable',
								itemLabel : getLabel( 'enable', 'Enable' ),
								maskPosition : 4
							},
							{
								itemId : 'disable',
								itemLabel : getLabel( 'disable', 'Disable' ),
								maskPosition : 5
							},
							{
								itemId : 'discard',
								itemLabel : getLabel( 'discard', 'Discard' ),
								maskPosition : 6
							}
						]
					}
				};
				return objActionCol;
			},
			createActionColumn : function()
			{
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					colHeader : 'Actions',
					sortable : false,
					align : 'left',
					width : 150,
					locked : true,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						},
						/* Edit action is not required hence commenting.
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel( 'editToolTip', 'Edit Record' ),
							maskPosition : 8
						},*/
						{
							itemId : 'btnDelete',
							itemCls : 'grid-row-action-icon icon_deleted',
							toolTip : getLabel( 'deleteToolTip', 'Delete Record' ),
							itemLabel : getLabel( 'deleteToolTip', 'Delete Record' ),
							maskPosition : 8
						}
					]

				};
				return objActionCol;
			},
			createViewActionColumn : function()
			{
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					colHeader : 'Actions',
					sortable : false,
					align : 'left',
					width : 150,
					locked : true,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						}
					]

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
				Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var dateFilter = me.dateFilterLabel;

							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}

							tip.update( getLabel( 'date', 'Date' ) + ' : ' + dateFilter + '<br/>'
								+ getLabel( 'advancedFilter', 'Advance Filter' ) + ':' + advfilter );
						}
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			handleSavePreferences : function()
			{
			},
			handleClearPreferences : function()
			{
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var grid = me.getAgreementFlexibleDtlGridRef();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' )
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							} );

					}
					objPref.pgSize = grid.pageSize;
					objPref.gridCols = arrColPref;
					arrPref.push( objPref );
				}

				if( arrPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( arrPref ),
						success : function( response )
						{
							var responseData = Ext.decode( response.responseText );
							var isSuccess;
							var title, strMsg, imgIcon;
							if( responseData.d.preferences && responseData.d.preferences.success )
								isSuccess = responseData.d.preferences.success;
							if( isSuccess && isSuccess === 'N' )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.getBtnSavePreferences().setDisabled( false );
								title = getLabel( 'SaveFilterPopupTitle', 'Message' );
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show(
								{
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									icon : imgIcon
								} );

							}
							else
								me.saveFilterPreferences();
						},
						failure : function()
						{
							Ext.MessageBox.show(
							{
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );

			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var objFilterPref = {};

				var objQuickFilterPref = {};
				objQuickFilterPref.sellerId = me.sellerFilterVal;
				objQuickFilterPref.clientId = me.clientFilterVal;
				objQuickFilterPref.structureType = me.structureType;
				//objQuickFilterPref.structureSubType = me.structureSubType;

				objFilterPref.quickFilter = objQuickFilterPref;

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'SaveFilterPopupTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSavedMsg', 'Preferences Saved Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.toggleSavePrefrenceAction( true );
								Ext.MessageBox.show(
								{
									title : title,
									msg : data.d.error.errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						},
						failure : function()
						{
							Ext.MessageBox.show(
							{
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function()
			{
				var me = this, arrCols = null, objCol = null, objWdgtPref = null;
				var strUrl = me.commonPrefUrl + "?$clear=true";
				var grid = me.getAgreementFlexibleDtlGridRef();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction'
							&& objCol.dataIndex != null )
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							} );

					}
					objWdgtPref = {};
					objWdgtPref.pgSize = grid.pageSize;
					objWdgtPref.gridCols = arrColPref;
					arrPref.push(
					{
						"module" : "",
						"jsonPreferences" : objWdgtPref
					} );
				}
				if( arrPref )
				{
					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrPref ),
						success : function( response )
						{
							var responseData = Ext.decode( response.responseText );
							var isSuccess;
							var title, strMsg, imgIcon;
							if( responseData.d.preferences && responseData.d.preferences.success )
								isSuccess = responseData.d.preferences.success;
							if( isSuccess && isSuccess === 'N' )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.toggleSavePrefrenceAction( true );
								title = getLabel( 'SaveFilterPopupTitle', 'Message' );
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show(
								{
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									icon : imgIcon
								} );

							}
							else
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefClearedMsg', 'Preferences Cleared Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}

						},
						failure : function()
						{
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}
			},
			updateFilterConfig : function()
			{
				var me = this;
				if( !Ext.isEmpty( objDefaultGridViewPref ) )
				{
					var data = Ext.decode( objDefaultGridViewPref );

					me.sellerFilterVal = data.quickFilter.sellerId;
					me.clientFilterVal = data.quickFilter.clientId;
					me.structureType = data.quickFilter.structureType;
					me.structureSubType = data.quickFilter.structureSubType;
				}

				me.filterData = me.getQuickFilterQueryJson();
			}
		} );
