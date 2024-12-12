/**
 * @class GCP.controller.BankAdminCategoryPrivilegeController
 * @extends Ext.app.Controller
 * @author Nilesh Shinde
 */

Ext
	.define(
		'GCP.controller.BankAdminCategoryPrivilegeController',
		{
			extend : 'Ext.app.Controller',
			requires : ['Ext.form.field.Checkbox','Ext.ux.gcp.FilterPopUpView'],
			views :
			[
				'GCP.view.BankAdminCategoryAdminPrivilegePopup'
			],
			refs :
			[
				{
					ref : 'lmsHeaderViewIcon',
					selector : 'bankAdminCategoryAdminPrivilegePopupType container panel panel[id="lmsHeader"] button[itemId="lmsHeader_viewIcon"]'
				},
				{
				ref : 'messageTypeGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_messageType_view]'
			}
			],//refs

			init : function()
			{
				var me = this;
				me
					.control(
					{
						'bankAdminCategoryAdminPrivilegePopupType container panel panel[id="masterHeader"] button[itemId="masterHeader_viewIcon"]' :
						{
							click : me.toggleCheckUncheck
						}
					} );
				GCP.getApplication().on({
						showMsgDestinationPopup : function() {
						me.showMsgDestinationPopup();
					}	
				});
				saveMethod = function (popupHandler) {
					if (!Ext.isEmpty(popupHandler)){
						setDirtyBit();
						if (mode != "VIEW" && mode !="VERIFY"){
							me.handleMessageTypeClose();
							
						if (null != document.getElementById(popupHandler.hiddenValuePopUpField)
							&& undefined != document.getElementById(popupHandler.hiddenValuePopUpField)) {
								document.getElementById(popupHandler.hiddenValuePopUpField).value = 'Y';
						}
							popupHandler.hide();
							
						} else if (mode === "VIEW" || mode =="VERIFY") {
						popupHandler.destroy();
						} 
					}
				 },
			cancelMethod=function (popupHandler) {
				if (!Ext.isEmpty(popupHandler)) {
				    popupHandler.destroy();
				    me.userMessageMstSelectPopup=null;
				}
			},
			serviceUrl =function (popupHandler) {
				var strUrl ='';
				strUrl = strUrl + "&$viewState=" + encodeURIComponent( viewState );
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				return strUrl;
			}
					
			},//init

			changeIcon : function( btn )
			{
				if( btn.icon.match( 'icon_uncheckmulti.gif' ) )
				{
					btn.setIcon( "./static/images/icons/icon_checkmulti.gif" );
					return true;
				}
				else
				{
					btn.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
					return false;
				}
			},

			setcheckboxValues : function( selectValue, items, mode )
			{
				for( var i = 0 ; i < items.length ; i++ )
				{
					var checkbox = items[ i ];
					if( checkbox.itemId != '601_VIEW' )
					{
						if( checkbox.mode === mode )
							checkbox.setValue( selectValue );
					}
				}
			},

			toggleCheckUncheck : function( btn, e, eOpts )
			{
				var me = this;
				var btnId = btn.itemId;
				switch( btnId )
				{
					case 'masterHeader_viewIcon':
						var selectValue = me.changeIcon( btn );
						var mode = 'VIEW';
						var items = me.getMasterHeaderPanel().query( 'checkbox' );
						me.setcheckboxValues( selectValue, items, mode );
						break;
					case 'masterHeader_editIcon':
						var selectValue = me.changeIcon( btn );
						var mode = 'EDIT';
						var items = me.getMasterHeaderPanel().query( 'checkbox' );
						me.setcheckboxValues( selectValue, items, mode );
						break;
				}
			},//toggleCheckUncheck

	showMsgDestinationPopup : function() {
		var me = this;
		me.Module = "";
	    var strUrl = 'getBankAdminMsgDestinationList.srvc';
		var module = '';
		var userMstSelectPopup = me.userMessageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'destinationName',
						colDesc :  getLabel('messageDestinationName','Destination Description'),
						colHeader : getLabel('messageDestinationName','Destination Description'),
						width : 180,
						fnColumnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId ){
                            var retVal = value;
                            if (pageMode == 'VIEW' && higlightOldnewValue) {
                                if (record.raw.changeState == 3) {
                                    retVal = '<span class="newFieldGridValue">' + value + '</span>';
                                } 
                                else if (record.raw.changeState == 1) {
                                    retVal = '<span class="modifiedFieldValue">' + value + '</span>';
                                }
                                else if (record.raw.changeState == 2) {
                                    retVal = '<span class="deletedFieldValue">' + value + '</span>';
                                }
                             }
                             return retVal;
                        }
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						width : 150
					}];
			var storeModel = {
				fields : ['destinationName', 'destinationId', 'validFlag','recordKeyNo','assigned',
						 'assignmentStatus', 'categoryCode'],
				proxyUrl : strUrl,
				rootNode : 'd.msgDestinationList',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :getLabel('selectMessageType','Select Destination'),
				cls:'non-xn-popup',
				draggable : false,
				resizable : false,
				autoHeight : false,
				width : 650,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				keyNode : 'destinationId',
				itemId : 'messageType_view',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   //cfgFilterLabel: 'Message Types',
				   //cfgAutoCompleterUrl:'messages',
				   cfgUrl : 'getBankAdminMsgDestinationList.srvc',
				   autoCompleterEmptyText : getLabel('searchByMsgType','Search by Destination Description'),
				   paramName:'filterName',
					dataNode:'destinationName',
					rootNode : 'd.msgDestinationList',
					cfgListCls:'xn-autocompleter-t7',
					autoCompleterExtraParam:
						[{
							key:"$viewState" , value :encodeURIComponent( viewState )
						},
						{
							key:'$skip',value: -1
						},{
							key:'$inlinecount',value: 'allpages'
						},{
							key:'$orderby',value: ''  
						},{
							key:csrfTokenName,value: csrfTokenValue
						}],

				  cfgShowFilter : true,
				  userMode : mode,
				  hiddenValueField : 'selectedRecordsForMessagetype',
				  hiddenValuePopUpField :'popupMessageDestinations',
				  savefnCallback :saveMethod,
				  responseNode:'msgDestinationList',
				  urlCallback :serviceUrl,
				  cancelfnCallback :cancelMethod,
   				  listeners : {
				  'resize' : function(){
				    this.center();
				   }
				  }

			});
			me.userMessageMstSelectPopup = userMstSelectPopup;
		} 
		
		userMstSelectPopup.show();
		userMstSelectPopup.center();
		//me.handleAfterGridDataLoad(me.getMessageTypeGrid(),null);
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	handleMessageTypeClose : function() {
			var me = this;
			if (!Ext.isEmpty(me.getMessageTypeGrid())) {
			var gridRecords = me.getMessageTypeGrid().selectedRecordList;
			me.handleSelectedRecordsForMessagetype(gridRecords);
			}
	},
	 
	handleSelectedRecordsForMessagetype : function(records) {
		var me = this;
		var objSelectedRecords= me.getMessageTypeGrid().selectedRecordList;
		var deSelectedRecord=me.getMessageTypeGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayLocal = new Array();
			var destinationId = objSelectedRecords[index]['destinationId'];
			var destinationName = objSelectedRecords[index]['destinationName'];
			var recordKeyNo = objSelectedRecords[index]['recordKeyNo'];
			var validFlag = objSelectedRecords[index]['validFlag'];
			var assigned = true;
					objArrayLocal.push({
						"destinationId": destinationId,
						"destinationName": destinationName,
						"recordKeyNo": recordKeyNo,
						"validFlag" : validFlag,
						"assigned": assigned
					});
			objArray.push(objArrayLocal);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayLocal = new Array();
			var destinationId = deSelectedRecord[index]['destinationId'];
			var destinationName = deSelectedRecord[index]['destinationName'];
			var recordKeyNo = deSelectedRecord[index]['recordKeyNo'];
			var validFlag = deSelectedRecord[index]['validFlag'];
			var assigned = false;
					objArrayLocal.push({
						"destinationId": destinationId,
						"destinationName": destinationName,
						"recordKeyNo": recordKeyNo,
						"validFlag" : validFlag,
						"assigned": assigned
					});
			objArray.push(objArrayLocal);
		}
		if (!Ext.isEmpty(objArray)) {
			if (!Ext.isEmpty(document
					.getElementById('selectedMessageDestinations')))
				document.getElementById('selectedMessageDestinations').value = Ext.encode(objArray);
			
		}
	
	}
		} );//Ext.define
