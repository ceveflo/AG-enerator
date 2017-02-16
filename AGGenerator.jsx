var fileFolder = File($.fileName).parent;
var Main = fileFolder + "/AGFiles Only/Main.jsx";
var updater = fileFolder + "/AGFiles Only/Updater.jsx";
var coreFolder = fileFolder + "/AGFiles Only/CoreFiles/";
var psd_files = fileFolder + "/AGFiles Only/psd_files/";
var temp_files = fileFolder + "/AGFiles Only/temp/";

var toJson = File(coreFolder + "json.jsx");
var writelog = File(coreFolder + "eventLog.jsx");
$.evalFile (toJson);
$.evalFile (writelog);

var AGlog = new writeLog (fileFolder+ "/AGFiles Only", "Generator");
AGlog.createEvent('Update: Buscando actualizaciones');
var statusScripts = true;

$.evalFile(updater);

var up = new Update();
var statusScripts = up.result;

if(statusScripts){
    AGlog.createEvent('Update [Result]: Generador actualizado');
    $.evalFile(Main);
}