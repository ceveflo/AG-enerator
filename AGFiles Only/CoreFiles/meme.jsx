function MemeImage(){

    var templateName;
    var files = projectObject.fileNumber;
    var type = templateTypes[projectObject.type];    
    var text_desc = projectObject.text.description;
    var text_top = projectObject.text.top;
    var text_bottom = projectObject.text.bottom;
    var text_tag = projectObject.text.tag;
    var kind = projectObject.imageType;
    
    var template = getTemplate();       
   
    var _projectFolder = projects + "/[AG-Project]" + projectObject.ProjectName + "/";    
    
    verifyExistingImage();    
    
    openPSDTemplate(true,false,template);
    
    //$.writeln(_projectFolder);
    
    try{
        savePSD(true,false,(_projectFolder+projectObject.ProjectName+" ("+template+")"));
    }catch(_){
        //$.writeln('No se pudo generar el nuevo PSD');
    }

    selectLayer(true,false,'WorkingArea');

    function EditWorkingArea (){        
        try{
            updateImage();
        }catch(_){
            alert("No se pudo colocar la imagen");
        }
        if(text_top.enable){
            updateText(text_top,"Top_Text");
        }else{
            selectLayer(true,false,"Top_Text");
            hideLayers();
        }
    
        if(text_bottom.enable){
            updateText(text_bottom,"Bottom_Text");
        }else{
            selectLayer(true,false,"Bottom_Text");
            hideLayers();
        }
    
        selectLayer(true,false,"backgroundColor");
        var mainBg = projectObject.colors.background;
        changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});
        
        addExifData();        
        saveFinalPNG(true,false,projectObject.ProjectName);
        saveObject();        
        closeDocument();
        _projectFolder = new Folder(_projectFolder);
        _projectFolder.execute()        
        
    }
    
    function getTemplate(){
         var text = "";
         templateName = type + text;
         return templateName;
    }

    function updateImage(){
            $.evalFile (setSizes);
            selectLayer(true,false,"WorkingAreaImg");
                openSmartObject();
                selectLayer(true,false,"imagePlaceHolder");
                placeObject(true,false, _projectFolder+"/images/"+projectObject.files[0]);
                renameLayer();
                FitLayerToCanvas(true,true);
                selectSolidArea(true,false,"imagePlaceHolder");
                
                try{
                    selectLayer(true,false,"oimage");
                    alignToZone(true,false,'CenterH');;
                }catch(e){
                    //$.writeln("No se pudo centrar: ", e)                
                 }
                
            saveObject();
            updateSmartObject();
            closeObject();
    }

    function updateText(obj,layer){        
        selectLayer(true,false,layer);
        showLayer();
        openSmartObject();
        selectLayer(true,false,"background_Text");
        var textTochange = app.activeDocument.activeLayer; 

        textTochange.textItem.contents = obj.text;        
              
        var txt_color = projectObject.colors.text;
        changeColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)})
        
        selectLayer(true,false,"background_shape");
        var bg_color = projectObject.colors.mask;
        changeSolidColor(true,false,{'r': (bg_color[0] * 255), 'g': (bg_color[1] * 255), 'b': (bg_color[2] * 255)});
        app.refresh();        
        changeOpacity('background_shape');
    
        saveObject();
        updateSmartObject();
        closeObject();
    }

    function verifyExistingImage(){
        var filePath = _projectFolder + projectObject.ProjectName + ".png";
        var file = new File(filePath);
        if ( file.exists ) {
            var doc = app.open(file);
            var info = app.activeDocument.info;
            saveFinalPNG(true,false,projectObject.ProjectName + "-" + info.caption);
            closeObject();
        }        
    }

    EditWorkingArea();    

}