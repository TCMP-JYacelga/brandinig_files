Ext.define('GCP.controller.ApprovalWorkflowDetailController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.AccountGridView', 'GCP.view.AccountAssignmentPopup',
			'GCP.view.PackageGridView', 'GCP.view.PackageAssignmentPopup',
			'GCP.view.PackageAccountGridView', 'GCP.view.PkgAccAssignmentPopup'],
	refs : [{
				ref : 'accountGridView',
				selector : 'accountGridView'
			}, {
				ref : 'accountAssignmentPopup',
				selector : 'accountAssignmentPopup'
			}, {
				ref : 'packageGridView',
				selector : 'packageGridView'
			}, {
				ref : 'packageAssignmentPopup',
				selector : 'packageAssignmentPopup'
			}, {
				ref : 'pkgAccGridView',
				selector : 'pkgAccGridView'
			}, {
				ref : 'pkgAccAssignmentPopup',
				selector : 'pkgAccAssignmentPopup'
			}, {
				ref : 'txtApproversAccount',
				selector : 'accountAssignmentPopup container container numberfield[itemId="txtApproversAccount"]'
			}, {
				ref : 'txtApproversPackage',
				selector : 'packageAssignmentPopup container container textfield[itemId="txtApproversPackage"]'
			}, {
				ref : 'txtApproversPkgAcc',
				selector : 'pkgAccAssignmentPopup container container textfield[itemId="txtApproversPkgAcc"]'
			}, {
				ref : 'cmbPkgAccount',
				selector : 'pkgAccAssignmentPopup combo[itemId="cmbPkgAccount"]'
			}, {
				ref : 'cmbAccount',
				selector : 'accountAssignmentPopup combo[itemId="accountCombo"]'
			}, {
				ref : 'cmbAccountMatrix',
				selector : 'accountAssignmentPopup combo[itemId="matrixCombo"]'
			}, {
				ref : 'accountGrid',
				selector : 'accountGridView smartgrid'
			}, {
				ref : 'cmbPackage',
				selector : 'packageAssignmentPopup combo[itemId="packageCombo"]'
			}, {
				ref : 'cmbPackageMatrix',
				selector : 'packageAssignmentPopup combo[itemId="matrixCombo"]'
			}, {
				ref : 'packageGrid',
				selector : 'packageGridView smartgrid'
			}, {
				ref : 'packageCombo',
				selector : 'pkgAccAssignmentPopup combo[itemId="packageCombo"]'
			}, {
				ref : 'cmbPkgAccount',
				selector : 'pkgAccAssignmentPopup combo[itemId="cmbPkgAccount"]'
			}, {
				ref : 'cmbPkgAccMatrix',
				selector : 'pkgAccAssignmentPopup combo[itemId="matrixCombo"]'
			}, {
				ref : 'pkgAccGrid',
				selector : 'pkgAccGridView smartgrid'
			}],
	init : function() {
		var me = this;

		me.control({
			'accountAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				saveAccountAssignment : function(identifier) {
					me.saveAccountAssignment(identifier);
				}
			},
			'packageAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				savePackageAssignment : function(identifier) {
					me.savePackageAssignment(identifier);
				}
			},
			'pkgAccAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				savePkgAccAssignment : function(identifier) {
					me.savePkgAccAssignment(identifier);
				}
			},
			'accountGridView' : {
				addAccountAssignmentPopup : function() {
					me.openAccountAssignmentPopup('ADD');
				},
				handleRowIconClick : function(btn, record) {
					me.handleRowIconClick(btn, record);
				}		
			},
			'packageGridView' : {
				addPackageAssignmentPopup : function() {
					me.openPackageAssignmentPopup('ADD');
				},
				handlePackageRowIconClick : function(btn, record) {
					me.handlePackageRowIconClick(btn, record);
				}
			},
			'pkgAccGridView' : {
				addPkgAccAssignmentPopup : function() {
					me.openPkgAccAssignmentPopup('ADD');
				},
				handlePkgAccRowIconClick : function(btn, record) {
					me.handlePkgAccRowIconClick(btn, record);
				}
			},
			'accountAssignmentPopup combo[itemId="matrixCombo"]' : {
				select : function(combo, records, eOpts) {

					if ('MAKERCHECKER' == combo.getValue()) {
						var countfield = me.getTxtApproversAccount();
						countfield.enable();
						countfield.allowBlank = false;
						countfield.validate();
					} else {
						var countfield = me.getTxtApproversAccount();
						countfield.setValue('');
						countfield.disable();
						countfield.allowBlank = true;
						countfield.validate();
					}

				}
			},
			'packageAssignmentPopup combo[itemId="matrixCombo"]' : {
				select : function(combo, records, eOpts) {

					if ('MAKERCHECKER' == combo.getValue()) {
						var countfield = me.getTxtApproversPackage();
						countfield.enable();
						countfield.allowBlank = false;
						countfield.validate();

					} else {
						var countfield = me.getTxtApproversPackage();
						countfield.setValue('');
						countfield.disable();
						countfield.allowBlank = true;
						countfield.validate();
					}

				}
			},
			'pkgAccAssignmentPopup combo[itemId="matrixCombo"]' : {
				select : function(combo, records, eOpts) {

					if ('MAKERCHECKER' == combo.getValue()) {
						var countfield = me.getTxtApproversPkgAcc();
						countfield.enable();
						countfield.allowBlank = false;
						countfield.validate();
					} else {
						var countfield = me.getTxtApproversPkgAcc();
						countfield.setValue('');
						countfield.disable();
						countfield.allowBlank = true;
						countfield.validate();
					}

				}
			},
			'pkgAccAssignmentPopup combo[itemId="packageCombo"]' : {
				select : function(combo, records, eOpts) {

					var accountfield = me.getCmbPkgAccount();
					accountfield.setValue('');
					var store = accountfield.store;
					store.proxy.url = 'services/approvalWorkflow/pkgAccountList.json?id='
							+ encodeURIComponent(matrixId)
							+ '&package='
							+ combo.getValue();
					accountfield.store.load();
					accountfield.validate();
				}
			}
		});
	},
	openAccountAssignmentPopup : function(mode, record) {
		var me = this;
		accountAssignPopup = Ext.create('GCP.view.AccountAssignmentPopup', {
					itemId : 'accountPopup',
					mode : mode
				});
		if (!Ext.isEmpty(record)) {
			accountAssignPopup.identifier = record.get('identifier');
			var accountComboRef = me.getCmbAccount();
			var matrixComboRef = me.getCmbAccountMatrix();
			var approvalCountTextRef = me.getTxtApproversAccount();
			//accountComboRef.setValue(record.get('accountNmbr'));
			accountComboRef.setValue(record.get('accountName')+'('+record.get('accountNmbr') + '-'+ record.get('accountCcyCode') + ')');
			matrixComboRef.setValue(record.get('customAxmCode'));
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.setValue(record.get('approverCount'));
				approvalCountTextRef.enable();
				approvalCountTextRef.allowBlank = false;
				approvalCountTextRef.validate();
			}

		}

		accountAssignPopup.show();
	},
	openPackageAssignmentPopup : function(mode, record) {
		var me = this;
		packageAssignPopup = Ext.create('GCP.view.PackageAssignmentPopup', {
					itemId : 'packagePopup',
					mode : mode
				});
		if (!Ext.isEmpty(record)) {
			packageAssignPopup.identifier = record.get('identifier');
			var packageComboRef = me.getCmbPackage();
			var matrixComboRef = me.getCmbPackageMatrix();
			var approvalCountTextRef = me.getTxtApproversPackage();
			packageComboRef.setValue(record.get('packageName'));
			matrixComboRef.setValue(record.get('customAxmCode'));
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.setValue(record.get('approverCount'));
				approvalCountTextRef.enable();
				approvalCountTextRef.allowBlank = false;
				approvalCountTextRef.validate();
			}

		}
		packageAssignPopup.show();
	},
	openPkgAccAssignmentPopup : function(mode, record) {
		var me = this;
		pkgAccAssignPopup = Ext.create('GCP.view.PkgAccAssignmentPopup', {
					itemId : 'pkgAccPopup',
					mode : mode
				});
		if (!Ext.isEmpty(record)) {
			pkgAccAssignPopup.identifier = record.get('identifier');
			var packageComboRef = me.getPackageCombo();
			var accountComboRef = me.getCmbPkgAccount();
			var matrixComboRef = me.getCmbPkgAccMatrix();
			var approvalCountTextRef = me.getTxtApproversPkgAcc();
			packageComboRef.setValue(record.get('packageId'));
			accountComboRef.setValue('');
			var store = accountComboRef.store;
			store.proxy.url = 'services/approvalWorkflow/pkgAccountList.json?id='
					+ encodeURIComponent(matrixId)
					+ '&package='
					+ record.get('packageId');
			accountComboRef.store.load();
			accountComboRef.validate();
			accountComboRef.setValue(record.get('accountNmbr'));
			matrixComboRef.setValue(record.get('customAxmCode'));
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.setValue(record.get('approverCount'));
				approvalCountTextRef.enable();
				approvalCountTextRef.allowBlank = false;
				approvalCountTextRef.validate();
			}

		}
		pkgAccAssignPopup.show();
	},
	saveAccountAssignment : function(identifier) {
		var me = this;
		var postData = null;
		var strUrl = null;
		var accountComboRef = me.getCmbAccount();
		var matrixComboRef = me.getCmbAccountMatrix();
		var approvalCountTextRef = me.getTxtApproversAccount();
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"accountId\":" + "\"" + accountComboRef.getValue()
				+ "\",";
		if ('MAKERCHECKER' == matrixComboRef.getValue()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.getValue() + "\",";
		}
		detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.getValue()
				+ "\"}}";
		if (!Ext.isEmpty(identifier)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo : '1',
						identifier : identifier,
						userMessage : detailJsonData
					});
			postData = Ext.encode(arrayJson);
			strUrl = 'services/approvalWorkflowDetail/update';
		} else {
			postData = detailJsonData;
			strUrl = 'services/approvalWorkflowDetail/add';
		}
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : postData,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var errorMessage = '';
						if (response.responseText != '[]') {
							var jsonData = Ext
									.decode(response.responseText);
									for(var i=0;i<jsonData.length;i++){
							Ext
									.each(
											jsonData[i].errors,
											function(error,
													index) {
												errorMessage = errorMessage +  error.errorMessage
														+ "<br/>";
											});
											}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.Msg.alert("Error",
										errorMessage);
							}
						}
						if(errorMessage=='')
						{
							me.getAccountAssignmentPopup().close();
							me.getAccountGrid().refreshData();
						}
						
					},
					failure : function(response) {
					}
				});
	},
	savePackageAssignment : function(identifier) {
		var me = this;
		var postData = null;
		var strUrl = null;
		var packageComboRef = me.getCmbPackage();
		var matrixComboRef = me.getCmbPackageMatrix();
		var approvalCountTextRef = me.getTxtApproversPackage();
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"packageId\":" + "\"" + packageComboRef.getValue()
				+ "\",";
		if ('MAKERCHECKER' == matrixComboRef.getValue()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.getValue() + "\",";
		}
		detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.getValue()
				+ "\"}}";
		if (!Ext.isEmpty(identifier)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo : '1',
						identifier : identifier,
						userMessage : detailJsonData
					});
			postData = Ext.encode(arrayJson);
			strUrl = 'services/approvalWorkflowDetail/update';
		} else {
			postData = detailJsonData;
			strUrl = 'services/approvalWorkflowDetail/add';
		}
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : postData,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var errorMessage = '';
						if (response.responseText != '[]') {
							var jsonData = Ext
									.decode(response.responseText);
									for(var i=0;i<jsonData.length;i++){
							Ext
									.each(
											jsonData[i].errors,
											function(error,
													index) {
												errorMessage = errorMessage +  error.errorMessage
														+ "<br/>";
											});
											}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.Msg.alert("Error",
										errorMessage);
							}
						}
						if(errorMessage=='')
						{
							me.getPackageAssignmentPopup().close();
							me.getPackageGrid().refreshData();
						}
						
					},
					failure : function(response) {
					}
				});
	},
	savePkgAccAssignment : function(identifier) {
		var me = this;
		var postData = null;
		var strUrl = null;
		var accountComboRef = me.getCmbPkgAccount();
		var packageComboRef = me.getPackageCombo();
		var matrixComboRef = me.getCmbPkgAccMatrix();
		var approvalCountTextRef = me.getTxtApproversPkgAcc();
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"accountId\":" + "\"" + accountComboRef.getValue()
				+ "\",";
		detailJsonData += "\"packageId\":" + "\"" + packageComboRef.getValue()
				+ "\",";
		if ('MAKERCHECKER' == matrixComboRef.getValue()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.getValue() + "\",";
		}
		detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.getValue()
				+ "\"}}";

		if (!Ext.isEmpty(identifier)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo : '1',
						identifier : identifier,
						userMessage : detailJsonData
					});
			postData = Ext.encode(arrayJson);
			strUrl = 'services/approvalWorkflowDetail/update';
		} else {
			postData = detailJsonData;
			strUrl = 'services/approvalWorkflowDetail/add';
		}
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : postData,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var errorMessage = '';
						if (response.responseText != '[]') {
							var jsonData = Ext
									.decode(response.responseText);
									for(var i=0;i<jsonData.length;i++){
							Ext
									.each(
											jsonData[i].errors,
											function(error,
													index) {
												errorMessage = errorMessage +  error.errorMessage
														+ "<br/>";
											});
											}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.Msg.alert("Error",
										errorMessage);
							}
						}
						if(errorMessage=='')
						{
							me.getPkgAccAssignmentPopup().close();
							me.getPkgAccGrid().refreshData();
						}
						
					},
					failure : function(response) {
					}
				});
	},
	handleRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;
		if (actionName === 'edit') {
			me.openAccountAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			me.deleteDetail(record.get('identifier'), me.getAccountGrid());
		}
	},
	handlePackageRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;
		if (actionName === 'edit') {
			me.openPackageAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			me.deleteDetail(record.get('identifier'), me.getPackageGrid());
		}
	},
	handlePkgAccRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;

		if (actionName === 'edit') {
			me.openPkgAccAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			me.deleteDetail(record.get('identifier'), me.getPkgAccGrid());
		}
	},
	deleteDetail : function(identifier, grid) {
		var arrayJson = new Array();

		arrayJson.push({
					serialNo : '1',
					identifier : identifier,
					userMessage : matrixId
				});
		var postData = Ext.encode(arrayJson);
		var strUrl = 'services/approvalMatrixWorkflowDetailList/discard';
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : postData,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						grid.refreshData();
					},
					failure : function(response) {
					}
				});
	},
	enableDisableEntryButtons:function(){
		alert("afterrender")
	}
});