/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	profileName : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	height : 300,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	cls:'non-xn-popup',
	config : {
		historyData : []
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('prfMstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('prfMstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('profileMstTitle', 'Profile History');

			this.items = [{

				xtype : 'panel',
				width : '100%',
				cls:'ft-padding-bottom',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('profileName', 'Profile Name')
									+ " :"
						}, {
							xtype : 'label',
							cls : ' label-font-normal ft-margin-very-small-l',
							text : this.profileName,
							width : '150'
						}]
			}, {
				xtype : 'grid',
				autoScroll : true,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstDescription', 'Description')
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstMaker', 'Maker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 25)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 25)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}]
			}];

			this.bbar = ['->',{
						text : getLabel('btnClose', 'Close'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl, id)
	{
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			url : 'cpon/common/history.json' + '?&' + '$histSeekPageId=history.seek.' + me.getDynamicHistoryUrl( historyUrl ),
			method : 'POST',
			jsonData : Ext.encode(id),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) )
				{
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
					checkerStamp = data.checkerStamp;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				var setRejectRemarks = "";

				if (!Ext.isEmpty(checkerRequestState)
						&& checkerRequestState
								.indexOf("Reject") > -1) {
					setRejectRemarks = data.rejectRemarks;
				}
				var historyData = [
						[getLabel('prfMstHistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('prfMstHistoryPopUpdateAction', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),
										'', setRejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('prfHistoryPopUpTitle', 'Error'),
							msg : getLabel('prfHistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	},
	
	getDynamicHistoryUrl : function(passedUrl)
	{
		var finalUrl = null;
		if( passedUrl == "cpon/alertProfileMst/history.json" )
		{
			finalUrl = 'profileAlert';
		}
		else if( passedUrl == "cpon/reportProfileMst/history.json" )
		{
			finalUrl = 'profileReport';
		}
		else if( passedUrl == "cpon/interfaceProfileMst/history.json" )
		{
			finalUrl = 'profileInterface';
		}
		else if( passedUrl == "cpon/limitProfileMst/history.json" )
		{
			finalUrl = 'profileLimit';
		}
		else if( passedUrl == "cpon/taxProfileMst/history.json" )
		{
			finalUrl = 'profileTax';
		}
		else if( passedUrl == "cpon/chargeFrequencyProfileMst/history.json" )
		{
			finalUrl = 'profileChargeFrequency';
		}
		else if( passedUrl == "cpon/chargeProfileMst/history.json" )
		{
			finalUrl = 'profileCharge';
		}
		else if( passedUrl == "cpon/cutoffProfileMst/history.json" )
		{
			finalUrl = 'profileCutoff';
		}
		else if( passedUrl == "cpon/passwordProfileMst/history.json" )
		{
			finalUrl = 'profilePassword';
		}
		else if( passedUrl == "cpon/tokenProfileMst/history.json" )
		{
			finalUrl = 'profileToken';
		}
		else if( passedUrl == "cpon/groupByProfileMst/history.json" )
		{
			finalUrl = 'profileGroupBy';
		}
		else if( passedUrl == "cpon/scheduleProfileMst/history.json" )
		{
			finalUrl = 'profileSchedule';
		}
		else if( passedUrl == "cpon/arrangementProfileMst/history.json" )
		{
			finalUrl = 'profileArrangement';
		}
		else if( passedUrl == "cpon/paymentWorkflowProfileMst/history.json" )
		{
			finalUrl = 'paymentWorkflow';
		}
		else if( passedUrl == "cpon/collectionWorkflowProfileMst/history.json" )
		{
			finalUrl = 'collectionWorkflow';
		}
		else if( passedUrl == "cpon/typeCodeProfileMst/history.json" )
		{
			finalUrl = 'typeCodeProfileMst';
		}
		else if( passedUrl == "cpon/systemBeneProfileMst/history.json" )
		{
			finalUrl = 'systemBeneProfile';
		}
		else if( passedUrl == "cpon/workflowProfileMst/history.json" )
		{
			finalUrl = 'workflowProfileMst';
		}
		else if( passedUrl == "cpon/overdueProfileMst/history.json" )
		{
			finalUrl = 'overdueProfileMst';
		}
		else if( passedUrl == "cpon/financingProfileMst/history.json" )
		{
			finalUrl = 'financingProfileMst';
		}
		else if( passedUrl == "cpon/achPassThruProfileMst/history.json" )
		{
			finalUrl = 'achPassThruProfile';
		}
		return finalUrl;
	}
});
