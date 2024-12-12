widgetMetaData.invoiceList = function(widgetId, widgetType)
{
    var metadata = {
          "title": getDashLabel('invoices.title','Receivables-Quick Book'),
          "desc": getDashLabel('invoices.desc','Receivables-Quick Book'),
          "type": "datatable",
          "subType": "", 
          "url": rootUrl+"/services/invoiceCenterList/SELLER.json?$filter=EntryDate eq date'"+new Date().toISOString().slice(0, 10)+"'",
          "requestMethod":"POST",
          "responseRoot":"d.invoice",  
          "rootData" : "d",
          "sortMethod" : 'group',
          "widgetType" : widgetType,
          "cloneMaxCount": 4,
          "maxRecords": 10,
          "fields": {
            "columns": [
                {
                    "fieldName": "subsidiaryDesc", 
                    "label": getDashLabel('fsc.subsidiaryDesc','Company Name'),
                    "type": "text"
                  },
                {
                      "fieldName": "clientMode", 
                      "label": getDashLabel('fsc.clientMode','Client Mode'),
                      "type": "text"
                 },
                {
                        "fieldName": "buyerSellerDesc", 
                        "label": getDashLabel('fsc.buyerSellerDesc','Buyer Seller Desc'),
                        "type": "text"     
                 },
              {
                "fieldName": "invoiceNumber", 
                "label": getDashLabel('fsc.invoiceNumber','Invoice Number'),
                "type": "text"
              },
              {
                    "fieldName": "invoiceDueDate",
                    "label": getDashLabel('fsc.dueDate','Invoice Due Date'),
                    "type": "text",
                    "group" : true
              },
              
              {
                    "fieldName": "invoiceAmount",
                    "label": getDashLabel('fsc.invoiceAmount','Invoice Amount'),
                    "type": "amount",                    
                    "render": function (data, type, row) {
                          return row.currencySymbol +" "+ data;       
                  } 
              }                 
            ],
            "rows":{}   
          },  
         "actions":{
              'custom' : {
                  'title' : getDashLabel('datatable.connectToQB','Connect To QuickBooks'),
                  'callbacks' : {
                      'click' : function(metaData){
                          var win;
                          var checkConnect;
                          var parameters = "location=1,width=550, height=400";
                          parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
                          var redirecturl= rootUrl+'/services/connectToQuickbooks';
                          // Launch Popup   
                          win = window.open("https://appcenter.intuit.com/connect/oauth2?client_id=AB2huOd1y1ncvKew2tsSMfe8kQ3Sf5U2t3bAcPcVsIY1B5Ledx&response_type=code&scope=com.intuit.quickbooks.accounting&redirect_uri="+redirecturl+"&state=1123",
                                          'connectPopup', parameters);
                      }
                  }
              }
          }
        }   
    return metadata;
}