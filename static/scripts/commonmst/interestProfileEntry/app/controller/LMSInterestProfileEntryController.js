Ext.define( 'GCP.controller.LMSInterestProfileEntryController',
{
	extend : 'Ext.app.Controller',
	requires : [],
	views :
	[
		'GCP.view.LMSInterestProfileMainView', 'GCP.view.LMSInterestProfileEntryView',
		'GCP.view.LMSInterestProfileEntryToolBarView','GCP.view.LMSInterestProfileEntryDtlToolBarView', 'GCP.view.LMSInterestProfileEntryDetailGridView'
	],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'lmsInterestProfileMainViewRef',
			selector : 'lmsInterestProfileMainViewType'
		},
		{
			ref : 'lmsInterestProfileEntryView',
			selector : 'lmsInterestProfileEntryViewType'
		},
		{
			ref : 'lmsInterestProfileEntryToolBarView',
			selector : 'lmsInterestProfileEntryToolBarViewType'
		},
		{
			ref : 'lmsInterestProfileEntryDtlToolBarView',
			selector : 'lmsInterestProfileEntryDtlToolBarViewType'
		},
		{
			ref : 'lmsInterestProfileEntryDetailGridView',
			selector : 'lmsInterestProfileEntryDetailGridViewType'

		}

	],
	config : {

	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function()
	{
		var me = this;

		me.control(
		{
			'lmsInterestProfileMainViewType' :
			{
				render : function( panel )
				{
				}
			},
			'lmsInterestProfileEntryViewType' :
			{
				render : function( panel )
				{

				},
				sellerIdSelect : function( combo, newValue, oldValue )
				{
					var entryForm = this.getLmsInterestProfileEntryView();
					entryForm.down( 'hidden[itemId="sellerId"]' ).setValue( combo.getValue() );
				},
				ccyCodeSelect : function( combo, newValue, oldValue )
				{
					var entryForm = this.getLmsInterestProfileEntryView();
					entryForm.down( 'hidden[itemId="ccyCode"]' ).setValue( combo.getValue() );
				}
			},
			'lmsInterestProfileMainViewType lmsInterestProfileEntryDtlToolBarViewType' :
			{
				addNewRow : function()
				{
					console.log('[IntrestProfileApplication] : Add Slab is clicked.');
					if( isUpdate )
						me.addNewRow();
				},
				deleteDetailAction : function( btn, opts )
				{
					console.log('[IntrestProfileApplication] : Delete Slab is clicked.');
					if( isUpdate )
					{
						var entryForm = this.getLmsInterestProfileEntryView();

						var slabType = entryForm.down('combobox[itemId="slabType"]').getValue();
				
						var detailGrid = me.getLmsInterestProfileEntryDetailGridView();
						/*
						 * First check whether there is any row having toAmt as zero.
						 * If yes then return
						 */

						var detailRecords = detailGrid.store.data.items;
						var isDeleted = false;
						
						if( slabType == "1" && detailRecords.length == 1 )
						{
							Ext.MessageBox.alert( getLabel('warning','Warning'),
									getLabel('warn.interestPrf.notDirectDelete','You can not delete the slab in case of Direct.'));
							console.log('[IntrestProfileApplication] : You can not delete the slab in case of Direct.');
							return;
						}//if
						
						for( var index = 0 ; index < detailRecords.length ; index++ )
						{
							isDeleted = detailRecords[ index ].data.isDeleted;
							if( isDeleted )
								break;
						}
						if( !isDeleted )
						{
							Ext.MessageBox.alert(getLabel('warning','Warning'),
									getLabel('warn.interestPrf.leastOneSblToDelete','Please select at least one slab to delete.'));
							console.log('[IntrestProfileApplication] : Please select at least one slab to delete.');
							return;
						}
						me.updateHeaderAction( btn, opts ,true);
					}						
				}
			},
			'lmsInterestProfileMainViewType lmsInterestProfileEntryToolBarViewType' :
			{
				render : function( panel )
				{

				}
			},
			'lmsInterestProfileMainViewType lmsInterestProfileEntryToolBarViewType button[itemId="btnSave"]' :
			{
				click : function(btn, opts)
				{
					console.log('[IntrestProfileApplication] : Save button is clicked.');
					if( !isUpdate )
					{
						me.saveHeaderAction();
					}//if
					else
					{
						me.updateHeaderAction(btn, opts, false);
					}		
				}
			},
			'lmsInterestProfileMainViewType lmsInterestProfileEntryToolBarViewType button[itemId="btnCancel"]' :
			{
				click : function()
				{
					console.log('[IntrestProfileApplication] : Cancel button is clicked.');
					//me.gotoHome();
					warnBeforeCancel( 'lmsInterestProfileMstList.srvc' );
				}
			},
			'lmsInterestProfileMainViewType lmsInterestProfileEntryToolBarViewType button[itemId="btnSubmit"]' :
			{
				click : function()
				{
					console.log('[IntrestProfileApplication] : Submit button is clicked.');
					me.doSubmit();
				}
			},
			'lmsInterestProfileEntryDetailGridViewType' :
			{
				render : function( panel )
				{
					
				},
				disableAddSlabButon : function( panel )
				{
				}
			}
		} );
	},
	saveHeaderAction : function( btn, opts )
	{
		var me = this;
		
		var form = document.forms[ "frmMain" ];

		var url = 'saveInterestProfileMst.srvc';
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$viewState', viewState ) );

		var entryForm = this.getLmsInterestProfileEntryView();

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', entryForm.down(
			'hidden[itemId="sellerId"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileCode', entryForm.down(
			'textfield[itemId="profileCode"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileDescription', entryForm.down(
			'textfield[itemId="profileDescription"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ccyCode', entryForm.down( 'hidden[itemId="ccyCode"]' )
			.getValue() ) );
		if( entryForm.down( 'radiofield[id="profileTypeBank"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'B' ) );
		}
		else if( entryForm.down( 'radiofield[id="profileTypeClient"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'C' ) );
		}

		if( entryForm.down( 'radiofield[id="interestTypeDebit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'D' ) );
		}
		else if( entryForm.down( 'radiofield[id="interestTypeCredit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'C' ) );
		}

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'slabType', entryForm.down(
			'combobox[itemId="slabType"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestBasis', entryForm.down(
			'textfield[itemId="interestBasis"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'strEffectiveDate', entryForm.down(
			'hidden[itemId="strEffectiveDate"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'specialEditStatus', entryForm.down(
			'hidden[itemId="specialEditStatus"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'specialEditRemarks', entryForm.down(
			'hidden[itemId="specialEditRemarks"]' ).getValue() ) );

		form.method = 'POST';
		form.action = url;
		form.submit();
	},
	updateHeaderAction : function( btn, opts, isDelete )
	{
		var me = this;
		var form = document.forms[ "frmMain" ];
		
		var url = 'updateInterestProfileMst.srvc';
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', viewState ) );

		var entryForm = this.getLmsInterestProfileEntryView();
		var detailGrid = this.getLmsInterestProfileEntryDetailGridView();
		var detailRecords = detailGrid.store.data.items;

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', entryForm.down(
			'hidden[itemId="sellerId"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileCode', entryForm.down(
			'textfield[itemId="profileCode"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileDescription', entryForm.down(
			'textfield[itemId="profileDescription"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ccyCode', entryForm.down( 'hidden[itemId="ccyCode"]' )
			.getValue() ) );
		if( entryForm.down( 'radiofield[id="profileTypeBank"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'B' ) );
		}
		else if( entryForm.down( 'radiofield[id="profileTypeClient"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'C' ) );
		}

		if( entryForm.down( 'radiofield[id="interestTypeDebit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'D' ) );
		}
		else if( entryForm.down( 'radiofield[id="interestTypeCredit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'C' ) );
		}

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'slabType', entryForm.down(
			'combobox[itemId="slabType"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestBasis', entryForm.down(
			'textfield[itemId="interestBasis"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'strEffectiveDate', entryForm.down(
			'hidden[itemId="strEffectiveDate"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'specialEditStatus', entryForm.down(
			'hidden[itemId="specialEditStatus"]' ).getValue() ) );

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'specialEditRemarks', entryForm.down(
			'hidden[itemId="specialEditRemarks"]' ).getValue() ) );

		for( var index = 0 ; index < detailRecords.length ; index++ )
		{
			var rateType;
			var computedRateType;
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
				'lmsInterestProfileDtlBeans[' + index + '].frmAmt', detailRecords[ index ].data.frmAmt ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index + '].toAmt',
				detailRecords[ index ].data.toAmt ) );

			rateType = detailRecords[ index ].data.rateType;
			computedRateType = rateType;
			if( null != rateType )
			{
				if( "Fixed" == rateType )
				{
					computedRateType = 'F';
				}
				else if( "Variable" == detailRecords[ index ].data.rateType )
				{
					computedRateType = 'V';
				}
			}
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
				+ '].rateType', computedRateType ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
				+ '].interestRate', detailRecords[ index ].data.interestRate ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
				+ '].baseRateCode', detailRecords[ index ].data.baseRateCode ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
					+ '].baseRateCodeDesc', detailRecords[ index ].data.baseRateCodeDesc ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
				'lmsInterestProfileDtlBeans[' + index + '].spread', detailRecords[ index ].data.spread ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
				+ '].viewState', detailRecords[ index ].data.viewState ) );

			if( isDelete )
			{
				if( detailRecords[ index ].data.isDeleted )
				{
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
						+ '].isDeleted', true ) );
				}//if row selected
				else
				{
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
						+ '].isDeleted', false ) );
				}//if row is not selected
			}//if Delete button is clicked
		}//for

		form.method = 'POST';
		form.action = url;
		form.submit();
	},
	doSubmit : function( btn, opts )
	{
		var hasErrors = false;
		if( !isUpdate )
			return;

		var me = this;
		var slabType;
		var form = document.forms[ "frmMain" ];
			
		var url = 'updateAndSubmitInterestProfileMst.srvc';
//		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
//		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$viewState', viewState ) );

		var entryForm = this.getLmsInterestProfileEntryView();
		var detailGrid = this.getLmsInterestProfileEntryDetailGridView();
		var detailRecords = detailGrid.store.data.items;

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', entryForm.down(
			'hidden[itemId="sellerId"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileCode', entryForm.down(
			'textfield[itemId="profileCode"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'profileDescription', entryForm.down(
			'textfield[itemId="profileDescription"]' ).getValue() ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ccyCode', entryForm.down( 'hidden[itemId="ccyCode"]' )
			.getValue() ) );
		if( entryForm.down( 'radiofield[id="profileTypeBank"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'B' ) );
		}
		else if( entryForm.down( 'radiofield[id="profileTypeClient"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', 'C' ) );
		}

		if( entryForm.down( 'radiofield[id="interestTypeDebit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'D' ) );
		}
		else if( entryForm.down( 'radiofield[id="interestTypeCredit"]' ).getValue() )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestType', 'C' ) );
		}
		
		slabType = entryForm.down('combobox[itemId="slabType"]' ).getValue();
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'slabType',  slabType));
		
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'interestBasis', entryForm.down(
			'textfield[itemId="interestBasis"]' ).getValue() ) );
		clearAndHideErrorDiv();
		createErrorDiv();
		if( detailRecords.length == 0 )
		{
			addErrorToDiv(getLabel('error.interestPrf.leastDetail','Please add at least one details before submit.'));
			hasErrors = true;
		}
		var hasInfiniteEndBoundry = false;
		var previousSlabFrmAmt = -1 ;
		var previousSlabToAmt = -1;
		var totalRecCount =  detailRecords.length;
		var lastRecIndex = totalRecCount -1;
		for( var index = 0 ; index < totalRecCount ; index++ )
		{
			var rateType;
			var computedRateType;
			var frmAmt = detailRecords[ index ].data.frmAmt;
			var toAmt = detailRecords[ index ].data.toAmt;
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
				'lmsInterestProfileDtlBeans[' + index + '].frmAmt', frmAmt ) );
			
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index + '].toAmt',
				 toAmt) );
			if( toAmt == 0 )
			{
				hasInfiniteEndBoundry = true;
			}
			
			if( index > 0 && index != lastRecIndex )
			{
				if( parseFloat(toAmt) < parseFloat(previousSlabFrmAmt) )
				{
					addErrorToDiv(getLabel('error.interestPrf.slabOverLap','Slabs are getting overlapped at ') + index + '!');
					hasErrors = true;
				}
			}

			rateType = detailRecords[ index ].data.rateType;
			computedRateType = rateType;
			if( !Ext.isEmpty(rateType) )
			{
				if( "Fixed" == rateType || "F" == rateType)
				{
					computedRateType = 'F';
					if( detailRecords[ index ].data.interestRate == null || detailRecords[ index ].data.interestRate == '')
					{
						addErrorToDiv(getLabel('error.interestPrf.reqInterestRate','Rate of Interest is required for Slab record ') + index + '!');
						hasErrors = true;
					}
					else
					{
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
							+ '].interestRate', detailRecords[ index ].data.interestRate ) );						
					}
				}
				else if( "Variable" == rateType || "V" == rateType)
				{
					computedRateType = 'V';
					if( detailRecords[ index ].data.baseRateCode == null || detailRecords[ index ].data.baseRateCode == '')
					{
						addErrorToDiv(getLabel('error.interestPrf.reqBenchmarkRate','Benchmark Rate is required for Slab record ') + index + '!');
						hasErrors = true;
					}
					else
					{
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
							+ '].baseRateCode', detailRecords[ index ].data.baseRateCode ) );	
					}
					if( Ext.isEmpty(detailRecords[ index ].data.spread) )
					{
						addErrorToDiv(getLabel('error.interestPrf.reqSpread','Spread is required for Slab record ') + index + '!');
						hasErrors = true;
					}
					else
					{
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
							'lmsInterestProfileDtlBeans[' + index + '].spread', detailRecords[ index ].data.spread ) );
					}
				}
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
					+ '].rateType', computedRateType ) );
			}
			else
			{
				addErrorToDiv(getLabel('error.interestPrf.reqRateType','Rate Type is required for Slab record ') + index + '!');
				hasErrors = true;
			}
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'lmsInterestProfileDtlBeans[' + index
				+ '].viewState', detailRecords[ index ].data.viewState ) );

			previousSlabFrmAmt = frmAmt;
			previousSlabToAmt = toAmt;
			
		}//for
		if( slabType != "1" &&  !hasInfiniteEndBoundry)// It is not Direct
		{
			addErrorToDiv(getLabel('error.interestPrf.leastToAmtInfinite','There should be at least one slab with \"To Amount\" as infinite(0)'));				
			hasErrors = true;
		}
		
		closeErrorDiv();
		if( hasErrors )
		{
			showErrorDiv();
			return;	
		}else{
			clearAndHideErrorDiv();
		}
		
		
		form.method = 'POST';
		form.action = url;
		form.submit();

	},
	gotoHome : function( btn, opts )
	{
		var me = this;
		var form = document.forms[ "frmMain" ];
		form.action = 'lmsInterestProfileMstList.srvc';
		form.target = "";
		form.method = "POST";
		form.submit();
	},
	createFormField : function( element, type, name, value )
	{ 
		var form = document.getElementById('frmMain');
		var formElements = form.elements;
		var inputField;

		if( null != formElements )
		{
			inputField = formElements.namedItem(name);
			if( null != inputField )
			{
				inputField.parentNode.removeChild(inputField);
			}
		}
		inputField = document.createElement( element );
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;			
				
		return inputField;
	},
	addNewRow : function()
	{
		var me = this;
		var detailGrid = me.getLmsInterestProfileEntryDetailGridView();
		/*
		 * First check whether there is any row having toAmt as zero.
		 * If yes then return
		 */

		var detailRecords = detailGrid.store.data.items;
		
		var tamountFrom = 0 ;
		var tamountto = null;
		
		if( detailRecords.length > 0 )
		{
			tamountFrom = detailRecords[detailRecords.length - 1].data.toAmt;
		}
		var entryForm = this.getLmsInterestProfileEntryView();

		var slabType = entryForm.down( 'combobox[itemId="slabType"]' );
		
		if( slabType.getValue() == "1" )
		{
			if( detailRecords.length >= 1 )
			{
				Ext.MessageBox.alert( getLabel('warning','Warning'),
						getLabel('warn.interestPrf.restrictDirectCase','In case of direct,there can be only one slab.'));
				console.log('[IntrestProfileApplication] : In case of direct,there can be only one slab.');
				return;
			}//if
			else
			{
				tamountto = 0;		
			}		
		}//if
		else
		{
			tamountto = 0;
		}
		
		for( var index = 0 ; index < detailRecords.length ; index++ )
		{
			if( 0 == detailRecords[ index ].data.toAmt )
			{
				Ext.MessageBox.alert(  getLabel('warning','Warning'),
						getLabel('warn.interestPrf.editInfiniteBoundry','There are slab\'s with \"To Amount\" as zero(infinite).' +
				'Can not add any more slabs. Please edit the slab with infinite boundry first.'));
				console.log('[IntrestProfileApplication] : There are slab\'s with \"To Amount\" as zero(infinite).' +
					'Can not add any more slabs. Please edit the slab with infinite boundry first.');
				return;
			}
		}
		
		var r = Ext.ModelManager.create(
		{
			frmAmt : tamountFrom,
			toAmt : tamountto,
			rateType : null,
			fixedRate : 0,
			benchMarkRate : 0,
			spread : 0
		}, detailGrid.store.model.getName() );
		detailGrid.store.insert( detailRecords.length, r );
		$('#dirtyBit').val('1');
		//cellEditing.startEditByPosition({row: detailRecords.length - 1, column: 2});			
	}
} );
function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
			/*buttons : {
				"Yes" : function() {
					var frm = document.forms["frmMain"];
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
				},
				"No" : function() {
					$(this).dialog("close");
				}
			}*/
		});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
		});
		$('#textContent').focus();
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}