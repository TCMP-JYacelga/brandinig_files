Ext.define('GCP.controller.VerifySubmitController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.VerifySubmitView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'verifySubmitView',
				selector : 'verifySubmitView'
			},
			{
				ref : 'verifySubmitFormatDetailsView',
				selector : 'verifySubmitFormatDetailsView'
			},
			{
				ref : 'infoSummaryLowerPanel1',
				selector : 'verifySubmitFormatDetailsView panel[itemId="infoSummaryLowerPanel1"]'
			},
			{
				ref : 'infoSummaryLowerPanel11',
				selector : 'verifySubmitFormatDetailsView panel[itemId="infoSummaryLowerPanel11"]'
			},
			{
				ref : 'verifySubmitFileDetailsView',
				selector : 'verifySubmitFileDetailsView'
			},
			{
				ref : 'infoSummaryLowerPanel2',
				selector : 'verifySubmitFileDetailsView panel[itemId="infoSummaryLowerPanel2"]'
			},{
				ref : 'verifySubmitHookDetailsView',
				selector : 'verifySubmitHookDetailsView'
			},
			{
				ref : 'infoSummaryLowerPanel3',
				selector : 'verifySubmitHookDetailsView panel[itemId="infoSummaryLowerPanel3"]'
			}
			],
	config : {
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
			var me = this;
			me.control({
			'verifySubmitView' : {
				beforerender : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
					
				}
			},
			'verifySubmitView verifySubmitFormatDetailsView panel[itemId="verifySubmitFormatDetailsBarView"] container[itemId="showHideFormatDetailsView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel1();
					var objAccSummInfoBarMore = me.getInfoSummaryLowerPanel11();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
						objAccSummInfoBarMore.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
						objAccSummInfoBarMore.show();
					}
				}
			},
			'verifySubmitFormatDetailsView' : {
				render : this.formatDetailsViewRender
			},
			'verifySubmitView verifySubmitHookDetailsView panel[itemId="verifySubmitHookDetailsBarView"] container[itemId="showHideHookDetailsView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel3();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				}
			},
			'verifySubmitHookDetailsView' : {
				render : this.hookDetailsViewRender
			},
			'verifySubmitView verifySubmitFileDetailsView panel[itemId="verifySubmitFileDetailsBarView"] container[itemId="showHideFileDetailsView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel2();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				}
			},
			'verifySubmitFileDetailsView' : {
				render : this.fileDetailsViewRender
			},
			'verifySubmitFileDetailsView  button[itemId="viewBtn"]' :
			{
				click : function( btn, opts )
				{
					me.viewSampleFile();
				}
			}
		});
	},
	formatDetailsViewRender : function() {
		var me = this;
		var formatDetailsView = me.getVerifySubmitFormatDetailsView();
		formatDetailsView.createSummaryLowerPanelView();
		var interfaceCode = formatDetailsView.down('panel[itemId="infoSummaryLowerPanel1"] panel label[itemId="interfaceName"]');
		interfaceCode.setText(modelId);
		var parentInterfaceCode = formatDetailsView.down( 'panel[itemId="infoSummaryLowerPanel1"] panel label[itemId="parentInterfaceName"]' );
		parentInterfaceCode.setText(parentInterfaceName);
		var processCode = formatDetailsView.down( 'panel[itemId="infoSummaryLowerPanel1"] panel label[itemId="modelId"]' );
		processCode.setText(interfaceName);
		var dataStore = formatDetailsView.down( 'panel[itemId="infoSummaryLowerPanel11"] panel label[itemId="datastoreId"]' );
		dataStore.setText(datastoreName);
		var format = formatDetailsView.down( 'panel[itemId="infoSummaryLowerPanel11"] panel label[itemId="formatId"]' );
		format.setText(formatId);
	},
	hookDetailsViewRender : function() {
		var me = this;
		var hookDetailsView = me.getVerifySubmitHookDetailsView();
		hookDetailsView.createSummaryLowerPanelView();
		var downloadConditionid = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel31"] panel label[itemId="downloadConditionId"]');
		downloadConditionid.setText(downloadCondition);
		
		var generationRoutineId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel32"] panel label[itemId="generationRoutineId"]');
		generationRoutineId.setText(generationRoutineName);
		var emptyFileRoutineId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel32"] panel label[itemId="emptyFileRoutineId"]');
		emptyFileRoutineId.setText(emptyFileRoutineName);
		
		var preProcessHookId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel3"] panel label[itemId="preProcessId"]');
		preProcessHookId.setText(preProcessHook);
		var postProcessHookId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel3"] panel label[itemId="postProcessId"]');
		postProcessHookId.setText(postProcessHook);
		var postUpdateHookId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel3"] panel label[itemId="postUpdationId"]');
		postUpdateHookId.setText(postUpdateHook);
		
		var fileSplitFieldsId = hookDetailsView.down('panel[itemId="infoSummaryLowerPanel33"] panel label[itemId="fileSplitFieldsId"]');
		fileSplitFieldsId.setText(fieldNameList);
	},
	fileDetailsViewRender : function() {
		var me = this;
		var fileDetailsView = me.getVerifySubmitFileDetailsView();
		fileDetailsView.createSummaryLowerPanelView(objArray);
	},
	getObjectsList : function(bandDetailsList)
	{
		var strBandList ; 
		var startIndex = bandDetailsList.indexOf("[");
		var endIndex = bandDetailsList.indexOf("]");
		if(startIndex !== -1 && endIndex !== -1){
			strBandList = bandDetailsList.substring(startIndex+1,endIndex);
		}else{
			strBandList = bandDetailsList;
		}
		var objArray = strBandList.split(',');
		return objArray;
	},
	viewSampleFile : function()
	{
		var me = this;
		var strUrl = "showSampleFile.srvc";
		var form;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState', viewState));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
	
});
