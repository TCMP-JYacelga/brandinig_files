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
            $(document).on('addAccountAssignmentPopup', function(event) {
				me.openAccountAssignmentPopup('ADD');
		});
		 $(document).on('addPackageAssignmentPopup', function(event) {
				me.openPackageAssignmentPopup('ADD');
		});
		  $(document).on('addPkgAccAssignmentPopup', function(event) {
				me.openPkgAccAssignmentPopup('ADD');
				
		});
		$(document).on('saveAccountAssignment', function(event) {
				setDirtyBit();	
				me.saveAccountAssignment();
				
		});
		$(document).on('savePackageAssignment', function(event) {
				setDirtyBit();	
				me.savePackageAssignment();
				
		});
		$(document).on('savePkgAccAssignment', function(event) {
				setDirtyBit();	
				me.savePkgAccAssignment();
				
		});
		me.control({
			'accountAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				/*saveAccountAssignment : function(identifier) {
					me.saveAccountAssignment(identifier);
				}*/
			},
			'packageAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				/*savePackageAssignment : function(identifier) {
					me.savePackageAssignment(identifier);
				}*/
			},
			'pkgAccAssignmentPopup button[itemId="btnAccountAssignSave"]' : {
				/*savePkgAccAssignment : function(identifier) {
					me.savePkgAccAssignment(identifier);
				}*/
			},
			'accountGridView' : {
				/*addAccountAssignmentPopup : function() {
					me.openAccountAssignmentPopup('ADD');
				},*/
				/*handleRowIconClick : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
					me.handleRowIconClick(tableView, rowIndex, columnIndex,
							btn, event, record);
				}*/
				handleRowIconClick : function(btn, record) {
					me.handleRowIconClick(btn, record);
				}
			},
			'packageGridView' : {
				/*addPackageAssignmentPopup : function() {
					me.openPackageAssignmentPopup('ADD');
				},*/
				/*handlePackageRowIconClick : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					me.handlePackageRowIconClick(tableView, rowIndex,
							columnIndex, btn, event, record);
				}*/
				handlePackageRowIconClick : function(btn, record) {
					me.handlePackageRowIconClick(btn, record);
				}
			},
			'pkgAccGridView' : {
				/*addPkgAccAssignmentPopup : function() {
					me.openPkgAccAssignmentPopup('ADD');
				},*/
				/*handlePkgAccRowIconClick : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					me.handlePkgAccRowIconClick(tableView, rowIndex,
							columnIndex, btn, event, record);
				}*/
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
		isErr = false;
		/*if(!$('#accAsgErrMsg').hasClass('ui-helper-hidden'))
			$('#accAsgErrMsg').addClass('ui-helper-hidden');*/
		$('#messageContentDiv').addClass('hidden'); // To hide error section		
		openAccountAssignmentPopup(mode);
		if (!Ext.isEmpty(record)) {
			$('#identifier').val(record.get('identifier'));
			var accountComboRef = $('#accountSelect');
			var matrixComboRef = $('#MatrixSelect');
			var approvalCountTextRef = $('#approverNo');
            var acctNmbr = record.get('displayField').substring( 0,record.get('displayField').indexOf("("));
            var accNo = record.get('accountName')+ ' - '+ acctNmbr +'('+ record.get('accountCcyCode') + ')';
			accNo = $("<div/>").html(accNo).text();
			//Condition to check whether account entry is already present or not
			if($("#accountSelect option[value="+ record.get('accountNmbr') + "]").length == 0 ){
				accountComboRef.append($('<option />', {
					value : record.get('accountNmbr'),
					text : accNo
					}));
			}
			accountComboRef.val(record.get('accountNmbr'));
			makeNiceSelect('accountSelect', true);
			//Condition :: If all accounts are added and user trying to edit record then only that entry will be shown in disabled
			if($('#accountSelect option').length == 2 && mode == "EDIT"){
				 $('#accountSelect').prop('disabled', 'disabled');
				 $('#accountSelect-niceSelect').prop('disabled', 'disabled');
			}else{
				$("#accountSelect").removeAttr("disabled");
				$("#accountSelect-niceSelect").removeAttr("disabled");
				
				$('#accountSelect').removeAttr('readonly');
				$('#accountSelect-niceSelect').removeAttr('readonly');
			}

			/*accountComboRef.val(record.get('accountName')+'('+record.get('accountNmbr') + '-'+ record.get('accountCcyCode') + ')');*/
			matrixComboRef.val(record.get('customAxmCode'));
			makeNiceSelect('MatrixSelect', true);
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.val(record.get('approverCount'));
					approvalCountTextRef.removeAttr('disabled');
				$('#approverNoAccLbl').addClass('required');				
				$('#approverNo').bind('blur', function () { markRequired(this);});	
			}else{
				$('#approverNoAccLbl').removeClass('required');				
				$('#approverNo').unbind('blur');	
			}

		} else {
			makeNiceSelect('accountSelect', true);
			$("#accountSelect").removeAttr("disabled");
			$("#accountSelect-niceSelect").removeAttr("disabled");
			
			$('#accountSelect').removeAttr('readonly');
			$('#accountSelect-niceSelect').removeAttr('readonly');
		}
	},
	openPackageAssignmentPopup : function(mode, record) {
		var me = this;
		isErr = false;
		$('#pkgErrMessageContentDiv').addClass('hidden'); // To hide error section		
		if(!$('#pkgAsgErrMsg').hasClass('ui-helper-hidden'))
			$('#pkgAsgErrMsg').addClass('ui-helper-hidden');
		openPackageAssignmentPopup(mode);
		if (!Ext.isEmpty(record)) {
			$('#pkgidentifier').val(record.get('identifier'));
			var packageComboRef = $('#pkgAccountSelect');
			var matrixComboRef = $('#pkgMatrixSelect');
			var approvalCountTextRef = $('#approverNoText');
			var pkgName = record.get('packageName');
			//Condition to check whether package entry is already present or not
			if($("#pkgAccountSelect option[value="+ record.get('packageId') + "]").length == 0 ){
				packageComboRef.append($('<option />', {
					value : record.get('packageId'),
					text : pkgName
					}));
			}
			//Condition :: If all accounts are added and user trying to edit record then only that entry will be shown in disabled
			if($('#pkgAccountSelect option').length == 1 && mode == "EDIT"){
				 $('#pkgAccountSelect').prop('disabled', 'disabled');
			}
			
			packageComboRef.val(record.get('packageId'));
			makeNiceSelect('pkgAccountSelect', true);
			//packageComboRef.val(record.get('packageId'));
			matrixComboRef.val(record.get('customAxmCode'));
			makeNiceSelect('pkgMatrixSelect', true);
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.val(record.get('approverCount'));
				approvalCountTextRef.removeAttr('disabled');
				$('#approverNoTextLbl').addClass('required');				
				$('#approverNoText').bind('blur', function () { markRequired(this);});	
			}else{
				$('#approverNoTextLbl').removeClass('required');				
				$('#approverNoText').unbind('blur');	
			}
		}
	},
	openPkgAccAssignmentPopup : function(mode, record) {
		var me = this;
		isErr = false;
		$('#pkgAccErrMessageContentDiv').addClass('hidden'); // To hide error section		
		if(!$('#pkgAccAsgErrMsg').hasClass('ui-helper-hidden'))
			$('#pkgAccAsgErrMsg').addClass('ui-helper-hidden');
		openPkgAccAssignmentPopup(mode);
		if (!Ext.isEmpty(record)) {
			$('#pkgAccidentifier').val(record.get('identifier'));
			var packageComboRef = $('#pakageAccpaySelect');
			var accountComboRef = $('#accountNameSelect');
			var matrixComboRef = $('#pkgAccMatrixSelect');
			var approvalCountTextRef = $('#approverNoAccPkg');
			packageComboRef.val(record.get('packageId'));
			accountComboRef.val('');
			var strurl ='services/approvalWorkflow/pkgAccountList.json?id='
					+ matrixId
					+ '&package='
					+ record.get('packageId');
			populatepkgAccAccountCombo('accountNameSelect',strurl);
			accountComboRef.val(record.get('accountNmbr'));
			matrixComboRef.val(record.get('customAxmCode'));
			if ('MAKERCHECKER' == record.get('customAxmCode')) {
				approvalCountTextRef.val(record.get('approverCount'));
				approvalCountTextRef.removeAttr('disabled');
				$('#approverNoAccPkgLbl').addClass('required');				
				$('#approverNoAccPkg').bind('blur', function () { markRequired(this);});	
			}else{
				$('#approverNoAccPkgLbl').removeClass('required');				
				$('#approverNoAccPkg').unbind('blur');	
			}

		} else {
			//var accountComboRefNew = $('#accountNameSelect_jq');
			//accountComboRefNew.val('Select');
			$('#accountNameSelect option').remove();
		}
		makeNiceSelect('pakageAccpaySelect', true);
		makeNiceSelect('accountNameSelect', true);
		makeNiceSelect('pkgAccMatrixSelect', true);
	},
	saveAccountAssignment : function() {
		var identifier=$('#identifier').val();
		var me = this;
		var postData = null;
		var strUrl = null;
		var accountComboRef = $('#accountSelect');
		var matrixComboRef = $('#MatrixSelect');;
		var approvalCountTextRef = $('#approverNo');
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"accountId\":" + "\"" + accountComboRef.val()
				+ "\",";
		var arrError = [];
		var element = null, strMsg = null, strTargetDivId = 'messageContentDiv';
		
		if(accountComboRef.val() == ""){
			arrError.push("Please Select Account Name");
		}
		if(matrixComboRef.val() == ""){
			arrError.push("Please Select Approval Matrix");
		}
		if('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() <	 1){
			arrError.push("Number of Approvers should be greater than or equal to 1");
		}
		if ('MAKERCHECKER' == matrixComboRef.val()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.val() + "\",";
		}
		/*if('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() <= 1){
			$('#accAsgErrMsg').removeClass('ui-helper-hidden');
			isErr = true;
		}*/

		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			isErr = true;
			$.each(arrError, function(index, error) {
				element = $('<p>').text(error);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #messageContentDiv')
						.removeClass('hidden');
			});
		}else{
			detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.val()
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
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										matrixId = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage + error.errorMessage +"<br/>";
									        });
									}
								}
							}
							if(!Ext.isEmpty(errorMessage))
					        {
					        	Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
							//me.getAccountAssignmentPopup().close();
							resetAccPopUp();
							me.getAccountGrid().refreshData();
							me.getAccountGrid().doLayout();
						},
						failure : function(response) {
						
						}
					});
			isErr = false;
			accountPopupPopulate = false;
		}
	},
	savePackageAssignment : function(identifier) {
		var me=this;
		var postData = null;
		var strUrl = null;
		identifier= $('#pkgidentifier').val();
			var packageComboRef = $('#pkgAccountSelect');
			var matrixComboRef = $('#pkgMatrixSelect');
			var approvalCountTextRef = $('#approverNoText');
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"packageId\":" + "\"" + packageComboRef.val()
				+ "\",";
		var arrError = [];
		var element = null, strMsg = null, strTargetDivId = 'pkgErrMessageArea';
		if(packageComboRef.val() == ""){
			arrError.push("Please Select Payment Package Name");
		}
		if(matrixComboRef.val() == ""){
			arrError.push("Please Select Approval Matrix");
		}
		if('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() < 1){
			arrError.push("Number of Approvers should be greater than or equal to 1");
		}
		if ('MAKERCHECKER' == matrixComboRef.val()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.val() + "\",";
		}
		/*if ('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() <=1) {
			$('#pkgAsgErrMsg').removeClass('ui-helper-hidden');
			isErr = true;
		}*/
		
		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			isErr = true;
			$.each(arrError, function(index, error) {
				element = $('<p>').text(error);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #pkgErrMessageContentDiv')
						.removeClass('hidden');
			});
		}else{
			detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.val()
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
							//var responseData = Ext.decode(response.responseText);
							//me.getPackageAssignmentPopup().close();
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										matrixId = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage + error.errorMessage +"<br/>";
									        });
									}
								}
							}
							if(!Ext.isEmpty(errorMessage))
					        {
					        	Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
							me.getPackageGrid().refreshData();
							resetPkgPopUp();
						},
						failure : function(response) {
						}
					});
			isErr = false;
			pkgPopupPopulate = false;
		}
	},
	savePkgAccAssignment : function(identifier) {
		identifier=$('#pkgAccidentifier').val();
		var me = this;
		var postData = null;
		var strUrl = null;
		var packageComboRef = $('#pakageAccpaySelect');
		var accountComboRef = $('#accountNameSelect');
		var matrixComboRef = $('#pkgAccMatrixSelect');
		var approvalCountTextRef = $('#approverNoAccPkg');
		var detailJsonData = '';
		detailJsonData = "{\"details\":" + "{";
		detailJsonData += "\"parentViewState\":" + "\"" + matrixId + "\",";
		detailJsonData += "\"accountId\":" + "\"" + accountComboRef.val()
				+ "\",";
		detailJsonData += "\"packageId\":" + "\"" + packageComboRef.val()
				+ "\",";
		if ('MAKERCHECKER' == matrixComboRef.val()) {
			detailJsonData += "\"approvalCount\":" + "\""
					+ approvalCountTextRef.val() + "\",";
		}
		var arrError = [];
		var element = null, strMsg = null, strTargetDivId = 'pkgAccErrMessageArea';
		if(packageComboRef.val() == ""){
			arrError.push("Please Select Payment Package Name");
		}
		if(accountComboRef.val() == "" || accountComboRef.val() == null){
			arrError.push("Please Select Account Name");
		}		
		if(matrixComboRef.val() == ""){
			arrError.push("Please Select Approval Matrix");
		}
		if('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() < 1){
			arrError.push("Number of Approvers should be greater than or equal to 1");
		}
		/*if ('MAKERCHECKER' == matrixComboRef.val() && approvalCountTextRef.val() <= 1) {
			$('#pkgAccAsgErrMsg').removeClass('ui-helper-hidden');
			isErr = true;
		}*/
		
		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			isErr = true;
			$.each(arrError, function(index, error) {
				element = $('<p>').text(error);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #pkgAccErrMessageContentDiv')
						.removeClass('hidden');
			});
		}else{
			detailJsonData += "\"matrixId\":" + "\"" + matrixComboRef.val()
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
							//var responseData = Ext.decode(response.responseText);
							//me.getPkgAccAssignmentPopup().close();
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										matrixId = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage + error.errorMessage +"<br/>";
									        });
									}
								}
							}
							if(!Ext.isEmpty(errorMessage))
					        {
					        	Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
							me.getPkgAccGrid().refreshData();
							resetPkgAccPopUp();
						},
						failure : function(response) {
						}
					});
			isErr = false;
			accountPkgPopupPopulate = false;
		}
	},
	
	handleRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;
		if (actionName === 'edit') {
			$("#accountSelect_jq").removeClass('requiredField');
			$("#MatrixSelect").removeClass('requiredField');
			$("#approverNo").removeClass('requiredField');
			setDirtyBit();
			me.openAccountAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			setDirtyBit();
			me.deleteDetail(record.get('identifier'), me.getAccountGrid());
			accountPopupPopulate = false;
		}
	},
	handlePackageRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;
		if (actionName === 'edit') {
			$("#pkgAccountSelect").removeClass('requiredField');
            $("#pkgMatrixSelect").removeClass('requiredField');
            $("#approverNoText").removeClass('requiredField');
			setDirtyBit();
			me.openPackageAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			setDirtyBit();
			me.deleteDetail(record.get('identifier'), me.getPackageGrid());
			pkgPopupPopulate = false;
		}
	},
	handlePkgAccRowIconClick : function(btn, record) {
		var me = this;
		var actionName = btn;
		if (actionName === 'edit') {
			$("#pakageAccpaySelect").removeClass('requiredField');
            $("#accountNameSelect-niceSelect").removeClass('requiredField');
            $("#pkgAccMatrixSelect").removeClass('requiredField');
            $("#approverNoAccPkg").removeClass('requiredField');
			setDirtyBit();
			me.openPkgAccAssignmentPopup('EDIT', record);
		} else if (actionName === 'delete') {
			setDirtyBit();
			me.deleteDetail(record.get('identifier'), me.getPkgAccGrid());
			accountPkgPopupPopulate = false;
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
						var errorMessage = '';
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									matrixId = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
							         	errorMessage = errorMessage + error.errorMessage +"<br/>";
							        });
								}
							}
						}
						if(!Ext.isEmpty(errorMessage))
				        {
				        	Ext.MessageBox.show({
								title : getLabel("errorTitle","Error"),
								msg : errorMessage,
								buttons : Ext.MessageBox.OK,
								cls : 'ux_popup',
								icon : Ext.MessageBox.ERROR
							});
				        }
						grid.refreshData();
					},
					failure : function(response) {
					}
				});
	}
});