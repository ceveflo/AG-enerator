var fileFolder = File($.fileName).parent;
var Main = fileFolder + "/AGFiles Only/Main.jsx";
var updater = fileFolder + "/AGFiles Only/Updater.jsx";
var statusScripts = true;

$.evalFile(updater);

var statusScripts = findUpdate();

if(statusScripts){
    $.evalFile(Main);
}
