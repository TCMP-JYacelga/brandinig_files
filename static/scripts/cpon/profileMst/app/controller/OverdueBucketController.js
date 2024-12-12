Ext.define('GCP.controller.OverdueBucketController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.OverdueBucketGridView','GCP.view.OverdueDtlPopup'],
	views : ['GCP.view.OverdueBucketGridView','GCP.view.OverdueDtlPopup'],
	refs : [{
				ref : 'overdueDtlPopup',
				selector : 'overdueDtlPopup'
			},{
				ref : 'description',
				selector : 'overdueDtlPopup textfield[itemId="txtDescription"]'
			},{
				ref : 'txtToDay',
				selector : 'overdueDtlPopup numberfield[itemId="txtToDay"]'
			},{
				ref : 'txtBucketNo',
				selector : 'overdueDtlPopup textfield[itemId="txtBucketNo"]'
			},{
				ref : 'actionsPanel',
				selector : 'overdueDtlPopup panel[itemId="actionsPanel"]'
			},
			{
				ref : 'saveBtn',
				selector : 'overdueDtlPopup button[itemId="btnSaveOverdueBuckets"]'
			},
			{
				ref : 'overdueBucketGridView',
				selector : 'overdueBucketGridView'
			}
	],
	config : {
	},
	init : function() {
		var me = this;
		me.control({
			'overdueDtlPopup button[itemId="btnSaveOverdueBuckets"]' : {
				click : function(){
					me.saveOverdueBuckets();
				}
			},
			'overdueDtlPopup button[itemId="btnCancelOverdueBuckets"]' : {
				click : function(){
//					console.log("close");
				}
			},
			'overdueBucketGridView':{
				handleEditSelectedLoanTypes:function(record){
					me.selectLoanTypes(record);
					me.showOverduePopup(true,record);
				},
				handleViewSelectedLoanTypes:function(record){
					me.selectLoanTypes(record);
					me.showOverduePopup(false,record);
				}
			},
			'overdueDtlPopup textfield[itemId="txtDescription"]':{
				blur:function(textField){
					me.checkRequiredFields();
				},
				change:function(textField,newVal,oldVal){
					me.checkRequiredFields();
				}
			},
			'overdueDtlPopup numberfield[itemId="txtToDay"]':{
				blur:function(numberField){
					me.checkRequiredFields();
				},
				change:function(numberField,newVal,oldVal){
					me.checkRequiredFields();
				}
			},
			'overdueDtlPopup':{
				render:function(popup){
					me.checkRequiredFields();
				}
			}
		});
		
	},
	checkRequiredFields:function(){
		var me=this;
		var btnSaveOverdueRef=me.getSaveBtn();
		var descriptionRef=me.getDescription();
		var txtToDayRef=me.getTxtToDay();
		var description=descriptionRef.getValue();
		var toDays=txtToDayRef.getValue();
		if(!Ext.isEmpty(description) && !Ext.isEmpty(toDays)){
			btnSaveOverdueRef.setDisabled(false);
		}else{
			btnSaveOverdueRef.setDisabled(true);
		}
	},
	showOverduePopup:function(editViewFlag,record){
		var me=this;
		var actionMode=null;
		var data=record.data;
		var description=data.overDueDesc;
		var days=data.overDueDays;
		var identifier=data.identifier;
		var btnSaveOverdueRef=me.getSaveBtn();
		if(!Ext.isEmpty(description) && !Ext.isEmpty(days))
		actionMode="EDIT";
		else
		actionMode="ADD";
		
		
		var overdueDtlPopupRef=me.getOverdueDtlPopup();
		if(!Ext.isEmpty(overdueDtlPopupRef)){
		if(editViewFlag){
			overdueDtlPopupRef.setTitle(getLabel('editOverdueDetails','Edit Overdue Details'));
			me.enableDisableOverDueFields(false);
			btnSaveOverdueRef.removeCls('ui-state-disabled');
			btnSaveOverdueRef.show();
		}else{
			overdueDtlPopupRef.setTitle(getLabel('viewOverdueDetails','View Overdue Details'));
			me.enableDisableOverDueFields(true);
			//btnSaveOverdueRef.hide();
			btnSaveOverdueRef.addCls('ui-state-disabled');
		}
		
		overdueDtlPopupRef.mode=actionMode;
		overdueDtlPopupRef.bucketIdentifier=identifier;
		overdueDtlPopupRef.show();
		overdueDtlPopupRef.center();
		}
	},
	selectLoanTypes:function(record){
	var me=this;
	var loanTypeData=[];
	var actionIdentifier=null;
	var currentLoanType=null;
	var currentActionType=null;
	var actionFlag=null;
	loanTypeData=record.data.loanTypeActions;
	if(!Ext.isEmpty(loanTypeData)){
	Ext.each(loanTypeData, function(data, index) {
		 currentLoanType=data.loanType;
		if(!Ext.isEmpty(currentLoanType) && currentLoanType!="null"){
			 currentActionType=data.overDueActionCode;
			actionIdentifier=data.identifier;
			actionFlag=data.updated;
			me.setLoanTypeValue(currentLoanType,currentActionType,actionIdentifier,actionFlag);
		}
	});
	}
	},
	enableDisableOverDueFields:function(enableDisableFlag){
		var me=this;
		var actionsPanelRef=me.getActionsPanel();
		if(!Ext.isEmpty(actionsPanelRef)){
		var txtBucketNoRef=me.getTxtBucketNo();
		var descriptionRef=me.getDescription();
		var txtToDayRef=me.getTxtToDay();
		txtBucketNoRef.setDisabled(enableDisableFlag)
		descriptionRef.setDisabled(enableDisableFlag)
		txtToDayRef.setDisabled(enableDisableFlag)
		
		var loanTypeCombos = actionsPanelRef.query("combo");
		Ext.each(loanTypeCombos, function(combo, index) {
			combo.setDisabled(enableDisableFlag);
		});
		
		}
	},
	setLoanTypeValue:function(loanType,actionType,actionIdentifier,actionFlag){
		var me=this;
		var actionsPanelRef=me.getActionsPanel();
		var comboBox=[];
		var selector="combo[itemId=\""+loanType+"\"]";
		if(!Ext.isEmpty(actionsPanelRef)){
			 comboBox = me.getActionsPanel().query(selector);
			 if(!Ext.isEmpty(comboBox) && comboBox.length > 0){
			 if(!Ext.isEmpty(actionType) && actionType!="null")
			 comboBox[0].setValue(actionType);
			 if(VIEW_MODE ==="VIEW_CHANGES"){
				 if(actionFlag==1){
				  comboBox[0].fieldCls = 'newFieldValue';
				 }if(actionFlag==2){
				  comboBox[0].fieldCls ='modifiedFieldValue';
				 }if(actionFlag==3){
				  comboBox[0].fieldCls = 'deletedFieldValue';
				 }
				}
			 comboBox[0].actionIdentifier=actionIdentifier;
			 }
		}
	},
	refreshGrid:function(){
		var me=this;
		var overdueBucketGridViewRef=me.getOverdueBucketGridView();
		overdueBucketGridViewRef.down('smartgrid').refreshData();
	},
	saveOverdueBuckets : function(){
		var me = this;
		var overdueDtlPopupRef=me.getOverdueDtlPopup();
		if(!Ext.isEmpty(overdueDtlPopupRef)){
		var overDuePopupMode=overdueDtlPopupRef.mode;
		var bucketIdentifier=overdueDtlPopupRef.bucketIdentifier;
		var i=0;
		var actions = new Array();
		var description = me.getDescription().getValue();
		var toDay = me.getTxtToDay().getValue();
		var fromDay = overdueDtlPopupRef.fromDay;
		var nextToDay = overdueDtlPopupRef.nextToDay;
		var bucketNo = me.getTxtBucketNo().getValue();
		var actionDetails = me.getActionsPanel().query("combo");
		for(i = 0; i < actionDetails.length; i++){
			actions[i] ={
				productCode : productCode,
				bucketNo : bucketNo,
				loanType : actionDetails[i].loanType,
				actionCode : actionDetails[i].getValue(),
				identifier:actionDetails[i].actionIdentifier
			}
		}
		if((fromDay <= toDay) && (((nextToDay != 0) && (toDay <= nextToDay-1)) || (nextToDay === 0))){
		if(description && toDay){
		var record =  {
							productCode : productCode,
							description : description,
							toDay : toDay,
							bucketNo : bucketNo,
							identifier:bucketIdentifier
							
						}; 
		var actionMode = {
			mode:overDuePopupMode
		}
		var jsonData = { identifier : parentkey,
						 userMessage : record,	
						 actionDetails : actions,
						 mode:actionMode
						};
						
				Ext.Ajax.request({
					url: 'cpon/overdueProfileMst/addOverdueDtl.json',
					method: 'POST',
					jsonData: jsonData,
					success: function(response) {
						var errorMessage = '';
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage + error.errorMessage +"<br/>";
								        });
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
						}
						me.refreshGrid();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});				
		
		}}else
		{
			Ext.Msg.alert("Incorrect Data","Buckets should not overlap with each other");
		}
		}
	}
});
