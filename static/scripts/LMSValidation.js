
var time_millis=150;
if(jsScreenType=="LS20")
{

setTimeout(function(){LS20_ProductSubType()},time_millis);
setTimeout(function(){LS20_SweepBack()},time_millis);
setTimeout(function(){LS20_TargetBalType()},time_millis);
}


if(jsScreenType=="LS24")
{
setTimeout(function(){LS24_Posting_Date()},time_millis);

}

function LS20_ProductSubType()
{

if(document.getElementById("ent_50000941").value=='Z')
{

document.saveBranch.ent_50000943[0].checked=true;
if(document.saveBranch.ent_50000943[0].checked)
{
document.saveBranch.ent_50000943[1].disabled=true;
document.saveBranch.ent_50000943[1].className='field-static';
}
if(document.saveBranch.ent_50000943[1].checked)
{
document.saveBranch.ent_50000943[0].disabled=true;
document.saveBranch.ent_50000943[0].className='field-static';
}
document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=true;
document.saveBranch.ent_50000903.className='field-static';
if(document.saveBranch.ent_50000902[0].checked)
{
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[1].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[1].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[2].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[1].className='field-static';
}

document.saveBranch.ent_50000931.readOnly=true;
document.saveBranch.ent_50000931.className='field-static';
document.saveBranch.ent_50000928.readOnly=true;
document.saveBranch.ent_50000928.className='field-static';
document.saveBranch.ent_50000899.readOnly=true;
document.saveBranch.ent_50000899.className='field-static';
}
else if(document.getElementById("ent_50000941").value=='R')
{
document.saveBranch.ent_50000943[1].checked=true;
if(document.saveBranch.ent_50000943[0].checked)
{
document.saveBranch.ent_50000943[1].disabled=true;
document.saveBranch.ent_50000943[1].className='field-static';
}
if(document.saveBranch.ent_50000943[1].checked)
{
document.saveBranch.ent_50000943[0].disabled=true;
document.saveBranch.ent_50000943[0].className='field-static';
}
document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=true;
document.saveBranch.ent_50000903.className='field-static';
if(document.saveBranch.ent_50000902[0].checked)
{
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[1].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[1].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[2].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[1].className='field-static';
}
document.saveBranch.ent_50000931.readOnly=true;
document.saveBranch.ent_50000931.className='field-static';
document.saveBranch.ent_50000928.readOnly=false;
document.saveBranch.ent_50000928.className='originalvalue';
document.saveBranch.ent_50000899.readOnly=false;
document.saveBranch.ent_50000899.className='originalvalue';
}
else if(document.getElementById("ent_50000941").value=='T' )
{
document.saveBranch.ent_50000943[0].disabled=false;
document.saveBranch.ent_50000943[0].className='originalvalue';
document.saveBranch.ent_50000943[1].disabled=false;
document.saveBranch.ent_50000943[1].className='originalvalue';

document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000900.readOnly=false;
document.saveBranch.ent_50000900.className='originalvalue';
document.saveBranch.ent_50000903.readOnly=false;
document.saveBranch.ent_50000903.className='originalvalue';

document.saveBranch.ent_50000902[0].disabled=false;
document.saveBranch.ent_50000902[0].className='originalvalue';
document.saveBranch.ent_50000902[1].disabled=false;
document.saveBranch.ent_50000902[2].disabled=false;
document.saveBranch.ent_50000902[1].className='originalvalue';
document.saveBranch.ent_50000902[2].className='originalvalue';

document.saveBranch.ent_50000931.readOnly=false;
document.saveBranch.ent_50000931.className='originalvalue';

document.saveBranch.ent_50000928.readOnly=true;
document.saveBranch.ent_50000928.className='field-static';
document.saveBranch.ent_50000899.readOnly=true;
document.saveBranch.ent_50000899.className='field-static';


}

}

