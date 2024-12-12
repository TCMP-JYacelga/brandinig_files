Ext.define('Cashweb.controller.BroadcastController', {
			extend : 'Ext.app.Controller',
			xtype : 'broadcastController',
			views : ['portlet.BroadcastPortlet'],
			stores : ['BroadcastStore'],
			models : ['BroadcastModel'],
			mask : null,
			refs : [{
						ref : 'broadcastPortlet',
						selector : 'broadcast'
					}],

			init : function() {
				this.control({
							'broadcast' : {
								'navigateToBroadCast' : this.navigateToBroadCast
							}
						});
			},
			navigateToBroadCast : function(strFilter, filterJson) {
				var me = this;
				var strUrl = 'clientBroadcastMessageMstList.form';
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterJson', JSON.stringify(filterJson)));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokVal));
				}
				frm.action = strUrl;
				frm.name = 'frmMain';
				frm.id = 'frmMain';
				frm.method = "POST";
				document.body.appendChild(frm);
				frm.submit();
				document.body.removeChild(frm);
			},
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			}
		});
		
		function downloadView(htmlUrl, artifectId, bIsDynamicHtmlFlow) {
			if(bIsDynamicHtmlFlow){
				Ext.Ajax.request({
				url : 'downloadHtmlFile.srvc?'+csrfTokenName + '=' + csrfTokenValue + '&$brodcastId='+ artifectId,
				method : 'POST',
				contentType: 'text/html',
				success : function(response) {
					htmlContent = response.responseText;
					downloadBroadcastMessage(htmlContent);
				}});
			}else{
				downloadBroadcastMessage2(htmlUrl);
			}
		}
		
		function showMsgPopup(popupTitle, txtId) {
			popupTitle = popupTitle.replace(/>/g, "&gt;").replace(/</g, "&lt;");
			var msgPopup = Ext.create('Cashweb.view.portlet.BroadcastDetailsPopup', {
				title: Ext.util.Format.ellipsis(popupTitle, 33),
				minHeight: 200,
				autoHeight: true,
				titleTooltip: popupTitle,
				width: 500,
				resizable: false,
				draggable: false,
				autoOpen : false,
				modal : true,
			    recordDtl: ($('#'+txtId).val()).replace(/>/g, "&gt;").replace(/</g, "&lt;")
			});
			msgPopup.show();	
			Ext.getCmp('okButton').focus();
		}