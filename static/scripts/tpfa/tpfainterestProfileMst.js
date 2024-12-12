function getLabel(key, defaultText)
{
	return defaultText;
}
var COLUMN_MODEL = [ {
			"colId" : "frmAmt",
			"colHeader" : getLabel('amtFrom','Amount From'),
			"hidden" : false,
			"width" : '15%',
			"colType" : "amount",
			resizable : false,
			hideable : false,
			//menuDisabled : true,
			sortable : false,
			draggable : false,
			forceFit : true
		}, {
			"colId" : "toAmt",
			"colHeader" : getLabel('amtTo','Amount To'),
			"colType" : "amount",
			"hidden" : false,
			"width" : '15%',
			"resizable" : false,
			 menuDisabled : true,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true
		}, {
			"colId" : "rateType",
			"colHeader" : getLabel('rateType','Rate Type'),
			"hidden" : false,
			"width" : '15%',
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			 menuDisabled : true,
			"forceFit" : true
		}, {
			"colId" : "interestRate",
			"colType" : "amount",
			"colHeader" :  getLabel('fixedRate','Fixed Rate')+' (%)',
			"hidden" : false,
			"width" : '15%',
			"resizable" : false,
			 menuDisabled : true,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true
			
		}, {
			"colId" : "baseRateCodeDesc",
			"colType" : "baseRateCodeDesc",
			"colHeader" : getLabel('benchmarkRate','Benchmark Rate'),
			"hidden" : false,
			"width" : '25%',
			"resizable" : false,
			 menuDisabled : true,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true
		}, {
			"colId" : "spread",
			"colHeader" :  getLabel('spread','Spread')+' (%)',
			"colType" : "amount",
			"hidden" : false,
			"width" : '15%',
			"resizable" : false,
			 menuDisabled : true,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true
		}];

function displayFrame() 
{
	document.getElementById('framediv').style.display='block';
}
            

function showInterestProfilePopup(recordKeyNo, profileDate, csrfTokenName,
		csrfTokenValue) {

	$.ajax({
				url : "services/tpfaViewInterestProfileMstPopup.json",

				type : "POST",
				dataType : "json",
				async : false,
				data : {
					csrfTokenName : csrfTokenValue,
					'recordKeyNo' : recordKeyNo,
					'profileDate' : profileDate
				},
				complete : function(response) {
					var objResponse = JSON.parse(response.responseText);

					$('#viewSeller').text(objResponse.model.sellerId);
					$('#viewProfileCode').text(objResponse.model.profileCode);
					$('#viewProfilefDesc')
							.text(objResponse.model.profileDescription);
					$('#viewProfilefDesc').attr('title',
							objResponse.model.profileDescription);
					var profileType = objResponse.model.entityType;
					if (profileType === 'B')
						$('#viewProfileType').text(getLabel('bank', 'Bank'));
					else if (profileType === 'C')
						$('#viewProfileType').text(getLabel('apportionment',
								'Apportionment'));

					var interestType = objResponse.model.interestType;
					if (interestType === 'D')
						$('#viewInterestType').text(getLabel('debit', 'Debit'));
					else if (interestType === 'C')
						$('#viewInterestType')
								.text(getLabel('credit', 'Credit'));
					
					var slabType = objResponse.model.slabType;
					if(slabType === '1'){
						$('#viewSlabType').text(getLabel('direct', 'Direct'));
					}else if(slabType === '2'){
						$('#viewSlabType').text(getLabel('slab', 'Slab'));
					}else{
						$('#viewSlabType').text(getLabel('slidingSlab', 'Sliding Slab'));
					}

					var interestBasisCode = objResponse.model.interestBasis;

					if (interestBasisCode === 360)
						$('#viewInterestBasis').text(getLabel("actual365",
								"Actual/360"));
					else if (interestBasisCode === 365)
						$('#viewInterestBasis').text(getLabel("actual365",
								"Actual/365"));
					else if (interestBasisCode === -1)
						$('#viewInterestBasis').text(getLabel("actualValue",
								"Actual/Actual"));

					$('#viewPrfCcy').text(objResponse.model.ccyCode);

					var dtlParentRecKey = objResponse.dtlParentRecKey;
					var dtlLastChangedDate = objResponse.dtlLastChangedDate;
					var dtlIsActive = objResponse.dtlIsActive;
					var profileDate = objResponse.profileDate;
					var pageMode = objResponse.pageMode;
					var strViewState = objResponse.lmsViewState;
					if ('popupView' == pageMode) {
						showCancel = false;
						pageMode = 'view';
					}
					var url = 'services/tpfaInterestProfileDtlList.srvc' + '?'
							+ csrfTokenName + '=' + csrfTokenValue
							+ '&$viewState=' + encodeURIComponent(strViewState)
							+ '&$showCancel=' + showCancel + '&$profileDate='
							+ profileDate;

					if (!Ext.isEmpty(dtlParentRecKey)) {
						url = url + '&$dtlParentRecKey=' + dtlParentRecKey
								+ '&$dtlIsActive=' + dtlIsActive
								+ '&$dtlLastChangedDate=' + dtlLastChangedDate;
					}

					$('#TPFAInterestProfilePopupDiv').dialog({
						autoOpen : false,
						maxHeight : 550,
						minHeight : 156,
						title : (interestType == 'D') ? getLabel('lbl.debitInterestProfile','Debit Interest Profile') : getLabel('lbl.creditInterestProfile','Credit Interest Profile'),
						width : 860,
						modal : true,
						resizable : false,
						draggable : false,
						dialogClass : 'ux-dialog ft-dialog',
						open : function() {
							
							$('#interestProfileEntryDiv').empty();
							var storeInterestPrf = Ext.create('Ext.data.Store',
									{
										autoLoad : true,
										fields : ['frmAmt', 'toAmt',
												'rateType', 'interestRate',
												'baseRateCode', 'spread',
												'viewState', 'internalSeqNmbr',
												'identifier', 'isDeleted',
												'baseRateCodeDesc'],
										remoteSort : false,
										proxy : {
											type : "ajax",
											method : 'POST',
											url : url,
											reader : {
												type : 'json',
												root : 'd.profile',
												totalProperty : "count"
											}
										},
										filterOnLoad : true
									});
							var grid = Ext.create('Ext.grid.Panel', {
										store : storeInterestPrf,
										overflowY : false,
										cls: 'interestProfilePopupGrid',
										columns : getColumns(COLUMN_MODEL),
										renderTo : 'interestProfileEntryDiv'
									});
						}
					});
				}
			});

	$('#TPFAInterestProfilePopupDiv').dialog("open");
	 $(window).scrollTop(0);
	$("#TPFAInterestProfilePopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });

}// showInterestProfile
function showInterestProfile(recordKeyNo, profileDate, csrfTokenName,
		csrfTokenValue) {
	 showInterestProfilePopup(recordKeyNo, profileDate, csrfTokenName,
		csrfTokenValue);	
}// showInterestProfile
function getColumns(arrColumnModel) {
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null;
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = objCol.width;
			cfgCol.colType = objCol.colType;
			cfgCol.menuDisabled = true;
			cfgCol.resizable = objCol.resizable;
			cfgCol.hideable = objCol.hideable;
			cfgCol.draggable = objCol.draggable;
			cfgCol.flex = objCol.flex;
			// cfgCol.forceFit = objCol.forceFit;
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.align = 'right';
			}
			if (objCol.colId === "rateType") {
				cfgCol.renderer = function columnRenderer(value) {
					if ('F' == value) {
						return 'Fixed';
					} else if ('V' == value) {
						return 'Variable';
					} else {
						return value;
					}
				}
			}
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
 