function LS20_TargetBalType()
{
if(document.saveBranch.ent_50000943[0].checked)
{

document.saveBranch.ent_50000900.readOnly=false;
document.saveBranch.ent_50000900.className='originalvalue';
document.saveBranch.ent_50000903.readOnly=true;
document.saveBranch.ent_50000903.className='field-static';
document.saveBranch.ent_50000931.value=1;
document.saveBranch.ent_50000931.readOnly=true;
document.saveBranch.ent_50000931.className='field-static';
document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000903.value=0.0;
document.saveBranch.ent_50000902[0].checked;
}
else
{

document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=false;
document.saveBranch.ent_50000903.className='originalvalue';
document.saveBranch.ent_50000931.readOnly=false;
document.saveBranch.ent_50000931.className='originalvalue';
document.saveBranch.ent_50000931.value=1;
document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000902[0].checked;
}


}








/*function LS20_ProductSubType()
{

if(document.getElementById("ent_50000941").value=='Z' )
{

document.saveBranch.ent_50000943[0].checked=true;
if(document.saveBranch.ent_50000942[0].checked)
{
document.saveBranch.ent_50000942[1].disabled=true;
document.saveBranch.ent_50000942[1].className='field-static';
}
if(document.saveBranch.ent_50000942[1].checked)
{
document.saveBranch.ent_50000942[0].disabled=true;
document.saveBranch.ent_50000942[0].className='field-static';
}
if(document.saveBranch.ent_50000943[0].checked)
{
document.saveBranch.ent_50000943[1].disabled=true;
document.saveBranch.ent_50000943[1].className='field-static';
}
if(document.saveBranch.ent_50000943[1].checked)
{
document.saveBranch.ent_50000943[0].disabled=true;
document.saveBranch.ent_50000943[0].className='field-static';
}
document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=true;
document.saveBranch.ent_50000903.className='field-static';
if(document.saveBranch.ent_50000902[0].checked)
{
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[1].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[1].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.saveBranch.ent_50000902[2].checked)
{
document.saveBranch.ent_50000902[0].disabled=true;
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[0].className='field-static';
document.saveBranch.ent_50000902[1].className='field-static';
}

document.saveBranch.ent_50000931.readOnly=true;
document.saveBranch.ent_50000931.className='field-static';
document.saveBranch.ent_50000928.readOnly=true;
document.saveBranch.ent_50000928.className='field-static';
document.saveBranch.ent_50000899.readOnly=true;
document.saveBranch.ent_50000899.className='field-static';
}
else if(document.getElementById("ent_50000941").value=='R')
{
document.saveBranch.ent_50000943[1].checked=true;
if(document.saveBranch.ent_50000942[0].checked)
{
document.saveBranch.ent_50000942[1].disabled=true;
document.saveBranch.ent_50000942[1].className='field-static';
}
if(document.saveBranch.ent_50000942[1].checked)
{
document.saveBranch.ent_50000942[0].disabled=true;
document.saveBranch.ent_50000942[0].className='field-static';
}
if(document.saveBranch.ent_50000943[0].checked)
{
document.saveBranch.ent_50000943[1].disabled=true;
document.saveBranch.ent_50000943[1].className='field-static';
}
if(document.saveBranch.ent_50000943[1].checked)
{
document.saveBranch.ent_50000943[0].disabled=true;
document.saveBranch.ent_50000943[0].className='field-static';
}
document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=true;
document.saveBranch.ent_50000903.className='field-static';
if(document.saveBranch.ent_50000902[0].checked)
{
document.saveBranch.ent_50000902[1].disabled=true;
document.saveBranch.ent_50000902[2].disabled=true;
document.saveBranch.ent_50000902[1].className='field-static';
document.saveBranch.ent_50000902[2].className='field-static';
}
if(document.getElementById("ent_50000941").value=='T')
{
if(document.saveBranch.ent_50000943[0].checked)
{
document.saveBranch.ent_50000943[0].disabled=false;
document.saveBranch.ent_50000943[0].className='originalvalue';
document.saveBranch.ent_50000943[1].disabled=false;
document.saveBranch.ent_50000943[1].className='originalvalue';

}
if(document.saveBranch.ent_50000943[1].checked)
{
document.saveBranch.ent_50000943[0].disabled=false;
document.saveBranch.ent_50000943[0].className='originalvalue';
document.saveBranch.ent_50000943[1].disabled=false;
document.saveBranch.ent_50000943[1].className='originalvalue';
}
document.saveBranch.ent_50000900.value=0.0;
document.saveBranch.ent_50000900.readOnly=true;
document.saveBranch.ent_50000900.className='field-static';
document.saveBranch.ent_50000903.readOnly=false;
document.saveBranch.ent_50000903.className='originalvalue';

if(document.saveBranch.ent_50000902[0].checked)
{
document.saveBranch.ent_50000902[0].disabled=false;
document.saveBranch.ent_50000902[0].className='originalvalue';
document.saveBranch.ent_50000902[1].disabled=false;
document.saveBranch.ent_50000902[2].disabled=false;
document.saveBranch.ent_50000902[1].className='originalvalue';
document.saveBranch.ent_50000902[2].className='originalvalue';
}
if(document.saveBranch.ent_50000902[1].checked)
{
document.saveBranch.ent_50000902[0].disabled=false;
document.saveBranch.ent_50000902[0].className='originalvalue';
document.saveBranch.ent_50000902[1].disabled=false;
document.saveBranch.ent_50000902[2].disabled=false;
document.saveBranch.ent_50000902[1].className='originalvalue';
document.saveBranch.ent_50000902[2].className='originalvalue';
}
if(document.saveBranch.ent_50000902[2].checked)
{
document.saveBranch.ent_50000902[0].disabled=false;
document.saveBranch.ent_50000902[0].className='originalvalue';
document.saveBranch.ent_50000902[1].disabled=false;
document.saveBranch.ent_50000902[2].disabled=false;
document.saveBranch.ent_50000902[1].className='originalvalue';
document.saveBranch.ent_50000902[2].className='originalvalue';
}
document.saveBranch.ent_50000931.readOnly=false;
document.saveBranch.ent_50000931.className='originalvalue';
}
time_millis=-1;
}*/




