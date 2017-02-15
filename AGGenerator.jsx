var fileFolder = File($.fileName).parent;
var Main = fileFolder + "/AGFiles Only/Main.jsx";
var updater = fileFolder + "/AGFiles Only/Updater.jsx";
var coreFolder = fileFolder + "/AGFiles Only/CoreFiles/";
var psd_files = fileFolder + "/AGFiles Only/psd_files/";
var temp_files = fileFolder + "/AGFiles Only/temp/";

var toJson = File(coreFolder + "json.jsx");
$.evalFile (toJson);

var statusScripts = true;

$.evalFile(updater);

var up = new Update();
var statusScripts = up.result;

if(statusScripts){
    $.evalFile(Main);
}
