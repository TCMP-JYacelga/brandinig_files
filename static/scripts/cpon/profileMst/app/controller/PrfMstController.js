Ext.define('GCP.controller.PrfMstController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.PrfMstGridView', 'GCP.view.HistoryPopup'],
	views : ['GCP.view.PrfMstView', 'GCP.view.PrfMstAdminProfileView',
			'GCP.view.PrfFilterView', 'GCP.view.PrfMstBRProfileView',
			'GCP.view.PrfMstPaymentProfileView',
			'GCP.view.PrfMstChecksProfileView','GCP.view.FscPrfMenu',
			'GCP.view.PrfMstOthersProfileView','GCP.view.PrfMstLiquidityProfileView','GCP.view.PayFeaturePopup','GCP.view.PrfMstFscProfileView',
			'GCP.view.PrfMstCollectionProfileView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'prfMstView',
				selector : 'prfMstView'
			}, {
				ref : 'prfMstViewTabPanel',
				selector : 'prfMstView tabpanel[itemId=prfMstViewTabPanel]'
			}, {
				ref : 'adminPrfMenuPanel',
				selector : 'prfMstView prfMstAdminProfileView panel[itemId=adminPrfMenuPanel]'
			}, {
				ref : 'adminPrfMenu',
				selector : 'prfMstView prfMstAdminProfileView adminPrfMenu'
			}, {
				ref : 'brPrfMenu',
				selector : 'prfMstView prfMstBRProfileView brPrfMenu'
			}, {
				ref : 'checksPrfMenu',
				selector : 'prfMstView prfMstChecksProfileView checksPrfMenu'
			}, {
				ref : 'paymentPrfMenu',
				selector : 'prfMstView prfMstPaymentProfileView paymentPrfMenu'
			}, {
				ref : 'incomingPaymentsPrfMenu',
				selector : 'prfMstView prfMstIncomingPaymentsProfileView incomingPaymentsPrfMenu'
			}, {
				ref : 'othersPrfMenu',
				selector : 'prfMstView prfMstOthersProfileView othersPrfMenu'
			}, {
				ref : 'fscPrfMenu',
				selector : 'prfMstView prfMstFscProfileView fscPrfMenu'
			}, {
				ref : 'liquidityPrfMenu',
				selector : 'prfMstView prfMstLiquidityProfileView liquidityPrfMenu'
			},{
				ref : 'collectionPrfMenu',
				selector : 'prfMstView prfMstCollectionProfileView collectionPrfMenu'
			},{
				ref : 'brPrfMenuPanel',
				selector : 'prfMstView prfMstBRProfileView panel[itemId=brPrfMenuPanel]'
			}, {
				ref : 'checksPrfMenuPanel',
				selector : 'prfMstView prfMstChecksProfileView panel[itemId=checksPrfMenuPanel]'
			}, {
				ref : 'pmtPrfMenuPanel',
				selector : 'prfMstView prfMstPaymentProfileView panel[itemId=pmtPrfMenuPanel]'
			}, {
				ref : 'fscPrfMenuPanel',
				selector : 'prfMstView prfMstFscProfileView panel[itemId=fscPrfMenuPanel]'
			}, {
				ref : 'incomingPaymentsPrfMenuPanel',
				selector : 'prfMstView prfMstIncomingPaymentsProfileView panel[itemId=incomingPaymentsPrfMenuPanel]'
			}, {
				ref : 'othersPrfMenuPanel',
				selector : 'prfMstView prfMstOthersProfileView panel[itemId=othersPrfMenuPanel]'
			}, {
				ref : 'liquidityPrfMenuPanel',
				selector : 'prfMstView prfMstLiquidityProfileView panel[itemId=liquidityPrfMenuPanel]'
			},{
				ref : 'collectionPrfMenuPanel',
				selector : 'prfMstView prfMstCollectionProfileView panel[itemId=collectionPrfMenuPanel]'
			}, {
				ref : 'brItemsInfoBar',
				selector : 'prfMstView prfMstBRProfileView panel[itemId="brItemsInfoBar"]'
			}, {
				ref : 'pmtItemsInfoBar',
				selector : 'prfMstView prfMstPaymentProfileView panel[itemId="pmtItemsInfoBar"]'
			}, {
				ref : 'prfMstDtlView',
				selector : 'prfMstView prfMstGridView panel[itemId="prfMstDtlView"]'
			}, {
				ref : 'prfMstGridView',
				selector : 'prfMstView prfMstGridView'
			}, {
				ref : 'addNewProfileId',
				selector : 'prfMstView prfMstGridView button[itemId="addNewProfileId"]'
			}, {
				ref : 'btnSystemBeneProfile',
				selector : 'prfMstView prfMstGridView button[itemId="btnSystemBeneProfile"]'
			}, {
				ref : 'btnAchPassThruBeneProfile',
				selector : 'prfMstView prfMstGridView button[itemId="btnAchPassThruBeneProfile"]'
			}, {
				ref : 'btnBeneficiary',
				selector : 'prfMstView prfMstGridView button[itemId="btnBeneficiary"]'
			}, {
				ref : 'btnAchPassThru',
				selector : 'prfMstView prfMstGridView button[itemId="btnAchPassThru"]'
			}, {
				ref : 'selectedGridToolbar',
				selector : 'prfMstView prfMstGridView toolbar[itemId="btnActionToolBar"]'
			}, {
				ref : 'prfMstGrid',
				selector : 'prfMstView prfMstGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTxnTextInput',
				selector : 'prfMstGridView textfield[itemId="searchTxnTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'prfMstGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'prfFilterView',
				selector : 'prfMstView prfFilterView'
			}, {
				ref : 'actionBarSummDtl',
				selector : 'prfMstView prfMstGridView prfMstGroupActionBarView'
			},
			{
				ref : 'apprvOptCheckboxGroup',
				selector : 'payFeaturePopup[itemId="payFeaturePopup"] checkboxgroup[itemId="options"]'
			},
			 {
                ref: 'pmtPkgCheckboxGroup',
                selector :'payFeaturePopup[itemId="payFeaturePopup"] checkboxgroup[itemId="paymentPackages"]'
            },
            {
                ref: 'pmtWorkFlowDefCheckboxGroup',
                selector :'payFeaturePopup[itemId="payFeaturePopup"] checkboxgroup[itemId="paymentWorkflowDefinition"]'
            },
			{
                ref: 'prfSellerPanel',
                selector :'prfMstView container[itemId="sellerPanel"]'
            }
			],
	config : {
		selectedPrfMst : 'alert',
		adminSelectedPrfMst : null,
		paymentSelectedPrfMst : null,
		brSelectedPrfMst : null,
		incomingPaymentSelectedPrfMst : null,
		othersSelectedPrfMst : null,
		fscSelectedPrfMst : null,
		liquiditySelectedPrfMst : null,
		collectionSelectedPrfMst : null,
		strBackFromProfileFlag : false,
		filterData : [],
		profileNameVal : null,
		statusVal : null,
		moduleVal : null,
		categoryVal : null,
		subCategoryVal : null,
		activeFilter : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;


		me.control({
			
			'prfMstView' : {
				beforerender : function(panel, opts) {
					me.loadDetailCount();
					var tempPan = me.getPrfMstViewTabPanel();
					if (null != strSelectedProfile
							&& 'alert' != strSelectedProfile) {
						me.strBackFromProfileFlag = true;
						me.selectedPrfMst = strSelectedProfile;
						me.handleProfileSpecificBackAction(strSelectedProfile,
								tempPan);
					}
					me.handleTabVisibility();

				},
				afterrender : function(panel, opts) {},
				addAlertEvent : function(btn) {
					me.handleAddNewProfileMaster(btn);
				},
				changePkgProductList : function(btn, type) {
					me.handlePackageProductList(btn, type);
				}
			},
			'prfMstView tabpanel[itemId=prfMstViewTabPanel]' : {
				tabchange : function(panel, newTab, oldTab) {
					if (!me.strBackFromProfileFlag) {
						if (newTab.name === 'payment') {
							var profileMenu = me.getPaymentPrfMenu();
							me.selectedPrfMst = profileMenu.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("payment");
							me.changePaymentFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'br') {
							var profileMenu = me.getBrPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("br");
							me.changeBRFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'check') {
							var profileMenu = me.getChecksPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("check");
							me.changeChecksFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'incomingPayments') {
							var profileMenu = me.getIncomingPaymentsPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me
									.getActiveFilter("incomingPayments");
							me
									.changeIncomingPaymentsFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'others') {
							var profileMenu = me.getOthersPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("others");
							me.changeOthersFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'fsc') {
							var profileMenu = me.getFscPrfMenu();
							me.selectedPrfMst = profileMenu.getselectedProfileMenu();
							me.selectedPrfMst = 'workflow'
							me.activeFilter = me.getActiveFilter("fsc");
							me.changeFscFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'liquidity') {
							var profileMenu = me.getLiquidityPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("liquidity");
							me.changeLiquidityFilterView(me.selectedPrfMst);
						} else if (newTab.name === 'Receivable') {
							var profileMenu = me.getCollectionPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("Receivable");
							me.changeCollectionFilterView(me.selectedPrfMst);
						} else {
							var profileMenu = me.getAdminPrfMenu();
							me.selectedPrfMst = profileMenu
									.getselectedProfileMenu();
							me.activeFilter = me.getActiveFilter("admin");
							me.changeAdminFilterView(me.selectedPrfMst);
						}
						me.handlePrfMenuClick(newTab.name);
					}
				},
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.activeFilter = me.getActiveFilter('admin');
					}
				}
			},

			'prfMstView prfMstAdminProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstAdminProfileView();
						var adminView = me.getAdminPrfMenuPanel();
						var fltView = adminView
								.down('panel[itemId=adminPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, me.selectedPrfMst);
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeAdminFilterView(c.name);
					me.handlePrfMenuClick();

				}
			},
			'prfMstView prfMstBRProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstBrProfileView();
						var brView = me.getBrPrfMenuPanel();
						var fltView = brView
								.down('panel[itemId=brPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'typecode');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeBRFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},
			'prfMstView prfMstChecksProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstChecksProfileView();
						var checksView = me.getChecksPrfMenuPanel();
						var fltView = checksView
								.down('panel[itemId=checksPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'check');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeChecksFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},

			'prfMstView prfMstPaymentProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstPaymentProfileView();
						var pmtView = me.getPmtPrfMenuPanel();
						var fltView = pmtView
								.down('panel[itemId=paymentPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'paymentWorkflow');
					}
				},
				menuClick : function(c) {
					
						me.selectedPrfMst = c.name;
						me.changePaymentFilterView(c.name);
						me.handlePrfMenuClick();
					
				}
			},

			'prfMstView prfMstIncomingPaymentsProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstIncomingPaymentsProfileView();
						var pmtView = me.getIncomingPaymentsPrfMenuPanel();
						var fltView = pmtView
								.down('panel[itemId=incomingPaymentsPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'incomingPayment');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeIncomingPaymentsFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},

			'prfMstView prfMstOthersProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstOthersProfileView();
						var pmtView = me.getOthersPrfMenuPanel();
						var fltView = pmtView
								.down('panel[itemId=othersPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'others');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeOthersFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},

			'prfMstView prfMstFscProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstFscProfileView();
						var pmtView = me.getFscPrfMenuPanel();
						var fltView = pmtView.down('panel[itemId=fscPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'fsc');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeFscFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},
			'prfMstView prfMstLiquidityProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstLiquidityProfileView();
						var pmtView = me.getLiquidityPrfMenuPanel();
						var fltView = pmtView
								.down('panel[itemId=liquidityPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'liquidity');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeLiquidityFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},	
			'prfMstView prfMstCollectionProfileView' : {
				afterrender : function(panel, opts) {
					if (!me.strBackFromProfileFlag) {
						me.handlePrfMstCollectionProfileView();
						var pmtView = me.getCollectionPrfMenuPanel();
						var fltView = pmtView.down('panel[itemId=collectionPrfFilterView]');
						var config = me.filterConfiguration();
						fltView.renderFilterView(config, 'Receivable');
					}
				},
				menuClick : function(c) {
					me.selectedPrfMst = c.name;
					me.changeCollectionFilterView(c.name);
					me.handlePrfMenuClick();
				}
			},			
			'prfMstGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				},
				afterrender : function(panel) {
					me.strBackFromProfileFlag = false;
				}
			},

			'prfMstGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}

			},
			'prfMstGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'prfMstGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'prfMstView prfFilterView button[itemId="filterBtnId"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'prfMstView prfMstGridView toolbar[itemId=prfMstGroupActionBarView_summDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'payFeaturePopup[itemId="payFeaturePopup"]':{
				pmtPkgCheckBoxClicked:function(checkbox,value) {
				/*	if(!Ext.isEmpty(checkbox.featureId) && checkbox.featureId=="EDITEXITING"){
					if(value){
							this.enableDisableDependantChkboxes(value);
					}else{
						this.enableDisableDependantChkboxes(value);
					}
				}*/
			},
			show:function(popup){
					me.enableDisableApprvOpts();
			}
			},
			'prfMstView combobox[itemId="sellerCode_id"]' : {
				select : function(combo, record) {
					var newValue = combo.getValue();
					setAdminSeller(newValue);
					selectedSellerCode = newValue;
					me.setDataForFilter();
					me.applyFilter();
				}
			}
			
		});
	},
		enableDisableDependantChkboxes:function(value){
		var me=this;
		var pmtPkgCheckboxGroupRef=me.getPmtPkgCheckboxGroup();
		var pmtWorkFlowDefCheckboxGroupRef=me.getPmtWorkFlowDefCheckboxGroup();
		
		if(!Ext.isEmpty(pmtPkgCheckboxGroupRef)){
			var groupItems=pmtPkgCheckboxGroupRef.items;
			for(var index=0;index<groupItems.length;index++){
				var currentChkBox=groupItems.items[index];
				/*if(currentChkBox.featureId=="CLONEPACKAGE"){
					currentChkBox.setValue(false);
					
					if(value)
					currentChkBox.setDisabled(false);
					else
					currentChkBox.setDisabled(true);
				}*/
			}
		}
		
		if(!Ext.isEmpty(pmtWorkFlowDefCheckboxGroupRef)){
			var groupItems=pmtWorkFlowDefCheckboxGroupRef.items;
			for(var index=0;index<groupItems.length;index++){
				var currentChkBox=groupItems.items[index];
				/*if(currentChkBox.featureId=="EDITSTNDWORKFLOW" || currentChkBox.featureId=="NEWWORKFLOWDEF"){
					currentChkBox.setValue(false);
					
					if(value)
					currentChkBox.setDisabled(false);
					else
					currentChkBox.setDisabled(true);
				}*/
			}
		}
	},
	enableDisableApprvOpts:function(){
	var me=this;
	var apprvOptCheckboxGroupRef=me.getApprvOptCheckboxGroup();
	if(!Ext.isEmpty(apprvOptCheckboxGroupRef)){
			var groupItems=apprvOptCheckboxGroupRef.items;
			for(var index=0;index<groupItems.length;index++){
				var currentChkBox=groupItems.items[index];
				if(currentChkBox.featureId=="APPRPASSTHRU"){
					if(passThroughFeatureSelected)
					currentChkBox.setDisabled(false);
					else
					currentChkBox.setDisabled(true);
					
					currentChkBox.setValue(false);
					
				}
			}
		}
	},
	
	handleEntryAction : function(btn, Url) {
		var me = this;
		var form;
		var strUrl = Url;
		var errorMsg = null;
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileMstName', btn.name));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileViewState', $('#viewState').val())); // Temprary
			// Changes
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	},

	showSystemBeneficiaryGrid : function() {
		var me = this;
		me.selectedPrfMst = 'systemBene';
		me.getBtnSystemBeneProfile().setDisabled(true);
		me.getBtnBeneficiary().setDisabled(false);
		me.getBtnBeneficiary().addCls('underlined');
		me.getBtnSystemBeneProfile().removeCls('underlined');
		me.selectedPrfMst === 'systemBene';
		me.handlePrfMenuClick();
	},
	
	showAchPassThruGrid : function() {
		var me = this;
		me.selectedPrfMst = 'achPassThru';
		me.getBtnAchPassThruBeneProfile().setDisabled(true);
		me.getBtnBeneficiary().setDisabled(false);
		me.getBtnAchPassThru().addCls('underlined');
		me.getBtnAchPassThru().removeCls('underlined');
		me.selectedPrfMst === 'achPassThru';
		me.handlePrfMenuClick();
	},	
	handleTabChange : function(panel, newTabName, oldTab, strSelectedPrf) {
		var me = this;
		me.selectedPrfMst = strSelectedPrf;
		var btn = panel.activeTab.down('label[itemId=alert]');
		if (newTabName === 'payment') {
			me.activeFilter = me.getActiveFilter('payment');
			me.changePaymentFilterView(strSelectedPrf);
		} else if (newTabName === 'br') {
			me.activeFilter = me.getActiveFilter('br');
			me.changeBRFilterView(strSelectedPrf);
		} else if (newTabName === 'check') {
			me.activeFilter = me.getActiveFilter('check');
			me.changeChecksFilterView(strSelectedPrf);
		} else if (newTabName === 'incomingPayments') {
			me.activeFilter = me.getActiveFilter('incomingPayments');
			me.changeIncomingPaymentsFilterView(strSelectedPrf);
		} else if (newTabName === 'others') {
			me.activeFilter = me.getActiveFilter('others');
			me.changeOthersFilterView(strSelectedPrf);
		} else if (newTabName === 'fsc') {
			me.activeFilter = me.getActiveFilter('fsc');
			me.changeFscFilterView(strSelectedPrf);
		} else if (newTabName === 'liquidity') {
			me.activeFilter = me.getActiveFilter('liquidity');
			me.changeLiquidityFilterView(strSelectedPrf);
		} else if (newTabName === 'Receivable') {
			me.activeFilter = me.getActiveFilter('Receivable');
			me.changeCollectionFilterView(strSelectedPrf);
		} else {
			me.activeFilter = me.getActiveFilter('admin');
			me.changeAdminFilterView(strSelectedPrf);
		}
		me.handlePrfMenuClick();
	},

	handleProfileSpecificBackAction : function(strSelectedProfile, tempPan) {
		var me = this;
		switch (strSelectedProfile) {
			case 'alert' :
			case 'report' :
			case 'interface' :
			case 'limit' :
			case 'tax' :
			case 'chargeFrequency' :
			case 'charge' :
			case 'cutoff' :
			case 'adminfeature' :
			case 'fxSpread' :
			case 'password' :
			case 'token':
			case 'groupBy':
			case 'schedule':
			case 'arrangement':
				me.handleTabChange(tempPan, 'admin', '', strSelectedProfile);
				tempPan.setActiveTab('adminPrftab');
				break;
			case 'paymentWorkflow' :
			case 'systemBene' :
			case 'achPassThru' :
			/*case 'paymentPackage' :*/
			case 'paymentFeature' :
				me.handleTabChange(tempPan, 'payment', '', strSelectedProfile);
				tempPan.setActiveTab('paymentsPrftab');
				break;
			case 'typecode' :
				me.handleTabChange(tempPan, 'br', '', strSelectedProfile);
				tempPan.setActiveTab('brPrftab');
				break;
			case 'check' :
				me.handleTabChange(tempPan, 'check', '', strSelectedProfile);
				tempPan.setActiveTab('checksPrftab');
				break;
			case 'incomingPayment' :
			case 'positivePay' :
				me.handleTabChange(tempPan, 'incomingPayments', '',
						strSelectedProfile);
				tempPan.setActiveTab('incomingPaymentsPrftab');
				break;
			case 'others' :
				me.handleTabChange(tempPan, 'others', '', strSelectedProfile);
				tempPan.setActiveTab('othersPrftab');
				break;
			case 'liquidity' :
				me.handleTabChange(tempPan, 'liquidity', '', strSelectedProfile);
				tempPan.setActiveTab('liquidityPrftab');
				break;	
			case 'Receivable':
				me.handleTabChange(tempPan, 'Receivable', '', strSelectedProfile);
				tempPan.setActiveTab('collectionPrftab');
				break;					
			case 'workflow' :
			case 'overdue' :
			case 'financing' :
			case 'fsc' :				
				me.handleTabChange(tempPan, 'fsc', '', strSelectedProfile);
				tempPan.setActiveTab('fscPrftab');
				break;
		}
	},

	handlePackageProductList : function(btn, type) {
		var me = this;
		var gridViewPanel = me.getPrfMstDtlView();
		var actionToolBarContainer = gridViewPanel
				.down('container[itemId=actionToolBar]');
		var btnPkgList = gridViewPanel.down('button[itemId=btnPkgList]');
		var btnProductList = gridViewPanel
				.down('button[itemId=btnProductList]');
		if (type === 'showproduct') {
			actionToolBarContainer.hide();
			btnProductList.setText(getLabel('showAllProduct',
					'Show All Product'));
			btnProductList.addCls('font_bold');

			btnPkgList.setText('<span class="button_underline thePoniter ux_font-size14-normal">'
					+ getLabel('showAllPackages', 'Show All Packages')
					+ '</span>');
			btnPkgList.removeCls('font_bold');
			me.handleSmartProductGridConfig();
		} else {
			actionToolBarContainer.show();
			btnPkgList
					.setText(getLabel('showAllPackages', 'Show All Packages'));
			btnPkgList.addCls('font_bold');
			btnProductList.setText('<span class="button_underline thePoniter ux_font-size14-normal">'
					+ getLabel('showAllProduct', 'Show All Product')
					+ '</span>');
			btnProductList.removeCls('font_bold');
			me.handleSmartGridConfig();
		}
	},

	loadDetailCount : function(sortOrder) {
		var me = this;
		Ext.Ajax.request({
					url : 'cpon/prfCountDetails.json',
					async : false,
					method : "POST",
					success : function(response) {
						var data = Ext.decode(response.responseText);
						prfMstCnt = data;
					},
					failure : function(response) {
						// console.log('Error Occured');
					}
				});
	},

	handlePrfMenuClick : function() {
		var me = this;
		me.resetFilterValues();
		me.changeHeaderMenuLabel();
		me.ChangePrfMstGrid();
		var gridViewPanel = me.getPrfMstDtlView();
		var actionToolBarContainer = gridViewPanel
				.down('container[itemId=pmtPkgButContainer]');
				actionToolBarContainer.setVisible(false);
		/*if (me.selectedPrfMst === 'paymentPackage') {
			actionToolBarContainer.setVisible(true);
			gridViewPanel.doLayout();
		}else {
			
		}*/
		me.handleSmartGridConfig();

	},

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmitted = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted != null
					&& objData.raw.isSubmitted == 'Y'
					&& objData.raw.requestState != 8
					&& objData.raw.requestState != 4
					&& objData.raw.requestState != 5) {
				isSubmitted = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmitted);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmitted) {
		var actionBar = this.getActionBarSummDtl();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled
										&& (isSubmitted != undefined && !isSubmitted);
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
			strUrl = Ext.String.format('cpon/{0}ProfileMst/{1}.srvc?'+csrfTokenName+'='+csrfTokenValue,
					me.selectedPrfMst, strAction);
		if( btn && btn.el )
			btn.disable();
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);
		} else if (strAction === 'submit' && record != null && record.raw != null 
				&& record.raw.profileType === 'Bank' && record.raw.requestStateDesc === 'Modified'){
			this.showPolicyChangePopup(strAction, strUrl, record);
		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle','Error'), getLabel('Error','Reject Remarks cannot be blank'));
							}
							else
							{
								me.preHandleGroupActions(strActionUrl, text, record);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
					},

					showPolicyChangePopup : function(strAction, strActionUrl, record) {
						var me = this;
						var titleMsg = '', fieldLbl = '';
						if (strAction === 'submit') {
							fieldLbl = 'Do you want to change the exiting password policy ?';
							titleMsg = 'Confirm';
						}
						Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							cls : 't7-popup',
							bodyPadding : 0,
							fn : function(btn, text) {
								if (btn == 'ok') {
									me.preHandleGroupActions(strActionUrl, text, record);
								}
							}
						});
					},

	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getPrfMstGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.profileName ? records[index].data.profileName : records[index].data.scheduleName
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
							var errorCode = '';
						       if(!Ext.isEmpty(response.responseText))
						       {
							        var jsonData = Ext.decode(response.responseText);
							        if(!Ext.isEmpty(jsonData))
							        {
							        	var msgHeight = 100;
							        	for(var i =0 ; i<jsonData.length;i++ )
							        	{
											if(jsonData[i].success === 'Y' && jsonData[i].successValue === 'Copy')
											{
												me.callEditAfterCopy(jsonData[i] , me);
												break;
											}
							        		var arrError = jsonData[i].errors;
							        		if(!Ext.isEmpty(arrError))
							        		{
							        			for(var j =0 ; j< arrError.length; j++)
									        	{
								        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
													errorCode = arrError[j].code;
													msgHeight+=50;
									        	}
							        		}
							        		
							        	}
								        if('' != errorMessage && null != errorMessage && 'AUTHSDL-0001'!=errorCode)
								        {
								            //Ext.Msg.alert("Error",errorMessage);
								        	var msg =	Ext.MessageBox.show({
												title : getLabel('instrumentErrorPopUpTitle','Error'),
												msg : errorMessage,
												multiline: true,
												defaultTextHeight: msgHeight,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
											msg.setHeight(msgHeight);
											msg.textArea.inputEl.set({
												hidden : true
											});
								        } 
										else if(''!=errorCode && 'AUTHSDL-0001'===errorCode)
								        {
								        	Ext.MessageBox.show({
												title : getLabel('info','info'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup'
												
											});
								        }
							        }
						       }
							me.enableDisableGroupActions('0000000000', true,
									true);
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	callEditAfterCopy : function (jsonData, me)
	{
				var strUrl = Ext.String.format('{0}EditProfileMst.form',me.selectedPrfMst);
				var form, inputField;
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',jsonData.identifier));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'isCopy','Y'));
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
	},
	resetFilterValues : function() {
		var me = this;
		var fltView = me.activeFilter;
		me.getSearchTxnTextInput().setValue('');
		fltView.renderFilterView(me.filterConfiguration(), me.selectedPrfMst);
	},

	getActiveFilter : function(tab) {
		var fltView = null;
		var me = this;
		if (tab === 'br') {
			var brView = me.getBrPrfMenuPanel();
			fltView = brView.down('panel[itemId=brPrfFilterView]');
		} else if (tab === 'payment') {
			var pmtView = me.getPmtPrfMenuPanel();
			fltView = pmtView.down('panel[itemId=paymentPrfFilterView]');
		} else if (tab === 'check') {
			var checksView = me.getChecksPrfMenuPanel();
			fltView = checksView.down('panel[itemId=checksPrfFilterView]');
		} else if (tab === 'incomingPayments') {
			var checksView = me.getIncomingPaymentsPrfMenuPanel();
			fltView = checksView
					.down('panel[itemId=incomingPaymentsPrfFilterView]');
		} else if (tab === 'others') {
			var othersView = me.getOthersPrfMenuPanel();
			fltView = othersView.down('panel[itemId=othersPrfFilterView]');
		} else if (tab === 'liquidity') {
			var liquidityView = me.getLiquidityPrfMenuPanel();
			fltView = liquidityView.down('panel[itemId=liquidityPrfFilterView]');
		} else if (tab === 'Receivable') {
			var collectionView = me.getCollectionPrfMenuPanel();
			fltView = collectionView.down('panel[itemId=collectionPrfFilterView]');
		} else if (tab === 'fsc') {
			var fscView = me.getFscPrfMenuPanel();
			fltView = fscView.down('panel[itemId=fscPrfFilterView]');
		} else {
			var adminView = me.getAdminPrfMenuPanel();
			fltView = adminView.down('panel[itemId=adminPrfFilterView]');
		}
		return fltView;
	},


	applyFilter : function() {
		var me = this;
		var grid = me.getPrfMstGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			strUrl = strUrl + '&$selectedseller=' + selectedSellerCode;
			me.getPrfMstGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	ChangePrfMstGrid : function() {
		var me = this;
		var actionMask = '0000000000';
		var btn = me.getAddNewProfileId();
		var gridViewPanel = me.getPrfMstDtlView();
		var menu = me.selectedPrfMst;
		gridViewPanel.setTitle(getLabel(menu + 'Profiles', menu + ' Profiles'));
		me.enableDisableGroupActions(actionMask, true);
		btn.name = menu;
		btn.setText('<span>'
				+ getLabel(menu + 'NewProfile', menu + ' Profile')
				+ '</span>');
		if (this.canAddProfile(menu)) {
			btn.show();
		} else {
			btn.hide();
		}
		btn.handler = function(btn, opts) {
			me.handleAddNewProfileMaster(btn);
		}
	},
	canAddProfile : function(menu) {
		var adminProfilesPermissionObj = Ext.decode(adminProfilesPermission);
		Ext.each(adminProfilesPermissionObj, function(field, index) {
					adminProfilesPermissionObj = field;
				});
		var paymentProfilePermissionObj = Ext
				.decode(paymentsProfilesPermission);
		Ext.each(paymentProfilePermissionObj, function(field, index) {
					paymentProfilePermissionObj = field;
				});
		var brProfilesPermissionObj = Ext
				.decode(balanceReportingProfilesPermission);
		Ext.each(brProfilesPermissionObj, function(field, index) {
					brProfilesPermissionObj = field;
				});
		var checkProfilesPermissionObj = Ext.decode(checksProfilesPermission);
		Ext.each(checkProfilesPermissionObj, function(field, index) {
					checkProfilesPermissionObj = field;
				});

		var incomingPaymentProfilesPermissionObj = Ext
				.decode(incomingPaymentsProfilesPermission);
		Ext.each(incomingPaymentProfilesPermissionObj, function(field, index) {
					incomingPaymentProfilesPermissionObj = field;
				});

		var othersProfilesPermissionObj = Ext.decode(othersProfilesPermission);
		Ext.each(othersProfilesPermissionObj, function(field, index) {
					othersProfilesPermissionObj = field;
				});
		
		var liquidityProfilesPermissionObj = Ext.decode(liquidityProfilesPermission);
		Ext.each( liquidityProfilesPermissionObj, function(field, index) {
			 liquidityProfilesPermissionObj = field;
				});		
		
		var collectionProfilesPermissionObj = Ext.decode(collectionProfilesPermission);
		Ext.each( collectionProfilesPermissionObj, function(field, index) {
			collectionProfilesPermissionObj = field;
				});			

		var fscProfilesPermissionObj = Ext.decode(fscProfilesPermission);
		Ext.each(fscProfilesPermissionObj, function(field, index) {
					fscProfilesPermissionObj = field;
				});

		if (menu == 'alert') {
			return adminProfilesPermissionObj.alertPermission.EDIT;
		} else if (menu == 'report') {
			return adminProfilesPermissionObj.reportPermission.EDIT;
		} else if (menu == 'interface') {
			return adminProfilesPermissionObj.interfacePermission.EDIT;
		}else if (menu == 'limit') {
			return adminProfilesPermissionObj.limitPermission.EDIT;
		}  else if (menu == 'tax') {
			return adminProfilesPermissionObj.taxPermission.EDIT;
		} else if (menu == 'charge') {
			return adminProfilesPermissionObj.billingPermission.EDIT;
		} else if (menu == 'chargeFrequency') {
			return adminProfilesPermissionObj.billingPermission.EDIT;
		} else if (menu == 'cutoff') {
			return adminProfilesPermissionObj.cutoffPermission.EDIT;
		} else if (menu == 'adminfeature') {
			return adminProfilesPermissionObj.adminfeaturePermission.EDIT;
		} else if (menu == 'fxSpread') {
			return adminProfilesPermissionObj.fxSpreadPermission.EDIT;
		} else if (menu == 'password') {
			return adminProfilesPermissionObj.password.EDIT;
		}
		else if (menu == 'token') {
			return adminProfilesPermissionObj.token.EDIT;
		}		
		else if (menu == 'groupBy') {
			return adminProfilesPermissionObj.groupBy.EDIT;
		}
		else if (menu == 'schedule') {
			return adminProfilesPermissionObj.schedulePermission.EDIT;
		}
		else if (menu == 'arrangement') {
			return adminProfilesPermissionObj.arrangementPermission.EDIT;
		}
		else if (menu == 'paymentWorkflow') {
			return paymentProfilePermissionObj.paymentWorkflowPermission.EDIT;
		} /*else if (menu == 'paymentPackage') {
			return paymentProfilePermissionObj.paymentPackagePermission.EDIT;
		}*/ else if (menu == 'paymentFeature') {
			return paymentProfilePermissionObj.paymentFeaturePermission.EDIT;
		} else if (menu == 'systemBene') {
			return paymentProfilePermissionObj.systemBenePermission.EDIT;
		}
		 else if (menu == 'achPassThru') {
			return paymentProfilePermissionObj.achPassThruBenePermission.EDIT;
		}

		else if (menu == 'brfeature') {
			return brProfilesPermissionObj.brfeaturePermission.EDIT;
		} else if (menu == 'typecode') {
			return brProfilesPermissionObj.typecodePermission.EDIT;
		}

		else if (menu == 'check') {
			return checkProfilesPermissionObj.check.EDIT;
		} else if (menu == 'incomingPayment') {
			return incomingPaymentProfilesPermissionObj.incomingPaymentPermission.EDIT;
		} else if (menu == 'positivePay') {
			return incomingPaymentProfilesPermissionObj.positivePayPermission.EDIT;
		} else if (menu == 'others') {
			return othersProfilesPermissionObj.othersProfilePermission.EDIT;
		}

		else if (menu == 'workflow') {
			return fscProfilesPermissionObj.workflowProfilesPermission.EDIT;
		}else if (menu == 'overdue') {
			return fscProfilesPermissionObj.overdueProfilesPermission.EDIT;
		}
		else if (menu == 'liquidity') {
			return liquidityProfilesPermissionObj.liquidityProfilesPermission.EDIT;
		}		
		else if (menu == 'Receivable'){
			return collectionProfilesPermissionObj.collectionProfilesPermission.EDIT;
		}		
		else if (menu == 'fsc') {
			return fscProfilesPermissionObj.fscProfilesPermission.EDIT;
		}
		else if (menu == 'financing') {
			return fscProfilesPermissionObj.financingProfilesPermission.EDIT;
		}
	},

	changeHeaderMenuLabel : function() {
		var me = this;
		var fltView = me.activeFilter;
		var containerHdrLabel = fltView.down('label[itemId=containerHdrLabel]');
		var menu = me.selectedPrfMst;
		containerHdrLabel.setText(getLabel(menu + 'Profiles', menu
						+ ' Profiles'));
	},

	handleAddNewProfileMaster : function(btn) {
		var me = this;
		var strUrl = "";
		switch (btn.name) {
			case 'alert' :
				strUrl = "addAlertProfileMst.form";
				break;
			case 'report' :
				strUrl = "addReportProfileMst.form";
				break;
			case 'interface' :
				strUrl = "addInterfaceProfileMst.form";
				break;
		
			case 'limit' :
				strUrl = "addLimitProfileMst.form";
				break;
		    case 'tax' :
				strUrl = "addTaxProfileMst.form";
				break;
			case 'charge' :
				strUrl = "addChargeProfileMst.form";
				break;
			case 'cutoff' :
				strUrl = "addCutoffProfileMst.form";
				break;
			case 'check' :
				strUrl = "addCheckProfileMst.form";
				break;
			case 'adminfeature' :
				strUrl = "addAdminFeatureProfileMst.form";
				break;
			case 'typecode' :
				strUrl = "addTypeCodeProfileMst.form";
				break;
			case 'brfeature' :
				strUrl = "addBRFeatureProfileMst.form";
				break;
			case 'paymentWorkflow' :
				strUrl = "addPaymentWorkflowProfileMst.form";
				break;
			case 'systemBene' :
				strUrl = "addSystemBeneProfileMst.form";
				break;
			case 'achPassThru' :
				strUrl = "addAchPassThruProfileMst.form";
				break;	
			case 'fxSpread' :
				strUrl = "addFxSpreadProfileMst.form";
				break;
			case 'password' :
				strUrl = "addPasswordProfileMaster.form";
				break;
			case 'token' :
				strUrl = "addProfileTokenMst.form";
				break;
			case 'groupBy' :
				strUrl = "addProfileGroupByMst.form";
				break;
			case 'schedule' :
				strUrl = "addScheduleProfileMst.form";
				break;
			case 'arrangement' :
				strUrl = "addProfileArrangementMst.form";
				break;
			/*case 'paymentPackage' :
				strUrl = "addPaymentPackageMst.form";
				break;*/
			case 'paymentFeature' :
				strUrl = "addPaymentFeatureProfileMst.form";
				break;
			case 'incomingPayment' :
				strUrl = "addIncomingPayProfileMaster.form";
				break;
			case 'positivePay' :
				strUrl = "addPositivePayProfileMaster.form";
				break;
			case 'others' :
				strUrl = "addOthersProfileMst.form";
				break;
			case 'chargeFrequency' :
				strUrl = "addChargeFrequencyProfileMst.form";
				break;
			case 'liquidity' :
				strUrl = "addLiquidityProfileMst.form";
				break;
			case 'fsc' :
				strUrl = "addFSCFeatureProfileMst.form";
				break;
			case 'overdue' :
				strUrl = "addOverdueProfileMst.form";
				break;	
			case 'workflow' :
				strUrl = "addFscWorkflowProfileMst.form";
				break;	
			case 'financing' :
				strUrl = "addFinancingProfileMst.form";
				break;	
			case 'Receivable' :
				strUrl = "addCollectionWorkflowProfileMst.form";
				break;			
			default :

		}
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileMstName', btn.name));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}

	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},

	setDataForFilter : function() {
		var me = this;
		me.getSearchTxnTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},

	getFilterQueryJson : function() {
		var me = this;
		var profileNameVal = null,scmProductVal=null, statusVal = null, moduleVal = null, categoryVal = null, subCategoryVal = null, txnTypeVal = null, jsonArray = [], scheduleTypeVal = null, scheduleStatusVal = null, schDelayType = null, schProgressFlag = null;
		var isPending =  true;

		var activeTab = me.getPrfMstViewTabPanel().getActiveTab();

		var scmProductFltId = activeTab
				.down('combobox[itemId=scmProductFltId]');

		var profileStatusFltId = activeTab
				.down('combobox[itemId=profileStatusFltId]');

		var profileModuleFltId = activeTab
				.down('combobox[itemId=profileModuleFltId]');

		var profileNameFltId = activeTab
				.down('combobox[itemId=profileNameFltId]');

		var profileCategoryFltId = activeTab
				.down('combobox[itemId=profileCategoryFltId]');

		var profileSubCatFltId = activeTab
				.down('combobox[itemId=profileSubCatFltId]');

		var profileTxnTypeFltId = activeTab
				.down('combobox[itemId=profileTxnTypeFltId]');
		
		var scheduleTypeFltId = activeTab
				.down('combobox[itemId=scheduleTypeFltId]');
		
		var scheduleStatusFltId = activeTab
				.down('combobox[itemId=scheduleStatusFltId]');
				
		if (!Ext.isEmpty(profileNameFltId)
				&& !Ext.isEmpty(profileNameFltId.getValue())) {
			profileNameVal = profileNameFltId.getValue().toUpperCase();
		}
		
		if (!Ext.isEmpty(scmProductFltId)
				&& !Ext.isEmpty(scmProductFltId.getValue())) {
			scmProductVal = scmProductFltId.getValue();
		}

		if (!Ext.isEmpty(profileStatusFltId)
				&& !Ext.isEmpty(profileStatusFltId.getValue())
				&& (getLabel('all', 'All').toLowerCase()) != ((profileStatusFltId.getValue())).toLowerCase()) {
			statusVal = profileStatusFltId.getValue();
		}

		if (!Ext.isEmpty(profileModuleFltId)
				&& !Ext.isEmpty(profileModuleFltId.getValue())
				&& (getLabel('all', 'All').toLowerCase()) != ((profileModuleFltId.getValue())).toLowerCase()) {
			moduleVal = profileModuleFltId.getValue();
		}

		if (!Ext.isEmpty(profileCategoryFltId)
				&& !Ext.isEmpty(profileCategoryFltId.getValue())) {
			categoryVal = profileCategoryFltId.getValue();
		}

		if (!Ext.isEmpty(profileSubCatFltId)
				&& !Ext.isEmpty(profileSubCatFltId.getValue())) {
			subCategoryVal = profileSubCatFltId.getValue();
		}

		if (!Ext.isEmpty(profileTxnTypeFltId)
				&& !Ext.isEmpty(profileTxnTypeFltId.getValue())
				&& getLabel('all', 'All') != profileTxnTypeFltId.getValue()) {
			txnTypeVal = profileTxnTypeFltId.getValue();
		}
		
		if (!Ext.isEmpty(scheduleTypeFltId)
				&& !Ext.isEmpty(scheduleTypeFltId.getValue())
				&& getLabel('all', 'All') != scheduleTypeFltId.getValue()) {
			scheduleTypeVal = scheduleTypeFltId.getValue();
		}
		if (!Ext.isEmpty(scheduleStatusFltId)
				&& !Ext.isEmpty(scheduleStatusFltId.getValue())
				&& getLabel('all', 'All') != scheduleStatusFltId.getValue()) {
			scheduleStatusVal = scheduleStatusFltId.getValue();
		}
		
		if (!Ext.isEmpty(scmProductVal)) {
			jsonArray.push({
						paramName : scmProductFltId.name,
						paramValue1 : encodeURIComponent(scmProductVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(profileNameVal)) {
			jsonArray.push({
						paramName : profileNameFltId.name,
						paramValue1 : encodeURIComponent(profileNameVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(statusVal)) {
			var label = getLabel('fsc','Supply-Chain');
			if (statusVal == 13 )//Pending My Approval
			{
			    statusVal  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				if(activeTab.title == label)
				{
						jsonArray.push({
							paramName : 'supplyStatusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
						jsonArray.push({
							paramName : 'supplyUser',
							paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'ne',
							dataType : 'S'
						});
					
				}
				else
				{
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
				jsonArray.push({
							paramName : 'user',
							paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'ne',
							dataType : 'S'
						});
				}
			}
			if(isPending)
			{
			  if (statusVal == 12 || statusVal == 3|| statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12:New Submitted // 14:Modified Submitted
				{
					statusVal = (statusVal == 12) ? 0:1;	
					if(activeTab.title == label)
					{
						jsonArray.push({
									paramName : 'supplyIsSubmitted',
									paramValue1 : 'Y',
									operatorValue : 'eq',
									dataType : 'S'
								});
					}
					else
					{
								jsonArray.push({
									paramName : 'isSubmitted',
									paramValue1 : 'Y',
									operatorValue : 'eq',
									dataType : 'S'
								});
					}	
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if(activeTab.title == label)
			{				
				jsonArray.push({
								paramName : 'supplyRequestState',
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});			
            }
			else
			{
						jsonArray.push({
								paramName : profileStatusFltId.name,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
			}
			}
		}
		if (moduleVal != null) {
			jsonArray.push({
						paramName : profileModuleFltId.name,
						paramValue1 : encodeURIComponent(moduleVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (categoryVal != null) {
			jsonArray.push({
						paramName : profileCategoryFltId.name,
						paramValue1 : encodeURIComponent(categoryVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (subCategoryVal != null) {
			jsonArray.push({
						paramName : profileSubCatFltId.name,
						paramValue1 : encodeURIComponent(subCategoryVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (txnTypeVal != null) {
			jsonArray.push({
						paramName : profileTxnTypeFltId.name,
						paramValue1 : encodeURIComponent(txnTypeVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(scheduleTypeVal)) {
			jsonArray.push({
						paramName : scheduleTypeFltId.name,
						paramValue1 : encodeURIComponent(scheduleTypeVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(scheduleStatusVal) && scheduleStatusVal.length == 3) {
			schDelayType = scheduleStatusVal.charAt(0);
			schProgrssFlag = scheduleStatusVal.charAt(2);
			jsonArray.push({
						paramName : 'delayType',
						paramValue1 : encodeURIComponent(schDelayType.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
			jsonArray.push({
						paramName : 'processFlag',
						paramValue1 : encodeURIComponent(schProgrssFlag.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return jsonArray;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.enableDisableGroupActions('0000000000', true,
									false, false);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl();
		strUrl = strUrl + '&$selectedseller=' + selectedSellerCode;
		grid.loadGridData(strUrl, null);
	},

	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
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
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
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

	handleSmartProductGridConfig : function() {
		var me = this;
		var prfMstGrid = me.getPrfMstGrid();
		if (!Ext.isEmpty(prfMstGrid))
			prfMstGrid.destroy(true);
		var pgSize = 5;
		var arrColsPref = [{
					"colId" : "productCode",
					"colDesc" : "Products"
				}, {
					"colId" : "packageName",
					"colDesc" : "Package"
				}, {
					"colId" : "productCatType",
					"colDesc" : "Type"
				}, {
					"colId" : "useSingle",
					"colDesc" : "Use Independently"
				}];

		var objWidthMap = {
			"profileName" : 115,
			"package" : 115,
			"type" : 115,
			"useIndependently" : 115
		};

		var arrCols = me.getColumns(arrColsPref, objWidthMap, false);

		prfMstGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					padding : '5 10 10 10',
					rowList : [5, 10, 15, 20, 25, 30],
					minHeight : 140,
					columnModel : arrCols,
					storeModel : {
						fields : ['history', 'productCode', 'packageName',
								'productCatType', 'useSingle',
								'requestStateDesc', 'identifier', '__metadata',
								'profileId'],
						proxyUrl : 'cpon/paymentProductList.json',
						rootNode : 'd.profileDetails',
						totalRowsNode : 'd.__count'
					},
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					}
				});

		var prfMstDtlView = me.getPrfMstDtlView();
		prfMstDtlView.add(prfMstGrid);
		prfMstDtlView.doLayout();
	},

	handleSmartGridConfig : function() {
		var me = this;
		var prfMstGrid = me.getPrfMstGrid();
		var objConfigMap = me.getPrfMstConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(prfMstGrid))
			prfMstGrid.destroy(true);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		var alertSummaryGrid = null;
		pgSize = _GridSizeMaster;
		prfMstGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 140,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
		});

		var prfMstDtlView = me.getPrfMstDtlView();
		prfMstDtlView.add(prfMstGrid);
		prfMstDtlView.doLayout();
	},

	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'copy')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('profileName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = Ext.String.format('{0}EditProfileMst.form',
					me.selectedPrfMst);
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = Ext.String.format('{0}ViewProfileMst.form',
					me.selectedPrfMst);
			me.submitForm(strUrl, record, rowIndex);
		}
		else 
		{

		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		/*if (strUrl == 'viewPaymentPackageProduct.form') {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'hdrViewState', viewState));
		}*/
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	showHistory : function(profileName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					profileName : profileName,
					identifier : id
				}).show();
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
			var submitFlag = record.raw.isSubmitted;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}else if (maskPosition === 11 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},

	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (showGroupActionColumn) {
			arrCols.push(me.createGroupActionColumn());
			arrCols.push(me.createActionColumn())
		} else {
			arrCols.push(me.createProductActionColumn());

		}
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.lockable = true;
				cfgCol.draggable = true;
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.hidden = false;
				}
				
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				
					cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			resizable : false,
			lockable : false,
			sortable : false,
			hideable : false,
			draggable : false,
			width : 85,
			locked : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						toolTip : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					},{
						itemId : 'copy',
						itemCls : 'grid-row-action-icon icon-clone',
						itemLabel : getLabel('copyToolTip', 'Copy Record'),
						maskPosition : 11
					}]
		};
		return objActionCol;
	},

	createProductActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 40,
			locked : true,
			items : [{
						itemId : 'btnProductView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					}]
		};
		return objActionCol;
	},

	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
				colType : 'actioncontent',
				colId : 'groupaction',
				width : 130,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				resizable : false,
				draggable : false,
			items : [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},

	handlePrfMstAdminProfileView : function() {
		var me = this;
		me.adminSelectedPrfMst = 'alert';
		me.selectedPrfMst = 'alert';
	},

	handlePrfMstBrProfileView : function() {
		var me = this;
		me.brSelectedPrfMst = 'typecode';
		me.selectedPrfMst = 'typecode';

	},

	handlePrfMstChecksProfileView : function() {
		var me = this;
		me.brSelectedPrfMst = 'check';
		me.selectedPrfMst = 'check';

	},

	handlePrfMstPaymentProfileView : function() {
		var me = this;
		me.paymentSelectedPrfMst = 'paymentWorkflow';
		me.selectedPrfMst = 'paymentWorkflow';

	},

	handlePrfMstIncomingPaymentsProfileView : function() {
		var me = this;
		me.incomingPaymentSelectedPrfMst = 'incomingPayment';
		me.selectedPrfMst = 'incomingPayment';

	},

	handlePrfMstOthersProfileView : function() {
		var me = this;
		me.othersSelectedPrfMst = 'others';
		me.selectedPrfMst = 'others';

	},

	handlePrfMstLiquidityProfileView : function() {
		var me = this;
		me.liquiditySelectedPrfMst = 'liquidity';
		me.selectedPrfMst = 'liquidity';
	},	
	
	handlePrfMstCollectionProfileView : function() {
		var me = this;
		me.collectionSelectedPrfMst = 'Receivable';
		me.selectedPrfMst = 'Receivable';
	},	
	
	handlePrfMstFscProfileView : function() {
		var me = this;
		me.fscSelectedPrfMst = 'fsc';
		me.selectedPrfMst = 'fsc';
	},		

	handleTabVisibility : function() {
		var me = this;
		var tabPanel = this.getPrfMstViewTabPanel();

		var profileMenu = me.getPaymentPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#paymentsPrftab').tab.hide();
		}

		var profileMenu = me.getBrPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#brPrftab').tab.hide();
		}
		
		var profileMenu = me.getCollectionPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#collectionPrftab').tab.hide();
		}		

		/*var profileMenu = me.getChecksPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#checksPrftab').tab.hide();
		}*/

		var profileMenu = me.getAdminPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#adminPrftab').tab.hide();
		}

		/*var profileMenu = me.getIncomingPaymentsPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#incomingPaymentsPrftab').tab.hide();
		}

		var profileMenu = me.getOthersPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#othersPrftab').tab.hide();
		}
		
		var profileMenu = me.getLiquidityPrfMenu();
		if (profileMenu.getselectedProfileMenu() == null) {
			tabPanel.child('#liquidityPrftab').tab.hide();
		}*/
		
		var profileMenu = me.getFscPrfMenu(); 
		if(!Ext.isEmpty(profileMenu)){
		if(profileMenu.getselectedProfileMenu() == null) {
		tabPanel.child('#fscPrftab').tab.hide(); 
		}
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId === 'col_authSyncStatus')
		{
			strRetValue = getLabel('authSyncStatus.'+value , '');
		}
		else if(colId === 'col_dlyTrfDebitLimitAmt' || colId === 'col_dlyTrfCreditLimitAmt' || colId === 'col_clTrfCreditLimitAmt' ||
				colId === 'col_clTrfDebitLimitAmt' || colId === 'col_warningCreditLimitAmt' || colId === 'col_warningDebitLimitAmt')
		{
			 if(typeof value != 'undefined' && value)
				 strRetValue = setDigitAmtGroupFormat(value);
		}
		else
		{
			strRetValue = value;
		}
        meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		return strRetValue;
	},

	changeAdminFilterView : function(name) {
		var me = this;
		var c;
		var adminMenu = me.getAdminPrfMenu();
		adminMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}
				});
		c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},

	changeBRFilterView : function(name) {
		var me = this;
		var brMenu = me.getBrPrfMenu();
		brMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}
				});
				c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},

	changeChecksFilterView : function(name) {
		var me = this;
		var checksMenu = me.getChecksPrfMenu();
		checksMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}
				});
				c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},

	changePaymentFilterView : function(name) {
		var me = this;
		var pmtMenu = me.getPaymentPrfMenu();
		pmtMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}
				});
				c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},

	changeIncomingPaymentsFilterView : function(name) {
		var me = this;
		var incomingPaymentsMenu = me.getIncomingPaymentsPrfMenu();
		incomingPaymentsMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}

				});
				c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},

	changeOthersFilterView : function(name) {
		var me = this;
		var othersPrfMenu = me.getOthersPrfMenu();
		othersPrfMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('selected-cb-background');
					} else {
						c = it;
					}

				});
		c.addCls('selected-cb-background');
	},

	changeFscFilterView : function(name) {
		var me = this;
		var fscPrfMenu = me.getFscPrfMenu();
		fscPrfMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}

				});
				c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},
	
	changeLiquidityFilterView : function(name) {
		var me = this;
		var liquidityPrfMenu = me.getLiquidityPrfMenu();
		liquidityPrfMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('selected-cb-background');
					} else {
						c = it;
					}
				});
		c.addCls('selected-cb-background');
	},	
	
	changeCollectionFilterView : function(name) {
		var me = this;
		var collectionPrfMenu = me.getCollectionPrfMenu();
		collectionPrfMenu.items.each(function(it) {
					if (it.name != name) {
						it.removeCls('ux_panel-transparent-background ux_font-size14');
						it.addCls('ux_font-size14-normal dark_grey');
					} else {
						c = it;
					}
				});
		c.removeCls('ux_font-size14-normal');
		c.addCls('ux_panel-transparent-background ux_font-size14');
	},	

	getPrfMstConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"profileName" : 230,
			"module" : 80,
			"dtlCount" : 150,
			"dlyTrfDebitLimitAmt" : 100,
			"dlyTrfCreditLimitAmt" : 100,
			"ccyCode" : 60,
			"requestStateDesc" : 115,
			"type" : 100,
			"authSyncStatus" : 200
		};
		switch (me.selectedPrfMst) {
			case 'alert' :
				objWidthMap = {"moduleDesc" : 150,"requestStateDesc" : 200,"authSyncStatus" : 200}
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('subscription','Subscription #'),
							"colType" : "number",
							 "sort" :false
						}, {
							"colId" : "moduleDesc",
							"colDesc" : getLabel('module','Module'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort": false
						},/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/
						{
							"colId" : "authSyncStatus",
							"colDesc" : getLabel('authSyncStatus','Synchronization Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 'moduleDesc',
							'dtlCount', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType','authSyncStatus'],
					proxyUrl : 'cpon/alertProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'report' :
				objWidthMap = {"moduleDesc" : 150,"requestStateDesc" : 200,"authSyncStatus" : 200}
				
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('repCnt','Report Count'),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "moduleDesc",
							"colDesc" :  getLabel('module','Module'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						},/*,{
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/{
							"colId" : "authSyncStatus",
							"colDesc" : getLabel('authSyncStatus','Synchronization Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 'moduleDesc',
							'dtlCount', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType','authSyncStatus'],
					proxyUrl : 'cpon/reportProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'interface' :

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
								"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('format','Format #'),
							"colType" : "number",
								"sort" :false
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
								"sort" :false
						},/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/{
							"colId" : "authSyncStatus",
							"colDesc" : getLabel('authSyncStatus','Synchronization Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 'moduleDesc',
							'dtlCount', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType','authSyncStatus'],
					proxyUrl : 'cpon/interfaceProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			
			case 'limit' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :false
						}, {
							"colId" : "ccyCode",
							"colDesc" :  getLabel('currency','Currency'),
							"sort" :false
						}, {
							"colId" : "requestStateDesc",
							"colDesc" :  getLabel('status','Status'),
							"sort" :false
						},{
							"colId" : "dlyTrfCreditLimitAmt",
							"colDesc" : getLabel('trfCr','Transfer Credit Limit'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "dlyTrfDebitLimitAmt",
							"colDesc" :  getLabel('trfDr','Transfer Debit Limit'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "periodType",
							"colDesc" :  getLabel('periodType','Period Type'),
							"colHeader" :  getLabel('periodType','Period Type'),
							"sort" :false
						},{
							"colId" : "clTrfCreditLimitAmt",
							"colDesc" :  getLabel('trfCrLimit','Cumulative Transfer Credit Limit'),
							"colHeader" :  getLabel('trfCrLimit','Cumulative Transfer Credit Limit'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "clTrfDebitLimitAmt",
							"colDesc" :  getLabel('trfDrLimit','Cumulative Transfer Debit Limit'),
							"colHeader" :  getLabel('trfDrLimit','Cumulative Transfer Debit Limit'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "clMaxNoTrfAmt",
							"colDesc" :  getLabel('maxNoOfTranf','Maximum Number Of Transfer'),
							"colHeader" :  getLabel('maxNoOfTranf','Maximum Number Of Transfer'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "warningCreditLimitAmt",
							"colDesc" :  getLabel('warnCrLimit','Warning Credit Limit'),
							"colHeader" :  getLabel('warnCrLimit','Warning Credit Limit'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "warningDebitLimitAmt",
							"colDesc" :  getLabel('warnDrLimit','Warning Debit Limit'),
							"colHeader" :  getLabel('warnDrLimit','Warning Debit Limit'),
							"colType" : "number",
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 'ccyCode','clMaxNoTrfAmt','periodType',
							'dlyTrfDebitLimitAmt', 'dlyTrfCreditLimitAmt','clTrfCreditLimitAmt','clTrfDebitLimitAmt',
							'moduleDesc', 'requestStateDesc', 'identifier','warningCreditLimitAmt','warningDebitLimitAmt',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/limitProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
				case 'tax' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" :getLabel('profileName','Profile Name'),
							"sort" :true
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName', 'requestStateDesc', 'identifier',
							'__metadata','profileType'],
					proxyUrl : 'cpon/taxProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'chargeFrequency' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
							
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName', 
							'stopPayFlag', 'isSubmitted', 'requestStateDesc',
							'identifier', '__metadata', 'profileId', 'profileType'],
					proxyUrl : 'cpon/chargeFrequencyProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'check' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status')
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'stopPayFlag', 'isSubmitted', 'requestStateDesc',
							'identifier', '__metadata', 'profileId'],
					proxyUrl : 'cpon/checkProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'charge' :

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*,{
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort" :false
						}*/];

				storeModel = {
					fields : ['history', 'profileName', 'dtlCount',
							'moduleDesc', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId', 'profileType'],
					proxyUrl : 'cpon/chargeProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'cutoff' :

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, /*{
							"colId" : "moduleDesc",
							"colDesc" : "Module",
							"sort" :true
						},*/ {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName', 'moduleDesc',
							'dtlCount', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/cutoffProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'adminfeature' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" :getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'requestStateDesc', 'identifier', '__metadata',
							'profileId'],
					proxyUrl : 'cpon/adminFeatureProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'typecode' :
				objWidthMap = {
					"profileName" : 240,
					"categoryDescription":120,
					"statusDesc" : 115,
					"authSyncStatus" : 200
				};
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" :getLabel('lblTypecodeNo','Type Code #'),
							"colType" : "number",
							"sort" :false
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						},/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/{
							"colId" : "authSyncStatus",
							"colDesc" : getLabel('authSyncStatus','Synchronization Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 'dtlCount',
							'requestStateDesc', 'identifier', '__metadata',
							'profileId','profileType','authSyncStatus'],
					proxyUrl : 'cpon/typeCodeProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'brfeature' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" :  getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'requestStateDesc', 'identifier', '__metadata',
							'profileId'],
					proxyUrl : 'cpon/bRFeatureProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;

			case 'paymentWorkflow' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						},/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/{
							"colId" : "authSyncStatus",
							"colDesc" : getLabel('authSyncStatus','Synchronization Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName',
							'requestStateDesc', 'identifier', '__metadata',
							'profileId','profileType','authSyncStatus'],
					proxyUrl : 'cpon/paymentWorkflowProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'systemBene' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						},						
						{
							"colId" : "dtlCount",
							"colDesc" :  getLabel('beneficiary','Beneficiary #'),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "requestStateDesc",
							"colDesc" :getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName','categoryCode' , 'dtlCount',
							'module', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/systemBeneProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'achPassThru' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" :getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName','categoryCode' , 'dtlCount',
							'module', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/achPassThruProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'fxSpread' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" :getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "dtlCount",
							"colDesc" : getLabel('noOfCCyPairs','# of Currency Pairs'),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName', 'dtlCount',
							'module', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/fxSpreadProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			/*case 'paymentPackage' :
				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : "Package Name"
						}, {
							"colId" : "productCatType",
							"colDesc" : "Type"
						}, {
							"colId" : "dtlCount",
							"colDesc" : "Products",
							"colType" : "number"
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}];

				storeModel = {
					fields : ['history', 'packageName', 'dtlCount',
							'productCatType', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId'],
					proxyUrl : 'cpon/paymentPackageProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
				*/
			case 'paymentFeature' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" :getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" :getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'requestStateDesc', 'identifier', '__metadata',
							'profileId'],
					proxyUrl : 'cpon/paymentFeatureProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'password' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName',
							'isSubmitted', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId', 'profileType'],
					proxyUrl : 'cpon/passwordProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'token' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName',
							'isSubmitted', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId', 'profileType'],
					proxyUrl : 'cpon/tokenProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;				
			case 'groupBy' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['history', 'profileName',
							'isSubmitted', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/groupByProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'schedule' :
				objWidthMap = {
					"formatSchNextGenDate" : 170
				};
				
				arrColsPref = [{
							"colId" : "schId",
							"colDesc" : getLabel("lbl.scheduleProfile.schId","Schedule Reference")
							}, {
							"colId" : "scheduleName",
							"colDesc" : getLabel("profileName","Profile Name"),
							"sort" :true
						}, {
							"colId" : "formatSchNextGenDate",
							"colDesc" :  getLabel("lbl.scheduleProfile.formatSchNextGenDate","Next Execution Date")
						},{
							"colId" : "maxThreadCount",
							"colDesc" : getLabel("lbl.scheduleProfile.maxThreadCount","# Threads")
						},{
							"colId" : "schFrequencyDesc",
							"colDesc" : getLabel("lbl.scheduleProfile.schFrequencyDesc","Type of Schedule")
						},{
							"colId" : "schScheduleTime",
							"colDesc" : getLabel("lbl.scheduleProfile.schtime","Schedule Time"),
							"sort" :false
						},{
							"colId" : "scheduleStatus",
							"colDesc" : getLabel("lbl.scheduleProfile.scheduleStatus","Schedule Status"),
							"sort" :false
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel("lbl.scheduleProfile.requestStateDesc","Status"),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'schId', 'moduleDesc','scheduleName','maxThreadCount','formatSchNextGenDate',
							'schNextGenDate', 'requestStateDesc', 'identifier','schFrequencyDesc','scheduleStatus','schScheduleTime',
							'__metadata'],
					proxyUrl : 'cpon/scheduleProfileMst.json',
					rootNode : 'd.reportCenter',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'arrangement' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "moduleName",
							"colDesc" : getLabel('moduleName','Module'),
							"sort" :true
								
						}, {
							"colId" : "arrangementDesc",
							"colDesc" : getLabel('arrangementDesc','Arrangement Type'),
							"sort" :true
								
						}, {
							"colId" : "arrangementCode",
							"colDesc" : getLabel('arrangementCode','Arrangement Code'),
							"sort" :true
								
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}];

				storeModel = {
					fields : ['history', 'profileName','moduleName','arrangementDesc','arrangementCode',
							'isSubmitted', 'requestStateDesc', 'identifier',
							'__metadata', 'profileId'],
					proxyUrl : 'cpon/arrangementProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			case 'incomingPayment' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'requestStateDesc', 'identifier', '__metadata',
							'profileId'],
					proxyUrl : 'cpon/incomingPayProfileMaster.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
			
			case 'positivePay' :
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						},  {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['history', 'profileName', 
							'requestStateDesc', 'identifier', '__metadata',
							'profileId'],
					proxyUrl : 'cpon/positivePayProfileMaster.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
				
			
			case 'others' :

				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 115
				};

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" :getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}];

				storeModel = {
					fields : ['identifier', 'profileId', 'profileName',
							 'requestStateDesc', 'recordKeyNo',
							'isSubmitted', '__metadata', 'history'],
					proxyUrl : 'cpon/othersProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				break;
			case 'workflow' :

				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 115
				};

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						},
						{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}];

				storeModel = {
					fields : ['profileName','categoryDescription','requestStateDesc','identifier','history','__metadata'],
					proxyUrl : 'cpon/workflowProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;
				
			case 'liquidity' :
				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 115
				};
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}];
				storeModel = {
					fields : ['identifier', 'profileId', 'profileName',
							 'requestStateDesc', 'recordKeyNo',
							'isSubmitted', '__metadata', 'history'],
					proxyUrl : 'cpon/liquidityProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				break;	
				
			case 'fsc' :
				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 115
				};
				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
								
						}];
				storeModel = {
					fields : ['identifier', 'profileId', 'profileName','categoryDescription',
							 'requestStateDesc', 'recordKeyNo',
							'isSubmitted', '__metadata', 'history'],
					proxyUrl : 'cpon/fSCFeatureProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				break;	
				
			case 'overdue' :
				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 100,
					"productDescription" : 130					
				};

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
						}, {
							"colId" : "productDescription",
							"colDesc" : getLabel('scmProduct','SCF Package'),
							"sort" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*, {
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['profileName','categoryDescription','requestStateDesc', 'productCode',
							'identifier','history','__metadata', 'productDescription','profileType'],
					proxyUrl : 'cpon/overdueProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				break;	
				
				case 'financing' :
				objWidthMap = {
					"profileName" : 240,
					"requestStateDesc" : 120,
					"productDescription" : 140
				};

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : getLabel('profileName','Profile Name'),
							"sort" :true
								
						}, {
							"colId" : "productDescription",
							"colDesc" : getLabel('scmProduct','SCF Package'),
							"sort" :true
						},
						{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status'),
							"sort" :false
						}/*,
						{
							"colId" : "profileType",
							"colDesc" : getLabel('profileType','Profile Type'),
							"sort": false
						}*/];

				storeModel = {
					fields : ['profileName','categoryDescription','requestStateDesc', 'productCode',
							'identifier','history','__metadata', 'productDescription','profileType'],
					proxyUrl : 'cpon/financingProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};

				break;
				case 'Receivable' :
					arrColsPref = [{
								"colId" : "profileName",
								"colDesc" :  getLabel('profileName','Profile Name'),
								"sort" :true
							},  {
								"colId" : "requestStateDesc",
								"colDesc" : getLabel('status','Status'),
								"sort" :false
							}/*, {
								"colId" : "profileType",
								"colDesc" : getLabel('profileType','Profile Type'),
								"sort": false
							}*/];
					storeModel = {
						fields : ['history', 'profileName', 
								'requestStateDesc', 'identifier', '__metadata',
								'profileId','profileType'],
						proxyUrl : 'cpon/collectionWorkflowProfileMst.json',
						rootNode : 'd.profile',
						totalRowsNode : 'd.__count'
					};
				break;				
			default :

		}
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getPrfMstGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	filterConfiguration : function() {
		var me = this;
		return filterConfig[me.selectedPrfMst];
	}
});

function showClientPopup(profileId) {
	GCP.getApplication().fireEvent('showClientPopup', profileId);
}