function LS24_Posting_Date()
{
itemChange(document.getElementById("ent_50000833"),''+jsScreenType);
time_millis=-1;
}



















function LS20_SweepBack()
{
if(document.saveBranch.ent_50000944[0].checked)
{
document.saveBranch.ent_50000945[0].disabled=false;
document.saveBranch.ent_50000945[1].disabled=false;
document.saveBranch.ent_50000945[2].disabled=false;
document.saveBranch.ent_50000945[0].className='originalvalue';
document.saveBranch.ent_50000945[1].className='originalvalue';
document.saveBranch.ent_50000945[2].className='originalvalue';
document.saveBranch.ent_50000945[0].checked=true;
document.saveBranch.ent_50000946.value=0;
document.saveBranch.ent_50000949.value=1;
document.saveBranch.ent_50000949.readOnly=false;
document.saveBranch.ent_50000949.className='originalvalue';
}
else
{
document.saveBranch.ent_50000945[0].disabled=true;
document.saveBranch.ent_50000945[1].disabled=true;
document.saveBranch.ent_50000945[2].disabled=true;
document.saveBranch.ent_50000945[0].className='field-static';
document.saveBranch.ent_50000945[1].className='field-static';
document.saveBranch.ent_50000945[2].className='field-static';
document.saveBranch.ent_50000946.readOnly=true;
document.saveBranch.ent_50000946.className='field-static';
document.saveBranch.ent_50000949.readOnly=true;
document.saveBranch.ent_50000949.className='field-static';
}

time_millis=-1;
}








