var fieldJson = [];
Ext.define('CPON.view.LiquidityProductChangePopup', {
			extend : 'Ext.window.Window',
			xtype : 'liquidityProductChangePopup',
			width : 495,
			minHeight : 156,
			closeAction:'hide',
			maxHeight : 500,
			cls : 'non-xn-popup',
			modal : true,
			draggable : false,
			resizable : true,
			autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				isAllSelected : null
			},
			listeners : {
				resize : function(){
					this.center();
				},
				'close':function(win){
					$('#sweepProductTypeId').val(origLiquidityProductId);
					copyProductTypeDetails($('#sweepProductTypeId'), strProdType);
				}
			},
			 initComponent : function() {
			 
				var me = this;
				this.title = me.title;


				this.items = [{
							xtype : 'panel',
							cls : 'ft-padding-bottom',
							items : [{
								layout : {
									type : 'vbox'
								},
								items : [{
									xtype : 'container',
									layout : {
										type : 'hbox'
									},
									items : [{
										xtype : 'label',
										html : getLabel('agreementDisable', 'All the ‘Active’, ‘Modified’ & ‘Modified Submitted’ Agreements will be Suspended Automatically along with their corresponding Schedules and Inter Account Parameters. All such suspended agreements can be enabled manually only if the agreements comply with new product features. Please correct all agreements manually as per new product features before clicking Continue. <br/><br/>All the agreements in remaining status will be moved back to status ‘New’.'),
										width : '440px',
										height: 'auto'
									}]
								}]
							}]
						}
				]; 
				 
			if(viewmode === 'VIEW' ){	
				this.bbar = ['->',{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),							
							handler : function() {
								me.close();
								$('#sweepProductTypeId').val(origLiquidityProductId);
								copyProductTypeDetails($('#sweepProductTypeId'), strProdType);
							}
						}];
			}else{
				this.bbar = [{
							xtype : 'button',					
							text : getLabel('autodisable', 'Continue'),							
							handler : function() {
								me.hide();								
							}
						},'->',{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),							
							handler : function() {
								me.close();
								$('#sweepProductTypeId').val(origLiquidityProductId);
								copyProductTypeDetails($('#sweepProductTypeId'), strProdType);
							}
						},'->',{
							xtype : 'button',
							text : getLabel('download', 'Download Report'),							
							handler : function() {
								me.downloadReport();
							}
						}];
			}
				this.callParent(arguments);
			},

		downloadReport : function() {
			
		var form = document.createElement('FORM');
		var strUrl = 'services/clientServiceSetup/LMSProductChangeReport' + '?&$oldProd=' + strOldProd + '&$prodType=' + strProdType + '&$clientId=' + clientId ;
		
		
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';		
		form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
			
		});