var objFromAccAutoCompleter = null;
var objToAccAutoCompleter = null;
var fromAccountId;
var toAccountId;


Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/lms/agreementSweepDtl',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter', 'Ext.form.DateField'],
			launch : function() {
						if (MODE == 'ADD' || MODE == 'EDIT' || (requestState != '0' && interAccountPosFlag == 'N')) {
							//createFromAccountAutoCompleter();
						} //if
				} //launch
		
		
			}); //application




function getLabel(key, defaultText)
{
	return (sweepDtlLabelsMap && !Ext.isEmpty(sweepDtlLabelsMap[key])) ? sweepDtlLabelsMap[key]
	: defaultText
}
jQuery.fn.createFromAccountAutoCompleter = function() {
	var seekId='services/userseek/fromAccountMultiEntitySweepSeek.json';
	if(singleEntity !== '' && multiEntity !== ''){
		if(singleEntity=='T' && multiEntity=='F')
			seekId='services/userseek/fromAccountSingleEntitySweepSeek.json';
	}
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : seekId,
					dataType : "json",
					type : 'POST',
					data : {
						top : -1,
						$autofilter : request.term,
						$sellercode : sellerCode,
						$filtercode1 : agreementCcy,
						$filtercode2 : clientCode,
						$filtercode3 : parentRecordKeyNo,
						$filtercode4 : user
					},
					success : function(data) {
						var clientData = data.d.preferences;
						if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
							var rec = [ {
								label : 'No match found..',
								value : ""
							} ];
							response($.map(rec, function(item) {
								return {
									label : item.label,
									value : item.value
								}
							}));

						}
						else {
							var recData = data.d.preferences;
							response($.map(recData, function(item) {
								return {
									label : item.DISPLAYFIELD,
									value : item.CODE,
									record : item
								}
							}));

						}
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var record = ui.item.record;
				$("#fromAccNmbr" ).val( record.CODE );
				$("#fromAccDesc").val( record.DESCRIPTION );			
	            $("#fromAccCcy").val(record.CCY );
	            $("#fromAccId").val(record.ACCT_ID);
	            $('#toAcctId').createToAccountAutoCompleter();
	            setfromaccdesc();
				resetToAccount();
			},
			change : function(event, ui) {
				if($('#fromAcctId').val() == ''|| $('#fromAcctId').val() == null){
					resetFromAccount();
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});

};
jQuery.fn.createToAccountAutoCompleter = function() {
	var seekId='services/userseek/toAccountMultiEntitySweepSeek.json';
	if(singleEntity !== '' && multiEntity !== ''){
		if(singleEntity=='T' && multiEntity=='F')
			seekId='services/userseek/toAccountSingleEntitySweepSeek.json';
	}
	fromAccountId = $("#fromAccId").val();
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : seekId,
					dataType : "json",
					type : 'POST',
					data : {
						top : -1,
						$autofilter : request.term,
						$sellercode : sellerCode,
						$filtercode1 : agreementCcy,
						$filtercode2 : clientCode,
						$filtercode3 : parentRecordKeyNo,
						$filtercode4 : fromAccountId,
						$filtercode5 : user
					},
					success : function(data) {
						var clientData = data.d.preferences;
						if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
							var rec = [ {
								label : 'No match found..',
								value : ""
							} ];
							response($.map(rec, function(item) {
								return {
									label : item.label,
									value : item.value
								}
							}));

						}
						else {
							var record = data.d.preferences;
							response($.map(record, function(item) {
								return {
									label : item.DISPLAYFIELD,
									value : item.CODE,
									record : item
								}
							}));

						}
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var record = ui.item.record;
				$("#toAccNmbr" ).val( record.CODE );
				$("#toAccDesc").val( record.DESCRIPTION );			
	            $("#toAccCcy").val(record.CCY );
	            $("#toAccId").val(record.ACCT_ID);
	            settoaccdesc();
			},
			change : function(event, ui) {
				if($('#toAcctId').val() == ''|| $('#toAcctId').val() == null){
					resetToAccount();
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});

};

