Ext
	.define(
		'GCP.controller.MessageChooseFormController',
		{
			extend : 'Ext.app.Controller',
			requires : [],
			views :
			[
				'GCP.view.ChooseMessageFormView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'messageFormGroupListPanel',
					selector : 'chooseMessageFormView panel[itemId="messageFormGroupListPanel"]'
				},
				{
					ref : 'messageFormSelectionPanel',
					selector : 'chooseMessageFormView panel[itemId="messageFormSelectionPanel"]'
				},
				{
					ref : 'messageFormListPanel',
					selector : 'chooseMessageFormView panel[itemId="messageFormListPanel"]'
				},
				{
					ref : 'messageFormMethodPanel',
					selector : 'chooseMessageFormView panel[itemId="messageFormMethodPanel"]'
				},
				{
					ref : 'selectMessageFormPanelContainer',
					selector : 'chooseMessageFormView container[itemId="selectMessageFormPanelContainer"]'
				},
				{
					ref : 'selectMessageLabelPanel',
					selector : 'chooseMessageFormView panel[itemId="selectMessageLabelPanel"]'
				},
				{
					ref : 'seller',
					selector : 'chooseMessageFormView [itemId="sellerCode"]'
				}
			],
			config :
			{
				selectdFormGroup : null,
				selectedForm : null,
				client : null,
				sellerName : null
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
				
				me
					.control(
					{
						'chooseMessageFormView' :
						{
							render : function() {
								//me.loadFormGroupList(formGroupList);
								if(entity_type == 1)
									me.client=clientDesc;
								//	me.populateMessages(clientCode);
							},
							'clientMenuSelect' : function(code) {
								//me.handleClientMenuChange(code);
							
								me.clientComboSelect(code);
							}
						},
						'chooseMessageFormView #clientDesc':{
						//	populateMessageGroups:me.populateMessages
						},
						'chooseMessageFormView #clientCombo':{
						//	populateMessageGroups:me.clientComboSelect
						}
					} );
			},
			/*populateFormGroupList : function() {
				var me = this;
				var strUrl = 'formGroupList.srvc';
				Ext.Ajax.request({
							url : strUrl,
							method : "POST",
							success : function(response) {
								me.loadFormGroupList(Ext
										.decode(response.responseText));
							},
							failure : function(response) {
								// console.log('Error Occured');
							}
						});
			},*/
			clientComboSelect : function(combo, record) {
				var me = this;
					//me.handleClientComboChange(combo, record);
				//	me.populateMessages(combo,null);
					},
			loadFormGroupList : function(formGroupList) {
				var me = this;
				var selectedType = "";
				var charLimitReached = 'N';
				var truncatedCheckboxLabel = '';
				var checkboxLabel = '';
				var parentCt = me.getMessageFormGroupListPanel();
				var leftCt = me.getMessageFormGroupListPanel();
				var rightCt = me.getMessageFormListPanel();
				
				var errorLable =  null;
				if(me.getMessageFormSelectionPanel())
					errorLable = me.getMessageFormSelectionPanel().down('label[itemId="noDataErrorLabel"]');
				
				if (formGroupList && formGroupList.length > 0) {
					//var formGroup = data.d.formGroup;
					var checkedFlg = false;
					var disableFlg = false;
					var strCls = '';
					formGroupList.sort(function(a, b){
					    if(a.filterValue < b.filterValue) return -1;
					    if(a.filterValue > b.filterValue) return 1;
					    return 0;
					});
					var checkboxArray = [];
					for (var i = 0; i < formGroupList.length; i++) 
					{
						if(i == 0){
							selectedType = formGroupList[i].filterCode;
							strCls = 'selected-cb-background ux_padding2';
							checkedFlg = true;
							disableFlg = true;
						}
						else {
							checkedFlg = false;
							disableFlg = false;
							strCls = 'ux_margin2 ux_unselected';
						}
						
						checkboxLabel = formGroupList[i].filterValue;
						if (!Ext.isEmpty(checkboxLabel)) {
							if (checkboxLabel.length > 21) {
								truncatedCheckboxLabel = Ext.util.Format.ellipsis(
										checkboxLabel, 21);
								charLimitReached = 'Y';
								//console.log(i+ ":" +truncatedCheckboxLabel);
							} else {
								truncatedCheckboxLabel = checkboxLabel;
								charLimitReached = 'N';
								//console.log(i+ ":" +truncatedCheckboxLabel);
							}
						}
						checkboxArray.push({
									code : formGroupList[i].filterCode,
									boxLabel : truncatedCheckboxLabel,
									checked : checkedFlg,
									cls : strCls,
									readOnly : disableFlg,
									width : 150,
									handler : function(btn, opts) {
										click : me.deselectFormGroupCheckbox(this,
												this.checked);
									},
									listeners : {
										render : function(c) {
											if (c.limitReached === 'Y') {
												Ext.create('Ext.tip.ToolTip', {
															target : c.getEl(),
															html : checkboxLabel
														});
											}
										}
									}
								});
								truncatedCheckboxLabel="";
					}
					if(errorLable)
						errorLable.hide();
					if(leftCt){
						leftCt.removeAll();
						leftCt.show();
						leftCt.add([{
									xtype : 'checkboxgroup',
									columns : 1,
									width : '100%',
									items : checkboxArray
						}]);
					}
					if(rightCt){
						rightCt.removeAll();
						rightCt.show();
					}
					me.populateMessageFormList(selectedType);
					leftCt.doLayout();

				} else
				{
					var emptyLabel = Ext.create('Ext.form.Label', {
								text : getLabel('emptyDataMsg',
										'No Data Available for the moment.'),
								cls : 'ux_font-size14-normal',
								flex : 1
							});
					if(leftCt)
						leftCt.hide();
					
					if(rightCt)
						rightCt.hide();
					if(errorLable){
						errorLable.show();
					}
				}
			},
			deselectFormGroupCheckbox : function(cb, checked) {
				var me = this;
				if (checked) {
					cb.removeCls('ux_unselected');
					cb.addCls('selected-cb-background');
					cb.addCls('.ux_unselected');
					cb.setReadOnly(true);
					var group = cb.findParentByType('checkboxgroup');
					// get the siblings and uncheck
					if (group) {
						group.items.each(function(it) {
									if (it.getName() != cb.getName()) {
										it.setValue(0);
										it.removeCls('selected-cb-background');
										it.addCls('ux_unselected');
										// it.setReadOnly(false);
										it.setReadOnly(true);
									}
								});
					}
					me.selectdFormGroup = cb.code;
					document.getElementById('formGroup').value = me.selectdFormGroup; 
					me.populateMessageFormList(cb.code);
				}
			},
			populateMessageFormList : function(selectdFormGroup) {
				var me = this;
				var seller = me.getSeller();
				if(entity_type==1){
				     me.sellerName=sessionSellerCode;
				}
				var strUrl = 'getMessageFormList.srvc?'+ csrfTokenName + "=" + csrfTokenValue +"&$formGroup="+ selectdFormGroup+"&$client="+me.client+"&$seller="+me.sellerName;

				Ext.Ajax.request({
							url : strUrl,
							method : "POST",
							success : function(response) {
								me.loadMessageFormList(Ext
										.decode(response.responseText));
							},
							failure : function(response) {
								Ext.MessageBox.show(
										{
											title : getLabel('msgError','Error'),
											msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										} );
							}
						});

			},
			loadMessageFormList : function(data) {
				var me = this;
				var formListPanel = me.getMessageFormListPanel();
				if (!Ext.isEmpty(formListPanel)) {
					if (formListPanel.items.length > 0) {
						formListPanel.removeAll();
					}
				}

				if (data && data.d && !Ext.isEmpty(data.d.messageFormMst)) 
				{
					var panelCont = me.getSelectMessageFormPanelContainer();
					if (!Ext.isEmpty(panelCont)) {
						if (panelCont.isHidden()) {
							panelCont.show();
						}
					}

					var errorLabel = null;
					if (!Ext.isEmpty(me.getMessageFormSelectionPanel()))
							errorLabel = me.getMessageFormSelectionPanel()
								.down('label[itemId="noDataErrorLabel"]');
					if (!Ext.isEmpty(errorLabel))
						errorLabel.hide();

					var formList = data.d.messageFormMst;
					formList.sort(function(a, b){
					    if(a.formName < b.formName) return -1;
					    if(a.formName > b.formName) return 1;
					    return 0;
					});
					var checkedFlg = false;
					var disableFlg = false;
					var isFirstItem = true;
					var charLimitReached = 'N';
					var checkboxLabel = '';
					var truncatedCheckboxLabel = '';
					var checkboxArray = [];
					for (var i = 0; i < formList.length; i++) {
							var details;
							checkboxLabel = formList[i].formName;
							details = {
								"formRecordKey" : formList[i].recordKeyNo,
								"formName" : formList[i].formName
							}
							if(isFirstItem){
								checkedFlg = true;
								disableFlg = true;
								me.selectedForm = details;
							}
							else
							{
								checkedFlg = false;
								disableFlg = false;
							}
							if (checkboxLabel.length > 24) {
								truncatedCheckboxLabel = Ext.util.Format.ellipsis(
										checkboxLabel, 24);
								charLimitReached = 'Y';
							} else {
								truncatedCheckboxLabel = checkboxLabel;
								charLimitReached = 'N';
							}
							checkboxArray.push({
										boxLabel : truncatedCheckboxLabel,
										cls : 'ux_radio-button',
										checked : checkedFlg,
										readOnly : disableFlg,
										details : details,
										limitReached : charLimitReached,
										handler : function(btn, opts) {
											click : me.deselectCheckBox(this,
													this.checked, btn.details);
										},
										listeners : {
											render : function(c) {
												if (c.limitReached === 'Y') {
													Ext.create('Ext.tip.ToolTip', {
																target : c.getEl(),
																html : c.details.formName
															});
												}
											}
										}
									});
							isFirstItem = false;
					}
					formListPanel.add([{
								xtype : 'checkboxgroup',
								columns : 3,
								//columnWidth: 0.25,
								width : '100%',
								items : checkboxArray
							}]);
					formListPanel.doLayout();
				} else {
					if (!Ext.isEmpty(me.getSelectMessageFormPanelContainer()))
						me.getSelectMessageFormPanelContainer().hide();
					var errorLabel = me.getMessageFormSelectionPanel()
							.down('label[itemId="noDataErrorLabel"]');
					if (!Ext.isEmpty(errorLabel))
						errorLabel.show();

				}
				me.handleUncheckedFormGroup(me.getMessageFormGroupListPanel(), true);
				if(!Ext.isEmpty(me.selectedForm))
				{
				document.getElementById('formRecordKey').value = me.selectedForm.formRecordKey;
				}
			},
			deselectCheckBox : function(cb, checked, details) {
				var me = this;
				if (checked) {
					cb.setReadOnly(true);
					var group = cb.findParentByType('checkboxgroup');
					// get the siblings and uncheck
					if (group) {
						group.items.each(function(it) {
									if (it.getName() != cb.getName()) {
										it.setValue(0);
										it.setReadOnly(false);
									}
								});
					}
					me.selectedForm = details;
					document.getElementById('formRecordKey').value = details.formRecordKey; 
				}
			},
			handleUncheckedFormGroup : function(component, reqCmplte) {
				var checkBoxGrp = component.down('checkboxgroup');
				if (checkBoxGrp) {
					checkBoxGrp.items.each(function(it) {
								if (reqCmplte == true) {
									if (it.checked)
										it.setReadOnly(true);
									else
										it.setReadOnly(false);
								} else {
									it.setReadOnly(true);
								}
							});
				}
			},
			populateMessages : function (combo,seller) {
				var me = this;
				if(typeof(combo) === "object")
					me.client = combo.getValue();
				else
					me.client = combo;
				me.sellerName = seller;
				if(seller != null)
					var strUrl = "services/getMessageGroupsList.json?$client="+ me.client+"&$seller="+seller;
				else
					var strUrl = "services/getMessageGroupsList.json?$client="+ me.client;
				Ext.Ajax.request({ url: strUrl,
					   method: 'POST',
					   success: function(responseObject){
						   if(responseObject != null){
							var obj = Ext.decode(responseObject.responseText);
							me.loadFormGroupList(obj);
						   }
					   },
					   failure: function(responseObject){
						   Ext.MessageBox.show(
									{
										title : getLabel('msgError','Error'),
										msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									} );
					   }
					});
			}
		} );
