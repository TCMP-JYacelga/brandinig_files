var objClientAutoCompleter = null;
var objAgreementAutoCompleter = null;
var objCompanyRegIdAutoCompleter = null;
var clientCodeValue = null;
var agreementRekKey = null;

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/lmsCmtmStatementRequest/app',		
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter'],
			launch : function() {
				
				document.getElementById( "clientCodeDiv" ).innerHTML = "";
				
					objClientAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
							{
						xtype : 'AutoCompleter',
						fieldLabel : '',
						fieldCls : 'xn-form-text w14 xn-suggestion-box',
						itemId : 'clientCodeItemId',
						cls : 'autoCmplete-field',
						labelSeparator : '',
						renderTo : 'clientCodeDiv',
						cfgUrl : 'services/userseek/{0}.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'lmsCmtmStatementRequestClientSeek',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCRIPTION',
						cfgKeyNode : 'CODE',
						cfgDataNode2 : 'SHORTNAME',
						cfgStoreFields :
						[
							'CODE', 'DESCRIPTION','SHORTNAME'
						],
						cfgExtraParams :
						[
							{
								key : '$filtercode1',
								value : document.getElementById("sellerId").value
							}
						],
						listeners :
						{
							select : function( combo, record, index )
							{
								document.getElementById( "clientId" ).value = record[ 0 ].data.CODE;
								document.getElementById( "clientDesc" ).value = record[ 0 ].data.DESCRIPTION;
								clientCodeValue = record[ 0 ].data.CODE;
								objAgreementAutoCompleter.cfgExtraParams[0].value =  record[ 0 ].data.CODE;
								clearAgreement();
								clearCompanyRegId();
						
							},
							change : function( combo, record, index )
							{
								if(combo.value == ''|| combo.value == null) {
									clearAgreement();
									clearCompanyRegId();
									document.getElementById( "clientId" ).value='';
									document.getElementById( "clientDesc" ).value= '';
									//objAgreementAutoCompleter.setValue('');
								}
							}
						}
					} );					
					objClientAutoCompleter.setValue(document.getElementById( "clientDesc" ).value);		


				if ("" == clientCodeValue || null == clientCodeValue
						|| undefined == clientCodeValue) {
					clientCodeValue = "";
				}
		var seekID = "lmsCmtmStatementRequestAgreementSeek";
		document.getElementById( "agreementDiv" ).innerHTML = "";	
						
		objAgreementAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
									{
			xtype : 'AutoCompleter',
			fieldLabel : '',
			itemId : 'sellerCodeItemId',
			cls : 'autoCmplete-field',
			labelSeparator : '',
			renderTo : 'agreementDiv',
			fieldCls : 'xn-form-text w14 xn-suggestion-box',
			cfgUrl : 'services/userseek/{0}.json',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			cfgSeekId : seekID,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'CODE',
			cfgDataNode2 : 'DESCRIPTION',
			cfgStoreFields :
			[
				'CODE', 'DESCRIPTION','RECORD_KEY_NO'
			],
			cfgExtraParams : 
			[ {
				key : '$filtercode1',
				value : clientCodeValue
			}],
			listeners :
			{
				select : function( combo, record, index )
				{
					document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECORD_KEY_NO;
					document.getElementById( "agreementName" ).value = record[ 0 ].data.CODE;
					agreementRekKey = record[ 0 ].data.RECORD_KEY_NO ;
					objCompanyRegIdAutoCompleter.cfgExtraParams[0].value =  record[ 0 ].data.RECORD_KEY_NO;				
				},
				change : function( combo, record, index )
				{
					if(combo.value == ''|| combo.value == null) {						
						document.getElementById( "agreementRecKey" ).value = '';
						document.getElementById( "agreementName" ).value = '';
						document.getElementById("companyRegId").value='';
						//objCompanyRegIdAutoCompleter.setValue('');						
				}
			}
			}
		} );
		
		objAgreementAutoCompleter.setValue(document.getElementById( "agreementName" ).value);
		
			document.getElementById( "companyIdDiv" ).innerHTML = "";
								
			if( document.getElementById( "sellerId" ) != null ) {
			sellerCodeVal = document.getElementById( "sellerId" ).value;
			}
			if( document.getElementById( "clientCode" ) != null ) {
			clientCodeValue = document.getElementById( "clientCode" ).value
			}									
							
									
									//Company Reg Id
			objCompanyRegIdAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
			{
				xtype : 'AutoCompleter',
				fieldLabel : '',
				itemId : 'companyItemId',
				cls : 'autoCmplete-field',
				labelSeparator : '',
				renderTo : 'companyIdDiv',
				fieldCls : 'xn-form-text w14 xn-suggestion-box',
				cfgUrl : 'services/userseek/lmsCmtmStatementRequestCompanyIdSeek.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'lmsCmtmStatementRequestCompanyIdSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgStoreFields :
				[
				 'CODE', 'DESCRIPTION'
				],
				//cfgDataNode2 : 'CODE',
				cfgExtraParams :
				[
					{
						key : '$filtercode1',
						value : agreementRekKey
					}
				],
				listeners :
				{
					select : function( combo, record, index )
 					{
						document.getElementById("companyRegId").value = record[0].data.CODE;
						}
									}
								} );
		objCompanyRegIdAutoCompleter.setValue(document.getElementById( "companyRegId" ).value);
		
			
			}	
			});