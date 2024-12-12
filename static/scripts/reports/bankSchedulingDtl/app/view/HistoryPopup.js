/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	productDesc : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 366,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	cls : 'non-xn-popup',
	config : {
		historyData : []
	},
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	
	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('ScheduleHistoryPopUpErrorTitle', 'Error'),
						html : 	getLabel('ScheduleHistoryPopUpErrorMsg', 'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('ScheduleHistoryTitle', 'Report Schedule History');

			this.items = [{

						xtype : 'panel',
						width : '100%',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									cls: 'ux_font-size14 label-color',
									text : getLabel('scheduleDesc', 'Schedule') + " : ",
									width : '100'
								}, {
									xtype : 'label',
									style : { fontWeight: 'normal !important' },
									cls : 'ux_font-size14 label-font-normal',
									html : "&nbsp" +  thisClass.scheduleDesc,
									width : '150'
								}]
					}, {
						xtype : 'grid',
						padding : '12 0 0 0',
						cls : 'x-grid-padding-top',
						autoScroll : true,
						forceFit : true,
						store : arrayData,
						defaultSortable : false,
						columns : [{
									dataIndex : 'schedule_description',
									sortable : false,
									menuDisabled : true,
									text : getLabel('scheduleHistoryPopUpDescription', 'Description')
								}, {
									dataIndex : 'maker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('scheduleMaker', 'Maker'),
									renderer : function(val, meta, rec, rowIndex, colIndex, store) {
						                    if(val.length > 33)
						                    meta.tdAttr = 'title="' + val + '"';
						                    return val;
						            }
								}, {
									dataIndex : 'checker_id',
									sortable : false,
									menuDisabled : true,
									text : getLabel('scheduleChecker', 'Checker'),
									renderer : function(val, meta, rec, rowIndex, colIndex, store) {
						                    if(val.length > 33)
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

	loadHistoryData : function(historyUrl, id) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			//url : historyUrl,
			url : 'services/common/history.json' + '?&' + '$histSeekPageId=history.seek.ReportCenterSchedule',
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
						[getLabel('scheduleHistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('scheduleHistoryPopUpdateDate', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('scheduleHistoryPopUpdateAction', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('scheduleHistoryPopUpdateRemark', 'Remark'),
										'', setRejectRemarks]];
				arrayData = new Ext.data.ArrayStore({fields : ['schedule_description', 'maker_id', 'checker_id', 'reject_remarks']});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('errorTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
