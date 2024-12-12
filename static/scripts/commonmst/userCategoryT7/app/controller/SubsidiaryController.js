
Ext.define('GCP.controller.SubsidiaryController', {
	extend: 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	refs: [{
		ref : 'subsidiaryView',
		selector : 'subsidiarySelectPopup[itemId=subsidiary_view]'
	}, {
		ref: 'subsidiaryGrid',
		selector: 'subsidiarySelectPopup smartgrid[itemId=grid_subsidiary_view]'
	}],
	strUrl: '',
	userMstSelectPopup: null,
	config :
	{
		selection : false
	},
	
	init: function() {
		var me = this;
		GCP.getApplication().on({
					showcategorysubsidiary: function(userCategory,sellerCode,corporation) {
						me.showSubsidiaryPopup(userCategory,sellerCode,corporation);
					}
		});
		me.control({
			'subsidiarySelectPopup button[itemId=gridOkBtn]': {
				click: me.handlePopupClose
			},
			'subsidiarySelectPopup[itemId=subsidiary_view] smartgrid': {
				gridPageChange: me.handleLoadGridData,
				gridSortChange:me.handleLoadGridData,
				select : me.addSelected
			}
			
		});
	},
	
	
	makeSelection : function(selectedFlag){	
		this.selection=selectedFlag;
	},
	
	addSelected : function(row, record, index , eopts){
			record.raw.assigned=true;
	},	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var subsidiaryGrid = me.getSubsidiaryGrid();
		if(!Ext.isEmpty(subsidiaryGrid)) {
			var url = "services/userCategorySubsidiaryList.json";
			url = subsidiaryGrid.generateUrl(url, subsidiaryGrid.pageSize, newPgNo, oldPgNo);
			var strUrl = url + '&$userCategory='+userCategory;
			me.strUrl = strUrl;
			subsidiaryGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	showSubsidiaryPopup: function(userCategory,sellerCode,corporation) {
			var me = this;
			var localIsAllAssigned = $("#allSubsidiariesSelectedFlag").val();
			var userMstSelectPopup = me.userMstSelectPopup;
			if (Ext.isEmpty(userMstSelectPopup)) {
				var colModel = me.getColumns();
				var storeModel = {
					fields : ['assigned', 'clientDescription','clientCode','identifier',
							'assignmentStatus', 'adminEnable', 'brEnable', 'bankRepEnable', 'checksEnable','lmsEnable','fscEnable','mobileEnable',
							'collectionEnable','forecastEnable', 'incomingAchEnable', 'incomingWireEnable', 'paymentEnable', 'positivePayEnable',
							'portalEnable','uneditable','tradeEnable','loansEnable','depositsEnable','investmentEnable','limitsEnable'],
					proxyUrl : 'services/userCategorySubsidiaryList.json',
					rootNode : 'd.details',
					totalRowsNode : 'd.__count'
				};

				userMstSelectPopup = Ext.create(
						'GCP.view.SubsidiarySelectPopup', {
							title : getLabel('selectSubsidiay','Select Subsidiary'),
							searchFlag : false,
							itemId : 'subsidiary_view',
							colModel : colModel,
							storeModel : storeModel,
							mode : mode,
							isAllAssigned : localIsAllAssigned
						});
				me.userMstSelectPopup = userMstSelectPopup;
				if(!Ext.isEmpty(corporation))
					me.fetchSubsidiaryForCategory(userCategory,sellerCode,corporation);
			}
			else			
			{
				userMstSelectPopup.isAllAssigned = localIsAllAssigned;
			}
			userMstSelectPopup.show();
			userMstSelectPopup.center();
	},
	getColumns : function(){
		arrColsPref = [{
							colId : 'clientDescription',
							colDesc : getLabel('subsidiary','Subsidiary'),
							colHeader : getLabel('subsidiary','Subsidiary'),
							width : 200
						}, {
							colId : 'assignmentStatus',
							colDesc : getLabel('status','Status'),
							colHeader : getLabel('status','Status'),
							width :70
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push(me.createAssingedActionColumn());
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = objCol.width;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				
				return arrCols;
	
	},
	createAssingedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'assigned',
					colHeader : getLabel('assign','Assign'),	
					width : 70,
					align: 'center',
					items : [{
						itemId : 'assigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							setDirtyBit();
							var subsidiaryGrid = me.getSubsidiaryGrid();
							var subsidiarySelectPopup = subsidiaryGrid.up("subsidiarySelectPopup");
							var isAllAssigned = subsidiarySelectPopup.isAllAssigned;
							if(subsidiaryGrid.mode == 'VIEW')
							{
								return;
							}
							else if(subsidiaryGrid.mode != 'VIEW')
							{
								if(isAllAssigned =='Y')
								{
									return;
								}	
								else
								{
									if(record.data.uneditable === 'Y'){	
										record.set("assigned", true);		
									}
									else
									{
										if (record.data.assigned === false) {
											record.set("assigned", true);
											me.makeSelection(true);
										} else 
										{
											record.set("assigned", false);
											me.makeSelection(false);
										}
									}
								}
								
							}
							
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
								
							var subsidiaryGrid = me.getSubsidiaryGrid();
							var subsidiarySelectPopup = subsidiaryGrid.up("subsidiarySelectPopup");
							var isAllAssigned = subsidiarySelectPopup.isAllAssigned;	
							if (!record.get('isEmpty')) {
								if(isAllAssigned =='Y')
								{
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								}
								else
								{
									if(record.data.uneditable === 'Y'){	
									var iconClsClass = 'icon-checkbox-checked-grey';
									return iconClsClass;
									}
									else
									{
										if (record.data.assigned === true) {
											var iconClsClass = 'icon-checkbox-checked';
											return iconClsClass;
										} else {
											var iconClsClass = 'icon-checkbox-unchecked';
											return iconClsClass;
										}
									}
								}
							}
						}
					}]
				};

				return objActionCol;
	},
	fetchSubsidiaryForCategory: function(userCategory,sellerCode,corporation) {
		var me = this;
		var subsidiaryGrid = me.getSubsidiaryGrid();
		if(!Ext.isEmpty(subsidiaryGrid)) {
			var url = "services/userCategorySubsidiaryList.json";
			url = subsidiaryGrid.generateUrl(url, subsidiaryGrid.pageSize, 1, 1);
			var strUrl = url + '&$userCategory='+userCategory + '&$sellerCode='+sellerCode + '&$corporationCode='+corporation;
			me.strUrl = strUrl;
			subsidiaryGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	handleAfterGridDataLoad: function(grid, jsonData) {
		var me = this;
		var store = grid.getStore();
		var records = store.data;
		
		if (!Ext.isEmpty(records)) {
						var items = records.items;
						var assignedRecords = new Array();
						var uneditableModel = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var record = items[i];
								if(record.get('assigned') == true) {
									assignedRecords.push(record);
									if(record.get("uneditable") == 'Y')
									{
										uneditableModel.push(record);
									}
								}
							}
						}
						if (assignedRecords.length > 0)
							grid.getSelectionModel().select(assignedRecords);
						
			}
		
		if(grid.mode == 'VIEW') {
			grid.getSelectionModel().setLocked(true);
		}
			
	},
	handlePopupClose: function(btn) {
		var me = this;
		if(!Ext.isEmpty(me.getSubsidiaryGrid())) {
			me.updateSelectedServices(me.getSubsidiaryGrid().store.data.items);
		}
		
		if(!Ext.isEmpty(me.getSubsidiaryView()))
			me.getSubsidiaryView().hide();
	},
	updateSelectedServices: function(gridRecords) {
		var selectedWidgetItems ='';
		var me = this;
		var subsidiaryGrid = me.getSubsidiaryGrid();
		var subsidiarySelectPopup = subsidiaryGrid.up("subsidiarySelectPopup");
		var isAllAssigned = subsidiarySelectPopup.isAllAssigned;
		var objArray = new Array();
		var index = 0;
		
			for (index = 0; index < gridRecords.length; index++) {
			var clientCode = gridRecords[index].data.clientCode;
			var assigned = gridRecords[index].data.assigned;
			var identifier = gridRecords[index].data.identifier;
				if(!Ext.isEmpty(isAllAssigned) && isAllAssigned=='Y'){
					assigned = true;
				}
				objArray.push({
					"clientCode": clientCode,
					"assigned": assigned,
					"identifier" : identifier
				});
			}
			
				//BUG FIX: handling case where user just open subsidiarySelectPopup and clicks OK then all previously selected services vanishes
				if(!this.selection){
				for (var index  in objArray){
					var orginalObj = objArray[index];
				    var isAssigned = orginalObj["assigned"];
					if(true === isAssigned){
					  me.makeSelection(true);
					  break;
					}
				 }
				}
		
		for(var count = 0; count < gridRecords.length; count++) {
		
			var brEnable = gridRecords[count].get('brEnable');
			var paymentEnable = gridRecords[count].get('paymentEnable');
			var adminEnable = gridRecords[count].get('adminEnable');
			
			var bankRepEnable = gridRecords[count].get('bankRepEnable');
			var checksEnable = gridRecords[count].get('checksEnable');
			var collectionEnable = gridRecords[count].get('collectionEnable');
			var coordinatorEnable = gridRecords[count].get('coordinatorEnable');
			var forecastEnable = gridRecords[count].get('forecastEnable');
			
			var fscEnable = gridRecords[count].get('fscEnable');
			var incomingAchEnable = gridRecords[count].get('incomingAchEnable');
			var incomingWireEnable = gridRecords[count].get('incomingWireEnable');
			var lmsEnable = gridRecords[count].get('lmsEnable');
			var positivePayEnable = gridRecords[count].get('positivePayEnable');
			var remitEnable = gridRecords[count].get('remitEnable');
			var tradeEnable = gridRecords[count].get('tradeEnable');
			var loansEnable = gridRecords[count].get('loansEnable');
			var investmentEnable = gridRecords[count].get('investmentEnable');
			var depositsEnable = gridRecords[count].get('depositsEnable');
			var limitsEnable = gridRecords[count].get('limitsEnable');
			var portalEnable = gridRecords[count].get('portalEnable');
			var mobileEnable = gridRecords[count].get('mobileEnable');
			var imgSrc="";
			if(subsidiaryGrid.mode == 'VIEW') {
				imgSrc = 'static/images/icons/icon_checked_grey.gif';
			}
			else if(subsidiaryGrid.mode != 'VIEW' && !this.selection){
				imgSrc = 'static/images/icons/icon_unchecked.gif';
			}
			else{
				imgSrc = 'static/images/icons/icon_checked.gif';
			}
			
			if(!Ext.isEmpty(brEnable) && brEnable == "Y") {
				this.serviceCheckBoxClick('brEnable', imgSrc);
				this.granularServiceHideShow('brEnable', imgSrc,'#divGranular_brGranPrivEnable');
			}
			if(!Ext.isEmpty(paymentEnable) && paymentEnable == "Y") {
				this.serviceCheckBoxClick('paymentEnable',imgSrc);
				this.granularServiceHideShow('paymentEnable', imgSrc,'#divGranular_paymentGranPrivEnable');
				
			}
			if(!Ext.isEmpty(adminEnable) && adminEnable == "Y") {
				this.serviceCheckBoxClick('adminEnable', imgSrc);
				
			}
			if(!Ext.isEmpty(bankRepEnable) && bankRepEnable == "Y") {
				this.serviceCheckBoxClick('bankRepEnable',imgSrc);
				
			}if(!Ext.isEmpty(checksEnable) && checksEnable == "Y") {
				this.serviceCheckBoxClick('checksEnable', imgSrc);
				this.granularServiceHideShow('checksEnable', imgSrc,'#divGranular_checksGranPrivEnable');
				
			}if(!Ext.isEmpty(collectionEnable) && collectionEnable == "Y") {
				this.serviceCheckBoxClick('collectionEnable', imgSrc);
				
			}if(!Ext.isEmpty(coordinatorEnable) && coordinatorEnable == "Y") {
				this.serviceCheckBoxClick('coordinatorEnable', imgSrc);
				
			}if(!Ext.isEmpty(forecastEnable) && forecastEnable == "Y") {
				this.serviceCheckBoxClick('forecastEnable', imgSrc);
				
			}if(!Ext.isEmpty(fscEnable) && fscEnable == "Y") {
				this.serviceCheckBoxClick('fscEnable', imgSrc);
				
			}if(!Ext.isEmpty(incomingAchEnable) && incomingAchEnable == "Y") {
				this.serviceCheckBoxClick('incomingAchEnable', imgSrc);
				
			}if(!Ext.isEmpty(incomingWireEnable) && incomingWireEnable == "Y") {
				this.serviceCheckBoxClick('incomingWireEnable');
				
			}if(!Ext.isEmpty(lmsEnable) && lmsEnable == "Y") {
				this.serviceCheckBoxClick('lmsEnable', imgSrc);
				
			}if(!Ext.isEmpty(positivePayEnable) && positivePayEnable == "Y") {
				this.serviceCheckBoxClick('positivePayEnable', imgSrc);
				this.granularServiceHideShow('positivePayEnable', imgSrc,'#divGranular_positivePayGranPrivEnable');
				
			}if(!Ext.isEmpty(remitEnable) && remitEnable == "Y") {
				this.serviceCheckBoxClick('remitEnable', imgSrc);
				
			}if(!Ext.isEmpty(tradeEnable) && tradeEnable == "Y") {
				this.serviceCheckBoxClick('tradeEnable', imgSrc);
				
			}if(!Ext.isEmpty(loansEnable) && loansEnable == "Y") {
				this.serviceCheckBoxClick('loansEnable', imgSrc);
				this.granularServiceHideShow('loansEnable', imgSrc,'#divGranular_loansGranPrivEnable');
				
			}
			
			if(!Ext.isEmpty(investmentEnable) && investmentEnable == "Y") {
				this.serviceCheckBoxClick('investmentEnable', imgSrc);
				
			}
			
			if(!Ext.isEmpty(depositsEnable) && depositsEnable == "Y") {
				this.serviceCheckBoxClick('depositsEnable', imgSrc);
				
			}
			
			if(!Ext.isEmpty(limitsEnable) && limitsEnable == "Y") {
				this.serviceCheckBoxClick('limitEnable', imgSrc);
				
			}
			
			if(!Ext.isEmpty(portalEnable) && portalEnable == "Y") {
				this.serviceCheckBoxClick('portalEnable', imgSrc);
				
			}
			if(!Ext.isEmpty(mobileEnable) && mobileEnable == "Y") {
				this.serviceCheckBoxClick('mobileEnable', imgSrc);				
			}
			
		}
		document.getElementById('selectedSubsidiries').value = Ext.encode(objArray);
		document.getElementById('popupSubsidiarySelectedFlag').value = "Y"; 
	},
	serviceCheckBoxClick : function(id,imgSrc)
	{
			if(document.getElementById("chkServ"+id) != null)
			{
				document.getElementById(id).value = 'Y';
			}
			if(document.getElementById("chkImg_"+id) != null)
			{
				document.getElementById("chkImg_"+id).src = imgSrc;
			}
	},
	granularServiceHideShow:function(id,imgSrc,divId){
	
		if(document.getElementById("chkServ"+id) != null && imgSrc.indexOf("icon_checked.gif") > -1 )
			{
				$(divId).show();
			}
			else 
			{
			  $(divId).hide();
			}
			
	
	}

});