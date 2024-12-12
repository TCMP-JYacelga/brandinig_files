Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});
Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/NotionalQryBVFilter/app',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter', 'Ext.form.DateField'],
			config : {
				temp : null
			},
			launch : function() 
			{
				if (entityType == 0 ){
				var objBankClientCodeAutoCompletor = Ext.create( 'Ext.ux.gcp.AutoCompleter',
				{
				xtype : 'AutoCompleter',
				fieldLabel : '',
				itemId : 'clientCodeItemId',
				fieldCls : 'xn-form-text xn-suggestion-box',
				width: 200,
				height: 25,
				labelSeparator : '',
				cfgUrl : 'services/userseek/notionalQueryBVBankClientIdSeek.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'notionalQueryBVBankClientIdSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgDataNode2 : 'SHORTNAME',
				cfgKeyNode : 'CODE',
				value : clientDesc,
				cfgStoreFields :
				[
					'CODE','DESCRIPTION','SHORTNAME'
				],
			cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : document.getElementById( "sellerId" ).value
				}
			],
			renderTo : 'clientCodeDiv',
		listeners :
		{
			'select' : function( combo, record, index )
			{
				document.getElementById( "clientId" ).value = record[ 0 ].data.CODE;
				document.getElementById( "clientDesc" ).value = record[ 0 ].data.DESCRIPTION;
				document.getElementById( "agreementDesc" ).value = null;
				//createAgreementIdAutoCompletor( document.getElementById( "sellerId" ).value, document.getElementById( "clientId" ).value );
			},
			'change' : function( combo, record, index )
			{
				//TODO
				if (combo.value == null	&& (null == document.getElementById("clientId").value || "" == document.getElementById("clientId").value))
					{
						if (combo.value == '' || combo.value == null) {
					document.getElementById( "clientId" ).value = null;
					document.getElementById( "clientDesc" ).value = null;
					objAgreementIdAutoCompletor.setValue( '' );
					//createAgreementIdAutoCompletor( document.getElementById( "sellerId" ).value, null );
					}
				   }
				    
				 }
			   }
			} );
	}		
	var objAgreementIdAutoCompletor = null		
	if (entityType == 0 ){
		
	objAgreementIdAutoCompletor = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'agreementIdItemId',
		fieldCls : 'xn-form-text xn-suggestion-box',
		width: 200,
		height: 25,
		labelSeparator : '',
		cfgUrl : 'services/userseek/{0}.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : (null == document.getElementById( "clientId" ).value || '' == document.getElementById( "clientId" ).value )?
					'notionalQueryBVAgreementIdSeekAll':'notionalQueryBVAgreementIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCRIPTION',
		cfgKeyNode : 'RECKEY',
		value : agreementCodeModel,
		cfgStoreFields :
		[
			'CODE', 'DESCRIPTION', 'STRUCTURE_TYPE', 'STRUCTURE_SUBTYPE', 'RECKEY'
		],
		cfgExtraParams : (null == document.getElementById( "clientId" ).value || '' == document.getElementById( "clientId" ).value) ? [ {
			key : '$filtercode1',
			value : document.getElementById( "sellerId" ).value
		} ]
				: [ {
					key : '$filtercode1',
					value : document.getElementById( "sellerId" ).value
				}, {
					key : '$filtercode2',
					value : document.getElementById( "clientId" ).value
				}
			],
		renderTo : 'agreementIdDiv',	
		listeners :
		{
			'select' : function( combo, record, index )
			{
				document.getElementById( "agreementCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "agreementDesc" ).value = record[ 0 ].data.DESCRIPTION;
				document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECKEY;
				document.getElementById( "structureType" ).value = record[ 0 ].data.STRUCTURE_TYPE;
				document.getElementById( "structureSubType" ).value = record[ 0 ].data.STRUCTURE_SUBTYPE;
			},
			'change' : function( combo, record, index )
			{
				//TODO
				if(combo.value == ''|| combo.value == null)
				{
					document.getElementById( "agreementCode" ).value = null;
					document.getElementById( "agreementDesc" ).value = null;
					document.getElementById( "agreementRecKey" ).value = null;
					document.getElementById( "structureType" ).value = null;
					document.getElementById( "structureSubType" ).value = null;
				}
			}
		}
	} );
	} 
	else
	{
	objAgreementIdAutoCompletor = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'agreementIdItemId',
		fieldCls : 'xn-form-text xn-suggestion-box',
		width: 200,
		height: 25,
		labelSeparator : '',
		cfgUrl : 'services/userseek/notionalQueryBVClientAgreementIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'notionalQueryBVClientAgreementIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgKeyNode : 'RECKEY',
		cfgStoreFields :
		[
			'CODE', 'DESCRIPTION', 'STRUCTURE_TYPE', 'STRUCTURE_SUBTYPE', 'RECKEY'
		],
		cfgExtraParams :
		[
			{
				key : '$filtercode1',
				value : document.getElementById( "sellerId" ).value
			},
			{
				key : '$filtercode2',
				value : document.getElementById( "clientId" ).value
			}
		],
		renderTo : 'agreementIdDiv',
		listeners :
		{
			'select' : function( combo, record, index )
			{
				document.getElementById( "agreementCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "agreementDesc" ).value = record[ 0 ].data.DESCRIPTION;
				document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECKEY;
				document.getElementById( "structureType" ).value = record[ 0 ].data.STRUCTURE_TYPE;
				document.getElementById( "structureSubType" ).value = record[ 0 ].data.STRUCTURE_SUBTYPE;
				setTransactionType( document.getElementById( "queryType" ).value );
			}
	 	}
	 });
	 temp = objAgreementIdAutoCompletor;
	} 
	 // From Date
	 var fromdtValue = fromDateModel == null || fromDateModel == '' ? '': fromDateModel;
	 var  fromdt = Ext.create('Ext.form.DateField', {
	  	
		name : 'extFromDate',
		itemId : 'extFromDate',
		id : 'extFromDate',
		format : extJsDateFormat,
		minValue : dtLmsRetentionDate,
		maxValue : dtApplicationDate,	
		editable : false,
		fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
		width: 200,
		hideTrigger: 'true',
		value : fromdtValue,
		allowBlank : false,
		renderTo : 'fromDateDiv',
		listeners : {
			'change' : function(field, newValue, oldValue, eOpts) {
				document.getElementById("fromDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			'select' : function(field, value, eOpts) {
				document.getElementById("fromDate").value = Ext.util.Format.date(value, extJsDateFormat);
			}
		}
	});
	
	 // To Date
	var todtValue = toDateModel != '' || toDateModel != null ? toDateModel : '';
	    var todt = Ext.create('Ext.form.DateField', {
		name : 'extToDate',
		itemId : 'extToDate',
		id : 'extToDate',
		format : extJsDateFormat,
		minValue : dtLmsRetentionDate,
		maxValue : dtApplicationDate,
		editable : false,
		fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
		width: 200,
		hideTrigger: 'true',
		value : todtValue,
		allowBlank : false,
		renderTo : 'toDateDiv',
		listeners : {
			'change' : function(field, newValue, oldValue, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			'select' : function(field, value, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(value, extJsDateFormat);
			}
		}
	});
   }
});

function getLabel(key, defaultText)
{
	return defaultText;
}

function onClientChange() {
	temp.setValue( '' );
	document.getElementById( "agreementCode" ).value = '';
	temp.cfgExtraParams[1].value = document.getElementById( "clientId" ).value;
}