function createFromAccountAutoCompleter() 
{
	document.getElementById( "fromAccDiv" ).innerHTML = "";
	var seekId='fromAccountMultiEntitySweepSeek';
	if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
		if(singleEntity=='T'&&multiEntity=='F')
			seekId='fromAccountSingleEntitySweepSeek';
	}
	 objFromAccAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldCls : 'xn-form-text w15_7 xn-suggestion-box',
		fieldLabel : '',
		itemId : 'fromAccItemId',
		cls : 'autoCmplete-field',	
		allowBlank : false,
		labelSeparator : '',
		cfgUrl : 'services/userseek/{0}.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : seekId,
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCRIPTION',
		cfgDataNode3 : 'CCY',
		//cfgDataNode3 : 'ACCT_ID',
		cfgDataNode4 : 'SAPBPID',
		cfgStoreFields :
			[
				'CODE', 'DESCRIPTION','CCY','ACCT_ID','SAPBPID'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : agreementCcy
					
				},
				{
					key : '$filtercode2',
					value : clientCode				
				},
				{
					key : '$filtercode3',
					value : parentRecordKeyNo
				},
				{
					key : '$filtercode4',
					value : user
				},
				{
					key : '$sellerCode',
					value : sellerCode
				}
				
		],
		listeners :
		{   change : function(combo , record,index) 
			{
				if(combo.value == ''|| combo.value == null){
					resetFromAccount();
				}
			},
			select : function( combo, record, index )
			{
				
				$("#fromAccNmbr" ).val( record[ 0 ].data.CODE );
				$("#fromAccDesc").val( record[ 0 ].data.DESCRIPTION );			
	            $("#fromAccCcy").val(record[0].data.CCY );
	            $("#fromAccId").val(record[0].data.ACCT_ID);
	            createToAccountAutoCompleter($("#fromAccId").val());
	            setfromaccdesc();
				resetToAccount();			
			}
		}
	} );
	 objFromAccAutoCompleter.setValue($("#fromAccNmbr" ).val());
	 objFromAccAutoCompleter.render( Ext.get( 'fromAccDiv' ) );
	 createToAccountAutoCompleter();
}


function createToAccountAutoCompleter (fromAccountId)
{
	document.getElementById( "toAccDiv" ).innerHTML = "";	
	var seekId='toAccountMultiEntitySweepSeek';
	if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
		if(singleEntity=='T'&&multiEntity=='F')
			seekId='toAccountSingleEntitySweepSeek';
	}
	fromAccountId = $("#fromAccId").val();
	objToAccAutoCompleter = Ext.create( 'Ext.ux.gcp.AutoCompleter',
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w15_7 xn-suggestion-box',
				fieldLabel : '',
				itemId : 'toAcctItemId',
				cls : 'autoCmplete-field',
				labelSeparator : '',
				allowBlank : false,
				cfgUrl : 'services/userseek/{0}.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : seekId,
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'CODE',
				cfgDataNode2 : 'DESCRIPTION',
				cfgDataNode3 : 'CCY',
				//cfgDataNode3 : 'ACCT_ID',	
				cfgDataNode4 : 'SAPBPID',
				cfgStoreFields :
					[
						'CODE', 'DESCRIPTION','CCY','ACCT_ID','SAPBPID'
					],
				cfgExtraParams :
				[
					{
						key : '$filtercode1',
						value : agreementCcy
						
					},
					{
						key : '$filtercode2',
						value : clientCode				
					},
					{
						key : '$filtercode3',
						value : parentRecordKeyNo
					},
					{
						key : '$filtercode4',
						value : fromAccountId
					},
					{
						key : '$filtercode5',
						value : user
					},
					{
						key : '$sellerCode',
						value : sellerCode
					}
				],
				listeners :
				{	
					change : function(combo , record,index) 
					{
					if(combo.value == ''|| combo.value == null){
						resetToAccount();
					}
					},
					select : function( combo, record, index )
					{
						$("#toAccNmbr" ).val( record[ 0 ].data.CODE );
						$("#toAccDesc").val( record[ 0 ].data.DESCRIPTION );			
			            $("#toAccCcy").val(record[0].data.CCY );
			            $("#toAccId").val(record[0].data.ACCT_ID);
			            settoaccdesc();
					}
				}
			} );
			objToAccAutoCompleter.setValue($("#toAccNmbr" ).val());
			objToAccAutoCompleter.render( Ext.get( 'toAccDiv' ) );
			
			$( '#balanceCondition' ).attr( "class", "panel panel-default" );
}