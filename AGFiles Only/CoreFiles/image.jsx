function NormalImage(){
    
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
    
    $.writeln(_projectFolder);
    
    try{
        savePSD(true,false,(_projectFolder+projectObject.ProjectName+" ("+template+")"));
    }catch(_){
        $.writeln('No se pudo generar el nuevo PSD');
    }
    
    selectLayer(true,false,'WorkingArea');

    function EditWorkingArea (){        
        try{
            updateImage();
        }catch(_){
            alert("No se pudo colocar la imagen");
        }
      
        if(text_desc.enable || text_top.enable){
            updateText({},"MainText",true,true);
            SetSelectionArea(true,false,"AreaImage");
            selectLayer(true,false,"MainText");
            alignToZone(true,false,'Bottom');
            alignToZone(true,false,'Right');
            moveLayers(true,false,{x: -10, y: -60});
        }else{
            selectLayer(true,false,"MainText");
            hideLayers();
         }
            
        if(text_bottom.enable){
            updateText(text_bottom,"BottomText");
        }else{
            selectLayer(true,false,"BottomText");
            hideLayers();
        }
        if(text_tag.enable == true){
            updateTAG(text_tag);
        }        
        
        selectLayer(true,false,"backgroundColor");
        var mainBg = projectObject.colors.background;
        changeSolidColor(true,false, {'r': (mainBg[0] * 255), 'g': (mainBg[1] * 255), 'b': (mainBg[2] * 255)});

        
        selectLayer(true,false,"AreaImage");
        addFillOpacity(true,false,0);
        saveFinalPNG(true,false,"[VideoMask]"+projectObject.ProjectName);
                
        addFillOpacity(true,false,100);
        addExifData();
        saveFinalPNG(true,false,projectObject.ProjectName);
        saveObject();        
        closeDocument();
        _projectFolder = new Folder(_projectFolder);
        _projectFolder.execute()
    
    }

    function updateImage(){
        $.evalFile (setSizes);
        selectLayer(true,false,"AreaImage");
        openSmartObject();
        selectLayer(true,false,"ImagePlacer");
            openSmartObject();
            selectLayer(true,false,"imagePlaceholder");        
            placeObject(true,false, _projectFolder+"/images/"+projectObject.files[0]);
            renameLayer();
            FitLayerToCanvas(true,true);
            makeHue();
            addHue();
            clipMask();
            SetSelectionArea(true,false,"Selector");
            selectLayer(true,false,"oimage");
            alignToZone(true,false,'CenterH');
            nullSelection();
            selectLayer(true,false,"Selector");
            hideLayers();
            saveObject();
            updateSmartObject();
            closeObject();
        selectLayer(true,false,"ImagePlacer_blured");
        addBlur(true,false,25);
        saveObject();
        updateSmartObject();
        closeObject();
    }
    function updateTAG(obj){
        selectLayer(true,false,"TAG") //text_tag 
        openSmartObject();
        
        selectLayer(true,false,"TagText");
        var textTochange = app.activeDocument.activeLayer; 
        var tagTxt = getTag(obj);
        textTochange.textItem.contents = tagTxt;
        var tagBG = projectObject.colors["tag-text"];
        changeColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        selectLayer(true,false,"TAG");
        var tagBG = projectObject.colors["tag-icon"];
        changeSolidColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        selectLayer(true,false,"TAG-BG");
        var tagBG = projectObject.colors["tag-bg"];        
        changeSolidColor(true,false, {'r': (tagBG[0] * 255), 'g': (tagBG[1] * 255), 'b': (tagBG[2] * 255)});
        
        saveObject();
        updateSmartObject();
        closeObject();
    }

    function getTag(obj){
        var txt ="";        
        if(obj.text == txt){
            txt = tagTypes[obj.index];
        }else{
            txt = obj.text;
        }        
        return txt;
    }

    function updateText(obj,layer,changeSize,deep){
        selectLayer(true,false,layer);
        showLayer();
        openSmartObject();           
        
        if(deep != undefined && deep){
            if(text_top.enable && !text_desc.enable){
                selectLayer(true,false,"TextArea-T");
                showLayer();
                openSmartObject();
                    selectLayer(true,false,"TextAreaTitle");
                    changeText(text_top);
                    app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen("TextAreaTitle","Titulo");
            }else if(!text_top.enable && text_desc.enable){
                selectLayer(true,false,"TextArea-D");
                showLayer();
                openSmartObject();                    
                    selectLayer(true,false,"TextAreaDesc");
                    changeText(text_desc);
                    app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen("TextAreaDesc","Descripcion");
            }else{
                 selectLayer(true,false,"TextArea-TD");
                 showLayer();
                 openSmartObject();
                     selectLayer(true,false,"TextAreaTitle");
                     changeText(text_top);
                     app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen("TextAreaTitle","Titulo");
                     selectLayer(true,false,"TextAreaDesc");
                     changeText(text_desc);
                     app.refresh();
                    if(changeSize != undefined && changeSize)
                        fontChangerScreen("TextAreaDesc","Descripcion");
            }
                saveObject();
                updateSmartObject();
                closeObject();
            selectLayer(true,false,"TextColor");
            var txt_color = projectObject.colors.text;
            changeSolidColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)});
            trim();
            resizeCanvas(25);                        
            selectLayer(true,false,"placeHolder");
            showLayer();
            var mask_color = projectObject.colors.mask;
            changeSolidColor(true,false, {'r': (mask_color[0] * 255), 'g': (mask_color[1] * 255), 'b': (mask_color[2] * 255)});            
            app.refresh();
            changeOpacity('placeHolder');
        }else{
            selectLayer(true,false,"TextArea");
            changeText(obj);
            if(changeSize != undefined && changeSize)
                fontChangerScreen("TextArea","");
            var txt_color = projectObject.colors.text;
            changeColor(true,false, {'r': (txt_color[0] * 255), 'g': (txt_color[1] * 255), 'b': (txt_color[2] * 255)});
        }        

        saveObject();
        updateSmartObject();
        closeObject();
        
    }   

    function changeText(obj){
        var textTochange = app.activeDocument.activeLayer; 
        textTochange.textItem.contents = obj.text;
    }

    function getTemplate(){
         var text = "";
         if(kind != "Normal"){
             text += kind;
         }
         if(text_tag.enable != true){
             text += "-noTag";
         }         
         templateName = type + text;
         return templateName;
    }

    function resizeCanvas(newValue){        
        var doc = app.activeDocument; 
        var defaultRulerUnits = app.preferences.rulerUnits;  
        app.preferences.rulerUnits = Units.PIXELS;  
          
        var d_width = parseInt(doc.width.as('px'));
        var d_height =parseInt(doc.height.as('px'));
        
        var value = {width: (d_width + newValue), height: (d_height + newValue)}
        
        changeCanvasSize(true,false,{width:value.width, height:value.height});
        
        app.preferences.rulerUnits = defaultRulerUnits;          
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